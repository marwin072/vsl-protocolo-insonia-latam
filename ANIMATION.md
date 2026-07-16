# ANIMATION.md — Surgical motion breakdown (sleep-well-creatives.com → Protocolo Mente Desligada)

Companion to `DESIGN.md`. That file covers palette/typography/structure; this one is the technical animation spec, built by decompiling the reference site's actual shipped code (not just guessing from the rendered page). Goal: map their *technique* onto **this project's real, already-existing sections** — not clone their content, copy, or 3D assets.

## 1. What the reference site is actually built with (verified from source)

Confirmed by downloading and grepping the site's real bundles (`.firecrawl/site-bundle.js`, `.firecrawl/site-styles.css`) — not just reading the rendered HTML:

| Layer | Tech | Evidence |
|---|---|---|
| Scroll engine | **GSAP + ScrollTrigger + ScrollSmoother** | `ScrollTrigger.create`, `scrub:true` (7×), `pin`, `ScrollSmoother` string present |
| Text reveal | **GSAP SplitText** | `SplitText` class present, "called before fonts loaded" warning string |
| Smooth scroll | **Lenis 1.3.14** | `lenis.css` link, `window.lenisVersion` |
| 3D | **raw Three.js** (not React Three Fiber) + `GLTFLoader` + Draco compression | `data-engine="three.js r180"` on canvas, `.glb` model URLs, `Draco` string |
| Video | Bunny.net player (`data-bunny-player-init`) + `hls.js` | CSS component classes, script tag |
| Easings used | `power1–4` (in/out/inOut), `expo`/`expo.inOut`/`expo.out`, `sine.out`, `elastic.out`, `linear`/`none` | literal `ease:"…"` strings in bundle |
| Named scene timelines | `tl_reveal_scene`, `tl_typo`, `tl_tunnel`, `tl_lines`, `tl_pills`, `tl_pendulum`, `tl_move_cans`, `tl_animate_phone_scene`, `tl_openbook`, `tl_ender`, `tl_add_ui`/`tl_remove_ui`, `tl_scroll_group` | literal identifiers in bundle |
| Custom 3D props (their assets, not ours) | `IntroScene2.glb`, `SceneWoman.glb`, `Pills.glb`/`Pills2`/`Pills3`, `Rope.glb`, `CanCoffee2.glb`, `SceneLamp.glb`, `AssetsPhoneScene.glb`/`HandsPhone.glb`, `BookRiggedwithTexture.glb`, `Butterfly.glb` | literal `.glb` URLs in bundle |

**Core pattern**: one master pinned `<canvas>` behind the DOM. Each "chapter" is a `ScrollTrigger` with `scrub:true` and its own enter/leave trigger elements; a nested GSAP timeline's `.progress()` is driven manually from the trigger's `onUpdate`, and `group.visible` toggles show/hide the relevant 3D prop as it scrolls in/out. Text uses `SplitText` for char/word stagger; simple crossfades use plain `duration:.1` opacity tweens at the pin boundaries.

**Licensing note**: GSAP (including ScrollTrigger, ScrollSmoother, SplitText — formerly paid "Club GreenSock" plugins) became 100% free for everyone after Webflow acquired GreenSock in 2025. Worth a quick check of gsap.com's current license page before shipping, since terms can change, but as of my knowledge this is no longer a paid gate.

**GLTFLoader/Draco 3D assets are not being copied.** Those `.glb` files are Victor Costa's bespoke, rigged art (pills, book, cans, lamp, woman figure, butterfly) — copyrighted, project-specific, and would need original modeling work to reproduce even if we wanted to. We don't.

## 2. Stack decision for this project

This project currently has `framer-motion` + `@react-three/fiber` + `@react-three/drei` + `three`, and no `gsap`. Framer Motion's `useScroll`/`whileInView` can't cleanly do multi-stage pin + scrub + timeline choreography the way ScrollTrigger does — that pinning/scrubbing *is* the technique being asked for here.

**Recommendation:** add `gsap` (includes ScrollTrigger for free now) as a dependency and use it as the scroll-choreography layer — driving both DOM reveals (replacing/augmenting some `framer-motion` `whileInView` blocks) and R3F scene state (feed `ScrollTrigger` progress into `useFrame`/uniforms via refs, instead of rewriting the R3F Canvas in vanilla Three.js). Keep `framer-motion` for simple non-scroll micro-interactions (button hover/tap, accordion open/close) where it already works fine (`Accordion.tsx`, `Button.tsx`). This gets the surgical scrub/pin precision without discarding the existing React/R3F architecture.

Flagging this instead of silently installing it — say the word and I'll add it; otherwise I'll proceed with it when we get to the first section that needs pin/scrub.

## 3. Two things already in the codebase worth fixing as we touch each section

