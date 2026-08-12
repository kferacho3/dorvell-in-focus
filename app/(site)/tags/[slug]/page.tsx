import Link from 'next/link'
import { notFound } from 'next/navigation'

import { EntityLanding } from '@/components/editorial/EntityLanding'
import { getTagBySlug } from '@/lib/cms/entities'

import type { Metadata } from 'next'

export const revalidate = 3600

type TagPageProps = { params: Promise<{ slug: string }> }

const KIND_LABELS: Record<string, string> = {
  subject: 'Subject',
  format: 'Format',
  technique: 'Technique',
  mood: 'Mood',
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getTagBySlug(slug, 1)
  if (!result) return { title: 'Tag not found' }

  return {
    title: result.entity.label,
    description:
      result.entity.description ?? `Work in FERG IN FOCUS tagged ${result.entity.label}.`,
    // A tag with nothing published behind it is a thin page. Keep it reachable
    // by link, keep it out of the index (plan §10.3).
    robots: result.total === 0 ? { index: false, follow: true } : undefined,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params
  const result = await getTagBySlug(slug)

  if (!result) notFound()

  const kind = KIND_LABELS[result.entity.kind ?? 'subject'] ?? 'Tag'

  return (
    <EntityLanding
      kicker={
        <>
          <Link href="/tags" className="hover:opacity-70">
            Tags
          </Link>
          <span aria-hidden className="mx-2 opacity-40">
            /
          </span>
          {kind}
        </>
      }
      name={result.entity.label}
      description={result.entity.description}
      stories={result.stories}
      total={result.total}
    />
  )
}
