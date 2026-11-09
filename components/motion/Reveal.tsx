"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * Fade-up reveal. With `stagger`, animates direct children in sequence (lists, grids);
 * otherwise animates itself.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  y = 40,
  delay = 0,
  duration = 0.8,
  stagger,
  start = "top 85%",
  ...rest
}: {
  as?: "div" | "section" | "ul" | "ol" | "li" | "p" | "span" | "article" | "header" | "footer";
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? Array.from(el.children) : [el];
      if (stagger) gsap.set(el, { autoAlpha: 1 });
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce }, (ctx) => {
        const reduce = ctx.conditions?.reduce;
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: reduce ? 0 : y },
          {
            autoAlpha: 1,
            y: 0,
            delay,
            duration: reduce ? 0.4 : duration,
            stagger: stagger ? { each: stagger, from: "start" } : 0,
            ease: "hevinka",
            scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.RefObject<never>} className={clsx(!stagger && "reveal", stagger && "reveal [&>*]:will-change-transform", className)} {...rest}>
      {children}
    </Tag>
  );
}
