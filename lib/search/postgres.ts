import { getCms } from '@/lib/cms/client'
import { isChannelKey } from '@/lib/channels'

import {
  EMPTY_RESULT,
  type SearchProvider,
  type SearchQuery,
  type SearchResult,
} from './provider'

/**
 * Postgres full-text search.
 *
 * Two passes. First `websearch_to_tsquery` against the weighted vector — it
 * understands quoted phrases and `-exclusions` the way a reader expects, and
 * unlike `to_tsquery` it never throws on malformed input, so a stray operator
 * in the search box cannot produce a 500. If that returns nothing, a trigram
 * pass catches typos: "unbraded" still reaches Unbraided.
 *
 * The weighted expression below must stay identical to the one indexed in
 * payload/migrations/20260812_000000_search_indexes.ts. If they drift, Postgres
 * silently falls back to a sequential scan and the index becomes decoration.
 */

/** Weighted document. Title outranks dek, which outranks body and captions. */
const SEARCH_VECTOR = `(
  setweight(to_tsvector('english', coalesce(s.title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(s.kicker, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(s.dek, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(s.search_document, '')), 'C')
)`

const MIN_SIMILARITY = 0.25
const MAX_QUERY_LENGTH = 200

type PoolLike = {
  query: (text: string, values?: unknown[]) => Promise<{ rows: unknown[] }>
}

type Row = {
  id: string | number
  slug: string | null
  title: string | null
  dek: string | null
  channel: string | null
  story_type: string | null
  published_at: Date | string | null
  excerpt: string | null
  score: number | string
  total: number | string
}

export class PostgresSearchProvider implements SearchProvider {
  readonly name = 'postgres'

  async search(query: SearchQuery): Promise<SearchResult> {
    const q = query.q.trim().slice(0, MAX_QUERY_LENGTH)
    if (q.length === 0) return EMPTY_RESULT

    const limit = Math.min(Math.max(1, query.limit ?? 20), 50)
    const page = Math.max(1, query.page ?? 1)
    const offset = (page - 1) * limit

    try {
      const payload = await getCms()
      /*
       * Raw SQL against the adapter's node-postgres pool.
       *
       * Warranted here rather than lazy: `ts_rank` and `ts_headline` have no
       * equivalent in the query builder, and reimplementing relevance in
       * application code would mean fetching every published row to sort it.
       *
       * Every value is a bound parameter — no user input is ever concatenated
       * into the statement.
       */
      const pool = (payload.db as unknown as { pool?: PoolLike }).pool
      if (!pool) return EMPTY_RESULT

      const exact = await this.run(pool, q, query, limit, offset, 'exact')
      if (exact.total > 0) return exact

      const fuzzy = await this.run(pool, q, query, limit, offset, 'fuzzy')
      return { ...fuzzy, didYouMean: fuzzy.total > 0 }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[search] query failed:', error)
      }
      return EMPTY_RESULT
    }
  }

  private async run(
    pool: PoolLike,
    q: string,
    query: SearchQuery,
    limit: number,
    offset: number,
    mode: 'exact' | 'fuzzy',
  ): Promise<SearchResult> {
    const params: unknown[] = [q, limit, offset]
    if (query.channel) params.push(query.channel)

    const channelFilter = query.channel ? 'AND s.channel = $4' : ''

    const matchClause =
      mode === 'exact'
        ? `${SEARCH_VECTOR} @@ websearch_to_tsquery('english', $1)`
        : `similarity(s.title, $1) > ${MIN_SIMILARITY}`

    const scoreClause =
      mode === 'exact'
        ? `ts_rank(${SEARCH_VECTOR}, websearch_to_tsquery('english', $1))`
        : `similarity(s.title, $1)`

    const statement = `
      SELECT
        s.id,
        s.slug,
        s.title,
        s.dek,
        s.channel,
        s.story_type,
        s.published_at,
        ts_headline(
          'english',
          coalesce(s.search_document, s.dek, ''),
          websearch_to_tsquery('english', $1),
          'MaxWords=28, MinWords=12, ShortWord=3, MaxFragments=1, StartSel=<mark>, StopSel=</mark>'
        ) AS excerpt,
        ${scoreClause} AS score,
        count(*) OVER() AS total
      FROM stories s
      WHERE s._status = 'published'
        AND (s.no_index IS NULL OR s.no_index = false)
        AND ${matchClause}
        ${channelFilter}
      ORDER BY score DESC, s.published_at DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `

    const result = await pool.query(statement, params)
    const rows = (result.rows ?? []) as Row[]
    const total = rows.length > 0 ? Number(rows[0]!.total) : 0

    return {
      hits: rows.map((row) => ({
        id: row.id,
        slug: row.slug ?? '',
        title: row.title ?? '',
        dek: row.dek,
        channel: isChannelKey(row.channel) ? row.channel : null,
        storyType: row.story_type,
        publishedAt:
          row.published_at instanceof Date
            ? row.published_at.toISOString()
            : (row.published_at ?? null),
        excerpt: row.excerpt,
        score: Number(row.score),
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
      didYouMean: false,
    }
  }
}
