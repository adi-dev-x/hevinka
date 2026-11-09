import type { Metadata } from "next";
import Image from "next/image";
import { company, solutions, vision } from "@/lib/content";
import { HUBS, hubArc, project, type HubKey } from "@/lib/geo";
import { Section, Container } from "@/components/ui/Section";
import { BrandBar, Eyebrow, LabelStack } from "@/components/ui/Brand";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { SplitHeading, Accent } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { DiagonalWipe } from "@/components/motion/DiagonalWipe";
import { Parallax } from "@/components/motion/Parallax";
import { Marquee } from "@/components/motion/Marquee";
import { DrawLines } from "@/components/motion/DrawLines";
import { TiltCard } from "@/components/motion/TiltCard";
import { CountUp } from "@/components/motion/CountUp";
import { TransitionLink } from "@/components/motion/TransitionLink";

export const metadata: Metadata = {
  title: "Motion playground",
  robots: { index: false, follow: false },
};

// TEMPORARY page (Phase 1): every motion primitive on alternating dark/light sections. Removed in Phase 5.

const ROUTES: HubKey[] = ["london", "frankfurt", "singapore", "sydney", "newYork", "nairobi", "tokyo", "riyadh"];
const kochi = project(HUBS.kochi.lat, HUBS.kochi.lng);
const dubai = project(HUBS.dubai.lat, HUBS.dubai.lng);
const lines = [
  { d: hubArc("kochi", "dubai", 0.6), pulse: true },
  ...ROUTES.map((h, i) => ({ d: hubArc(i % 2 ? "dubai" : "kochi", h, 0.28), pulse: i % 2 === 0 })),
];
const nodes = [
  { ...kochi, r: 5, hub: true },
  { ...dubai, r: 5, hub: true },
  ...ROUTES.map((h) => ({ ...project(HUBS[h].lat, HUBS[h].lng), r: 3 })),
];

const TAB = { navy: "bg-navy", royal: "bg-royal", sky: "bg-sky" } as const;

function Demo({ n, name, children }: { n: string; name: string; children?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="font-mono text-xs text-[var(--accent)]">{n}</span>
      <span className="font-mono text-xs uppercase tracking-[0.2em] opacity-70">{name}</span>
      {children && <span className="text-sm opacity-60">— {children}</span>}
    </div>
  );
}

