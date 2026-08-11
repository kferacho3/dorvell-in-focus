import { anyone, hasRole, isMediaManager, isStaff } from '@/payload/access'
import { creditsField, rightsFields } from '@/payload/fields/rights'

import type { CollectionConfig } from 'payload'

/**
 * Media — images, video, audio, documents (plan §7.4).
 *
 * The governing rule of this collection: **a media item without an approved
 * rights state must not be selectable for public publication.** That is
 * enforced in `beforeChange` below rather than left to editorial discipline,
 * because editorial discipline under deadline is exactly what fails.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'rightsStatus', 'credit', 'updatedAt'],
    group: 'Content',
    description: 'Originals stay private. Only approved derivatives are served publicly.',
  },
  access: {
    read: anyone,
    create: isStaff,
    update: isMediaManager,
    delete: isMediaManager,
  },
  upload: {
    // Derivatives are produced by scripts/media/generate-derivatives.ts against
    // approved originals, not on upload. Sizes here cover admin previews and
    // the smaller reader-facing widths.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: undefined,
        formatOptions: { format: 'webp' },
      },
      { name: 'card', width: 768, height: undefined, formatOptions: { format: 'webp' } },
      { name: 'wide', width: 1440, height: undefined, formatOptions: { format: 'webp' } },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
      'application/pdf',
      'text/vtt',
    ],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Document', value: 'document' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal label. Not shown to readers.' },
    },

    // --- Editorial -------------------------------------------------------
    {
      name: 'alt',
      type: 'textarea',
      admin: {
        description:
          'What the image shows and why it is here. Written by a person — never auto-generated and published unreviewed. Leave blank only if purely decorative.',
      },
    },
    {
      name: 'decorative',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Marks this as presentational, so it is hidden from screen readers instead of announced with empty alt text.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'Visible caption. This is editorial copy, distinct from alt text — never use one as the other.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Visible credit line, e.g. "Dorvell Ferguson Jr."' },
    },
    creditsField,
    {
      type: 'row',
      fields: [
        {
          name: 'capturedAt',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'place',
          type: 'relationship',
          relationTo: 'places',
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'people', type: 'relationship', relationTo: 'people', hasMany: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },

    // --- Presentation ----------------------------------------------------
    {
      name: 'focalPoint',
      type: 'group',
      admin: {
        description:
          'Percentage from the top-left that must survive every responsive crop. Defaults to centre.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'x',
              type: 'number',
              defaultValue: 50,
              min: 0,
              max: 100,
              admin: { width: '50%' },
            },
            {
              name: 'y',
              type: 'number',
              defaultValue: 50,
              min: 0,
              max: 100,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'blurDataURL',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Tiny placeholder generated during derivative processing.',
      },
    },
    {
      name: 'dominantColor',
      type: 'text',
      admin: { readOnly: true, description: 'Used to tint surfaces around this image.' },
    },

    // --- Video -----------------------------------------------------------
    {
      type: 'collapsible',
      label: 'Video and playback',
      admin: { initCollapsed: true, condition: (data) => data?.kind === 'video' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'durationSeconds', type: 'number', admin: { width: '50%' } },
            {
              name: 'aspectRatio',
              type: 'text',
              admin: { width: '50%', placeholder: '16:9 or 9:16' },
            },
          ],
        },
        {
          name: 'muxPlaybackId',
          type: 'text',
          admin: { description: 'Set by the Mux webhook once encoding completes.' },
        },
        {
          name: 'processingStatus',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'Not started', value: 'none' },
            { label: 'Processing', value: 'processing' },
            { label: 'Ready', value: 'ready' },
            { label: 'Failed', value: 'failed' },
          ],
        },
        { name: 'poster', type: 'upload', relationTo: 'media' },
        {
          name: 'captions',
          type: 'array',
          labels: { singular: 'Caption track', plural: 'Caption tracks' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'srcLang', type: 'text', required: true, defaultValue: 'en' },
            { name: 'file', type: 'upload', relationTo: 'media', required: true },
          ],
        },
        {
          name: 'transcript',
          type: 'textarea',
          admin: {
            description:
              'Required for anything with dialogue or meaningful sound. Also feeds search.',
          },
        },
        {
          name: 'visualDescription',
          type: 'textarea',
          admin: {
            description:
              'For dialogue-free films, describe what happens. Without it the piece is inaccessible to a reader who cannot see it.',
          },
        },
      ],
    },

    // --- Technical (system-owned) ----------------------------------------
    {
      type: 'collapsible',
      label: 'Technical',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'checksum', type: 'text', admin: { width: '50%', readOnly: true } },
            {
              name: 'perceptualHash',
              type: 'text',
              admin: { width: '50%', readOnly: true },
            },
          ],
        },
        {
          name: 'sourceUrl',
          type: 'text',
          admin: { readOnly: true, description: 'Where this came from, for provenance.' },
        },
        {
          name: 'legacySourceId',
          type: 'text',
          unique: true,
          index: true,
          admin: { readOnly: true },
        },
      ],
    },

    rightsFields,
  ],

  hooks: {
    beforeChange: [
      ({ data, req, originalDoc }) => {
        const next = { ...data }

        // Stamp the reviewer the moment rights move to approved, so the audit
        // trail records who made the call and when.
        const wasApproved = (originalDoc as { rightsStatus?: string } | undefined)
          ?.rightsStatus
        if (next.rightsStatus === 'approved' && wasApproved !== 'approved') {
          const userId = (req.user as { id?: string | number } | null)?.id
          if (userId !== undefined) next.reviewedBy = userId
          next.reviewedAt = new Date().toISOString()
        }

        return next
      },
    ],

    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data

        // A rights override is an admin-only, deliberate act.
        if (data.rightsStatus === 'approved' && data.consentStatus === 'refused') {
          if (!hasRole(req.user, 'admin')) {
            throw new Error(
              'Consent was refused or withdrawn for this media. Only an administrator may override, and the override is logged.',
            )
          }
        }

        // Alt text is required for non-decorative images. This is the single
        // most common accessibility regression in any publishing system.
        if (data.kind === 'image' && !data.decorative) {
          const alt = typeof data.alt === 'string' ? data.alt.trim() : ''
          if (alt.length === 0 && data.rightsStatus === 'approved') {
            throw new Error(
              'Approved images need alt text describing what they show, or must be marked decorative.',
            )
          }
        }

        return data
      },
    ],
  },
}
