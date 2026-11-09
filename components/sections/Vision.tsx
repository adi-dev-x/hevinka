"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import { company, vision } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LabelStack } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { CountUp } from "@/components/motion/CountUp";

const TAB = { navy: "bg-navy", royal: "bg-royal", sky: "bg-sky" } as const;

/** §3 — Vision · Mission · Core Philosophy chevron-tab cards + the Connected Operating Model (brochure p.2). */
export function Vision() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduce: MQ.reduce }, (c) => {
        const { desktop, reduce } = c.conditions!;
        if (reduce) return;

        // Cards: tab arrives first, then the panel unfolds, icon strokes draw, number counts.
        gsap.utils.toArray<HTMLElement>(".vis-card").forEach((card) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" } });
          tl.from(card.querySelector(".vis-tab"), { xPercent: 70, autoAlpha: 0, duration: 0.8 })
            .from(card.querySelector(".vis-panel"), { clipPath: "inset(0 100% 0 0)", duration: 0.9, ease: "expo.inOut" }, "-=0.35")
            .from(card.querySelectorAll(".vis-tab svg > *"), { drawSVG: "0%", duration: 1.1, stagger: 0.05, ease: "power2.inOut" }, 0.2)
            .from(card.querySelector(".vis-num"), { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.6");
        });

        // Operating model: the connector line fills with scroll; each node lights as the line reaches it.
        const nodes = gsap.utils.toArray<HTMLElement>(".om-node");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".om-list", start: "top 72%", end: "bottom 55%", scrub: 0.6 },
        });
        tl.fromTo(".om-fill", desktop ? { scaleX: 0 } : { scaleY: 0 }, desktop ? { scaleX: 1, duration: 1 } : { scaleY: 1, duration: 1 }, 0);
        nodes.forEach((n, i) => {
          const at = (i / (nodes.length - 1)) * 0.96;
          tl.to(n.querySelector(".om-glow"), { opacity: 1, scale: 1, duration: 0.06 }, at)
            .to(n.querySelector(".om-icon"), { color: "#ffffff", duration: 0.06 }, at)
            .fromTo(n.querySelector(".om-text"), { autoAlpha: 0.35 }, { autoAlpha: 1, duration: 0.06 }, at);
        });
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="mist" cut="right" morph label="Vision" className="pb-32 md:pb-44">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <LabelStack items={company.microLabels.buildingSmarter} className="mb-10 text-slate" />
            <SectionHeading eyebrow="Vision & approach" title={vision.title} intro={vision.intro} size="display" introClassName="text-slate !opacity-100" />
          </div>

          <ul className="flex flex-col gap-5">
            {vision.cards.map((c) => (
              <li key={c.key} className="vis-card flex min-h-36 overflow-hidden rounded-card bg-white shadow-card-light ring-1 ring-ink/5">
                <div className={clsx("vis-tab chevron flex w-28 shrink-0 flex-col items-center justify-center gap-3 py-6 pr-4 text-white sm:w-40", TAB[c.tone])}>
                  <Icon name={c.icon} size={38} />
                  <span className="text-center font-display text-[11px] font-semibold uppercase tracking-wider sm:text-xs">{c.key}</span>
                </div>
                <div className="vis-panel flex flex-1 items-center px-5 py-6 sm:px-7">
                  <p className="text-[0.95rem] leading-relaxed text-ink sm:text-base">{c.statement}</p>
                </div>
                <div className="vis-num hidden w-36 shrink-0 flex-col justify-center border-l border-ink/10 px-6 sm:flex">
                  <CountUp to={Number(c.number)} className="font-display text-[2.6rem] font-bold leading-none text-royal" />
                  <span className="mt-3 block h-0.5 w-7 bg-royal" />
                  <span className="mt-3 font-display text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-slate">{c.outcome}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Connected Operating Model */}
        <div className="mt-28 md:mt-36">
          <div className="flex items-center gap-5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-royal/40" />
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink sm:text-base">
              {vision.operatingModel.title[0]} <span className="text-royal">{vision.operatingModel.title[1]}</span>
            </h3>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-royal/40" />
          </div>

          <ol className="om-list relative mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
            {/* track + fill (horizontal on desktop, vertical on mobile) */}
            <span aria-hidden className="absolute left-[43px] top-2 bottom-2 w-[2px] bg-ink/10 md:left-[10%] md:right-[10%] md:top-[43px] md:bottom-auto md:h-[2px] md:w-auto" />
            <span aria-hidden className="om-fill absolute left-[43px] top-2 bottom-2 w-[2px] origin-top [background:var(--grad-brand)] md:left-[10%] md:right-[10%] md:top-[43px] md:bottom-auto md:h-[2px] md:w-auto md:origin-left" />
            {vision.operatingModel.steps.map((s, i) => (
              <li key={s.title} className="om-node relative flex items-start gap-6 md:flex-col md:items-center md:text-center">
                <span className="relative grid size-[88px] shrink-0 place-items-center rounded-full bg-white shadow-card-light ring-1 ring-royal/15">
                  <span aria-hidden className="om-glow absolute inset-0 scale-75 rounded-full opacity-0 shadow-[0_0_30px_rgb(0_168_252/0.45)] [background:var(--grad-brand)] motion-reduce:scale-100 motion-reduce:opacity-100" />
                  <span className="om-icon relative text-royal motion-reduce:text-white">
                    <Icon name={s.icon!} size={34} />
                  </span>
                </span>
                {i < vision.operatingModel.steps.length - 1 && (
                  <ChevronRight aria-hidden strokeWidth={1.5} className="absolute -right-5 top-[33px] hidden size-5 text-royal md:block" />
                )}
                <div className="om-text pt-5 md:pt-6">
                  <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-ink">{s.title}</p>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-slate md:mx-auto">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
