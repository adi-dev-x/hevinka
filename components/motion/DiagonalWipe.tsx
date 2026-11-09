"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

// The brand's chevron cut in motion: a slanted leading edge sweeps across to reveal the media.
const FROM = {
  left: "polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)",
  right: "polygon(100% 0%, 130% 0%, 100% 100%, 100% 100%)",
  up: "polygon(0% 100%, 100% 130%, 100% 100%, 0% 100%)",
} as const;
const TO = {
  left: "polygon(0% 0%, 130% 0%, 100% 100%, 0% 100%)",
  right: "polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)",
  up: "polygon(0% -30%, 100% 0%, 100% 100%, 0% 100%)",
} as const;

export function DiagonalWipe({
  children,
  className,
  direction = "left",
  trigger = "scroll",
  delay = 0,
  duration = 1.3,
  zoom = true,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: keyof typeof FROM;
  trigger?: "scroll" | "mount";
  delay?: number;
  duration?: number;
  /** Inner media settles from 1.18 → 1 for depth. */
  zoom?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const inner = el.firstElementChild;
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce }, (ctx) => {
        const st = trigger === "scroll" ? { trigger: el, start: "top 80%", toggleActions: "play none none none" } : undefined;
        if (ctx.conditions?.reduce) {
          gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, scrollTrigger: st });
          return;
        }
        const tl = gsap.timeline({ delay, scrollTrigger: st });
        tl.set(el, { autoAlpha: 1 })
          .fromTo(el, { clipPath: FROM[direction] }, { clipPath: TO[direction], duration, ease: "expo.inOut", clearProps: "clipPath" });
        if (zoom && inner) tl.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: duration + 0.4, ease: "hevinka" }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={clsx("reveal overflow-hidden", className)}>
      {children}
    </div>
  );
}
