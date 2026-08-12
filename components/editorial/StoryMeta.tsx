import { formatDuration } from '@/lib/media/resolve'
import { cn } from '@/lib/utils/cn'

import type { Story } from '@/payload-types'

type StoryMetaProps = {
  story: Pick<
    Story,
    | 'publishedAt'
    | 'eventDate'
    | 'dateDisplayMode'
    | 'readingMinutes'
    | 'watchSeconds'
    | 'storyType'
  >
  className?: string
}

const STORY_TYPE_LABELS: Record<string, string> = {
  article: 'Essay',
  photoEssay: 'Photo essay',
  film: 'Film',
  videoEssay: 'Video essay',
  modelingStory: 'Modeling',
  collaboration: 'Case file',
  interview: 'Interview',
  fieldNote: 'Field note',
  eventDispatch: 'Dispatch',
  review: 'Review',
}

export function storyTypeLabel(storyType: string | null | undefined): string | null {
  if (!storyType) return null
  return STORY_TYPE_LABELS[storyType] ?? null
}

/**
 * Formats a date without a timezone surprise.
 *
 * Payload stores timestamps in UTC. Rendering them with the server's local zone
 * makes a story published late in the evening show yesterday's date to some
 * readers, which for dated editorial work is a real error rather than a
 * cosmetic one.
 */
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * Story metadata line.
 *
 * Reading time and watch time are shown separately, never summed. "8 min read"
 * on a page whose substance is a 34-second film misdescribes what is on offer.
 */
export function StoryMeta({ story, className }: StoryMetaProps) {
  const mode = story.dateDisplayMode ?? 'published'

  const published =
    mode === 'published' || mode === 'both' ? formatDate(story.publishedAt) : null
  const event = mode === 'event' || mode === 'both' ? formatDate(story.eventDate) : null

  const watch = formatDuration(story.watchSeconds)
  const read =
    story.readingMinutes && story.readingMinutes > 0
      ? `${story.readingMinutes} min read`
      : null
  const type = storyTypeLabel(story.storyType)

  const parts = [type, event, published, watch ? `${watch} watch` : null, read].filter(
    Boolean,
  )

  if (parts.length === 0) return null

  return (
    <p
      className={cn(
        'type-meta text-channel-muted flex flex-wrap items-center gap-x-3',
        className,
      )}
    >
      {parts.map((part, index) => (
        <span key={`${part}`} className="flex items-center gap-3">
          {index > 0 && (
            <span aria-hidden className="bg-channel-muted/40 inline-block h-3 w-px" />
          )}
          {part}
        </span>
      ))}
    </p>
  )
}
