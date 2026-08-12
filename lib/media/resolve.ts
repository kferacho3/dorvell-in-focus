import type { Media } from '@/payload-types'

/**
 * Media resolution helpers.
 *
 * Relationship fields arrive either as a populated object or as a bare id
 * depending on query depth, and every component that touches media would
 * otherwise repeat the same narrowing. Getting it wrong renders `[object
 * Object]` into an `src`, which fails silently in production.
 */

export type MediaLike = Media | number | string | null | undefined

export function isPopulatedMedia(value: MediaLike): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export type ResolvedImage = {
  src: string
  width: number
  height: number
  alt: string
  caption: string | null
  credit: string | null
  blurDataURL: string | null
  /** CSS `object-position` derived from the stored focal point. */
  objectPosition: string
  /** True when the image is presentational and must be hidden from AT. */
  decorative: boolean
}

/**
 * Normalizes a media record for rendering.
 *
 * Returns null rather than a placeholder when the record is missing or
 * unpopulated. A visible "broken image" box is more honest than a grey
 * rectangle that looks deliberate — and it makes the failure obvious in review
 * rather than shipping.
 */
export function resolveImage(value: MediaLike): ResolvedImage | null {
  if (!isPopulatedMedia(value)) return null
  if (!value.url) return null

  const width = value.width ?? 0
  const height = value.height ?? 0

  const focalX = value.focalPoint?.x ?? 50
  const focalY = value.focalPoint?.y ?? 50

  const decorative = value.decorative === true

  return {
    src: value.url,
    width,
    height,
    // A decorative image takes empty alt so screen readers skip it entirely.
    alt: decorative ? '' : (value.alt ?? ''),
    caption: value.caption ?? null,
    credit: value.credit ?? null,
    blurDataURL: value.blurDataURL ?? null,
    objectPosition: `${focalX}% ${focalY}%`,
    decorative,
  }
}

/**
 * Builds a `sizes` string from the layout width the image actually occupies.
 *
 * The plan is blunt about this (§11.3): `sizes` must reflect real layout
 * widths. The common failure is leaving the Next.js default of `100vw`, which
 * makes the browser download a full-viewport-width file for a card that
 * renders at a third of the screen.
 */
export const SIZES = {
  /** Full-bleed hero — genuinely the viewport width. */
  fullBleed: '100vw',
  /** Lead feature inside the shell. */
  lead: '(min-width: 1600px) 1600px, 100vw',
  /** Half-width editorial image. */
  half: '(min-width: 1024px) 50vw, 100vw',
  /** Card in a three-up grid. */
  card: '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
  /** Contact-sheet thumbnail. */
  thumbnail: '(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 45vw',
  /** Image constrained to the reading measure. */
  measure: '(min-width: 768px) 68ch, 100vw',
} as const

export type SizesToken = keyof typeof SIZES

/** Aspect ratio as a CSS value, or null when dimensions are unknown. */
export function aspectRatio(image: ResolvedImage): string | null {
  if (image.width <= 0 || image.height <= 0) return null
  return `${image.width} / ${image.height}`
}

export function formatDuration(seconds: number | null | undefined): string | null {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0)
    return null

  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const remainder = total % 60

  if (minutes === 0) return `${remainder}s`
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}
