import { describe, expect, it } from 'vitest'

import {
  calculateReadingTime,
  countWords,
  summarizeContent,
} from '@/lib/cms/reading-time'

describe('countWords', () => {
  it('counts words and ignores markup', () => {
    expect(countWords('one two three')).toBe(3)
    expect(countWords('<p>one <em>two</em></p>')).toBe(2)
    expect(countWords('   ')).toBe(0)
    expect(countWords('')).toBe(0)
  })
})

describe('calculateReadingTime', () => {
  it('never reports less than a minute', () => {
    expect(calculateReadingTime({ words: 5, images: 0, videoSeconds: 0 }).minutes).toBe(1)
  })

  it('scales with word count', () => {
    expect(
      calculateReadingTime({ words: 1100, images: 0, videoSeconds: 0 }).minutes,
    ).toBe(5)
  })

  it('counts time spent looking at images', () => {
    const withoutImages = calculateReadingTime({ words: 440, images: 0, videoSeconds: 0 })
    const withImages = calculateReadingTime({ words: 440, images: 30, videoSeconds: 0 })
    expect(withImages.minutes).toBeGreaterThan(withoutImages.minutes)
  })

  it('reports watch time separately rather than folding it into reading time', () => {
    // "8 min read" on a page whose substance is a 34-second film misdescribes
    // what the reader is being offered.
    const result = calculateReadingTime({ words: 100, images: 0, videoSeconds: 34 })
    expect(result.watchSeconds).toBe(34)
    expect(result.minutes).toBe(1)
  })
})

describe('summarizeContent', () => {
  it('walks nested blocks for prose', () => {
    const blocks = [
      {
        blockType: 'prose',
        content: { root: { children: [{ text: 'one two three four' }] } },
      },
    ]
    expect(summarizeContent(blocks).words).toBe(4)
  })

  it('counts images by the shape of each block', () => {
    const blocks = [
      { blockType: 'image' },
      { blockType: 'imagePair' },
      { blockType: 'triptych' },
      { blockType: 'contactSheet', frames: [{}, {}, {}, {}, {}] },
    ]
    expect(summarizeContent(blocks).images).toBe(1 + 2 + 3 + 5)
  })

  it('accumulates video duration wherever it appears', () => {
    const blocks = [
      { blockType: 'video', media: { durationSeconds: 34 } },
      { blockType: 'video', media: { durationSeconds: 8 } },
    ]
    expect(summarizeContent(blocks).videoSeconds).toBe(42)
  })

  it('survives a populated relationship cycle', () => {
    // Payload can populate relationships back onto their parent. Without cycle
    // detection this would recurse until the stack blew.
    const story: Record<string, unknown> = { blockType: 'prose', title: 'loop' }
    story.self = story

    expect(() => summarizeContent([story])).not.toThrow()
  })

  it('returns zeroes for empty or missing content', () => {
    expect(summarizeContent(undefined)).toEqual({ words: 0, images: 0, videoSeconds: 0 })
    expect(summarizeContent([])).toEqual({ words: 0, images: 0, videoSeconds: 0 })
  })
})
