import { anyone, isEditor } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import { CHANNEL_LIST } from '@/lib/channels'

import type { CollectionConfig } from 'payload'

/**
 * Controlled subject taxonomy (plan §3.10).
 *
 * Tags are *not* freely creatable from the story editor. That single decision
 * is what prevents the usual outcome: `film`, `films`, `filmmaking`, `video`,
 * `videos`, and `motion` all existing, each holding a fraction of the work, and
 * none of them useful for discovery.
 *
 * Merging is a first-class operation. A merged tag keeps its slug and redirects
 * to its canonical target, so old links and bookmarks survive the cleanup.
 */
export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'kind', 'status', 'channelAffinity'],
    group: 'Taxonomy',
  },
  access: {
    read: anyone,
    // Editors curate the taxonomy; authors apply it but cannot extend it.
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: 'label', type: 'text', required: true, index: true },
    slugField({ sourceField: 'label' }),
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'subject',
      options: [
        { label: 'Subject', value: 'subject' },
        { label: 'Format', value: 'format' },
        { label: 'Technique', value: 'technique' },
        { label: 'Mood / visual', value: 'mood' },
      ],
      admin: {
        description:
          'Keeps "Photojournalism" (subject) distinct from "Photo Essay" (format) and "cinematic" (mood).',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Merged into another tag', value: 'merged' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
    },
    {
      name: 'mergedInto',
      type: 'relationship',
      relationTo: 'tags',
      admin: {
        condition: (data) => data?.status === 'merged',
        description: 'Requests for this tag redirect here.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'tags',
      admin: { description: 'Optional hierarchy, e.g. Runway under Fashion.' },
    },
    {
      name: 'aliases',
      type: 'array',
      labels: { singular: 'Alias', plural: 'Aliases' },
      fields: [{ name: 'value', type: 'text', required: true }],
      admin: {
        description:
          'Alternate spellings that should find this tag in search. Not shown to readers.',
      },
    },
    {
      name: 'channelAffinity',
      type: 'select',
      hasMany: true,
      options: CHANNEL_LIST.map((channel) => ({
        label: channel.fallbackLabel,
        value: channel.key,
      })),
      admin: { description: 'Where this tag is normally offered. Not a restriction.' },
    },
    { name: 'description', type: 'textarea' },
  ],
}
