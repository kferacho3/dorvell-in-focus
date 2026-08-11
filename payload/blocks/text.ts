import type { Block } from 'payload'

/**
 * Text and structure blocks (plan §7.5).
 *
 * Prose is one block among many rather than the document itself. That is what
 * lets a photo essay, an interview, and a reported feature share one renderer
 * while composing very differently — and it is why the plan calls for
 * "editorial pages composed from reusable blocks rather than a rigid
 * one-template feed".
 */

export const ProseBlock: Block = {
  slug: 'prose',
  labels: { singular: 'Text', plural: 'Text' },
  interfaceName: 'ProseBlock',
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'measure',
      options: [
        { label: 'Reading measure', value: 'measure' },
        { label: 'Wide', value: 'wide' },
      ],
      admin: {
        description:
          'Reading measure keeps lines at 60–75 characters. Widen only for tables or lists that need it.',
      },
    },
  ],
}

export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: { singular: 'Pull quote', plural: 'Pull quotes' },
  interfaceName: 'PullQuoteBlock',
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
    { name: 'person', type: 'relationship', relationTo: 'people' },
  ],
}

export const ChapterDividerBlock: Block = {
  slug: 'chapterDivider',
  labels: { singular: 'Chapter divider', plural: 'Chapter dividers' },
  interfaceName: 'ChapterDividerBlock',
  admin: {
    // One of the few sanctioned reasons to break the grid (plan §4.4).
    group: 'Structure',
  },
  fields: [
    { name: 'label', type: 'text', admin: { description: 'Optional chapter name.' } },
    {
      name: 'anchor',
      type: 'text',
      admin: { description: 'Optional id for the table of contents to link to.' },
    },
  ],
}

export const InterviewBlock: Block = {
  slug: 'interview',
  labels: { singular: 'Interview exchange', plural: 'Interview exchanges' },
  interfaceName: 'InterviewBlock',
  fields: [
    {
      name: 'exchanges',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'question', type: 'textarea', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
    {
      name: 'intervieweeName',
      type: 'text',
      admin: { description: 'Used for the speaker label and for structured data.' },
    },
  ],
}

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Callout', plural: 'Callouts' },
  interfaceName: 'CalloutBlock',
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'note',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Technique', value: 'technique' },
        { label: 'Context', value: 'context' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText', required: true },
  ],
}

/**
 * Source notes.
 *
 * Dorvell trained in multimedia journalism, and reported work needs somewhere
 * to put its citations. This block renders as apparatus — mono, smaller,
 * visually separate from the editorial voice — and survives to print.
 */
export const SourceNotesBlock: Block = {
  slug: 'sourceNotes',
  labels: { singular: 'Source notes', plural: 'Source notes' },
  interfaceName: 'SourceNotesBlock',
  fields: [
    {
      name: 'notes',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'text', type: 'textarea', required: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

/**
 * Corrections and updates.
 *
 * Kept as an explicit block rather than an edit to the body, because the
 * honest thing is to show that something changed and when — not to quietly
 * rewrite the record.
 */
export const CorrectionBlock: Block = {
  slug: 'correction',
  labels: { singular: 'Correction or update', plural: 'Corrections and updates' },
  interfaceName: 'CorrectionBlock',
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'update',
      options: [
        { label: 'Update', value: 'update' },
        { label: 'Correction', value: 'correction' },
      ],
    },
    { name: 'date', type: 'date', required: true },
    { name: 'note', type: 'textarea', required: true },
  ],
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  interfaceName: 'TimelineBlock',
  fields: [
    {
      name: 'entries',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'when',
          type: 'text',
          required: true,
          admin: { placeholder: '2022, or March 2024' },
        },
        { name: 'detail', type: 'textarea' },
      ],
    },
  ],
}

export const TEXT_BLOCKS = [
  ProseBlock,
  PullQuoteBlock,
  ChapterDividerBlock,
  InterviewBlock,
  CalloutBlock,
  SourceNotesBlock,
  CorrectionBlock,
  TimelineBlock,
]
