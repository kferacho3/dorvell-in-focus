import Link from 'next/link'

import { cn } from '@/lib/utils/cn'

import type { ResolvedChannel } from '@/lib/cms/channel-settings'
import type { ThemeKey } from '@/lib/channels'

type ChannelNavProps = {
  channels: readonly ResolvedChannel[]
  current: ThemeKey
  className?: string
}

/**
 * Primary channel navigation.
 *
 * The current channel is marked three ways — `aria-current`, a rule under the
 * label, and a mono bullet — because color alone can never be the only signal
 * (plan §4.2). The bullet in particular survives forced-colors mode, where a
 * custom underline color is discarded by the OS.
 *
 * Plain links, server-rendered. Navigation works before any JavaScript loads,
 * and the motion layer attaches to these same anchors later.
 */
export function ChannelNav({ channels, current, className }: ChannelNavProps) {
  return (
    <nav data-channel-nav aria-label="Channels" className={className}>
      <ul className="flex items-center gap-x-6 gap-y-2 lg:gap-x-8">
        {channels.map((channel) => {
          const isCurrent = channel.key === current

          return (
            <li key={channel.key}>
              <Link
                href={channel.route}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'type-kicker group relative inline-flex items-center gap-1.5 py-2',
                  'transition-opacity duration-200',
                  isCurrent ? 'opacity-100' : 'opacity-65 hover:opacity-100',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'text-channel-accent font-[family-name:var(--font-mono)] text-[0.7em] leading-none',
                    isCurrent ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  ●
                </span>

                <span className="relative">
                  {channel.label}
                  <span
                    aria-hidden
                    className={cn(
                      'bg-channel-accent absolute -bottom-1 left-0 h-px w-full origin-left',
                      'transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isCurrent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
