import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { company, industries } from "@/lib/content";
import { DeferMotion } from "@/components/motion/DeferMotion";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { IndustriesEmblem, IndustryIndex } from "@/components/pages/IndustrySections";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = pageMeta({ title: "Industries", description: `${industries.title.join(" ")}. ${industries.intro}`, path: "/industries" });

/** /industries — the eleven business environments (p.4) and how the solutions apply. */
export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        labels={company.microLabels.movement}
        title={industries.title}
        intro={industries.intro}
        media={<IndustriesEmblem />}
      >
        <Button href="/contact">Discuss your industry</Button>
      </PageHero>
      <DeferMotion>
        <IndustryIndex />
      </DeferMotion>
      <DeferMotion>
        <Ecosystem />
      </DeferMotion>
      <DeferMotion>
        <CtaBand />
      </DeferMotion>
    </>
  );
}
