# Architecture decision record

One entry per decision that would be expensive to reverse. Newest last. When a
decision changes, add a superseding entry rather than editing history.

Status values: `accepted` · `superseded` · `deferred` · `blocked`

---

## ADR-0001 — Build as an independent custom publication

**Status:** accepted · 2026-08-11

**Context.** Dorvell needs an editorial home connecting photography, film,
writing, modeling, and collaborations. The alternatives were a hosted blog
platform (Blogger/WordPress/Squarespace), an extension of the existing
`dorvellferguson.com` codebase, or a new purpose-built product.

**Decision.** Build FERG IN FOCUS as a separate repository, deployment,
database, CMS, and public identity.

**Why.** A hosted platform cannot express the motion system, media pipeline,
rights model, or performance budgets this product requires, and it makes the
archive dependent on a vendor's page builder. Extending the current site would
inherit the "DF Archive" identity the publication is explicitly meant to differ
from, and would couple two products with unrelated release cadences.

**Consequences.** More upfront engineering. In exchange: full control of the
content model, no theme lock-in, and a genuine separation of concerns between
the portfolio and the publication. The two sites link to each other; they never
share a shell, bundle, or stylesheet.

---

## ADR-0002 — Next.js 16 App Router with Payload CMS in the same application

**Status:** accepted · 2026-08-11

**Context.** The publication is reading-first and must render server-side, but
it also needs a real editorial workflow: drafts, autosave, versions, scheduled
publishing, live preview, media metadata, and role-based access.

**Decision.** Next.js `16.3.0` App Router with React `19.2.8`, and Payload
`3.88.0` mounted inside the same Next.js app under the `(payload)` route group.

**Why.** Payload 3 runs natively inside the App Router, which removes the usual
headless-CMS seam: no separate service to deploy, no API round trip for
server-rendered pages (the Local API queries the database directly), and live
preview renders the _actual_ production components rather than an approximation.

Compatibility was verified rather than assumed — `@payloadcms/next@3.88.0`
declares `next: ">=16.2.6 <17.0.0"`, so Next 16.3.0 is inside the supported
range.

**Consequences.** The CMS and the public site share a release cycle and a
dependency graph. Upgrades to Next must be checked against Payload's peer range
first, and run as their own pull requests, never bundled with feature work.

---

## ADR-0003 — PostgreSQL as the editorial database

**Status:** accepted · 2026-08-11

**Context.** The content model is relational — stories relate to people,
places, partners, tags, series, and issues, and search must span all of them.

**Decision.** PostgreSQL, via `@payloadcms/db-postgres`. Local development runs
a real Postgres 17 instance; production uses a managed provider with automated
backups, point-in-time restore, and separate preview/production databases.

**Why.** The relationships are genuinely many-to-many, and the v1 search plan
depends on Postgres-specific features: `tsvector` ranking over
title/dek/body/captions/transcript, plus `pg_trgm` fuzzy matching on names.

SQLite was rejected for local development despite being easier to set up. It
does not support those features, so search would have to be stubbed locally,
and the Drizzle migration files differ per adapter — schema drift would reach
production unnoticed.

**Consequences.** Contributors install Postgres (documented in
`docs/runbooks/LOCAL_SETUP.md`). Migrations are committed and run in CI.

---

## ADR-0004 — Stable neutral routes with CMS-configurable channel labels

**Status:** accepted · 2026-08-11

**Context.** The public names for the writing and modeling channels are not
final. Waiting for them would block development; guessing would bake a
temporary name into URLs, analytics, and inbound links.

**Decision.** Routes are permanently `/stories` and `/modeling`. Every visible
label, tagline, description, and accent lives in the `channelSettings` global.

**Why.** Renaming a channel must cost one CMS edit, not a route migration with
redirects, lost rankings, and broken bookmarks.

**Consequences.** No component may hard-code a channel's display name. Channel
copy is read from CMS data at render. A lint-level convention plus tests guard
this: searching the codebase for a working name like "Dispatches" or "In Frame"
outside `docs/` should return nothing.

