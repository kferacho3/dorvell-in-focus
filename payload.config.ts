import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { COLLECTIONS } from '@/payload/collections'
import { GLOBALS } from '@/payload/globals'

import type { Plugin } from 'payload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * S3 storage is enabled only when a bucket is configured.
 *
 * Locally, uploads fall back to disk so a developer needs no AWS access at all
 * (see docs/runbooks/LOCAL_SETUP.md). Credentials come from the ambient
 * provider chain rather than being read from explicit env vars, which is what
 * lets Vercel OIDC hand out short-lived role credentials in production. If you
 * find yourself adding AWS_ACCESS_KEY_ID here, stop — that is the thing this
 * arrangement exists to avoid.
 */
const storagePlugins: Plugin[] = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: {
          media: {
            prefix: process.env.S3_PREFIX ?? 'ferg-in-focus',
            generateFileURL: ({ filename, prefix }) => {
              const cdn = process.env.NEXT_PUBLIC_MEDIA_URL
              const key = [prefix, filename].filter(Boolean).join('/')
              return cdn ? `${cdn}/${key}` : `/${key}`
            },
          },
        },
        bucket: process.env.S3_BUCKET,
        config: {
          region: process.env.AWS_REGION ?? 'us-east-2',
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '· FERG IN FOCUS',
    },
    /**
     * Live preview viewports (plan §7.8). Mobile first in the list because
     * most readers arrive there, and a layout that was only ever checked at
     * 1440 is a layout that breaks for the majority.
     */
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 1000 },
        { label: 'Wide', name: 'wide', width: 1920, height: 1080 },
      ],
      collections: ['stories'],
    },
  },

  collections: COLLECTIONS,
  globals: GLOBALS,

  editor: lexicalEditor(),

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    migrationDir: path.resolve(dirname, 'payload/migrations'),
    /*
     * Migrations are the only way the schema changes — including locally.
     *
     * Payload's default in development is to push schema changes straight to
     * the database. That is convenient and it is exactly how schema drift
     * reaches production: the local database quietly diverges from the
     * committed migrations, and the next `payload migrate` refuses to run
     * without a data-loss prompt because it can no longer tell what state the
     * database is in.
     *
     * With push disabled, a schema change means `pnpm cms:migrate:create`,
     * which produces a file that gets reviewed, committed, and replayed
     * identically in CI and production (ADR-0003).
     */
    push: false,
  }),

  secret: process.env.PAYLOAD_SECRET ?? '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,

  upload: {
    limits: {
      // Film masters are large. Uploads above this go to S3 directly through
      // the migration tooling rather than through the admin panel.
      fileSize: 512 * 1024 * 1024,
    },
  },

  // Drafts must never be publicly reachable, so preview links are signed.
  // The route handler compares against this same secret.
  cors: process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : [],
  csrf: process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : [],

  plugins: [...storagePlugins],
})
