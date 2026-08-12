/**
 * The controlled taxonomy (plan §9.4).
 *
 * Seeded rather than left to accumulate from the story editor, because a
 * vocabulary that grows organically produces `film`, `films`, `filmmaking`,
 * `video`, `videos`, and `motion` — six tags holding a sixth of the work each
 * and none of them useful for discovery.
 *
 * `kind` is what keeps "Photojournalism" (a subject), "Photo Essay" (a format),
 * and "cinematic" (a mood) from competing for the same conceptual slot.
 */

export type SeedTag = {
  label: string
  kind: 'subject' | 'format' | 'technique' | 'mood'
  channelAffinity?: string[]
  aliases?: string[]
  description?: string
}

export const SEED_TAGS: SeedTag[] = [
  // --- Subjects ---------------------------------------------------------
  { label: 'Portraiture', kind: 'subject', channelAffinity: ['photography', 'modeling'] },
  {
    label: 'Music & Live',
    kind: 'subject',
    channelAffinity: ['photography'],
    aliases: ['concerts', 'live music'],
  },
  {
    label: 'Sports & Athletics',
    kind: 'subject',
    channelAffinity: ['photography'],
    aliases: ['sports'],
  },
  { label: 'Fashion', kind: 'subject', channelAffinity: ['modeling', 'photography'] },
  { label: 'Events', kind: 'subject', channelAffinity: ['photography', 'stories'] },
  {
    label: 'Photojournalism',
    kind: 'subject',
    channelAffinity: ['photography', 'stories'],
  },
  { label: 'Modeling', kind: 'subject', channelAffinity: ['modeling'] },
  { label: 'Runway', kind: 'subject', channelAffinity: ['modeling'] },
  { label: 'Personal Style', kind: 'subject', channelAffinity: ['modeling'] },
  { label: 'Creative Career', kind: 'subject', channelAffinity: ['stories'] },
  { label: 'Journalism', kind: 'subject', channelAffinity: ['stories'] },
  { label: 'Culture', kind: 'subject', channelAffinity: ['stories'] },

  // --- Technique --------------------------------------------------------
  { label: 'Editing', kind: 'technique', channelAffinity: ['motion'] },
  { label: 'Directing', kind: 'technique', channelAffinity: ['motion', 'photography'] },
  { label: 'Lighting', kind: 'technique', channelAffinity: ['photography', 'motion'] },
  {
    label: 'Color',
    kind: 'technique',
    channelAffinity: ['motion'],
    aliases: ['grade', 'grading'],
  },

  // --- Formats ----------------------------------------------------------
  { label: 'Article', kind: 'format' },
  { label: 'Photo Essay', kind: 'format', channelAffinity: ['photography'] },
  { label: 'Film', kind: 'format', channelAffinity: ['motion'], aliases: ['short film'] },
  { label: 'Video Essay', kind: 'format', channelAffinity: ['motion'] },
  { label: 'Interview', kind: 'format', channelAffinity: ['stories'] },
  { label: 'Event Dispatch', kind: 'format', channelAffinity: ['stories'] },
  { label: 'Field Note', kind: 'format', channelAffinity: ['stories'] },
  { label: 'Collaboration Case', kind: 'format', channelAffinity: ['x'] },
  { label: 'Modeling Story', kind: 'format', channelAffinity: ['modeling'] },
  { label: 'Behind the Scenes', kind: 'format', aliases: ['bts'] },

  // --- Moods ------------------------------------------------------------
  // The first group is from the plan; the rest are the vocabulary Dorvell has
  // actually been using across the existing film catalogue.
  { label: 'cinematic', kind: 'mood' },
  { label: 'documentary', kind: 'mood' },
  { label: 'reflection', kind: 'mood' },
  { label: 'shadow', kind: 'mood' },
  { label: 'liminal', kind: 'mood' },
  { label: 'surreal', kind: 'mood' },
  { label: 'rooftop', kind: 'mood' },
  { label: 'city', kind: 'mood' },
  { label: 'nature', kind: 'mood' },
  { label: 'movement', kind: 'mood' },
  { label: 'body language', kind: 'mood' },
  { label: 'warm light', kind: 'mood' },
  { label: 'monochrome', kind: 'mood' },
  { label: 'experimental', kind: 'mood' },
  { label: 'suspense', kind: 'mood' },
  { label: 'comedy', kind: 'mood' },
]

