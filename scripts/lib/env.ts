import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Loads `.env` for standalone scripts.
 *
 * Next.js loads env files itself, but `tsx` does not — so a script that boots
 * Payload directly fails with "missing secret key" unless it loads them first.
 *
 * Uses Node's built-in `process.loadEnvFile` rather than adding a dotenv
 * dependency. Import this module for its side effect, before anything that
 * reads `process.env`:
 *
 *     import '@/scripts/lib/env'
 *
 * Missing files are not an error. CI supplies real environment variables
 * directly, and there is no `.env` on disk there.
 */
function load(file: string): void {
  const resolved = path.resolve(process.cwd(), file)
  if (!existsSync(resolved)) return

  try {
    process.loadEnvFile(resolved)
  } catch (error) {
    console.warn(`[env] could not read ${file}:`, error)
  }
}

// Local overrides win, matching the precedence Next.js applies.
load('.env')
load('.env.local')
