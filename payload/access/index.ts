import { asRoleBearer, hasRole } from './roles'

import type { Access, FieldAccess } from 'payload'

export * from './roles'

/** Anyone, including anonymous readers. Used for published public content. */
export const anyone: Access = () => true

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')

export const isEditor: Access = ({ req }) => hasRole(req.user, 'admin', 'editor')

export const isMediaManager: Access = ({ req }) =>
  hasRole(req.user, 'admin', 'editor', 'mediaManager')

/** Any authenticated staff account. Partner reviewers are excluded. */
export const isStaff: Access = ({ req }) =>
  hasRole(req.user, 'admin', 'editor', 'author', 'mediaManager')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')

export const isEditorField: FieldAccess = ({ req }) =>
  hasRole(req.user, 'admin', 'editor')

/**
 * Public read for published documents; staff see everything.
 *
 * Returning a `Where` rather than a boolean is what keeps drafts out of public
 * listings, feeds, sitemaps, and the search index automatically. A boolean
 * `true` here would leak every unpublished story the moment any query forgot
 * its own status filter — and one of them eventually would.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (hasRole(req.user, 'admin', 'editor', 'author', 'mediaManager')) return true

  return {
    _status: { equals: 'published' },
  }
}

/**
 * Authors may edit their own drafts; editors and admins may edit anything.
 *
 * Ownership is checked against the `authors` relationship rather than
 * `createdBy`, because a piece can legitimately be filed by one person on
 * behalf of another.
 */
export const ownDraftsOrEditor: Access = ({ req }) => {
  if (hasRole(req.user, 'admin', 'editor')) return true

  const bearer = asRoleBearer(req.user)
  if (!bearer || !hasRole(req.user, 'author')) return false

  return {
    authors: { contains: bearer.id },
  }
}

/** A user may always read and edit their own account. */
export const isSelfOrAdmin: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true

  const bearer = asRoleBearer(req.user)
  if (!bearer) return false

  return { id: { equals: bearer.id } }
}
