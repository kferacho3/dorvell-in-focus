import { StaticPage } from '@/components/layout/StaticPage'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What FERG IN FOCUS collects, why, and how long it is kept.',
}

/**
 * Privacy notice.
 *
 * Written to describe what the site *actually does today*, not a template of
 * what a site might do. The plan requires published disclosures to match real
 * behaviour (§13.5), and a notice that claims analytics and cookies the site
 * does not use is as inaccurate as one that omits ones it does.
 *
 * Needs a legal review before public launch. Flagged in the conformance ledger
 * rather than assumed to be sufficient.
 */
export default function PrivacyPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Privacy"
      lead="What this publication collects, why, and how long it is kept."
      updated="August 2026"
    >
      <p>
        FERG IN FOCUS is a small independent publication. It collects as little as it can
        and keeps it for as short a time as is useful. Contact information is never sold,
        rented, or traded.
      </p>
      <p>
        This page is part of the wider <a href="/policies">policies</a> set. If something
        here is unclear, write via the <a href="/contact">contact page</a>.
      </p>

      <h2>What is collected</h2>
      <p>
        <strong>Nothing, if you only read.</strong> Reading a story sets no cookie,
        creates no account, and builds no profile of you.
      </p>
      <p>
        <strong>Your motion preference</strong> is stored in your own browser using local
        storage, so the site remembers whether you asked for full or reduced motion. It
        never leaves your device and is not sent anywhere.
      </p>
      <p>
        <strong>Your email address</strong>, if you subscribe to the newsletter. It is
        used to send the newsletter and nothing else. It is never sold, rented, or shared
        with advertisers.
      </p>
      <p>
        <strong>What you write in a contact form</strong>, if you send one — your name,
        your address, and your message, so a reply is possible. Messages are treated as
        private correspondence, not as public content.
      </p>

      <h2>What is not collected</h2>
      <ul>
        <li>No account system and no login for readers.</li>
        <li>No advertising cookies and no cross-site tracking pixels.</li>
        <li>No sale of mailing lists or enquiry details to third parties.</li>
        <li>No recording of text you select on a page, or of form field keystrokes.</li>
      </ul>

      <h2>Analytics</h2>
      <p>
        Where analytics are used, they are aggregate and privacy-aware: which pages are
        read, which stories are finished, whether a film played. No cross-site tracking,
        no advertising identifiers, and no fingerprinting. The article text you select and
        the contents of form fields are never recorded.
      </p>

      <h2>How long it is kept</h2>
      <ul>
        <li>
          Newsletter subscription: until you unsubscribe, which takes effect immediately.
        </li>
        <li>Contact messages: reviewed, then deleted after twelve months.</li>
        <li>Motion preference: until you clear your own browser storage.</li>
      </ul>

      <h2>Media served from elsewhere</h2>
      <p>
        Photographs and films are served from this publication&apos;s own content delivery
        network. Where a film is delivered by a video provider, that provider necessarily
        receives the request needed to stream it. That request is for delivery, not for
        building an advertising profile here.
      </p>

      <h2>Children</h2>
      <p>
        This publication is not directed at children under 13, and it does not knowingly
        collect personal information from them. If you believe a child has submitted
        information here, contact us and it will be deleted.
      </p>

      <h2>Your choices</h2>
      <p>
        You can unsubscribe from any email, ask what is held about you, and ask for it to
        be deleted. Write via the <a href="/contact">contact page</a> and it will be
        handled. You can also clear local storage in your browser to remove the motion
        preference at any time.
      </p>

      <h2>Changes</h2>
      <p>
        If this notice changes in a way that affects you, the date above changes and the
        change is described here rather than applied silently. Older versions are not
        rewritten to look like they always said the new thing.
      </p>
    </StaticPage>
  )
}
