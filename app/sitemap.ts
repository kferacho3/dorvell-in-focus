import { CHANNEL_LIST } from '@/lib/channels'
import { getCms } from '@/lib/cms/client'

import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const revalidate = 3600

/**
 * Sitemap.
 *
 * Only genuinely indexable pages. Drafts are excluded by the access layer
 * automatically; `noIndex` and thin taxonomy pages are excluded explicitly.
 *
 * The rule the plan sets (§10.3) is that a tag, person, or place page earns a
 * sitemap entry only when it *has* content. Submitting hundreds of empty
 * taxonomy URLs is how a small publication trains a crawler to distrust it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    ...CHANNEL_LIST.map((channel) => ({
      url: `${siteUrl}${channel.route}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/archive`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteUrl}/tags`, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/newsletter`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/policies`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/accessibility`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/disclosures`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const payload = await getCms()

    const stories = await payload.find({
      collection: 'stories',
      where: { _status: { equals: 'published' }, noIndex: { not_equals: true } },
      limit: 2000,
      depth: 0,
      sort: '-publishedAt',
    })

    const storyRoutes: MetadataRoute.Sitemap = stories.docs.map((story) => ({
      url: `${siteUrl}/story/${story.slug}`,
      lastModified: story.updatedAt ? new Date(story.updatedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    // Tags reach the sitemap only once something published uses them.
    const usedTagIds = new Set<string | number>()
    const withTags = await payload.find({
      collection: 'stories',
      where: { _status: { equals: 'published' }, noIndex: { not_equals: true } },
      limit: 2000,
      depth: 1,
      select: { tags: true },
    })

    for (const story of withTags.docs) {
      for (const tag of story.tags ?? []) {
        if (typeof tag === 'object' && tag !== null) usedTagIds.add(tag.id)
      }
    }

    const tagRoutes: MetadataRoute.Sitemap = []
    if (usedTagIds.size > 0) {
      const tags = await payload.find({
        collection: 'tags',
        where: { id: { in: [...usedTagIds] }, status: { equals: 'active' } },
        limit: 500,
        depth: 0,
      })
      for (const tag of tags.docs) {
        tagRoutes.push({
          url: `${siteUrl}/tags/${tag.slug}`,
          changeFrequency: 'monthly',
          priority: 0.4,
        })
      }
    }

    return [...staticRoutes, ...storyRoutes, ...tagRoutes]
  } catch {
    // A sitemap that omits stories is recoverable; a build that fails is not.
    return staticRoutes
  }
}
