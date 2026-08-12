import { PostgresSearchProvider } from './postgres'

import type { SearchProvider } from './provider'

export * from './provider'

let provider: SearchProvider | null = null

/**
 * The active search provider.
 *
 * One place to swap implementations when the migration triggers in ADR-0005
 * are met — database contention, inadequate typo tolerance or faceting, tens of
 * thousands of indexed records, or analytics showing search has become a
 * primary navigation path.
 */
export function getSearchProvider(): SearchProvider {
  provider ??= new PostgresSearchProvider()
  return provider
}

export type ExcerptRun = { text: string; match: boolean }

/**
 * Splits a `ts_headline` excerpt into plain and highlighted runs.
 *
 * Postgres returns `<mark>` tags inside the excerpt string. Rendering that as
 * HTML would mean trusting database content as markup, so it is parsed into
 * data here and the component renders real elements instead.
 */
export function parseExcerpt(excerpt: string | null): ExcerptRun[] {
  if (!excerpt) return []

  return excerpt
    .split(/(<mark>[\s\S]*?<\/mark>)/g)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith('<mark>') && part.endsWith('</mark>')
        ? { text: part.slice('<mark>'.length, -'</mark>'.length), match: true }
        : { text: part, match: false },
    )
}
