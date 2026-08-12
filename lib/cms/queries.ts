import { getCms } from '@/lib/cms/client'

import type { ChannelKey } from '@/lib/channels'
import type { Issue, Story } from '@/payload-types'
import type { Where } from 'payload'

/**
 * Reader-facing queries.
 *
 * Every function here fails soft: a database that is unreachable, unmigrated,
 * or simply empty returns an empty result rather than throwing. The reason is
 * that these run inside server components during `next build`, and a hard
 * failure would turn "no content yet" into a broken build.
 *
 * Depth is set explicitly on each query rather than left to the default. Payload
 * populates relationships recursively, and on a story with tags, people,
 * places, partners, and media that quietly becomes dozens of joins per card.
 */

const DEFAULT_CARD_DEPTH = 1
const DEFAULT_STORY_DEPTH = 2

async function safely<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[cms] query failed, returning empty result:', error)
    }
    return fallback
  }
}

export type StoryListOptions = {
  channel?: ChannelKey
  limit?: number
  page?: number
  /** Exclude these ids — used to keep the lead story out of the grid below it. */
  excludeIds?: (string | number)[]
  storyTypes?: string[]
}

export async function getPublishedStories(
  options: StoryListOptions = {},
): Promise<{ docs: Story[]; totalDocs: number; totalPages: number; page: number }> {
  const { channel, limit = 12, page = 1, excludeIds = [], storyTypes } = options

  return safely(
    async () => {
      const payload = await getCms()

      const where: Where = {
        _status: { equals: 'published' },
      }
      if (channel) where.channel = { equals: channel }
      if (storyTypes?.length) where.storyType = { in: storyTypes }
      if (excludeIds.length) where.id = { not_in: excludeIds }

      const result = await payload.find({
        collection: 'stories',
        where,
        limit,
        page,
        depth: DEFAULT_CARD_DEPTH,
        sort: '-publishedAt',
      })

      return {
        docs: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page ?? 1,
      }
    },
    { docs: [], totalDocs: 0, totalPages: 0, page: 1 },
  )
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  return safely(async () => {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'stories',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: DEFAULT_STORY_DEPTH,
    })
    return result.docs[0] ?? null
  }, null)
}

/**
 * The current issue.
 *
 * Falls back to the most recent issue when none is explicitly marked current,
 * so the homepage still has an issue line if someone forgets to flip the flag.
 */
export async function getCurrentIssue(): Promise<Issue | null> {
  return safely(async () => {
    const payload = await getCms()

    const current = await payload.find({
      collection: 'issues',
      where: { editionStatus: { equals: 'current' }, _status: { equals: 'published' } },
      limit: 1,
      depth: 2,
    })
    if (current.docs[0]) return current.docs[0]

    const latest = await payload.find({
      collection: 'issues',
      where: { _status: { equals: 'published' } },
      limit: 1,
      depth: 2,
      sort: '-number',
    })
    return latest.docs[0] ?? null
  }, null)
}

/**
 * The lead story for the homepage.
 *
 * Resolution order is editorial intent first, recency last: an explicit
 * homepage override, then the current issue's lead, then the newest story. A
 * front page that is only ever "most recent" is a feed, not an edition.
 */
export async function getLeadStory(): Promise<Story | null> {
  return safely(async () => {
    const payload = await getCms()

    const home = await payload.findGlobal({ slug: 'homePage', depth: 2 })
    const override = home?.leadStory
    if (override && typeof override === 'object') return override as Story

    const issue = await getCurrentIssue()
    const issueLead = issue?.leadStory
    if (issueLead && typeof issueLead === 'object') return issueLead as Story

    const latest = await payload.find({
      collection: 'stories',
      where: { _status: { equals: 'published' } },
      limit: 1,
      depth: DEFAULT_STORY_DEPTH,
      sort: '-publishedAt',
    })
    return latest.docs[0] ?? null
  }, null)
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  return safely(async () => {
    const payload = await getCms()
    const result = await payload.find({
      collection: 'stories',
      where: { _status: { equals: 'published' }, noIndex: { not_equals: true } },
      limit: 1000,
      depth: 0,
      select: { slug: true },
    })
    return result.docs
      .map((doc) => doc.slug)
      .filter((slug): slug is string => Boolean(slug))
  }, [])
}

/**
 * Related stories.
 *
 * Editorial picks always win. Only when none are set does this blend shared
 * series, people, places, and tags — and it deliberately caps how many results
 * one signal can contribute, so a story does not surface four near-identical
 * pieces just because they share a tag (plan §10.5).
 */
export async function getRelatedStories(story: Story, limit = 3): Promise<Story[]> {
  const editorial = Array.isArray(story.relatedStories)
    ? story.relatedStories.filter((entry): entry is Story => typeof entry === 'object')
    : []

  if (editorial.length >= limit) return editorial.slice(0, limit)

  return safely(
    async () => {
      const payload = await getCms()

      const idOf = (value: unknown): string | number | null =>
        typeof value === 'object' && value !== null
          ? ((value as { id?: string | number }).id ?? null)
          : ((value as string | number | null) ?? null)

      const tagIds = (story.tags ?? []).map(idOf).filter(Boolean)
      const peopleIds = (story.people ?? []).map(idOf).filter(Boolean)
      const placeIds = (story.places ?? []).map(idOf).filter(Boolean)
      const seriesId = idOf(story.series)

      const or: Where[] = []
      if (seriesId) or.push({ series: { equals: seriesId } })
      if (peopleIds.length) or.push({ people: { in: peopleIds } })
      if (placeIds.length) or.push({ places: { in: placeIds } })
      if (tagIds.length) or.push({ tags: { in: tagIds } })

      // Nothing to relate on — fall back to recent work in the same channel
      // rather than showing an empty rail.
      if (or.length === 0) {
        const recent = await payload.find({
          collection: 'stories',
          where: {
            _status: { equals: 'published' },
            channel: { equals: story.channel },
            id: { not_equals: story.id },
          },
          limit,
          depth: DEFAULT_CARD_DEPTH,
          sort: '-publishedAt',
        })
        return [...editorial, ...recent.docs].slice(0, limit)
      }

      const candidates = await payload.find({
        collection: 'stories',
        where: {
          _status: { equals: 'published' },
          id: { not_equals: story.id },
          or,
        },
        limit: limit * 3,
        depth: DEFAULT_CARD_DEPTH,
        sort: '-publishedAt',
      })

      const seen = new Set(editorial.map((entry) => entry.id))
      const merged = [...editorial]

      for (const candidate of candidates.docs) {
        if (merged.length >= limit) break
        if (seen.has(candidate.id)) continue
        seen.add(candidate.id)
        merged.push(candidate)
      }

      return merged.slice(0, limit)
    },
    editorial.slice(0, limit),
  )
}
