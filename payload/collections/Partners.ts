import { anyone, isEditor, isStaff } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import type { CollectionConfig } from 'payload'

/**
 * Relationship types (plan §3.9, §8.7).
 *
 * These are **factual labels, not marketing aspirations**. "Sponsor" means
 * money changed hands for this work. "Gifted" means product arrived and nothing
 * else did. Getting this wrong is both an FTC disclosure problem and a
 * credibility problem, and the credibility problem is the worse one.
 */
export const RELATIONSHIP_TYPES = [
  { label: 'Sponsor (paid)', value: 'sponsor' },
  { label: 'Paid partnership', value: 'paid-partnership' },
  { label: 'Client (commissioned)', value: 'client' },
  { label: 'Ambassador', value: 'ambassador' },
  { label: 'Gifted product', value: 'gifted' },
  { label: 'Affiliate', value: 'affiliate' },
  { label: 'Collaborator (unpaid)', value: 'collaborator' },
  { label: 'Event host', value: 'event-host' },
  { label: 'Editorial mention (no relationship)', value: 'editorial-mention' },
] as const

/** Relationship types that legally or ethically require a visible disclosure. */
export const DISCLOSURE_REQUIRED: readonly string[] = [
  'sponsor',
  'paid-partnership',
  'ambassador',
  'gifted',
  'affiliate',
]

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'relationshipType', 'verificationStatus'],
    group: 'Taxonomy',
  },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    // Deleting a partner would orphan disclosures on published stories.
    delete: isEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true, index: true },
    slugField({ sourceField: 'name' }),
    {
      name: 'relationshipType',
      type: 'select',
      required: true,
      defaultValue: 'editorial-mention',
      options: [...RELATIONSHIP_TYPES],
      admin: {
        description:
          'State what the relationship actually was. Defaults to the weakest claim on purpose.',
      },
    },
    {
      name: 'verificationStatus',
      type: 'select',
      required: true,
      defaultValue: 'unverified',
      options: [
        { label: 'Unverified — cannot publish', value: 'unverified' },
        { label: 'Verified by Dorvell', value: 'verified' },
        { label: 'Disputed', value: 'disputed' },
      ],
      admin: {
        description:
          'A case file cannot publish until this is verified. PacSun and Cold Culture are unverified until confirmed.',
      },
    },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'brand',
      options: [
        { label: 'Brand', value: 'brand' },
        { label: 'Publication', value: 'publication' },
        { label: 'Institution', value: 'institution' },
        { label: 'Team', value: 'team' },
        { label: 'Agency', value: 'agency' },
        { label: 'Venue', value: 'venue' },
      ],
    },
    { name: 'website', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description:
          'Optional approved brand accent as a hex value. It is contrast-clamped before use and can only tint the accent role — never body text or the focus indicator.',
        placeholder: '#0a756d',
      },
      validate: (value: unknown) => {
        if (value === null || value === undefined || value === '') return true
        if (
          typeof value !== 'string' ||
          !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
        ) {
          return 'Enter a hex colour such as #0a756d.'
        }
        return true
      },
    },
    {
      name: 'legacySourceId',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
