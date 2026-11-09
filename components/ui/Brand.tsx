"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** 64×4 gradient underline that pairs with every heading; grows from the left on enter. */
export function BrandBar({ className, trigger = "scroll", delay = 0.25 }: { className?: string; trigger?: "scroll" | "mount"; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          scaleX: 0,
          transformOrigin: "0% 50%",
          duration: 0.9,
          delay,
          ease: "hevinka",
          scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 90%", toggleActions: "play none none none" } : undefined,
        });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: ref },
  );
  return <span ref={ref} aria-hidden className={clsx("brand-bar", className)} />;
}

/** Tracked micro-label stack, e.g. PEOPLE / TECHNOLOGY / POSSIBILITIES (brochure corners). */
export function LabelStack({
  items,
  className,
  inline = false,
  bar = true,
}: {
  items: readonly string[];
  className?: string;
  inline?: boolean;
  bar?: boolean;
}) {
  return (
    <div className={clsx("label", className)}>
      {inline ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {items.map((t, i) => (
            <span key={t} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="h-3 w-px bg-current opacity-40" />}
              {t}
            </span>
          ))}
        </p>
      ) : (
        <p className="flex flex-col">
          {items.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </p>
      )}
      {bar && <span aria-hidden className="mt-3 block h-[3px] w-12 rounded-full bg-electric" />}
    </div>
  );
}

/** Small tracked eyebrow above headings. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("label text-[var(--accent,var(--color-electric))]", className)}>{children}</p>;
}
