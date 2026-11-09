"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * 3D tilt (±6°) with a cursor-following spotlight. Fine pointers only; flat for touch/reduced motion.
 * Pass `tone="light"` on mist sections so the spotlight uses royal instead of electric.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  tone = "dark",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  tone?: "dark" | "light";
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { transformPerspective: 1000 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          rx((0.5 - y) * 2 * max);
          ry((x - 0.5) * 2 * max);
          el.style.setProperty("--mx", `${x * 100}%`);
          el.style.setProperty("--my", `${y * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref, dependencies: [max] },
  );

  return (
    <div
      ref={ref}
      {...rest}
      data-cursor="View"
      className={clsx("tilt-card group/tilt relative isolate [transform-style:preserve-3d]", className)}
    >
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100",
          tone === "dark"
            ? "[background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(0_168_252/0.16),transparent_60%)]"
            : "[background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(11_91_211/0.10),transparent_60%)]",
        )}
      />
      {children}
    </div>
  );
}
