import { isAdmin, isSelfOrAdmin, ROLE_LABELS, ROLES } from '@/payload/access'

import type { CollectionConfig } from 'payload'

/**
 * CMS authentication and roles.
 *
 * Accounts are individual. Never shared — the audit trail on rights overrides
 * and publishing is only meaningful if each action maps to one person.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: 'Administration',
  },
  access: {
    create: isAdmin,
    read: isSelfOrAdmin,
    update: isSelfOrAdmin,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['author'],
      options: ROLES.map((role) => ({ label: ROLE_LABELS[role], value: role })),
      access: {
        // Only an admin may grant roles. Without this, any user could escalate
        // their own privileges by editing their own profile.
        create: ({ req }) => Boolean(req.user && isAdminRole(req.user)),
        update: ({ req }) => Boolean(req.user && isAdminRole(req.user)),
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Internal job title. Bylines live in the authors collection.',
      },
    },
  ],
}

function isAdminRole(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  const roles = (user as { roles?: unknown }).roles
  return Array.isArray(roles) && roles.includes('admin')
}
