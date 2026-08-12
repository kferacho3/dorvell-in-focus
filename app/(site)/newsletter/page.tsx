import { StaticPage } from '@/components/layout/StaticPage'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Keep It In Focus',
  description:
    'One new visual story, one behind-the-scenes note, and one selected frame or film. Every two weeks.',
}

export default function NewsletterPage() {
  return (
    <StaticPage
      kicker="Newsletter"
      title="Keep It In Focus"
      lead="One new visual story, one behind-the-scenes note, and one selected frame or film. Every two weeks. Nothing else."
    >
      <p>
        The newsletter exists so the work reaches people directly rather than through
        whatever a platform decides to show them that week. It links back to complete
        stories here — it is not a second, shorter publication.
      </p>

      <h2>What arrives</h2>
      <ul>
        <li>One new story, with the thinking behind it</li>
        <li>
          One behind-the-scenes note — a frame that did not make the edit, a lesson from a
          shoot
        </li>
        <li>One selected photograph or film from the archive</li>
        <li>Occasionally, a collaboration or booking update</li>
      </ul>

      <h2>What does not</h2>
      <p>
        No daily sends, no sponsored blasts, and no sharing your address with anyone. You
        can leave at any time using the link in every email, and leaving removes you
        immediately.
      </p>

      {/*
       * Deliberately not a form yet. A subscribe field that silently discards
       * addresses is worse than no field, and the provider decision is still
       * open (plan §6.9) — it turns on ownership, exportability, and double
       * opt-in support, not on visual familiarity.
       */}
      <div data-newsletter-cta className="border-channel-rule not-prose my-10 border p-6">
        <p className="type-meta text-channel-accent">Coming with Issue 001</p>
        <p className="type-body mt-3">
          Subscriptions open when the first issue publishes. Until then, the work is on{' '}
          <a
            href="https://www.instagram.com/fergphotography/"
            rel="noopener noreferrer"
            target="_blank"
          >
            @fergphotography
          </a>{' '}
          and{' '}
          <a
            href="https://www.instagram.com/dorvellfergusonjr/"
            rel="noopener noreferrer"
            target="_blank"
          >
            @dorvellfergusonjr
          </a>
          .
        </p>
      </div>

      <p className="type-caption">
        Read how subscriber information is handled in the{' '}
        <a href="/privacy">privacy notice</a>.
      </p>
    </StaticPage>
  )
}
