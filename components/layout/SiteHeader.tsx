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
        <Link
          href="/"
          data-site-logo
          data-focus-target
          data-focus-id="site-logo"
          data-focus-label="Publication home"
          data-focus-inset="5"
          data-focus-point="true"
          className="ferg-brand-link shrink-0"
          aria-label="FERG IN FOCUS — publication home"
        >
          <Wordmark />
        </Link>

        <ChannelNav
          channels={channels}
          current={channel}
          idPrefix="header-channel"
          className="hidden lg:block"
        />

        <div className="flex items-center gap-4">
          <form
            action="/search"
            method="get"
            role="search"
            className="border-channel-fg/20 focus-within:border-channel-accent hidden items-center border sm:flex"
          >
            <label htmlFor="header-q" className="sr-only-live">
              Search the publication
            </label>
            <input
              id="header-q"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Search…"
              data-focus-target
              data-focus-id="header-search"
              data-focus-label="Search"
              data-focus-inset="3"
              className="type-kicker text-channel-fg placeholder:text-channel-muted min-h-10 w-36 bg-transparent px-3 py-2 outline-none lg:w-48"
            />
            <button
              type="submit"
              data-focus-target
              data-focus-id="header-search-submit"
              data-focus-label="Run search"
              data-focus-inset="3"
              className="type-kicker text-channel-muted hover:text-channel-accent border-channel-fg/20 min-h-10 border-l px-3 transition-colors"
            >
              Go
            </button>
          </form>

          <Link
            href="/tags"
            data-focus-target
            data-focus-id="header-tags"
            data-focus-label="Browse tags"
            className="type-kicker hidden opacity-70 hover:opacity-100 md:inline"
          >
            Tags
          </Link>

          <Link
            href="/newsletter"
            data-focus-target
            data-focus-id="header-newsletter"
            data-focus-label="Newsletter"
            data-focus-inset="4"
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
