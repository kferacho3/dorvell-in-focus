import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Payload } from 'payload'

/**
 * Payload's Local API.
 *
 * Server components query the database directly through this rather than
 * fetching their own REST endpoint over HTTP. That removes a network round trip
 * per render, keeps access control applied, and means a page cannot accidentally
 * depend on the site being reachable from itself.
 *
 * `getPayload` memoizes internally, so calling this per request is correct and
 * does not open a new pool.
 */
export async function getCms(): Promise<Payload> {
  return getPayload({ config: configPromise })
}

/**
 * True when the database is reachable and migrated.
 *
 * Used by pages to degrade to an empty state instead of a 500 during first-run
 * setup, when a developer has cloned the repo but not yet run migrations. The
 * publication showing "nothing published yet" is a better first impression than
 * a stack trace, and it keeps `pnpm build` working on a machine with no
 * database at all.
 */
export async function isCmsReady(): Promise<boolean> {
  try {
    const payload = await getCms()
    await payload.count({ collection: 'stories', overrideAccess: true })
    return true
  } catch {
    return false
  }
}
