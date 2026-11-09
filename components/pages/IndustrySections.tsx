"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { getSolution, industries } from "@/lib/content";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/motion/TransitionLink";

const items = industries.items;
const pad = (n: number) => String(n).padStart(2, "0");

/** Hero media for /industries: the eleven industry marks as a lit grid; a highlight walks the tiles. */
export function IndustriesEmblem() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tiles = gsap.utils.toArray<HTMLElement>(".ie-tile");
        const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
        tiles.forEach((t) =>
          tl.to(t, { scale: 1.08, borderColor: "rgba(127,227,255,0.9)", boxShadow: "0 0 30px rgba(0,168,252,0.55)", duration: 0.3 })
            .to(t, { scale: 1, borderColor: "rgba(0,168,252,0.25)", boxShadow: "0 0 0 rgba(0,168,252,0)", duration: 0.6 }, "+=0.25"),
        );
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} aria-hidden className="relative grid aspect-[5/4] place-items-center">
      <div className="absolute inset-0 bg-[url(/brand/world-dots.svg)] bg-[length:260%_auto] bg-[position:62%_38%] bg-no-repeat opacity-30" />
      <ul className="relative grid w-[82%] grid-cols-4 gap-3">
        {items.map((it) => (
          <li key={it.title} className="ie-tile glass grid aspect-square place-items-center rounded-2xl border border-electric/25 text-ion">
            <Icon name={it.icon} className="size-[42%]" />
          </li>
        ))}
        <li className="grid aspect-square place-items-center rounded-2xl [background:var(--grad-brand)]">
          <span className="font-display text-xl font-extrabold text-white">{items.length}</span>
        </li>
      </ul>
    </div>
  );
}

/**
 * Industry index (brochure p.4, expanded). Desktop: a sticky panel shows the active industry's mark,
 * index and progress while the list scrolls; each entry links its most relevant solutions.
 * Mobile: stacked cards.
 */
export function IndustryIndex() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const marks = gsap.utils.toArray<HTMLElement>(".ii-mark");
        const num = root.current!.querySelector<HTMLElement>(".ii-num")!;
        const name = root.current!.querySelector<HTMLElement>(".ii-name")!;
        gsap.set(marks, { autoAlpha: 0, scale: 0.8 });
        gsap.set(marks[0], { autoAlpha: 1, scale: 1 });
        let current = 0;
        const show = (i: number) => {
          if (i === current) return;
          gsap.to(marks[current], { autoAlpha: 0, scale: 0.8, rotation: i > current ? -12 : 12, duration: 0.45, overwrite: true });
          gsap.fromTo(marks[i], { autoAlpha: 0, scale: 1.2, rotation: i > current ? 12 : -12 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, overwrite: true });
          current = i;
          num.textContent = pad(i + 1);
          name.textContent = items[i].title;
        };
        gsap.utils.toArray<HTMLElement>(".ii-row").forEach((row, i) => {
          onCentre(row, () => show(i), () => i > 0 && show(i - 1));
          gsap.from(row, { y: 40, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none none" } });
          gsap.fromTo(row.querySelector(".ii-line"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.inOut", scrollTrigger: { trigger: row, start: "top 80%", toggleActions: "play none none none" } });
        });
        gsap.fromTo(".ii-progress", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".ii-list", start: "top 50%", end: "bottom 50%", scrub: true } });
      });
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".ii-row").forEach((row) =>
          gsap.from(row, { y: 30, autoAlpha: 0, duration: 0.7, scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none none" } }),
        );
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="mist" cut="right" morph label="Industries" className="pb-32 md:pb-44">
      <Container>
        <SectionHeading eyebrow="Where it applies" title={["One set of principles,", "configured for your industry"]} intro={industries.intro} introClassName="text-slate !opacity-100" />
        <div className="mt-20 grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          {/* sticky panel (desktop) */}
          <div aria-hidden className="hidden lg:block">
            <div className="sticky top-32 overflow-hidden rounded-[2rem] frame-diag p-10 text-white [background:var(--grad-night)]">
              <div className="absolute inset-0 bg-[url(/brand/world-dots.svg)] bg-[length:300%_auto] bg-[position:62%_38%] bg-no-repeat opacity-25" />
              <div className="relative flex items-start justify-between">
                <p className="font-mono text-sm text-electric">
                  <span className="ii-num">01</span> / {pad(items.length)}
                </p>
                <span className="relative h-24 w-[2px] overflow-hidden rounded bg-white/10">
                  <span className="ii-progress absolute inset-0 origin-top [background:var(--grad-brand)]" />
                </span>
              </div>
              <div className="relative mx-auto my-6 grid aspect-square w-[62%] place-items-center">
                <span className="absolute inset-0 rounded-full border border-electric/20" />
                <span className="eco-spin absolute inset-[12%] rounded-full border border-dashed border-ion/30" />
                {items.map((it) => (
                  <span key={it.title} className="ii-mark absolute grid size-[56%] place-items-center rounded-full bg-abyss text-ion shadow-[0_0_60px_rgb(0_168_252/0.45)] ring-2 ring-electric/60">
                    <Icon name={it.icon} className="size-[48%]" strokeWidth={1.25} />
                  </span>
                ))}
              </div>
              <p className="ii-name relative font-display text-2xl font-extrabold uppercase leading-tight">{items[0].title}</p>
            </div>
          </div>

          <ol className="ii-list">
            {items.map((it, i) => (
              <li key={it.title} className="ii-row relative py-8 first:pt-0">
                <div className="flex gap-5 sm:gap-7">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-royal shadow-card-light ring-1 ring-royal/15">
                    <Icon name={it.icon} size={26} />
                  </span>
                  <div className="min-w-0">
                    <span className="font-mono text-xs tracking-[0.2em] text-royal">{pad(i + 1)}</span>
                    <h3 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">{it.title}</h3>
                    <p className="mt-2 max-w-xl leading-relaxed text-slate">{it.text}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Solutions for ${it.title}`}>
                      {it.solutions.map((slug) => {
                        const s = getSolution(slug)!;
                        return (
                          <li key={slug}>
                            <TransitionLink
                              href={`/solutions/${slug}`}
                              className="group inline-flex items-center gap-1.5 rounded-full border border-royal/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-royal hover:text-royal"
                            >
                              {s.title}
                              <ArrowUpRight aria-hidden size={12} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                            </TransitionLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <span aria-hidden className="ii-line absolute inset-x-0 bottom-0 h-px origin-left bg-ink/10" />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/** Fires `enter` when the row crosses the viewport centre going down, `back` when it leaves going up. */
function onCentre(row: HTMLElement, enter: () => void, back: () => void) {
  gsap.timeline({ scrollTrigger: { trigger: row, start: "top 55%", end: "bottom 55%", onEnter: enter, onEnterBack: enter, onLeaveBack: back } });
}
