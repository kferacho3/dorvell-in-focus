/**
 * Reading and viewing time.
 *
 * Kept as a pure function outside the Payload hook so it is directly testable
 * and so the same numbers can be recomputed during migration without booting
 * the CMS.
 */

/** Adult non-technical prose, conservative end of the usual 200–250 range. */
const WORDS_PER_MINUTE = 220

/**
 * Time a reader spends on an image. Deliberately modest: an editorial reader
 * lingers on a photograph far longer than three seconds, but inflating the
 * estimate makes a photo essay look like a commitment and suppresses opens.
 */
const SECONDS_PER_IMAGE = 4

export type ReadingTimeInput = {
  words: number
  images: number
  /** Total runtime of embedded video, in seconds. */
  videoSeconds: number
}

export type ReadingTime = {
  /** Minutes to read the text and look at the images. Minimum 1. */
  minutes: number
  /** Total video runtime in seconds, or 0. Presented separately. */
  watchSeconds: number
  words: number
}

export function calculateReadingTime(input: ReadingTimeInput): ReadingTime {
  const textSeconds = (input.words / WORDS_PER_MINUTE) * 60
  const imageSeconds = input.images * SECONDS_PER_IMAGE
  const minutes = Math.max(1, Math.round((textSeconds + imageSeconds) / 60))

  return {
    minutes,
    // Watch time is reported separately rather than folded into reading time.
    // "8 min read" on a page whose substance is a 34-second film misdescribes
    // what the reader is being offered.
    watchSeconds: Math.round(input.videoSeconds),
    words: input.words,
  }
}

/** Strips markup and counts words. Used for both blocks and plain strings. */
export function countWords(text: string): number {
  const cleaned = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.length === 0 ? 0 : cleaned.split(' ').length
}

type UnknownRecord = Record<string, unknown>

/**
 * Walks an arbitrary block tree collecting text, image, and video signals.
 *
 * Structure-agnostic on purpose: the block library will keep growing, and a
 * switch statement over block slugs would silently undercount every block
 * added after it was written.
 */
export function summarizeContent(blocks: unknown): ReadingTimeInput {
  let words = 0
  let images = 0
  let videoSeconds = 0

  const seen = new WeakSet<object>()

  const walk = (node: unknown): void => {
    if (node === null || node === undefined) return

    if (typeof node === 'string') {
      words += countWords(node)
      return
    }

    if (Array.isArray(node)) {
      for (const child of node) walk(child)
      return
    }

    if (typeof node !== 'object') return

    // Relationship fields can be populated into cycles.
    if (seen.has(node)) return
    seen.add(node)

    const record = node as UnknownRecord

    if (record.blockType === 'image' || record.blockType === 'annotatedImage') images += 1
    if (record.blockType === 'imagePair') images += 2
    if (record.blockType === 'triptych') images += 3
    if (record.blockType === 'contactSheet' && Array.isArray(record.frames)) {
      images += record.frames.length
    }

    if (typeof record.durationSeconds === 'number') {
      videoSeconds += record.durationSeconds
    }

    for (const [key, value] of Object.entries(record)) {
      // Lexical nodes carry formatting metadata that is not prose.
      if (key === 'blockType' || key === 'id' || key === 'type') continue
      walk(value)
    }
  }

  walk(blocks)

  return { words, images, videoSeconds }
}
