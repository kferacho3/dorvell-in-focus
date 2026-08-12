import { StaticPage } from '@/components/layout/StaticPage'
import { getCms } from '@/lib/cms/client'
import { RELATIONSHIP_TYPES } from '@/payload/collections/Partners'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Disclosures',
  description:
    'How FERG IN FOCUS labels sponsored, gifted, commissioned, and affiliate relationships.',
}

const LABELS = new Map<string, string>(
  RELATIONSHIP_TYPES.map((entry) => [entry.value, entry.label]),
)

type Statement = { relationshipType: string; statement: string }

async function getStatements(): Promise<Statement[]> {
  try {
    const payload = await getCms()
    const global = await payload.findGlobal({ slug: 'disclosureSettings', depth: 0 })

    // `relationshipType` is a narrow literal union in the generated types;
    // widening to string here keeps the page tolerant of a value added to the
    // enum before types are regenerated, rather than failing to render.
    return (global?.statements ?? []).flatMap((entry) =>
      entry.relationshipType && entry.statement
        ? [
            {
              relationshipType: String(entry.relationshipType),
              statement: entry.statement,
            },
          ]
        : [],
    )
  } catch {
    return []
  }
}

/**
 * Disclosure policy.
 *
 * The wording is read from the CMS so that the policy page and the disclosure
 * printed on an individual story are literally the same text. If they were
 * maintained separately they would drift, and a policy that does not match
 * practice is worse than none.
 */
export default async function DisclosuresPage() {
  const statements = await getStatements()

  return (
    <StaticPage
      kicker="Legal"
      title="Disclosures"
      lead="Every commercial relationship behind a story is stated on that story, in plain words, before you read it."
      updated="August 2026"
    >
      <p>
        FERG X is a visual label for collaborations. It is not a claim that money changed
        hands. Each case file records exactly what the relationship was, and the relevant
        disclosure appears at the top of the story — not at the bottom, where a reader who
        has already finished has not actually been told anything.
      </p>
      <p>
        Partnership and sponsorship enquiries go through the{' '}
        <a href="/contact">contact page</a>. The wider policy set lives at{' '}
        <a href="/policies">policies</a>.
      </p>

      <h2>The labels used</h2>
      <p>
        These are factual descriptions, not marketing language. &ldquo;Sponsor&rdquo;
        means payment was made for the work. &ldquo;Gifted&rdquo; means a product arrived
        and nothing else did. A story cannot publish here while its partner relationship
        is unverified.
      </p>

      {statements.length > 0 ? (
        <dl className="not-prose border-channel-rule mt-8 border-t">
          {statements.map((entry) => (
            <div
              key={entry.relationshipType}
              className="border-channel-rule grid gap-2 border-b py-5 md:grid-cols-[14rem_1fr] md:gap-6"
            >
              <dt className="type-kicker text-channel-accent">
                {LABELS.get(entry.relationshipType) ?? entry.relationshipType}
              </dt>
              <dd className="type-body m-0">{entry.statement}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <ul>
          {RELATIONSHIP_TYPES.map((entry) => (
            <li key={entry.value}>{entry.label}</li>
          ))}
        </ul>
      )}

      <h2>Editorial control</h2>
      <p>
        Dorvell retains editorial control of what is written and shown, including on paid
        work. A partner may correct a factual error or a misuse of their brand. A partner
        may not remove a disclosed opinion.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Where a link earns a commission it is marked as an affiliate link and carries the
        appropriate markup for search engines. Nothing appears here because it pays; the
        commission follows the recommendation, never the other way around.
      </p>

      <h2>Press written about Dorvell</h2>
      <p>
        Articles by other publications are linked and credited to their author and outlet.
        Their reporting is not reproduced here and presented as original work.
      </p>

      <h2>Opinions</h2>
      <p>
        Unless a disclosure says otherwise, judgments in a story are Dorvell&apos;s. A
        gift, fee, or affiliate relationship does not buy a rewrite of that judgment, and
        it does not convert a personal view into a partner&apos;s press release.
      </p>
    </StaticPage>
  )
}
