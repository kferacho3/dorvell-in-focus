import { creditsField } from '@/payload/fields/rights'

import type { Block } from 'payload'

/**
 * Relationship and commercial blocks (plan §7.5).
 */

export const CreditsBlock: Block = {
  slug: 'creditsBlock',
  labels: { singular: 'Credits', plural: 'Credits' },
  interfaceName: 'CreditsBlock',
  fields: [{ name: 'title', type: 'text', defaultValue: 'Credits' }, creditsField],
}

/**
 * Partner disclosure.
 *
 * Disclosure is placed *before* the content it applies to, not buried at the
 * bottom. The FTC's guidance is that a disclosure must be hard to miss, and a
 * reader who has already read the piece has not been informed — they have been
 * told afterwards.
 */
export const PartnerDisclosureBlock: Block = {
  slug: 'partnerDisclosure',
  labels: { singular: 'Partner disclosure', plural: 'Partner disclosures' },
  interfaceName: 'PartnerDisclosureBlock',
  fields: [
    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true },
    {
      name: 'statement',
      type: 'textarea',
      admin: {
        description:
          'Leave blank to use the standard wording for this relationship type from disclosure settings.',
      },
    },
  ],
}

export const PartnerProfileBlock: Block = {
  slug: 'partnerProfile',
  labels: { singular: 'Partner profile', plural: 'Partner profiles' },
  interfaceName: 'PartnerProfileBlock',
  fields: [
    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true },
    { name: 'role', type: 'text', admin: { description: 'Exactly what Dorvell did.' } },
    {
      name: 'deliverables',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
  ],
}

export const ProductCreditsBlock: Block = {
  slug: 'productCredits',
  labels: { singular: 'Product / garment credits', plural: 'Product / garment credits' },
  interfaceName: 'ProductCreditsBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'item', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'brand', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'partner', type: 'relationship', relationTo: 'partners' },
        { name: 'url', type: 'text' },
        {
          name: 'isAffiliate',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Adds rel="sponsored" and surfaces the affiliate disclosure.',
          },
        },
      ],
    },
  ],
}

export const RelatedStoriesBlock: Block = {
  slug: 'relatedStories',
  labels: { singular: 'Related stories', plural: 'Related stories' },
  interfaceName: 'RelatedStoriesBlock',
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Continue in focus' },
    {
      name: 'stories',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
      maxRows: 4,
      admin: {
        description:
          'Leave empty to blend editorial selection with shared people, places, tags, and series.',
      },
    },
  ],
}

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'newsletter',
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Portfolio / booking', value: 'portfolio' },
        { label: 'Commission or inquiry', value: 'inquiry' },
      ],
    },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
  ],
}

export const RELATIONSHIP_BLOCKS = [
  CreditsBlock,
  PartnerDisclosureBlock,
  PartnerProfileBlock,
  ProductCreditsBlock,
  RelatedStoriesBlock,
  CallToActionBlock,
]
