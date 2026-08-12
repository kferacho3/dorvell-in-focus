/**
 * Renders JSON-LD.
 *
 * `application/ld+json` content is not HTML, so React does not escape it —
 * hence the explicit `<` escape. Without it, a headline containing `</script>`
 * would close the tag early and inject markup into the page. That input comes
 * from the CMS, so it is untrusted by definition.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> | null }) {
  if (!schema) return null

  const json = JSON.stringify(schema).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
