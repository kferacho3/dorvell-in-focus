import { StaticPage } from '@/components/layout/StaticPage'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use and image rights for FERG IN FOCUS.',
}

/**
 * Terms of use.
 *
 * Short and specific to what this site is: a publication of photographs and
 * films. Needs a legal review before public launch — recorded in the
 * conformance ledger rather than treated as settled.
 */
export default function TermsPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Terms"
      lead="What you may do with the work published here, and what needs permission first."
      updated="August 2026"
    >
      <h2>The work</h2>
      <p>
        All photographs, films, and written material on FERG IN FOCUS are the copyright of
        Dorvell Ferguson Jr., or of the rights holder credited alongside them. Publication
        here does not place anything in the public domain.
      </p>

      <h2>What you may do without asking</h2>
      <ul>
        <li>Read, print, and save stories for your own use.</li>
        <li>
          Link to any page. Deep links are welcome, and published URLs are kept working —
          a changed slug gets a redirect.
        </li>
        <li>
          Quote a short passage with attribution and a link, as ordinary commentary and
          criticism allow.
        </li>
        <li>Share a story on social platforms using its normal share preview.</li>
      </ul>

      <h2>What needs permission</h2>
      <ul>
        <li>Reproducing a photograph or film, in whole or in part, anywhere else.</li>
        <li>Any commercial use, including in advertising, packaging, or merchandise.</li>
        <li>Training a machine-learning model on the images or films published here.</li>
        <li>Republishing an article in full, rather than quoting from it.</li>
        <li>Editing, cropping, recolouring, or applying filters to a published image.</li>
      </ul>
      <p>
        Licensing enquiries go through the <a href="/contact">contact page</a>. Reasonable
        requests are usually granted; the point is knowing where the work is used.
      </p>

      <h2>People in the photographs</h2>
      <p>
        Images of identifiable people are published under the rights and consent recorded
        for each one. If you appear in a photograph here and want to discuss its use, get
        in touch and it will be handled promptly and without argument.
      </p>

      <h2>Accuracy</h2>
      <p>
        Stories are researched and checked. If something is wrong, it is corrected on the
        story with a dated note rather than edited silently. Report errors through the{' '}
        <a href="/contact">contact page</a>.
      </p>

      <h2>External links</h2>
      <p>
        Links to other sites are provided because they are useful or because credit is
        owed. Their content is not controlled here.
      </p>
    </StaticPage>
  )
}
