"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";


const TONES = {
  abyss: "bg-abyss text-white [--accent:var(--color-electric)]",
  navy: "bg-navy text-white [--accent:var(--color-electric)]",
  night: "text-white [background:var(--grad-night)] [--accent:var(--color-electric)]",
  mist: "bg-mist text-ink [--accent:var(--color-royal)]",
  white: "bg-white text-ink [--accent:var(--color-royal)]",
} as const;

/**
 * Page section with the brand's diagonal cut on its TOP edge (later sections paint over earlier ones,
 * so cuts chain cleanly). `cut="left"` slopes down to the left, `cut="right"` down to the right.
 * With `animateCut`, the slope eases flatter as the section scrolls in (±2° feel).
 * With `morph`, the section arrives tinted in the brand blue family (sky for light sections, cobalt for
 * dark ones) and settles to its own tone while the diagonal edge passes — a continuous colour shift
 * that never passes through grey. Opacity-only overlay, so it stays on the compositor.
 */
export function Section({
  children,
  className,
  tone = "navy",
  cut = "none",
  animateCut = true,
  morph = false,
  id,
  label,
  as: Tag = "section",
  ref: outerRef,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  tone?: keyof typeof TONES;
  cut?: "left" | "right" | "none";
  animateCut?: boolean;
  morph?: boolean;
  id?: string;
  /** Name used by the nav section index. */
  label?: string;
  as?: "section" | "div" | "footer";
  /** Callers' own ref (e.g. a useGSAP scope) — merged with the internal one. */
  ref?: React.Ref<HTMLElement>;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const setRef = (el: HTMLElement | null) => {
    ref.current = el;
    if (typeof outerRef === "function") outerRef(el);
    else if (outerRef) (outerRef as React.RefObject<HTMLElement | null>).current = el;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        if (morph) {
          gsap.fromTo(
            ".section-morph",
            { opacity: 1 },
            { opacity: 0, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 72%", scrub: true } },
          );
        }
        if (cut === "none" || !animateCut) return;
        gsap.fromTo(
          ref.current,
          { "--cut-k": 1.35 },
          {
            "--cut-k": 0.75,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 30%", scrub: true },
          },
        );
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: ref, dependencies: [cut, animateCut, morph] },
  );

  const clip =
    cut === "left"
      ? "[clip-path:polygon(0_calc(var(--cut)*var(--cut-k,1)),100%_0,100%_100%,0_100%)]"
      : cut === "right"
        ? "[clip-path:polygon(0_0,100%_calc(var(--cut)*var(--cut-k,1)),100%_100%,0_100%)]"
        : "";

  return (
    <Tag
      ref={setRef as React.Ref<never>}
      id={id}
      data-section={label}
      className={clsx(
        "relative isolate",
        TONES[tone],
        // Overlap equals the deepest animated cut, so the slope never exposes the page background.
        cut !== "none" && ["-mt-[calc(var(--cut)*1.35)] pt-[calc(var(--cut)*1.6)]", clip],
        className,
      )}
      {...rest}
    >
      {morph && (
        <div
          aria-hidden
          className={clsx("section-morph pointer-events-none absolute inset-0 -z-10 opacity-0", tone === "mist" || tone === "white" ? "bg-sky/70" : "bg-cobalt")}
        />
      )}
      {children}
    </Tag>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14", className)}>{children}</div>;
}
