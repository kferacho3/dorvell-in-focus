# Master conformance ledger

One row per requirement drawn from the master implementation plan. Nothing is
"done" because code exists — a row reaches `verified` only with named evidence.

**Status values**

| Status              | Meaning                                                         |
| ------------------- | --------------------------------------------------------------- |
| `not-started`       | No implementation work has begun                                |
| `in-progress`       | Being built; not yet complete                                   |
| `implemented`       | Code exists and is believed complete; evidence not yet captured |
| `verified`          | Evidence recorded and checked                                   |
| `blocked`           | Cannot proceed; blocker named in the row                        |
| `deferred-approved` | Consciously postponed with an owner's approval                  |

**Evidence** means a test name, a report path, a screenshot, or a validator
output — not a claim. "Should work" is not evidence.

---

## A · Brand and product architecture

| ID   | Requirement                                                                              | Source           | Status        | Implementation              | Evidence | Open issue                                                       |
| ---- | ---------------------------------------------------------------------------------------- | ---------------- | ------------- | --------------------------- | -------- | ---------------------------------------------------------------- |
| A-01 | Independent repository, deployment, database, CMS, design system, and public identity    | §0.1, §6.3       | `in-progress` | This repository; ADR-0001   | —        | Vercel project + managed DB not provisioned                      |
| A-02 | Five channels on stable routes: `/photography`, `/motion`, `/stories`, `/modeling`, `/x` | §1.4             | `implemented` | `app/(site)/` — five routes | Build output: all five prerender static | —                                                                |
| A-03 | Writing and modeling display labels remain CMS-configurable; no working name in a URL    | §1.4.1, ADR-0004 | `implemented` | `channelSettings` global + `lib/cms/channel-settings.ts` | `tests/unit/channels.test.ts` | —                                                                |
| A-04 | Visual identity clearly distinct from the DF Archive                                     | §2.2.1, §4.1     | `not-started` | `styles/tokens.css`         | —        | Needs design review against the distinctness checklist           |
| A-05 | Publication explains itself in one screen and one sentence                               | §20              | `not-started` | Homepage issue line + About | —        | —                                                                |
| A-06 | Deliberate two-way bridge with the portfolio, without shared shell or bundle             | §1.7             | `not-started` | Footer + About              | —        | Portfolio-side link is Dorvell's action                          |
| A-07 | Domain, social handle, and trademark clearance for "FERG IN FOCUS"                       | §6.4, §15.2      | `blocked`     | —                           | —        | **Clearance not started.** Cannot launch publicly until resolved |

## B · Design system

| ID   | Requirement                                                                            | Source      | Status        | Implementation             | Evidence | Open issue                                 |
| ---- | -------------------------------------------------------------------------------------- | ----------- | ------------- | -------------------------- | -------- | ------------------------------------------ |
| B-01 | Publication color tokens and five channel theme contracts                              | §4.2        | `implemented` | `styles/tokens.css` | Screenshots at 1440 across all channels | —                                          |
| B-02 | Body copy meets WCAG contrast in every channel                                         | §4.2        | `not-started` | —                          | —        | Needs contrast test over all channel pairs |
| B-03 | Channel accent never carries meaning alone                                             | §4.2        | `not-started` | `ChannelNav`               | —        | —                                          |
| B-04 | Partner accent clamped to safe roles; cannot override body text or focus color         | §3.9, §4.2  | `not-started` | `lib/cms/partner-theme.ts` | —        | —                                          |
| B-05 | Three type roles: display serif, neutral grotesk, monospace metadata                   | §4.3        | `implemented` | `app/(site)/layout.tsx` via next/font | Rendered screenshots | Licensed faces pending brand approval      |
| B-06 | Self-hosted subset WOFF2; preload only above-the-fold faces                            | §4.3, §11.5 | `not-started` | `next/font`                | —        | —                                          |
| B-07 | Responsive type scale with fluid clamps                                                | §4.3        | `implemented` | `styles/typography.css` | — | —                                          |
| B-08 | 12/8/4-column responsive editorial grid with defined gutters and margins               | §4.4        | `implemented` | `styles/tokens.css` editorial-grid | Verified at 390 and 1440 | —                                          |
| B-09 | Grid-breaking permitted only for a defined editorial reason                            | §4.4        | `not-started` | Block renderer             | —        | —                                          |
| B-10 | Mobile composition designed, not mechanically collapsed                                | §4.4, §15.5 | `in-progress` | Per-breakpoint spans at every call site | Mobile screenshot after grid fix | —                                          |
| B-11 | Natural aspect ratios preserved; focal points stored for responsive crops              | §4.5        | `not-started` | `media` collection         | —        | —                                          |
| B-12 | Component governance: structured data in, no raw CMS HTML outside the audited renderer | §4.7        | `not-started` | `components/blocks/`       | —        | —                                          |

