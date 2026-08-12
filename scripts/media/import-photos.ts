/**
 * Imports a curated pool of photographs from the existing portfolio.
 *
 * The governing rule (plan §8.1): **do not copy the archive — curate it.** A
 * photograph earns migration because it supports a story, a series, a person,
 * a place, or an event, not because it exists in a bucket. So this takes a
 * balanced launch pool across the real subject categories rather than all
 * 1,831 frames.
 *
 * Three things it deliberately will not do:
 *
 *   - It never writes alt text. Alt is a human judgement about what a specific
 *     photograph shows and why it is here, and the plan forbids generating it
 *     and publishing unreviewed (§12.3). Every record arrives without alt, so
 *     publish validation blocks it until someone writes one.
 *   - It never marks rights approved. Everything lands `needs-review`.
 *   - It never touches the source. Reads only, from the local export.
 *
 * Idempotent on `legacySourceId`. Dry run by default, as every media script
 * must be (§8.4).
 *
 *   pnpm tsx scripts/media/import-photos.ts            # dry run
 *   pnpm tsx scripts/media/import-photos.ts --commit   # actually import
 *   pnpm tsx scripts/media/import-photos.ts --commit --limit 40
 */
import '../lib/env'

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import type { Payload } from 'payload'

const LEGACY_ROOT =
  process.env.LEGACY_SITE_PATH ?? '/Users/kamal/Documents/dorvel-ferguson'
const MANIFEST = path.join(LEGACY_ROOT, 'src/content/curatedPhotos.generated.json')
const OPTIMIZED = path.join(LEGACY_ROOT, 'public/dorvell/optimized')
const ORIGINALS = path.join(LEGACY_ROOT, 'public/dorvell/originals')

const args = process.argv.slice(2)
const COMMIT = args.includes('--commit')
const limitFlag = args.indexOf('--limit')
const TOTAL_LIMIT = limitFlag !== -1 ? Number(args[limitFlag + 1]) : 140

type CuratedPhoto = {
  photo_id: string
  filename: string
  status: string
  category_primary: string
  category_tags?: string[]
}

/**
 * How many frames each subject earns in the launch pool.
 *
 * Proportional to the archive would give 82 portraits and one of everything
 * else, which would misrepresent the range of Dorvell's work. These caps show
 * the breadth while still leaning toward what he shoots most.
 */
const QUOTA: Record<string, number> = {
  Portrait: 34,
  Music: 26,
  Athletics: 20,
  Modeling: 18,
  Landscape: 14,
  Headshots: 8,
  Street: 5,
  Fashion: 3,
  Event: 2,
  Photojournalism: 1,
  Editorial: 1,
}

/** Maps the legacy category vocabulary onto seeded tag labels. */
const TAG_FOR: Record<string, string> = {
  Portrait: 'Portraiture',
  Music: 'Music & Live',
  Athletics: 'Sports & Athletics',
  Modeling: 'Modeling',
  Landscape: 'Landscape',
  Headshots: 'Headshots',
  Street: 'Street',
  Fashion: 'Fashion',
  Event: 'Events',
  Photojournalism: 'Photojournalism',
  Editorial: 'Photo Essay',
  Runway: 'Runway',
}

/**
 * Locates the best available file for a manifest entry.
 *
 * Prefers the already-optimized WebP, which only 99 frames have. The rest —
 * 1,738 of them — exist only as originals, keyed by the manifest's filename
 * rather than by the photo id. Both paths are checked because assuming either
 * one alone silently loses most of the archive.
 */
function sourceFor(photo: CuratedPhoto): { file: string; mimetype: string } | null {
  const core = photo.photo_id.replace(/^df-/, '')

  for (const size of ['lg', 'md', 'sm']) {
    const candidate = path.join(OPTIMIZED, `df-${core}-${size}.webp`)
    if (existsSync(candidate)) return { file: candidate, mimetype: 'image/webp' }
  }

  const original = path.join(ORIGINALS, photo.filename)
  if (existsSync(original)) {
    const ext = path.extname(original).toLowerCase()
    return {
      file: original,
      mimetype: ext === '.png' ? 'image/png' : 'image/jpeg',
    }
  }

  return null
}

/** Human-readable label from the legacy filename, which encodes the subject. */
function labelFor(photo: CuratedPhoto): string {
  const descriptor = photo.filename
    .replace(/^[0-9a-f]+-/, '')
    .replace(/\.[a-z]+$/i, '')
    .replace(/-/g, ' ')
    .trim()
  return descriptor.length > 2
    ? `${photo.category_primary} — ${descriptor}`
    : `${photo.category_primary} — ${photo.photo_id}`
}

