import { anyone, isEditor, isStaff } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import { CHANNEL_LIST } from '@/lib/channels'

import type { CollectionConfig } from 'payload'

/**
 * Recurring editorial or visual series.
 *
 * A series is what turns scattered posts into a body of work — "What I Notice
 * Before I Press the Shutter" reads differently as entry nine of a standing
 * column than as a one-off.
 */
export const Series: CollectionConfig = {
  slug: 'series',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'status'],
    group: 'Content',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isEditor },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'dek', type: 'textarea' },
    {
      name: 'channel',
      type: 'select',
      options: CHANNEL_LIST.map((c) => ({ label: c.fallbackLabel, value: c.key })),
      admin: { description: 'Leave blank for a series that spans channels.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'ongoing',
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Complete', value: 'complete' },
        { label: 'On hold', value: 'on-hold' },
      ],
    },
    { name: 'coverMedia', type: 'upload', relationTo: 'media' },
    {
      name: 'legacySourceId',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
  ],
}
