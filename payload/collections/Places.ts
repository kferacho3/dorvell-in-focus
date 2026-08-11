import { anyone, isStaff } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'

import type { CollectionConfig } from 'payload'

/**
 * Venues, cities, and locations.
 *
 * Coordinates are deliberately coarse and optional. Publishing the exact
 * position of a private residence or a studio because it happened to be in the
 * EXIF is a real harm; a city and a venue name carry the editorial meaning
 * without it.
 */
export const Places: CollectionConfig = {
  slug: 'places',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'locality', 'region', 'kind'],
    group: 'Taxonomy',
  },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  fields: [
    { name: 'name', type: 'text', required: true, index: true },
    slugField({ sourceField: 'name' }),
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'venue',
      options: [
        { label: 'Venue', value: 'venue' },
        { label: 'City', value: 'city' },
        { label: 'Region', value: 'region' },
        { label: 'Studio', value: 'studio' },
        { label: 'Outdoor location', value: 'outdoor' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'locality', type: 'text', admin: { width: '50%', placeholder: 'Tampa' } },
        { name: 'region', type: 'text', admin: { width: '50%', placeholder: 'Florida' } },
      ],
    },
    { name: 'country', type: 'text', defaultValue: 'United States' },
    { name: 'description', type: 'textarea' },
    {
      name: 'isPrivate',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Private residences and restricted locations. Suppresses any public place page and hides precise location data.',
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
