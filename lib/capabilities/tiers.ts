/**
 * Capability tiers.
 *
 * Every route is complete and readable at Tier 0. Higher tiers add motion the
 * reader can lose without losing anything they came for (plan §5.3).
 *
 * The direction of this logic matters. We do not detect a "good" device and
 * enable features; we detect reasons to *withhold* them and default to the
 * enhanced experience otherwise. Feature detection that guesses at device
 * quality ages badly — but "this browser told us Save-Data is on" is a fact.
 */

export const TIER = {
  /** Static. Reduced motion, save-data, low memory, no JS, print, or a failed canvas. */
  static: 0,
  /** CSS transitions, native View Transitions, native scroll. No WebGL. */
  core: 1,
  /** GSAP Flip, MotionPath, bounded Observer, ScrollTrigger, MorphSVG. */
  enhanced: 2,
  /** Lazy WebGL/R3F. Explicitly entered, instantly exitable, never required. */
  visual: 3,
} as const

export type CapabilityTier = (typeof TIER)[keyof typeof TIER]

export type CapabilitySignals = {
  reducedMotion: boolean
  saveData: boolean
  /** `navigator.deviceMemory` in GB. Undefined where unsupported (Safari). */
  deviceMemory: number | undefined
  hardwareConcurrency: number | undefined
  coarsePointer: boolean
  viewportWidth: number
  webglAvailable: boolean
}

/** Below this, ambient GPU work competes with the page itself. */
const MIN_DEVICE_MEMORY_GB = 4
const MIN_CORES_FOR_VISUAL = 4
const MIN_WIDTH_FOR_VISUAL = 1024

export function resolveTier(signals: CapabilitySignals): CapabilityTier {
  // Reduced motion and Save-Data are explicit user requests, not hints.
  if (signals.reducedMotion || signals.saveData) return TIER.static

  // `deviceMemory` is absent in Safari, so an unknown value must not be read as
  // low — that would silently downgrade every iPhone and Mac.
  if (signals.deviceMemory !== undefined && signals.deviceMemory < MIN_DEVICE_MEMORY_GB) {
    return TIER.static
  }

  if (!signals.webglAvailable) return TIER.enhanced

  const cores = signals.hardwareConcurrency ?? MIN_CORES_FOR_VISUAL
  const wideEnough = signals.viewportWidth >= MIN_WIDTH_FOR_VISUAL

  // Tier 3 is desktop-class and opt-in. A phone that could technically run the
  // shader still should not: it pays in battery and heat for an effect the
  // reader did not ask for.
  if (cores >= MIN_CORES_FOR_VISUAL && wideEnough && !signals.coarsePointer) {
    return TIER.visual
  }

  return TIER.enhanced
}

type NavigatorWithHints = Navigator & {
  connection?: { saveData?: boolean }
  deviceMemory?: number
}

export function readSignals(): CapabilitySignals {
  if (typeof window === 'undefined') {
    // Server render targets Tier 0 so the markup is complete and static before
    // any client capability is known. Enhancement is added after hydration,
    // never removed — which is why nothing can flash away.
    return {
      reducedMotion: true,
      saveData: false,
      deviceMemory: undefined,
      hardwareConcurrency: undefined,
      coarsePointer: false,
      viewportWidth: 0,
      webglAvailable: false,
    }
  }

  const nav = window.navigator as NavigatorWithHints

  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: nav.connection?.saveData === true,
    deviceMemory: nav.deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    viewportWidth: window.innerWidth,
    webglAvailable: detectWebGL(),
  }
}

let webglCache: boolean | undefined

/**
 * One-shot WebGL probe.
 *
 * The context is released immediately via `WEBGL_lose_context`. Browsers cap
 * live WebGL contexts (Chrome around 16), and a probe that leaks one is a
 * probe that eventually breaks the actual scene it was checking for.
 */
function detectWebGL(): boolean {
  if (webglCache !== undefined) return webglCache

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null)

    if (!gl) {
      webglCache = false
      return false
    }

    gl.getExtension('WEBGL_lose_context')?.loseContext()
    webglCache = true
    return true
  } catch {
    webglCache = false
    return false
  }
}

export function tierAllows(current: CapabilityTier, required: CapabilityTier): boolean {
  return current >= required
}
