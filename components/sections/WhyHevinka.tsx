"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { useRef } from "react";
import { why } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

/** Small tilted glass widgets (decorative) — echo the brochure's floating dashboard panels. */
function GlassCollage() {
  return (
    <div aria-hidden className="relative mt-14 hidden h-[340px] [perspective:1200px] lg:block">
      <div className="why-layer absolute left-0 top-0 w-[54%] [transform:rotateY(18deg)_rotateX(6deg)]" data-speed="-6">
        <div className="glass rounded-card p-4">
          <p className="label !text-[9px] text-haze">Business units</p>
          <div className="mt-3 flex h-24 items-end gap-2">
            {[62, 48, 34, 26, 18].map((h, i) => (
              <span key={i} className="flex-1 rounded-t-[3px] [background:var(--grad-brand)]" style={{ height: `${h + 30}%` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="why-layer absolute right-0 top-[6%] w-[36%] [transform:rotateY(-14deg)_rotateX(8deg)]" data-speed="-14">
        <div className="glass grid place-items-center rounded-card p-4">
          <svg viewBox="0 0 42 42" className="size-24 -rotate-90">
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="5" />
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="#00a8fc" strokeWidth="5" pathLength={100} strokeDasharray="38 62" />
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="#0b5bd3" strokeWidth="5" pathLength={100} strokeDasharray="26 74" strokeDashoffset={-39} />
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="#7fe3ff" strokeWidth="5" pathLength={100} strokeDasharray="18 82" strokeDashoffset={-66} />
          </svg>
        </div>
      </div>
      <div className="why-layer absolute left-[20%] top-[54%] w-[62%] [transform:rotateY(10deg)_rotateX(10deg)]" data-speed="-22">
        <div className="glass rounded-card p-4">
          <svg viewBox="0 0 200 60" className="w-full">
            <path d="M0 50 L25 42 L50 46 L75 30 L100 34 L125 20 L150 24 L175 10 L200 14" fill="none" stroke="#7fe3ff" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/world-dots.svg" alt="" className="mt-2 w-full opacity-60" />
        </div>
      </div>
    </div>
  );
}

/** §8 — Why HEVINKA (brochure p.5): sticky intro + collage; 7 differentiators as stacking glass cards. */
export function WhyHevinka() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // Stacking: each card shrinks and dims as the next one slides over it.
        const cards = gsap.utils.toArray<HTMLElement>(".why-card");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector(".why-inner"), {
            scale: 0.92,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: `top ${110 + (i + 1) * 14}px`, scrub: true },
          });
          gsap.to(card.querySelector(".why-dim"), {
            opacity: 0.6,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 70%", end: `top ${110 + (i + 1) * 14}px`, scrub: true },
          });
        });
        // Collage depth layers.
        gsap.utils.toArray<HTMLElement>(".why-layer").forEach((l) => {
          gsap.to(l, { yPercent: Number(l.dataset.speed), ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
        // Icons glow on arrival.
        cards.forEach((card) =>
          gsap.from(card.querySelector(".why-ring"), { scale: 0.6, autoAlpha: 0, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none none" } }),
        );
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".why-card").forEach((card) =>
          gsap.from(card, { y: 40, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="abyss" cut="left" label="Why HEVINKA" className="pb-28 md:pb-40">
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-[60%] w-[60%] [background:radial-gradient(50%_50%_at_20%_20%,rgb(11_91_211/0.25),transparent_70%)]" />
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="The differentiators" title={why.title} intro={why.intro} size="display" introClassName="text-white/80" />
            <GlassCollage />
          </div>

          <ol className="flex flex-col gap-5 lg:gap-6 lg:pb-[20vh]">
            {why.items.map((item, i) => (
              <li key={item.title} className="why-card lg:sticky" style={{ top: `calc(var(--nav-h) + 2rem + ${i * 14}px)` }}>
                <div className="why-inner relative origin-top overflow-hidden rounded-card border border-electric/25 bg-midnight/90 p-6 shadow-card-dark backdrop-blur-xl sm:p-8">
                  <span aria-hidden className="pointer-events-none absolute inset-0 [background:linear-gradient(120deg,rgb(0_168_252/0.08),transparent_45%)]" />
                  <div className="relative flex items-start gap-5 sm:items-center sm:gap-7">
                    <span className="why-ring grid size-16 shrink-0 place-items-center rounded-full border-2 border-electric/70 text-ion shadow-[0_0_28px_rgb(0_168_252/0.45),inset_0_0_16px_rgb(0_168_252/0.3)] sm:size-20">
                      <Icon name={item.icon!} size={30} />
                    </span>
                    <span className="hidden font-display text-4xl font-bold text-electric sm:block">{String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden className="hidden h-14 w-px bg-white/15 sm:block" />
                    <div>
                      <h3 className="font-display text-lg font-bold sm:text-xl">
                        <span className="mr-2 font-mono text-sm text-electric sm:hidden">{String(i + 1).padStart(2, "0")}</span>
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-white/75">{item.text}</p>
                    </div>
                  </div>
                  <span aria-hidden className="why-dim pointer-events-none absolute inset-0 bg-abyss opacity-0" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
