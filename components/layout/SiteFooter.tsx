import Link from 'next/link'

import { Wordmark } from '@/components/layout/FocusMark'
import { SocialIcon } from '@/components/media/SocialIcon'
import { getChannels } from '@/lib/cms/channel-settings'
import { PORTFOLIO_URL, SOCIAL_DESTINATIONS } from '@/lib/social'

const LEGAL_LINKS = [
  { href: '/policies', label: 'Policies' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/disclosures', label: 'Disclosures' },
] as const

const READ_LINKS = [
  { href: '/archive', label: 'Archive' },
  { href: '/search', label: 'Search' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/feed.xml', label: 'RSS' },
] as const

/**
 * Site footer.
 *
 * Four honest columns rather than a repeating link wall (plan §3.2). The
 * statement column exists so the publication can explain itself to someone who
 * arrived on a single story from search and scrolled to the bottom wondering
 * what this place is.
 */
export async function SiteFooter() {
  const channels = await getChannels()
  const year = new Date().getFullYear()

  return (
    <footer data-site-footer className="border-channel-rule mt-24 border-t">
      <div className="shell py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Wordmark className="text-[1.05rem]" />
            <p className="type-caption mt-5 max-w-[34ch]">
              The independent visual publication of Dorvell Ferguson Jr. Photographs,
              films, reporting, modeling, and collaborations — told as complete stories.
            </p>
            <a
              href={PORTFOLIO_URL}
              data-focus-target
              data-focus-id="footer-portfolio"
              data-focus-label="Portfolio and booking"
              data-focus-inset="4"
              className="type-kicker border-channel-fg/25 hover:border-channel-accent mt-6 inline-block border-b pb-1 transition-colors"
            >
              Portfolio &amp; booking
            </a>
          </div>

          <nav aria-labelledby="footer-channels">
            <h2 id="footer-channels" className="type-meta text-channel-muted">
              Channels
            </h2>
            <ul className="mt-5 space-y-3">
              {channels.map((channel) => (
                <li key={channel.key}>
                  <Link
                    href={channel.route}
                    data-focus-target
                    data-focus-id={`footer-channel-${channel.key}`}
                    data-focus-label={channel.label}
                    data-focus-theme={channel.key}
                    data-focus-inset="4"
                    className="type-kicker hover:opacity-60"
                  >
                    {channel.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-read">
            <h2 id="footer-read" className="type-meta text-channel-muted">
              Read
            </h2>
            <ul className="mt-5 space-y-3">
              {READ_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-focus-target
                    data-focus-id={`footer-${link.label.toLowerCase()}`}
                    data-focus-label={link.label}
                    data-focus-inset="4"
                    className="type-kicker hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-follow">
            <h2 id="footer-follow" className="type-meta text-channel-muted">
              Follow
            </h2>
            <ul className="mt-5 space-y-3">
              {SOCIAL_DESTINATIONS.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    rel="me noopener noreferrer"
                    target="_blank"
                    data-focus-target
                    data-focus-id={`footer-social-${social.key}`}
                    data-focus-label={`${social.handle} on ${social.platform}`}
                    data-focus-inset="4"
                    className="type-kicker inline-flex items-center gap-2.5 hover:opacity-60"
                  >
                    <SocialIcon name={social.key} className="text-channel-muted" />
                    {social.handle}
                    {/* The platform is part of the accessible name — two
                        Instagram accounts would otherwise be ambiguous. */}
                    <span className="sr-only-live"> on {social.platform}</span>
                    <span aria-hidden className="text-channel-muted ml-2 normal-case">
                      {social.platform}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-channel-rule mt-16 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
          <p className="type-meta text-channel-muted">
            © {year} Dorvell Ferguson Jr. All photographs and films are his own work or
            are credited to their rights holder.
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-focus-target
                  data-focus-id={`footer-legal-${link.label.toLowerCase()}`}
                  data-focus-label={link.label}
                  data-focus-inset="4"
                  className="type-meta text-channel-muted hover:opacity-60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
