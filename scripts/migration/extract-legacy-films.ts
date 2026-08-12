/**
 * Extracts the authored film catalogue from the existing portfolio.
 *
 * `dorvellferguson.com` holds real editorial work that this publication should
 * inherit as *source material*: 26 named films with descriptions, director's
 * notes, moods, tags, credited roles, visual-language lines, written synopses,
 * and — where the cross-post was verified — Instagram permalinks.
 *
 * Read-only. This never touches the source repository, and it never fabricates
 * a field that was not there.
 *
 * Why parse rather than import: `creative.ts` imports generated JSON manifests
 * and a `@/lib` path alias that only resolve inside the other project. The
 * `curation` array itself is plain object literals, so it is sliced out and
 * evaluated in isolation.
 *
 *   pnpm tsx scripts/migration/extract-legacy-films.ts [--out data/legacy-films.json]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'

const SOURCE = process.env.LEGACY_SITE_PATH ?? '/Users/kamal/Documents/dorvel-ferguson'
const SOURCE_FILE = path.join(SOURCE, 'src/content/creative.ts')

const outFlagIndex = process.argv.indexOf('--out')
const OUT =
  outFlagIndex !== -1 ? process.argv[outFlagIndex + 1]! : 'data/legacy-films.json'

export type LegacyFilm = {
  slug: string
  title: string
  description?: string
  directorNote?: string
  category?: string
  alsoIn?: string[]
  moods?: string[]
  tags?: string[]
  type?: string
  roles?: string[]
  visualLanguage?: string
  synopsis?: string
  posts?: Record<string, string>
  filmIndex?: number
  featured?: boolean
  hero?: boolean
  location?: string
  status?: string
}

/** Slices the `curation` array literal and evaluates it in isolation. */
function extractCuration(source: string): LegacyFilm[] {
  const startMarker = 'const curation: Curation[] = ['
  const start = source.indexOf(startMarker)
  if (start === -1) throw new Error('Could not find the `curation` array in creative.ts')

  const arrayStart = start + startMarker.length - 1

  // Brace/bracket matching, skipping string literals so a `]` inside a
  // director's note cannot terminate the slice early.
  let depth = 0
  let index = arrayStart
  let quote: string | null = null

  for (; index < source.length; index += 1) {
    const char = source[index]!
    const prev = source[index - 1]

    if (quote) {
      if (char === quote && prev !== '\\') quote = null
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '[' || char === '{') depth += 1
    if (char === ']' || char === '}') {
      depth -= 1
      if (depth === 0) break
    }
  }

  const literal = source.slice(arrayStart, index + 1)

  // The slice is data, not code: object and array literals with string,
  // number, and boolean values only.
  const evaluate = new Function(`return (${literal});`) as () => LegacyFilm[]
  return evaluate()
}

function main(): void {
  const source = readFileSync(SOURCE_FILE, 'utf8')
  const films = extractCuration(source)

  const withProvenance = films.map((film) => ({
    ...film,
    legacySourceId: `legacy:dorvellferguson:creative:${film.slug}`,
    sourceUrl: `https://www.dorvellferguson.com/creative/${film.slug}`,
    // Rights are never assumed. Every record enters review, and the publish
    // validation in payload/hooks refuses anything that has not been cleared.
    rightsStatus: 'needs-review' as const,
  }))

  mkdirSync(path.dirname(OUT), { recursive: true })
  writeFileSync(
    OUT,
    `${JSON.stringify(
      {
        schema: 'ferg-in-focus/legacy-films/v1',
        source: SOURCE_FILE,
        sourceSystem: 'dorvell-portfolio',
        note: 'Read-only extraction. Rights and credits require human review before publication.',
        count: withProvenance.length,
        films: withProvenance,
      },
      null,
      2,
    )}\n`,
    'utf8',
  )

  const withNotes = withProvenance.filter((f) => f.directorNote).length
  const withSynopsis = withProvenance.filter((f) => f.synopsis).length
  const withPosts = withProvenance.filter(
    (f) => f.posts && Object.keys(f.posts).length,
  ).length

  console.log(`Extracted ${withProvenance.length} films → ${OUT}`)
  console.log(`  with director's note: ${withNotes}`)
  console.log(`  with written synopsis: ${withSynopsis}`)
  console.log(`  with a verified cross-post: ${withPosts}`)
}

main()
