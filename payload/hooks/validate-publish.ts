import { DISCLOSURE_REQUIRED } from '@/payload/collections/Partners'

import type { CollectionBeforeChangeHook } from 'payload'

type UnknownRecord = Record<string, unknown>

function idOf(value: unknown): string | number | null {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return null
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Publish validation (plan §7.7).
 *
 * These are **hard failures**, not warnings. The distinction is the whole
 * point: a warning that appears next to a Publish button on a deadline is a
 * warning that gets clicked past. Everything checked here is something the
 * plan lists as release-blocking.
 *
 * Drafts are never blocked — an editor must be able to save half a thought.
 */
export const validatePublish: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  const doc = data as UnknownRecord

  if (doc._status !== 'published') return data

  const problems: string[] = []

  // --- Identity ---------------------------------------------------------
  if (!isNonEmptyString(doc.title)) problems.push('a headline')
  if (!isNonEmptyString(doc.slug)) problems.push('a slug')
  if (!isNonEmptyString(doc.dek)) problems.push('a dek')
  if (!isNonEmptyString(doc.channel)) problems.push('a channel')
  if (!Array.isArray(doc.authors) || doc.authors.length === 0)
    problems.push('at least one author')

  // --- Body -------------------------------------------------------------
  if (!Array.isArray(doc.contentBlocks) || doc.contentBlocks.length === 0) {
    problems.push('at least one content block')
  }

  // --- Embargo ----------------------------------------------------------
  if (isNonEmptyString(doc.embargoUntil)) {
    const embargo = new Date(doc.embargoUntil as string)
    if (!Number.isNaN(embargo.getTime()) && embargo.getTime() > Date.now()) {
      problems.push(
        `an embargo that has expired (currently ${embargo.toISOString().slice(0, 10)})`,
      )
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `This story cannot be published yet. It still needs: ${problems.join(', ')}.`,
    )
  }

  // --- Media rights -----------------------------------------------------
  // Checked against the database rather than the submitted payload, because
  // the payload only carries an id — the rights state lives on the media
  // record and may have changed since it was selected.
  const leadMediaId = idOf(doc.leadMedia)
  if (leadMediaId !== null) {
    const media = await req.payload.findByID({
      collection: 'media',
      id: leadMediaId,
      depth: 0,
      req,
    })

    const rights = (media as { rightsStatus?: string }).rightsStatus
    if (rights !== 'approved') {
      throw new Error(
        `The lead image is not cleared for publication (rights status: ${rights ?? 'unknown'}). Approve it in the media library first.`,
      )
    }

    const decorative = (media as { decorative?: boolean }).decorative === true
    const alt = (media as { alt?: string }).alt
    if (!decorative && !isNonEmptyString(alt)) {
      throw new Error('The lead image needs alt text, or must be marked decorative.')
    }

    const credit = (media as { credit?: string }).credit
    if (!isNonEmptyString(credit)) {
      throw new Error('The lead image needs a credit line.')
    }
  }

  // --- Partner disclosure ----------------------------------------------
  const partnerIds = Array.isArray(doc.partners)
    ? doc.partners.map(idOf).filter((id): id is string | number => id !== null)
    : []

  for (const partnerId of partnerIds) {
    const partner = await req.payload.findByID({
      collection: 'partners',
      id: partnerId,
      depth: 0,
      req,
    })

    const name = (partner as { name?: string }).name ?? 'This partner'
    const verification = (partner as { verificationStatus?: string }).verificationStatus
    const relationship = (partner as { relationshipType?: string }).relationshipType ?? ''

    // An unverified partnership claim is a release blocker in the plan (§14.5).
    if (verification !== 'verified') {
      throw new Error(
        `${name} is not a verified relationship yet. Confirm the relationship with Dorvell before publishing anything that claims it.`,
      )
    }

    if (DISCLOSURE_REQUIRED.includes(relationship) && !isNonEmptyString(doc.disclosure)) {
      throw new Error(
        `${name} is recorded as "${relationship}", which requires a visible disclosure. Add one before publishing.`,
      )
    }
  }

  if (operation === 'create' || operation === 'update') {
    req.payload.logger.info(
      { slug: doc.slug, channel: doc.channel },
      'story passed publish validation',
    )
  }

  return data
}
