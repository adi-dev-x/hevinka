"use client";
// Rendered once per page; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { cta, ecosystem, platform, solutions, why, type Feature, type Solution } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eyebrow } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { TransitionLink } from "@/components/motion/TransitionLink";
import {
  LazyApiHub,
  LazyDashboard,
  LazyGrowthEngine,
  LazyIntegrationWheel,
  LazyRouteMap,
  LazyWebDevices,
} from "@/components/visuals/lazy";
import { Lifecycle } from "./Lifecycle";

/** "Complete business management, all in one platform" → ["Complete business management,", "all in one platform"]. */
function splitTitle(t: string): [string, string] {
  const comma = t.indexOf(",");
  if (comma > 0) return [t.slice(0, comma + 1), t.slice(comma + 2)];
  const w = t.split(" ");
  const k = Math.max(1, w.length - 2);
  return [w.slice(0, k).join(" "), w.slice(k).join(" ")];
}

// ------------------------------------------------------------------ Hero parts

/** Hero media: the solution's mark in glowing rings, its number and a few of its modules floating around.
 *  TODO(content): stands in for the brochure's per-solution photography — see content/IMAGE-TODO.md. */
export function SolutionEmblem({ s }: { s: Solution }) {
  const chips = s.detail.modules.slice(0, 3);
  // Kept clear of the centre disc (≈32–68% of the frame height).
  const spots = ["left-[4%] top-[11%]", "right-[4%] top-[71%]", "left-[5%] bottom-[6%]"];
  return (
    <div aria-hidden className="relative grid aspect-[5/4] place-items-center overflow-hidden">
      <div className="absolute inset-0 bg-[url(/brand/world-dots.svg)] bg-[length:260%_auto] bg-[position:62%_38%] bg-no-repeat opacity-40" />
      <span className="absolute right-[6%] top-[2%] font-display text-[clamp(6rem,14vw,12rem)] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(0_168_252/0.45)]">
        {s.number}
      </span>
      <span className="absolute size-[78%] rounded-full border border-electric/10" />
      <span className="absolute size-[60%] rounded-full border border-electric/20" />
      <span className="eco-spin absolute size-[44%] rounded-full border border-dashed border-ion/35" />
      <span className="relative grid size-[28%] place-items-center rounded-full bg-abyss text-ion shadow-[0_0_70px_rgb(0_168_252/0.55),inset_0_0_30px_rgb(0_168_252/0.35)] ring-2 ring-electric/70">
        <span className="hub-pulse !left-1/2 !top-1/2 absolute size-full rounded-full border border-ion/50" />
        <Icon name={s.icon} className="size-[46%]" strokeWidth={1.25} />
      </span>
      {chips.map((c, i) => (
        <span
          key={c.title}
          className={clsx("float-y glass absolute flex max-w-[44%] items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 sm:py-2 sm:pl-2 sm:pr-4", spots[i])}
          style={{ animationDelay: `${i * -2}s` }}
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-electric/15 text-ion">
            <Icon name={c.icon!} size={14} />
          </span>
          <span className="font-display text-[10px] font-semibold leading-tight text-white sm:text-[11px]">{c.title}</span>
        </span>
      ))}
    </div>
  );
}

