# FERG IN FOCUS

**Life through a creative lens.**

The independent visual publication of Dorvell Ferguson Jr. — where photographs,
films, reporting, modeling, experiences, and collaborations become complete
stories rather than isolated posts.

This is a custom-built editorial product. It is **not** a Blogger, Blogspot,
WordPress, Squarespace, Wix, or theme-customization project, and it is not a
second copy of [dorvellferguson.com](https://www.dorvellferguson.com/). That
site is a factual and media *source*; this publication has its own domain,
repository, design system, content model, CMS, motion language, and deployment.

---

## Channels

| Channel | Stable route | Identity |
| --- | --- | --- |
| FERG Photography | `/photography` | The Light Table |
| 4KFERG | `/motion` | The Screening Room |
| Writing | `/stories` | Label is CMS-configurable |
| Modeling | `/modeling` | Label is CMS-configurable |
| FERG X | `/x` | Collaboration Case Files |

The public labels for `/stories` and `/modeling` are **not final**. Routes are
stable and neutral on purpose — renaming a channel is a CMS edit, never a route
migration. Never hard-code a working display name into a URL.

## Stack

- **Next.js 16 App Router** + React 19 + TypeScript (strict) — server-first rendering
- **Payload CMS 3** embedded in the same app — drafts, versions, live preview, access control
- **PostgreSQL** — editorial data, taxonomy, full-text + trigram search, redirects
- **S3 + CloudFront (OAC)** — originals and derivatives; Vercel OIDC for short-lived AWS credentials
- **Mux HLS** — adaptive public video delivery; S3 remains the master/archive
- **Tailwind CSS 4** + CSS custom properties — design system and channel themes
- **GSAP** — a governed motion system (Flip, ScrollTrigger, Observer, MotionPath, MorphSVG, SplitText)
- **Three.js / R3F** — optional, lazy-loaded signature layer only. Never the reading engine.
- **Playwright + axe + Vitest + Lighthouse CI** — release gates

## Getting started

See [`docs/runbooks/LOCAL_SETUP.md`](docs/runbooks/LOCAL_SETUP.md) for the full
first-run procedure (Postgres, environment, migrations, first admin user).

```bash
pnpm install
cp .env.example .env      # then fill in local values
pnpm cms:migrate
pnpm dev
```

- Public site — <http://localhost:3000>
- Payload admin — <http://localhost:3000/admin>

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the publication and admin locally |
| `pnpm check` | Lint, typecheck, unit tests, and production build |
| `pnpm test` | Unit and integration tests (Vitest) |
| `pnpm test:e2e` | End-to-end tests (Playwright) |
| `pnpm test:a11y` | Accessibility suite (axe + Playwright) |
| `pnpm test:visual` | Visual regression snapshots |
| `pnpm analyze` | Production build with bundle analysis |
| `pnpm cms:migrate` | Apply Payload/Postgres migrations |
| `pnpm cms:types` | Regenerate `payload-types.ts` |
| `pnpm media:inventory` | Build the media manifest (dry run by default) |

Every `scripts/media/*` tool defaults to `--dry-run`, never overwrites a legacy
S3 key, and writes a structured failure report.

## Repository map

```
app/          Routes. (site) is the publication, (payload) is the admin + API.
components/   blocks · editorial · layout · media · motion · navigation · search · ui
lib/          analytics · capabilities · cms · media · motion · search · seo · validation
payload/      collections · globals · blocks · fields · hooks · migrations
scripts/      media · migration · seo · seed
styles/       tokens · typography · motion · print
tests/        unit · integration · e2e · a11y · visual
docs/         architecture · conformance · editorial · motion · provenance · runbooks
```

## Non-negotiables

- Core content renders server-side and stays readable with motion, WebGL, and
  client JavaScript unavailable.
- Every animated interaction ships with its keyboard, reduced-motion, failure,
  resize, back-button, and cleanup behavior **in the same change**.
- No copied reference-site code, CSS, media, article text, or brand assets. No
  demo-generated imagery from any studied package.
- No fabricated sponsor, client, agency, campaign, publication, rights, credit,
  date, person, or place claims. Relationship labels are facts, not aspirations.
- Media without an approved rights state cannot be published.
- No secrets in the repository. AWS access is via OIDC role, never static keys.

Provenance for every studied technique is recorded in
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) and
[`docs/provenance/SOURCE_LEDGER.md`](docs/provenance/SOURCE_LEDGER.md).
Requirement status lives in
[`docs/conformance/MASTER_LEDGER.md`](docs/conformance/MASTER_LEDGER.md).

## Ownership

- **Dorvell Ferguson Jr.** — brand, content, facts, image selection, rights,
  relationship approval, final editorial voice.
- **Kamal Feracho** — product direction, frontend architecture, design fidelity,
  implementation review, deployment coordination.

Agents accelerate the work. They do not decide facts, legal rights, sponsor
status, or final brand identity.
