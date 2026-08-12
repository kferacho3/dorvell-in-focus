/**
 * About-page content.
 *
 * Every fact here is carried over from Dorvell's existing published About page
 * and his LinkedIn record. Nothing is embellished, and nothing was inferred.
 *
 * The `proof` flag is load-bearing. An entry marked `pending` renders with a
 * visible "unconfirmed" marker rather than as a plain statement of fact — the
 * plan forbids fabricating credentials, and the honest handling of a claim we
 * cannot independently verify is to show that we could not verify it.
 *
 * Where a source blocks automated checking, that is recorded rather than
 * quietly treated as verification: the Creative Loafing Tampa article returns
 * 403 to crawlers, so its credit is client-confirmed instead.
 *
 * Deliberately excluded, per Dorvell's brief: all warehouse and distribution
 * day-job history. This page is about the craft.
 *
 * TODO(PR06): merge over the `aboutPage` global so Dorvell can edit this
 * without a deploy, using the same fallback pattern as channel settings.
 */

export type Proof = 'verified' | 'pending'

export type Milestone = {
  title: string
  organisation: string
  era: string
  detail: string
  proof: Proof
  /** How it was confirmed. Internal, shown only as a tooltip-free note. */
  sourceNote?: string
}

export const aboutHero = {
  eyebrow: 'Photographer · Model · Artist · Visual storyteller',
  name: 'Dorvell Ferguson Jr.',
  headline: 'Seen at the exact second the story becomes real.',
  lead: 'Multimedia Journalism graduate and culture-focused photographer shaping stories through portraits, concerts, fashion, sports, and editorial moments.',
} as const

export const pointOfView: readonly string[] = [
  'The work is built around presence — the feeling that a subject, an athlete, an artist, or a crowd is being seen at the exact second the story becomes real.',
  'His pursuit of an artistic career began with a desire to be different, not to blend in. Photography gave him the freedom to capture any moment he wanted, then extend it through editing, composition, and depth until the frame carries a second dimension.',
  'Trained in Multimedia Journalism, he treats a shoot like reporting: the goal is always to tell a story, and to leave the viewer feeling they witnessed the scene rather than looked at a polished picture.',
]

export const philosophy: readonly string[] = [
  'The frame should feel witnessed, not manufactured.',
  'Photography, fashion, music, and movement all live in the same visual language.',
  'The edit is where a moment gains its second dimension.',
]

export const milestones: readonly Milestone[] = [
  {
    title: 'Multimedia Journalism, B.S.',
    organisation: 'Troy University',
    era: 'Troy, AL · 2021',
    detail:
      'Built the foundation for reporting, visual storytelling, media literacy, and creative discipline.',
    proof: 'verified',
  },
  {
    title: 'University Photographer',
    organisation: 'Troy University · Athletics & Events',
    era: '2021',
    detail: 'Athletics, campus life, headshots, events, and university moments.',
    proof: 'verified',
  },
  {
    title: 'Photojournalist',
    organisation: 'Blue Fish',
    era: 'Editorial',
    detail:
      'Editorial storytelling, digital strategy, advertising, social media, website building, and image editing.',
    proof: 'verified',
    sourceNote: 'Confirmed via LinkedIn',
  },
  {
    title: 'Freelance photographer',
    organisation: 'Independent · Tampa, FL',
    era: '2019 — present',
    detail:
      'Portraits, concerts, fashion, sports, studio sessions, events, and creative direction.',
    proof: 'verified',
  },
  {
    title: 'Concert coverage',
    organisation: 'Creative Loafing Tampa',
    era: 'Ybor City · The Cuban Club',
    detail:
      "Concert photography connected to Trippie Redd, RiFF RAFF, and Waka Flocka Flame at Ybor City's Cuban Club.",
    proof: 'verified',
    sourceNote: 'Client-confirmed; the publication blocks automated checking',
  },
]

export type SkillGroup = {
  label: string
  source: string
  description: string
  items: readonly string[]
}

export const skillGroups: readonly SkillGroup[] = [
  {
    label: 'Freelance photography',
    source: 'Professional photographer · Freelance',
    description: 'The shooting disciplines, from a controlled studio to a moving crowd.',
    items: ['Studio', 'Studio lighting', 'Portrait', 'Concert', 'Sports'],
  },
  {
    label: 'University photographer',
    source: 'Troy University',
    description: 'Athletics, campus life, headshots, and events on assignment.',
    items: ['Athletics', 'Events', 'Headshots', 'Image editing'],
  },
  {
    label: 'Photojournalism and media',
    source: 'Photojournalist · Blue Fish',
    description: 'A story-first eye trained to move images across platforms.',
    items: ['Photojournalism', 'Digital strategy', 'Advertising', 'Social media'],
  },
  {
    label: 'Post-production',
    source: 'Freelance workflow',
    description: 'Where a captured moment gains its second dimension.',
    items: ['Lightroom', 'Photoshop', 'Video editing', 'Colour'],
  },
]
