import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Integration-test environment.
 *
 * Loads `.env` for the secret, then **overrides** the database so these tests
 * can never touch development content. `DATABASE_URI_TEST` wins if set (CI
 * supplies it); otherwise it derives a `_test` sibling of the local database.
 *
 * This runs before any import that reads `process.env`, which matters because
 * Payload evaluates its config at import time.
 */
const envFile = path.resolve(process.cwd(), '.env')
if (existsSync(envFile)) {
  try {
    process.loadEnvFile(envFile)
  } catch {
    /* CI supplies real environment variables instead. */
  }
}

const explicit = process.env.DATABASE_URI_TEST
const derived = (
  process.env.DATABASE_URI ?? 'postgres://localhost:5432/ferg_in_focus'
).replace(/\/([^/?]+)(\?|$)/, (_match, name: string, tail: string) =>
  name.endsWith('_test') ? `/${name}${tail}` : `/${name}_test${tail}`,
)

process.env.DATABASE_URI = explicit ?? derived
process.env.PAYLOAD_SECRET ??= 'integration-tests-only'

// `NODE_ENV` is typed read-only by @types/node, but Vitest already sets it to
// "test" before setup files run — so there is nothing to assign here.
