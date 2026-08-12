import { StaticPage } from '@/components/layout/StaticPage'
import { PORTFOLIO_URL, SOCIAL_DESTINATIONS } from '@/lib/social'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Commissions, casting, press, corrections, and collaboration enquiries for Dorvell Ferguson Jr.',
}

export default function ContactPage() {
  return (
    <StaticPage
      kicker="Contact"
      title="Get in touch"
      lead="Commissions, casting, press, and corrections. Say which one you are and it will reach the right place faster."
    >
      <h2>Commissions and bookings</h2>
      <p>
        Portraits, concerts, events, sports, fashion, and studio sessions. Include the
        date, location, and what the images are for — usage shapes the quote more than
        anything else. Booking runs through the{' '}
        <a href={PORTFOLIO_URL} rel="noopener noreferrer" target="_blank">
          portfolio
        </a>
        .
      </p>

      <h2>Casting and modeling</h2>
      <p>
        For agencies, designers, photographers, and casting teams. Include the project,
        the dates, and the usage terms.
      </p>

      <h2>Press</h2>
      <p>
        For interviews, features, and image licensing requests. Please name the
        publication and the deadline.
      </p>

      <h2>Corrections</h2>
      <p>
        If something published here is wrong, say so and it will be fixed. Corrections are
        recorded on the story itself with the date, rather than the text being quietly
        changed — the record of what was said matters as much as the fix.
      </p>

      <h2>Where to reach him</h2>
      <ul className="not-prose space-y-3">
        {SOCIAL_DESTINATIONS.map((social) => (
          <li key={social.key} className="type-body">
            <a
              href={social.href}
              rel="me noopener noreferrer"
              target="_blank"
              className="underline underline-offset-4"
            >
              {social.handle}
            </a>
            <span className="type-meta text-channel-muted ml-3">{social.platform}</span>
          </li>
        ))}
      </ul>

      {/*
       * A contact form lands with the submissions collection and its rate
       * limiting and retention policy. Publishing a mailto: in the meantime is
       * honest; publishing a form that drops messages is not.
       */}
      <p className="type-caption mt-10">
        A contact form arrives with Issue 001. Until then the accounts above are the
        fastest route.
      </p>
    </StaticPage>
  )
}
