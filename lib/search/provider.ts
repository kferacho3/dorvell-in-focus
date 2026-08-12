import type { ChannelKey } from '@/lib/channels'

/**
 * The search contract (ADR-0005).
 *
 * v1 is Postgres full-text plus trigram matching. This interface exists so
 * adopting Typesense, Meilisearch, or Algolia later is a provider swap rather
 * than a template rewrite — the migration triggers are recorded in the ADR.
 */

export type SearchQuery = {
  /** Raw user input. Providers are responsible for sanitising it. */
  q: string
  channel?: ChannelKey
  limit?: number
  page?: number
}

export type SearchHit = {
  id: string | number
  slug: string
  title: string
  dek: string | null
  channel: ChannelKey | null
  storyType: string | null
  publishedAt: string | null
  /** Where the match occurred, with matched terms marked. */
  excerpt: string | null
  /** Provider-specific relevance. Comparable within one result set only. */
  score: number
}

export type SearchResult = {
  hits: SearchHit[]
  total: number
  page: number
  totalPages: number
  /** True when the query fell back to fuzzy matching after an exact miss. */
  didYouMean: boolean
}

export interface SearchProvider {
  readonly name: string
  search(query: SearchQuery): Promise<SearchResult>
}

export const EMPTY_RESULT: SearchResult = {
  hits: [],
  total: 0,
  page: 1,
  totalPages: 0,
  didYouMean: false,
}
