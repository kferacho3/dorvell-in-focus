import { PublicationShell } from '@/components/layout/PublicationShell'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  aboutHero,
  milestones,
  philosophy,
  pointOfView,
  skillGroups,
} from '@/lib/content/about'
import { personSchema } from '@/lib/seo/structured-data'
import { PORTFOLIO_URL, SOCIAL_DESTINATIONS } from '@/lib/social'

import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About',
  description: aboutHero.lead,
}

export default function AboutPage() {
  return (
    <PublicationShell channel="publication">
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: personSchema(),
        }}
      />

      <section className="shell border-channel-rule border-b py-14 lg:py-20">
        <p className="type-meta text-channel-accent">{aboutHero.eyebrow}</p>
        <h1 className="type-h1 mt-5">{aboutHero.name}</h1>
        <p className="type-display-l measure mt-10 max-w-[18ch]">{aboutHero.headline}</p>
        <p className="type-lead text-channel-muted measure mt-8">{aboutHero.lead}</p>
      </section>

      <section className="shell py-14" aria-labelledby="pov">
        <h2 id="pov" className="type-meta text-channel-muted">
          Point of view
        </h2>
        <div className="prose-editorial measure mt-6">
          {pointOfView.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section
        className="shell border-channel-rule border-t py-14"
        aria-labelledby="philosophy"
      >
        <h2 id="philosophy" className="type-meta text-channel-muted">
          Working principles
        </h2>
        <ul className="mt-8 space-y-6">
          {philosophy.map((line) => (
            <li key={line} className="type-h3 measure">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="shell border-channel-rule border-t py-14"
        aria-labelledby="record"
      >
        <h2 id="record" className="type-meta text-channel-muted">
          Record
        </h2>

        <ol className="border-channel-rule mt-8 space-y-8 border-l pl-6">
          {milestones.map((milestone) => (
            <li key={`${milestone.title}-${milestone.organisation}`} className="relative">
              <span
                aria-hidden
                className="bg-channel-accent absolute top-3 -left-[1.65rem] h-px w-4"
              />
              <p className="type-meta text-channel-muted">{milestone.era}</p>
              <p className="type-h3 mt-1">{milestone.title}</p>
              <p className="type-body mt-1 font-medium">{milestone.organisation}</p>
              <p className="type-body text-channel-muted measure mt-2">
                {milestone.detail}
              </p>

              {/*
               * An unverified claim is never rendered as a plain fact. Where a
               * source blocks automated checking, that is stated rather than
               * quietly treated as confirmation.
               */}
              {milestone.proof === 'pending' ? (
                <p className="type-meta text-channel-muted mt-3">
                  <span className="border-channel-rule border px-2 py-1">
                    Unconfirmed
                  </span>
                </p>
              ) : (
                milestone.sourceNote && (
                  <p className="type-meta text-channel-muted mt-3">
                    {milestone.sourceNote}
                  </p>
                )
              )}
            </li>
          ))}
        </ol>
      </section>

      <section
        className="shell border-channel-rule border-t py-14"
        aria-labelledby="craft"
      >
        <h2 id="craft" className="type-meta text-channel-muted">
          Craft
        </h2>
        <div className="editorial-grid mt-8">
          {skillGroups.map((group) => (
            <div key={group.label} className="col-span-4 md:col-span-4 lg:col-span-3">
              <h3 className="type-kicker text-channel-accent">{group.label}</h3>
              <p className="type-caption mt-3">{group.description}</p>
              <ul className="mt-4 space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="type-caption">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="shell border-channel-rule border-t py-14"
        aria-labelledby="elsewhere"
      >
        <h2 id="elsewhere" className="type-meta text-channel-muted">
          Elsewhere
        </h2>
        <ul className="mt-6 space-y-3">
          <li>
            <a
              href={PORTFOLIO_URL}
              className="type-kicker underline underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              Portfolio &amp; booking
            </a>
          </li>
          {SOCIAL_DESTINATIONS.map((social) => (
            <li key={social.key}>
              <a
                href={social.href}
                rel="me noopener noreferrer"
                target="_blank"
                className="type-kicker underline underline-offset-4"
              >
                {social.handle}
                <span className="text-channel-muted ml-2 normal-case no-underline">
                  {social.platform}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PublicationShell>
  )
}
