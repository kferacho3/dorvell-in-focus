import { RAIL_DESTINATIONS } from '@/lib/social'

/**
 * Fixed social rail.
 *
 * Sits in the outer margin on wide viewports so it never covers the reading
 * column or sticky-header focus rings (I-03). Compact labels stay visible —
 * never icon-only — and the full destination name is announced to assistive
 * tech. On narrower screens the same destinations live in the footer.
 */
export function SocialRail() {
  return (
    <aside
      data-social-rail
      aria-label="Follow Dorvell Ferguson"
      className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 xl:block"
    >
      <nav className="border-channel-rule bg-channel-bg border-y border-l px-2 py-3">
        <p className="type-meta text-channel-muted mb-2 px-1 text-center tracking-[0.14em]">
          Follow
        </p>
        <ul className="flex flex-col">
          {RAIL_DESTINATIONS.map((social) => (
            <li key={social.key} className="border-channel-rule border-t first:border-t-0">
              <a
                href={social.href}
                rel="me noopener noreferrer"
                target="_blank"
                title={social.label}
                className={[
                  'type-kicker text-channel-fg/75 hover:text-channel-accent',
                  'flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-0.5 px-2 py-2.5',
                  'transition-colors duration-200',
                ].join(' ')}
              >
                <span aria-hidden className="text-[0.68rem] tracking-[0.12em] uppercase">
                  {social.railLabel}
                </span>
                <span className="sr-only-live">{social.label}</span>
                <span aria-hidden className="type-meta text-channel-muted normal-case">
                  {social.platform === 'Instagram' ? 'IG' : social.platform}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
