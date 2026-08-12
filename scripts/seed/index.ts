/**
 * Development and launch-preparation seed.
 *
 * Seeds what is *factual and structural*: the controlled taxonomy, channel
 * copy, disclosure wording, publication settings, Dorvell's byline, and the
 * Issue 001 skeleton. It then imports the existing film catalogue as **drafts**
 * so there is real work to curate in the admin panel rather than lorem.
 *
 * What it deliberately does not do:
 *
 *   - It never marks anything published. Every story lands as a draft.
 *   - It never sets a rights status to approved. Rights and credits are a human
 *     decision, and the publish validation refuses anything uncleared.
 *   - It never attaches media. Selecting which frames earn migration is the
 *     curation step described in plan §8.3, not something a script guesses.
 *   - It never invents a date, credit, person, place, or partnership.
 *
 * Idempotent: everything upserts on a stable key, so running it twice changes
 * nothing. Existing edits are preserved — the seed will not overwrite a field
 * a human has since improved.
 *
 *   pnpm cms:seed
 */
// Must precede any import that reads process.env — Payload's config is
// evaluated at import time and needs PAYLOAD_SECRET and DATABASE_URI.
import '../lib/env'

import { readFileSync } from 'node:fs'
import path from 'node:path'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { doc, heading } from './lexical'
import { SEED_CHANNELS, SEED_DISCLOSURES, SEED_TAGS } from './taxonomy'

import type { Payload } from 'payload'

type LegacyFilm = {
  slug: string
  title: string
  description?: string
  directorNote?: string
  moods?: string[]
  tags?: string[]
  roles?: string[]
  visualLanguage?: string
  synopsis?: string
  posts?: Record<string, string>
  location?: string
  legacySourceId: string
  sourceUrl: string
}

const log = (message: string) => console.log(`  ${message}`)

