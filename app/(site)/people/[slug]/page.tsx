import { notFound } from 'next/navigation'

import { EntityLanding } from '@/components/editorial/EntityLanding'
import { getPersonBySlug } from '@/lib/cms/entities'

import type { Metadata } from 'next'

export const revalidate = 3600

type PersonPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getPersonBySlug(slug, 1)
  if (!result) return { title: 'Not found' }

  return {
    title: result.entity.name,
    description: result.entity.bio ?? `Work involving ${result.entity.name}.`,
    robots: result.total === 0 ? { index: false, follow: true } : undefined,
  }
}

/**
 * A person's page.
 *
 * Only reachable when `hasPublicPage` is set — the query enforces it. A concert
 * photograph may credit a musician who never agreed to a page on this site;
 * recording the relationship internally and publishing a page about someone are
 * different decisions, and only the second needs their agreement.
 */
export default async function PersonPage({ params }: PersonPageProps) {
  const { slug } = await params
  const result = await getPersonBySlug(slug)

  if (!result) notFound()

  return (
    <EntityLanding
      kicker="Person"
      name={result.entity.name}
      detail={result.entity.role}
      description={result.entity.bio}
      links={(result.entity.links ?? [])
        .filter((link): link is { label: string; url: string; id?: string | null } =>
          Boolean(link.label && link.url),
        )
        .map((link) => ({ label: link.label, url: link.url }))}
      stories={result.stories}
      total={result.total}
    />
  )
}
