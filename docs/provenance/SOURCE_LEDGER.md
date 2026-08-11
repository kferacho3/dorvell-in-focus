# Source ledger

What each studied source actually contributed, where the adaptation lives, and
what was explicitly refused. Update this file in the same change that lands an
adaptation — never afterwards.

Adoption values: `reimplemented` (technique rebuilt from first principles) ·
`adapted` (code derived, attribution required) · `reference-only` (read, nothing
carried across) · `rejected`

---

## S-01 · EaseReverseClipMenu

- **Upstream:** <https://github.com/codrops/EaseReverseClipMenu>
- **License:** MIT
- **Adoption:** `reimplemented`
- **Lands in:** `components/navigation/ApertureMenu/` · Module A
- **Status:** not-started

**The transferable idea.** Not the polygon clip itself — the _reversibility_.
The source rebuilds and reverses its animation so the interface stays smooth
when a user changes their mind halfway through the reveal. Most menu
implementations look correct only if the interaction is never interrupted.

**Production requirements carried across.**

- One explicit state machine: `closed → opening → open → closing`
- Opening reverses instantly; closing reverses instantly; progress is preserved
- Focus moves into the open menu and returns to the trigger on close
- `aria-expanded`, `aria-hidden`, and inert/tab behavior match the visual state
- Escape always closes
- Clip origin derives from the trigger's position, never a hardcoded center
- Navigation exists as ordinary links in the DOM before hydration

**Refused.** Demo Midjourney assets, the full demo composition, and the
dependency on autoplaying background video.

---

## S-02 · Infinite Scroll Gallery + Flip

- **Upstream:** <https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition>
- **License:** **unresolved** — README links MIT, `package.json` declares ISC, no LICENSE file in the archive
- **Adoption:** `reimplemented` (forced by the license ambiguity)
- **Lands in:** `components/editorial/IssueRail/` (Module B) · `components/motion/SharedStoryFrame/` (Module C)
- **Status:** not-started

**The transferable ideas.** A measured seamless loop, and a thumbnail that
appears to travel into its destination hero.

**Licensing note.** No code is copied while the license is ambiguous. Both
ideas are independently implementable and are being implemented independently.
Revisit only if the upstream author clarifies.

**The shared-element flow, as specified.**

1. Decode the selected thumbnail
2. Capture its position and size
3. Begin navigation immediately — never wait for the animation
4. Render a stable destination hero
5. Transition via native View Transitions, or GSAP Flip where support requires
6. Preserve browser history and back-button behavior
7. On any failure, show the destination instantly — never leave a frozen overlay

**Refused.** Site-wide wheel hijacking, endless article feeds, and demo images.
Article scrolling stays native. Observer is used only inside a bounded rail
where the reader expects a controlled instrument.

---

## S-03 · MotionPath Transition

- **Upstream:** <https://github.com/Ibaliqbal/codrops-motion-path-transition>
- **License:** MIT
- **Adoption:** `reimplemented`
- **Lands in:** `components/media/ContactSheetReflow/` · Module D
- **Status:** not-started

**The transferable idea.** Responsive thumbnail paths computed from real
element bounds, with the timeline rebuilt on resize while preserving current
progress.

**Where it belongs.** FERG Photography's Grid ↔ Sequence toggle, where the same
photographs are genuinely being reorganized into a new view. State is
represented in the URL (`?view=sequence`).

**Refused.** Using motion paths for ordinary route changes, decorative particle
motion, and demo assets. Reduced-motion and keyboard users get an instant
layout swap, not a slower version of the animation.

---

## S-04 · The Substance

- **Upstream:** <https://github.com/drcmda/the-substance>
- **License:** MIT
- **Adoption:** `reference-only`
- **Lands in:** `components/motion/FocusField/` (Module H), if the optional layer ships
- **Status:** not-started

**The transferable ideas.** DOM and R3F layering, scroll-factor parallax,
shader displacement driven by scroll velocity, instancing, refraction, and
multipass rendering.

**Explicitly not adopted.** Its dependency stack — React experimental,
react-scripts 3.2, an early `react-three-fiber` beta, three.js 0.111 — and its
component structure. Concepts are rebuilt on the current compatible stack.

**Refused.** Text inside WebGL as the primary content layer. Reader-facing text
is always real DOM text.

