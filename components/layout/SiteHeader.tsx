import Link from 'next/link'

import { Wordmark } from '@/components/layout/FocusMark'
import { ApertureMenu } from '@/components/navigation/ApertureMenu'
import { ChannelNav } from '@/components/navigation/ChannelNav'
import { getChannels } from '@/lib/cms/channel-settings'

import type { ThemeKey } from '@/lib/channels'

type SiteHeaderProps = {
  channel: ThemeKey
}

/**
 * The publication masthead.
 *
 * Server-rendered, and navigable with no client JavaScript at all. The mobile
 * menu is a native `<details>` disclosure rather than a React state machine —
 * which means it opens, closes, traps nothing, and is announced correctly
 * before hydration and after a failed chunk load.
 *
 * The Aperture Menu (Module A) will *enhance* this element rather than replace
 * it: same links, same DOM, richer choreography where the device can afford
 * it. Building the enhancement first is how sites end up with navigation that
 * only works once the bundle arrives.
 */
export async function SiteHeader({ channel }: SiteHeaderProps) {
  const channels = await getChannels()

  return (
    <header
      data-site-header
      className={[
        'border-channel-rule sticky top-0 z-50 border-b',
        // A translucent masthead over a scrolling contact sheet turns type
        // into noise. Solid, always.
        'bg-channel-bg',
      ].join(' ')}
    >
      <div className="shell flex h-(--header-height) items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="FERG IN FOCUS — publication home">
          <Wordmark />
        </Link>

        <ChannelNav channels={channels} current={channel} className="hidden lg:block" />

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="type-kicker hidden opacity-70 hover:opacity-100 sm:inline"
          >
            Search
          </Link>

          <Link
            href="/newsletter"
            className={[
              'type-kicker border-channel-fg/25 hover:border-channel-accent hidden border px-3 py-2',
              'transition-colors duration-200 lg:inline-block',
            ].join(' ')}
          >
            Newsletter
          </Link>

          {/*
           * The Aperture Menu renders this same native <details>. It is a
           * client component so it can enhance the element after hydration —
           * before that, and if the chunk never arrives, the browser's own
           * disclosure behaviour is what opens the menu.
           */}
          <ApertureMenu channels={channels} current={channel} />
        </div>
      </div>
    </header>
  )
}
