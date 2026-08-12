import { getPublishedStories } from '@/lib/cms/queries'
import { isChannelKey, CHANNELS } from '@/lib/channels'
import { resolveImage } from '@/lib/media/resolve'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const revalidate = 3600

/**
 * Escapes text for XML.
 *
 * Titles and deks come from the CMS, and an unescaped `&` or `<` in a headline
 * produces a feed that every reader silently rejects as malformed — a failure
 * nobody notices until someone asks why the newsletter stopped picking up
 * stories.
 */
function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const { docs: stories } = await getPublishedStories({ limit: 50 })

  const updated = stories[0]?.publishedAt ?? new Date().toISOString()

  const items = stories
    .map((story) => {
      const url = `${siteUrl}/story/${story.slug}`
      const image = resolveImage(story.leadMedia)
      const channel = isChannelKey(story.channel) ? CHANNELS[story.channel] : null

      return `    <item>
      <title>${xml(story.title)}</title>
      <link>${xml(url)}</link>
      <!-- Stable GUID: the canonical URL, which never changes for a published
           story. Using a database id would break every subscriber's read state
           if the database were ever rebuilt. -->
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${new Date(story.publishedAt ?? story.createdAt).toUTCString()}</pubDate>
      <dc:creator>Dorvell Ferguson Jr.</dc:creator>${
        channel ? `\n      <category>${xml(channel.fallbackLabel)}</category>` : ''
      }
      <description>${xml(story.dek ?? '')}</description>${
        image
          ? `\n      <enclosure url="${xml(
              image.src.startsWith('http') ? image.src : `${siteUrl}${image.src}`,
            )}" type="image/jpeg" length="0" />`
          : ''
      }
    </item>`
    })
    .join('\n')

  // Excerpts only, not full content. The publication is the canonical home for
  // the work, and a feed that reproduces whole photo essays gives readers no
  // reason to see them as they were composed.
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FERG IN FOCUS</title>
    <link>${xml(siteUrl)}</link>
    <atom:link href="${xml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>The independent visual publication of Dorvell Ferguson Jr. Photographs, films, reporting, modeling, and collaborations, told as complete stories.</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} Dorvell Ferguson Jr.</copyright>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
