import type { Field } from 'payload'

/**
 * Rights and consent state (plan §7.4, §8.7).
 *
 * This is the collection's most consequential group. A photograph of a real
 * person at a real event carries obligations that a decorative asset does not,
 * and "we'll sort the credits later" is how publications end up in trouble.
 *
 * The default is `needs-review`, never `approved`. Nothing becomes publishable
 * by being forgotten.
 */

export const RIGHTS_STATUS = [
  { label: 'Needs review', value: 'needs-review' },
  { label: 'Approved for publication', value: 'approved' },
  { label: 'Restricted — see usage notes', value: 'restricted' },
  { label: 'Not cleared — do not publish', value: 'blocked' },
] as const

export const CONSENT_STATUS = [
  { label: 'Not required (no identifiable person)', value: 'not-required' },
  { label: 'Needs review', value: 'needs-review' },
  { label: 'Obtained', value: 'obtained' },
  { label: 'Refused or withdrawn', value: 'refused' },
] as const

export const rightsFields: Field = {
  type: 'collapsible',
  label: 'Rights, consent, and usage',
  admin: { initCollapsed: false },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'rightsStatus',
          type: 'select',
          required: true,
          defaultValue: 'needs-review',
          options: [...RIGHTS_STATUS],
          admin: {
            width: '50%',
            description: 'Only "Approved" may appear on a published page.',
          },
        },
        {
          name: 'consentStatus',
          type: 'select',
          required: true,
          defaultValue: 'needs-review',
          options: [...CONSENT_STATUS],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'rightsOwner',
      type: 'text',
      admin: {
        description:
          'Who owns this work. Often Dorvell, but not always — commissioned, agency, and campaign work frequently is not.',
      },
    },
    {
      name: 'licenseReference',
      type: 'text',
      admin: { description: 'Contract, invoice, release, or licence reference.' },
    },
    {
      name: 'usageScope',
      type: 'textarea',
      admin: {
        description:
          'Where this may appear and for how long. Record agency or campaign restrictions here.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'usageExpiresAt',
          type: 'date',
          admin: {
            width: '50%',
            description: 'Leave blank for perpetual rights.',
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'embargoUntil',
          type: 'date',
          admin: { width: '50%', description: 'Do not publish before this date.' },
        },
      ],
    },
    {
      name: 'sensitive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Flags material needing elevated review — minors, private events, medical or distressing content.',
      },
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'Stamped automatically when the rights status is approved.',
      },
    },
    {
      name: 'reviewedAt',
      type: 'date',
      admin: { readOnly: true },
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      admin: { description: 'Internal. Never rendered publicly.' },
    },
  ],
}

/**
 * Credits (plan §8.7).
 *
 * Freeform role plus name, rather than fixed columns, because the real credit
 * list for a runway shoot (stylist, hair, MUA, designer, agency) does not match
 * a film's (DP, gaffer, colorist, score) and forcing either into the other's
 * shape guarantees someone goes uncredited.
 */
export const creditsField: Field = {
  name: 'credits',
  type: 'array',
  labels: { singular: 'Credit', plural: 'Credits' },
  admin: {
    description: 'Everyone whose work appears here. Spelling matters; check it.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: { width: '40%', placeholder: 'Photographer, Stylist, Colorist…' },
        },
        { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
      ],
    },
    {
      name: 'person',
      type: 'relationship',
      relationTo: 'people',
      admin: { description: 'Link to a person record when one exists.' },
    },
    { name: 'url', type: 'text', admin: { description: 'Their site or profile.' } },
  ],
}
