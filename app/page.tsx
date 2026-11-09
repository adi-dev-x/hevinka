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

// Home — long-scroll story (premium-section-blueprints, HOME §1–12; Global Solutions follows the hero
// so the globe can hand off to it).
export default function Home() {
  return (
    <>
      <HeroGlobe />
      <VelocityMarquee />
      <Vision />
      <SolutionsOrbit />
      <Platform />
      <Ecosystem />
      <WhyHevinka />
      <ApproachRail />
      <Industries />
      <Spotlights />
      <ClosingCTA />
    </>
  );
}
