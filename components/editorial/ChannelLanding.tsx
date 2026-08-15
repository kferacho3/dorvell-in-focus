import { StoryCard } from '@/components/editorial/StoryCard'
import { PublicationShell } from '@/components/layout/PublicationShell'
import { getChannelByKey } from '@/lib/cms/channel-settings'
import { getPublishedStories } from '@/lib/cms/queries'

import type { ChannelKey } from '@/lib/channels'

type ChannelLandingProps = {
  channel: ChannelKey
  /** Optional extra section rendered under the masthead, before the grid. */
  children?: React.ReactNode
}

/**
 * Shared channel landing page.
 *
 * All five channels share this structure — masthead, statement, then work —
 * and differ through their CSS custom property theme rather than through
 * separate layouts. That is what lets a reader feel they have entered a
 * different room without ever wondering whether they left the publication.
 *
 * Channel-specific interactions (the photography Grid ↔ Sequence toggle, the
 * 4KFERG screening hero) compose in through `children` rather than by forking
 * this component.
 */
export async function ChannelLanding({ channel, children }: ChannelLandingProps) {
  const [resolved, { docs: stories }] = await Promise.all([
    getChannelByKey(channel),
    getPublishedStories({ channel, limit: 12 }),
  ])

  return (
    <PublicationShell channel={channel}>
      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        <div
          className="measure"
          data-focus-target
          data-focus-default="true"
          data-focus-id={`${channel}-hero`}
          data-focus-label={resolved.label}
          data-focus-theme={channel}
          data-focus-inset="10"
          data-focus-point={channel === 'motion' || undefined}
        >
          <p className="type-meta text-channel-accent">{resolved.tagline}</p>
          <h1 className="type-h1 mt-5 max-w-[14ch]">{resolved.label}</h1>
          <p className="type-lead text-channel-muted mt-6">{resolved.description}</p>
        </div>
      </section>

      {children}

      {stories.length > 0 ? (
        <section className="shell py-14" aria-labelledby="channel-work">
          <h2 id="channel-work" className="type-meta text-channel-muted">
            Selected work
          </h2>
          <div className="editorial-grid mt-8">
            {stories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                emphasis={index === 0 ? 'feature' : 'standard'}
                className={
                  index === 0
                    ? 'col-span-4 md:col-span-8 lg:col-span-8'
                    : 'col-span-4 md:col-span-4 lg:col-span-4'
                }
                sizes={index === 0 ? 'half' : 'card'}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="shell py-20">
          <p className="type-lead text-channel-muted measure">
            Nothing published in this channel yet. The first issue is in production — the
            work is being selected, credited, and rights-checked before it appears here.
          </p>
        </section>
      )}
    </PublicationShell>
  )
}