---

## S-05 · Geometry Painter (Three.js / WebGPU)

- **Adoption:** `reference-only`
- **Lands in:** `components/motion/FocusField/` · Module H
- **Status:** not-started

**The transferable idea.** The _mode interface_. One input/stroke system drives
several visual outputs without rewriting the interaction plumbing. That
internal contract is worth copying even though none of its visuals are:

```
input samples → normalized/resampled stroke → anchor coordinates
  → selected visual mode → GPU or DOM renderer
  → lifecycle: start / update / commit / replay / destroy
  → accessibility and static fallback outside the renderer
```

**Concept if it ships.** A field of light, grain, registration marks, or soft
optical traces where each stroke brings a layer _into focus_. An issue-cover
experiment or About-page signature — never core navigation.

**Gate.** Launches only after core editorial routes pass their performance and
accessibility budgets. Refused: shipping a GPU-heavy painter as a requirement
for reading, and the source's crystal/reef brand identity.

---

## S-06 · Liquid Morphology Slideshow

- **Adoption:** `reimplemented`
- **Lands in:** `components/motion/FilmRefraction/` · Module G
- **Status:** not-started

**The transferable ideas.** Fullscreen shader slideshow with texture cover-UV
math, multiple transition uniforms, a responsive DPR cap, swipe/keyboard
controls, and pausing on hidden tab.

**Where it belongs.** One restrained 4KFERG poster-to-film transition, where a
texture-to-texture blend has semantic meaning — this poster becomes that frame.

**Refused.** The forced three-second preloader, shader transitions on every
route, and CodePen imagery. Poster, title, duration, controls, and transcript
render without the shader. The film never waits on a decorative effect.

---

## S-07 · MorphSVG Curve Manipulation

- **Adoption:** `reimplemented`
- **Lands in:** `components/motion/FocusCurtain/` · Module F
- **Status:** not-started

**The transferable idea.** An SVG curve expanding from a lower edge into a
full-frame shape — read here as light punctuation between channels.

**Constraints.** 400–650 ms maximum. The SVG is decorative and hidden from
assistive technology. Destination content is already loading underneath; the
curtain is never a fake loading screen. Skipped entirely under reduced motion.

---

## S-08 · dorvellferguson.com (current site)

- **Adoption:** `reference-only` — factual and media source, never a visual template
- **Status:** in-progress

**What it provides.** A photography archive across portraits, music and live,
sports, fashion, events, photojournalism, modeling, and runway; a modeling
selection with motion studies; a Creative Worlds index of films with written
descriptions, runtimes, formats, tags, and director's notes; a biography
grounded in multimedia journalism; experience and recognition references; and
public social handles.

**One technical pattern carried forward.** Modern image formats (AVIF/WebP)
plus versioned immutable derivative caching — as a _principle_. Its routes and
public-bucket assumptions are not reproduced.

**Deliberately kept separate.** The "DF Archive" identity: the dark cinematic
archive atmosphere, "enter the archive" framing, portfolio modes, immersive
rooms and rotations. FERG IN FOCUS is a contemporary editorial desk in
daylight, not another room in the same archive.

**Counting warning.** Existing portfolio category counts overlap — one
photograph can be fashion, events, modeling, and portraiture simultaneously.
Category counts must never be summed to claim a total. The migration manifest
treats channel, subject, format, people, place, and tags as many-to-many.

---

## Research limitations

Recorded so no downstream reader mistakes a gap for a finding.

- The live Eat Sleep Wear homepage returned rate-limit errors during research.
  Only indexed category and archive material was reliably available; the audit
  reflects that, and does not claim a complete current visual inspection.
- The direct Readymag examples URL intermittently blocked automated fetching.
  Official indexed Readymag editorial, examples, design, and project pages were
  used instead.
- No private Dorvell GitHub repository was returned by the connected search. The
  current site was audited through its public pages and a locally supplied
  `next.config.mjs`, not a complete private source tree.
- Domain, social-handle, and trademark clearance for "FERG IN FOCUS" is **not
  complete**.
- PacSun, Cold Culture, and every other partnership status and media right are
  **unverified**. The CMS distinguishes `sponsor`, `client`, `collaborator`,
  `gifted`, `affiliate`, `featured`, and `editorial mention` precisely so that
  nothing has to be guessed.
