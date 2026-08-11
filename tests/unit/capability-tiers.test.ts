import { describe, expect, it } from 'vitest'

import {
  TIER,
  resolveTier,
  tierAllows,
  type CapabilitySignals,
} from '@/lib/capabilities/tiers'

/** A capable desktop. Individual tests override one signal at a time. */
function signals(overrides: Partial<CapabilitySignals> = {}): CapabilitySignals {
  return {
    reducedMotion: false,
    saveData: false,
    deviceMemory: 8,
    hardwareConcurrency: 8,
    coarsePointer: false,
    viewportWidth: 1440,
    webglAvailable: true,
    ...overrides,
  }
}

describe('resolveTier', () => {
  it('gives a capable desktop the full visual tier', () => {
    expect(resolveTier(signals())).toBe(TIER.visual)
  })

  it('drops to static when the reader asked for reduced motion', () => {
    expect(resolveTier(signals({ reducedMotion: true }))).toBe(TIER.static)
  })

  it('drops to static when Save-Data is on', () => {
    // Save-Data is an explicit request, not a hint to weigh against others.
    expect(resolveTier(signals({ saveData: true }))).toBe(TIER.static)
  })

  it('drops to static on a genuinely low-memory device', () => {
    expect(resolveTier(signals({ deviceMemory: 2 }))).toBe(TIER.static)
  })

  it('does not punish browsers that decline to report memory', () => {
    // Safari omits navigator.deviceMemory. Reading undefined as "low" would
    // silently downgrade every iPhone and Mac to the static tier.
    expect(resolveTier(signals({ deviceMemory: undefined }))).toBe(TIER.visual)
  })

  it('stops at enhanced when WebGL is unavailable', () => {
    // GSAP-driven modules still work; only the shader layer is withheld.
    expect(resolveTier(signals({ webglAvailable: false }))).toBe(TIER.enhanced)
  })

  it('withholds the visual tier from touch devices', () => {
    expect(resolveTier(signals({ coarsePointer: true }))).toBe(TIER.enhanced)
  })

  it('withholds the visual tier from narrow viewports', () => {
    expect(resolveTier(signals({ viewportWidth: 900 }))).toBe(TIER.enhanced)
  })

  it('withholds the visual tier from low core counts', () => {
    expect(resolveTier(signals({ hardwareConcurrency: 2 }))).toBe(TIER.enhanced)
  })

  it('ranks an explicit reduced-motion request above every capability signal', () => {
    const powerful = signals({
      reducedMotion: true,
      deviceMemory: 32,
      hardwareConcurrency: 24,
      viewportWidth: 2560,
    })
    expect(resolveTier(powerful)).toBe(TIER.static)
  })
})

describe('tierAllows', () => {
  it('permits a feature only at or above its required tier', () => {
    expect(tierAllows(TIER.visual, TIER.enhanced)).toBe(true)
    expect(tierAllows(TIER.enhanced, TIER.enhanced)).toBe(true)
    expect(tierAllows(TIER.core, TIER.enhanced)).toBe(false)
    expect(tierAllows(TIER.static, TIER.core)).toBe(false)
  })
})
