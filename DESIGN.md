# DESIGN.md: Sleep Well Creatives

## Source
- URL: https://sleep-well-creatives.com/
- Capture date: 2026-07-08
- Evidence: Firecrawl `branding` + `images` scrape, page markdown, raw HTML (script/canvas/data-attribute inspection). A full-page screenshot could not be captured — the experience sits behind a "Loading… → Enter Site" gate (audio permission unlock) that headless scraping could not get past; the site's public OG cover image is used below instead.
- Author/owner: Victor Costa ([vwlab.io](https://vwlab.io), [@victorwork_](https://x.com/victorwork_)). Explicitly a personal creative-research portfolio piece ("This website isn't a product. It's a personal experiment"), built for the **Webflow × Contra Challenge**, © all rights reserved 2025.

## Reference Screenshot
![OG cover image of Sleep Well Creatives](./.firecrawl/sleep-well-creatives-cover.png)

This is the site's public share/cover image, not a full-page capture. Use it only for color/mood context — the real experience is a full-screen 3D scroll story (see Page Patterns below).

## Design Summary
A single-page, scroll-driven "scrollytelling" experience aimed at designers/developers, using sleep science reframed through dev/design metaphors ("reboot", "overclock", "cache"). A fixed Three.js WebGL canvas sits behind scrolling text content; the 3D scene (tunnel, floor, floor-lamp, particle textures) morphs as the user scrolls through 7 numbered chapters. Audio narration ("insights") can be toggled per section. Tone: minimalist, low-energy, editorial, warm-but-clinical.

**Important:** this is one independent creator's copyrighted art project, not a template or product to clone wholesale. Treat everything below as *structural/motion inspiration* for building an original "Protocolo 7 noites" experience — do not reuse their exact copy, quotes, textures, logo, or image assets.

## Design Tokens

### Colors
| Role | Value | Notes |
|---|---|---|
| Primary | `#FEF1D0` | warm parchment/cream |
| Secondary | `#0042AF` | saturated royal blue (also `theme-color`) |
| Accent / Text | `#010D6E` | near-black navy, used for text + links |
| Background | `#FFFFFF` | |

Confidence: high for colors (0.9), extracted directly from computed styles.

### Typography
- Heading: `Editorial` (a display/editorial serif), fallback `Georgia, sans-serif`
- Body: `Arial`, fallback `Helvetica Neue, Helvetica, sans-serif`
- Paragraph/alt: custom `NM_Regular` webfont, fallback `Arial, sans-serif`
- Scale observed at default viewport: H1/H2 ≈ 51px, body ≈ 13px — these are almost certainly fluid/`clamp()` or `vw`-based in the real CSS and shrank at the scrape's render size; treat as **inferred**, not literal.
- Big hero title is stacked one word per line (`SLEEP` / `WELL` / `CREATIVE`), heavy tracking, editorial serif — display-style, not paragraph type.

### Spacing & Layout
- Base spacing unit: `12px`
- Border radius: `14px` (soft, rounded-corner cards/buttons)
- Full-bleed, full-viewport sections; content scrolls over a fixed background canvas rather than the canvas scrolling with content.

## Components
- **Preloader/gate**: "Loading" label + animated dots → "Enter Site" CTA. Functions as a user-gesture unlock for audio/WebGL autoplay policies.
- **Custom video player** (hero "THE NOTE" section): play/pause, mute, fullscreen, scrubbable timeline, buffered state — all via `data-player-*` attributes, video delivered through `hls.js`.
- **Audio "insight" narration**: a "Play insight" control plus short pull-quotes (`data-insight="…"`) tied to named audio clips per section (e.g. `mind_logoff`, `overheat`, `wont_rest`) — narrated one-liners surfaced as the user reaches each chapter.
- **Section progress indicator**: numeric counter (`00 / 06`) with a dot list — a fixed side/overlay nav that tracks scroll progress through chapters.
- **Numbered chapters**: 7 sections (01–07), each two-digit-numbered like spec documentation, pairing a short science-communication copy block with a background scene change.
- **Repeating word strip**: a marquee/word-cloud of activity labels (`SLEEP`, `WORK`, `EAT`, `EXERCISE`, `STUDY`, `REST`) representing a daily schedule — used in the "Be on the Clock" chapter.
- **Tip accordion**: closing section, 6 numbered expandable tips, each with an emoji glyph + short title + one-line body.
- **Generic reveal hooks**: `data-anima="parag"` / `data-anima="texts"` — text blocks are individually tagged for scroll-triggered fade/stagger-in animation.

## Page Patterns
Fixed full-screen `<canvas class="webgl" data-engine="three.js r180">` behind everything → DOM content scrolls on top, effectively a pinned-canvas + scroll-progress-driven 3D scene. Confirmed stack: **Three.js r180** for the 3D layer, **Lenis** for inertial smooth-scrolling, **Webflow** for page/CMS structure and simple animations, a separately-bundled Vite app (their custom Three.js/interaction logic), jQuery, and `hls.js` for video.

Section flow (for reference — do not reuse the copy verbatim):
1. Hero video/note + framing statement
2. `01` — "Sleep isn't a luxury" (reboot/maintenance metaphor, tunnel scene)
3. `02` — heart-rate/pulse and rhythm
4. `03` — "Be on the clock" (overclocking metaphor, activity word-strip)
5. `04` — balance/movement (floor + tunnel scene)
6. `05` — blue light / circadian disruption
7. `06` — sleep-cycle layers (gateway/stabilizer/slow-wave/REM)
8. `07` — six actionable tips (accordion) + closing CTA + credits/footer

## Content Style
Short, declarative, aphoristic sentences ("Sleep isn't rest. It's maintenance."). Dev/design metaphors mapped onto sleep biology throughout. Section headers read like spec/manual numbering. Sparse, deliberate emoji use only at emotional beats. Voice is personal/first-person in the intro and closing, more clinical/informational in the numbered body chapters.

## Agent Build Instructions
For **Protocolo 7 noites** (React + Vite + TypeScript + Tailwind, with `three`, `@react-three/fiber`, `@react-three/drei`, and `framer-motion` already installed):

1. **Pinned canvas pattern**: render a `<Canvas>` from `@react-three/fiber` in a `position: fixed` (or `sticky` spanning the whole scroll track) wrapper behind the page content, rather than scrolling the 3D scene with the page.
2. **Scroll → scene binding**: drive scene state (camera position, shader uniform, material color/opacity) from scroll progress using `framer-motion`'s `useScroll` + `useTransform` (or drei's `<ScrollControls>`/`useScroll` if going full-canvas-driven). Map each numbered chapter to a `[start, end]` scrollYProgress range.
3. **Per-section reveal**: replicate the `data-anima` pattern with a small reusable `<Reveal>` wrapper using `framer-motion`'s `whileInView`/`useInView` for text fade/stagger-in, rather than IntersectionObserver boilerplate.
4. **Progress nav**: build a fixed dot-list + `NN / 06` counter component keyed off the same scroll-progress value driving the 3D scene, for wayfinding through chapters.
5. **Audio narration (optional)**: if "Protocolo 7 noites" wants narrated insights, use the native `<audio>` element per chapter with a play/pause toggle — skip `hls.js` unless streaming long-form video, it's overkill for short narration clips.
6. **Original art direction — do not copy**: generate new textures/scenes and copy for this project's own brand instead of reusing `tunnel_texture`, `floor_texture`, `floor_lamp_texture`, the `SLEEP/WELL/CREATIVE` wordmark, or any of Victor Costa's quotes/copy. Use the *structural* idea (fixed WebGL scene + numbered scroll chapters + progress dots + per-section reveal) as the reusable pattern, and this project's own palette/typography for the actual look.
7. **Palette**: treat `#FEF1D0` / `#0042AF` / `#010D6E` as inspiration for a warm-cream + deep-blue night/rest palette, not a literal brand swap — adapt to Protocolo 7 noites' own identity.

## Quality Bar / Attribution Note
This site's logo, imagery, textures, copy, and exact code are © Victor Costa / vwlab.io and were built for a named design challenge — they are not licensed for reuse. Everything above is offered as **motion/structure inspiration only**. Treat colors/typography as directional references, and treat the component/page-pattern/build-instruction sections as the reusable takeaway.

## Rerun Inputs
workflow: firecrawl-website-design-clone
source_url: https://sleep-well-creatives.com/
target_stack: React + Vite + TypeScript + Tailwind + three/@react-three/fiber/@react-three/drei + framer-motion
output: DESIGN.md