---

## ADR-0005 — Search starts in Postgres behind a provider interface

**Status:** accepted · 2026-08-11

**Decision.** Implement v1 search with Postgres full-text plus trigram matching
behind a `SearchProvider` abstraction in `lib/search/`.

**Why.** At launch scale — low hundreds of stories — a dedicated search service
is operational cost with no reader benefit. The abstraction means adopting
Typesense, Meilisearch, or Algolia later is a provider swap, not a template
rewrite.

**Migration trigger.** Revisit when any holds: index size or query volume causes
measurable database contention; typo tolerance or faceting proves inadequate;
indexed records exceed roughly tens of thousands; or analytics show search has
become a primary navigation path.

---

## ADR-0006 — Motion is layered onto a working product, never load-bearing

**Status:** accepted · 2026-08-11

**Context.** The studied source packages demonstrate expressive transitions.
The risk is a site that is impressive once and unusable thereafter.

**Decision.** Four capability tiers (0 static → 3 explicit visual mode). Every
route is complete and readable at Tier 0. Motion modules ship one per change,
each with its reduced-motion and failure path included.

**Why.** Motion must answer a product question — what changed, where the
selected object went, which channel was entered. Anything else is removed. A
transition that can freeze navigation is a worse defect than no transition.

**Consequences.** Route transitions never own navigation; Next.js does.
Overlays time out and reveal the destination. GSAP and Three.js load as
separate chunks that cannot affect core route budgets.

---

## ADR-0007 — Mux for adaptive playback, S3 as the master archive

**Status:** deferred · 2026-08-11

**Decision.** Public video playback targets Mux HLS; S3 remains the master and
archive source. Video access goes through a `VideoSource` interface in
`lib/media/` so the provider is swappable.

**Deferred because** the Mux account is not provisioned. Until it exists, the
provider resolves to direct progressive MP4 from the media origin. The player,
poster, captions, transcript, and chapter UI are provider-independent and are
built now.

**Alternative if Mux is rejected:** S3 masters → MediaConvert → HLS/CMAF →
CloudFront, with custom job tracking. Choose that path only if the team accepts
the additional engineering and operational burden.

---

## ADR-0008 — Media isolation from the existing site's storage

**Status:** blocked · 2026-08-11

**Context.** The current portfolio serves media from a public S3 bucket
(`dorvell-ferguson.s3.us-east-2.amazonaws.com`). Reusing it is only acceptable
if the publication can be fully scoped to its own prefix without endangering
existing keys.

**Decision.** Pending audit. Default to a dedicated bucket unless every
isolation condition passes: prefix-scoped bucket policy, no breakage from
private-origin changes, understood object ownership and CORS, production writes
that cannot touch current-site keys, independent CloudFront caching and
invalidation, least-privilege IAM, and a rollback/export path.

**Blocked on:** read-only AWS access to run the inventory.

**Interim rule, in force now.** All migration tooling is read-only against
legacy storage and defaults to `--dry-run`. No script may write to, move, or
delete a key outside the `ferg-in-focus/` prefix — enforced in code, not by
convention.

---

## ADR-0009 — Tailwind 4 utilities over a CSS-variable theme contract

**Status:** accepted · 2026-08-11

**Decision.** Tailwind CSS 4 with CSS-first `@theme` tokens for layout,
spacing, and shared UI. Channel and partner themes are CSS custom property
contracts switched by `data-channel`; complex editorial composition uses plain
CSS or CSS Modules.

**Why.** Channel theming needs to cascade into arbitrary nested components
without duplicating stylesheets, which is what custom properties do well and
utility classes do badly. Conversely, layout and spacing consistency is exactly
what utilities are good at. GSAP animates transforms, opacity, clip paths, and
documented custom properties — never arbitrary design values.

**Consequences.** A partner accent can only reach clamped roles. It can never
override body text or focus-indicator color.
