/* THIS FILE IS PART OF THE PAYLOAD ADMIN INTEGRATION.
 * It is a second root layout, sibling to app/(site)/layout.tsx. Next.js allows
 * this because neither route group has a shared parent layout — which is what
 * keeps the admin panel's stylesheet and bundle entirely out of the
 * publication, and the publication's out of the admin.
 */
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'

import { importMap } from './admin/importMap'

import type { ServerFunctionClient } from 'payload'

import '@payloadcms/next/css'

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
