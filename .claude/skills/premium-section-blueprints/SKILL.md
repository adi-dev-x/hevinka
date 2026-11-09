---
name: premium-section-blueprints
description: Page map and section-by-section layout + animation blueprints for the HEVINKA website (home long-scroll story, 8 solution pages, industries, approach, about, contact), each mapped to its brochure page. Use when building, restructuring or reviewing any page or section of the HEVINKA site.
---

# HEVINKA Section Blueprints

Every section lists: **brochure ref → layout → signature animation → mobile fallback**. Copy comes from `content/site-content.md`. Brand rules from `hevinka-brand`; motion patterns from `cinematic-scroll-motion`.

Rhythm: dark → dark → LIGHT → dark → LIGHT → dark … Each dark↔light boundary is a **diagonal chevron cut** that moves slightly with scroll (parallax on the clip-path angle, ±2°).

---

## Global chrome
- **Preloader** (first visit only): navy screen, logo blades grow one by one, `000 → 100` counter in mono, then the screen splits along a diagonal and slides apart revealing the hero.
- **Nav:** transparent over hero, becomes glass (`.glass`) after 80px; hides on scroll-down, shows on scroll-up. Links with sliding underline (`--grad-brand`). Right: "Let's talk" magnetic button. Section index "02 / 12" in mono.
- **Mega-menu / mobile menu:** full-screen navy overlay entering with a diagonal clip-path wipe; links stagger in with SplitText; the dotted world map faintly in the background; contact details at the bottom.
- **Custom cursor**, **scroll progress bar**, **back-to-top** chevron that draws its stroke as progress.
- **Footer:** giant "HEVINKA" wordmark that reveals letter-by-letter as you reach the bottom (clip from below); columns: Solutions, Company, Contact; tagline; "India | UAE | Beyond"; © year.

---

## HOME (long-scroll story)

### 1. Hero — "Innovate. Integrate. Elevate." (p.1, p.17)
- Layout: full-viewport `--grad-night`. Left: micro-label stack "PEOPLE / TECHNOLOGY / POSSIBILITIES" + brand bar. H1 in display-xl, three lines **INNOVATE. / INTEGRATE. / ELEVATE.** — the active word glows `text-gradient`, cycling every 2.2s. Sub: "Digital transformation & business technology solutions — ERP, CRM, automation, logistics, asset rental, web & digital." Two CTAs: "Explore solutions" (primary gradient) + "Let's build what's next" (ghost).
- Right/background: **WebGL network globe** (`webgl-network-globe`) inside the brochure's rounded-diagonal frame on desktop; frame edge has an electric 2px glowing stroke.
- Bottom: service keyword ticker "ERP | CRM | SOFTWARE | AUTOMATION | LOGISTICS | ASSET RENTAL | WEB | DIGITAL" + "Scroll" indicator (animated line).
- Animation: preloader hands off → frame clip-path opens diagonally → H1 lines rise (SplitText mask) → globe fades/zooms in → CTAs pop. Scroll: scrubbed camera move described in the globe skill; headline parallaxes up faster than the globe.
- Mobile: globe sits behind text at 50% opacity, top-right; no frame.

### 2. Velocity marquee
- Two opposing rows of huge outlined text (stroke `electric`, 1px) "CONNECTED SYSTEMS · SMARTER BUSINESS · " — speed & skew react to scroll velocity.

### 3. Vision · Mission · Philosophy (p.2) — LIGHT
- Layout: left sticky heading "Our **Vision & Approach**" + intro; right: three **chevron-tab cards** (arrow-shaped coloured tab: navy / royal / sky, with icon and label; white panel with statement; big number 01/02/03 with outcome label).
- Animation: cards slide in from the right with the tab first, then the panel unfolds (`clip-path` inset from left). Numbers count/roll in. Icons draw (DrawSVG).
- Below: **Connected Operating Model** — 5 circular icon nodes joined by a line; the line draws with scroll (scrub), each node lights up (ring fills `electric`) as the line reaches it.
- Mobile: cards stack; operating model becomes vertical timeline.

### 4. Global Solutions for a Connected World (p.3) — DARK
- The hero globe has transitioned into this section's backdrop (or use a 2D dotted world map with drawing arcs).
- Heading two-tone: "GLOBAL SOLUTIONS / **FOR A CONNECTED WORLD**". Paragraph. Four pillar items with glowing ring icons.
- Animation: arcs draw between hubs on scroll; pillars reveal with stagger; each icon ring pulses once on enter.

### 5. Our Solutions (p.7) — DARK→LIGHT transition
- **Desktop hero moment:** pinned section with the **solutions orbit wheel**: centre disc with HEVINKA mark; 8 solution nodes on a ring. Scrolling rotates the ring; the node arriving at the "3 o'clock" focus position enlarges and the left panel swaps to that solution's title, one-liner and "Explore →" link (crossfade + SplitText). 8 steps across ~400vh. Progress dots on the ring.
- After pin: a grid of 8 **TiltCards** (icon, title, one-liner, arrow) linking to `/solutions/[slug]`.
- Mobile: no pin; horizontal snap carousel of solution cards + the grid.

