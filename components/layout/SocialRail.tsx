import { SocialIcon } from '@/components/media/SocialIcon'
import { RAIL_DESTINATIONS } from '@/lib/social'

/**
 * Fixed social rail.
 *
 * Sits in the outer margin on wide viewports so it never covers the reading
 * column or a sticky-header focus ring (ledger I-03); the page reserves its
 * width via `--social-rail-width`. Below that breakpoint the same destinations
 * live in the footer rather than as a floating obstruction.
 *
 * Icon-only *visually*, never icon-only semantically: each link carries its
 * full destination as its accessible name, and the handle slides out on hover
 * or focus. The plan asks for exactly this — "icon + accessible label on
 * focus" (§3.2) — because "Instagram" alone would be ambiguous when two of
 * these go to different Instagram accounts.
 */
export function SocialRail() {
  return (
    <aside
      data-social-rail
      aria-label="Follow Dorvell Ferguson"
      className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 xl:block"
    >
      <nav className="border-channel-rule bg-channel-bg border-y border-l">
        <p className="type-meta text-channel-muted border-channel-rule border-b px-3 py-2 text-center">
          Follow
        </p>

        <ul className="flex flex-col">
          {RAIL_DESTINATIONS.map((social) => (
            <li
              key={social.key}
              className="border-channel-rule border-t first:border-t-0"
            >
              <a
                href={social.href}
                rel="me noopener noreferrer"
                target="_blank"
                className={[
                  'group text-channel-fg/70 hover:text-channel-accent focus-visible:text-channel-accent',
                  'relative flex min-h-11 min-w-11 items-center justify-center px-3',
                  'transition-colors duration-200',
                ].join(' ')}
              >
                <SocialIcon name={social.key} />

                {/* The one accessible name that matters — two of these are
                    different Instagram accounts. */}
                <span className="sr-only-live">{social.label}</span>

                {/*
                 * Handle slides out to the left on hover or keyboard focus.
                 * Hidden from assistive tech because the link is already named,
                 * and pointer-events off so it can never intercept the click.
                 */}
                <span
                  aria-hidden
                  className={[
                    'type-meta bg-channel-bg border-channel-rule text-channel-fg',
                    'pointer-events-none absolute right-full mr-px border px-3 py-2 whitespace-nowrap',
                    'opacity-0 transition-opacity duration-150',
                    'group-hover:opacity-100 group-focus-visible:opacity-100',
                  ].join(' ')}
                >
                  {social.handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
