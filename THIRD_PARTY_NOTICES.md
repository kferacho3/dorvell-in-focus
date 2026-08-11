# Third-party notices

FERG IN FOCUS studies public reference implementations for **technique**. It
does not ship their media, layouts, brand identity, or generated imagery.

This file records every source whose ideas or code informed production work.
Detailed per-technique mapping — what was taken, what was rejected, and where
the adaptation lives — is in
[`docs/provenance/SOURCE_LEDGER.md`](docs/provenance/SOURCE_LEDGER.md).

## Standing rules

1. Record repository URL, commit SHA, license, files adapted, and modifications
   before any source code is reused directly.
2. Demo media never enters production. This includes every Midjourney-generated
   or stock image bundled with a studied package.
3. Reference designs are not presented as original concepts.
4. MIT and equivalent attribution notices are preserved where required.
5. GSAP plugin licensing is verified against current terms at install time, not
   assumed from older premium-plugin rules.
6. When a package's stated license is ambiguous, the technique is reimplemented
   from first principles rather than copied, until the ambiguity is resolved.

## Studied reference implementations

| Source | License as published | Status | Notes |
| --- | --- | --- | --- |
| [codrops/EaseReverseClipMenu](https://github.com/codrops/EaseReverseClipMenu) | MIT | Technique reimplemented | Interruptible reversible clip reveal, focus/ARIA/Escape behavior. Demo media and composition excluded. |
| [surya-aditya/codrops-infinite-scroll-and-content-transition](https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition) | **Unresolved** | Reimplemented from first principles | README links MIT; the extracted `package.json` declares ISC; the archive shipped no LICENSE file. Until the mismatch is resolved by the author, no code is copied. Only the general ideas — measured seamless looping and shared-element transition — are used, both independently implemented. |
| [Ibaliqbal/codrops-motion-path-transition](https://github.com/Ibaliqbal/codrops-motion-path-transition) | MIT | Technique reimplemented | Responsive measured layout-to-layout paths with progress-preserving rebuild on resize. Demo assets excluded. |
| [drcmda/the-substance](https://github.com/drcmda/the-substance) | MIT | Architectural reference only | DOM + scene layering and scroll-velocity-driven displacement. Its dependency stack (React experimental, react-scripts 3.2, an early react-three-fiber beta, three 0.111) is deliberately not adopted; concepts are rebuilt on the current stack. |
| Geometry Painter (Three.js/WebGPU) | Per upstream | Architectural reference only | The transferable idea is the *mode interface*: one stroke/input system driving several visual outputs. Its crystal/reef visual identity is not used. |
| Liquid Morphology slideshow (GSAP + Three.js) | Per upstream | Technique reimplemented | Texture-to-texture shader transition, DPR cap, hidden-tab pause. The forced preloader and CodePen imagery are excluded. |
| GSAP MorphSVG curve manipulation | GSAP (see below) | Technique reimplemented | Short channel-color curtain. Never a loading screen, never blocking. |

## Runtime dependencies

Licenses for installed packages are resolved from the lockfile. Regenerate the
current inventory with:

```bash
pnpm licenses list --prod
```

Notable direct dependencies:

| Package | License |
| --- | --- |
| `next` | MIT |
| `react`, `react-dom` | MIT |
| `payload` and `@payloadcms/*` | MIT |
| `tailwindcss` | MIT |
| `sharp` | Apache-2.0 |
| `graphql` | MIT |
| `zod` | MIT |
| `gsap` | See below |

### GSAP

GSAP's core and its plugin suite are used through governed modules only. GSAP's
licensing terms changed materially in 2025 when Webflow made the full plugin
set free, including plugins that were previously Club-only. Because those terms
are the vendor's to change, this project treats them as **verify-at-install**
rather than settled:

- confirm the current license text shipped in `node_modules/gsap/LICENSE.md`
  whenever the dependency is added or upgraded;
- record the verified version and terms in the source ledger;
- do not carry assumptions from older documentation into this file.

Plugins in scope: Flip, ScrollTrigger, Observer, MotionPath, MorphSVG,
SplitText. Any plugin outside that list requires a decision record.

## Fonts

The prototype type system uses open-source families pending a licensed
selection after brand approval:

| Face | Role | License |
| --- | --- | --- |
| Instrument Serif | Display editorial serif | SIL Open Font License 1.1 |
| Geist | Body, UI, navigation | SIL Open Font License 1.1 |
| IBM Plex Mono | Metadata, runtimes, issue numbers | SIL Open Font License 1.1 |

Commercial webfont rights are confirmed before production for any licensed
replacement. Fonts are self-hosted as subset WOFF2.

## Content and media

All photographs, films, and written material are the property of Dorvell
Ferguson Jr. or their respective rights holders, and are published only with a
recorded rights status. See the `media` collection's rights fields and the
publish validation in `payload/hooks/`.

No media in this repository originates from a studied reference package.
