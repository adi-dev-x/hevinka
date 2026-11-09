---
name: cinematic-scroll-motion
description: Production patterns for premium scroll-driven and interaction animation in Next.js 16 / React 19 using GSAP 3.13+ (ScrollTrigger, SplitText, DrawSVG, MorphSVG, Flip — all free), @gsap/react useGSAP, Lenis smooth scroll and Motion (motion/react). Use when adding ANY animation, scroll effect, page transition, preloader, cursor, text reveal, parallax, pinned or horizontal-scroll section, or when fixing jank/perf of animations.
---

# Cinematic Scroll & Motion

Goal: every scroll feels directed like a film — elements arrive with intention, depth shifts with scroll, and nothing stutters.

## 0. Division of labour
| Tool | Use it for |
|---|---|
| **GSAP + ScrollTrigger** | Anything tied to scroll position: pinning, scrubbing, timelines, horizontal scroll, parallax, section transitions |
| **SplitText** | Line/word/char text reveals (use `SplitText.create(el, { type:"lines,words", mask:"lines", autoSplit:true, onSplit })`) |
| **DrawSVG / MorphSVG / MotionPath** | Network lines drawing, logo blade growth, icon morphs, dots travelling along arcs |
| **Flip** | Layout transitions (filter tabs on Solutions, card → detail expansion) |
| **Lenis** | Smooth inertial scrolling (desktop). Disabled for reduced-motion & touch can use native |
| **Motion (`motion/react`)** | Hover/tap micro-interactions, `AnimatePresence` for menu/modals, magnetic buttons, layout animations in React state |
| **CSS** | Infinite marquees, gradient-text shimmer, simple hover states. Consider native `animation-timeline: view()` only as progressive enhancement |

Never animate the same property of the same element with two libraries.

## 1. Setup (single source of truth)
```ts
// lib/gsap.ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, Flip, CustomEase);
CustomEase.create("hevinka", "0.16, 1, 0.3, 1");      // expo-out feel
gsap.defaults({ ease: "hevinka", duration: 0.9 });
export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
```

```tsx
// components/motion/SmoothScroll.tsx — Lenis synced with ScrollTrigger
"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as any).__lenis = lenis; // for anchor scrolling & menu lock
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```
Call `ScrollTrigger.refresh()` after `document.fonts.ready` and after the preloader exits.

## 2. Component pattern (always)
```tsx
"use client";
export function Section() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({
      desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    }, (ctx) => {
      const { desktop, reduce } = ctx.conditions!;
      if (reduce) { gsap.from(".reveal", { autoAlpha: 0, duration: 0.4 }); return; }
      // ...full choreography; use desktop to choose pin/horizontal vs. stacked
    });
  }, { scope: root });
  return <section ref={root}>...</section>;
}
```
- Selectors are scoped to `root`. Everything auto-reverts on unmount.
- Prevent FOUC: elements that animate in start with `.reveal { visibility:hidden }` and use `autoAlpha` (set in CSS, but only when JS is on: `html.js .reveal{visibility:hidden}`).

