"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** Counts 0 → `to` on enter. Only for real numbers (step indices etc.) — never invented stats. */
export function CountUp({
  to,
  pad = 2,
  duration = 1.2,
  className,
}: {
  to: number;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => String(Math.round(n)).padStart(pad, "0");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" },
          onUpdate: () => {
            if (ref.current) ref.current.textContent = format(obj.v);
          },
        });
        return () => {
          if (ref.current) ref.current.textContent = format(to);
        };
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: ref, dependencies: [to] },
  );

  // Server-rendered with the final value so it's correct without JS.
  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
