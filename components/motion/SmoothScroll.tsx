"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { onSiteReady } from "@/lib/ready";

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance — null on touch-only/reduced-motion (native scroll). */
export const useLenis = () => useContext(LenisContext);

/** Scroll to an element or y, via Lenis when active. */
export function scrollToTarget(lenis: Lenis | null, target: string | number | HTMLElement, immediate = false) {
  const offset = -80;
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : offset, immediate, duration: 1.4 });
    return;
  }
  const reduce = window.matchMedia(MQ.reduce).matches;
  const behavior: ScrollBehavior = immediate || reduce ? "auto" : "smooth";
  if (typeof target === "number") return window.scrollTo({ top: target, behavior });
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    const mql = window.matchMedia(MQ.reduce);
    let instance: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    let offReady = () => {};

    const start = () => {
      if (mql.matches || instance) return;
      instance = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
      instance.on("scroll", ScrollTrigger.update);
      tick = (t: number) => instance?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Hold scroll while the preloader plays.
      if (document.documentElement.classList.contains("preload")) {
        instance.stop();
        offReady = onSiteReady(() => instance?.start());
      }
      setLenis(instance);
    };
    const stop = () => {
      offReady();
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      tick = null;
      setLenis(null);
    };
    const onChange = () => (mql.matches ? stop() : start());

    start();
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("load", refresh);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
