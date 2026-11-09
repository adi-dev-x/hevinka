import type { Metadata } from "next";
import { Suspense } from "react";
import { company } from "@/lib/content";
import { pageMeta } from "@/lib/site";
import { HeroGlobe } from "@/components/sections/HeroGlobe";
import { VelocityMarquee } from "@/components/sections/VelocityMarquee";
import { Vision } from "@/components/sections/Vision";
import { SolutionsOrbit } from "@/components/sections/SolutionsOrbit";
import { Platform } from "@/components/sections/Platform";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { WhyHevinka } from "@/components/sections/WhyHevinka";
import { ApproachRail } from "@/components/sections/ApproachRail";
import { Industries } from "@/components/sections/Industries";
import { Spotlights } from "@/components/sections/Spotlights";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { RefreshTriggers } from "@/components/motion/RefreshTriggers";
import { DeferMotion } from "@/components/motion/DeferMotion";

// Home — long-scroll story (premium-section-blueprints, HOME §1–12; Global Solutions follows the hero
// so the globe can hand off to it). Each below-the-fold section sits in its own Suspense boundary so
// React hydrates them as separate, interruptible chunks instead of one long blocking task; non-pinned
// sections also defer their motion setup (<DeferMotion>) until they approach the viewport.
export default function Home() {
  return (
    <>
      <HeroGlobe />
      <Suspense>
        <DeferMotion>
          <VelocityMarquee />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <Vision />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion media="(max-width: 767px)">
          <SolutionsOrbit />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <Platform />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <Ecosystem />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <WhyHevinka />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion media="(max-width: 767px)">
          <ApproachRail />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <Industries />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <Spotlights />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <DeferMotion>
          <ClosingCTA />
        </DeferMotion>
      </Suspense>
      <Suspense>
        <RefreshTriggers />
      </Suspense>
    </>
  );
}

const homeTitle = `${company.legalName} — ${company.tagline.join(" ")}`;
export const metadata: Metadata = {
  ...pageMeta({
    title: homeTitle,
    description: `${company.positioning}: ERP, CRM, custom software, automation, logistics, asset rental, web and digital growth. ${company.strapline} India | UAE | Beyond.`,
    path: "/",
  }),
  title: { absolute: homeTitle },
};
