import { resolveImage } from '@/lib/media/resolve'

import type { Story } from '@/payload-types'

/**
 * JSON-LD builders.
 *
 * Generated from what a page actually contains, never stamped on wholesale.
 * Google's structured-data policy treats markup describing content that is not
 * on the page as spam, and marking every route as every type is the fastest
 * way to earn a manual action. So: a film page gets VideoObject because there
 * is a video; an essay gets Article because there is an article. Nothing gets
 * Organization, because Dorvell is a person, not a company.
 */

const siteUrl = (): string => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type JsonLd = Record<string, unknown>

export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FERG IN FOCUS',
    alternateName: 'Ferg in Focus',
    url: siteUrl(),
    description:
      'The independent visual publication of Dorvell Ferguson Jr. Photographs, films, reporting, modeling, and collaborations, told as complete stories.',
    inLanguage: 'en-US',
    publisher: personSchema(),
  }
}

export function personSchema(): JsonLd {
  return {
    '@type': 'Person',
    name: 'Dorvell Ferguson Jr.',
    url: siteUrl(),
    jobTitle: 'Photographer, model, and visual storyteller',
    sameAs: [
      'https://www.dorvellferguson.com/',
      'https://www.instagram.com/fergphotography/',
      'https://www.instagram.com/2kferg/',
      'https://www.tiktok.com/@2kferg',
      'https://www.linkedin.com/in/dorvell-ferguson-jr-bsa-a78a02194/',
    ],
  }
}

/**
 * Story schema.
 *
 * Which `@type` a story gets follows its actual format. A photo essay is not a
 * NewsArticle, and calling it one to chase a rich result would be a false claim
 * about what the reader is getting.
 */
export function storySchema(story: Story): JsonLd {
  const url = `${siteUrl()}/story/${story.slug}`
  const image = resolveImage(story.leadMedia)

  const base: JsonLd = {
    '@context': 'https://schema.org',
    '@type':
      story.storyType === 'article' || story.storyType === 'review'
        ? 'Article'
        : 'BlogPosting',
    headline: story.title,
    description: story.seoDescription ?? story.dek ?? undefined,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: story.publishedAt ?? undefined,
    dateModified: story.updatedAt,
    author: personSchema(),
    publisher: personSchema(),
    inLanguage: 'en-US',
  }

  if (image) {
    base.image = {
      '@type': 'ImageObject',
      url: absolute(image.src),
      width: image.width || undefined,
      height: image.height || undefined,
      caption: image.caption ?? undefined,
      creditText: image.credit ?? undefined,
    }
  }

  if (Array.isArray(story.tags)) {
    const keywords = story.tags
      .map((tag) => (typeof tag === 'object' && tag !== null ? tag.label : null))
      .filter((label): label is string => Boolean(label))
    if (keywords.length) base.keywords = keywords.join(', ')
  }

  if (typeof story.wordCount === 'number' && story.wordCount > 0) {
    base.wordCount = story.wordCount
  }

  return base
}

/**
 * VideoObject for a film page.
 *
 * Returns null unless the required fields are genuinely present. Google
 * requires name, description, thumbnailUrl, and uploadDate; emitting a partial
 * object produces a validation error rather than a rich result, so an honest
 * absence is better than an optimistic guess.
 */
export function videoSchema(story: Story): JsonLd | null {
  if (story.storyType !== 'film' && story.storyType !== 'videoEssay') return null

  const thumbnail = resolveImage(story.leadMedia)
  const description = story.seoDescription ?? story.dek
  const uploadDate = story.publishedAt

  if (!thumbnail || !description || !uploadDate) return null

  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: story.title,
    description,
    thumbnailUrl: absolute(thumbnail.src),
    uploadDate,
    contentUrl: `${siteUrl()}/story/${story.slug}`,
  }

  if (typeof story.watchSeconds === 'number' && story.watchSeconds > 0) {
    schema.duration = isoDuration(story.watchSeconds)
  }

  return schema
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: `${siteUrl()}${entry.path}`,
    })),
  }
}

/** ISO 8601 duration, which is what schema.org expects. */
export function isoDuration(seconds: number): string {
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const remainder = total % 60
  return minutes > 0 ? `PT${minutes}M${remainder}S` : `PT${remainder}S`
}

function absolute(url: string): string {
  return url.startsWith('http') ? url : `${siteUrl()}${url}`
}
