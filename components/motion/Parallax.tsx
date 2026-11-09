"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * Scroll-scrubbed depth layer. `speed` is yPercent travelled across the viewport pass:
 * negative moves up faster than the page (foreground), positive lags behind (background).
 * Halved on mobile, off for reduced motion.
 */
export function Parallax({
  children,
  className,
  speed = -20,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const s = ctx.conditions?.desktop ? speed : speed / 2;
        gsap.fromTo(
          ref.current,
          { yPercent: -s / 2 },
          {
            yPercent: s / 2,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={clsx("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