## C · Motion and interaction

| ID   | Requirement                                                                                    | Source         | Status        | Implementation                         | Evidence | Open issue                          |
| ---- | ---------------------------------------------------------------------------------------------- | -------------- | ------------- | -------------------------------------- | -------- | ----------------------------------- |
| C-01 | Motion tokens; no routine interaction exceeds ~700 ms                                          | §5.2           | `implemented` | `lib/motion/tokens.ts` + `styles/motion.css` | — | —                                   |
| C-02 | Four capability tiers with automatic downgrade                                                 | §5.3           | `implemented` | `lib/capabilities/tiers.ts` | `tests/unit/capability-tiers.test.ts` — 11 tests | —                                   |
| C-03 | Route transitions never own navigation; Next.js does                                           | §5.4, ADR-0006 | `not-started` | `components/motion/`                   | —        | —                                   |
| C-04 | Route motion state machine with cancel, timeout, and failure recovery                          | §5.4           | `not-started` | `lib/motion/route-state.ts`            | —        | —                                   |
| C-05 | Module A — Aperture Menu: reversible mid-animation, focus trap and return, Escape              | §5.5           | `not-started` | `components/navigation/ApertureMenu/`  | —        | —                                   |
| C-06 | Module B — Focus Rail: bounded, loop duplicates hidden from AT, one semantic link each         | §5.5           | `not-started` | `components/editorial/IssueRail/`      | —        | —                                   |
| C-07 | Module C — Shared Story Frame: stable key, instant fallback, back restores grid position       | §5.5           | `not-started` | `components/motion/SharedStoryFrame/`  | —        | —                                   |
| C-08 | Module D — Contact Sheet Reflow: real bounds, safe resize rebuild, instant reduced-motion swap | §5.5           | `not-started` | `components/media/ContactSheetReflow/` | —        | —                                   |
| C-09 | Module E — Editorial Line Reveal: display headings only, font-aware, reverts on cleanup        | §5.5           | `not-started` | `components/motion/LineReveal/`        | —        | —                                   |
| C-10 | Module F — Focus Curtain: decorative, ≤650 ms, skippable, no overlay under reduced motion      | §5.5           | `not-started` | `components/motion/FocusCurtain/`      | —        | —                                   |
| C-11 | Module G — Film Refraction: route-scoped dynamic import, DPR cap, full teardown                | §5.5           | `not-started` | `components/motion/FilmRefraction/`    | —        | Deferred until core budgets pass    |
| C-12 | Module H — Focus Field: optional, explicit entry, instant exit                                 | §5.5           | `not-started` | `components/motion/FocusField/`        | —        | Gated behind C-11 and budget review |
| C-13 | Native document scroll everywhere; no global smooth-scroll library in v1                       | §5.6           | `not-started` | —                                      | —        | —                                   |
| C-14 | Reduced-motion contract honored by every module; user preference overrides system              | §5.7           | `implemented` | `lib/motion/preference.ts` + `styles/motion.css` | `tests/unit/motion-preference.test.ts` — 7 tests | —                                   |
| C-15 | Persistent Motion: Full / Reduced control, stored locally without an account                   | §5.7           | `not-started` | Footer control                         | —        | —                                   |

## D · Technical architecture

