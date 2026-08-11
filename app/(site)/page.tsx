import { PublicationShell } from '@/components/layout/PublicationShell'

export default function HomePage() {
  return (
    <PublicationShell channel="publication">
      <div className="shell py-24">
        <p className="type-meta text-channel-muted">Issue 001 — in production</p>
        <h1 className="type-display-l mt-6 max-w-[14ch]">
          Life through a creative lens.
        </h1>
      </div>
    </PublicationShell>
  )
}
