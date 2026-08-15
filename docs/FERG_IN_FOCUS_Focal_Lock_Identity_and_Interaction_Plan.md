# FERG IN FOCUS

## Focus-Frame Identity & Global Interaction System

**Status:** implementation-ready feature plan
**Product:** fully custom website built from scratch
**CMS constraint:** none; this is not Blogger, Blogspot, WordPress, or a theme conversion
**Primary goal:** turn the camera viewfinder into both the brand symbol and a restrained interaction language that follows the reader throughout the site

---

## 1. Final identity decision

The core symbol is a **camera focus frame surrounding a geometric “F.”** The small recording/focus point introduces life and motion without making the mark feel like a literal camera-app icon.

The mark must remain recognizable at favicon scale, so it uses:

- four bold corner brackets;
- one geometric F made from three strokes;
- one small accent point;
- no wordmark inside the icon;
- no gradients, tiny labels, exposure numbers, batteries, “REC” text, or ornamental camera controls;
- a transparent background for the primary logo asset.

### Meaning

- **Corner brackets:** observation, framing, composition, perspective.
- **The F:** FERG as the central subject and editor.
- **Accent point:** attention, recording, a live story, and the instant something comes into focus.
- **Open center:** the identity adapts to photography, film, writing, modeling, and collaborations instead of being trapped inside one discipline.

### Required logo assets

Use the supplied files as the source set:

```text
/public/brand/ferg-in-focus-mark-black.svg
/public/brand/ferg-in-focus-mark-white.svg
/public/brand/ferg-in-focus-mark-mono.svg
/public/favicon.svg
/public/favicon.ico
/public/apple-touch-icon.png
/public/site.webmanifest
```

The monochrome SVG should be the canonical reusable mark. The black, white, and red-point version is the public-facing brand treatment.

---

## 2. The central interaction idea: “Focal Lock”

The website should contain **one shared animated focus frame**, not a separate animated border inside every component.

That frame moves to the last meaningful item the visitor hovered, tabbed to, selected, or opened. It should feel like a camera acquiring focus:

1. The visitor enters a target.
2. The frame glides to the target’s measured bounds.
3. The corners settle with a tiny precision snap.
4. The accent point or micro-label updates.
5. When the pointer leaves, the frame remains softly locked to the last target instead of blinking away.
6. The next target inherits the frame through one continuous motion.

This persistence is what makes the effect feel sophisticated. A border that appears and disappears on every hover would feel like a conventional card treatment; a single roaming frame creates a system.

### Naming

Use the following implementation names consistently:

- Product behavior: **Focal Lock**
- React provider: `FocalLockProvider`
- Visual overlay: `FocusFrame`
- target hook: `useFocusTarget`
- target attribute: `data-focus-target`
- registry: `focusTargetRegistry`

---

## 3. Visual behavior

### Default frame

- Four isolated corner brackets, never a complete rectangle.
- Default stroke: `1px` on desktop, `1.25px` on high-density displays where needed.
- Corner length: `18–24px`, responsive to target size.
- Inset from target edge: `8px` by default.
- No heavy drop shadow.
- Optional restrained glow only on dark media: maximum `8px` blur at low opacity.
- Frame should inherit a channel accent through CSS variables, but the default is neutral black/ivory.
- The accent point may appear only on hero cards, current navigation, and active media—not on every text link.

### Motion values

```css
--focus-move-duration: 260ms;
--focus-settle-duration: 120ms;
--focus-fade-duration: 160ms;
--focus-ease: cubic-bezier(0.22, 1, 0.36, 1);
--focus-snap-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Recommended GSAP equivalents:

```ts
move: 'power3.out'
settle: 'back.out(1.25)'
fade: 'power2.out'
```

The settle phase should move only `1–2px`. Do not bounce the full frame.

### Persistent states

| State          | Behavior                                                                       |
| -------------- | ------------------------------------------------------------------------------ |
| Idle           | Locked to the page’s default hero or active navigation item at reduced opacity |
| Hover          | Moves to the hovered target                                                    |
| Keyboard focus | Moves to `:focus-visible` target and remains fully visible                     |
| Pressed        | Corners contract inward by `2–3px`                                             |
| Selected       | Accent point becomes visible; label may update                                 |
| Route pending  | Frame locks to the clicked target                                              |
| Route entered  | Frame expands or resolves onto the destination hero                            |
| Media playing  | Accent point can pulse once, then remain steady                                |
| Reduced motion | Frame changes instantly with a short opacity crossfade                         |
| Target removed | Return to route default or header logo                                         |

---

## 4. Global technical architecture

### 4.1 One portal-level frame

Render one `FocusFrame` near the application root:

```tsx
<body>
  <FocalLockProvider>
    <SiteShell />
    <FocusFrame />
  </FocalLockProvider>
