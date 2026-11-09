"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { markSiteReady } from "@/lib/ready";
import { BLADE_PATHS, MARK_VIEWBOX } from "@/components/ui/Logo";

/**
 * First-visit preloader: logo blades grow one by one, 000 → 100 counter tied to font loading,
 * then the screen splits along a diagonal. ≤ 2.2s. Skipped on repeat visits and for reduced motion
 * (the `preload` class is set by the inline head script).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("preload")) {
        markSiteReady();
        return;
      }

      const done = () => {
        html.classList.remove("preload");
        try {
          sessionStorage.setItem("hv-visited", "1");
        } catch {}
        markSiteReady();
        ScrollTrigger.refresh();
      };

      const progress = { v: 0 };
      const render = () => {
        if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
      };
      const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1100))]);

      const tl = gsap.timeline();
      tl.from(".pl-blade", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, stagger: 0.08, ease: "expo.out" })
        .from(".pl-word", { yPercent: 110, duration: 0.7, ease: "expo.out" }, 0.15)
        .to(progress, { v: 82, duration: 0.95, ease: "power2.inOut", onUpdate: render }, 0)
        .addPause("+=0", () => {
          fonts.then(() => tl.resume());
        })
        .to(progress, { v: 100, duration: 0.3, ease: "power2.out", onUpdate: render })
        .to(".pl-content", { autoAlpha: 0, y: -16, duration: 0.35, ease: "power2.in" }, "+=0.05")
        .to(".pl-a", { xPercent: -100, yPercent: -12, duration: 0.85, ease: "expo.inOut" }, "<0.1")
        .to(".pl-b", { xPercent: 100, yPercent: 12, duration: 0.85, ease: "expo.inOut" }, "<")
        .to(".pl-seam", { scaleX: 0, autoAlpha: 0, duration: 0.4 }, "<")
        .add(done, "-=0.45");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader fixed inset-0 z-[400] hidden overflow-hidden" aria-hidden>
      <div className="pl-a absolute inset-0 bg-abyss [clip-path:polygon(0_0,100%_0,100%_38%,0_62%)] [background:var(--grad-night)]" />
      <div className="pl-b absolute inset-0 bg-abyss [clip-path:polygon(0_62%,100%_38%,100%_100%,0_100%)]" />
      <div className="pl-seam absolute left-0 top-1/2 h-px w-[140vw] -translate-x-[20vw] -rotate-[8deg] bg-gradient-to-r from-transparent via-electric to-transparent opacity-60" />
      <div className="pl-content relative grid h-full place-items-center">
        <div className="flex flex-col items-center gap-6">
          <svg viewBox={MARK_VIEWBOX} className="h-20 w-auto overflow-visible drop-shadow-[0_0_24px_rgba(0,168,252,0.45)]">
            {BLADE_PATHS.map((d, i) => (
              <path key={i} d={d} className="pl-blade" fill="#fff" />
            ))}
          </svg>
          <div className="overflow-hidden">
            <p className="pl-word font-display text-2xl font-bold tracking-[0.3em] text-white">HEVINKA</p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.32em] text-haze">
            <span ref={count}>000</span>
            <span className="h-px w-10 bg-electric/60" />
            <span>India | UAE | Beyond</span>
          </div>
        </div>
      </div>
    </div>
  );
}
