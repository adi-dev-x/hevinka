"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { useRef } from "react";
import { vision } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LabelStack } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";

const steps = vision.operatingModel.steps;

/** Hero media for /approach: the five operating-model stages orbiting the HEVINKA mark. */
export function ModelEmblem() {
  return (
    <div aria-hidden className="relative grid aspect-[5/4] place-items-center">
      <div className="absolute inset-0 bg-[url(/brand/world-dots.svg)] bg-[length:260%_auto] bg-[position:62%_38%] bg-no-repeat opacity-35" />
      <div className="relative aspect-square w-[78%]">
        <span className="absolute inset-[8%] rounded-full border border-electric/20" />
        <span className="eco-spin absolute inset-[22%] rounded-full border border-dashed border-ion/30" />
        <span className="absolute left-1/2 top-1/2 grid size-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-abyss shadow-[0_0_60px_rgb(0_168_252/0.5)] ring-2 ring-electric/70">
          <LogoMark tone="white" className="h-[48%] w-auto" />
        </span>
        {steps.map((s, i) => {
          const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={s.title}
              className="float-y absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${50 + 42 * Math.cos(a)}%`, top: `${50 + 42 * Math.sin(a)}%`, animationDelay: `${i * -1.2}s` }}
            >
              <span className="grid size-12 place-items-center rounded-full border border-electric/60 bg-midnight text-ion shadow-[0_0_20px_rgb(0_168_252/0.4)] sm:size-14">
                <Icon name={s.icon!} size={22} />
              </span>
              <span className="mt-1.5 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-white">{s.title}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Connected Operating Model, expanded (brochure p.2). A spine draws with scroll; each stage lights
 * as the line reaches it. Desktop alternates sides; mobile keeps the spine on the left.
 */
export function OperatingModel() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".om2-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".om2-list", start: "top 60%", end: "bottom 60%", scrub: 0.4 } });
        gsap.utils.toArray<HTMLElement>(".om2-step").forEach((st) => {
          const glow = st.querySelector(".om2-glow");
          const icon = st.querySelector(".om2-icon");
          const card = st.querySelector(".om2-card");
          gsap.from(card, { x: st.dataset.side === "r" ? 50 : -50, autoAlpha: 0, duration: 0.9, scrollTrigger: { trigger: st, start: "top 80%", toggleActions: "play none none none" } });
          gsap
            .timeline({ scrollTrigger: { trigger: st, start: "top 60%", toggleActions: "play none none reverse" } })
            .fromTo(glow, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5 })
            .to(icon, { color: "#ffffff", duration: 0.3 }, 0);
        });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="mist" cut="right" morph label="Operating model" className="pb-32 md:pb-44">
      <Container>
        <SectionHeading eyebrow="How we think" title={vision.operatingModel.title} intro={vision.intro} align="center" introClassName="text-slate !opacity-100 text-center" />
        <ol className="om2-list relative mx-auto mt-20 max-w-5xl">
          <span aria-hidden className="absolute bottom-6 left-[31px] top-6 w-[2px] bg-ink/10 md:left-1/2 md:-ml-px" />
          <span aria-hidden className="om2-fill absolute bottom-6 left-[31px] top-6 w-[2px] origin-top [background:var(--grad-brand)] md:left-1/2 md:-ml-px" />
          {steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.title} data-side={right ? "r" : "l"} className="om2-step relative grid grid-cols-[64px_1fr] gap-6 py-6 md:grid-cols-[1fr_64px_1fr] md:gap-10">
                <div className={clsx("om2-card md:row-start-1", right ? "md:col-start-3" : "md:col-start-1 md:text-right")}>
                  <div className="rounded-card bg-white p-6 shadow-card-light ring-1 ring-ink/5 md:p-8">
                    <span className="font-mono text-xs tracking-[0.2em] text-royal">{String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
                    <h3 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-[-0.01em] text-ink md:text-3xl">{s.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-slate">{s.text}</p>
                  </div>
                </div>
                <span className="relative col-start-1 row-start-1 grid size-16 place-items-center self-center rounded-full bg-white shadow-card-light ring-1 ring-royal/15 md:col-start-2">
                  <span aria-hidden className="om2-glow absolute inset-0 rounded-full opacity-0 shadow-[0_0_30px_rgb(0_168_252/0.45)] [background:var(--grad-brand)] motion-reduce:opacity-100" />
                  <span className="om2-icon relative text-royal motion-reduce:text-white">
                    <Icon name={s.icon!} size={26} />
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}

/** Core philosophy statement — words fill from faint to solid as it scrolls through. */
export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const card = vision.cards[2];
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".ph2-w", { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".ph2-text", start: "top 80%", end: "bottom 45%", scrub: true } });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );
  return (
    <Section ref={root} tone="white" cut="left" morph label="Philosophy" className="pb-32 md:pb-44">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.4fr_1fr] lg:gap-20">
          <div>
            <LabelStack items={["Core", "philosophy"]} className="text-slate" />
            <p className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.16em] text-royal">{card.outcome}</p>
          </div>
          <div>
            <p className="ph2-text font-display text-[clamp(1.8rem,4.2vw,3.6rem)] font-bold leading-[1.12] tracking-[-0.02em] text-ink">
              {card.statement.split(" ").map((w, i) => (
                <span key={i} className="ph2-w">
                  {w}{" "}
                </span>
              ))}
            </p>
            <ul className="mt-14 grid gap-8 border-t border-ink/10 pt-10 sm:grid-cols-2">
              {vision.cards.slice(0, 2).map((c) => (
                <li key={c.key} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-royal ring-1 ring-royal/15">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ink">{c.key}</h3>
                    <p className="mt-2 leading-relaxed text-slate">{c.statement}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
