import { createHash } from 'node:crypto'

import { calculateReadingTime, summarizeContent } from '@/lib/cms/reading-time'

import type { CollectionBeforeChangeHook } from 'payload'

type UnknownRecord = Record<string, unknown>

/**
 * Collects every reader-visible string in a document into one flat blob.
 *
 * This is what the Postgres `tsvector` is built from, which is why it walks the
 * whole tree rather than listing known fields: captions and transcripts are the
 * most valuable search surface a visual publication has, and they live several
 * levels down inside blocks.
 */
function flattenSearchableText(value: unknown, depth = 0): string[] {
  if (depth > 12 || value === null || value === undefined) return []

  if (typeof value === 'string') {
    const trimmed = value.trim()
    // Skip ids, hashes, URLs, and data URIs — noise that dilutes ranking.
    if (trimmed.length === 0 || trimmed.length > 20_000) return []
    if (/^(https?:\/\/|data:|[0-9a-f]{32,})/i.test(trimmed)) return []
    return [trimmed]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenSearchableText(item, depth + 1))
  }

  if (typeof value !== 'object') return []

  const skipKeys = new Set([
    'id',
    'blockType',
    'blockName',
    'type',
    'format',
    'version',
    'direction',
    'mode',
    'style',
    'searchDocument',
    'contentHash',
    'blurDataURL',
    'checksum',
    'perceptualHash',
    'legacySourceId',
    'reviewNotes',
    'usageNotes',
  ])

  return Object.entries(value as UnknownRecord).flatMap(([key, child]) =>
    skipKeys.has(key) ? [] : flattenSearchableText(child, depth + 1),
  )
}

/**
 * Computes derived fields on every write.
 *
 * Derivation happens here rather than at render time so that reading time and
 * the search document are consistent for every consumer — page, card, feed,
 * OG image, and the search index — instead of each recomputing and disagreeing.
 */
export const withDerivedFields: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const next: UnknownRecord = { ...data }

  const reading = calculateReadingTime(summarizeContent(next.contentBlocks))
  next.readingMinutes = reading.minutes
  next.watchSeconds = reading.watchSeconds
  next.wordCount = reading.words

  const searchable = [
    typeof next.title === 'string' ? next.title : '',
    typeof next.kicker === 'string' ? next.kicker : '',
    typeof next.dek === 'string' ? next.dek : '',
    ...flattenSearchableText(next.contentBlocks),
  ]
    .filter(Boolean)
    .join(' \n ')

  next.searchDocument = searchable.slice(0, 100_000)
  next.contentHash = createHash('sha256').update(searchable).digest('hex').slice(0, 32)

  // Stamp the first publication date once, then leave it alone. Re-stamping on
  // every edit would silently reorder the archive whenever a typo is fixed.
  const previouslyPublished = (originalDoc as { _status?: string } | undefined)?._status
  if (
    next._status === 'published' &&
    previouslyPublished !== 'published' &&
    !next.publishedAt
  ) {
    next.publishedAt = new Date().toISOString()
  }

  return next
}
