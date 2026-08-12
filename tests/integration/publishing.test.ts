import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Payload } from 'payload'

/**
 * The guarantees that keep unlicensed work and unverified claims off the site.
 *
 * These are the rules the plan lists as release-blocking (§14.5), and they are
 * the reason the conformance ledger will not mark rights enforcement or access
 * control `verified` on the strength of "the code exists". Each test states the
 * failure it prevents.
 *
 * Payload and its config are imported dynamically, after tests/integration/setup
 * has pointed DATABASE_URI at the test database — the config reads the
 * connection string at import time.
 */

let payload: Payload
const created: { collection: string; id: string | number }[] = []

/** Tracks everything created so the database is left as it was found. */
function track(collection: string, id: string | number): string | number {
  created.push({ collection, id })
  return id
}

const unique = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

beforeAll(async () => {
  const { getPayload } = await import('payload')
  const config = (await import('@payload-config')).default
  payload = await getPayload({ config })
})

afterAll(async () => {
  for (const entry of created.reverse()) {
    try {
      await payload.delete({
        collection: entry.collection as 'stories',
        id: entry.id,
        overrideAccess: true,
      })
    } catch {
      /* Already gone, or removed by a cascade. */
    }
  }
})

async function makeAuthor(): Promise<string | number> {
  const slug = unique('test-author')
  const doc = await payload.create({
    collection: 'authors',
    data: { name: 'Test Author', slug },
    overrideAccess: true,
  })
  return track('authors', doc.id)
}

async function makeStory(
  authorId: string | number,
  overrides: Record<string, unknown> = {},
): Promise<string | number> {
  const slug = unique('test-story')
  const doc = await payload.create({
    collection: 'stories',
    draft: true,
    overrideAccess: true,
    data: {
      title: 'Test Story',
      slug,
      dek: 'A story created by the integration suite.',
      channel: 'stories',
      storyType: 'article',
      authors: [authorId],
      contentBlocks: [
        {
          blockType: 'prose',
          width: 'measure',
          content: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: [
                {
                  type: 'paragraph',
                  format: '',
                  indent: 0,
                  version: 1,
                  direction: 'ltr',
                  textFormat: 0,
                  children: [
                    {
                      type: 'text',
                      text: 'The body of the story, which exists so publish validation passes.',
                      format: 0,
                      style: '',
                      mode: 'normal',
                      detail: 0,
                      version: 1,
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
      _status: 'draft',
      ...overrides,
    } as never,
  })
  return track('stories', doc.id)
}

const publish = (id: string | number) =>
  payload.update({
    collection: 'stories',
    id,
    data: { _status: 'published' },
    overrideAccess: true,
  })

describe('publish validation', () => {
  it('publishes a complete story', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author)

    const result = await publish(story)
    expect(result._status).toBe('published')
  })

  it('stamps publishedAt on first publish and does not move it afterwards', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author)

    const first = await publish(story)
    expect(first.publishedAt).toBeTruthy()

    // Re-stamping on every edit would silently reorder the archive whenever
    // someone fixed a typo.
    const edited = await payload.update({
      collection: 'stories',
      id: story,
      data: { title: 'Test Story, corrected' },
      overrideAccess: true,
    })
    expect(edited.publishedAt).toBe(first.publishedAt)
  })

  it('refuses to publish without a dek', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author)

    await expect(
      payload.update({
        collection: 'stories',
        id: story,
        data: { dek: '', _status: 'published' },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })

  it('refuses to publish with no content blocks', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author, { contentBlocks: [] })

    await expect(publish(story)).rejects.toThrow(/content block/i)
  })

  it('refuses to publish before an embargo has expired', async () => {
    const author = await makeAuthor()
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const story = await makeStory(author, { embargoUntil: future })

    await expect(publish(story)).rejects.toThrow(/embargo/i)
  })

  it('leaves drafts alone — an editor must be able to save half a thought', async () => {
    const author = await makeAuthor()
    const story = await payload.create({
      collection: 'stories',
      draft: true,
      overrideAccess: true,
      data: {
        title: 'Half a thought',
        slug: unique('half'),
        dek: 'x',
        channel: 'stories',
        storyType: 'article',
        authors: [author],
        _status: 'draft',
      } as never,
    })
    track('stories', story.id)

    expect(story._status).toBe('draft')
  })
})

describe('media rights enforcement', () => {
  /**
   * `media` is an upload collection, so a record cannot exist without a file.
   * This is the smallest valid PNG — enough for sharp to probe dimensions
   * without putting a fixture image in the repository.
   */
  const PIXEL = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  )

  async function makeMedia(overrides: Record<string, unknown> = {}) {
    const doc = await payload.create({
      collection: 'media',
      overrideAccess: true,
      file: {
        data: PIXEL,
        mimetype: 'image/png',
        name: `${unique('pixel')}.png`,
        size: PIXEL.byteLength,
      },
      data: {
        title: unique('test-media'),
        kind: 'image',
        alt: 'A described photograph.',
        credit: 'Dorvell Ferguson Jr.',
        rightsStatus: 'needs-review',
        consentStatus: 'not-required',
        ...overrides,
      } as never,
    })
    return track('media', doc.id)
  }

  it('blocks publication when the lead image is not rights-approved', async () => {
    const author = await makeAuthor()
    const media = await makeMedia({ rightsStatus: 'needs-review' })
    const story = await makeStory(author, { leadMedia: media })

    // This is the single most consequential rule in the system.
    await expect(publish(story)).rejects.toThrow(/not cleared|rights/i)
  })

  it('blocks publication when an approved lead image has no credit', async () => {
    const author = await makeAuthor()
    const media = await makeMedia({ rightsStatus: 'approved', credit: '' })
    const story = await makeStory(author, { leadMedia: media })

    await expect(publish(story)).rejects.toThrow(/credit/i)
  })

  it('allows publication once the lead image is approved, described, and credited', async () => {
    const author = await makeAuthor()
    const media = await makeMedia({ rightsStatus: 'approved' })
    const story = await makeStory(author, { leadMedia: media })

    const result = await publish(story)
    expect(result._status).toBe('published')
  })

  it('refuses to approve an image with no alt text unless it is decorative', async () => {
    await expect(makeMedia({ rightsStatus: 'approved', alt: '' })).rejects.toThrow(
      /alt text|decorative/i,
    )
  })

  it('stamps the reviewer and date when rights are approved', async () => {
    const media = await makeMedia({ rightsStatus: 'needs-review' })

    const approved = await payload.update({
      collection: 'media',
      id: media,
      data: { rightsStatus: 'approved' },
      overrideAccess: true,
    })

    // The audit trail is the control that makes a rights override meaningful.
    expect(approved.reviewedAt).toBeTruthy()
  })
})

