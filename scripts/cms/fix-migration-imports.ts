/**
 * Rewrites Payload's generated migration imports so Node can run them.
 *
 * `payload migrate:create` emits:
 *
 *     import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
 *
 * `MigrateUpArgs` and `MigrateDownArgs` are type-only exports; `sql` is a real
 * runtime value. Node runs these files through native TypeScript type
 * stripping, which erases annotations without type-checking — so it cannot tell
 * which of those three names is a type, keeps all of them as runtime bindings,
 * and the import fails with:
 *
 *     SyntaxError: The requested module '@payloadcms/db-postgres'
 *     does not provide an export named 'MigrateDownArgs'
 *
 * Splitting the type imports out fixes it. This runs automatically after
 * `pnpm cms:migrate:create`, because otherwise every new migration would need
 * the same manual edit and would fail in CI the first time someone forgot.
 *
 * Idempotent: already-correct files are left alone.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'payload/migrations')

const TYPE_ONLY_EXPORTS = ['MigrateUpArgs', 'MigrateDownArgs']

const IMPORT_PATTERN = /^import \{([^}]+)\} from '(@payloadcms\/db-[a-z]+)'$/m

async function fixFile(filePath: string): Promise<boolean> {
  const original = await readFile(filePath, 'utf8')
  const match = original.match(IMPORT_PATTERN)
  if (!match) return false

  const [statement, rawNames, moduleSpecifier] = match
  if (!rawNames || !moduleSpecifier || !statement) return false

  const names = rawNames
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)

  const typeNames = names.filter((name) => TYPE_ONLY_EXPORTS.includes(name))
  const valueNames = names.filter((name) => !TYPE_ONLY_EXPORTS.includes(name))

  if (typeNames.length === 0) return false

  const replacement = [
    valueNames.length > 0
      ? `import { ${valueNames.join(', ')} } from '${moduleSpecifier}'`
      : null,
    `import type { ${typeNames.join(', ')} } from '${moduleSpecifier}'`,
  ]
    .filter(Boolean)
    .join('\n')

  await writeFile(filePath, original.replace(statement, replacement), 'utf8')
  return true
}

async function main(): Promise<void> {
  let entries: string[]
  try {
    entries = await readdir(MIGRATIONS_DIR)
  } catch {
    console.log('No migrations directory yet — nothing to fix.')
    return
  }

  const migrations = entries.filter((name) => name.endsWith('.ts') && name !== 'index.ts')

  let fixed = 0
  for (const name of migrations) {
    if (await fixFile(path.join(MIGRATIONS_DIR, name))) {
      console.log(`  fixed imports: ${name}`)
      fixed += 1
    }
  }

  console.log(
    fixed === 0
      ? `Checked ${migrations.length} migration(s); all imports already correct.`
      : `Fixed ${fixed} of ${migrations.length} migration(s).`,
  )
}

await main()
