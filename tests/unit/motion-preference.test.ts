import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  MOTION_STORAGE_KEY,
  isMotionSetting,
  readStoredSetting,
  resolvePreference,
  writeStoredSetting,
} from '@/lib/motion/preference'

describe('resolvePreference', () => {
  it('lets an explicit choice override the system setting in both directions', () => {
    // The plan is deliberate about this (§5.7): a reader who turns motion on
    // here, despite an OS-wide reduce, has made a choice we must honor.
    expect(resolvePreference('full', true)).toBe('full')
    expect(resolvePreference('reduced', false)).toBe('reduced')
  })

  it('defers to the system when no choice has been made', () => {
    expect(resolvePreference('system', true)).toBe('reduced')
    expect(resolvePreference('system', false)).toBe('full')
  })
})

describe('isMotionSetting', () => {
  it('accepts only the three known settings', () => {
    expect(isMotionSetting('system')).toBe(true)
    expect(isMotionSetting('full')).toBe(true)
    expect(isMotionSetting('reduced')).toBe(true)
    expect(isMotionSetting('none')).toBe(false)
    expect(isMotionSetting(null)).toBe(false)
  })
})

describe('stored setting', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('round-trips an explicit preference', () => {
    writeStoredSetting('reduced')
    expect(readStoredSetting()).toBe('reduced')
  })

  it('clears the key when returning to system default', () => {
    writeStoredSetting('full')
    writeStoredSetting('system')

    expect(window.localStorage.getItem(MOTION_STORAGE_KEY)).toBeNull()
    expect(readStoredSetting()).toBe('system')
  })

  it('treats a corrupted stored value as no preference', () => {
    window.localStorage.setItem(MOTION_STORAGE_KEY, 'sideways')
    expect(readStoredSetting()).toBe('system')
  })

  it('survives storage access throwing', () => {
    // Private browsing and hardened privacy modes throw on localStorage
    // access. Losing a motion preference is acceptable; a blank page is not.
    //
    // Spying on the instance rather than Storage.prototype keeps this working
    // regardless of which Storage implementation the environment supplies.
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })

    expect(readStoredSetting()).toBe('system')
    expect(() => writeStoredSetting('reduced')).not.toThrow()
  })
})