## 3. Signature effects library (build these as reusable components in `components/motion/`)
1. **`<SplitHeading>`** — lines rise from a mask: `y: "110%"` → 0, `stagger: 0.08`, `duration: 1.1`. Accent word gets a delayed gradient sweep (`background-position` 100% → 0%).
2. **`<Reveal>`** — generic fade-up (`y: 40, autoAlpha: 0`), batched with `ScrollTrigger.batch(".reveal", { onEnter: els => gsap.to(els, {..., stagger: 0.08}) })`.
3. **`<DiagonalWipe>`** — image/section reveal via `clip-path` animating from `polygon(0 0,0 0,0 100%,0 100%)` to a full diagonal polygon. This is the brand's chevron cut in motion.
4. **`<Parallax speed={-0.2}>`** — `yPercent` scrub. Use layers at different speeds (background map 0.1, mid globe 0.25, foreground cards 0.4) for depth.
5. **`<Magnetic>`** — buttons/icons pulled toward cursor (Motion `useSpring`, strength 0.3, max 12px).
6. **`<CountUp>`** — numbers `01 → 09` or step counters tween when entering view (only for real numbers).
7. **`<Marquee>`** — infinite tracked label strip "ERP · CRM · SOFTWARE · AUTOMATION · LOGISTICS · ASSET RENTAL · WEB · DIGITAL" whose speed and direction react to scroll velocity (`ScrollTrigger` `onUpdate: self.getVelocity()`).
8. **`<DrawLines>`** — SVG network connectors draw with `drawSVG: "0% 100%"` scrubbed; small glowing dots then travel along the paths via `motionPath`.
9. **`<PinnedSteps>`** — pin a section and scrub through steps (Approach 01→09): progress bar fills, active step scales up, others dim to 35%.
10. **`<HorizontalRail>`** — pin + translate x for card rails (Industries, Solutions on desktop): `x: () => -(track.scrollWidth - innerWidth)`, `end: () => "+=" + track.scrollWidth`, `invalidateOnRefresh: true`. Below 768px → native horizontal scroll-snap or vertical stack.
11. **`<TiltCard>`** — 3D tilt on hover (rotateX/Y ±6°, perspective 1000px) + a radial "spotlight" gradient following the cursor (CSS vars `--mx --my`).
12. **`<Cursor>`** — custom cursor: small `ion` dot + lagging ring (gsap.quickTo); grows and shows "View" over cards, hides on touch devices.
13. **`<Preloader>`** — logo blades grow (stagger), count 0→100 tied to real `document.fonts.ready` + hero assets, then a diagonal split wipe reveals the hero. Max 2.2s; skip on repeat visits (sessionStorage) and for reduced motion.
14. **Page transitions** — diagonal navy panel wipes across between routes (use a client `TransitionLink` that plays out-timeline, then `router.push`, then in-timeline). Consider the View Transitions API (`::view-transition` with the diagonal clip-path) as an enhancement.
15. **Scroll progress** — thin `--grad-brand` bar at top + section index "03 / 09" in the nav.
16. **Section colour morph** — when scrolling from dark to light sections, tween `body` background between `navy` and `mist` with a scrubbed ScrollTrigger so the transition feels continuous (instead of hard cuts), while the diagonal edge passes through.

## 4. Choreography principles
- **Hierarchy of arrival:** label → heading lines → brand bar (scaleX from 0, origin left) → body → visuals → CTA. Offsets ~0.12s.
- **One hero moment per section** (a pin, a draw, a morph). Supporting elements use simple reveals.
- **Scrub vs. trigger:** scrub (`scrub: 1`) for spatial storytelling (parallax, progress, drawing); `toggleActions: "play none none reverse"` for content reveals.
- Start positions: `start: "top 80%"` for reveals; `"top top"` for pins.
- Durations: micro 0.2–0.35s · element 0.6–0.9s · hero 1.1–1.6s. Never > 2s for anything that blocks reading.
- Stagger lists 0.05–0.1s; grids use `stagger: { each: 0.06, from: "start", grid: "auto" }`.

## 5. Performance rules
- Animate `transform`/`opacity`/`clip-path` only. No animating `top/left/width/height/box-shadow`. For glows, fade a pre-rendered pseudo-element's opacity.
- `will-change: transform` only during the animation (GSAP handles via `force3D`).
- Use `gsap.quickTo` for pointer-follow effects. Throttle nothing manually — use the ticker.
- Pinned sections: set `anticipatePin: 1`, avoid pinning inside transformed parents.
- Lazy-load heavy sections (`next/dynamic`, `ssr:false` for WebGL) and pause offscreen loops via ScrollTrigger `onToggle` / IntersectionObserver.
- Images: AVIF/WebP via `next/image`, explicit sizes, `priority` only for the hero.
- Test on a throttled mid-range Android profile; target steady 60fps in the Performance panel.

## 6. Reduced motion & a11y
- `prefers-reduced-motion: reduce` → no Lenis, no pin/scrub/horizontal, no parallax, no cursor, no preloader; quick opacity fades only; 3D globe renders a static frame.
- Never hide content permanently behind an animation; content must be readable if JS fails.
- Keep focus order logical in horizontal rails; pinned sections must not trap keyboard users.
- Provide a pause control for any looping motion that lasts > 5s (marquee, globe rotation).

## 7. Common bugs → fixes
- Wrong trigger positions after load → `ScrollTrigger.refresh()` after fonts/images; use function-based values + `invalidateOnRefresh`.
- Double animations in dev → React StrictMode double-mount; `useGSAP` handles cleanup — never create tweens outside it.
- SplitText line breaks wrong on resize → `autoSplit: true` and create the animation inside `onSplit`, returning it.
- Lenis + anchor links → use `lenis.scrollTo(target, { offset: -80 })`.
- Jumping on mobile address-bar resize → `ScrollTrigger.config({ ignoreMobileResize: true })`.
