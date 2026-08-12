/**
 * Social destinations.
 *
 * Every URL here is verified against Dorvell's existing published profiles. A
 * platform with no confirmed destination is simply absent — a social rail that
 * links somewhere wrong is worse than one with fewer icons.
 *
 * Two Instagram accounts is a fact about how Dorvell works, not an oversight:
 * `@fergphotography` is the commissioned photography practice and
 * `@dorvellfergusonjr` is the personal creative world. Collapsing them would
 * misrepresent both.
 */

export type SocialKey =
  | 'instagramPhotography'
  | 'instagramPersonal'
  | 'tiktok'
  | 'facebook'
  | 'linkedin'

export type SocialDestination = {
  readonly key: SocialKey
  /** Full platform name. Always available as text — never icon-only (§12.2). */
  readonly platform: string
  readonly handle: string
  readonly href: string
  /** Accessible name for the link. */
  readonly label: string
  /** Compact label for the fixed rail. Distinct when two accounts share a platform. */
  readonly railLabel: string
  /** Whether this belongs in the compact rail beside stories. */
  readonly inRail: boolean
}

export const SOCIAL_DESTINATIONS: readonly SocialDestination[] = [
  {
    key: 'instagramPhotography',
    platform: 'Instagram',
    handle: '@fergphotography',
    href: 'https://www.instagram.com/fergphotography/',
    label: 'FERG Photography on Instagram',
    railLabel: 'Photo',
    inRail: true,
  },
  {
    key: 'instagramPersonal',
    platform: 'Instagram',
    handle: '@dorvellfergusonjr',
    href: 'https://www.instagram.com/dorvellfergusonjr/',
    label: 'Dorvell Ferguson on Instagram',
    railLabel: 'Dorvell',
    inRail: true,
  },
  {
    key: 'tiktok',
    platform: 'TikTok',
    handle: '@2kferg',
    href: 'https://www.tiktok.com/@2kferg',
    label: 'Dorvell Ferguson on TikTok',
    railLabel: 'TikTok',
    inRail: true,
  },
  {
    key: 'facebook',
    platform: 'Facebook',
    handle: 'Dorvell Ferguson',
    href: 'https://www.facebook.com/DJ.ferguson2',
    label: 'Dorvell Ferguson on Facebook',
    railLabel: 'Facebook',
    inRail: true,
  },
  {
    key: 'linkedin',
    platform: 'LinkedIn',
    handle: 'Dorvell Ferguson Jr.',
    href: 'https://www.linkedin.com/in/dorvell-ferguson-jr-bsa-a78a02194/',
    label: 'Dorvell Ferguson Jr. on LinkedIn',
    railLabel: 'LinkedIn',
    inRail: true,
  },
] as const

export const RAIL_DESTINATIONS = SOCIAL_DESTINATIONS.filter((entry) => entry.inRail)

/** The portfolio. A deliberate bridge, never an embedded or restyled shell. */
export const PORTFOLIO_URL = 'https://www.dorvellferguson.com/'