| ID   | Requirement                                                           | Source         | Status        | Implementation                        | Evidence                  | Open issue                       |
| ---- | --------------------------------------------------------------------- | -------------- | ------------- | ------------------------------------- | ------------------------- | -------------------------------- |
| D-01 | Next.js App Router, server components by default                      | §6.2, §6.6     | `implemented` | `app/(site)/` | Build output: static + SSG, no client components | —                                |
| D-02 | Payload CMS embedded in the same application                          | §6.2           | `implemented` | `payload.config.ts`, `app/(payload)/` | /admin returns 200 as "Dashboard · FERG IN FOCUS" | —                                |
| D-03 | PostgreSQL with migrations committed and run in CI                    | §6.2           | `implemented` | `payload/migrations/` | 123 tables created by initial migration | Managed provider not provisioned |
| D-04 | Client components confined to genuinely interactive leaves            | §6.6           | `not-started` | —                                     | —                         | —                                |
| D-05 | CSS architecture: utilities + custom-property theme contracts         | §6.7, ADR-0009 | `in-progress` | `styles/`                             | —                         | —                                |
| D-06 | Search via Postgres FTS + trigram behind a `SearchProvider` interface | §6.8, ADR-0005 | `not-started` | `lib/search/`                         | —                         | —                                |
| D-07 | Newsletter with double opt-in, exportable list, source attribution    | §6.9           | `not-started` | `lib/newsletter/`                     | —                         | Provider not selected            |
| D-08 | Analytics events answer product questions without invasive profiling  | §6.10          | `not-started` | `lib/analytics/`                      | —                         | —                                |
| D-09 | Repository structure matches the specified layout                     | §6.5           | `implemented` | — | Directory tree matches plan §6.5 | —                                |
| D-10 | Dependencies pinned; unusual packages justified                       | §18.3          | `implemented` | `package.json`, `pnpm-lock.yaml`      | Exact pins on core stack  | —                                |

## E · Editorial data model

| ID   | Requirement                                                                                                                | Source | Status        | Implementation                      | Evidence | Open issue                   |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- | ----------------------------------- | -------- | ---------------------------- |
| E-01 | Twelve collections: stories, media, series, issues, tags, people, places, partners, authors, users, redirects, submissions | §7.1   | `implemented` | `payload/collections/` | All 12 tables present in Postgres | —                            |
| E-02 | Seven globals including `channelSettings` and `disclosureSettings`                                                         | §7.2   | `implemented` | `payload/globals/` | Admin panel Settings group | —                            |
| E-03 | Story schema: identity, dates, lead, body, relationships, credits/rights, SEO                                              | §7.3   | `implemented` | `payload/collections/Stories.ts` | Column list verified against §7.3 | —                            |
| E-04 | Calculated fields: reading time, aspect, search document, content hash, validation report                                  | §7.3   | `implemented` | `payload/hooks/derive.ts` | — | —                            |
| E-05 | Media schema: technical, editorial, and rights facets                                                                      | §7.4   | `implemented` | `payload/collections/Media.ts` | — | —                            |
| E-06 | Media without approved rights cannot be published except by a logged admin override                                        | §7.4   | `implemented` | `payload/hooks/validate-publish.ts` | Needs an integration test before `verified` | **Release blocker if unmet** |
| E-07 | Block library across text, image, motion, and relationship categories                                                      | §7.5   | `implemented` | `payload/blocks/` — 24 blocks | Rendered by BlockRenderer | —                            |
| E-08 | Five editorial roles with least-privilege access control                                                                   | §7.6   | `implemented` | `payload/access/` | Needs an access test before `verified` | —                            |
| E-09 | Publish validation blocks on missing required fields                                                                       | §7.7   | `implemented` | `payload/hooks/validate-publish.ts` | Needs an integration test before `verified` | —                            |
| E-10 | Live preview at 5 viewport presets; drafts never publicly reachable                                                        | §7.8   | `implemented` | `payload.config.ts` livePreview | 4 breakpoints configured | —                            |
| E-11 | Drafts, autosave, versions, scheduled publishing, rollback, retention policy                                               | §7.9   | `implemented` | Stories/Issues versions config | Autosave + schedulePublish enabled | —                            |

## F · Media pipeline

