"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { useRef } from "react";
import { approach } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

const LAST = approach.steps.length - 1;

/** Brochure p.6 chevron tile with a number badge. */
function Tile({ i, compact = false }: { i: number; compact?: boolean }) {
  const s = approach.steps[i];
  return (
    <div className={clsx("relative shrink-0", compact ? "w-24" : "w-full")}>
      <span className="ap-badge absolute -top-4 left-1/2 z-[1] grid size-9 -translate-x-1/2 place-items-center rounded-full bg-royal font-mono text-xs font-medium text-white shadow-[0_0_16px_rgb(0_168_252/0.5)] ring-2 ring-navy">
        {String(i + 1).padStart(2, "0")}
      </span>
      <div className="ap-chev relative aspect-[1/1.05] bg-electric/50 [clip-path:polygon(0_0,calc(100%-18%)_0,100%_50%,calc(100%-18%)_100%,0_100%,18%_50%)]">
        <div className="absolute inset-[1.5px] grid place-items-center bg-midnight [clip-path:polygon(0_0,calc(100%-18%)_0,100%_50%,calc(100%-18%)_100%,0_100%,18%_50%)] [background-image:linear-gradient(160deg,rgb(11_91_211/0.55),rgb(4_34_76/0.9))]">
          <span className="ap-icon pl-[6%] text-white">
            <Icon name={s.icon!} size={compact ? 30 : 52} />
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * §9 — Our Approach, 9 steps. Desktop: pinned horizontal rail; a gradient progress line fills, the current
 * step lifts and glows while the others dim, and the closing line arrives at the end.
 * Mobile / reduced motion: vertical stepper with a growing line.
 */
export function ApproachRail() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const track = root.current!.querySelector<HTMLElement>(".ap-track")!;
        const steps = gsap.utils.toArray<HTMLElement>(".ap-step");
        const distance = () => track.scrollWidth - window.innerWidth + 120;
        let current = -1;
        const setActive = (i: number) => {
          if (i === current) return;
          current = i;
          steps.forEach((el, k) => el.classList.toggle("is-active", k === i));
        };
        setActive(0);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".ap-stage",
            start: "top top",
            end: () => "+=" + distance() * 1.15,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(LAST, Math.round(self.progress * 1.05 * LAST))),
          },
        });
        tl.to(track, { x: () => -distance(), duration: 1 }, 0)
          .fromTo(".ap-fill", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
          .fromTo(".ap-closing", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.86);
        gsap.from(".ap-step", { y: 60, autoAlpha: 0, duration: 0.9, stagger: 0.06, scrollTrigger: { trigger: ".ap-stage", start: "top 70%", toggleActions: "play none none none" } });
      });
      mm.add(MQ.mobile, () => {
        gsap.fromTo(".ap-vfill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".ap-vlist", start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
        gsap.utils.toArray<HTMLElement>(".ap-vstep").forEach((el) =>
          gsap.from(el, { x: 30, autoAlpha: 0, duration: 0.7, scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="night" cut="right" morph label="Approach" className="overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/world-dots.svg" alt="" aria-hidden className="pointer-events-none absolute right-[-6%] top-[4%] w-[58%] max-w-none opacity-25" />

      {/* ===== Desktop: pinned rail ===== */}
      <div className="ap-stage relative hidden h-svh min-h-[680px] flex-col justify-center gap-14 md:flex">
        <Container>
          <SectionHeading eyebrow="How we work" title={approach.title} intro={approach.intro} breakAccent={false} introClassName="text-white/80" />
        </Container>
        <div className="relative">
          <ol className="ap-track flex w-max gap-6 pl-[max(3.5rem,calc((100vw-1440px)/2+3.5rem))] pr-24 will-change-transform">
            {approach.steps.map((s, i) => (
              <li key={s.title} className="ap-step group/step w-[clamp(150px,13vw,200px)] pt-4">
                <div className="transition-[transform,opacity,filter] duration-700 ease-[var(--ease-expo)] [.ap-step:not(.is-active)_&]:opacity-35 [.ap-step.is-active_&]:-translate-y-3 [.ap-step.is-active_&]:drop-shadow-[0_0_24px_rgb(0_168_252/0.55)]">
                  <Tile i={i} />
                </div>
                <div className="mt-6 transition-opacity duration-700 [.ap-step:not(.is-active)_&]:opacity-35">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-electric">{s.title}</p>
                  <span className="mt-2 block h-0.5 w-8 bg-electric/60" />
                  <p className="mt-3 text-[0.95rem] leading-snug text-white/80">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mx-auto mt-10 max-w-[1440px] px-14">
            <div className="relative h-[2px] rounded-full bg-white/10">
              <span className="ap-fill absolute inset-0 origin-left rounded-full [background:var(--grad-brand)]" />
            </div>
          </div>
        </div>
        <Container>
          <p className="ap-closing max-w-2xl border-l-2 border-electric pl-5 text-white/85">{approach.closing}</p>
        </Container>
      </div>

      {/* ===== Mobile: vertical stepper ===== */}
      <div className="pb-24 md:hidden">
        <Container>
          <SectionHeading eyebrow="How we work" title={approach.title} intro={approach.intro} breakAccent={false} introClassName="text-white/80" />
          <ol className="ap-vlist relative mt-12 flex flex-col gap-9">
            <span aria-hidden className="absolute bottom-6 left-12 top-6 w-[2px] bg-white/10" />
            <span aria-hidden className="ap-vfill absolute bottom-6 left-12 top-6 w-[2px] origin-top [background:var(--grad-brand)]" />
            {approach.steps.map((s, i) => (
              <li key={s.title} className="ap-vstep relative flex items-center gap-6">
                <Tile i={i} compact />
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-electric">{s.title}</p>
                  <p className="mt-1 text-white/80">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Reveal as="p" className="mt-12 border-l-2 border-electric pl-5 text-white/85">
            {approach.closing}
          </Reveal>
        </Container>
      </div>
    </Section>
  );
}
