import { anyone, isStaff } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import type { CollectionConfig } from 'payload'

/**
 * People appearing in or making the work (plan §7.1).
 *
 * `hasPublicPage` defaults to false, and that default is doing real work. A
 * concert photograph may credit a musician who never agreed to a profile page
 * on this site. Recording the relationship is useful for internal search and
 * related content; publishing a page about them is a separate decision.
 */
export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'hasPublicPage'],
    group: 'Taxonomy',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true, index: true },
    slugField({ sourceField: 'name' }),
    {
      name: 'kind',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Subject', value: 'subject' },
        { label: 'Collaborator', value: 'collaborator' },
        { label: 'Interviewee', value: 'interviewee' },
        { label: 'Cast', value: 'cast' },
        { label: 'Crew', value: 'crew' },
        { label: 'Client contact', value: 'client' },
      ],
    },
    {
      name: 'hasPublicPage',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Off by default. Only enable when this person is a genuine editorial subject and is comfortable being one.',
      },
    },
    { name: 'role', type: 'text', admin: { description: 'What they do. One line.' } },
    {
      name: 'bio',
      type: 'textarea',
      admin: { condition: (data) => data?.hasPublicPage },
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'legacySourceId',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Set by the migration importer. Makes re-imports idempotent.',
      },
    },
  ],
}
