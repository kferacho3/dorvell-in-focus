import { RichText } from '@payloadcms/richtext-lexical/react'

import { EditorialImage } from '@/components/media/EditorialImage'
import { formatDuration } from '@/lib/media/resolve'
import { cn } from '@/lib/utils/cn'

import type { Story } from '@/payload-types'

type StoryBlock = NonNullable<Story['contentBlocks']>[number]

/**
 * Story block renderer.
 *
 * Every block is server-rendered. Nothing here is a client component — the
 * whole story must be readable with JavaScript unavailable, which is a release
 * blocker in the plan (§14.5). Interactivity is layered on afterwards by the
 * motion modules, attaching to this markup rather than replacing it.
 *
 * Rich text goes through Payload's Lexical renderer rather than
 * `dangerouslySetInnerHTML`, so CMS content cannot inject markup.
 */
export function BlockRenderer({ blocks }: { blocks: Story['contentBlocks'] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => (
        <Block key={block.id ?? index} block={block} index={index} />
      ))}
    </>
  )
}

/** Wraps a block in the reading measure unless it deliberately breaks out. */
function Measured({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('shell', className)}>
      <div className="measure mx-auto">{children}</div>
    </div>
  )
}

function Block({ block, index }: { block: StoryBlock; index: number }) {
  switch (block.blockType) {
    // ------------------------------------------------------------ text --
    case 'prose':
      return (
        <div className={cn('shell my-10')}>
          <div
            className={cn(
              'prose-editorial',
              block.width === 'wide' ? 'max-w-4xl' : 'measure',
              'mx-auto',
            )}
          >
            <RichText data={block.content} />
          </div>
        </div>
      )

    case 'pullQuote':
      return (
        <Measured className="my-16">
          <blockquote className="type-h3 border-channel-accent border-l pl-6 font-[family-name:var(--font-display)]">
            <p className="m-0">{block.quote}</p>
            {block.attribution && (
              <footer className="type-meta text-channel-muted mt-4 not-italic">
                — {block.attribution}
              </footer>
            )}
          </blockquote>
        </Measured>
      )

    case 'chapterDivider':
      return (
        <div className="shell my-20" id={block.anchor ?? undefined}>
          <div className="flex items-center gap-6">
            <span aria-hidden className="bg-channel-rule h-px flex-1" />
            {block.label && (
              <span className="type-meta text-channel-muted">{block.label}</span>
            )}
            <span aria-hidden className="bg-channel-rule h-px flex-1" />
          </div>
        </div>
      )

    case 'interview':
      return (
        <Measured className="my-12">
          <div className="space-y-8">
            {(block.exchanges ?? []).map((exchange, i) => (
              <div key={exchange.id ?? i}>
                <p className="type-meta text-channel-accent mb-2">
                  {block.intervieweeName ? 'FERG IN FOCUS' : 'Q'}
                </p>
                <p className="type-lead m-0 font-medium">{exchange.question}</p>
                <p className="type-meta text-channel-muted mt-6 mb-2">
                  {block.intervieweeName ?? 'A'}
                </p>
                <div className="prose-editorial">
                  <RichText data={exchange.answer} />
                </div>
              </div>
            ))}
          </div>
        </Measured>
      )

    case 'callout':
      return (
        <Measured className="my-12">
          <aside className="border-channel-accent bg-channel-fg/[0.03] border-l-2 p-6">
            {block.title && <p className="type-kicker mb-3">{block.title}</p>}
            <div className="prose-editorial text-[0.95em]">
              <RichText data={block.content} />
            </div>
          </aside>
        </Measured>
      )

    case 'sourceNotes':
      return (
        <Measured className="my-12">
          <section data-source-notes className="border-channel-rule border-t pt-6">
            <h2 className="type-meta text-channel-muted">Sources</h2>
            <ol className="mt-4 space-y-2">
              {(block.notes ?? []).map((note, i) => (
                <li key={note.id ?? i} className="type-caption">
                  <span className="type-meta mr-2">{String(i + 1).padStart(2, '0')}</span>
                  {note.text}
                  {note.url && (
                    <>
                      {' '}
                      <a
                        href={note.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="underline underline-offset-2"
                      >
                        {new URL(note.url).hostname.replace(/^www\./, '')}
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </Measured>
      )

    case 'correction':
      return (
        <Measured className="my-10">
          <aside
            data-correction-note
            className="border-channel-rule type-caption border p-5"
          >
            <p className="type-meta text-channel-accent mb-2">
              {block.kind === 'correction' ? 'Correction' : 'Update'}
              {block.date ? ` · ${new Date(block.date).toISOString().slice(0, 10)}` : ''}
            </p>
            <p className="m-0">{block.note}</p>
          </aside>
        </Measured>
      )

    case 'timeline':
      return (
        <Measured className="my-14">
          <ol className="border-channel-rule space-y-6 border-l pl-6">
            {(block.entries ?? []).map((entry, i) => (
              <li key={entry.id ?? i} className="relative">
                <span
                  aria-hidden
                  className="bg-channel-accent absolute top-2 -left-[1.6rem] h-px w-4"
                />
                <p className="type-meta text-channel-muted">{entry.when}</p>
                <p className="type-lead m-0 mt-1 font-medium">{entry.label}</p>
                {entry.detail && (
                  <p className="type-body text-channel-muted mt-2">{entry.detail}</p>
                )}
              </li>
            ))}
          </ol>
        </Measured>
      )

    // ----------------------------------------------------------- media --
    case 'image': {
      const presentation = block.presentation ?? 'contained'
      if (presentation === 'fullBleed') {
        return (
          <div className="bleed my-16">
            <EditorialImage
              media={block.media}
              sizes="fullBleed"
              priority={index === 0}
            />
          </div>
        )
      }
      if (presentation === 'wide') {
        return (
          <div className="shell my-14">
            <EditorialImage media={block.media} sizes="lead" priority={index === 0} />
          </div>
        )
      }
      return (
        <Measured className="my-12">
          <EditorialImage media={block.media} sizes="measure" priority={index === 0} />
        </Measured>
      )
    }

    case 'imagePair':
      return (
        <div className="shell my-14">
          <div
            className={cn(
              'grid gap-(--shell-gutter) sm:grid-cols-2',
              block.alignment === 'baseline' && 'items-end',
              block.alignment === 'match' && 'items-stretch',
            )}
          >
            <EditorialImage media={block.left} sizes="half" />
            <EditorialImage media={block.right} sizes="half" />
          </div>
        </div>
      )

    case 'triptych':
      return (
        <div className="shell my-14">
          <div className="grid gap-(--shell-gutter) sm:grid-cols-3">
            {(block.images ?? []).map((entry, i) => (
              <EditorialImage key={entry.id ?? i} media={entry.media} sizes="card" />
            ))}
          </div>
        </div>
      )

    case 'contactSheet':
      return (
        <section className="shell my-16" data-contact-sheet>
          {block.title && <h2 className="type-kicker mb-6">{block.title}</h2>}
          <ol className="grid grid-cols-2 gap-(--shell-gutter) sm:grid-cols-3 lg:grid-cols-5">
            {(block.frames ?? []).map((frame, i) => (
              <li key={frame.id ?? i} className="relative">
                <div
                  className={cn(
                    frame.selected && 'outline-channel-accent outline-2 outline-offset-4',
                  )}
                >
                  <EditorialImage media={frame.media} sizes="thumbnail" />
                </div>
                {block.showFrameNumbers !== false && (
                  <p className="type-meta text-channel-muted mt-2">
                    {String(i + 1).padStart(2, '0')}
                    {frame.selected && (
                      <span className="text-channel-accent ml-2">selected</span>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )

    case 'beforeAfter':
      return (
        <div className="shell my-14">
          <div className="grid gap-(--shell-gutter) sm:grid-cols-2">
            <div>
              <p className="type-meta text-channel-muted mb-3">
                {block.beforeLabel ?? 'Before'}
              </p>
              <EditorialImage media={block.before} sizes="half" />
            </div>
            <div>
              <p className="type-meta text-channel-accent mb-3">
                {block.afterLabel ?? 'After'}
              </p>
              <EditorialImage media={block.after} sizes="half" />
            </div>
          </div>
          {block.note && <p className="type-caption measure mt-5">{block.note}</p>}
        </div>
      )

    case 'annotatedImage':
      return (
        <div className="shell my-14">
          <div className="relative">
            <EditorialImage media={block.media} sizes="lead" />
            {(block.annotations ?? []).map((annotation, i) => (
              <span
                key={annotation.id ?? i}
                aria-hidden
                className="border-channel-accent text-channel-accent bg-channel-bg type-meta absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
                style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
              >
                {i + 1}
              </span>
            ))}
          </div>
          {/* Also listed below, so the information is never hover-only (§12.2). */}
          <ol className="measure mt-6 space-y-3">
            {(block.annotations ?? []).map((annotation, i) => (
              <li key={annotation.id ?? i} className="type-caption">
                <span className="type-meta text-channel-accent mr-3">{i + 1}</span>
                <strong className="font-medium">{annotation.label}</strong>
                {annotation.detail && <> — {annotation.detail}</>}
              </li>
            ))}
          </ol>
        </div>
      )

    // ---------------------------------------------------------- motion --
    case 'video':
    case 'verticalVideoPair':
    case 'posterSequence':
      // The accessible player lands in PR10 with the 4KFERG channel. Until
      // then a block placed in a draft renders nothing rather than a broken
      // element — no published story uses these yet.
      return null

    case 'chapterList':
      return (
        <Measured className="my-12">
          <h2 className="type-kicker mb-5">Chapters</h2>
          <ol className="border-channel-rule divide-channel-rule divide-y border-y">
            {(block.chapters ?? []).map((chapter, i) => (
              <li key={chapter.id ?? i} className="flex gap-5 py-3">
                <span className="type-meta text-channel-accent shrink-0 pt-1">
                  {formatDuration(chapter.startSeconds) ?? '0:00'}
                </span>
                <span>
                  <span className="type-body block font-medium">{chapter.title}</span>
                  {chapter.note && (
                    <span className="type-caption block">{chapter.note}</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </Measured>
      )

    case 'transcriptExcerpt':
      return (
        <Measured className="my-12">
          <figure className="border-channel-rule m-0 border-l pl-5">
            {typeof block.startSeconds === 'number' && (
              <p className="type-meta text-channel-muted mb-2">
                {formatDuration(block.startSeconds)}
              </p>
            )}
            <blockquote className="type-body m-0 whitespace-pre-line">
              {block.excerpt}
            </blockquote>
          </figure>
        </Measured>
      )

    // ---------------------------------------------------- relationship --
    case 'creditsBlock':
      return (
        <Measured className="my-14">
          <section data-credits className="border-channel-rule border-t pt-6">
            <h2 className="type-meta text-channel-muted">{block.title ?? 'Credits'}</h2>
            <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
              {(block.credits ?? []).map((credit, i) => (
                <div key={credit.id ?? i} className="contents">
                  <dt className="type-meta text-channel-muted">{credit.role}</dt>
                  <dd className="type-caption m-0">
                    {credit.url ? (
                      <a
                        href={credit.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="underline underline-offset-2"
                      >
                        {credit.name}
                      </a>
                    ) : (
                      credit.name
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Measured>
      )

    case 'partnerDisclosure': {
      const partner = typeof block.partner === 'object' ? block.partner : null
      const statement =
        block.statement ??
        (partner
          ? `This story involves ${partner.name}. Relationship: ${partner.relationshipType}.`
          : null)
      if (!statement) return null

      return (
        <Measured className="my-8">
          <aside
            data-disclosure
            className="border-channel-accent type-caption border-y py-4"
          >
            <p className="type-meta text-channel-accent mb-2">Disclosure</p>
            <p className="m-0">{statement}</p>
          </aside>
        </Measured>
      )
    }

    case 'partnerProfile': {
      const partner = typeof block.partner === 'object' ? block.partner : null
      if (!partner) return null

      return (
        <Measured className="my-12">
          <section className="border-channel-rule border p-6">
            <h2 className="type-h3">{partner.name}</h2>
            {block.role && <p className="type-caption mt-2">Role: {block.role}</p>}
            {(block.deliverables ?? []).length > 0 && (
              <ul className="mt-4 space-y-1">
                {(block.deliverables ?? []).map((entry, i) => (
                  <li key={entry.id ?? i} className="type-caption">
                    {entry.item}
                  </li>
                ))}
              </ul>
            )}
            {partner.website && (
              <a
                href={partner.website}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="type-kicker mt-5 inline-block underline underline-offset-4"
              >
                Visit {partner.name}
              </a>
            )}
          </section>
        </Measured>
      )
    }

    case 'productCredits':
      return (
        <Measured className="my-12">
          <section data-credits>
            <h2 className="type-meta text-channel-muted">Worn and used</h2>
            <ul className="mt-4 space-y-2">
              {(block.items ?? []).map((item, i) => (
                <li key={item.id ?? i} className="type-caption">
                  <strong className="font-medium">{item.item}</strong>
                  {item.brand && <> — {item.brand}</>}
                  {item.url && (
                    <>
                      {' '}
                      <a
                        href={item.url}
                        // Affiliate links must be marked sponsored, both for
                        // search engines and for honesty.
                        rel={
                          item.isAffiliate
                            ? 'sponsored noopener noreferrer'
                            : 'noopener noreferrer'
                        }
                        target="_blank"
                        className="underline underline-offset-2"
                      >
                        link
                      </a>
                      {item.isAffiliate && (
                        <span className="type-meta text-channel-muted ml-2">
                          affiliate
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </Measured>
      )

    case 'relatedStories':
      // Rendered by the story page itself, which can blend editorial picks with
      // entity overlap. Placing it as a block only marks where it belongs.
      return null

    case 'callToAction':
      return (
        <Measured className="my-16">
          <section className="border-channel-rule border-y py-10 text-center">
            {block.heading && <h2 className="type-h3">{block.heading}</h2>}
            {block.body && (
              <p className="type-body text-channel-muted mx-auto mt-3 max-w-[46ch]">
                {block.body}
              </p>
            )}
            <a
              href={
                block.kind === 'portfolio'
                  ? 'https://www.dorvellferguson.com/'
                  : '/newsletter'
              }
              className="type-kicker border-channel-fg/30 hover:border-channel-accent mt-6 inline-block border px-5 py-3 transition-colors"
            >
              {block.kind === 'portfolio' ? 'See the portfolio' : 'Subscribe'}
            </a>
          </section>
        </Measured>
      )

    default:
      return null
  }
}