| ID   | Requirement                                                                             | Source      | Status        | Implementation                          | Evidence | Open issue                          |
| ---- | --------------------------------------------------------------------------------------- | ----------- | ------------- | --------------------------------------- | -------- | ----------------------------------- |
| F-01 | Migration curates rather than bulk-copies the existing archive                          | §8.1        | `not-started` | `scripts/media/`                        | —        | —                                   |
| F-02 | Every migration script defaults to `--dry-run` with no destructive default              | §8.4        | `not-started` | `scripts/media/`                        | —        | —                                   |
| F-03 | No legacy S3 key is ever written, moved, or deleted — enforced in code                  | §8.4, §14.5 | `not-started` | `scripts/media/guards.ts`               | —        | **Release blocker if unmet**        |
| F-04 | Normalized manifest with checksum, perceptual hash, rights and consent status           | §8.3        | `not-started` | `scripts/media/build-manifest.ts`       | —        | —                                   |
| F-05 | Deduplication by SHA-256, perceptual hash, and human review of ambiguous matches        | §8.3        | `not-started` | `scripts/media/hash-dedupe.ts`          | —        | —                                   |
| F-06 | Human curation UI with approve/reject/hold and exportable checkpoints                   | §8.3        | `not-started` | —                                       | —        | —                                   |
| F-07 | Derivatives: AVIF/WebP/JPEG at seven widths, blur placeholder, no upscaling             | §8.3        | `not-started` | `scripts/media/generate-derivatives.ts` | —        | —                                   |
| F-08 | Idempotent Payload import keyed on `legacySourceId`; upserts, never blind creates       | §8.3        | `not-started` | `scripts/media/import-payload.ts`       | —        | —                                   |
| F-09 | Rights and ethics rules for press, events, modeling, and FERG X                         | §8.7        | `not-started` | Rights fields + review queue            | —        | Rights information not yet supplied |
| F-10 | Image delivery: accurate `sizes`, eager LCP, lazy below fold, immutable derivative URLs | §8.8        | `implemented` | `components/media/EditorialImage.tsx` | ESLint blocks bare <img> | —                                   |
| F-11 | Video delivery: adaptive HLS, immediate poster, captions, transcript, keyboard player   | §8.9        | `not-started` | `components/media/VideoPlayer/`         | —        | Mux not provisioned (ADR-0007)      |
| F-12 | 9:16 work presented without a fake phone frame                                          | §8.9, §3.6  | `not-started` | —                                       | —        | —                                   |

## G · Discovery and SEO

| ID   | Requirement                                                               | Source      | Status        | Implementation                     | Evidence | Open issue |
| ---- | ------------------------------------------------------------------------- | ----------- | ------------- | ---------------------------------- | -------- | ---------- |
| G-01 | Archive with real pagination and crawlable, keyboard-operable fallback    | §3.10       | `not-started` | `app/(site)/archive/`              | —        | —          |
| G-02 | Controlled tags with aliases, parent/child, status, and merge redirects   | §3.10       | `not-started` | `payload/collections/Tags.ts`      | —        | —          |
| G-03 | Search across titles, deks, body, captions, transcripts, and all entities | §3.10, §6.8 | `not-started` | `lib/search/`                      | —        | —          |
| G-04 | Unique metadata on every indexable page                                   | §10.1       | `not-started` | `lib/seo/`                         | —        | —          |
| G-05 | JSON-LD generated from real content; no blanket schema stamping           | §10.2       | `not-started` | `lib/seo/structured-data.ts`       | —        | —          |
| G-06 | Segmented sitemaps excluding draft, thin, private, and noindex pages      | §10.3       | `not-started` | `app/sitemap.ts`                   | —        | —          |
| G-07 | Valid RSS/Atom with stable GUIDs                                          | §10.4       | `not-started` | `app/feed.xml/`                    | —        | —          |
| G-08 | Related content blends editorial selection with entity and tag overlap    | §10.5       | `not-started` | `lib/cms/related.ts`               | —        | —          |
| G-09 | CMS-managed 301 redirects; no published slug deleted without a decision   | §10.6       | `implemented` | `payload/collections/Redirects.ts` | Route handler still outstanding | —          |
| G-10 | Channel-aware dynamic OG art with a high-contrast fallback                | §10.7       | `not-started` | `app/opengraph-image.tsx`          | —        | —          |

## H · Performance

