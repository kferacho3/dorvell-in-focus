import { isEditor, ownDraftsOrEditor, publishedOrStaff } from '@/payload/access'
import { STORY_BLOCKS } from '@/payload/blocks'
import { creditsField } from '@/payload/fields/rights'
import { seoFields } from '@/payload/fields/seo'
import { slugField } from '@/payload/fields/slug'
import { validatePublish } from '@/payload/hooks/validate-publish'
import { withDerivedFields } from '@/payload/hooks/derive'

import { CHANNEL_LIST } from '@/lib/channels'

import type { CollectionConfig } from 'payload'

/** Story formats (plan §7.3). */
export const STORY_TYPES = [
  { label: 'Article / essay', value: 'article' },
  { label: 'Photo essay', value: 'photoEssay' },
  { label: 'Film', value: 'film' },
  { label: 'Video essay', value: 'videoEssay' },
  { label: 'Modeling story', value: 'modelingStory' },
  { label: 'Collaboration case', value: 'collaboration' },
  { label: 'Interview', value: 'interview' },
  { label: 'Field note', value: 'fieldNote' },
  { label: 'Event dispatch', value: 'eventDispatch' },
  { label: 'Review', value: 'review' },
] as const

/**
 * Stories — every publishable editorial unit across all five channels.
 *
 * One collection rather than five, because the difference between a photo
 * essay and a reported feature is composition, not schema. Five near-identical
 * collections would fragment search, archives, related content, and the
 * homepage, and would guarantee that a field added to one is forgotten in the
 * others.
 */
