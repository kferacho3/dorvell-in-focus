import type { Block } from 'payload'

/**
 * Image and media blocks (plan §7.5).
 *
 * Every block that places an image also carries its caption and credit, so
 * credit travels with the picture instead of being collected in a footer that
 * loses track of which frame belongs to whom.
 */

/** Shared caption/credit pair. Overrides the media record's own values. */
const captionFields = [
  {
    name: 'caption',
    type: 'text' as const,
    admin: { description: 'Overrides the caption on the media record.' },
  },
  {
    name: 'creditOverride',
    type: 'text' as const,
    admin: { description: 'Only when this usage needs a different credit line.' },
  },
]

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  interfaceName: 'ImageBlock',
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'presentation',
      type: 'select',
      defaultValue: 'contained',
      options: [
        { label: 'Contained — sits in the reading column', value: 'contained' },
        { label: 'Wide — breaks past the text', value: 'wide' },
        { label: 'Full bleed — edge to edge', value: 'fullBleed' },
      ],
      admin: {
        description:
          'Full bleed should mark a shift in the story — a chapter, a climax, a change of format. Not every strong frame.',
      },
    },
    ...captionFields,
  ],
}

export const ImagePairBlock: Block = {
  slug: 'imagePair',
  labels: { singular: 'Image pair', plural: 'Image pairs' },
  interfaceName: 'ImagePairBlock',
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
        {
          name: 'right',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: 'Align tops', value: 'top' },
        { label: 'Align baselines', value: 'baseline' },
        { label: 'Match heights', value: 'match' },
      ],
    },
    ...captionFields,
  ],
}

export const TriptychBlock: Block = {
  slug: 'triptych',
  labels: { singular: 'Triptych', plural: 'Triptychs' },
  interfaceName: 'TriptychBlock',
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}

/**
 * Contact sheet.
 *
 * The publication's most characteristic image block, and the surface the
 * Grid ↔ Sequence reflow (Module D) operates on. Frame numbers are shown in
 * mono because that is how a real contact sheet reads.
 */
export const ContactSheetBlock: Block = {
  slug: 'contactSheet',
  labels: { singular: 'Contact sheet', plural: 'Contact sheets' },
  interfaceName: 'ContactSheetBlock',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'frames',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
        {
          name: 'selected',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Marks the frame that was chosen, as a grease-pencil ring.',
          },
        },
      ],
    },
    {
      name: 'showFrameNumbers',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export const BeforeAfterBlock: Block = {
  slug: 'beforeAfter',
  labels: { singular: 'Before / after', plural: 'Before / after' },
  interfaceName: 'BeforeAfterBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'before',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'after',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'beforeLabel',
          type: 'text',
          defaultValue: 'Before',
          admin: { width: '50%' },
        },
        {
          name: 'afterLabel',
          type: 'text',
          defaultValue: 'After',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'What changed and why — the point of showing both.' },
    },
  ],
}

export const AnnotatedImageBlock: Block = {
  slug: 'annotatedImage',
  labels: { singular: 'Annotated image', plural: 'Annotated images' },
  interfaceName: 'AnnotatedImageBlock',
  fields: [
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'annotations',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'x',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
              admin: { width: '50%' },
            },
            {
              name: 'y',
              type: 'number',
              required: true,
              min: 0,
              max: 100,
              admin: { width: '50%' },
            },
          ],
        },
        { name: 'label', type: 'text', required: true },
        { name: 'detail', type: 'textarea' },
      ],
      admin: {
        description:
          'Positions are percentages. Annotations are also listed below the image, so the information is never hover-only.',
      },
    },
  ],
}

export const MEDIA_BLOCKS = [
  ImageBlock,
  ImagePairBlock,
  TriptychBlock,
  ContactSheetBlock,
  BeforeAfterBlock,
  AnnotatedImageBlock,
]