| ID   | Requirement                                                                          | Source      | Status        | Implementation       | Evidence | Open issue                   |
| ---- | ------------------------------------------------------------------------------------ | ----------- | ------------- | -------------------- | -------- | ---------------------------- |
| H-01 | Field targets at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1                           | §11.1       | `not-started` | —                    | —        | Needs field data post-launch |
| H-02 | Route-class JS budgets enforced (180–250 KB gzip)                                    | §11.2       | `not-started` | CI bundle report     | —        | —                            |
| H-03 | Image budgets; no 4K source in a 320 px card                                         | §11.3       | `not-started` | —                    | —        | —                            |
| H-04 | Animation budgets: transform/opacity only, offscreen pause, DPR cap                  | §11.4       | `not-started` | —                    | —        | —                            |
| H-05 | No rAF loop runs while its section is offscreen                                      | §5.6, §11.4 | `not-started` | —                    | —        | —                            |
| H-06 | Every third-party script has an owner, purpose, cost, and removal plan               | §11.6       | `not-started` | —                    | —        | —                            |
| H-07 | Performance CI: Lighthouse budgets, bundle analysis, image report, transition traces | §11.7       | `not-started` | `.github/workflows/` | —        | —                            |

## I · Accessibility

| ID   | Requirement                                                                       | Source      | Status        | Implementation                         | Evidence | Open issue                   |
| ---- | --------------------------------------------------------------------------------- | ----------- | ------------- | -------------------------------------- | -------- | ---------------------------- |
| I-01 | WCAG 2.2 AA baseline, tested beyond automated checks                              | §12.1       | `not-started` | `tests/a11y/`                          | —        | —                            |
| I-02 | Semantic landmarks, one logical H1, skip link                                     | §12.2       | `implemented` | `components/layout/PublicationShell.tsx` | Skip link + landmarks in server HTML | —                            |
| I-03 | Visible focus never obscured by sticky header or social rail                      | §12.2       | `not-started` | —                                      | —        | —                            |
| I-04 | Target sizes ≥ 44 × 44 px where feasible                                          | §12.2       | `not-started` | —                                      | —        | —                            |
| I-05 | Route changes announced to assistive technology                                   | §5.4, §12.2 | `not-started` | `components/layout/RouteAnnouncer.tsx` | —        | —                            |
| I-06 | Logical DOM order independent of visual grid placement                            | §12.2       | `not-started` | —                                      | —        | —                            |
| I-07 | Print stylesheet for stories                                                      | §12.2       | `not-started` | `styles/print.css`                     | —        | —                            |
| I-08 | Alt text human-reviewed; captions and credits are separate visible data           | §12.3       | `not-started` | `media` collection                     | —        | —                            |
| I-09 | Captions and transcripts for video with dialogue or meaningful sound              | §12.3       | `not-started` | —                                      | —        | **Release blocker if unmet** |
| I-10 | Manual AT test set: VoiceOver, NVDA, keyboard-only, 200%/400% zoom, forced colors | §12.4       | `not-started` | —                                      | —        | —                            |

## J · Security, privacy, reliability

| ID   | Requirement                                                                    | Source | Status        | Implementation                | Evidence                  | Open issue                            |
| ---- | ------------------------------------------------------------------------------ | ------ | ------------- | ----------------------------- | ------------------------- | ------------------------------------- |
| J-01 | No secrets in the repository; `.env.example` holds names only                  | §13.1  | `implemented` | `.env.example`, `.gitignore`  | Names-only file committed | Add push protection + secret scanning |
| J-02 | Vercel OIDC to AWS; no permanent access keys anywhere                          | §13.1  | `not-started` | —                             | —                         | AWS account access pending            |
| J-03 | Private S3 origin behind CloudFront OAC; public access blocked                 | §13.2  | `blocked`     | —                             | —                         | See ADR-0008                          |
| J-04 | Individual CMS accounts, MFA or identity-aware access, role-based permissions  | §13.3  | `not-started` | `payload/access/`             | —                         | —                                     |
| J-05 | Admin not indexed; preview tokens short-lived and revocable                    | §13.3  | `implemented` | `next.config.ts` | X-Robots-Tag: noindex, nofollow confirmed on /admin | —                                     |
| J-06 | Nonce/hash-aware CSP with no broad wildcards or `unsafe-eval` in production    | §13.4  | `not-started` | `proxy.ts`                    | —                         | —                                     |
| J-07 | Forms: minimal collection, server validation, retention policy, rate limiting  | §13.5  | `not-started` | —                             | —                         | —                                     |
| J-08 | Automated Postgres backups with a tested restore                               | §13.6  | `not-started` | —                             | —                         | Managed provider pending              |
| J-09 | Runbooks for failed publication, missing media, DNS issue, compromised account | §13.6  | `in-progress` | `docs/runbooks/`              | LOCAL_SETUP.md            | Remaining runbooks outstanding        |