export default function Playground() {
  return (
    <>
      {/* 01 — SplitHeading (mount) + LabelStack + Buttons */}
      <Section tone="night" label="Intro" className="overflow-hidden pb-40 pt-[calc(var(--nav-h)+5rem)]">
        <Parallax speed={30} className="pointer-events-none absolute -right-[10%] top-[10%] w-[70%] opacity-25">
          <Image src="/brand/world-dots.svg" alt="" width={1000} height={500} priority unoptimized />
        </Parallax>
        <Container className="relative">
          <Demo n="01" name="SplitHeading · LabelStack · Button · Magnetic" />
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div>
              <SplitHeading as="h1" className="display-xl" trigger="mount" delay={0.1}>
                Motion
                <br />
                <Accent gradient>Playground</Accent>
              </SplitHeading>
              <BrandBar className="mt-8" trigger="mount" delay={0.7} />
              <p className="mt-8 max-w-lg body-lg text-white/80">
                Every primitive in one place. Scroll slowly — each section shows one effect on the brand&apos;s alternating
                navy / mist rhythm, joined by diagonal chevron cuts.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="#lines">Jump to network lines</Button>
                <Button href="/" variant="ghost">
                  Page transition → Home
                </Button>
              </div>
            </div>
            <LabelStack items={company.microLabels.smarterTogether} className="shrink-0 text-white/70" />
          </div>
        </Container>
      </Section>

      {/* 02 — Marquee */}
      <Section tone="abyss" cut="left" label="Marquee" className="pb-32">
        <Container>
          <Demo n="02" name="Marquee">velocity-reactive speed, direction & skew · hover to pause</Demo>
        </Container>
        <Marquee items={company.serviceKeywords} className="label border-y border-white/10 py-5 text-sm text-white/80" separator="|" speed={30} />
        <Marquee
          items={["Connected systems", "Smarter business"]}
          className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] font-extrabold uppercase leading-none"
          outline
          reverse
          speed={45}
          label="Connected systems, smarter business"
        />
        <Marquee
          items={["Innovate", "Integrate", "Elevate"]}
          className="mt-2 font-display text-[clamp(3rem,9vw,8rem)] font-extrabold uppercase leading-none text-white"
          speed={50}
          label="Innovate, integrate, elevate"
        />
      </Section>

      {/* 03 — Two-tone heading on light + Reveal stagger + CountUp */}
      <Section tone="mist" cut="right" label="Reveal" className="pb-40">
        <Container>
          <Demo n="03" name="Reveal (stagger) · CountUp · chevron-tab cards" />
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SplitHeading className="display">
                {vision.title[0]} <Accent>{vision.title[1]}</Accent>
              </SplitHeading>
              <BrandBar className="mt-6" />
              <Reveal as="p" className="mt-6 max-w-md body-lg text-slate" delay={0.2}>
                {vision.intro}
              </Reveal>
            </div>
            <Reveal as="ul" stagger={0.12} className="flex flex-col gap-5">
              {vision.cards.map((c) => (
                <li key={c.key} className="flex overflow-hidden rounded-card bg-white shadow-card-light">
                  <div className={`chevron flex w-32 shrink-0 flex-col items-center justify-center gap-3 py-6 pr-5 text-white sm:w-40 ${TAB[c.tone]}`}>
                    <Icon name={c.icon} size={36} />
                    <span className="font-display text-xs font-semibold uppercase tracking-wider">{c.key}</span>
                  </div>
                  <p className="flex-1 self-center px-5 py-6 text-sm leading-relaxed text-ink sm:text-base">{c.statement}</p>
                  <div className="hidden w-32 shrink-0 flex-col justify-center border-l border-ink/10 px-5 sm:flex">
                    <CountUp to={Number(c.number)} className="font-display text-4xl font-bold text-royal" />
                    <span className="mt-2 block h-0.5 w-6 bg-royal" />
                    <span className="mt-2 font-display text-[10px] font-semibold uppercase leading-tight tracking-wider text-slate">{c.outcome}</span>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 04 — DiagonalWipe + Parallax depth */}
      <Section tone="navy" cut="left" label="Wipe & parallax" className="overflow-hidden pb-40">
        <Container>
          <Demo n="04" name="DiagonalWipe · Parallax">rounded-diagonal frame, layered depth</Demo>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="relative">
              <Parallax speed={-16} className="absolute -left-6 -top-10 z-10 hidden md:block">
                <div className="glass rounded-card p-5">
                  <p className="label text-electric">Kochi · India</p>
                  <p className="mt-1 font-display text-lg">Dubai · UAE</p>
                </div>
              </Parallax>
              <DiagonalWipe className="aspect-[4/3] rounded-frame shadow-glow">
                <div className="relative h-full w-full [background:var(--grad-night)]">
                  <Image src="/brand/world-dots.svg" alt="" fill unoptimized className="object-cover opacity-70" />
                  <div className="absolute inset-0 grid place-items-center">
                    <LogoMark tone="gradient" className="h-24 w-auto drop-shadow-[0_0_30px_rgba(0,168,252,0.6)]" />
                  </div>
                </div>
              </DiagonalWipe>
              <span aria-hidden className="absolute -inset-3 -z-10 rounded-[2.4rem] border-2 border-electric/50" />
            </div>
            <div>
              <SplitHeading className="h2">
                Global solutions <Accent>for a connected world</Accent>
              </SplitHeading>
              <BrandBar className="mt-6" />
              <Reveal as="p" className="mt-6 max-w-md body-lg text-white/80">
                HEVINKA develops technology solutions designed to support modern businesses operating across markets, teams,
                locations and business functions.
              </Reveal>
              <DiagonalWipe direction="right" className="mt-10 h-40 rounded-card">
                <div className="h-full w-full [background:var(--grad-brand)]" />
              </DiagonalWipe>
            </div>
          </div>
        </Container>
      </Section>

      {/* 05 — TiltCard grid (light) */}
      <Section tone="white" cut="right" label="Tilt cards" className="pb-40">
        <Container>
          <Demo n="05" name="TiltCard">±6° tilt + cursor spotlight · custom cursor shows “View”</Demo>
          <SplitHeading className="display">
            Our <Accent>Solutions</Accent>
          </SplitHeading>
          <BrandBar className="mt-6" />
          <Reveal stagger={0.06} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => (
              <TiltCard key={s.slug} tone="light" className="rounded-card border border-ink/10 bg-mist p-6">
                <TransitionLink href={`/solutions/${s.slug}`} className="relative flex h-full flex-col gap-5 outline-none">
                  <span className="grid size-14 place-items-center rounded-full bg-royal/10 text-royal ring-1 ring-royal/20">
                    <Icon name={s.icon} size={26} />
                  </span>
                  <span className="font-mono text-xs text-royal">{s.number}</span>
                  <span className="h3 text-ink">{s.title}</span>
                  <span className="text-sm text-slate">{s.short}</span>
                </TransitionLink>
              </TiltCard>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* 06 — DrawLines network */}
      <Section tone="night" cut="left" id="lines" label="Network lines" className="overflow-hidden pb-40">
        <Container>
          <Demo n="06" name="DrawLines">arcs draw with scroll, pulses travel along them</Demo>
          <SplitHeading className="h2">
            Kochi <Accent>↔</Accent> Dubai <Accent>↔</Accent> Beyond
          </SplitHeading>
          <div className="relative mt-12">
            <Image src="/brand/world-dots.svg" alt="" width={1000} height={500} unoptimized className="w-full opacity-60" />
            <DrawLines viewBox="0 0 1000 500" lines={lines} nodes={nodes} className="absolute inset-0 h-full w-full" />
          </div>
        </Container>
      </Section>

      {/* 07 — Logo */}
      <Section tone="mist" cut="right" label="Logo" className="pb-48">
        <Container>
          <Demo n="07" name="Logo (SVG recreation — pending original artwork)" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col items-start gap-8 rounded-frame bg-navy p-10">
              <Logo className="text-[22px]" />
              <Logo compact className="text-[16px]" />
              <div className="flex items-end gap-6">
                <LogoMark tone="white" className="h-20 w-auto" />
                <LogoMark tone="gradient" className="h-14 w-auto" />
                <LogoMark tone="white" className="h-7 w-auto" />
              </div>
            </div>
            <div className="flex flex-col items-start gap-8 rounded-frame bg-white p-10 shadow-card-light">
              <Logo variant="light" className="text-[22px]" />
              <Logo variant="light" compact className="text-[16px]" />
              <div className="flex items-end gap-6">
                <LogoMark tone="gradient" className="h-20 w-auto" />
                <LogoMark tone="cobalt" className="h-14 w-auto" />
                <LogoMark tone="gradient" className="h-7 w-auto" />
              </div>
            </div>
          </div>
          <Eyebrow className="mt-10">Footer below: giant wordmark reveal + back-to-top progress ring</Eyebrow>
        </Container>
      </Section>
    </>
  );
}
