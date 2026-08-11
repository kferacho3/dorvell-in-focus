/**
 * Motion preference resolution.
 *
 * Two inputs, one answer:
 *
 *   1. The operating system's `prefers-reduced-motion`.
 *   2. An explicit choice the reader made in this publication's footer.
 *
 * When both exist, **the explicit choice wins** (plan §5.7). That is
 * deliberate and worth stating, because the usual instinct is to treat the OS
 * setting as inviolable. Someone may enable reduce system-wide for a
 * particular app and still want this publication's transitions; someone else
 * may want motion off here while leaving the OS alone. The preference is theirs
 * either way, and it is stored locally without requiring an account.
 */

export const MOTION_STORAGE_KEY = 'ferg:motion-preference'

export type MotionPreference = 'full' | 'reduced'

/** `system` means "no explicit choice has been made". */
export type MotionSetting = MotionPreference | 'system'

export const MOTION_SETTINGS: readonly MotionSetting[] = ['system', 'full', 'reduced']

export function isMotionSetting(value: unknown): value is MotionSetting {
  return (
    typeof value === 'string' && (MOTION_SETTINGS as readonly string[]).includes(value)
  )
}

export function readStoredSetting(): MotionSetting {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(MOTION_STORAGE_KEY)
    return isMotionSetting(stored) ? stored : 'system'
  } catch {
    // Private browsing and hardened privacy settings can throw on access.
    // A motion preference is not worth breaking the page over.
    return 'system'
  }
}

export function writeStoredSetting(setting: MotionSetting): void {
  if (typeof window === 'undefined') return
  try {
    if (setting === 'system') {
      window.localStorage.removeItem(MOTION_STORAGE_KEY)
    } else {
      window.localStorage.setItem(MOTION_STORAGE_KEY, setting)
    }
  } catch {
    /* Non-fatal, as above. */
  }
}

export function systemPrefersReduced(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function resolvePreference(
  setting: MotionSetting,
  systemReduced: boolean,
): MotionPreference {
  if (setting === 'full') return 'full'
  if (setting === 'reduced') return 'reduced'
  return systemReduced ? 'reduced' : 'full'
}

/**
 * The inline script that runs before first paint.
 *
 * Without it there is a flash: the document renders with full motion, then
 * hydration discovers a stored `reduced` preference and switches. For someone
 * who set that preference because motion makes them ill, the flash is exactly
 * the thing they asked not to see.
 *
 * Kept deliberately tiny and dependency-free — it is inlined into <head> with a
 * nonce, and anything larger would be a blocking cost on every page.
 */
export const MOTION_PREFERENCE_SCRIPT = `(function(){try{var s=localStorage.getItem('${MOTION_STORAGE_KEY}');if(s==='full'||s==='reduced'){document.documentElement.setAttribute('data-motion',s);return}}catch(e){}document.documentElement.setAttribute('data-motion',window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'full')})()`
