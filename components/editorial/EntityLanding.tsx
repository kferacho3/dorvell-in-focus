import { StoryCard } from '@/components/editorial/StoryCard'
import { PublicationShell } from '@/components/layout/PublicationShell'

import type { Story } from '@/payload-types'

type EntityLandingProps = {
  /** Small label above the name — "Tag", "Person", "Place". */
  kicker: string
  name: string
  description?: string | null
  /** Extra metadata line, e.g. a person's role or a place's locality. */
  detail?: string | null
  stories: Story[]
  total: number
  links?: { label: string; url: string }[]
}

/**
 * Shared landing page for a tag, person, or place.
 *
 * These pages exist to answer one question — what work involves this? — so the
 * entity's own copy stays short and the work takes the page.
 */
export function EntityLanding({
  kicker,
  name,
  description,
  detail,
  stories,
  total,
  links,
}: EntityLandingProps) {
  return (
    <PublicationShell channel="publication">
      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        <p className="type-meta text-channel-muted">{kicker}</p>
        <h1 className="type-h1 mt-5">{name}</h1>

        {detail && <p className="type-lead text-channel-muted mt-4">{detail}</p>}
        {description && <p className="type-body measure mt-6">{description}</p>}

        {links && links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="type-kicker underline underline-offset-4"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="type-meta text-channel-muted mt-8">
          {total === 0
            ? 'No published work yet'
            : `${total} ${total === 1 ? 'story' : 'stories'}`}
        </p>
      </section>

      {stories.length > 0 ? (
        <section className="shell py-12">
          <div className="editorial-grid">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                className="col-span-4 md:col-span-4 lg:col-span-4"
                headingLevel={2}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="shell py-20">
          <p className="type-lead text-channel-muted measure">
            Nothing published references this yet.
          </p>
        </section>
      )}
    </PublicationShell>
  )
}
