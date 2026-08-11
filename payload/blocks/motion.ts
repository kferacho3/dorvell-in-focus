import type { Block } from 'payload'

/**
 * Motion and video blocks (plan §7.5).
 *
 * A social embed is never the canonical source for a film. Instagram and TikTok
 * are distribution; the publication holds the work. Embeds appear as secondary
 * links only.
 */

export const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: 'Video', plural: 'Videos' },
  interfaceName: 'VideoBlock',
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'presentation',
      type: 'select',
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full bleed', value: 'fullBleed' },
      ],
    },
    { name: 'caption', type: 'text' },
    {
      name: 'autoplayLoop',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Only for short silent loops. Muted, paused offscreen, omitted in reduced-data mode, and always given a pause control.',
      },
    },
  ],
}

/**
 * Vertical video pair.
 *
 * 9:16 work is shown at its real aspect ratio, side by side. The plan is
 * explicit that it must not be letterboxed into a fake phone mockup (§3.6) —
 * the device is not part of the story, and the frame stops being the work the
 * moment you draw a bezel around it.
 */
export const VerticalVideoPairBlock: Block = {
  slug: 'verticalVideoPair',
  labels: { singular: 'Vertical video pair', plural: 'Vertical video pairs' },
  interfaceName: 'VerticalVideoPairBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'left',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%' },
        },
        { name: 'right', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
      ],
    },
    { name: 'caption', type: 'text' },
  ],
}

export const ChapterListBlock: Block = {
  slug: 'chapterList',
  labels: { singular: 'Film chapters', plural: 'Film chapters' },
  interfaceName: 'ChapterListBlock',
  fields: [
    {
      name: 'chapters',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'startSeconds',
              type: 'number',
              required: true,
              min: 0,
              admin: { width: '30%' },
            },
            { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'note', type: 'textarea' },
      ],
      admin: {
        description:
          'Authored by hand, not auto-detected. These become both seek targets and Clip structured data, so they must be accurate.',
      },
    },
  ],
}

export const PosterSequenceBlock: Block = {
  slug: 'posterSequence',
  labels: { singular: 'Poster sequence', plural: 'Poster sequences' },
  interfaceName: 'PosterSequenceBlock',
  fields: [
    {
      name: 'posters',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'label', type: 'text' },
        { name: 'story', type: 'relationship', relationTo: 'stories' },
      ],
    },
  ],
}

export const TranscriptExcerptBlock: Block = {
  slug: 'transcriptExcerpt',
  labels: { singular: 'Transcript excerpt', plural: 'Transcript excerpts' },
  interfaceName: 'TranscriptExcerptBlock',
  fields: [
    { name: 'source', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'startSeconds', type: 'number', min: 0 },
  ],
}

export const MOTION_BLOCKS = [
  VideoBlock,
  VerticalVideoPairBlock,
  ChapterListBlock,
  PosterSequenceBlock,
  TranscriptExcerptBlock,
]
