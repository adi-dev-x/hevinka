"use client";

import { clsx } from "clsx";
import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

/**
 * Infinite strip whose speed, direction and skew react to scroll velocity.
 * Has a pause control (WCAG 2.2.2). Static for reduced motion.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  separator = "·",
  speed = 40,
  reverse = false,
  skew = true,
  outline = false,
  label = "Scrolling keywords",
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
  /** Seconds per loop at rest. */
  speed?: number;
  reverse?: boolean;
  skew?: boolean;
  outline?: boolean;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const dir = reverse ? -1 : 1;
        gsap.set(track.current, { xPercent: reverse ? -50 : 0 });
        loop.current = gsap.to(track.current, {
          xPercent: reverse ? 0 : -50,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
        const skewTo = gsap.quickTo(track.current, "skewX", { duration: 0.5, ease: "power3" });
        let base = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            base = self.direction * dir >= 0 ? 1 : -1;
            const boost = 1 + Math.min(Math.abs(v) / 400, 5);
            if (loop.current && !loop.current.paused()) {
              gsap.to(loop.current, { timeScale: base * boost, duration: 0.2, overwrite: true });
              gsap.to(loop.current, { timeScale: base, duration: 1.2, delay: 0.25, ease: "power2.out" });
            }
            if (skew) skewTo(gsap.utils.clamp(-8, 8, -v / 300));
          },
        });
        return () => {
          st.kill();
          loop.current?.kill();
          loop.current = null;
        };
      });
      mm.add(MQ.reduce, () => {
        gsap.set(track.current, { xPercent: 0 });
      });
    },
    { scope: root, dependencies: [speed, reverse] },
  );

  const toggle = () => {
    if (!loop.current) return;
    const next = !paused;
    if (next) loop.current.pause();
    else loop.current.play();
    setPaused(next);
  };

  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={clsx(
              "whitespace-nowrap px-[0.5em]",
              outline && "text-transparent [-webkit-text-stroke:1px_var(--color-electric)]",
              itemClassName,
            )}
          >
            {item}
          </span>
          <span className="px-[0.25em] text-electric" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} className={clsx("group relative overflow-hidden", className)} role="region" aria-label={label}>
      <div ref={track} className="flex w-max will-change-transform">
        {row(false)}
        {row(true)}
      </div>
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-abyss/70 text-white/70 opacity-0 backdrop-blur transition-opacity hover:text-white focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:hidden"
        aria-label={paused ? "Play scrolling text" : "Pause scrolling text"}
        aria-pressed={paused}
      >
        {paused ? <Play size={14} strokeWidth={1.5} /> : <Pause size={14} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
