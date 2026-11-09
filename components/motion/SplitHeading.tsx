"use client";

import { clsx } from "clsx";
import { useRef } from "react";
import { gsap, loadSplitText, useGSAP, MQ } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "h4" | "p" | "div";

/**
 * Masked line-rise heading. Wrap the key phrase in <Accent> for the brochure's two-tone style.
 * `trigger="scroll"` reveals on enter; `trigger="mount"` plays immediately (after `delay`).
 */
export function SplitHeading({
  as: Tag = "h2",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.08,
  duration = 1.1,
  start = "top 85%",
  id,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  trigger?: "scroll" | "mount";
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: `(prefers-reduced-motion: no-preference)`, reduce: MQ.reduce }, (ctx) => {
        if (ctx.conditions?.reduce) {
          gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, scrollTrigger: trigger === "scroll" ? { trigger: el, start } : undefined });
          return;
        }
        let split: { revert: () => void } | null = null;
        let dead = false;
        loadSplitText()
          .then((SplitText) => {
            if (dead) return;
            ctx.add(() => {
              gsap.set(el, { autoAlpha: 1 });
              split = SplitText.create(el, {
                type: "lines,words",
                mask: "lines",
                linesClass: "split-line",
                autoSplit: true,
                onSplit(self) {
                  // Gradient accents need the gradient on each word (transforms break inherited background-clip).
                  self.words.forEach((w) => {
                    if ((w as HTMLElement).closest(".accent-gradient")) w.classList.add("text-gradient");
                  });
                  const tl = gsap.timeline({
                    delay: trigger === "mount" ? delay : 0,
                    scrollTrigger: trigger === "scroll" ? { trigger: el, start, toggleActions: "play none none none" } : undefined,
                  });
                  tl.from(self.lines, { yPercent: 110, duration, stagger, ease: "hevinka" });
                  const grads = el.querySelectorAll(".text-gradient");
                  if (grads.length) {
                    tl.fromTo(grads, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.6, ease: "power2.out" }, "-=0.6");
                  }
                  return tl;
                },
              });
            });
          })
          .catch(() => gsap.set(el, { autoAlpha: 1 })); // never leave the heading hidden
        return () => {
          dead = true;
          split?.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={clsx("reveal", className)}>
      {children}
    </Tag>
  );
}

/** Accent phrase in a two-tone heading. Solid electric (dark) / royal (light) by default; `gradient` for the animated sweep. */
export function Accent({ children, gradient = false }: { children: React.ReactNode; gradient?: boolean }) {
  return <span className={clsx(gradient ? "accent-gradient" : "text-[var(--accent,var(--color-electric))]")}>{children}</span>;
}
