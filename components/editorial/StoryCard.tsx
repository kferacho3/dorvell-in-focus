import Link from 'next/link'

import { EditorialImage } from '@/components/media/EditorialImage'
import { StoryMeta } from '@/components/editorial/StoryMeta'
import { cn } from '@/lib/utils/cn'

import type { SizesToken } from '@/lib/media/resolve'
import type { Story } from '@/payload-types'

type StoryCardProps = {
  story: Story
  /** Visual weight. Editorial priority, not masonry accident. */
  emphasis?: 'standard' | 'feature' | 'quiet'
  sizes?: SizesToken
  priority?: boolean
  className?: string
  /** Heading level, so cards nested under a section keep a valid outline. */
  headingLevel?: 2 | 3 | 4
}

/**
 * Story card.
 *
 * One link wraps the whole card, and the headline is that link's accessible
 * name — rather than the common pattern of separate image, headline, and "read
 * more" links, which gives a screen-reader user three stops for one
 * destination and a link list full of "read more".
 *
 * The `transition-key` attribute is the stable handle the Shared Story Frame
 * (Module C) uses to make the selected image appear to travel to its
 * destination hero. It is set here, on the static markup, so the transition
 * layer never has to guess which element it is animating.
 */
export function StoryCard({
  story,
  emphasis = 'standard',
  sizes = 'card',
  priority = false,
  className,
  headingLevel = 3,
}: StoryCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  const headline = story.cardHeadlineOverride || story.title

  return (
    <article
      className={cn('group relative flex flex-col', className)}
      // `data-accent`, not `data-channel`: a card points at a channel, it does
      // not sit inside one. Taking the whole environment would drag 4KFERG's
      // near-black rule colour onto the light homepage.
      data-accent={story.channel ?? undefined}
    >
      {story.leadMedia && (
        <div
          className="crop-marks mb-5 overflow-hidden"
          /*
           * Marks this image as the shared-frame candidate. The transition name
           * itself is assigned at click time by SharedStoryFrame, because
           * `view-transition-name` must be unique in the document — baking a
           * per-story name into every card breaks as soon as one story appears
           * twice on a page.
           */
          data-story-frame
        >
          <EditorialImage
            media={story.leadMedia}
            sizes={sizes}
            priority={priority}
            imageClassName={cn(
              'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              // Motion is opt-out via the reduced-motion contract in
              // styles/motion.css, which zeroes the duration globally.
              'group-hover:scale-[1.02]',
            )}
          />
        </div>
      )}

      {story.kicker && (
        <p className="type-meta text-channel-accent mb-2">{story.kicker}</p>
      )}

      <Heading
        className={cn(
          emphasis === 'feature' && 'type-h2',
          emphasis === 'standard' && 'type-h3',
          emphasis === 'quiet' && 'type-lead font-medium',
        )}
      >
        <Link
          href={`/story/${story.slug}`}
          // Stretches the link over the whole card so the image and metadata
          // are clickable without becoming separate tab stops.
          className="after:absolute after:inset-0 after:content-['']"
        >
          {headline}
        </Link>
      </Heading>

      {story.dek && emphasis !== 'quiet' && (
        <p className="type-body text-channel-muted mt-3 max-w-[46ch]">{story.dek}</p>
      )}

      <StoryMeta story={story} className="mt-4" />
    </article>
  )
}
