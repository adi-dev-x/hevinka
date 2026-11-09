---
name: launch-qa
description: Quality gate for the HEVINKA website — build/typecheck/lint, Playwright screenshots at mobile/tablet/desktop compared against the brochure, animation and reduced-motion checks, Lighthouse/Core Web Vitals, accessibility and SEO. Use before declaring any page or feature done, after big animation changes, and before deploy.
---

# Launch QA

Run this loop after each major section and before calling a phase complete. Fix issues, then re-run.

## 1. Static checks
```bash
npx tsc --noEmit
npm run lint
npm run build        # must succeed with no errors; review route sizes in the output
```
Flag any route whose First Load JS > 250KB gz.

## 2. Visual review (Playwright MCP or script)
If the Playwright MCP server is connected (`.mcp.json`), use it to open `http://localhost:3000`. Otherwise write `scripts/screenshots.mjs` with `@playwright/test`'s `chromium`.
- Viewports: **390×844**, **768×1024**, **1440×900**, **1920×1080**.
- For each page: full-page screenshot after scrolling through slowly (so ScrollTrigger reveals fire), plus screenshots mid-way through each pinned section.
- Look at them yourself and compare with the matching brochure page in `brand-reference/brochure-pages/`. Check:
  - Brand colours correct, no off-palette greys/purples
  - Two-tone headings + brand bar present
  - Diagonal cuts render cleanly (no 1px gaps or seams between sections)
  - No overlapping/clipped text, no horizontal overflow on mobile (`document.documentElement.scrollWidth === innerWidth`)
  - Hidden content: nothing stays at opacity 0 after scrolling past
- Also run once with `reducedMotion: "reduce"` and once with JS disabled: content must be fully visible and readable.

## 3. Motion checks
- Record a Performance trace while scrolling the home page: no long tasks > 50ms during scroll, steady ~60fps, no layout thrash (purple layout bars).
- Resize window mid-page → pinned sections recalculate correctly (no jumps).
- Navigate between routes 5× → no duplicated ScrollTriggers (`ScrollTrigger.getAll().length` stable), no memory growth, WebGL context disposed.
- Touch devices: no custom cursor, no hover-only info.

## 4. Lighthouse / Web Vitals
```bash
npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance,accessibility,best-practices,seo --quiet --chrome-flags="--headless"
npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility --quiet --chrome-flags="--headless"
```
Targets: Performance ≥ 90 desktop / ≥ 80 mobile, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100. LCP < 2.5s, CLS < 0.05.

## 5. Accessibility
- `npx @axe-core/cli http://localhost:3000` (or axe via Playwright) → 0 serious/critical.
- Keyboard: Tab through the whole home page; focus always visible; menu opens/closes with Enter/Esc; focus trapped inside open menu.
- Headings in order (one `h1` per page), landmarks present, images have meaningful alt, decorative canvases `aria-hidden`.

## 6. Content & SEO
- Every string traceable to `content/site-content.md` (or marked `TODO(content)`).
- Contact details exact: +91 787 9642 135, +91 906 1977 166, info@hevinka.com, Building No 66/44, 3rd Floor, JC Chambers, Panampilly Nagar, Ernakulam – 682036, Kerala.
- No "PRIVIATE", "wwwhevinka", "JMC".
- Metadata, OG images, sitemap, robots, JSON-LD validate.

## 7. Report
Finish with a short QA report: what passed, scores, screenshots reviewed, and any open TODOs (missing logo SVG, real photos, client copy review).
