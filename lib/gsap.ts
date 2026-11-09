"use client";

// Single place that registers GSAP plugins. Import gsap from here, never from "gsap" directly.
// Only plugins needed at first paint are registered here (JS budget). Plugins used only below the fold
// load on demand: `loadSplitText()`, `loadMotionPath()`, `loadFlip()`, `loadMorphSVG()` (cached promises).
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP as useGSAPBase } from "@gsap/react";
import { createContext, useContext, useEffect, useState } from "react";

gsap.registerPlugin(useGSAPBase, ScrollTrigger, DrawSVGPlugin);

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

/**
 * Motion gate: inside a <DeferMotion> boundary, animation setup waits until the section is near the
 * viewport (or the browser is idle), so the page doesn't build every tween/ScrollTrigger during hydration.
 */
export type MotionGate = { open: boolean; subscribe: (cb: () => void) => () => void; release: () => void };
export const MotionGateContext = createContext<MotionGate | null>(null);

type GSAPConfig = { scope?: React.RefObject<Element | null> | Element | string; dependencies?: unknown[]; revertOnUpdate?: boolean };
type ContextFunc = Extract<Parameters<typeof useGSAPBase>[0], (...args: never[]) => unknown>;

/** useGSAP from @gsap/react, gated by the nearest <DeferMotion> (runs immediately when there is none). */
function useGSAP(fn: ContextFunc, config: GSAPConfig = {}) {
  const gate = useContext(MotionGateContext);
  const [released, setReleased] = useState(false);
  const open = !gate || gate.open || released;
  useEffect(() => {
    if (!gate || gate.open) return;
    return gate.subscribe(() => setReleased(true));
  }, [gate]);
  return useGSAPBase(
    (context, contextSafe) => {
      if (open) return fn(context, contextSafe);
    },
    { ...config, dependencies: [...(config.dependencies ?? []), open] } as Parameters<typeof useGSAPBase>[1],
  );
}

export { gsap, ScrollTrigger, DrawSVGPlugin, useGSAP };

// QA hook: `?debug-motion` exposes ScrollTrigger for inspecting trigger positions in production builds.
if (typeof window !== "undefined" && window.location.search.includes("debug-motion")) {
  (window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
}