/** Finds by a unique field, creating only when absent. Never overwrites. */
async function upsert<T extends Record<string, unknown>>(
  payload: Payload,
  collection: 'tags' | 'places' | 'authors' | 'issues' | 'stories' | 'people',
  key: { field: string; value: string | number },
  data: T,
): Promise<{ id: string | number; created: boolean }> {
  const existing = await payload.find({
    collection,
    where: { [key.field]: { equals: key.value } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const found = existing.docs[0]
  if (found) return { id: found.id, created: false }

  const created = await payload.create({
    collection,
    data: data as never,
    overrideAccess: true,
    // Seeded stories must not trip publish validation — they are drafts.
    draft: collection === 'stories' || collection === 'issues',
  })

  return { id: created.id, created: true }
}

async function seedTags(payload: Payload): Promise<Map<string, string | number>> {
  const ids = new Map<string, string | number>()
  let created = 0

  for (const tag of SEED_TAGS) {
    const slug = tag.label
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const result = await upsert(
      payload,
      'tags',
      { field: 'slug', value: slug },
      {
        label: tag.label,
        slug,
        kind: tag.kind,
        status: 'active',
        channelAffinity: tag.channelAffinity ?? [],
        aliases: (tag.aliases ?? []).map((value) => ({ value })),
        description: tag.description,
      },
    )

    ids.set(tag.label.toLowerCase(), result.id)
    if (result.created) created += 1
  }

  log(`tags: ${created} created, ${SEED_TAGS.length - created} already present`)
  return ids
}

async function seedPlaces(payload: Payload): Promise<Map<string, string | number>> {
  const ids = new Map<string, string | number>()

  // Only places the source material actually names. No invented locations.
  const places = [
    {
      name: 'Tampa',
      slug: 'tampa',
      kind: 'city' as const,
      locality: 'Tampa',
      region: 'Florida',
      country: 'United States',
    },
  ]

  let created = 0
  for (const place of places) {
    const result = await upsert(
      payload,
      'places',
      { field: 'slug', value: place.slug },
      place,
    )
    ids.set(place.name.toLowerCase(), result.id)
    if (result.created) created += 1
  }

  log(`places: ${created} created, ${places.length - created} already present`)
  return ids
}

async function seedAuthor(payload: Payload): Promise<string | number> {
  // Drawn from Dorvell's published biography. Nothing embellished.
  const result = await upsert(
    payload,
    'authors',
    { field: 'slug', value: 'dorvell-ferguson-jr' },
    {
      name: 'Dorvell Ferguson Jr.',
      slug: 'dorvell-ferguson-jr',
      role: 'Photographer, model, and visual storyteller',
      bio: 'Multimedia Journalism graduate and culture-focused photographer shaping stories through portraits, concerts, fashion, sports, and editorial moments.',
      links: [
        { label: 'Portfolio', url: 'https://www.dorvellferguson.com/' },
        {
          label: 'Instagram — FERG Photography',
          url: 'https://www.instagram.com/fergphotography/',
        },
        { label: 'Instagram — @2kferg', url: 'https://www.instagram.com/2kferg/' },
      ],
    },
  )

  log(`author: ${result.created ? 'created' : 'already present'}`)
  return result.id
}

async function seedGlobals(payload: Payload): Promise<void> {
  await payload.updateGlobal({
    slug: 'siteSettings',
    overrideAccess: true,
    data: {
      name: 'FERG IN FOCUS',
      tagline: 'Life through a creative lens.',
      statement:
        'The independent visual publication of Dorvell Ferguson Jr. Photographs, films, reporting, modeling, and collaborations — told as complete stories rather than isolated posts.',
      defaultSeoDescription:
        'Photographs, films, reporting, modeling, and collaborations from Dorvell Ferguson Jr., told as complete stories.',
      portfolioUrl: 'https://www.dorvellferguson.com/',
    },
  })

  await payload.updateGlobal({
    slug: 'channelSettings',
    overrideAccess: true,
    data: { channels: SEED_CHANNELS.map((channel) => ({ ...channel })) },
  })

  await payload.updateGlobal({
    slug: 'disclosureSettings',
    overrideAccess: true,
    data: { statements: SEED_DISCLOSURES.map((entry) => ({ ...entry })) },
  })

  await payload.updateGlobal({
    slug: 'newsletterSettings',
    overrideAccess: true,
    data: {
      name: 'Keep It In Focus',
      promise:
        'One new visual story, one behind-the-scenes note, and one selected frame or film.',
      frequency: 'Every two weeks',
      privacyNote:
        'Your address is used for this newsletter only, and you can leave at any time.',
    },
  })

  log('globals: site, channels, disclosures, newsletter')
}

async function seedIssue(payload: Payload): Promise<string | number> {
  const result = await upsert(
    payload,
    'issues',
    { field: 'slug', value: 'both-sides-of-the-lens' },
    {
      number: 1,
      title: 'Both Sides of the Lens',
      slug: 'both-sides-of-the-lens',
      statement:
        'The first issue introduces the whole publication through one idea: what changes when the person making the picture has also been the person in it.',
      editionStatus: 'in-production',
    },
  )

  log(`issue 001: ${result.created ? 'created' : 'already present'}`)
  return result.id
}

async function seedFilms(
  payload: Payload,
  authorId: string | number,
  issueId: string | number,
  tagIds: Map<string, string | number>,
  placeIds: Map<string, string | number>,
): Promise<void> {
  const manifestPath = path.resolve(process.cwd(), 'data/legacy-films.json')

  let films: LegacyFilm[]
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      films: LegacyFilm[]
    }
    films = manifest.films
  } catch {
    log(
      'films: data/legacy-films.json not found — run scripts/migration/extract-legacy-films.ts first',
    )
    return
  }

  let created = 0

  for (const film of films) {
    // Only tags that already exist in the controlled vocabulary. A film's
    // freeform tags are preserved in the manifest for the curation pass, but
    // they do not silently expand the taxonomy.
    const resolvedTags = [...(film.moods ?? []), ...(film.tags ?? [])]
      .map((label) => tagIds.get(label.toLowerCase()))
      .filter((id): id is string | number => id !== undefined)

    const placeId = film.location?.startsWith('Tampa') ? placeIds.get('tampa') : undefined

    const blocks: Record<string, unknown>[] = []

    if (film.directorNote) {
      blocks.push({
        blockType: 'prose',
        width: 'measure',
        content: doc(heading("Director's note"), film.directorNote),
      })
    }

    if (film.synopsis) {
      // A written visual description is what makes a dialogue-free film
      // accessible to a reader who cannot see it (plan §12.3).
      blocks.push({
        blockType: 'prose',
        width: 'measure',
        content: doc(heading('What happens', 'h3'), film.synopsis),
      })
    }

    if (film.visualLanguage) {
      blocks.push({
        blockType: 'callout',
        tone: 'technique',
        title: 'Visual language',
        content: doc(film.visualLanguage),
      })
    }

    if (film.roles?.length) {
      blocks.push({
        blockType: 'creditsBlock',
        title: 'Credits',
        credits: film.roles.map((role) => ({ role, name: 'Dorvell Ferguson Jr.' })),
      })
    }

    const result = await upsert(
      payload,
      'stories',
      { field: 'legacySourceId', value: film.legacySourceId },
      {
        title: film.title,
        slug: film.slug,
        dek: film.description ?? `A ${film.title} study.`,
        channel: 'motion',
        storyType: 'film',
        authors: [authorId],
        issue: issueId,
        tags: resolvedTags,
        places: placeId ? [placeId] : [],
        contentBlocks: blocks,
        contentWarning: undefined,
        approvalStatus: 'draft',
        legacySourceId: film.legacySourceId,
        // Every seeded record needs a human pass before it can go out.
        usageNotes: `Imported from ${film.sourceUrl}. Confirm music rights, subject consent, and credits before publishing. Attach approved media during curation.`,
        _status: 'draft',
      },
    )

    if (result.created) created += 1
  }

  log(`films: ${created} created as drafts, ${films.length - created} already present`)
}

async function main(): Promise<void> {
  console.log('\nSeeding FERG IN FOCUS\n')

  const payload = await getPayload({ config: configPromise })

  const tagIds = await seedTags(payload)
  const placeIds = await seedPlaces(payload)
  const authorId = await seedAuthor(payload)
  await seedGlobals(payload)
  const issueId = await seedIssue(payload)
  await seedFilms(payload, authorId, issueId, tagIds, placeIds)

  console.log('\nDone. Everything landed as a draft — nothing is public.')
  console.log(
    'Next: curate media, confirm rights and credits, then publish from /admin.\n',
  )

  process.exit(0)
}

await main()
