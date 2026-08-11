import type { Field } from 'payload'

/**
 * SEO overrides (plan §7.3, §10.1).
 *
 * Every field here is optional on purpose. Good defaults are generated from the
 * title, dek, and lead media, so an editor only fills these in when the
 * generated value is genuinely wrong. A required SEO description is how
 * publications end up with a hundred descriptions that repeat the headline.
 */
export const seoFields: Field = {
  type: 'collapsible',
  label: 'SEO and sharing',
  admin: { initCollapsed: true },
  fields: [
    {
      name: 'seoTitle',
      type: 'text',
      maxLength: 70,
      admin: {
        description:
          'Overrides the headline in search results and shares. Leave blank to use the headline.',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      maxLength: 180,
      admin: {
        description: 'Leave blank to use the dek. Aim for 120–160 characters.',
      },
    },
    {
      name: 'ogMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Overrides the share image. Leave blank to generate channel-aware art from the lead media.',
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: {
        description:
          'Only when this piece was first published elsewhere and that version is authoritative.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Excludes this from search engines, sitemaps, and feeds. It stays reachable by direct link.',
      },
    },
  ],
}
