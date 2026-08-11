/**
 * Motion tokens.
 *
 * These mirror the custom properties in `styles/motion.css`. CSS owns the
 * declarative cases; this module exists for GSAP, which needs numbers.
 *
 * Durations are in **seconds** because that is GSAP's unit. The CSS side uses
 * milliseconds. Converting in one place is what stops `0.32` and `320` from
 * being confused at a call site.
 */

export const DURATION = {
  instant: 0.08,
  quick: 0.18,
  base: 0.32,
  route: 0.52,
  feature: 0.72,
} as const

export const EASE = {
  enter: 'power3.out',
  exit: 'power2.in',
  standard: 'power2.inOut',
  editorial: 'expo.inOut',
} as const

export const DISTANCE = {
  micro: 8,
  small: 16,
  medium: 32,
} as const

/**
 * The ceiling for any interaction a reader triggers on purpose.
 *
 * Ambient motion may run longer, but only when it holds neither input nor
 * content hostage. This constant is asserted against in the animation QA suite
 * so a "just slightly slower, it looks better" change has to be argued for
 * rather than merged quietly.
 */
export const MAX_INTERACTION_SECONDS = 0.7

export type DurationToken = keyof typeof DURATION
export type EaseToken = keyof typeof EASE
export type DistanceToken = keyof typeof DISTANCE

export const ms = (seconds: number): number => Math.round(seconds * 1000)

/**
 * Route transition budgets (plan §5.4).
 *
 * The upper bound is the contract: past it, the overlay is torn down and the
 * destination is shown regardless of animation state. A transition that can
 * outlive its budget is a transition that can freeze navigation.
 */
export const ROUTE_TRANSITION = {
  storyCardToStory: { min: 0.52, max: 0.7 },
  channelSwitch: { min: 0.4, max: 0.6 },
  gridToSequence: { min: 0.45, max: 0.75 },
  posterToFilm: { min: 0.35, max: 0.65 },
  menuToggle: { min: 0.4, max: 0.65 },
  backNavigation: { min: 0, max: 0.52 },
} as const

export type RouteTransitionKind = keyof typeof ROUTE_TRANSITION

/**
 * Hard stop for any route-owned overlay.
 *
 * If a transition has not resolved by now — a slow decode, a failed image, a
 * dropped chunk — the overlay is removed and the destination is revealed. The
 * reader always gets where they were going.
 */
export const TRANSITION_FAILSAFE_MS = 1200
