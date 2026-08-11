import { anyone, isEditor, isStaff } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import type { CollectionConfig } from 'payload'

/**
 * Public bylines.
 *
 * Deliberately separate from `users`. A byline is editorial identity — name,
 * portrait, bio, links — while a user is an authentication record with a
 * password and a role. Merging them means a guest contributor needs a login,
 * and a developer's account leaks into public bylines.
 */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
    group: 'Content',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isEditor },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ sourceField: 'name' }),
    { name: 'role', type: 'text', admin: { placeholder: 'Founder and editor' } },
    { name: 'bio', type: 'textarea' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description:
          'Optional link to a CMS account, so an author can be shown their own drafts.',
      },
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
