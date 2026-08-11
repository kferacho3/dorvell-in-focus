/**
 * Editorial roles (plan §7.6).
 *
 * Least privilege, and one deliberate asymmetry: a Media Manager can process,
 * credit, and rights-review media but cannot publish a story on their own, and
 * an Author can upload but not approve their own uploads' rights. Publication
 * and rights approval are separate acts by separate people — that separation is
 * the control that keeps unlicensed work off the site.
 */

export const ROLES = [
  'admin',
  'editor',
  'author',
  'mediaManager',
  'partnerReviewer',
] as const

export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Owner / Admin',
  editor: 'Editor',
  author: 'Author',
  mediaManager: 'Media Manager',
  partnerReviewer: 'Partner Reviewer',
}

export type RoleBearer = {
  id: string | number
  roles?: Role[] | null
}

/**
 * Narrows Payload's loosely-typed `req.user` without reaching for `any`.
 * Anything that fails the shape check is treated as anonymous, which fails
 * closed rather than open.
 */
export function asRoleBearer(user: unknown): RoleBearer | null {
  if (!user || typeof user !== 'object') return null
  const candidate = user as { id?: unknown; roles?: unknown }
  if (typeof candidate.id !== 'string' && typeof candidate.id !== 'number') return null

  const roles = Array.isArray(candidate.roles)
    ? candidate.roles.filter((role): role is Role => ROLES.includes(role as Role))
    : []

  return { id: candidate.id, roles }
}

export function hasRole(user: unknown, ...roles: readonly Role[]): boolean {
  const bearer = asRoleBearer(user)
  if (!bearer?.roles) return false
  return bearer.roles.some((role) => roles.includes(role))
}