/** Qualities, covers and CTAs under the hero intro. */
export function HeroExtras({ s }: { s: Solution }) {
  const { qualities, covers } = s.detail;
  return (
    <>
      {qualities && (
        <ul className="grid max-w-[38rem] gap-5 sm:grid-cols-3">
          {qualities.map((q) => (
            <li key={q.title} className="flex items-center gap-3 sm:flex-col sm:items-start">
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-electric/50 bg-midnight/60 text-ion shadow-[0_0_18px_rgb(0_168_252/0.3)]">
                <Icon name={q.icon!} size={20} />
              </span>
              <span>
                <span className="block font-display text-sm font-bold uppercase tracking-[0.1em] text-white">{q.title}</span>
                {q.text && <span className="mt-0.5 block text-sm text-white/65">{q.text}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {covers && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="label mr-2 !text-[11px] text-haze">Covers</span>
          {covers.map((c) => (
            <span key={c} className="rounded-full border border-electric/40 bg-electric/10 px-3.5 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-white">
              {c}
            </span>
          ))}
        </div>
      )}
      <div className={clsx("flex flex-wrap gap-4", (qualities || covers) && "mt-10")}>
        <Button href={`/contact?solution=${s.slug}`}>Discuss your project</Button>
        <Button href="/#solutions" variant="ghost" icon={false}>
          All solutions
        </Button>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ Principles (light)

export function Principles({ items }: { items: Feature[] }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" }, (ctx) => {
        if (!ctx.conditions!.motion) return;
        gsap.utils.toArray<HTMLElement>(".pr-card").forEach((card, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" }, delay: i * 0.1 });
          tl.fromTo(card.querySelector(".pr-tab"), { xPercent: -40, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.7 })
            .fromTo(card.querySelector(".pr-panel"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.35");
          // Scroll-linked depth: the three cards rise at different rates.
          if (ctx.conditions!.desktop) gsap.fromTo(card, { y: 30 + i * 30 }, { y: -(i * 20), ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );
  return (
    <Section ref={root} tone="mist" cut="right" morph label="Principles" className="pb-28 md:pb-36">
      <Container>
        <SectionHeading eyebrow="Design principles" title={["Built on", "clear principles"]} />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <li key={p.title} className="pr-card overflow-hidden rounded-card bg-white shadow-card-light ring-1 ring-ink/5">
              <div className={clsx("pr-tab chevron flex items-center gap-4 px-6 py-5 pr-10 text-white", ["bg-navy", "bg-royal", "bg-sky !text-abyss"][i % 3])}>
                <Icon name={p.icon!} size={28} />
                <span className="font-mono text-xs tracking-[0.2em]">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="pr-panel px-6 pb-8 pt-6">
                <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// ------------------------------------------------------------------ Showcase (dark)

type Copy = { eyebrow: string; title: readonly [string, string] | readonly string[]; intro?: string; items?: (Feature | string)[]; closing?: [string, string] };

function showcaseCopy(s: Solution): Copy {
  const d = s.detail;
  switch (d.visual) {
    case "dashboard":
      return { eyebrow: "Enterprise visibility", title: d.extra!.title, intro: d.extra!.intro, items: d.extra!.items, closing: d.extra!.closing };
    case "crm":
      return { eyebrow: "One connected view", title: platform.banner, intro: ecosystem.intro };
    case "route-map":
      return { eyebrow: "Outcomes", title: ["Connected fleets.", "Smarter business."], intro: d.intro[0], items: d.outcomes };
    case "api-hub":
      return { eyebrow: "Architecture", title: d.banner!, items: d.qualities };
    case "growth-engine":
      return { eyebrow: "How growth compounds", title: ["Integrated Digital", "Growth Engine"], items: d.cycle };
    case "automation":
      return { eyebrow: "Integration", title: ecosystem.title, intro: ecosystem.intro, items: ecosystem.nodes.map((n) => n.title) };
    case "web":
      return { eyebrow: "Connected experiences", title: ["Create powerful", "digital experiences."], intro: why.items[2].text };
    default:
      return { eyebrow: "Lifecycle", title: splitTitle(d.modulesTitle ?? s.title) };
  }
}

function ShowcaseVisual({ s }: { s: Solution }) {
  switch (s.detail.visual) {
    case "dashboard":
    case "crm":
      return <LazyDashboard className="overflow-hidden rounded-xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] ring-1 ring-electric/20" />;
    case "route-map":
      return <LazyRouteMap className="w-full overflow-hidden rounded-[1.5rem] ring-1 ring-electric/20" />;
    case "api-hub":
      return <LazyApiHub />;
    case "growth-engine":
      return <LazyGrowthEngine />;
    case "automation":
      return <LazyIntegrationWheel />;
    default:
      return <LazyWebDevices />;
  }
}

export function Showcase({ s }: { s: Solution }) {
  const root = useRef<HTMLElement>(null);
  const copy = showcaseCopy(s);
  const isLifecycle = s.detail.visual === "rental-ring";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        if (isLifecycle) return;
        // Scroll-linked: the visual drifts against the copy and settles from a slight tilt.
        gsap.fromTo(
          ".sc-visual",
          { y: 80, rotation: -2 },
          { y: -40, rotation: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (isLifecycle) return;
        gsap.from(".sc-item", { x: 30, autoAlpha: 0, duration: 0.7, stagger: 0.07, scrollTrigger: { trigger: ".sc-items", start: "top 85%", toggleActions: "play none none none" } });
        if (copy.closing) gsap.from(".sc-closing", { y: 30, autoAlpha: 0, duration: 0.9, scrollTrigger: { trigger: ".sc-closing", start: "top 90%", toggleActions: "play none none none" } });
      });
    },
    { scope: root },
  );

  const heading = (
    <SectionHeading
      eyebrow={copy.eyebrow}
      title={copy.title}
      intro={copy.intro}
      introClassName="text-white/80"
      breakAccent
    />
  );

  return (
    <Section ref={root} tone="abyss" cut="left" morph label="Showcase" className="overflow-hidden pb-28 md:pb-36">
      <span aria-hidden className="pointer-events-none absolute -left-[10%] top-[15%] size-[50vw] rounded-full bg-royal/20 blur-[120px]" />
      <Container className="relative">
        {isLifecycle ? (
          <Lifecycle stages={s.detail.modules} intro={heading} />
        ) : (
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="sc-visual relative">
              <ShowcaseVisual s={s} />
            </div>
            <div>
              {heading}
              {copy.items && (
                <ul className="sc-items mt-10 grid gap-3">
                  {copy.items.map((it) => {
                    const f = typeof it === "string" ? { title: it, text: "" } : it;
                    return (
                      <li key={f.title} className="sc-item flex items-start gap-4 border-b border-white/10 pb-3">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-electric/50 text-ion">
                          {f.icon ? <Icon name={f.icon} size={16} /> : <ArrowRight size={14} strokeWidth={1.75} aria-hidden />}
                        </span>
                        <div>
                          <p className="font-display text-[0.95rem] font-semibold text-white">{f.title}</p>
                          {f.text && <p className="mt-0.5 text-sm leading-relaxed text-white/70">{f.text}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
        {copy.closing && (
          <p className="sc-closing mt-20 text-center font-display text-[clamp(1.6rem,3.4vw,2.8rem)] font-extrabold uppercase leading-tight tracking-[-0.01em]">
            {copy.closing[0]} <span className="text-electric">{copy.closing[1]}</span>
          </p>
        )}
      </Container>
    </Section>
  );
}

// ------------------------------------------------------------------ Modules (light)

export function Modules({ s }: { s: Solution }) {
  const root = useRef<HTMLElement>(null);
  const { modules, modulesTitle } = s.detail;
  const compact = modules.every((m) => !m.text);
  const cols = compact ? 4 : 3;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (ctx) => {
        if (!ctx.conditions!.motion) return;
        const cards = gsap.utils.toArray<HTMLElement>(".md-card");
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        revealCards(cards);
        if (ctx.conditions!.desktop) {
          // Scroll-linked: alternate columns drift against each other.
          gsap.utils.toArray<HTMLElement>(".md-cell").forEach((cell, i) => {
            if (i % cols !== 1 && !(cols === 4 && i % cols === 3)) return;
            gsap.fromTo(cell, { y: 50 }, { y: -30, ease: "none", scrollTrigger: { trigger: ".md-grid", start: "top bottom", end: "bottom top", scrub: true } });
          });
        }
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="mist" cut="right" morph label="Modules" className="pb-32 md:pb-40">
      <Container>
        <SectionHeading eyebrow={`${s.title}`} title={splitTitle(modulesTitle ?? "Key capabilities, built around your workflow")} introClassName="text-slate !opacity-100" />
        <ul className={clsx("md-grid mt-14 grid gap-5 sm:grid-cols-2", compact ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
          {modules.map((m, i) => (
            <li key={m.title} className="md-cell">
              <TiltCard tone="light" max={4} className="md-card group h-full rounded-card bg-white p-6 shadow-card-light ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgb(11_91_211/0.35)]">
                <div className={clsx("flex gap-4", compact ? "items-center" : "flex-col")}>
                  <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border border-royal/25 text-royal">
                    <span aria-hidden className="absolute inset-0 scale-50 rounded-full opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] [background:var(--grad-brand)] group-hover:scale-100 group-hover:opacity-100" />
                    <Icon name={m.icon!} size={24} className="relative transition-colors duration-300 group-hover:text-white" />
                  </span>
                  <div>
                    {!compact && <span className="font-mono text-[11px] tracking-[0.2em] text-royal">{String(i + 1).padStart(2, "0")}</span>}
                    <h3 className={clsx("font-display font-bold text-ink", compact ? "text-[0.95rem] leading-snug" : "mt-1 text-lg")}>{m.title}</h3>
                    {m.text && m.text !== "TODO(content)" && <p className="mt-2 text-[0.95rem] leading-relaxed text-slate">{m.text}</p>}
                  </div>
                </div>
              </TiltCard>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Each card rises as it enters; siblings in a row cascade slightly. */
function revealCards(cards: HTMLElement[]) {
  cards.forEach((card) => {
    gsap.to(card, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      delay: (cards.indexOf(card) % 4) * 0.08,
      scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
    });
  });
}

// ------------------------------------------------------------------ Benefits + related (light)

function benefitsFor(s: Solution): { label: string; items: readonly string[] } {
  const d = s.detail;
  if (d.benefits) return { label: "Key benefits", items: d.benefits };
  if (d.outcomes) return { label: "Outcomes", items: d.outcomes };
  if (d.footerRow) return { label: "Our focus", items: d.footerRow };
  return { label: "The result", items: cta.labels };
}

export function Related({ s }: { s: Solution }) {
  const root = useRef<HTMLElement>(null);
  const idx = solutions.findIndex((x) => x.slug === s.slug);
  const others = [...solutions.slice(idx + 1), ...solutions.slice(0, idx)];
  const next = others[0];
  const prev = others[others.length - 1];
  const benefits = benefitsFor(s);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (ctx) => {
        if (!ctx.conditions!.motion) return;
        gsap.from(".bn-chip", { x: 60, autoAlpha: 0, duration: 0.8, stagger: 0.07, scrollTrigger: { trigger: ".bn-band", start: "top 85%", toggleActions: "play none none none" } });
        gsap.fromTo(".bn-band", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: ".bn-band", start: "top 88%", toggleActions: "play none none none" } });
        if (ctx.conditions!.desktop) {
          gsap.fromTo(".bn-row", { xPercent: 4 }, { xPercent: -2, ease: "none", scrollTrigger: { trigger: ".bn-band", start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(".rel-num", { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: ".rel-next", start: "top bottom", end: "bottom top", scrub: true } });
        }
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="white" cut="left" morph label="More solutions" className="overflow-hidden pb-32 md:pb-40">
      <Container>
        {/* Benefits strip */}
        <div className="bn-band relative overflow-hidden rounded-[1.75rem] px-6 py-8 text-white [background:var(--grad-brand)] sm:px-10">
          <span aria-hidden className="absolute -right-10 top-0 h-full w-40 skew-x-[-20deg] bg-white/10" />
          <div className="bn-row relative flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
            <p className="label shrink-0 !text-[11px] text-white/85">{benefits.label}</p>
            <ul className="flex flex-wrap gap-3">
              {benefits.items.map((b) => (
                <li key={b} className="bn-chip flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 font-display text-sm font-semibold backdrop-blur-sm">
                  <span aria-hidden className="size-1.5 rounded-full bg-ion shadow-[0_0_8px_#7fe3ff]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Explore" title={["More", "connected solutions"]} breakAccent={false} />
          <Button href="/#solutions" variant="ghost-light" icon={false}>
            All solutions
          </Button>
        </div>

        <Reveal
          as="ul"
          stagger={0.06}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
        >
          {others.map((o) => (
            <li key={o.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <TransitionLink
                href={`/solutions/${o.slug}`}
                className="group flex h-full flex-col rounded-card bg-mist p-6 ring-1 ring-ink/5 transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)] hover:-translate-y-1 hover:shadow-card-light"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-full bg-white text-royal ring-1 ring-royal/20 transition-colors group-hover:bg-royal group-hover:text-white">
                    <Icon name={o.icon} size={22} />
                  </span>
                  <span className="font-mono text-xs text-slate">{o.number}</span>
                </div>
                <h3 className="mt-6 font-display text-base font-bold leading-snug text-ink">{o.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{o.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-royal">
                  Explore <ArrowUpRight aria-hidden size={14} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </TransitionLink>
            </li>
          ))}
        </Reveal>

        {/* Prev / next */}
        <nav aria-label="Solution pages" className="rel-next mt-20 grid gap-4 border-t border-ink/10 pt-10 md:grid-cols-2">
          <TransitionLink href={`/solutions/${prev.slug}`} className="group">
            <Eyebrow className="!text-slate">← Previous</Eyebrow>
            <p className="mt-2 font-display text-xl font-bold text-ink transition-colors group-hover:text-royal">{prev.title}</p>
          </TransitionLink>
          <TransitionLink href={`/solutions/${next.slug}`} className="group relative md:text-right">
            <span aria-hidden className="rel-num pointer-events-none absolute -top-16 right-0 font-display text-[7rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1px_rgb(11_91_211/0.18)] max-md:hidden">
              {next.number}
            </span>
            <Eyebrow className="!text-slate">Next →</Eyebrow>
            <p className="relative mt-2 font-display text-xl font-bold text-ink transition-colors group-hover:text-royal">{next.title}</p>
          </TransitionLink>
        </nav>
      </Container>
    </Section>
  );
}
