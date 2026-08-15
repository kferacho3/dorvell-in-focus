import Link from 'next/link'

import { PublicationShell } from '@/components/layout/PublicationShell'
import { getActiveTagsWithCounts, groupTagsByKind } from '@/lib/cms/entities'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Tags',
  description:
    'Browse FERG IN FOCUS by subject, format, technique, and mood — the controlled vocabulary behind the work.',
}

/**
 * Tags index.
 *
 * A curated vocabulary, not a free-tag cloud. Only tags with published work
 * appear, grouped by kind so subject and mood never compete for the same slot.
 */
export default async function TagsIndexPage() {
  const entries = await getActiveTagsWithCounts()
  const groups = groupTagsByKind(entries)

  return (
    <PublicationShell channel="publication">
      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        <p className="type-meta text-channel-muted">Taxonomy</p>
        <h1 className="type-h1 mt-5">Tags</h1>
        <p className="type-lead text-channel-muted measure mt-6">
          Browse the work by subject, format, technique, and mood. Every tag is curated —
          so related stories stay findable instead of splintering into near-duplicates.
        </p>
        <p className="type-meta text-channel-muted mt-6">
          {entries.length === 0
            ? 'No tagged work published yet'
            : `${entries.length} ${entries.length === 1 ? 'tag' : 'tags'} with published work`}
        </p>
      </section>

      {groups.length === 0 ? (
        <section className="shell py-20">
          <p className="type-lead text-channel-muted measure">
            Nothing is tagged yet. Until then, try{' '}
            <Link href="/search" className="underline underline-offset-4">
              search
            </Link>{' '}
            or the{' '}
            <Link href="/archive" className="underline underline-offset-4">
              archive
            </Link>
            .
          </p>
        </section>
      ) : (
        groups.map((group) => (
          <section
            key={group.kind}
            className="shell border-channel-rule border-b py-12 last:border-b-0"
            aria-labelledby={`tag-kind-${group.kind}`}
          >
            <h2 id={`tag-kind-${group.kind}`} className="type-meta text-channel-muted">
              {group.label}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
              {group.entries.map(({ tag, storyCount }) => (
                <li key={tag.id}>
                  <Link
                    href={`/tags/${tag.slug}`}
                    data-focus-target
                    data-focus-id={`tag-${tag.id}`}
                    data-focus-label={tag.label}
                    data-focus-inset="5"
                    className="type-kicker text-channel-fg/85 hover:text-channel-accent inline-flex items-baseline gap-2 transition-colors"
                  >
                    <span className="border-channel-fg/20 hover:border-channel-accent border-b pb-0.5">
                      {tag.label}
                    </span>
                    <span className="type-meta text-channel-muted">{storyCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </PublicationShell>
  )
}
