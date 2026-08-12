import { PublicationShell } from '@/components/layout/PublicationShell'

type StaticPageProps = {
  kicker?: string
  title: string
  lead?: string
  /** Shown in mono under the lead. Legal pages need a visible currency date. */
  updated?: string
  children: React.ReactNode
}

/**
 * Shell for informational and legal pages.
 *
 * The reading measure and left alignment match the story template, so a policy
 * page reads as part of the publication rather than as a bolted-on document.
 */
export function StaticPage({ kicker, title, lead, updated, children }: StaticPageProps) {
  return (
    <PublicationShell channel="publication">
      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        {kicker && <p className="type-meta text-channel-muted">{kicker}</p>}
        <h1 className="type-h1 mt-5 max-w-[18ch]">{title}</h1>
        {lead && <p className="type-lead text-channel-muted measure mt-6">{lead}</p>}
        {updated && (
          <p className="type-meta text-channel-muted mt-6">Last updated {updated}</p>
        )}
      </section>

      <section className="shell py-12">
        <div className="prose-editorial measure">{children}</div>
      </section>
    </PublicationShell>
  )
}
