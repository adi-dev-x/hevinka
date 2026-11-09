"use client";

// Single place that registers GSAP plugins. Import gsap from here, never from "gsap" directly.
// Only plugins needed at first paint are registered here (JS budget). Plugins used only below the fold
// load on demand: `loadSplitText()`, `loadMotionPath()`, `loadFlip()`, `loadMorphSVG()` (cached promises).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

// Brand ease: cubic-bezier(0.16, 1, 0.3, 1) ≈ expo.out — aliased so components can say ease: "hevinka".
gsap.registerEase("hevinka", gsap.parseEase("expo.out"));
gsap.defaults({ ease: "hevinka", duration: 0.9 });
ScrollTrigger.config({ ignoreMobileResize: true });

/** Shared matchMedia conditions for every animated component. */
export const MQ = {
  desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

function once<T>(load: () => Promise<T>) {
  let p: Promise<T> | null = null;
  return () => (p ??= load());
}

export const loadSplitText = once(async () => {
  const { SplitText } = await import("gsap/SplitText");
  gsap.registerPlugin(SplitText);
  return SplitText;
});

export const loadMotionPath = once(async () => {
  const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
  gsap.registerPlugin(MotionPathPlugin);
  return MotionPathPlugin;
});

export async function loadFlip() {
  const { Flip } = await import("gsap/Flip");
  gsap.registerPlugin(Flip);
  return Flip;
}

export async function loadMorphSVG() {
  const { MorphSVGPlugin } = await import("gsap/MorphSVGPlugin");
  gsap.registerPlugin(MorphSVGPlugin);
  return MorphSVGPlugin;
}

export { gsap, ScrollTrigger, DrawSVGPlugin, useGSAP };
