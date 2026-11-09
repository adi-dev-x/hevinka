import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { approach, company } from "@/lib/content";
import { DeferMotion } from "@/components/motion/DeferMotion";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { ModelEmblem, OperatingModel, Philosophy } from "@/components/pages/ApproachSections";
import { ApproachRail } from "@/components/sections/ApproachRail";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = pageMeta({ title: "Our Approach", description: approach.intro, path: "/approach" });

/** /approach — Operating Model (p.2) expanded + the 9-step methodology (p.6). */
export default function ApproachPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Approach" }]}
        labels={company.microLabels.ideas}
        title={approach.title}
        intro={approach.intro}
        media={<ModelEmblem />}
      >
        <Button href="/contact">Start a project</Button>
      </PageHero>
      <DeferMotion>
        <OperatingModel />
      </DeferMotion>
      <DeferMotion media="(max-width: 767px)">
        <ApproachRail />
      </DeferMotion>
      <DeferMotion>
        <Philosophy />
      </DeferMotion>
      <DeferMotion>
        <CtaBand />
      </DeferMotion>
    </>
  );
}
