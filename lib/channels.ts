/**
 * Channel contract.
 *
 * Routes are permanent. Visible labels are not.
 *
 * The public names for the writing and modeling channels have not been decided
 * (plan §0.2). Rather than block development or guess, the URL is fixed at a
 * neutral slug and every reader-facing string is a CMS value. Renaming a
 * channel then costs one edit in `channelSettings` — not a route migration,
 * a redirect table, lost rankings, and broken bookmarks (ADR-0004).
 *
 * The `fallback*` strings below exist so the publication renders before the
 * CMS is seeded and so tests have deterministic copy. They are **not** the
 * source of truth. Anything reader-facing must resolve through
 * `lib/cms/channel-settings.ts`, which reads the global and falls back here.
 */

export const CHANNEL_KEYS = ['photography', 'motion', 'stories', 'modeling', 'x'] as const

export type ChannelKey = (typeof CHANNEL_KEYS)[number]

/** Includes the publication-level theme used outside any single channel. */
export type ThemeKey = ChannelKey | 'publication'

export type NameStatus = 'final' | 'provisional'

export type ChannelDefinition = {
  readonly key: ChannelKey
  readonly route: string
  /** Fallback only — see the module note. */
  readonly fallbackLabel: string
  readonly fallbackTagline: string
  /**
   * The internal spatial concept that guides art direction for the channel.
   * Never rendered to a reader; it exists to keep design decisions coherent.
   */
  readonly concept: string
  /**
   * `provisional` means the public name is genuinely undecided. Code must not
   * treat the fallback label as final, and no test may assert on it as though
   * it were a brand decision.
   */
  readonly nameStatus: NameStatus
  /** Editorial purpose, used for channel mastheads and metadata defaults. */
  readonly fallbackDescription: string
}

export const CHANNELS: Readonly<Record<ChannelKey, ChannelDefinition>> = {
  photography: {
    key: 'photography',
    route: '/photography',
    fallbackLabel: 'FERG Photography',
    fallbackTagline: 'What he sees and captures.',
    concept: 'The Light Table',
    nameStatus: 'final',
    fallbackDescription:
      'Photo essays, assignments, portraits, live work, and the thinking behind selected frames.',
  },
  motion: {
    key: 'motion',
    route: '/motion',
    fallbackLabel: '4KFERG',
    fallbackTagline: 'What he creates in motion.',
    concept: 'The Screening Room',
    nameStatus: 'final',
    fallbackDescription:
      'Films, video essays, editing studies, and the process behind each cut.',
  },
  stories: {
    key: 'stories',
    route: '/stories',
    fallbackLabel: 'Stories',
    fallbackTagline: 'What he observes and has to say.',
    concept: 'Dispatches',
    nameStatus: 'provisional',
    fallbackDescription:
      'Reporting, essays, interviews, event dispatches, and field notes.',
  },
  modeling: {
    key: 'modeling',
    route: '/modeling',
    fallbackLabel: 'Modeling',
    fallbackTagline: 'The other side of the lens.',
    concept: 'In Frame',
    nameStatus: 'provisional',
    fallbackDescription:
      'Campaigns, editorials, runway, and what modeling teaches about directing a shoot.',
  },
  x: {
    key: 'x',
    route: '/x',
    fallbackLabel: 'FERG X',
    fallbackTagline: 'The people and brands in the work.',
    concept: 'Collaboration Case Files',
    nameStatus: 'final',
    fallbackDescription:
      'Verified collaborations and partner case studies, with the relationship stated plainly.',
  },
} as const

/** Navigation order. Editorial, not alphabetical. */
export const CHANNEL_ORDER: readonly ChannelKey[] = [
  'photography',
  'motion',
  'stories',
  'modeling',
  'x',
]

export const CHANNEL_LIST: readonly ChannelDefinition[] = CHANNEL_ORDER.map(
  (key) => CHANNELS[key],
)

export function isChannelKey(value: unknown): value is ChannelKey {
  return typeof value === 'string' && (CHANNEL_KEYS as readonly string[]).includes(value)
}

export function getChannel(key: ChannelKey): ChannelDefinition {
  return CHANNELS[key]
}

/**
 * Resolves the theme for an arbitrary pathname.
 *
 * Used by the root layout to set `data-channel` during server rendering, so a
 * channel's atmosphere is present in the first paint rather than flashing in
 * after hydration.
 */
export function themeForPathname(pathname: string): ThemeKey {
  for (const channel of CHANNEL_LIST) {
    if (pathname === channel.route || pathname.startsWith(`${channel.route}/`)) {
      return channel.key
    }
  }
  return 'publication'
}

/**
 * The channels whose public name is still open.
 *
 * Surfaced in the admin panel so an editor can see at a glance which labels are
 * safe to change freely, and asserted on in tests so that "we finally named it"
 * is a deliberate edit rather than something that drifts in unnoticed.
 */
export const PROVISIONAL_CHANNELS: readonly ChannelKey[] = CHANNEL_LIST.filter(
  (channel) => channel.nameStatus === 'provisional',
).map((channel) => channel.key)