</body>
```

The overlay must use:

```css
position: fixed;
inset: 0 auto auto 0;
pointer-events: none;
z-index: var(--z-focus-frame);
contain: layout style paint;
will-change: transform, width, height, opacity;
```

Do **not** render one GSAP instance per card.

### 4.2 Target contract

Any meaningful interactive component can opt in:

```tsx
<article
  data-focus-target
  data-focus-id="story-unbraided"
  data-focus-label="VIEW STORY"
  data-focus-theme="4kferg"
  data-focus-inset="10"
  data-focus-radius="18"
>
  ...
</article>
```

Supported data:

| Attribute             | Purpose                        |
| --------------------- | ------------------------------ |
| `data-focus-target`   | Enables Focal Lock             |
| `data-focus-id`       | Stable registry key            |
| `data-focus-label`    | Optional micro-label           |
| `data-focus-theme`    | Channel color/token            |
| `data-focus-inset`    | Per-component frame spacing    |
| `data-focus-radius`   | Synchronizes with target shape |
| `data-focus-priority` | Resolves nested targets        |
| `data-focus-default`  | Default target for a route     |
| `data-focus-disabled` | Temporarily bypasses animation |

### 4.3 Input handling

Use delegated listeners at the provider level:

- `pointerover`
- `pointerdown`
- `focusin`
- `keydown`
- route transition events
- scroll/resize signals

Use `event.target.closest("[data-focus-target]")` rather than attaching multiple listeners to every tile.

Keyboard focus must take precedence over pointer hover while the user is navigating by keyboard. Detect mode from the most recent input:

```text
pointer movement -> pointer mode
Tab / Shift+Tab / arrow navigation -> keyboard mode
```

Never remove native outlines globally. The frame is an enhancement, not a replacement for all focus accessibility.

### 4.4 Measuring targets

Measure with `getBoundingClientRect()` only when:

- the active target changes;
- the viewport resizes;
- the active target resizes;
- a smooth-scroll frame changes the active target’s screen position;
- a route transition resolves.

Use a single `ResizeObserver` for the active target and one `requestAnimationFrame` loop only while scrolling or animating. Avoid continuous document-wide measurement.

### 4.5 Animation implementation

Use `gsap.quickTo()` or one reused GSAP timeline for:

- `x`
- `y`
- `width`
- `height`
- `opacity`
- corner length
- accent opacity
- frame color

Do not use React state for every animation frame. React should store identity and mode; GSAP should handle the pixels.

Recommended flow:

```ts
activateTarget(element)
  -> measure element
  -> resolve inset/radius/theme
  -> animate overlay bounds
  -> update semantic state
  -> perform 1–2 px settle
```

---

## 5. Logo behavior

The static favicon must remain still. On the website, the same mark can become the origin of Focal Lock.

### Header logo interaction

- At rest, the four brackets sit around the F.
- On logo hover/focus, the corners expand outward by `3–4px`.
- The accent point fades in.
- On press, the corners close inward.
- Do not rotate the full symbol or run an infinite animation.

### Page-entry sequence

Use the mark for a short first-entry signature only:

1. Four brackets appear around the center F.
2. They expand to reveal the first hero image or headline.
3. The global frame then settles onto the hero’s default focus target.
4. Total duration: `650–900ms`.
5. Run once per session, not on every route.

### Route transition

The best signature transition:

1. Visitor clicks a story/card.
2. Focal Lock holds the card.
3. Corners contract by `2px`.
4. Shared media transition begins.
5. New route renders.
6. Frame resolves around the destination title, lead image, or media player.

The logo can briefly receive the frame only when the destination has not yet mounted. Avoid forcing the frame to fly to the header on every click.

---

## 6. Where to use Focal Lock

### High-value targets

Use it on:

- main navigation items;
- channel navigation;
- homepage story cards;
- photography project covers;
- 4KFERG film posters and players;
- article covers;
- modeling editorials;
- FERG X collaboration tiles;
- image galleries;
- primary and secondary CTAs;
- featured tags;
- search results;
- newsletter fields and submit button;
- pagination/next-story controls;
- footer navigation;
- media controls when custom controls are used.

### Targets to exclude

Do not wrap:

- every sentence-level link;
- long body-copy paragraphs;
- dense lists of tags all at once;
- decorative lines;
- noninteractive images;
- native browser controls;
- small icon buttons that already have a complete visible state;
- elements smaller than approximately `32px` unless they are primary controls.

The effect should feel curated, not sprayed across the DOM.

---

## 7. Channel adaptations

Keep the motion system consistent while changing only a few tokens per section.

```css
[data-channel='home'] {
  --focus-ink: #111111;
  --focus-accent: #ff2a2a;
}

