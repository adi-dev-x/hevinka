"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { useRef } from "react";
import { platform } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { LazyDashboard as Dashboard } from "@/components/visuals/lazy";

const LEFT = platform.modules.slice(0, 4);
const RIGHT = platform.modules.slice(4, 8);
const BOTTOM = platform.modules.slice(8);

function Chip({ m, side }: { m: (typeof platform.modules)[number]; side: "left" | "right" | "bottom" }) {
  return (
    <li className={clsx("pf-chip relative", `pf-chip-${side}`)}>
      <div className="group/chip relative z-[1] flex h-full flex-col items-center justify-center gap-2 rounded-card border border-ink/10 bg-white px-3 py-4 text-center shadow-card-light transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)] hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgb(11_91_211/0.45)]">
        <span className="grid size-11 place-items-center rounded-full bg-royal/10 text-royal transition-colors duration-500 group-hover/chip:bg-royal group-hover/chip:text-white">
          <Icon name={m.icon} size={22} />
        </span>
        <span className="font-display text-[12.5px] font-semibold leading-tight text-ink">{m.title}</span>
      </div>
      {/* Connector wire toward the laptop with a travelling pulse (desktop) */}
      <span
        aria-hidden
        className={clsx(
          "pf-wire absolute hidden overflow-hidden lg:block",
          side === "left" && "left-full top-1/2 h-px w-[var(--gap)] origin-left bg-royal/30",
          side === "right" && "right-full top-1/2 h-px w-[var(--gap)] origin-right bg-royal/30",
          side === "bottom" && "bottom-full left-1/2 h-[var(--gap-y)] w-px origin-bottom bg-royal/30",
        )}
      >
        <span className={clsx("pf-pulse absolute block", side === "bottom" ? "inset-x-0 h-full" : "inset-y-0 w-full", `pf-pulse-${side}`)}>
          <span className={clsx("absolute size-1.5 rounded-full bg-electric shadow-[0_0_8px_#00a8fc]", side === "left" && "right-0 -top-[2.5px]", side === "right" && "left-0 -top-[2.5px]", side === "bottom" && "top-0 -left-[2.5px]")} />
        </span>
      </span>
    </li>
  );
}

/** §6 — A Unified Platform for Greater Possibilities (brochure p.8). */
export function Platform() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)", motion: "(prefers-reduced-motion: no-preference)" }, (c) => {
        // Scroll-linked: the laptop lid opens as the section enters.
        gsap.fromTo(
          ".pf-lid",
          { rotationX: -82, transformPerspective: 1600, transformOrigin: "50% 100%" },
          { rotationX: 0, ease: "power1.out", scrollTrigger: { trigger: ".pf-laptop", start: "top 92%", end: "top 30%", scrub: 0.8 } },
        );
        gsap.fromTo(".pf-screen-glow", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: ".pf-laptop", start: "top 60%", end: "top 30%", scrub: true } });
        if (!c.conditions?.desktop) return;
        // Chips fly in from their sides, then wires draw toward the laptop.
        const st = { trigger: ".pf-stage", start: "top 70%", toggleActions: "play none none none" };
        gsap.from(".pf-chip-left", { x: -70, autoAlpha: 0, duration: 0.9, stagger: 0.08, scrollTrigger: st });
        gsap.from(".pf-chip-right", { x: 70, autoAlpha: 0, duration: 0.9, stagger: 0.08, scrollTrigger: st });
        gsap.from(".pf-chip-bottom", { y: 60, autoAlpha: 0, duration: 0.9, stagger: 0.06, delay: 0.2, scrollTrigger: st });
        gsap.from(".pf-wire", { scaleX: 0, scaleY: 0, duration: 0.8, stagger: 0.04, delay: 0.6, ease: "power2.out", scrollTrigger: st });
        // Pulses travel along each wire into the laptop.
        gsap.utils.toArray<HTMLElement>(".pf-pulse").forEach((p, i) => {
          const side = p.classList.contains("pf-pulse-left") ? "left" : p.classList.contains("pf-pulse-right") ? "right" : "bottom";
          const from = side === "left" ? { xPercent: -100 } : side === "right" ? { xPercent: 100 } : { yPercent: 100 };
          const to = side === "bottom" ? { yPercent: -10 } : { xPercent: 0 };
          gsap.fromTo(p, from, { ...to, duration: 1.6, ease: "power1.in", repeat: -1, repeatDelay: 1.2 + (i % 4) * 0.35, delay: 1 + i * 0.2 });
        });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="mist" cut="left" label="Platform" className="pb-28 md:pb-36">
      <Container>
        <SectionHeading eyebrow="One connected platform" title={platform.title} intro={platform.intro} align="center" introClassName="text-slate !opacity-100 text-center" />

        <div className="pf-stage mt-16 grid gap-5 [--gap-y:2.5rem] [--gap:2.5rem] lg:grid-cols-[170px_1fr_170px] lg:gap-x-10 lg:gap-y-[var(--gap-y)] xl:grid-cols-[190px_1fr_190px]">
          <ul className="order-2 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:order-1 lg:grid-cols-1 lg:grid-rows-4">
            {LEFT.map((m) => (
              <Chip key={m.title} m={m} side="left" />
            ))}
          </ul>

          {/* Laptop with the live dashboard */}
          <div className="pf-laptop order-1 self-center lg:order-2 [perspective:1600px]">
            <div className="pf-lid relative mx-auto w-[92%] rounded-t-[14px] border border-white/10 bg-[#0b1426] p-[1.4%] pb-[2.4%] shadow-[0_30px_80px_-30px_rgb(0_28_61/0.6)] [transform-style:preserve-3d]">
              <span aria-hidden className="absolute left-1/2 top-[0.6%] size-1 -translate-x-1/2 rounded-full bg-white/20" />
              <div className="relative overflow-hidden rounded-[4px]">
                <Dashboard />
                <span aria-hidden className="pf-screen-glow pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10" />
              </div>
            </div>
            <div aria-hidden className="relative mx-auto h-[14px] w-full rounded-b-[14px] bg-gradient-to-b from-haze to-slate shadow-[0_18px_30px_-12px_rgb(0_28_61/0.45)]">
              <span className="absolute left-1/2 top-0 h-[5px] w-[14%] -translate-x-1/2 rounded-b-md bg-slate/60" />
            </div>
          </div>

          <ul className="order-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1 lg:grid-rows-4">
            {RIGHT.map((m) => (
              <Chip key={m.title} m={m} side="right" />
            ))}
          </ul>

          <ul className="order-4 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:col-span-3 lg:mx-[calc(170px+2.5rem)] lg:grid-cols-5 lg:gap-4 xl:mx-[calc(190px+2.5rem)]">
            {BOTTOM.map((m) => (
              <Chip key={m.title} m={m} side="bottom" />
            ))}
          </ul>
        </div>

        {/* Banner */}
        <div className="pf-banner relative mt-16 overflow-hidden rounded-frame bg-navy px-8 py-10 sm:px-12 md:py-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/world-dots.svg" alt="" aria-hidden className="pointer-events-none absolute -right-[8%] top-1/2 w-[62%] max-w-none -translate-y-1/2 opacity-50" />
          <span aria-hidden className="pointer-events-none absolute right-[18%] top-1/2 size-56 -translate-y-1/2 rounded-full bg-electric/30 blur-3xl" />
          <p className="relative max-w-xl font-display text-[clamp(1.5rem,3vw,2.4rem)] font-semibold leading-tight text-white">
            {platform.banner[0]} <span className="block text-electric">{platform.banner[1]}</span>
          </p>
        </div>
      </Container>
    </Section>
  );
}
