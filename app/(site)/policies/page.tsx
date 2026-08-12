import Link from 'next/link'

import { StaticPage } from '@/components/layout/StaticPage'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Policies',
  description:
    'Privacy, terms, accessibility, disclosures, partnerships, and how FERG IN FOCUS handles the work and the people in it.',
}

const POLICY_LINKS = [
  {
    href: '/privacy',
    label: 'Privacy',
    summary: 'What is collected when you read, subscribe, or write in — and what is never collected.',
  },
  {
    href: '/terms',
    label: 'Terms & copyright',
    summary: 'How you may use the photographs, films, and writing published here, and what needs permission.',
  },
  {
    href: '/disclosures',
    label: 'Disclosures',
    summary: 'Sponsored, gifted, commissioned, and affiliate relationships — labeled on the story, before you read.',
  },
  {
    href: '/accessibility',
    label: 'Accessibility',
    summary: 'How the site is built to stay readable and navigable, and what is still being finished.',
  },
] as const

/**
 * Policies hub.
 *
 * One place to enter the legal and editorial rules of the publication, with
 * short summaries that point at the pages that carry the full wording.
 */
export default function PoliciesPage() {
  return (
    <StaticPage
      kicker="Legal"
      title="Policies"
      lead="How this publication treats your privacy, the work, commercial relationships, and the people who appear in the frame."
      updated="August 2026"
    >
      <p>
        FERG IN FOCUS is an independent visual publication. These policies describe what
        actually happens here — not a template for a site that might exist someday. If
        practice changes, the wording changes with it.
      </p>

      <h2>At a glance</h2>
      <ul className="not-prose border-channel-rule mt-6 border-t">
        {POLICY_LINKS.map((entry) => (
          <li
            key={entry.href}
            className="border-channel-rule grid gap-2 border-b py-5 md:grid-cols-[12rem_1fr] md:gap-6"
          >
            <Link
              href={entry.href}
              className="type-kicker text-channel-accent hover:opacity-70"
            >
              {entry.label}
            </Link>
            <p className="type-body text-channel-muted m-0">{entry.summary}</p>
          </li>
        ))}
      </ul>

      <h2>Sponsorships, partnerships, and collaborations</h2>
      <p>
        Brand collaborations, commissioned case files, and gifted products are welcome
        when they fit the work. Every commercial relationship is disclosed at the top of
        the story in plain language — never buried after the last paragraph. Editorial
        control of what is written and shown stays with Dorvell, including on paid work.
      </p>
      <p>
        For partnership enquiries, use the{' '}
        <Link href="/contact">contact page</Link> and say you are writing about a
        collaboration. The full label set and wording live on the{' '}
        <Link href="/disclosures">disclosures</Link> page.
      </p>

      <h2>Ads, gifts, and affiliate links</h2>
      <p>
        A gifted product is labeled as gifted. A paid placement is labeled as sponsored.
        Where a link earns a commission, it is marked as an affiliate link. Opinions in
        the story remain Dorvell&apos;s; a gift or fee does not buy a rewrite of judgment.
        Details and the exact statements used on stories are on{' '}
        <Link href="/disclosures">disclosures</Link>.
      </p>

      <h2>Privacy and copyright</h2>
      <p>
        Reading alone sets no cookie and builds no profile. Newsletter addresses and
        contact messages are kept only as long as they are useful, and are never sold.
        Photographs, films, and writing remain under copyright — sharing a link is
        welcome; republishing the work is not, without permission. Full wording:{' '}
        <Link href="/privacy">privacy</Link> and <Link href="/terms">terms</Link>.
      </p>

      <h2>Corrections and people in the frame</h2>
      <p>
        If something in a story is wrong, it is corrected on the story with a dated note
        rather than edited silently. If you appear in a photograph or film and want to
        discuss its use, write via <Link href="/contact">contact</Link> — those requests
        are handled promptly.
      </p>

      <h2>Community and contact</h2>
      <p>
        This publication does not run an open comment board. Enquiries, corrections,
        casting, press, and collaboration notes go through the{' '}
        <Link href="/contact">contact page</Link>. Messages that are abusive, harassing,
        or sent in bad faith may be ignored or deleted without reply. The goal is a
        direct line for real work and real corrections — not a free-for-all.
      </p>

      <h2>Still have questions?</h2>
      <p>
        Write anytime via the <Link href="/contact">contact page</Link> if something
        about these policies is unclear. As the publication grows, the policies will
        grow with it — dated at the top of each page when they do.
      </p>
    </StaticPage>
  )
}