/**
 * Channel copy.
 *
 * The `/stories` and `/modeling` labels here are the current working names, not
 * decisions. They live in the CMS precisely so Dorvell can change them without
 * anyone touching code (ADR-0004).
 */
export const SEED_CHANNELS = [
  {
    key: 'photography',
    label: 'FERG Photography',
    tagline: 'What he sees and captures.',
    description:
      'Photo essays, assignments, portraits, live work, and the thinking behind selected frames.',
  },
  {
    key: 'motion',
    label: '4KFERG',
    tagline: 'What he creates in motion.',
    description: 'Films, video essays, editing studies, and the process behind each cut.',
  },
  {
    key: 'stories',
    label: 'Stories',
    tagline: 'What he observes and has to say.',
    description: 'Reporting, essays, interviews, event dispatches, and field notes.',
  },
  {
    key: 'modeling',
    label: 'Modeling',
    tagline: 'The other side of the lens.',
    description:
      'Campaigns, editorials, runway, and what modeling teaches about directing a shoot.',
  },
  {
    key: 'x',
    label: 'FERG X',
    tagline: 'The people and brands in the work.',
    description:
      'Verified collaborations and partner case studies, with the relationship stated plainly.',
  },
] as const

/**
 * Known partner relationships.
 *
 * Confirmed by Dorvell: both brands send product, which he models and features.
 * No payment, no contract, nothing promised in return — which is precisely the
 * `gifted` relationship type, not `sponsor` and not `paid-partnership`. Calling
 * it a sponsorship would overstate it, and overstating a brand relationship is
 * the kind of error that costs more than it gains.
 *
 * `gifted` still requires a visible disclosure. That is FTC guidance on
 * receiving free product in exchange for coverage, not a house rule — so the
 * publish validation will hold these to it, and the standard wording is in
 * SEED_DISCLOSURES below.
 */
export const SEED_PARTNERS = [
  {
    name: 'PacSun',
    slug: 'pacsun',
    kind: 'brand',
    relationshipType: 'gifted',
    verificationStatus: 'verified',
    website: 'https://www.pacsun.com/',
    summary:
      'Sends product that Dorvell models and features. No payment and no contract.',
  },
  {
    name: 'Cold Culture',
    slug: 'cold-culture',
    kind: 'brand',
    relationshipType: 'gifted',
    verificationStatus: 'verified',
    summary:
      'Sends product that Dorvell models and features. No payment and no contract.',
  },
] as const

/**
 * Standard disclosure wording (plan §8.7).
 *
 * Centralised so every sponsored, gifted, or affiliate story discloses in the
 * same words. Wording that drifts story to story reads as evasive even when it
 * is not.
 */
export const SEED_DISCLOSURES = [
  {
    relationshipType: 'sponsor',
    statement:
      'This story was paid for by the brand named above. Dorvell retained editorial control of what is written and shown here.',
  },
  {
    relationshipType: 'paid-partnership',
    statement:
      'This is a paid partnership with the brand named above. Dorvell retained editorial control of what is written and shown here.',
  },
  {
    relationshipType: 'client',
    statement: 'This work was commissioned by the client named above.',
  },
  {
    relationshipType: 'ambassador',
    statement:
      'Dorvell has an ongoing ambassador relationship with the brand named above.',
  },
  {
    relationshipType: 'gifted',
    statement:
      'The product shown here was gifted. No payment was made for this coverage, and nothing was promised in return.',
  },
  {
    relationshipType: 'affiliate',
    statement:
      'Some links in this story are affiliate links. If you buy through them, Dorvell may earn a commission at no extra cost to you. Nothing is included here for that reason alone.',
  },
  {
    relationshipType: 'collaborator',
    statement:
      'This work was made in collaboration with the people named above. No money changed hands.',
  },
  {
    relationshipType: 'event-host',
    statement: 'Dorvell attended this event as a guest of the host named above.',
  },
  {
    relationshipType: 'editorial-mention',
    statement:
      'The brand named above is mentioned editorially. There is no commercial relationship.',
  },
] as const