describe('partner verification and disclosure', () => {
  async function makePartner(overrides: Record<string, unknown> = {}) {
    const doc = await payload.create({
      collection: 'partners',
      overrideAccess: true,
      data: {
        name: unique('Test Brand'),
        slug: unique('test-brand'),
        relationshipType: 'editorial-mention',
        verificationStatus: 'unverified',
        ...overrides,
      } as never,
    })
    return track('partners', doc.id)
  }

  it('blocks publication while a partner relationship is unverified', async () => {
    const author = await makeAuthor()
    const partner = await makePartner({ verificationStatus: 'unverified' })
    const story = await makeStory(author, { partners: [partner] })

    // PacSun and Cold Culture sit in exactly this state until Dorvell confirms.
    await expect(publish(story)).rejects.toThrow(/not a verified relationship/i)
  })

  it('requires a disclosure for a paid relationship', async () => {
    const author = await makeAuthor()
    const partner = await makePartner({
      verificationStatus: 'verified',
      relationshipType: 'sponsor',
    })
    const story = await makeStory(author, { partners: [partner] })

    await expect(publish(story)).rejects.toThrow(/disclosure/i)
  })

  it('publishes a sponsored story once the disclosure is present', async () => {
    const author = await makeAuthor()
    const partner = await makePartner({
      verificationStatus: 'verified',
      relationshipType: 'sponsor',
    })
    const story = await makeStory(author, {
      partners: [partner],
      disclosure: 'This story was paid for by the brand named above.',
    })

    const result = await publish(story)
    expect(result._status).toBe('published')
  })

  it('does not require a disclosure for an editorial mention', async () => {
    const author = await makeAuthor()
    const partner = await makePartner({
      verificationStatus: 'verified',
      relationshipType: 'editorial-mention',
    })
    const story = await makeStory(author, { partners: [partner] })

    const result = await publish(story)
    expect(result._status).toBe('published')
  })
})

describe('access control', () => {
  it('hides drafts from anonymous readers', async () => {
    const author = await makeAuthor()
    const draft = await makeStory(author)

    const anonymous = await payload.find({
      collection: 'stories',
      where: { id: { equals: draft } },
      // No overrideAccess and no user: this is what a public request sees.
      overrideAccess: false,
    })

    // "A preview or draft is publicly indexable" is a release blocker.
    expect(anonymous.docs).toHaveLength(0)
  })

  it('shows published stories to anonymous readers', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author)
    await publish(story)

    const anonymous = await payload.find({
      collection: 'stories',
      where: { id: { equals: story } },
      overrideAccess: false,
    })

    expect(anonymous.docs).toHaveLength(1)
  })

  it('never exposes contact submissions publicly', async () => {
    // Denied outright rather than returning an empty list — the collection
    // holds real people's contact details, so "forbidden" is the right answer
    // and is what this asserts.
    await expect(
      payload.find({ collection: 'submissions', overrideAccess: false }),
    ).rejects.toThrow(/not allowed|forbidden/i)
  })
})

describe('derived fields', () => {
  it('computes reading time, word count, and a search document', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author)

    const doc = await payload.findByID({
      collection: 'stories',
      id: story,
      draft: true,
      overrideAccess: true,
    })

    expect(doc.readingMinutes).toBeGreaterThanOrEqual(1)
    expect(doc.wordCount).toBeGreaterThan(0)
    expect(doc.searchDocument).toContain('Test Story')
    // Body text must reach the search document, not just the headline —
    // captions and prose are the most valuable search surface.
    expect(doc.searchDocument).toContain('publish validation passes')
    expect(doc.contentHash).toBeTruthy()
  })

  it('never regenerates a slug when the title changes', async () => {
    const author = await makeAuthor()
    const story = await makeStory(author)

    const before = await payload.findByID({
      collection: 'stories',
      id: story,
      draft: true,
      overrideAccess: true,
    })

    const after = await payload.update({
      collection: 'stories',
      id: story,
      data: { title: 'A completely different headline' },
      overrideAccess: true,
    })

    // A published slug is a public contract. Regenerating it because someone
    // fixed a headline typo would break every inbound link.
    expect(after.slug).toBe(before.slug)
  })
})
