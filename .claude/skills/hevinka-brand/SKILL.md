---
name: hevinka-brand
description: HEVINKA Technologies brand system — colour tokens, gradients, typography, logo usage, signature diagonal shapes, iconography and tone of voice. Use whenever building or styling ANY UI, choosing colours or fonts, writing copy, or placing the logo on the HEVINKA website.
---

# HEVINKA Brand System

Derived from the official company-profile brochure (`brand-reference/brochure-pages/`), evolved slightly for a premium web experience. The essence to keep: **deep-space navy, royal-to-electric blue light, glowing global networks, sharp diagonal cuts, clean white "data" panels.**

## 1. Colour palette

### Core (sampled from the brochure)
| Token | Hex | Role |
|---|---|---|
| `abyss` | `#000E21` | Deepest background, footer, preloader |
| `navy` | `#001C3D` | Primary dark section background (the brochure's dominant colour) |
| `midnight` | `#04224C` | Raised dark surfaces, cards on dark |
| `cobalt` | `#0047A8` | Deep brand blue, gradients, pressed states |
| `royal` | `#0B5BD3` | **Primary brand blue** — headings accent on light, buttons |
| `electric` | `#00A8FC` | **Signature accent** — highlighted words ("PROFILE", "Solutions"), glows, links on dark |
| `sky` | `#60A8E4` | Soft accent, secondary icons, "Core Philosophy" tint |
| `mist` | `#F4F7FB` | Light section background |
| `white` | `#FFFFFF` | Text on dark, cards on light |
| `ink` | `#0A1A33` | Body text on light backgrounds |
| `slate` | `#5B6B85` | Muted text on light |
| `haze` | `#9FB3D1` | Muted text on dark |

### Web evolution (new, used sparingly — max ~5% of any screen)
| Token | Hex | Role |
|---|---|---|
| `ion` | `#7FE3FF` | Hot-spot highlight: city lights on the globe, active node pulses, cursor dot |
| `signal` | `#3D7BFF` | Mid-stop in gradients for richer blue transitions |

These keep the brochure's blue family but add a brighter "light-emitting" end so glows feel premium on screens.

### Gradients
- `--grad-brand`: `linear-gradient(135deg, #0047A8 0%, #0B5BD3 45%, #00A8FC 100%)` — buttons, chevron ribbons, highlighted bars
- `--grad-night`: `radial-gradient(120% 80% at 70% 0%, #0B3A80 0%, #001C3D 45%, #000E21 100%)` — hero & dark section backdrops
- `--grad-text`: `linear-gradient(90deg, #00A8FC, #7FE3FF 60%, #0B5BD3)` — animated gradient text for one key word per heading (with `background-clip:text`, animate `background-position`)
- `--glow`: `0 0 40px rgba(0,168,252,.35), 0 0 120px rgba(11,91,211,.25)`

### Contrast rules
- On `navy`/`abyss`: body text `white` at 85–92% opacity; muted `haze`. `electric` is fine for large text & icons; for small body links use `#4CC3FF` (passes AA).
- On `mist`/`white`: headings `ink`, accent word `royal`; never put `electric` small text on white (fails AA) — use `royal`.

## 2. Typography
The brochure uses a geometric sans (Poppins/Montserrat-like) with heavy uppercase display and wide-tracked micro-labels.

| Use | Font (via `next/font/google`) | Notes |
|---|---|---|
| Display / headings | **Sora** 600–800 | Geometric, technical, premium. Hero in uppercase 800, tracking -0.02em |
| Body | **Manrope** 400–600 | Clean, highly legible |
| Micro-labels / numbers | **JetBrains Mono** 500 or Sora 500 uppercase | Wide tracking `0.32em` — mimics brochure labels like "P E O P L E · T E C H N O L O G Y" |

Type scale (fluid, `clamp`):
- `display-xl`: clamp(3.5rem, 9vw, 9rem) / 0.92 — hero ("BUILD WHAT'S NEXT")
- `display`: clamp(2.5rem, 5.5vw, 5.5rem) / 1.0
- `h2`: clamp(2rem, 3.6vw, 3.5rem) / 1.08
- `h3`: clamp(1.25rem, 1.8vw, 1.6rem) / 1.25
- `body-lg`: 1.125rem / 1.65 · `body`: 1rem / 1.65 · `label`: 0.75rem uppercase, tracking 0.32em

**Two-tone heading pattern (brochure signature):** first line in white/ink, key phrase in `electric`/`royal`.
e.g. "Our **Solutions**", "Connected **Business Ecosystem**", "Let's **Build** What's **Next**".
Always pair a heading with the short brand underline bar: 64×4px, `--grad-brand`, rounded.

## 3. Signature shapes & motifs (use everywhere)
1. **Diagonal chevron cuts** — sections end in an angled edge (clip-path polygon, ~6–10° slope) or a rounded chevron "arrowhead" (see brochure pages 1, 3, 15, 16, 17). Alternate direction section to section.
2. **Rounded-diagonal frames** — images/media inside a parallelogram-ish frame with rounded corners and a 2px electric outer stroke + glow (cover page globe frame).
3. **Glowing network lines** — curved arcs between nodes on a dotted world map; use as background art and as connectors between cards (Ecosystem page).
4. **Numbered steps** `01 02 03` in large Sora, electric, with thin divider lines.
5. **Chevron-tab cards** — the Vision/Mission/Philosophy cards: a coloured arrow-shaped left tab with icon + white content panel.
6. **Tracked micro-label stacks** in corners: "BUILDING / A SMARTER / TOMORROW".
7. **Glass data panels** — dashboard UIs shown on dark glass (`rgba(4,34,76,.55)`, `backdrop-filter: blur(16px)`, 1px `rgba(127,227,255,.15)` border).
8. **Dotted-pixel world map** — a halftone dot map of the world, with glowing hubs at India (Kochi) and UAE.

## 4. Logo
- Mark: three ascending, forward-leaning curved blades (like rising bars / speed lines) to the left of the **HEVINKA** wordmark (heavy geometric sans, uppercase), with "TECHNOLOGIES PRIVATE LIMITED" below and a thin blue rule.
- Reference crops: `public/brand/logo-reference-on-dark.png`, `logomark-reference-on-dark.png`, `logo-reference-alt.png`.
- **Ask the user for the original SVG logo.** If not available, recreate a clean SVG of the mark (3 paths) + wordmark (Sora 800) as `public/brand/logo.svg`, `logo-white.svg`, `logomark.svg`, and flag it as a recreation for client approval.
- On dark: white wordmark, mark in white or `--grad-brand`. On light: wordmark `cobalt`, mark `--grad-brand`.
- Clear space = height of the "H". Minimum width 120px (full lockup), 28px (mark).
- Logo animation idea: the three blades draw/grow upward in sequence (stagger 0.08s, `expo.out`), then wordmark letters rise via SplitText.

## 5. Iconography & imagery
- Line icons, 1.5px stroke, rounded joins, inside circular badges (soft blue fill on light, glowing ring on dark) — like the brochure. Use `lucide-react`.
- Imagery themes: night city skylines, glowing globe/networks, logistics (trucks, ports, ships), cranes/heavy equipment, dashboards on laptops. Colour-grade all photos toward blue (duotone overlay `mix-blend-mode: multiply` with navy + `screen` electric highlights) so stock photos feel on-brand.
- Use AI/stock placeholders from Unsplash only as clearly-named placeholders (`/images/placeholder-*.jpg`), list them in `content/IMAGE-TODO.md` for replacement.

## 6. Voice
Confident, clear, practical — "business-centric technology", not hype. Short sentences. Verbs: connect, streamline, integrate, automate, scale, elevate.
Recurring phrases: "Innovate. Integrate. Elevate." · "Technology that empowers tomorrow." · "People · Technology · Possibilities" · "Building a smarter tomorrow" · "India | UAE | Beyond".

## 7. Tokens
Copy `references/tokens.css` into `app/globals.css` (Tailwind v4 `@theme`).
