import { anyone, isAdmin, isEditor } from '@/payload/access'

import { CHANNEL_LIST } from '@/lib/channels'
import { RELATIONSHIP_TYPES } from '@/payload/collections/Partners'

import type { GlobalConfig } from 'payload'

const readable = { read: anyone, update: isEditor }

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true, defaultValue: 'FERG IN FOCUS' },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Life through a creative lens.',
    },
    {
      name: 'statement',
      type: 'textarea',
      admin: {
        description:
          'One paragraph explaining the publication. Used in the footer and share defaults.',
      },
    },
    {
      name: 'defaultSeoDescription',
      type: 'textarea',
      maxLength: 180,
      admin: { description: 'Fallback for pages with no description of their own.' },
    },
    { name: 'defaultShareImage', type: 'upload', relationTo: 'media' },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'portfolioUrl',
      type: 'text',
      defaultValue: 'https://www.dorvellferguson.com/',
      admin: { description: 'The bridge to the portfolio. Never embedded or restyled.' },
    },
  ],
}

/**
 * Channel presentation.
 *
 * This global is the mechanism behind ADR-0004. The writing and modeling
 * channels have no final public name yet; changing them here changes them
 * everywhere, and the routes never move.
 */
export const ChannelSettings: GlobalConfig = {
  slug: 'channelSettings',
  admin: {
    group: 'Settings',
    description:
      'Visible channel names. The /stories and /modeling labels are still provisional — editing them here is safe and requires no development work.',
  },
  access: readable,
  fields: [
    {
      name: 'channels',
      type: 'array',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'key',
          type: 'select',
          required: true,
          options: CHANNEL_LIST.map((c) => ({
            label: `${c.fallbackLabel} (${c.route})`,
            value: c.key,
          })),
          admin: {
            description: 'Which channel this row configures. The route is fixed.',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: { description: 'The public name readers see.' },
        },
        { name: 'tagline', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'featuredStory',
          type: 'relationship',
          relationTo: 'stories',
          admin: { description: 'Leads the channel landing page.' },
        },
      ],
    },
  ],
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings' },
  access: readable,
  fields: [
    {
      name: 'headerCtaLabel',
      type: 'text',
      defaultValue: 'Newsletter',
    },
    {
      name: 'headerCtaHref',
      type: 'text',
      defaultValue: '/newsletter',
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'group',
          type: 'select',
          defaultValue: 'read',
          options: [
            { label: 'Read', value: 'read' },
            { label: 'Legal', value: 'legal' },
          ],
        },
      ],
    },
  ],
}

/**
 * Homepage curation (plan §3.4).
 *
 * The homepage is an editorial front page, not a chronological feed, so its
 * sections are ordered and toggled here rather than inferred from recency.
 */
export const HomePage: GlobalConfig = {
  slug: 'homePage',
  admin: { group: 'Settings' },
  access: readable,
  fields: [
    {
      name: 'currentIssue',
      type: 'relationship',
      relationTo: 'issues',
      admin: { description: 'Drives the issue line and the issue rail.' },
    },
    {
      name: 'leadStory',
      type: 'relationship',
      relationTo: 'stories',
      admin: { description: 'Overrides the current issue’s lead story.' },
    },
    {
      name: 'sections',
      type: 'array',
      admin: { description: 'Order here is the order on the page.' },
      fields: [
        {
          name: 'kind',
          type: 'select',
          required: true,
          options: [
            { label: 'Channel strip', value: 'channelStrip' },
            { label: 'Issue rail', value: 'issueRail' },
            { label: 'Latest stories grid', value: 'latestGrid' },
            { label: 'From the archive', value: 'fromArchive' },
            { label: 'Field note', value: 'fieldNote' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Selected credits', value: 'credits' },
          ],
        },
        { name: 'heading', type: 'text' },
        {
          name: 'stories',
          type: 'relationship',
          relationTo: 'stories',
          hasMany: true,
          admin: { description: 'Leave empty to fill automatically.' },
        },
      ],
    },
  ],
}

export const AboutPage: GlobalConfig = {
  slug: 'aboutPage',
  admin: { group: 'Settings' },
  access: readable,
  fields: [
    { name: 'headline', type: 'text' },
    { name: 'lead', type: 'textarea' },
    { name: 'body', type: 'richText' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    {
      name: 'milestones',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'organisation', type: 'text' },
        { name: 'era', type: 'text' },
        { name: 'detail', type: 'textarea' },
        {
          name: 'verified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Unverified entries are marked as pending rather than stated as fact. Confirm before any press use.',
          },
        },
      ],
    },
  ],
}

/**
 * Standard disclosure wording (plan §8.7).
 *
 * Centralised so that every sponsored, gifted, or affiliate story discloses in
 * the same words. Wording that drifts story to story reads as evasive even when
 * it is not.
 */
export const DisclosureSettings: GlobalConfig = {
  slug: 'disclosureSettings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      name: 'statements',
      type: 'array',
      fields: [
        {
          name: 'relationshipType',
          type: 'select',
          required: true,
          options: [...RELATIONSHIP_TYPES],
        },
        { name: 'statement', type: 'textarea', required: true },
      ],
    },
    {
      name: 'policyBody',
      type: 'richText',
      admin: { description: 'The full disclosure policy shown at /disclosures.' },
    },
  ],
}

export const NewsletterSettings: GlobalConfig = {
  slug: 'newsletterSettings',
  admin: { group: 'Settings' },
  access: readable,
  fields: [
    { name: 'name', type: 'text', defaultValue: 'Keep It In Focus' },
    {
      name: 'promise',
      type: 'textarea',
      admin: {
        description: 'What a subscriber actually receives. Be specific and honest.',
      },
    },
    {
      name: 'frequency',
      type: 'text',
      defaultValue: 'Every two weeks',
      admin: {
        description: 'Stated up front. Do not promise a cadence you cannot keep.',
      },
    },
    { name: 'privacyNote', type: 'text' },
  ],
}

export const GLOBALS = [
  SiteSettings,
  ChannelSettings,
  Navigation,
  HomePage,
  AboutPage,
  DisclosureSettings,
  NewsletterSettings,
]
