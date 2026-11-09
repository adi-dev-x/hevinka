"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useRef } from "react";
import { company, contact, cta } from "@/lib/content";
import { HUBS, hubArc, project } from "@/lib/geo";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Section, Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DrawLines } from "@/components/motion/DrawLines";
import { Reveal } from "@/components/motion/Reveal";

const kochi = project(HUBS.kochi.lat, HUBS.kochi.lng);
const dubai = project(HUBS.dubai.lat, HUBS.dubai.lng);

/** §12 — Let's Build What's Next (brochure p.16). */
export function ClosingCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduce }, (c) => {
        if (c.conditions?.reduce) return;
        // Scroll-linked: the giant words scale up while their letters draw together (transform-only "tracking").
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".cta-words", start: "top 95%", end: "center 45%", scrub: 0.8 } });
        gsap.utils.toArray<HTMLElement>(".cta-line").forEach((line, li) => {
          const chars = line.querySelectorAll(".cta-ch");
          const mid = (chars.length - 1) / 2;
          tl.fromTo(line, { scale: 0.8, autoAlpha: 0.25 }, { scale: 1, autoAlpha: 1, duration: 1 }, li * 0.08);
          chars.forEach((ch, k) => tl.fromTo(ch, { x: (k - mid) * 18 }, { x: 0, duration: 1 }, li * 0.08));
        });
        gsap.from(".cta-value", { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.08, scrollTrigger: { trigger: ".cta-values", start: "top 85%", toggleActions: "play none none none" } });
        gsap.from(".cta-contact > *", { x: -24, autoAlpha: 0, duration: 0.7, stagger: 0.08, scrollTrigger: { trigger: ".cta-contact", start: "top 85%", toggleActions: "play none none none" } });
      });
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="night" cut="left" morph label="Let's build" className="overflow-hidden pb-40 md:pb-52">
      <span aria-hidden className="pointer-events-none absolute -left-[10%] top-[20%] size-[60vw] rounded-full bg-royal/20 blur-[120px]" />
      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <span className="brand-bar" aria-hidden />
            <h2 aria-label={cta.title.join(" ")} className="cta-words mt-8 font-display text-[clamp(3.6rem,10.5vw,10rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.03em]">
              {cta.title.map((w, i) => (
                <span key={w} aria-hidden className={clsx("cta-line block origin-left", cta.accent.includes(i) && "text-electric")}>
                  {w.split("").map((ch, k) => (
                    <span key={k} className="cta-ch inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <span className="brand-bar mt-10" aria-hidden />
            <Reveal as="p" className="mt-8 max-w-lg text-lg leading-relaxed text-white/85">
              {cta.body}
            </Reveal>
            <ul className="cta-values mt-10 grid max-w-lg grid-cols-4 gap-2">
              {cta.values.map((v, i) => (
                <li key={v.title} className={clsx("cta-value flex flex-col items-center gap-3 text-center", i > 0 && "border-l border-white/10")}>
                  <span className="text-electric">
                    <Icon name={v.icon} size={30} />
                  </span>
                  <span className="label !text-[10px] !tracking-[0.2em] text-white/85">{v.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-10 lg:pt-6">
            {/* Kochi ↔ Dubai on the dotted map */}
            <div className="relative overflow-hidden rounded-frame border border-white/10 bg-abyss/50 p-4 shadow-glow">
              <svg viewBox="560 120 240 120" className="w-full" aria-hidden>
                <image href="/brand/world-dots.svg" x="0" y="0" width="1000" height="500" opacity="0.8" />
              </svg>
              <DrawLines
                viewBox="560 120 240 120"
                className="absolute inset-4"
                scrub={false}
                strokeWidth={2}
                lines={[{ d: hubArc("kochi", "dubai", 0.55), pulse: true }]}
                nodes={[
                  { ...kochi, r: 3.5, hub: true },
                  { ...dubai, r: 3.5, hub: true },
                ]}
              />
              <span className="label absolute bottom-6 left-6 !text-[10px] text-ion">Kochi · India</span>
              <span className="label absolute right-6 top-6 !text-[10px] text-ion">Dubai · UAE</span>
            </div>

            <ul className="cta-contact flex flex-col gap-5">
              <li className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full text-white [background:var(--grad-brand)]">
                  <Phone size={20} strokeWidth={1.5} aria-hidden />
                </span>
                <span className="flex flex-col">
                  {contact.phones.map((p) => (
                    <a key={p.href} href={p.href} className="link-underline w-fit text-white/90 hover:text-white">
                      {p.display}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full text-white [background:var(--grad-brand)]">
                  <Mail size={20} strokeWidth={1.5} aria-hidden />
                </span>
                <a href={`mailto:${contact.email}`} className="link-underline text-white/90 hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full text-white [background:var(--grad-brand)]">
                  <MapPin size={20} strokeWidth={1.5} aria-hidden />
                </span>
                <address className="not-italic text-white/90">{contact.address.lines.join(" ")}</address>
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/contact">Start a project</Button>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:border-electric"
              >
                <MessageCircle size={18} strokeWidth={1.5} aria-hidden /> WhatsApp
              </a>
            </div>
            <p className="label text-haze">
              {cta.labels.join(" · ")} — {company.footprint.join(" | ")}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
