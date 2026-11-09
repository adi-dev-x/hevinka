---
name: webgl-network-globe
description: Build the HEVINKA hero 3D scene — a glowing dotted-earth globe with luminous connection arcs, pulsing city hubs (Kochi, Dubai, global), bloom and scroll-driven camera — using React Three Fiber, drei and postprocessing in Next.js 16. Use when working on the hero, any 3D/WebGL element, the world-map network visual, or their performance and fallbacks.
---

# WebGL Network Globe (hero signature)

The brochure's strongest image is a **night Earth wrapped in glowing blue connection arcs** (cover, "Global Solutions", back page). The website hero recreates it as a live, interactive 3D scene.

## Visual spec
- Background: `--grad-night` + faint starfield (≈1500 points, size 0.6–1.2px, opacity 0.4, very slow drift).
- **Globe:** not a photo texture. Build a **dotted/halftone sphere**: sample a land-mask (equirectangular PNG, 2:1, white land on black, `public/textures/earth-landmask.png`) and place instanced dots (≈12–18k) only on land. Dot colour `#0B5BD3` → brighter `#00A8FC` toward the lit side; 1px radius feel.
- **Atmosphere:** fresnel rim shader on a slightly larger sphere, colour `#00A8FC`, intensity 0.6, additive blending.
- **Arcs:** 14–20 great-circle arcs (QuadraticBezier lifted by distance) from **Kochi (9.97°N, 76.28°E)** and **Dubai (25.2°N, 55.27°E)** to world hubs (London, Frankfurt, Singapore, Sydney, New York, Riyadh, Doha, Nairobi, Mumbai, Bengaluru, Tokyo, São Paulo). Material: dashed line or tube with animated `dashOffset` so light pulses travel along them; colour gradient `electric → ion`.
- **Hubs:** small glowing sprites + expanding ring pulse (scale 1→3, opacity 1→0, loop 2.4s, staggered). Kochi & Dubai larger and brighter.
- **Postprocessing:** `Bloom` (intensity 1.1, luminanceThreshold 0.2, mipmapBlur), subtle `Vignette`. No chromatic aberration noise.
- Orientation: start centred on India/Middle East, tilted 23°, slow auto-rotation (0.04 rad/s).

## Interaction & scroll
- Pointer: globe rotates slightly toward cursor (damped, max ±0.25 rad), arcs brighten near cursor.
- Scroll (GSAP ScrollTrigger scrubbed through the hero → next section):
  1. 0–40%: camera dollies in; hero headline lines move up & fade (parallax).
  2. 40–80%: globe rotates to centre on Kochi; arcs from Kochi brighten; label "Kochi · India" + "Dubai · UAE" fade in as HTML overlays (drei `<Html>`).
  3. 80–100%: globe shrinks & moves right, becoming the backdrop of the "Global Solutions for a Connected World" section; canvas fades to 30% opacity.
- Drive Three.js values from GSAP by tweening a plain object (`progress.value`) and reading it in `useFrame` — never set state per frame.

## Implementation notes
```
components/three/
  GlobeCanvas.tsx     // <Canvas dpr={[1, 1.75]} gl={{ antialias:false, powerPreference:"high-performance" }} frameloop="demand"|"always">
  DottedEarth.tsx     // InstancedMesh of dots built once from landmask (useMemo), positions in a Float32Array
  Atmosphere.tsx      // shaderMaterial (fresnel)
  Arcs.tsx            // build curves once; animate uniform uTime for dash travel
  Hubs.tsx
  Effects.tsx         // @react-three/postprocessing EffectComposer + Bloom
```
- **Land mask:** generate it yourself instead of hunting for an image — write `scripts/make-landmask.mjs` that loads `world-atlas/land-110m.json` (npm `world-atlas` + `topojson-client`), projects with d3-geo `geoEquirectangular` onto a 2048×1024 canvas (`@napi-rs/canvas`), fills land white, and saves `public/textures/earth-landmask.png`. Alternatively compute dot positions at build time into `public/data/globe-dots.json` (lat/lng pairs) to skip image sampling in the browser.
- Import with `next/dynamic(() => import("./GlobeCanvas"), { ssr: false, loading: () => <GlobePoster/> })`.
- `GlobePoster` = a pre-rendered AVIF still of the globe (export from the scene once) so LCP is an image, not WebGL. Cross-fade canvas in once the first frame renders.
- Pause rendering when the hero is off-screen (`frameloop="demand"` + invalidate, or toggle via IntersectionObserver).
- Adaptive quality: drei `<PerformanceMonitor>` → lower dot count, DPR and disable bloom on weak GPUs. On mobile (<768px): 6k dots, 8 arcs, DPR max 1.5.
- Reduced motion or no WebGL (`!WebGL2RenderingContext`) → show the static poster with a CSS slow pulse on hub dots only.
- Keep the 3D bundle out of the initial JS; target < 180KB gz for the lazy chunk.

## Packages
`three @react-three/fiber @react-three/drei @react-three/postprocessing` (use versions compatible with React 19 — R3F v9+). Optional `three-globe` only for its geo helpers; prefer own lightweight code.

## Secondary 3D/2D uses (reuse pieces)
- **Contact section:** flat 2D dotted world map (SVG/canvas) with only Kochi ↔ Dubai arc drawing via DrawSVG.
- **Ecosystem section:** small orbiting logo mark in the centre with connector lines (2D SVG is enough — don't add a second WebGL context).
