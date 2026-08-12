import type { ThemeKey } from '@/lib/channels'

/**
 * Channel palettes for generated share art (plan §10.7).
 *
 * Duplicated from styles/tokens.css rather than imported, because `next/og`
 * renders through Satori — it has no CSS engine, no custom properties, and no
 * cascade. Every colour must be a literal at render time.
 *
 * These pairs are contrast-checked against each other, since a share card is
 * often the first thing anyone sees of the publication and it gets scaled down
 * to a thumbnail in a timeline.
 */
export const OG_THEME: Record<
  ThemeKey,
  { bg: string; fg: string; muted: string; accent: string }
> = {
  publication: { bg: '#f3f0e8', fg: '#0e0f0d', muted: '#4f514c', accent: '#2457ff' },
  photography: { bg: '#f1f1ed', fg: '#10110f', muted: '#565853', accent: '#2457ff' },
  motion: { bg: '#0c0d0d', fg: '#f6f1e8', muted: '#a3a09a', accent: '#ff6638' },
  stories: { bg: '#f4efe4', fg: '#17120f', muted: '#57504a', accent: '#7e2431' },
  modeling: { bg: '#eee9e3', fg: '#10100f', muted: '#55524e', accent: '#7657ff' },
  x: { bg: '#efefe9', fg: '#10110f', muted: '#55574f', accent: '#0a756d' },
}

export const OG_SIZE = { width: 1200, height: 630 } as const

/**
 * Trims a headline to what actually fits.
 *
 * Satori does not reflow-and-clamp the way a browser does, so an unbounded
 * title overflows the canvas silently rather than truncating. Cutting at a word
 * boundary keeps the result readable.
 */
export function fitHeadline(title: string, max = 90): string {
  if (title.length <= max) return title
  const cut = title.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
