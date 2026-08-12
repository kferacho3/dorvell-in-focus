import { notFound } from 'next/navigation'

import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { StoryCard } from '@/components/editorial/StoryCard'
import { StoryMeta } from '@/components/editorial/StoryMeta'
import { PublicationShell } from '@/components/layout/PublicationShell'
import { EditorialImage } from '@/components/media/EditorialImage'
import { isChannelKey } from '@/lib/channels'
import {
  getAllPublishedSlugs,
  getRelatedStories,
  getStoryBySlug,
} from '@/lib/cms/queries'

import type { Metadata } from 'next'

type StoryPageProps = { params: Promise<{ slug: string }> }

export const revalidate = 3600

/**
 * Prerender every published story at build time.
 *
 * `dynamicParams` stays on so a story published after the build is still
 * served — rendered on demand, then cached.
 */
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) return { title: 'Story not found' }

  const description = story.seoDescription ?? story.dek ?? undefined

  return {
    title: story.seoTitle ?? story.title,
    description,
    alternates: story.canonicalUrl ? { canonical: story.canonicalUrl } : undefined,
    robots: story.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      title: story.seoTitle ?? story.title,
      description,
      publishedTime: story.publishedAt ?? undefined,
      modifiedTime: story.updatedAt,
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const story = await getStoryBySlug(slug)

  if (!story) notFound()

  const related = await getRelatedStories(story, 3)
  const channel = isChannelKey(story.channel) ? story.channel : 'publication'
  const isFullBleedLead = story.leadVariant === 'fullBleed'

  return (
    <PublicationShell channel={channel}>
      <article>
        {/* --- Header --------------------------------------------------- */}
        <header className={isFullBleedLead ? '' : 'shell pt-14 pb-10 lg:pt-20'}>
          {isFullBleedLead && story.leadMedia ? (
            <>
              <div
                className="bleed"
                style={{ viewTransitionName: `story-${story.id}` } as React.CSSProperties}
              >
                <EditorialImage media={story.leadMedia} sizes="fullBleed" priority />
              </div>
              <div className="shell pt-10">
                <StoryHeading story={story} />
              </div>
            </>
          ) : (
            <>
              <StoryHeading story={story} />
              {story.leadMedia && (
                <div
                  className="crop-marks mt-10"
                  style={
                    { viewTransitionName: `story-${story.id}` } as React.CSSProperties
                  }
                >
                  <EditorialImage media={story.leadMedia} sizes="lead" priority />
                </div>
              )}
            </>
          )}
        </header>

        {/* Content warnings and disclosures come before the story, never after
            it — a reader who has finished has not been warned or informed. */}
        {story.contentWarning && (
          <div className="shell">
            <p className="border-channel-accent measure type-caption mx-auto border-l-2 py-2 pl-4">
              {story.contentWarning}
            </p>
          </div>
        )}

        {story.disclosure && (
          <div className="shell my-8">
            <aside
              data-disclosure
              className="measure border-channel-accent mx-auto border-y py-4"
            >
              <p className="type-meta text-channel-accent mb-2">Disclosure</p>
              <p className="type-caption m-0">{story.disclosure}</p>
            </aside>
          </div>
        )}

        <BlockRenderer blocks={story.contentBlocks} />
      </article>

      {related.length > 0 && (
        <section
          className="shell border-channel-rule mt-20 border-t py-14"
          aria-labelledby="related-heading"
          data-related-stories
        >
          <h2 id="related-heading" className="type-meta text-channel-muted">
            Continue in focus
          </h2>
          <div className="editorial-grid mt-8">
            {related.map((entry) => (
              <StoryCard
                key={entry.id}
                story={entry}
                className="col-span-4 md:col-span-4 lg:col-span-4"
              />
            ))}
          </div>
        </section>
      )}
    </PublicationShell>
  )
}

function StoryHeading({ story }: { story: Awaited<ReturnType<typeof getStoryBySlug>> }) {
  if (!story) return null

  return (
    <div className="measure">
      {story.kicker && (
        <p className="type-meta text-channel-accent mb-4">{story.kicker}</p>
      )}
      <h1 className="type-h1">{story.title}</h1>
      {story.dek && <p className="type-lead text-channel-muted mt-6">{story.dek}</p>}
      <StoryMeta story={story} className="mt-6" />
    </div>
  )
}
