import { anyone, isEditor } from '@/payload/access'

import type { CollectionConfig } from 'payload'

/**
 * Managed redirects (plan §10.6).
 *
 * A published slug is a public contract. When one has to change, the old URL
 * keeps working — otherwise every share, bookmark, and inbound link that ever
 * pointed at the piece breaks silently, and nobody finds out until the traffic
 * is already gone.
 */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'statusCode', 'reason'],
    group: 'Administration',
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Path only, starting with a slash. For example /story/old-slug',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.startsWith('/')) {
          return 'Enter a path beginning with a slash.'
        }
        return true
      },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: {
        description: 'A path on this site, or a full URL for an external destination.',
      },
    },
    {
      name: 'statusCode',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 — permanent', value: '301' },
        { label: '302 — temporary', value: '302' },
      ],
    },
    {
      name: 'reason',
      type: 'select',
      defaultValue: 'slug-change',
      options: [
        { label: 'Slug changed', value: 'slug-change' },
        { label: 'Legacy URL from the previous site', value: 'legacy' },
        { label: 'Merged tag', value: 'tag-merge' },
        { label: 'Removed content', value: 'removed' },
      ],
    },
    { name: 'note', type: 'text' },
  ],
}