async function tagIds(payload: Payload): Promise<Map<string, string | number>> {
  const found = await payload.find({
    collection: 'tags',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  return new Map(found.docs.map((tag) => [tag.label, tag.id]))
}

async function main(): Promise<void> {
  if (!existsSync(MANIFEST)) {
    console.error(`No manifest at ${MANIFEST}`)
    process.exit(1)
  }

  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as {
    photos: CuratedPhoto[]
  }

  const available = manifest.photos.filter(
    (photo) => photo.status === 'kept' && sourceFor(photo) !== null,
  )

  // Select against the quota, preserving manifest order so the selection is
  // deterministic and re-running picks the same frames.
  const remaining = { ...QUOTA }
  const selected: CuratedPhoto[] = []
  for (const photo of available) {
    if (selected.length >= TOTAL_LIMIT) break
    const quota = remaining[photo.category_primary]
    if (quota === undefined || quota <= 0) continue
    remaining[photo.category_primary] = quota - 1
    selected.push(photo)
  }

  const byCategory = selected.reduce<Record<string, number>>((acc, photo) => {
    acc[photo.category_primary] = (acc[photo.category_primary] ?? 0) + 1
    return acc
  }, {})

  console.log(`\nCurated photo import${COMMIT ? '' : ' — DRY RUN'}\n`)
  console.log(
    `  archive kept:        ${manifest.photos.filter((p) => p.status === 'kept').length}`,
  )
  console.log(`  with a local file:   ${available.length}`)
  console.log(`  selected for launch: ${selected.length}`)
  console.log(
    `  by subject:          ${Object.entries(byCategory)
      .map(([k, v]) => `${k} ${v}`)
      .join(', ')}\n`,
  )

  if (!COMMIT) {
    console.log('  Nothing written. Re-run with --commit to import.\n')
    console.log('  Every record will arrive with rights "needs-review" and NO alt text,')
    console.log('  so none of them can be published until a person writes alt and')
    console.log('  approves the rights.\n')
    return
  }

  const payload = await getPayload({ config: configPromise })
  const tags = await tagIds(payload)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const photo of selected) {
    const legacySourceId = `legacy:dorvellferguson:photo:${photo.photo_id}`

    const existing = await payload.find({
      collection: 'media',
      where: { legacySourceId: { equals: legacySourceId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      skipped += 1
      continue
    }

    const source = sourceFor(photo)
    if (!source) {
      failed += 1
      continue
    }

    try {
      const buffer = readFileSync(source.file)
      const image = sharp(buffer)
      const meta = await image.metadata()

      // A tiny placeholder so cards never pop in. Generated here rather than
      // trusted from the legacy export.
      const blur = await image.clone().resize(16).webp({ quality: 40 }).toBuffer()

      const labels = [
        TAG_FOR[photo.category_primary],
        ...(photo.category_tags ?? []).map((t) => TAG_FOR[t]),
      ].filter((label): label is string => Boolean(label))

      const resolved = [...new Set(labels)]
        .map((label) => tags.get(label))
        .filter((id): id is string | number => id !== undefined)

      await payload.create({
        collection: 'media',
        overrideAccess: true,
        file: {
          data: buffer,
          mimetype: source.mimetype,
          name: `${photo.photo_id}${path.extname(source.file)}`,
          size: buffer.byteLength,
        },
        data: {
          title: labelFor(photo),
          kind: 'image',
          // Deliberately no alt. A person writes it, or the story cannot publish.
          credit: 'Dorvell Ferguson Jr.',
          tags: resolved,
          blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
          width: meta.width,
          height: meta.height,
          rightsStatus: 'needs-review',
          consentStatus: 'needs-review',
          rightsOwner: 'Dorvell Ferguson Jr.',
          reviewNotes:
            'Imported from the dorvellferguson.com export. Confirm subject consent and any client or agency restriction, then write alt text before publishing.',
          legacySourceId,
          sourceUrl: 'https://www.dorvellferguson.com/work',
        } as never,
      })

      created += 1
      if (created % 20 === 0) console.log(`  …${created} imported`)
    } catch (error) {
      failed += 1
      console.warn(
        `  failed ${photo.photo_id}:`,
        error instanceof Error ? error.message : error,
      )
    }
  }

  console.log(`\n  created ${created}, already present ${skipped}, failed ${failed}`)
  console.log('\n  All imported with rights "needs-review" and no alt text.')
  console.log('  Review them at /admin before any can appear on the site.\n')
}

await main()