### 6. A Unified Platform for Greater Possibilities (p.8) — LIGHT
- Centre: a **laptop mock** containing a **live HTML dashboard** (not an image): KPI tiles count up, a line chart path draws, a funnel fills, donut segments sweep, a "Recent activity" list ticks in new rows every few seconds. Use brand colours.
- Around it: 13 module chips in two columns + bottom row, connected to the laptop with thin lines that draw in; a pulse travels along each line to the laptop.
- Scroll: laptop lid opens (rotateX from -90° to 0°, scrubbed) as you enter; chips fly in from their sides.
- Banner bar below (dark glass): "Technology that connects people, **processes and possibilities.**" with a tiny globe glow.

### 7. Connected Business Ecosystem (p.9) — DARK
- Layout: 8 pill-shaped nodes (4 left / 4 right) around a central glowing HEVINKA mark; double-arrow connectors.
- Animation: on scroll, connectors draw from each node to the centre; light pulses travel both ways continuously (MotionPath dots); hovering a node highlights its paths and dims others. The central mark rotates its glow ring.
- Mobile: nodes in 2-column grid with a vertical spine.

### 8. Why HEVINKA (p.5) — DARK
- Layout: left sticky — "Why **HEVINKA**" + "The differentiators that drive real business impact." + a 3D-tilted glass dashboard image collage. Right: **stacking cards** — the 7 differentiators as glass cards (circular glowing icon, big number, title, text) that stick and stack on top of each other, each previous card scaling down to 0.92 and dimming as the next arrives.
- Mobile: simple list with reveals.

### 9. Our Approach — 9 steps (p.6) — DARK
- **Pinned horizontal process rail:** 9 chevron-shaped step tiles (like the brochure's arrow tiles) in a row; scrubbing scrolls horizontally; a gradient progress line fills underneath; the current step's tile lifts, glows, and its icon animates (draw/morph); detail text appears below.
- Final frame: closing line fades in.
- Mobile: vertical stepper with a growing line.

### 10. Industries (p.4) — LIGHT
- Heading "Technology adapted to **different business environments**".
- Layout: list/grid of 11 industries. **Hover reveal:** hovering an industry row shows a floating blue-duotone image following the cursor (Motion spring) and the row text shifts right with an arrow. Rows reveal with stagger and a thin line drawing beneath each.
- Mobile: icon grid, 2 columns.

### 11. Solution spotlights — scrollytelling (p.10–15)
- Sticky media on the right inside a diagonal frame; left column has 5 text blocks: ERP & Enterprise · Equipment & Asset Rental · Logistics & Fleet · Custom Software · Digital Growth. As each block enters, the sticky media swaps via diagonal wipe (dashboard mock / crane photo / fleet control room / devices / growth-engine diagram).
- Each block: label, two-tone heading, 2-line summary, 3–4 key modules as chips, "Explore" link.

### 12. Let's Build What's Next (p.16) — CTA, DARK
- Giant display text **LET'S / BUILD / WHAT'S / NEXT** where "BUILD" and "NEXT" are `electric`; text scales from 0.8 → 1 and letter-spacing tightens with scroll (scrub).
- Values row: Innovate · Integrate · Elevate · Grow Together (icons).
- Contact block: phones, email, address with icon rings; a 2D dotted map with a Kochi ↔ Dubai arc drawing; magnetic "Start a project" button → `/contact`.

---

## SOLUTION DETAIL TEMPLATE `/solutions/[slug]` (8 pages, data from `lib/content.ts`)
1. **Hero:** breadcrumb label, two-tone H1, intro, 3 qualities (e.g. Scalable / Secure / People-centric) and media in the rounded-diagonal frame with diagonal wipe reveal.
2. **Principles** (3 cards) — light section.
3. **Modules grid** — icon cards with stagger reveal; hover: icon ring fills + card lifts with spotlight.
4. **Dashboard / visual showcase** — reuse animated HTML dashboard or relevant diagram (rental lifecycle ring for Rental; growth-engine cycle for Digital Growth; API hub diagram for Custom Software).
5. **Benefits strip** — gradient bar with benefit chips sliding in.
6. **Related solutions** rail + CTA.

Special visuals:
- **Rental:** circular "lifecycle" ring of segments; scrolling rotates and highlights each lifecycle stage (12 stages) — SVG + scrub.
- **Logistics:** animated route line across a map with a truck icon moving along a MotionPath; 16 solution tiles.
- **Digital Growth:** 6-stage circular engine around a laptop; stages light up sequentially in a loop + on scroll.
- **Custom Software:** API hub — central "API" cloud with devices orbiting, connector lines with pulses.

## OTHER PAGES
- `/approach` — expanded Operating Model (5) + full 9-step methodology with more detail per step.
- `/industries` — 11 industries, each with a short paragraph on how the solutions apply (`TODO(content)` for review).
- `/about` — Vision/Mission/Philosophy, Why HEVINKA, "Global mindset, local understanding", India | UAE | Beyond.
- `/contact` — form (name, company, email, phone, interest dropdown of 8 solutions, message) with floating labels and inline validation; server action that emails `info@hevinka.com` (use Resend; env var `RESEND_API_KEY`; graceful fallback to mailto). Map arcs visual, contact cards, WhatsApp click-to-chat link for +91 787 9642 135.
- `not-found.tsx` — "Lost in the network" with a broken arc animation and route home.

## SEO & metadata
- `metadata` per page, Open Graph images generated with `next/og` (navy gradient + logo + page title), `sitemap.ts`, `robots.ts`, JSON-LD `Organization` + `LocalBusiness` (address, phones, email), canonical URLs on `https://www.hevinka.com`.
