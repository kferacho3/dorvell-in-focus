import Link from 'next/link'

import { StoryCard } from '@/components/editorial/StoryCard'
import { StoryMeta } from '@/components/editorial/StoryMeta'
import { PublicationShell } from '@/components/layout/PublicationShell'
import { EditorialImage } from '@/components/media/EditorialImage'
import { getChannels } from '@/lib/cms/channel-settings'
import { getCurrentIssue, getLeadStory, getPublishedStories } from '@/lib/cms/queries'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FERG IN FOCUS — Life through a creative lens',
  description:
    'The independent visual publication of Dorvell Ferguson Jr. Photographs, films, reporting, modeling, and collaborations, told as complete stories.',
}

// The front page is curated, not live-updating. Revalidating hourly keeps it
// fast and cacheable while still picking up a newly published story without a
// deploy.
export const revalidate = 3600

export default async function HomePage() {
  const [channels, issue, lead] = await Promise.all([
    getChannels(),
    getCurrentIssue(),
    getLeadStory(),
  ])

  const { docs: latest } = await getPublishedStories({
    limit: 6,
    excludeIds: lead ? [lead.id] : [],
  })

  const issueLabel = issue
    ? `Issue ${String(issue.number).padStart(3, '0')} — ${issue.title}`
    : 'Issue 001 — in production'

  return (
    <PublicationShell channel="publication">
      {/* --- Issue line ------------------------------------------------- */}
      <section className="shell border-channel-rule border-b py-5">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="type-meta text-channel-muted">{issueLabel}</p>
          {issue?.statement && (
            <p className="type-caption max-w-[52ch]">{issue.statement}</p>
          )}
        </div>
      </section>

      {/* --- Lead feature ----------------------------------------------- */}
      {lead ? (
        <section className="shell py-14 lg:py-20" aria-labelledby="lead-heading">
          <div
            className="editorial-grid items-end"
            data-focus-target
            data-focus-default="true"
            data-focus-id={`lead-${lead.id}`}
            data-focus-label={lead.title}
            data-focus-theme={lead.channel ?? 'publication'}
            data-focus-inset="10"
            data-focus-point="true"
          >
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              {lead.kicker && (
                <p className="type-meta text-channel-accent mb-4">{lead.kicker}</p>
              )}
              <h1 id="lead-heading" className="type-h1 max-w-[16ch]">
                <Link href={`/story/${lead.slug}`}>{lead.title}</Link>
              </h1>
              {lead.dek && (
                <p className="type-lead text-channel-muted mt-6 max-w-[48ch]">
                  {lead.dek}
                </p>
              )}
              <StoryMeta story={lead} className="mt-6" />
            </div>

            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              {lead.leadMedia && (
                <div className="crop-marks" data-story-frame>
                  {/* The one genuine LCP candidate on this route. */}
                  <EditorialImage media={lead.leadMedia} sizes="lead" priority />
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="shell py-20 lg:py-28">
          <div
            className="measure"
            data-focus-target
            data-focus-default="true"
            data-focus-id="publication-hero"
            data-focus-label="Life through a creative lens"
            data-focus-inset="10"
            data-focus-point="true"
          >
            {/* The issue line above already states the issue; repeating it here
                would be the masthead talking to itself. */}
            <h1 className="type-display-l max-w-[14ch]">Life through a creative lens.</h1>
            <p className="type-lead text-channel-muted mt-8">
              An independent visual publication from Dorvell Ferguson Jr. — where
              photographs, films, reporting, modeling, and collaborations become complete
              stories rather than isolated posts. The first issue is in production.
            </p>
          </div>
        </section>
      )}

      {/* --- Channel strip ---------------------------------------------- */}
      <section
        className="shell border-channel-rule border-t py-14"
        aria-labelledby="channels-heading"
      >
        <h2 id="channels-heading" className="type-meta text-channel-muted">
          Channels
        </h2>

        <ul className="editorial-grid mt-8">
          {channels.map((channel) => (
            /*
             * Spans are declared at every breakpoint, not just `lg`. The grid
             * is 4/8/12 columns, so a child with only an `lg:` span collapses
             * to one column of four on a phone — which crushes a card to ~90px
             * and wraps its headline character by character.
             */
            <li key={channel.key} className="col-span-4 md:col-span-4 lg:col-span-4">
              <Link
                href={channel.route}
                data-accent={channel.key}
                data-focus-target
                data-focus-id={`channel-card-${channel.key}`}
                data-focus-label={channel.label}
                data-focus-theme={channel.key}
                data-focus-inset="7"
                className="group border-channel-rule hover:border-channel-accent block h-full border p-6 transition-colors"
              >
                <span className="type-kicker text-channel-accent">{channel.label}</span>
                <span className="type-h3 mt-3 block">{channel.tagline}</span>
                <span className="type-caption mt-3 block">{channel.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* --- Latest ------------------------------------------------------ */}
      {latest.length > 0 && (
        <section
          className="shell border-channel-rule border-t py-14"
          aria-labelledby="latest-heading"
        >
          <h2 id="latest-heading" className="type-meta text-channel-muted">
            Latest
          </h2>

          <div className="editorial-grid mt-8">
            {latest.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                // Size communicates editorial priority, not masonry accident.
                emphasis={index === 0 ? 'feature' : 'standard'}
                className={
                  index === 0
                    ? 'col-span-4 md:col-span-8 lg:col-span-8'
                    : 'col-span-4 md:col-span-4 lg:col-span-4'
                }
                sizes={index === 0 ? 'half' : 'card'}
                headingLevel={3}
              />
            ))}
          </div>
        </section>
      )}

      {/* --- Newsletter --------------------------------------------------- */}
      <section
        className="shell border-channel-rule border-t py-16"
        aria-labelledby="newsletter-heading"
        data-newsletter-cta
      >
        <div className="measure">
          <h2 id="newsletter-heading" className="type-h3">
            Keep It In Focus
          </h2>
          <p className="type-body text-channel-muted mt-4">
            One new visual story, one behind-the-scenes note, and one selected frame or
            film. Every two weeks. Nothing else.
          </p>
          <Link
            href="/newsletter"
            data-focus-target
            data-focus-id="home-newsletter"
            data-focus-label="Keep It In Focus"
            data-focus-inset="5"
            className="type-kicker border-channel-fg/30 hover:border-channel-accent mt-6 inline-block border px-5 py-3 transition-colors"
          >
            Subscribe
          </Link>
        </div>
      </section>
    </PublicationShell>
  )
}