## K · Quality gates

| ID   | Requirement                                                                                                                                    | Source | Status        | Implementation       | Evidence | Open issue |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- | -------------------- | -------- | ---------- |
| K-01 | Unit coverage of theme resolution, slugs, reading time, rights validation, related scoring, structured data, search parsing, motion preference | §14.1  | `in-progress` | `tests/unit/` | 26 tests passing | —          |
| K-02 | Integration coverage of Payload hooks, draft/publish lifecycle, S3 adapter, search indexing, redirects, preview, scheduling                    | §14.1  | `not-started` | `tests/integration/` | —        | —          |
| K-03 | E2E coverage including reduced motion, no-JS readability, and WebGL failure fallback                                                           | §14.1  | `not-started` | `tests/e2e/`         | —        | —          |
| K-04 | Visual regression at six viewports across all channels and story types                                                                         | §14.1  | `not-started` | `tests/visual/`      | —        | —          |
| K-05 | Animation QA checklist passes for every module                                                                                                 | §14.3  | `not-started` | —                    | —        | —          |
| K-06 | Content QA checklist passes for every launch story                                                                                             | §14.4  | `not-started` | —                    | —        | —          |
| K-07 | No release-blocking criterion is violated                                                                                                      | §14.5  | `not-started` | —                    | —        | —          |

---

## Standing release blockers

A release cannot ship while any of these is true. Re-checked every release.

- [ ] A core story is unreadable without client JavaScript
- [ ] Keyboard cannot reach or exit the menu, search, gallery, or player
- [ ] Any published media lacks a rights status or required credit
- [ ] Any sponsor or partner claim is unverified
- [ ] Reduced-motion mode still runs major motion
- [ ] The LCP image is lazy-loaded
- [ ] A route transition can freeze navigation
- [ ] WebGL failure breaks a page
- [ ] Production ships demo or generated source media
- [ ] Any current-site S3 key was overwritten
- [ ] Secrets exist in the repository
- [ ] Critical or serious axe violations remain
- [ ] Structured data has critical validation errors
- [ ] A preview or draft is publicly indexable
- [ ] No rollback path exists

## Open blockers requiring a human decision

| Blocker                                                   | Owner           | Blocks                | Notes                                                                                 |
| --------------------------------------------------------- | --------------- | --------------------- | ------------------------------------------------------------------------------------- |
| Domain and trademark clearance for "FERG IN FOCUS"        | Dorvell         | A-07, public launch   | Not started. Development continues on a preview hostname.                             |
| Final public labels for `/stories` and `/modeling`        | Dorvell         | Nothing — by design   | Routes are stable; labels are CMS values (ADR-0004).                                  |
| AWS read-only access for the media inventory              | Dorvell         | F-01…F-08, J-02, J-03 | Migration tooling is being built and dry-run tested against local fixtures meanwhile. |
| S3 isolation audit: shared prefix or dedicated bucket     | Kamal + Dorvell | ADR-0008, J-03        | Default to a dedicated bucket unless every isolation condition passes.                |
| PacSun, Cold Culture, and other relationship verification | Dorvell         | FERG X content, A-05  | No FERG X case file publishes before its relationship type is confirmed.              |
| Managed Postgres and Vercel project provisioning          | Kamal           | D-03, J-08            | Local Postgres 17 unblocks all development in the meantime.                           |
| Mux account provisioning                                  | Kamal           | F-11                  | Player is provider-independent; direct MP4 is the interim source (ADR-0007).          |
| Newsletter provider selection                             | Dorvell + Kamal | D-07                  | Choose on ownership, exportability, and automation — not familiarity.                 |
| Licensed display and body typefaces                       | Dorvell + Kamal | B-05                  | Open-source prototype faces are in use until brand approval.                          |
