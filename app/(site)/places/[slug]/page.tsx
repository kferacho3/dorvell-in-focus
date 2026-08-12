import { notFound } from 'next/navigation'

import { EntityLanding } from '@/components/editorial/EntityLanding'
import { getPlaceBySlug } from '@/lib/cms/entities'

import type { Metadata } from 'next'

export const revalidate = 3600

type PlacePageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getPlaceBySlug(slug, 1)
  if (!result) return { title: 'Not found' }

  return {
    title: result.entity.name,
    description: result.entity.description ?? `Work made in ${result.entity.name}.`,
    robots: result.total === 0 ? { index: false, follow: true } : undefined,
  }
}

/**
 * A place's page.
 *
 * Private locations are excluded at the query level. Publishing the exact
 * position of a residence or a restricted studio because it happened to be in
 * the EXIF is a real harm, and a city plus a venue name carries the editorial
 * meaning without it.
 */
export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params
  const result = await getPlaceBySlug(slug)

  if (!result) notFound()

  const locality = [result.entity.locality, result.entity.region]
    .filter(Boolean)
    .join(', ')

  return (
    <EntityLanding
      kicker="Place"
      name={result.entity.name}
      detail={locality || null}
      description={result.entity.description}
      stories={result.stories}
      total={result.total}
    />
  )
}
