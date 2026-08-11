import { isAdmin, isEditor } from '@/payload/access'

import type { CollectionConfig } from 'payload'

/**
 * Contact and inquiry submissions (plan §13.5).
 *
 * Nothing here is publicly readable — not by anonymous users, not by authors.
 * The collection stores real people's contact details, and the smallest number
 * of accounts that can read it is the correct number.
 *
 * Newsletter subscribers are deliberately **not** stored here. They live with
 * the newsletter provider, so an exported CMS backup never contains a mailing
 * list.
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'kind', 'status', 'createdAt'],
    group: 'Administration',
    description: 'Retention: reviewed submissions are purged after 12 months.',
  },
  access: {
    // Created by the server-side form handler, never by a browser directly.
    create: () => false,
    read: isEditor,
    update: isEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General contact', value: 'general' },
        { label: 'Commission or booking', value: 'commission' },
        { label: 'Casting or modeling', value: 'casting' },
        { label: 'Press', value: 'press' },
        { label: 'Correction', value: 'correction' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'sourcePath',
      type: 'text',
      admin: { description: 'Which page this was sent from.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
        { label: 'Spam', value: 'spam' },
      ],
    },
  ],
}
