import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

import type { ThemeKey } from '@/lib/channels'

type PublicationShellProps = {
  /**
   * The channel whose atmosphere this route belongs to. Declared per route
   * rather than inferred from the pathname in a layout, because inferring it
   * would require reading request headers — which opts every page out of static
   * rendering for the sake of one attribute.
   *
   * Stating it here keeps pages statically renderable and makes the channel a
   * visible, testable property of the route.
   */
  channel: ThemeKey
  children: React.ReactNode
}

/**
 * The publication shell.
 *
 * `data-channel` sits above the header and footer so a channel's atmosphere
 * covers the whole page, not just the article body — entering 4KFERG should
 * dim the room, not paste a dark rectangle into a bright one.
 */
export function PublicationShell({ channel, children }: PublicationShellProps) {
  return (
    <div
      data-channel={channel}
      className="bg-channel-bg text-channel-fg flex min-h-dvh flex-col"
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SiteHeader channel={channel} />

      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <SiteFooter />
    </div>
  )
}
