import { StaticPage } from '@/components/layout/StaticPage'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Accessibility',
  description:
    'How FERG IN FOCUS is built to be readable, navigable, and usable — and what is still outstanding.',
}

/**
 * Accessibility statement.
 *
 * States what is genuinely implemented and what is not. A statement that claims
 * full conformance before the manual assistive-technology pass has run would be
 * a false claim, and the people it misleads are exactly the people it is for.
 */
export default function AccessibilityPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Accessibility"
      lead="How this publication is built to be readable and navigable — including what is not finished yet."
      updated="August 2026"
    >
      <p>
        The target is WCAG 2.2 Level AA. That is a target being worked toward, not a
        certification being claimed. This statement is part of the{' '}
        <a href="/policies">policies</a> set.
      </p>

      <h2>What is in place</h2>
      <ul>
        <li>
          Every story renders on the server and stays readable with JavaScript
          unavailable. Nothing essential waits on a script.
        </li>
        <li>
          A skip link, semantic landmarks, and one logical heading outline per page.
        </li>
        <li>
          One visible focus style across the whole publication. It never changes meaning
          between channels, and the dark 4KFERG channel switches the indicator colour so
          it stays visible rather than relying on a hue that fails there.
        </li>
        <li>
          Reduced motion is honoured, and you can override the system setting in either
          direction. The preference resolves before the page paints, so there is no flash
          of motion for someone who asked for none.
        </li>
        <li>
          Colour never carries meaning alone. The current channel is marked by text
          position, a rule, and a marker as well as colour, so it survives forced-colours
          mode.
        </li>
        <li>
          Images carry human-written alt text, and captions and credits are separate
          visible information rather than alt text pressed into service.
        </li>
        <li>
          Films use the browser&apos;s native controls, which are keyboard operable and
          screen-reader labelled. Nothing autoplays with sound.
        </li>
        <li>
          Stories have a print stylesheet that keeps captions, credits, and sources.
        </li>
      </ul>

      <h2>What is not finished</h2>
      <ul>
        <li>
          The manual screen-reader pass — VoiceOver on macOS and iOS, NVDA on Windows —
          has not been completed. Automated checks catch a minority of real problems.
        </li>
        <li>
          Captions and transcripts are required before a film with dialogue publishes, but
          the existing archive has not all been captioned yet.
        </li>
        <li>Testing at 400% zoom and in forced-colours mode is outstanding.</li>
      </ul>

      <h2>If something does not work</h2>
      <p>
        Tell us. A specific report — the page, what you were using, and what happened — is
        genuinely useful and will be acted on. Use the <a href="/contact">contact page</a>
        . Accessibility problems are treated as defects, not requests.
      </p>
    </StaticPage>
  )
}
