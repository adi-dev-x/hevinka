"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Pulls its child toward the cursor (fine pointers, motion allowed). */
export function Magnetic({
  children,
  className,
  strength = 0.3,
  max = 12,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  max?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
        const clamp = gsap.utils.clamp(-max, max);
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(clamp((e.clientX - (r.left + r.width / 2)) * strength));
          yTo(clamp((e.clientY - (r.top + r.height / 2)) * strength));
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref, dependencies: [strength, max] },
  );

  return (
    <span ref={ref} className={clsx("inline-flex will-change-transform", className)}>
      {children}
    </span>
  );
}