1. **`Hero.tsx` currently ships the reference site's literal copy** — "Sleep Well Creative", "THE NOTE", "THE GUIDE FOR A BETTER RESTING", "Scroll to Explore" — in English, while every other section (`Agitation`, `Solution`, `SocialProof`, `Offer`, `FAQ`) is in Portuguese and branded "Protocolo Mente Desligada". This looks like an earlier scaffolding pass (Antigravity, from the file timestamps) that used the reference as a literal template rather than inspiration. Needs rewriting to original PT-BR copy under the real brand — this is also the copyright concern from `DESIGN.md` made concrete.
2. **`text-primary`, `text-accent`, `bg-surface-hover`, `.glass`, `.glass-card`, `.glass-card-hover`** are referenced across `Agitation`, `Solution`, `SocialProof`, `Offer` but never defined in `index.css`'s `@theme` block (only `brand-blue`, `brand-cream`, `brand-light-blue`, `brand-gray`, `background`, `surface`, `border` exist). Right now those classes are silently no-ops. Needs a `--color-primary` / `--color-accent` / glass-surface utility added before any motion work on those sections will look right.

## 4. Section-by-section mapping (reference technique → this project's actual sections)

| This project's section | Reference chapter(s) it maps to | Technique to borrow | Notes |
|---|---|---|---|
| **Hero** | Hero (title reveal + `tl_reveal_scene`/`tl_typo`) + dune/figure scene | `SplitText`-style staggered word reveal for the H1; existing `HeroBackground3D.tsx` shader blob becomes scroll-reactive (rotation/noise amplitude tied to `ScrollTrigger` progress) instead of pure time-based; parallax on the hill/figure layer as user starts scrolling (first `scrub` trigger) | Rewrite copy first (see §3.1) before animating it |
| **Agitation** (4 pain-point cards) | 01 "Sleep isn't a luxury" + 03 "Be on the Clock" (word-strip) | Per-card stagger reveal already exists via `framer-motion`; upgrade the intro heading to a scroll-scrubbed pin (heading pins briefly while cards stagger in beneath it), and consider a faint background word-strip (SLEEP/INSÔNIA/ANSIEDADE/…) drifting behind the grid at low opacity, echoing the reference's activity marquee | Low risk, this section already animates reasonably |
| **Solution** ("O Protocolo Mente Desligada", 3 phases) | 04 "Encounter the Balance" + 06 "Sleep cycle layers" | The numbered phase list (`Fase 1/2/3`) is a strong match for the reference's numbered-chapter + radial-diagram pattern — replace the flat list with a scroll-scrubbed sequence where each phase highlights in turn as you scroll through the section (pin the section, scrub phase 1→2→3), each with its own subtle icon/diagram animating in, instead of a static image placeholder | The image placeholder div is a good spot for a simple original R3F scene (e.g. an abstract circadian-rhythm ring, analogous to reference's sleep-cycle diagram but original) |
| **SocialProof** (3 testimonials) | scattered pull-quote page (page 9 of the PDF: quotes placed asymmetrically, independent fade-ins) | Instead of all 3 cards animating uniformly, offset their reveal timing/position slightly per card (already has `delay: index * 0.1`, could add slight y/x variation per card) to echo the "scattered quotes" feel rather than a rigid grid stagger | Smallest lift of all sections |
| **Offer** (pricing card) | closing CTA section (solid-color background shift + centered content) | Reference shifts to a distinct solid accent color for its final CTA; this section could similarly shift the background tone (subtle) as it pins, with the price card scaling/settling in via a scrub-tied entrance rather than a one-shot `whileInView` | Keep the guarantee/CTA copy as-is, just re-time the entrance |
| **FAQ** (accordion) | 07 tips accordion (numbered, emoji-tagged, expand/collapse) | Direct structural match already — `Accordion.tsx` exists. Check its open/close easing against the reference's `power2.out`/`expo.out` feel | Likely just a timing/easing polish pass |
| **Footer** | Footer (credits, socials, closing mark) | No motion-heavy ask here in the reference either — mostly static | Low priority |

## 5. Proposed order of sessions

1. **Hero** — fix copy/branding first, then make the existing 3D blob scroll-reactive + add title stagger reveal.
2. **Agitation** — background word-strip + pinned heading.
3. **Solution** — scrubbed numbered-phase sequence + original circadian-ring visual.
4. **SocialProof** — scattered-reveal polish.
5. **Offer** — scrubbed entrance + background shift.
6. **FAQ** — easing/timing polish.
7. **Footer** — light pass.

## Rerun Inputs
workflow: manual technical audit (site-bundle.js + site-styles.css + Ref_model/creative_sleep.pdf)
source_url: https://sleep-well-creatives.com/
target_stack: React + Vite + TypeScript + Tailwind v4 + three/@react-three/fiber/@react-three/drei + framer-motion (+ proposed: gsap/ScrollTrigger)
output: ANIMATION.md
