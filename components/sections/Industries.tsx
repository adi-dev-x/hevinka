"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { industries } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/motion/TransitionLink";

/**
 * §10 — Industries (brochure p.4). Rows reveal with lines drawing beneath; hovering a row floats a
 * blue-duotone preview that follows the cursor. Mobile: two-column icon grid.
 * TODO(content): the preview uses a branded icon panel — swap in real industry photography when supplied.
 */
export function Industries() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)" }, (c) => {
        gsap.utils.toArray<HTMLElement>(".ind-row").forEach((row, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none none" }, delay: (i % 2) * 0.08 });
          tl.from(row.querySelector(".ind-content"), { y: 26, autoAlpha: 0, duration: 0.7 }).from(row.querySelector(".ind-line"), { scaleX: 0, duration: 1, ease: "expo.inOut" }, 0.1);
        });
        // Scroll-linked: the decorative map drifts against the list.
        gsap.fromTo(".ind-map", { yPercent: 12 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });

        if (!c.conditions?.desktop || !preview.current) return;
        const xTo = gsap.quickTo(preview.current, "x", { duration: 0.55, ease: "power3" });
        const yTo = gsap.quickTo(preview.current, "y", { duration: 0.55, ease: "power3" });
        const move = (e: PointerEvent) => {
          xTo(e.clientX + 28);
          yTo(e.clientY - 120);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  const current = hover === null ? null : industries.items[hover];

  return (
    <Section ref={root} tone="mist" cut="left" morph label="Industries" className="overflow-hidden pb-28 md:pb-40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/world-dots.svg" alt="" aria-hidden className="ind-map pointer-events-none absolute -right-[16%] top-[10%] w-[66%] max-w-none opacity-[0.12]" />
      <Container className="relative">
        <SectionHeading eyebrow="Industries" title={industries.title} intro={industries.intro} introClassName="text-slate !opacity-100" />

        {/* desktop/tablet list */}
        <ul className="mt-16 hidden gap-x-16 md:grid md:grid-cols-2" onPointerLeave={() => setHover(null)}>
          {industries.items.map((it, i) => (
            <li key={it.title} className="ind-row relative" onPointerEnter={() => setHover(i)}>
              <TransitionLink href="/industries" className="ind-content group/ind flex items-center gap-6 py-6" data-cursor="View">
                <span className="w-8 font-mono text-xs text-royal">{String(i + 1).padStart(2, "0")}</span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-royal shadow-card-light ring-1 ring-royal/15 transition-colors duration-500 group-hover/ind:bg-royal group-hover/ind:text-white">
                  <Icon name={it.icon} size={22} />
                </span>
                <span className="flex-1 font-display text-xl font-semibold text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover/ind:translate-x-2 lg:text-2xl">{it.title}</span>
                <ArrowRight aria-hidden size={20} strokeWidth={1.5} className="-translate-x-3 text-royal opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover/ind:translate-x-0 group-hover/ind:opacity-100" />
              </TransitionLink>
              <span aria-hidden className="ind-line absolute inset-x-0 bottom-0 h-px origin-left bg-ink/12" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-expo)] [background:var(--grad-brand)] [.ind-row:hover_&]:scale-x-100" />
            </li>
          ))}
        </ul>

        {/* mobile grid */}
        <ul className="mt-12 grid grid-cols-2 gap-3 md:hidden">
          {industries.items.map((it) => (
            <li key={it.title} className="ind-row">
              <div className="ind-content flex h-full flex-col items-center gap-3 rounded-card bg-white p-5 text-center shadow-card-light">
                <span className="grid size-12 place-items-center rounded-full bg-royal/10 text-royal">
                  <Icon name={it.icon} size={22} />
                </span>
                <span className="font-display text-sm font-semibold leading-tight text-ink">{it.title}</span>
              </div>
              <span className="ind-line hidden" />
            </li>
          ))}
        </ul>
      </Container>

      {/* Floating preview (desktop, fine pointer) */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block"
        style={{ opacity: current ? 1 : 0, transition: "opacity .35s var(--ease-expo)" }}
      >
        <div
          className="relative h-[220px] w-[300px] overflow-hidden rounded-frame shadow-[0_30px_60px_-20px_rgb(0_28_61/0.55)] transition-transform duration-500 ease-[var(--ease-expo)] [clip-path:polygon(14%_0,100%_0,100%_86%,86%_100%,0_100%,0_14%)] [background:var(--grad-night)]"
          style={{ transform: current ? "scale(1) rotate(-3deg)" : "scale(0.85) rotate(0deg)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/world-dots.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <span className="absolute inset-0 bg-royal mix-blend-multiply opacity-40" />
          {current && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
              <span className="grid size-20 place-items-center rounded-full border border-ion/60 text-ion shadow-[0_0_40px_rgb(0_168_252/0.5)]">
                <Icon name={current.icon} size={40} />
              </span>
              <span className="max-w-[80%] font-display text-base font-semibold text-white">{current.title}</span>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
