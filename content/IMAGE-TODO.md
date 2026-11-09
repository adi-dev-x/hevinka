# Image & asset TODO

Everything below is a placeholder or recreation that should be replaced with client-supplied artwork.
No stock photos or invented imagery were used. Where a photo is missing, the site shows a branded,
on-palette composition (icons, rings, dotted map) instead, so every slot already has the right size and
crop. Drop-in specs are given for each slot.

**Formats:** supply originals at ≥ 2× the listed size. JPG/PNG are fine because the site serves them
through `next/image` (AVIF/WebP, responsive). Photos should take the brochure's **blue duotone**
treatment (navy `#001c3d` → electric `#00a8fc`), or be colour-neutral so the treatment can be applied in CSS.

---

## 1. Logo — highest priority

The current logo is a **recreation**, traced from `public/brand/logomark-reference-on-dark.png`.

| File | Used for | Replace with |
|---|---|---|
| `components/ui/Logo.tsx` (`BLADE_PATHS`, wordmark) | Nav, menu, footer, preloader, page transition, OG images, 404 | Original vector logo (SVG): mark + wordmark + "TECHNOLOGIES PRIVATE LIMITED" |
| `public/brand/logo.svg`, `logo-white.svg`, `logomark.svg` | JSON-LD `logo`, downloads | Same, in colour and white versions |
| `app/icon.svg` | Favicon | Mark only, square |

The preloader and page transition animate the **three blades separately**, so please keep each blade a
separate `<path>` in the supplied SVG.

## 2. Solution page heroes — 8 photos (brochure p.10–15)

`/solutions/[slug]` hero, right-hand rounded-diagonal frame (`SolutionEmblem` in
`components/pages/solution/SolutionSections.tsx`). Aspect **5:4**, min **1400 × 1120**.

| Solution | Brochure reference | Suggested subject |
|---|---|---|
| ERP & Enterprise Solutions | p.10 | Team at screens / operations dashboard |
| CRM & Customer Solutions | — | Customer-facing team, sales conversation |
| Equipment & Asset Rental Management | p.12 | Crane / heavy equipment yard |
| Logistics, Fleet & Transport Solutions | p.13 | Fleet control room or trucks on route |
| Business Automation & Integration | — | Connected systems / control screens |
| Custom Software & Applications | p.14 | Devices (laptop, tablet, phone) with UI |
| Web & E-Commerce Solutions | — | Storefront on laptop + phone |
| Digital Growth & Optimization | p.15 | Analytics / marketing workspace |

## 3. Industries — 11 photos (brochure p.4)

- **Home §10:** the floating hover preview in `components/sections/Industries.tsx`, aspect **4:3**, min **800 × 600**.
- **`/industries`:** optionally, the sticky panel in `components/pages/IndustrySections.tsx`.

The 11 industries:
1. Construction & Engineering
2. Marine & Offshore
3. Logistics & Transportation
4. Equipment Rental
5. Trading & Distribution
6. Manufacturing
7. Retail
8. Hospitality
9. Professional Services
10. Real Estate & Facilities
11. Other Specialized Businesses

## 4. Optional photography

| Slot | Today | Would benefit from |
|---|---|---|
| Home §11 Spotlights (`Spotlights.tsx`) | Animated diagrams: dashboard, lifecycle ring, route map, API hub, growth engine | Optionally alternate with brochure-style photos (crane, fleet room, devices) |
| Home §8 Why HEVINKA collage (`WhyHevinka.tsx`) | Tilted glass UI panels | Real product screenshots, once a client agrees to their use |
| `/about` hero | Kochi ↔ Dubai network map | Office / team photo (JC Chambers, Kochi), if desired |

## 5. Generated assets (no action needed, regenerate if the design changes)

| Asset | Source | Regenerate with |
|---|---|---|
| `public/images/globe-poster-{800,1400}.{avif,webp}` + `lib/globe-poster.json` | Frame of the live WebGL globe | `node scripts/make-globe-poster.mjs` (server on :3100) |
| `public/brand/world-dots.svg`, `public/data/globe-dots.bin` | Natural Earth land mask | `node scripts/make-world-dots.mjs` |
| `components/ui/icon-sprite-data.ts` | lucide-react icon nodes | `node scripts/make-icon-sprite.mjs` |
| OG images (`opengraph-image.tsx` per route) | `lib/og.tsx` + Sora font | Built automatically |

## 6. Illustrative data (not photos, but please confirm)

The dashboard mock-up (`components/visuals/Dashboard.tsx`) shows the brochure's own sample figures
(leads, customers, pipeline, revenue). It is labelled as an illustrative interface; confirm the client
is happy to show those sample numbers.
