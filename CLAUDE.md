# HEVINKA Technologies — Website Project

Premium, motion-rich marketing website for **HEVINKA Technologies Private Limited** (Kochi, Kerala · India | UAE | Beyond).
Tagline: **Innovate. Integrate. Elevate.** — "Technology that empowers tomorrow."

The site must feel like a top-tier agency build (Awwwards / FWA level): cinematic scroll storytelling, layered depth,
deliberate typography, and buttery 60fps motion — while staying fast, accessible and SEO-solid.

## Read these first (always)
- `.claude/skills/hevinka-brand/SKILL.md` — colours, type, logo, voice. **Never invent off-brand colours.**
- `content/site-content.md` — ALL copy. Use it verbatim or tighten it; never make up services, clients, stats or testimonials.
- `brand-reference/brochure-pages/` — the original brochure (17 pages). Look at the relevant page before building a section.

## Skills in this repo (use them — they load automatically when relevant)
| Skill | Use for |
|---|---|
| `hevinka-brand` | Design tokens, palette, typography, logo usage, tone |
| `cinematic-scroll-motion` | GSAP + ScrollTrigger + SplitText + Lenis + Motion patterns, perf & reduced-motion rules |
| `webgl-network-globe` | The 3D glowing network globe / world-map hero (React Three Fiber) |
| `premium-section-blueprints` | Section-by-section design + animation spec for every page |
| `launch-qa` | Visual QA with Playwright screenshots, Lighthouse, a11y, SEO checklist before "done" |

Also install the official plugins/skills listed in `README.md` (frontend-design, GSAP skills).

## Stack (do not swap without asking)
- **Next.js 16** (App Router, TypeScript strict, Turbopack, React 19, React Compiler on)
- **Tailwind CSS v4** (CSS-first `@theme` tokens in `app/globals.css`)
- **GSAP 3.13+** — every plugin is free now: ScrollTrigger, SplitText, DrawSVG, MorphSVG, Flip, MotionPath, CustomEase. Use `@gsap/react` → `useGSAP()`
- **Lenis** for smooth scroll, synced to ScrollTrigger
- **Motion** (`motion/react`, ex-Framer Motion) for component micro-interactions, hover, presence, layout
- **React Three Fiber + drei** (+ `@react-three/postprocessing` for bloom) for the 3D hero, lazy-loaded
- **lucide-react** icons (thin 1.5 stroke) — matches the brochure's line-icon style
- `next/font` for fonts, `next/image` for all raster images
- Deploy target: Vercel

## Hard rules
1. **Brand first.** Deep navy + royal blue + electric cyan with a light "mist" counterpoint. Dark sections dominate; light sections are used for rhythm (as in the brochure, which alternates).
2. **Signature shape:** the brochure's **angled / chevron diagonal cuts and rounded-diagonal frames**. Use them as section dividers, image masks (clip-path) and card corners. This is the visual DNA — reuse it everywhere.
3. **Animation everywhere, but purposeful.** Each section gets an entrance choreography + at least one scroll-linked effect. No random bouncing. Ease: `expo.out` / `power4.out`; durations 0.8–1.4s for hero, 0.5–0.8s for elements.
4. **Performance budget:** LCP < 2.5s, CLS < 0.05, INP < 200ms, JS on first load < 250KB gz (3D lazily loaded after LCP). Animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly).
5. **Accessibility:** honour `prefers-reduced-motion` (swap to simple fades, disable Lenis + pinning + 3D auto-rotate), visible focus rings, AA contrast, semantic landmarks, alt text, keyboard-operable nav and menu.
6. **Responsive:** design mobile from the start. Horizontal-scroll and pinned sections must degrade to vertical stacks below 768px.
7. **Cleanup:** every GSAP animation is created inside `useGSAP` (scoped) or a `gsap.context()` and reverted on unmount. Kill ScrollTriggers on route change. `ScrollTrigger.refresh()` after fonts/images load.
8. **No fake content.** No invented client logos, testimonials, awards or numeric claims. Where a stat would look good, use a qualitative proof point from the brochure instead, or leave a clearly marked `TODO(content)`.
9. **Copy corrections:** the brochure's back page has typos — use "PRIVATE" (not "PRIVIATE") and "www.hevinka.com" (not "wwwhevinka.com"). Address is "JC Chambers" (one page says "JMC").
10. Before saying a task is done, run the `launch-qa` skill: build passes, lint/typecheck clean, screenshots at 390 / 768 / 1440 widths reviewed.

## Commands
- `npm run dev` — dev server (Turbopack)
- `npm run build && npm run start` — production check
- `npm run lint` / `npx tsc --noEmit`

## Project structure (target)
```
app/
  layout.tsx            # fonts, metadata, <SmoothScroll>, <Cursor>, <Preloader>
  page.tsx              # Home (long-scroll story)
  solutions/[slug]/page.tsx   # 8 solution detail pages (data-driven)
  industries/page.tsx
  approach/page.tsx
  about/page.tsx
  contact/page.tsx
  globals.css           # Tailwind v4 @theme tokens
components/
  motion/               # SmoothScroll, Reveal, SplitHeading, Magnetic, Parallax, Marquee, CountUp, DiagonalWipe
  three/                # NetworkGlobe, GlobeScene (client-only, dynamic import)
  sections/             # Hero, Vision, Solutions, Ecosystem, Approach, WhyHevinka, Industries, CTA ...
  ui/                   # Button, Card, Chevron, Badge, Nav, Footer
lib/
  content.ts            # typed content derived from content/site-content.md
  gsap.ts               # single place that registers plugins
public/brand/           # logo SVGs
```