[data-channel='photography'] {
  --focus-ink: #111111;
  --focus-accent: #178b7b;
}

[data-channel='4kferg'] {
  --focus-ink: #f6f3ec;
  --focus-accent: #ff2a2a;
}

[data-channel='stories'] {
  --focus-ink: #171717;
  --focus-accent: #bd8733;
}

[data-channel='modeling'] {
  --focus-ink: #f5f2eb;
  --focus-accent: #8f6cff;
}

[data-channel='ferg-x'] {
  --focus-ink: #111111;
  --focus-accent: #d46a43;
}
```

These are starter tokens, not permanent brand mandates. The structure matters more than the exact colors.

### Distinct micro-behavior by channel

- **FERG Photography:** crisp movement; no glow; frame reveals caption/exposure metadata.
- **4KFERG:** frame may include a single red recording point and timecode reveal.
- **Stories/Journal:** frame can shift from cover image to headline as the card is traversed.
- **Modeling:** slightly taller corner proportions; editorial crop behavior.
- **FERG X:** partner mark and collaboration year can appear as a micro-label.

Do not create five unrelated animation systems.

---

## 8. Mobile and touch behavior

There is no hover on touch devices. Use:

- active navigation state;
- keyboard focus on attached keyboards;
- tap/press state;
- currently selected carousel or story;
- optional viewport-based focus only for large feature cards.

On tap:

1. Frame snaps to the target.
2. Press state runs for `80–100ms`.
3. Navigation continues.

Do not delay route navigation to show an animation. The animation must fit inside the existing interaction.

Disable persistent frame-following during rapid touch scrolling. Restore it after scroll settles or when a target is tapped.

---

## 9. Accessibility requirements

- Every target must remain operable without the frame.
- Use `:focus-visible`; do not suppress focus outlines without a verified replacement.
- Frame color must meet non-text contrast expectations against its immediate background.
- No flashing red recording point.
- Respect `prefers-reduced-motion`.
- Keep target order aligned with DOM/tab order.
- Do not move focus automatically because the frame moved.
- Screen-reader announcements should describe the selected destination, not the animation.
- Focal Lock must use `aria-hidden="true"` because it is decorative.
- Current navigation must still use `aria-current="page"`.

Reduced-motion behavior:

```css
@media (prefers-reduced-motion: reduce) {
  .focus-frame {
    transition: opacity 120ms linear;
    transform: none;
  }
}
```

In implementation, update its bounds instantly and fade between states.

---

## 10. Performance rules

- Exactly one global animated frame.
- Zero layout-affecting borders added to target components.
- No WebGL required for this interaction.
- No large backdrop blur.
- No perpetual animation loop.
- No document-wide `ResizeObserver`.
- No `getBoundingClientRect()` call on every pointermove.
- Reuse timelines and `quickTo` functions.
- Pause measurement when the document is hidden.
- Use passive scroll listeners.
- Validate on mid-range mobile hardware, not only a desktop Mac.

Performance target: the focus frame should remain at or near 60 FPS while moving between cards and during normal scrolling.

---

## 11. Component/file plan

```text
src/
  components/
    brand/
      FergInFocusMark.tsx
      AnimatedFergMark.tsx
    focal-lock/
      FocalLockProvider.tsx
      FocusFrame.tsx
      FocusCorners.tsx
      FocusLabel.tsx
      FocusPoint.tsx
      FocusTarget.tsx
      focal-lock.types.ts
      focal-lock.tokens.ts
  hooks/
    useFocusTarget.ts
    useInputModality.ts
    useReducedMotion.ts
  lib/
    focal-lock/
      registry.ts
      measure.ts
      animate.ts
      route-bridge.ts
      resolve-target.ts
  styles/
    focal-lock.css
    brand.css
  app/
    favicon.ico
    icon.svg
    apple-icon.png