export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'storyType', 'publishedAt', '_status'],
    group: 'Content',
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        return `${base}/story/${slug}?preview=${process.env.PREVIEW_SECRET ?? ''}`
      },
    },
    preview: ({ slug }) => {
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
      return `${base}/story/${String(slug)}?preview=${process.env.PREVIEW_SECRET ?? ''}`
    },
  },

  versions: {
    drafts: {
      autosave: { interval: 800 },
      schedulePublish: true,
    },
    // Enough history to recover from a bad edit without unbounded growth.
    maxPerDoc: 40,
  },

  access: {
    read: publishedOrStaff,
    create: ({ req }) => Boolean(req.user),
    update: ownDraftsOrEditor,
    delete: isEditor,
  },

  hooks: {
    beforeChange: [withDerivedFields, validatePublish],
  },

  fields: [
    // ---------------------------------------------------------- Identity --
    { name: 'title', type: 'text', required: true, index: true },
    {
      name: 'kicker',
      type: 'text',
      admin: {
        description:
          'Short label above the headline — a series name, a place, or a section. Optional.',
      },
    },
    {
      name: 'dek',
      type: 'textarea',
      required: true,
      maxLength: 320,
      admin: {
        description:
          'One or two sentences that add to the headline rather than repeating it. Used in cards, search, and share previews.',
      },
    },
    slugField(),

    {
      type: 'row',
      fields: [
        {
          name: 'channel',
          type: 'select',
          required: true,
          index: true,
          options: CHANNEL_LIST.map((channel) => ({
            label: channel.fallbackLabel,
            value: channel.key,
          })),
          admin: { width: '50%' },
        },
        {
          name: 'storyType',
          type: 'select',
          required: true,
          defaultValue: 'article',
          options: [...STORY_TYPES],
          admin: { width: '50%' },
        },
      ],
    },

    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
      required: true,
      admin: { position: 'sidebar' },
    },

    // ------------------------------------------------------------- Dates --
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Set automatically on first publish. Editable afterwards.',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description:
          'When the work was made or the event happened, if that differs from publication.',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'dateDisplayMode',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Show published date', value: 'published' },
        { label: 'Show event date', value: 'event' },
        { label: 'Show both', value: 'both' },
        { label: 'Hide dates', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },

    // ------------------------------------------------------------- Lead ---
    {
      type: 'collapsible',
      label: 'Lead presentation',
      fields: [
        { name: 'leadMedia', type: 'upload', relationTo: 'media' },
        {
          name: 'leadVariant',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: 'Standard — image above the headline', value: 'standard' },
            { label: 'Full bleed — headline over the image', value: 'fullBleed' },
            { label: 'Split — headline beside the image', value: 'split' },
            { label: 'Text only', value: 'textOnly' },
          ],
        },
        {
          name: 'cardHeadlineOverride',
          type: 'text',
          admin: {
            description:
              'A shorter headline for cards, when the full one does not fit a small crop.',
          },
        },
        {
          name: 'featuredPriority',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 0,
          admin: {
            description:
              'Higher values earn more visual weight on the homepage grid. 0 means normal.',
          },
        },
      ],
    },

    // ------------------------------------------------------------- Body ---
    {
      name: 'contentBlocks',
      type: 'blocks',
      blocks: STORY_BLOCKS,
      admin: {
        description: 'The story itself, composed from blocks.',
      },
    },
    {
      name: 'contentWarning',
      type: 'text',
      admin: {
        description:
          'Shown before the story when the subject genuinely warrants it. Not for mild discomfort.',
      },
    },
    {
      name: 'tableOfContentsMode',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Automatic for long pieces', value: 'auto' },
        { label: 'Always show', value: 'always' },
        { label: 'Never show', value: 'never' },
      ],
    },

    // ---------------------------------------------------- Relationships ---
    {
      type: 'collapsible',
      label: 'Relationships',
      admin: { initCollapsed: true },
      fields: [
        { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
        { name: 'people', type: 'relationship', relationTo: 'people', hasMany: true },
        { name: 'places', type: 'relationship', relationTo: 'places', hasMany: true },
        { name: 'partners', type: 'relationship', relationTo: 'partners', hasMany: true },
        { name: 'series', type: 'relationship', relationTo: 'series' },
        { name: 'issue', type: 'relationship', relationTo: 'issues' },
        {
          name: 'relatedStories',
          type: 'relationship',
          relationTo: 'stories',
          hasMany: true,
          maxRows: 4,
          admin: {
            description:
              'Editorial picks. Leave empty to blend shared people, places, tags, and series automatically.',
          },
        },
        {
          name: 'relatedPortfolioUrl',
          type: 'text',
          admin: { description: 'Deep link to the matching work on the portfolio.' },
        },
      ],
    },

    // --------------------------------------------- Credits and rights -----
    {
      type: 'collapsible',
      label: 'Credits, relationship, and disclosure',
      admin: { initCollapsed: true },
      fields: [
        creditsField,
        {
          name: 'disclosure',
          type: 'textarea',
          admin: {
            description:
              'Required when a partner relationship is paid, gifted, affiliate, or ambassador. Shown before the story, not buried at the end.',
          },
        },
        {
          name: 'usageNotes',
          type: 'textarea',
          admin: { description: 'Internal notes on how this work may be used.' },
        },
        {
          name: 'embargoUntil',
          type: 'date',
          admin: { description: 'Blocks publication before this date.' },
        },
        {
          name: 'approvalStatus',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'In editorial review', value: 'editorial-review' },
            { label: 'In rights review', value: 'rights-review' },
            { label: 'Ready', value: 'ready' },
          ],
          admin: { position: 'sidebar' },
        },
      ],
    },

    seoFields,

    // ------------------------------------------------ Derived (readonly) --
    {
      type: 'collapsible',
      label: 'Derived',
      admin: { initCollapsed: true, readOnly: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'readingMinutes',
              type: 'number',
              admin: { width: '33%', readOnly: true },
            },
            {
              name: 'watchSeconds',
              type: 'number',
              admin: { width: '33%', readOnly: true },
            },
            {
              name: 'wordCount',
              type: 'number',
              admin: { width: '34%', readOnly: true },
            },
          ],
        },
        {
          name: 'searchDocument',
          type: 'textarea',
          index: true,
          admin: {
            readOnly: true,
            description: 'Flattened text used to build the Postgres search vector.',
          },
        },
        { name: 'contentHash', type: 'text', admin: { readOnly: true } },
        {
          name: 'legacySourceId',
          type: 'text',
          unique: true,
          index: true,
          admin: { readOnly: true },
        },
      ],
    },
  ],
}
