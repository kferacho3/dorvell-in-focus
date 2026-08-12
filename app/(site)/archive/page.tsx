import Link from 'next/link'

import { StoryCard } from '@/components/editorial/StoryCard'
import { PublicationShell } from '@/components/layout/PublicationShell'
import { CHANNEL_LIST, isChannelKey } from '@/lib/channels'
import { getPublishedStories } from '@/lib/cms/queries'
import { cn } from '@/lib/utils/cn'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Everything published in FERG IN FOCUS, by channel and date.',
}

export const revalidate = 3600

const PER_PAGE = 18

type ArchivePageProps = {
  searchParams: Promise<{ channel?: string; page?: string }>
}

/**
 * The archive.
 *
 * Real pagination with stable URLs, not infinite scroll. Page two must be a
 * link a crawler can follow and a reader can bookmark — the plan is explicit
 * that "load more" may enhance this but can never be the only way through
 * (§3.10).
 *
 * Filters are URL state for the same reason: a filtered view is something you
 * can send to someone.
 */
export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams

  const channel = isChannelKey(params.channel) ? params.channel : undefined
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const { docs, totalDocs, totalPages } = await getPublishedStories({
    channel,
    page,
    limit: PER_PAGE,
  })

  const buildHref = (next: { channel?: string; page?: number }): string => {
    const query = new URLSearchParams()
    const targetChannel = next.channel ?? channel
    if (targetChannel) query.set('channel', targetChannel)
    if (next.page && next.page > 1) query.set('page', String(next.page))
    const qs = query.toString()
    return qs ? `/archive?${qs}` : '/archive'
  }

  return (
    <PublicationShell channel="publication">
      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        <p className="type-meta text-channel-muted">Archive</p>
        <h1 className="type-h1 mt-5">Everything published</h1>
        <p className="type-lead text-channel-muted measure mt-6">
          {totalDocs === 0
            ? 'Nothing is published yet. Issue 001 is in production.'
            : `${totalDocs} ${totalDocs === 1 ? 'story' : 'stories'}, newest first.`}
        </p>
      </section>

      <nav
        className="shell border-channel-rule border-b py-5"
        aria-label="Filter by channel"
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          <li>
            <Link
              href={buildHref({ channel: undefined, page: 1 })}
              aria-current={!channel ? 'true' : undefined}
              className={cn(
                'type-kicker',
                !channel ? 'opacity-100' : 'opacity-60 hover:opacity-100',
              )}
            >
              All
            </Link>
          </li>
          {CHANNEL_LIST.map((entry) => (
            <li key={entry.key}>
              <Link
                href={buildHref({ channel: entry.key, page: 1 })}
                aria-current={channel === entry.key ? 'true' : undefined}
                data-accent={entry.key}
                className={cn(
                  'type-kicker',
                  channel === entry.key
                    ? 'text-channel-accent opacity-100'
                    : 'opacity-60 hover:opacity-100',
                )}
              >
                {entry.fallbackLabel}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {docs.length > 0 ? (
        <>
          <section className="shell py-12">
            <div className="editorial-grid">
              {docs.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  className="col-span-4 md:col-span-4 lg:col-span-4"
                  headingLevel={2}
                />
              ))}
            </div>
          </section>

          {totalPages > 1 && (
            <nav
              className="shell border-channel-rule border-t py-8"
              aria-label="Pagination"
            >
              <div className="flex items-center justify-between">
                {page > 1 ? (
                  <Link
                    href={buildHref({ page: page - 1 })}
                    rel="prev"
                    className="type-kicker"
                  >
                    ← Newer
                  </Link>
                ) : (
                  <span />
                )}

                <span className="type-meta text-channel-muted">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={buildHref({ page: page + 1 })}
                    rel="next"
                    className="type-kicker"
                  >
                    Older →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </nav>
          )}
        </>
      ) : (
        <section className="shell py-20">
          <p className="type-lead text-channel-muted measure">
            {channel
              ? 'Nothing published in this channel yet.'
              : 'Nothing published yet. Issue 001 is in production — the work is being selected, credited, and rights-checked before it appears here.'}
          </p>
        </section>
      )}
    </PublicationShell>
  )
}