```

### API shape

```ts
type FocusTargetOptions = {
  id: string
  label?: string
  theme?: FocusTheme
  inset?: number
  radius?: number
  priority?: number
  routeDefault?: boolean
}

const { ref, focusProps } = useFocusTarget(options)
```

Also support a zero-wrapper data-attribute implementation for server components.

---

## 12. Build sequence

### PR 1 — Identity assets

- Add SVG, PNG, ICO, and manifest files.
- Create `FergInFocusMark`.
- Add light/dark validation.
- Test favicon at 16, 24, 32, 48, 192, and 512 pixels.

### PR 2 — Static frame component

- Build four corner elements.
- Add theme tokens.
- Add frame inset and radius controls.
- Verify no pointer interception.

### PR 3 — Target registry and input modes

- Add delegated pointer/focus events.
- Track keyboard versus pointer mode.
- Resolve nested targets.
- Establish route defaults.

### PR 4 — GSAP motion layer

- Add `quickTo` motion.
- Add pressed and settle states.
- Add reduced-motion path.
- Add scroll/resize measuring.

### PR 5 — Navigation and homepage

- Connect logo, nav, hero, story cards, and channel cards.
- Preserve last target.
- Add route handoff.

### PR 6 — All channels

- Apply to Photography, 4KFERG, Stories, Modeling, and FERG X.
- Add channel tokens and restrained micro-labels.
- Remove duplicate local hover borders.

### PR 7 — QA and optimization

- Keyboard audit.
- Screen-reader audit.
- Touch-device audit.
- reduced-motion audit.
- throttled CPU/GPU performance run.
- route-transition stress test.
- visual regression snapshots.

---

## 13. Acceptance criteria

The feature is ready only when:

- the mark is legible as a 16px favicon;
- the logo remains recognizable without the red point;
- one global frame moves between all target types;
- the frame follows mouse, keyboard, and selected states;
- it remains on the last target instead of blinking away;
- it does not intercept pointer input;
- navigation is never delayed for animation;
- route changes resolve to the destination default target;
- scrolling does not produce visible frame lag;
- nested target selection is deterministic;
- reduced-motion users receive an immediate, calm state change;
- target components do not jump when activated;
- every page remains fully usable with JavaScript animation disabled;
- animation is subtle enough that content remains dominant.

---

## 14. Guardrails for Claude / Opus / Fable

1. Do not create a full camera HUD around every card.
2. Do not copy the reference overlays literally.
3. Do not add “REC,” battery icons, exposure scales, or timecodes globally.
4. Do not animate every corner independently without a shared system.
5. Do not use a cursor replacement.
6. Do not sacrifice keyboard focus for visual polish.
7. Do not add a WebGL dependency for a four-corner overlay.
8. Do not make the logo unreadable by hiding the F inside excessive geometry.
9. Do not turn the red point into a constant flashing indicator.
10. Do not let the interaction become slower than the content.

---

## 15. Handoff prompt

> Implement the FERG IN FOCUS **Focal Lock** identity and interaction system exactly as defined in this plan. This is a custom Next.js product, not a Blogger, Blogspot, WordPress, or theme-based build. Begin by installing the supplied vector/favicon assets and building one global, portal-level focus frame. Use delegated pointer/focus handling, a deterministic target registry, `ResizeObserver` only for the active target, and GSAP `quickTo` or a reused timeline for motion. The frame must persist on the last meaningful target, follow keyboard focus, support channel tokens, bridge route transitions, respect reduced motion, and never block navigation or pointer input. Apply it first to the logo, primary navigation, homepage hero, and story cards; then expand it to Photography, 4KFERG, Stories, Modeling, and FERG X. Keep the motion fast, restrained, and precise. The content must remain more important than the effect.
