import { anyone, isEditor } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import type { CollectionConfig } from 'payload'

/**
 * Curated editions.
 *
 * An issue is the publication's strongest editorial signal: it says *these
 * pieces belong together and this is what we are thinking about right now*.
 * It is also what stops the homepage from being a reverse-chronological feed.
 *
 * Issue 001 is "Both Sides of the Lens".
 */
export const Issues: CollectionConfig = {
  slug: 'issues',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'editionStatus', 'publishedAt'],
    group: 'Content',
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'number',
          type: 'number',
          required: true,
          unique: true,
          min: 1,
          admin: { width: '25%', description: 'Rendered as ISSUE 001.' },
        },
        { name: 'title', type: 'text', required: true, admin: { width: '75%' } },
      ],
    },
    slugField(),
    {
      name: 'statement',
      type: 'textarea',
      admin: { description: 'What this issue is about, in two or three sentences.' },
    },
    {
      /*
       * Named `editionStatus`, not `status`, and that is not cosmetic.
       *
       * Enabling drafts adds Payload's own `_status` column, and the Postgres
       * adapter strips the leading underscore when naming its enum — so a
       * custom field called `status` on a drafted collection collides with it
       * on `enum_issues_status`. The draft enum wins, and the migration fails
       * with "invalid input value for enum".
       *
       * The two concepts are genuinely different anyway: `_status` is whether
       * this record is published, while this is where the edition sits in the
       * publication's cycle.
       */
      name: 'editionStatus',
      type: 'select',
      defaultValue: 'in-production',
      options: [
        { label: 'In production', value: 'in-production' },
        { label: 'Current', value: 'current' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        description:
          'Only one issue should be Current. It drives the homepage issue line.',
      },
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'coverMedia', type: 'upload', relationTo: 'media' },
    {
      name: 'leadStory',
      type: 'relationship',
      relationTo: 'stories',
      admin: {
        description: 'The dominant feature on the homepage while this issue is current.',
      },
    },
    {
      name: 'railStories',
      type: 'relationship',
      relationTo: 'stories',
      hasMany: true,
      admin: {
        description:
          'Ordered sequence for the issue rail. Order here is the order readers see — it is an editorial decision, not recency.',
      },
    },
  ],
}
