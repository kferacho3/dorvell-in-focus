import Link from 'next/link'

import { cn } from '@/lib/utils/cn'

import type { Tag } from '@/payload-types'

type StoryTagsProps = {
  tags: (number | Tag)[] | null | undefined
  className?: string
}

function resolveTag(entry: number | Tag): Tag | null {
  if (typeof entry !== 'object' || entry === null) return null
  if (!entry.slug || !entry.label) return null
  if (entry.status === 'deprecated') return null
  return entry
}

/**
 * Tag chips on a story.
 *
 * Links into the controlled taxonomy landings. Only resolved, active tags
 * render — orphan IDs and deprecated entries stay invisible rather than
 * becoming dead ends.
 */
export function StoryTags({ tags, className }: StoryTagsProps) {
  const resolved = (tags ?? []).map(resolveTag).filter((tag): tag is Tag => tag !== null)

  if (resolved.length === 0) return null

  return (
    <nav aria-label="Story tags" className={cn('mt-8', className)}>
      <p className="type-meta text-channel-muted mb-3">Tagged</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {resolved.map((tag) => (
          <li key={tag.id}>
            <Link
              href={`/tags/${tag.slug}`}
              className={[
                'type-kicker text-channel-fg/80 hover:text-channel-accent',
                'border-channel-fg/20 hover:border-channel-accent border-b pb-0.5',
                'transition-colors duration-200',
              ].join(' ')}
            >
              {tag.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
