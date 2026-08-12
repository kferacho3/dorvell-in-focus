import { describe, expect, it } from 'vitest'

import { slugify } from '@/payload/fields/slug'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('The Threshold')).toBe('the-threshold')
    expect(slugify('Chrome & Cream')).toBe('chrome-cream')
  })

  it('folds accents to ASCII rather than percent-encoding them', () => {
    // Dorvell's work names real people and venues. A URL of escaped bytes is
    // unreadable and impossible to share out loud.
    expect(slugify('Café Sévigné')).toBe('cafe-sevigne')
    expect(slugify('Renée Zöllner')).toBe('renee-zollner')
  })

  it('drops apostrophes instead of turning them into separators', () => {
    // "director's note" must not become "director-s-note".
    expect(slugify("Director's Note")).toBe('directors-note')
    expect(slugify('Nobody’s Listening')).toBe('nobodys-listening')
  })

  it('collapses runs of separators and trims the ends', () => {
    expect(slugify('  Two   Twenty-Three  ')).toBe('two-twenty-three')
    expect(slugify('--Grand Exit--')).toBe('grand-exit')
    expect(slugify('Platform / 9927')).toBe('platform-9927')
  })

  it('caps length so a long headline cannot produce an unusable URL', () => {
    expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(96)
  })

  it('returns an empty string when nothing survives', () => {
    expect(slugify('!!!')).toBe('')
    expect(slugify('')).toBe('')
  })

  it('is idempotent', () => {
    const once = slugify('Eighty-Sixed: A Study')
    expect(slugify(once)).toBe(once)
  })
})
