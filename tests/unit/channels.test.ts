import { describe, expect, it } from 'vitest'

import {
  CHANNEL_KEYS,
  CHANNEL_LIST,
  CHANNEL_ORDER,
  CHANNELS,
  PROVISIONAL_CHANNELS,
  isChannelKey,
  themeForPathname,
} from '@/lib/channels'

describe('channel routes', () => {
  it('keeps every route neutral of any working brand name', () => {
    // ADR-0004: a rename must never require a route migration. If someone
    // encodes a display name into a URL, this fails.
    const provisionalConcepts = [
      'dispatches',
      'in-frame',
      'inframe',
      'journal',
      'field-notes',
    ]

    for (const channel of CHANNEL_LIST) {
      const route = channel.route.toLowerCase()
      for (const concept of provisionalConcepts) {
        expect(route).not.toContain(concept)
      }
    }
  })

  it('pins the stable route for each channel', () => {
    expect(CHANNELS.photography.route).toBe('/photography')
    expect(CHANNELS.motion.route).toBe('/motion')
    expect(CHANNELS.stories.route).toBe('/stories')
    expect(CHANNELS.modeling.route).toBe('/modeling')
    expect(CHANNELS.x.route).toBe('/x')
  })

  it('orders navigation editorially and covers every channel exactly once', () => {
    expect(CHANNEL_ORDER).toHaveLength(CHANNEL_KEYS.length)
    expect(new Set(CHANNEL_ORDER).size).toBe(CHANNEL_KEYS.length)
  })

  it('records the writing and modeling names as still undecided', () => {
    // Guards against someone quietly promoting a placeholder to a decision.
    expect([...PROVISIONAL_CHANNELS].sort()).toEqual(['modeling', 'stories'])
  })
})

describe('isChannelKey', () => {
  it('accepts known keys and rejects everything else', () => {
    expect(isChannelKey('photography')).toBe(true)
    expect(isChannelKey('x')).toBe(true)
    expect(isChannelKey('Photography')).toBe(false)
    expect(isChannelKey('journal')).toBe(false)
    expect(isChannelKey(undefined)).toBe(false)
    expect(isChannelKey(42)).toBe(false)
  })
})

describe('themeForPathname', () => {
  it('resolves a channel from its landing page and descendants', () => {
    expect(themeForPathname('/photography')).toBe('photography')
    expect(themeForPathname('/photography/some-essay')).toBe('photography')
    expect(themeForPathname('/motion/unbraided')).toBe('motion')
  })

  it('falls back to the publication theme outside any channel', () => {
    expect(themeForPathname('/')).toBe('publication')
    expect(themeForPathname('/about')).toBe('publication')
    expect(themeForPathname('/search')).toBe('publication')
  })

  it('does not match a route that merely shares a prefix', () => {
    // `/xylophone` must not be read as the FERG X channel.
    expect(themeForPathname('/xylophone')).toBe('publication')
    expect(themeForPathname('/motionless')).toBe('publication')
  })
})
