import type { Field } from 'payload'

/**
 * Deterministic, URL-safe slug generation.
 *
 * Unicode is normalized to NFD and combining marks stripped, so "Café Sévigné"
 * becomes `cafe-sevigne` rather than percent-encoded bytes. Dorvell's work
 * covers named people and venues; getting this wrong produces URLs that are
 * unreadable and impossible to share by voice.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

type SlugFieldOptions = {
  /** Field whose value seeds the slug when one has not been set by hand. */
  sourceField?: string
}

/**
 * A slug field that generates from a source field but never silently rewrites
 * an existing value.
 *
 * That restraint is the point: once a story is published its slug is a public
 * contract. Regenerating it because someone fixed a typo in the headline would
 * break every inbound link and social share. Changing a live slug is a
 * deliberate act, and it routes through the `redirects` collection.
 */
export function slugField({ sourceField = 'title' }: SlugFieldOptions = {}): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Permanent part of the public URL. Changing this on a published item breaks existing links — add a redirect if you do.',
    },
    hooks: {
      beforeValidate: [
        ({ value, data, originalDoc }) => {
          if (typeof value === 'string' && value.trim().length > 0) {
            return slugify(value)
          }

          // Never regenerate over an existing slug.
          const existing = (originalDoc as Record<string, unknown> | undefined)?.slug
          if (typeof existing === 'string' && existing.length > 0) return existing

          const source = (data as Record<string, unknown> | undefined)?.[sourceField]
          return typeof source === 'string' ? slugify(source) : value
        },
      ],
    },
  }
}
