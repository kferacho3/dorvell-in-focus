import Link from 'next/link'

import { PublicationShell } from '@/components/layout/PublicationShell'
import { storyTypeLabel, formatDate } from '@/components/editorial/StoryMeta'
import { CHANNEL_LIST, isChannelKey } from '@/lib/channels'
import { getActiveTagsWithCounts } from '@/lib/cms/entities'
import { getSearchProvider, parseExcerpt } from '@/lib/search'
import { cn } from '@/lib/utils/cn'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search stories, films, photo essays, people, and places.',
  // Result pages are thin and infinitely variable; indexing them competes with
  // the stories themselves.
  robots: { index: false, follow: true },
}

// Results depend on the query string, so this route is dynamic by nature.
export const dynamic = 'force-dynamic'

type SearchPageProps = {
  searchParams: Promise<{ q?: string; channel?: string; page?: string }>
}

/**
 * Search.
 *
 * Server-rendered against URL state, so a result page is shareable and works
 * with no client JavaScript. The command overlay planned for later enhances
 * this same endpoint rather than replacing it.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const q = (params.q ?? '').trim()
  const channel = isChannelKey(params.channel) ? params.channel : undefined
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const [result, tagEntries] = await Promise.all([
    q ? getSearchProvider().search({ q, channel, page }) : Promise.resolve(null),
    q ? Promise.resolve([]) : getActiveTagsWithCounts(),
  ])

  const browseTags = tagEntries.slice(0, 24)

  const hrefFor = (next: { channel?: string; page?: number }): string => {
    const query = new URLSearchParams()
    query.set('q', q)
    const targetChannel = next.channel ?? channel
    if (targetChannel) query.set('channel', targetChannel)
    if (next.page && next.page > 1) query.set('page', String(next.page))
    return `/search?${query.toString()}`
  }

  return (
    <PublicationShell channel="publication">
      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        <h1 className="type-h1">Search</h1>
        <p className="type-lead text-channel-muted measure mt-4">
          Find stories, films, people, and places — or browse by{' '}
          <Link href="/tags" className="underline underline-offset-4">
            tag
          </Link>{' '}
          when you know the subject.
        </p>

        {/* A plain GET form. Works before hydration and after a failed chunk. */}
        <form action="/search" method="get" role="search" className="measure mt-8">
          <label htmlFor="q" className="type-meta text-channel-muted block">
            Search stories, films, people, and places
          </label>
          <div className="mt-3 flex gap-3">
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              autoComplete="off"
              placeholder="unbraided, rooftop, Tampa…"
              data-focus-target
              data-focus-id="search-query"
              data-focus-label="Search query"
              data-focus-inset="4"
              className="border-channel-fg/25 focus-visible:border-channel-accent type-body min-h-11 flex-1 border bg-transparent px-4 py-2 outline-none"
            />
            {channel && <input type="hidden" name="channel" value={channel} />}
            <button
              type="submit"
              data-focus-target
              data-focus-id="search-submit"
              data-focus-label="Search"
              data-focus-inset="4"
              className="type-kicker border-channel-fg/30 hover:border-channel-accent min-h-11 border px-5 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      {!q && (
        <section className="shell py-12" aria-labelledby="browse-tags">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="browse-tags" className="type-meta text-channel-muted">
                Browse by tag
              </h2>
              <p className="type-caption text-channel-muted mt-2 max-w-[48ch]">
                Start from the vocabulary behind the work, or open the full{' '}
                <Link href="/tags" className="underline underline-offset-4">
                  tags index
                </Link>
                .
              </p>
            </div>
            <Link href="/archive" className="type-kicker opacity-70 hover:opacity-100">
              Full archive →
            </Link>
          </div>

          {browseTags.length === 0 ? (
            <p className="type-body text-channel-muted mt-8">
              No tagged stories yet. Try a name, a place, or a channel once Issue 001 is
              live.
            </p>
          ) : (
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {browseTags.map(({ tag, storyCount }) => (
                <li key={tag.id}>
                  <Link
                    href={`/tags/${tag.slug}`}
                    data-focus-target
                    data-focus-id={`search-tag-${tag.id}`}
                    data-focus-label={tag.label}
                    data-focus-inset="4"
                    className="type-kicker text-channel-fg/85 hover:text-channel-accent inline-flex items-baseline gap-2 transition-colors"
                  >
                    <span className="border-channel-fg/20 hover:border-channel-accent border-b pb-0.5">
                      {tag.label}
                    </span>
                    <span className="type-meta text-channel-muted">{storyCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {q && result && (
        <>
          <nav
            className="shell border-channel-rule border-b py-5"
            aria-label="Filter results by channel"
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              <li>
                <Link
                  href={hrefFor({ channel: undefined, page: 1 })}
                  aria-current={!channel ? 'true' : undefined}
                  data-focus-target
                  data-focus-id="search-filter-all"
                  data-focus-label="All channels"
                  data-focus-inset="4"
                  className={cn(
                    'type-kicker',
                    channel ? 'opacity-60 hover:opacity-100' : '',
                  )}
                >
                  All
                </Link>
              </li>
              {CHANNEL_LIST.map((entry) => (
                <li key={entry.key}>
                  <Link
                    href={hrefFor({ channel: entry.key, page: 1 })}
                    aria-current={channel === entry.key ? 'true' : undefined}
                    data-accent={entry.key}
                    data-focus-target
                    data-focus-id={`search-filter-${entry.key}`}
                    data-focus-label={entry.fallbackLabel}
                    data-focus-theme={entry.key}
                    data-focus-inset="4"
                    className={cn(
                      'type-kicker',
                      channel === entry.key
                        ? 'text-channel-accent'
                        : 'opacity-60 hover:opacity-100',
                    )}
                  >
                    {entry.fallbackLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="shell py-12" aria-live="polite">
            <p className="type-meta text-channel-muted">
              {result.total === 0
                ? `No results for “${q}”`
                : `${result.total} ${result.total === 1 ? 'result' : 'results'} for “${q}”`}
              {result.didYouMean && ' — showing close matches'}
            </p>

            {result.total === 0 ? (
              <div className="measure mt-8">
                <p className="type-body text-channel-muted">
                  Nothing matched. Try a single distinctive word, a place, or a
                  person&apos;s name — or browse{' '}
                  <Link href="/tags" className="underline underline-offset-4">
                    tags
                  </Link>{' '}
                  and{' '}
                  <Link href="/archive" className="underline underline-offset-4">
                    the archive
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <ol className="border-channel-rule divide-channel-rule mt-8 divide-y border-t">
                {result.hits.map((hit) => (
                  <li key={hit.id} className="py-6">
                    <article
                      data-accent={hit.channel ?? undefined}
                      data-focus-target
                      data-focus-id={`search-result-${hit.id}`}
                      data-focus-label={hit.title}
                      data-focus-theme={hit.channel ?? undefined}
                      data-focus-inset="7"
                    >
                      <p className="type-meta text-channel-muted flex flex-wrap gap-x-3">
                        {hit.channel && (
                          <span className="text-channel-accent">
                            {
                              CHANNEL_LIST.find((c) => c.key === hit.channel)
                                ?.fallbackLabel
                            }
                          </span>
                        )}
                        {storyTypeLabel(hit.storyType) && (
                          <span>{storyTypeLabel(hit.storyType)}</span>
                        )}
                        {formatDate(hit.publishedAt) && (
                          <span>{formatDate(hit.publishedAt)}</span>
                        )}
                      </p>

                      <h2 className="type-h3 mt-2">
                        <Link href={`/story/${hit.slug}`}>{hit.title}</Link>
                      </h2>

                      {hit.excerpt ? (
                        <p className="type-caption measure mt-3">
                          {/* Parsed into runs rather than injected as HTML —
                              the excerpt is database content. */}
                          {parseExcerpt(hit.excerpt).map((run, index) =>
                            run.match ? (
                              <mark
                                key={index}
                                className="bg-signal/60 text-channel-fg px-0.5"
                              >
                                {run.text}
                              </mark>
                            ) : (
                              <span key={index}>{run.text}</span>
                            ),
                          )}
                        </p>
                      ) : (
                        hit.dek && <p className="type-caption measure mt-3">{hit.dek}</p>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {result.totalPages > 1 && (
            <nav
              className="shell border-channel-rule border-t py-8"
              aria-label="Pagination"
            >
              <div className="flex items-center justify-between">
                {page > 1 ? (
                  <Link
                    href={hrefFor({ page: page - 1 })}
                    rel="prev"
                    data-focus-target
                    data-focus-id="search-previous"
                    data-focus-label="Previous page"
                    data-focus-inset="4"
                    className="type-kicker"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}
                <span className="type-meta text-channel-muted">
                  Page {result.page} of {result.totalPages}
                </span>
                {page < result.totalPages ? (
                  <Link
                    href={hrefFor({ page: page + 1 })}
                    rel="next"
                    data-focus-target
                    data-focus-id="search-next"
                    data-focus-label="Next page"
                    data-focus-inset="4"
                    className="type-kicker"
                  >
                    Next →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </PublicationShell>
  )
}
