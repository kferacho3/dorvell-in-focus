/**
 * Publish or unpublish a story locally, through the real API.
 *
 * A development tool with one purpose: exercising the publish path. It calls
 * `payload.update` rather than touching the database, so every hook runs —
 * rights enforcement, alt-text and credit checks on the lead image, partner
 * verification, disclosure requirements, embargo dates. A story that this
 * refuses is a story production would refuse too, which is exactly what makes
 * it useful.
 *
 * It cannot bypass validation. If you want a story published, satisfy the
 * checks; do not reach for psql.
 *
 *   pnpm tsx scripts/dev/set-story-status.ts <slug> [published|draft]
 */
import '../lib/env'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const slug = process.argv[2]
const status = (process.argv[3] ?? 'published') as 'published' | 'draft'

if (!slug) {
  console.error(
    'Usage: pnpm tsx scripts/dev/set-story-status.ts <slug> [published|draft]',
  )
  process.exit(1)
}

if (status !== 'published' && status !== 'draft') {
  console.error(`Unknown status "${status}". Use "published" or "draft".`)
  process.exit(1)
}

if (process.env.NODE_ENV === 'production') {
  // Publishing is an editorial act. It happens in the admin panel, by a person
  // who is accountable for the content — not from a shell.
  console.error('Refusing to run against a production environment.')
  process.exit(1)
}

const payload = await getPayload({ config: configPromise })

const found = await payload.find({
  collection: 'stories',
  where: { slug: { equals: slug } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
  draft: true,
})

const story = found.docs[0]
if (!story) {
  console.error(`No story with slug "${slug}".`)
  process.exit(1)
}

try {
  await payload.update({
    collection: 'stories',
    id: story.id,
    data: { _status: status },
    overrideAccess: true,
    draft: status === 'draft',
  })
  console.log(`"${story.title}" → ${status}`)
} catch (error) {
  console.error(
    `Validation refused this change:\n  ${error instanceof Error ? error.message : String(error)}`,
  )
  process.exit(1)
}

process.exit(0)
