"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Ion dot + lagging ring. Grows over links/buttons; shows a label over `[data-cursor="Label"]`.
 * Only on fine pointers with motion allowed.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const sync = () => setEnabled(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const d = dot.current;
    const r = ring.current;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });
    let mode = "";

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      gsap.to([d, r], { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], input, select, textarea, label");
      const next = labelled ? `label:${labelled.dataset.cursor}` : interactive ? "hover" : "";
      if (next === mode) return;
      mode = next;
      setLabel(labelled?.dataset.cursor ?? "");
      gsap.to(r, {
        scale: labelled ? 2.4 : interactive ? 1.6 : 1,
        backgroundColor: labelled ? "rgba(0,168,252,0.9)" : "rgba(0,168,252,0)",
        borderColor: labelled ? "rgba(0,168,252,0)" : "rgba(127,227,255,0.6)",
        duration: 0.4,
        ease: "hevinka",
      });
      gsap.to(d, { scale: labelled || interactive ? 0 : 1, duration: 0.25 });
    };
    const leave = () => gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
    const down = () => gsap.to(r, { scale: "-=0.25", duration: 0.15 });
    const up = () => gsap.to(r, { scale: "+=0.25", duration: 0.25 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      gsap.killTweensOf([d, r]);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300]">
      <div
        ref={ring}
        className="fixed left-0 top-0 grid size-10 place-items-center rounded-full border border-ion/60 will-change-transform"
      >
        <span className="font-mono text-[5px] font-medium uppercase tracking-[0.2em] text-abyss">{label}</span>
      </div>
      <div ref={dot} className="fixed left-0 top-0 size-1.5 rounded-full bg-ion shadow-[0_0_12px_#7fe3ff] will-change-transform" />
    </div>
  );
}
