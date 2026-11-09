# Prompts to give Claude Code

Paste **Prompt 1** first. When it finishes and you've reviewed, send the next one. Building in phases gives far better quality than one giant request.

---

## Prompt 1 — Kick-off & foundation (paste this first)

```
You are building the official website for HEVINKA Technologies Private Limited — a premium, award-level, animation-rich marketing site.

Before writing any code:
1. Read CLAUDE.md, content/site-content.md, and every skill in .claude/skills/ (hevinka-brand, cinematic-scroll-motion, webgl-network-globe, premium-section-blueprints, launch-qa).
2. Look at all 17 images in brand-reference/brochure-pages/ and the logo references in public/brand/. The site must carry the brochure's essence: deep navy, royal blue, electric cyan glow, glowing global networks, diagonal chevron cuts, two-tone headings, glass dashboards.
3. Use the frontend-design skill/plugin for design judgement and the GSAP skills for animation APIs.

Then, in plan mode, give me a short build plan (pages, components, animation inventory, packages with versions) and wait for my OK.

After I approve, do PHASE 1 only:
- Scaffold Next.js 16 (App Router, TypeScript strict, Tailwind v4, Turbopack, ESLint) in this folder without deleting the kit files.
- Install: gsap @gsap/react lenis motion three @react-three/fiber @react-three/drei @react-three/postprocessing lucide-react clsx.
- Put the brand tokens from .claude/skills/hevinka-brand/references/tokens.css into app/globals.css; set up Sora, Manrope and JetBrains Mono with next/font.
- Create lib/gsap.ts, lib/content.ts (typed content from content/site-content.md, including all 8 solutions with slugs).
- Build the motion primitives in components/motion/: SmoothScroll (Lenis + ScrollTrigger), SplitHeading, Reveal, DiagonalWipe, Parallax, Magnetic, Marquee, DrawLines, TiltCard, Cursor, Preloader, TransitionLink — all reduced-motion aware.
- Build the logo as SVG components (recreate the mark from the reference crops; tell me it is a recreation), Nav (glass on scroll, hide/show), full-screen menu with diagonal wipe, Footer with giant wordmark reveal.
- A temporary /playground page showing every primitive working.
Then run the launch-qa static checks and screenshots, and report.
```

---

## Prompt 2 — Hero + 3D globe

```
PHASE 2: Build the home hero exactly per premium-section-blueprints §1 and the webgl-network-globe skill.
- Dotted-earth globe with Kochi + Dubai hubs, glowing travelling arcs, atmosphere, bloom, pointer response, scroll-driven camera handing off to the "Global Solutions" section.
- Static AVIF poster as LCP + fallback; lazy-load the 3D chunk; adaptive quality; pause offscreen.
- Preloader → hero choreography; cycling glow on INNOVATE. / INTEGRATE. / ELEVATE.; keyword ticker; scroll indicator.
Make it breathtaking but keep LCP < 2.5s. Screenshot at 390 / 1440 widths and at 3 scroll positions, review against brochure pages 1, 3 and 17, iterate until it looks premium, then report.
```

---

## Prompt 3 — Home story sections

```
PHASE 3: Build home sections 2–12 from premium-section-blueprints in order (marquee, Vision/Mission/Philosophy + Operating Model, Global Solutions, Solutions orbit wheel (pinned), Unified Platform with live HTML dashboard in a laptop, Connected Ecosystem with travelling pulses, Why HEVINKA stacking cards, 9-step Approach horizontal pinned rail, Industries hover-reveal list, Solution spotlights scrollytelling, Let's Build What's Next CTA).
Alternate dark/light sections with animated diagonal chevron transitions and a smooth background colour morph.
Every section: entrance choreography + at least one scroll-linked effect; full mobile fallback; reduced-motion fallback.
After each 3 sections, run launch-qa screenshots and fix anything off-brand before continuing.
```

---

## Prompt 4 — Solution pages & inner pages

```
PHASE 4: Build /solutions/[slug] (8 pages, statically generated from lib/content.ts) using the detail template in premium-section-blueprints, including the special visuals (rental lifecycle ring, logistics route map with moving truck, digital growth engine, API hub). Then /approach, /industries, /about, /contact (form with server action via Resend + mailto fallback, WhatsApp link), and not-found.
Add diagonal page transitions between routes. Mark any copy you had to write that isn't in content/site-content.md with TODO(content) and list them at the end.
```

---

## Prompt 5 — Polish, performance, SEO, launch

```
PHASE 5: Polish pass.
- Go section by section and raise the craft: spacing rhythm, type scale, micro-interactions on every button/card/link, hover states, consistent easing, no dead moments while scrolling.
- Performance: run the launch-qa skill fully (Lighthouse desktop+mobile, Performance trace, axe). Hit the targets. Reduce JS, optimise images, check CLS.
- SEO: metadata for every page, next/og images, sitemap.ts, robots.ts, JSON-LD Organization + LocalBusiness.
- Remove /playground. Produce content/IMAGE-TODO.md listing every placeholder image to replace, and a final QA report.
```

---

## Handy follow-up prompts
- "This section feels flat — make it more cinematic: add depth layers, a scroll-linked hero moment and better choreography, staying on brand."
- "Show me 3 alternative hero directions as separate routes (/hero-a, /hero-b, /hero-c) so I can choose."
- "Animations stutter on mobile — profile and fix without removing the effects on desktop."
- "Shift the palette slightly more premium/modern but keep the brochure's essence — show before/after screenshots."
- "Deploy to Vercel and give me the preview URL."
