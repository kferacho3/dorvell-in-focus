import { getCms } from '@/lib/cms/client'

import type { Person, Place, Story, Tag } from '@/payload-types'

/**
 * Taxonomy entity lookups.
 *
 * Each returns the entity plus the published stories that reference it. A page
 * with no stories is not an error — but it is also not worth indexing, which is
 * why `hasContent` is returned rather than inferred at the call site.
 */

export type EntityKind = 'tags' | 'people' | 'places'

export type EntityResult<T> = {
  entity: T
  stories: Story[]
  total: number
} | null

async function findStoriesFor(
  relation: 'tags' | 'people' | 'places',
  id: string | number,
  limit: number,
): Promise<{ docs: Story[]; total: number }> {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'stories',
    where: {
      _status: { equals: 'published' },
      [relation]: { in: [id] },
    },
    limit,
    depth: 1,
    sort: '-publishedAt',
  })
  return { docs: result.docs, total: result.totalDocs }
}

export async function getTagBySlug(slug: string, limit = 24): Promise<EntityResult<Tag>> {
  try {
    const payload = await getCms()
    const found = await payload.find({
      collection: 'tags',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })

    const tag = found.docs[0]
    if (!tag) return null

    // A merged tag is not a dead end — it redirects to its canonical target,
    // so old links and bookmarks survive a taxonomy cleanup (plan §10.6).
    if (tag.status === 'merged' && tag.mergedInto) {
      const target = typeof tag.mergedInto === 'object' ? tag.mergedInto : null
      if (target?.slug && target.slug !== slug) {
        return getTagBySlug(target.slug, limit)
      }
    }

    const stories = await findStoriesFor('tags', tag.id, limit)
    return { entity: tag, stories: stories.docs, total: stories.total }
  } catch {
    return null
  }
}

export async function getPersonBySlug(
  slug: string,
  limit = 24,
): Promise<EntityResult<Person>> {
  try {
    const payload = await getCms()
    const found = await payload.find({
      collection: 'people',
      where: { slug: { equals: slug }, hasPublicPage: { equals: true } },
      limit: 1,
      depth: 1,
    })

    const person = found.docs[0]
    if (!person) return null

    const stories = await findStoriesFor('people', person.id, limit)
    return { entity: person, stories: stories.docs, total: stories.total }
  } catch {
    return null
  }
}

export async function getPlaceBySlug(
  slug: string,
  limit = 24,
): Promise<EntityResult<Place>> {
  try {
    const payload = await getCms()
    const found = await payload.find({
      collection: 'places',
      // A private location has no public page, regardless of what links to it.
      where: { slug: { equals: slug }, isPrivate: { not_equals: true } },
      limit: 1,
      depth: 1,
    })

    const place = found.docs[0]
    if (!place) return null

    const stories = await findStoriesFor('places', place.id, limit)
    return { entity: place, stories: stories.docs, total: stories.total }
  } catch {
    return null
  }
}
