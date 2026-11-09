import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { company, globalSolutions, vision } from "@/lib/content";
import { DeferMotion } from "@/components/motion/DeferMotion";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { FootprintMap } from "@/components/pages/FootprintMap";
import { GlobalMindset } from "@/components/pages/AboutSections";
import { Vision } from "@/components/sections/Vision";
import { WhyHevinka } from "@/components/sections/WhyHevinka";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = pageMeta({ title: "About", description: `${company.legalName} — ${company.positioning}. ${globalSolutions.intro}`, path: "/about" });

/** /about — who we are: vision, mission & philosophy (p.2), global mindset (p.3), why HEVINKA (p.5). */
export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        labels={company.microLabels.peopleTech}
        title={["About", company.shortName]}
        intro={[company.positioning + ".", vision.intro]}
        media={<FootprintMap />}
      >
        <Button href="/contact">Work with us</Button>
      </PageHero>
      <DeferMotion>
        <Vision />
      </DeferMotion>
      <DeferMotion>
        <GlobalMindset />
      </DeferMotion>
      <DeferMotion>
        <WhyHevinka />
      </DeferMotion>
      <DeferMotion>
        <CtaBand />
      </DeferMotion>
    </>
  );
}
