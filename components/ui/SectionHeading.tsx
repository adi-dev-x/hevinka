import { clsx } from "clsx";
import { SplitHeading, Accent } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { BrandBar, Eyebrow } from "./Brand";

/**
 * Brochure heading pattern: eyebrow → two-tone heading (plain + accent) → 64×4 brand bar → intro.
 * Arrival order follows the motion hierarchy: label → heading lines → bar → body.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as = "h2",
  size = "h2",
  breakAccent = true,
  align = "left",
  className,
  introClassName,
}: {
  eyebrow?: string;
  /** [plain, accent] */
  title: readonly [string, string] | readonly string[];
  intro?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h2";
  /** Put the accent phrase on its own line. */
  breakAccent?: boolean;
  align?: "left" | "center";
  className?: string;
  introClassName?: string;
}) {
  return (
    <div className={clsx(align === "center" && "flex flex-col items-center text-center", className)}>
      {eyebrow && (
        <Reveal y={16} duration={0.6}>
          <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitHeading as={as} className={size === "display" ? "display" : "h2"}>
        {title[0]}
        {breakAccent ? <br /> : " "}
        <Accent>{title[1]}</Accent>
      </SplitHeading>
      <BrandBar className="mt-6" />
      {intro && (
        <Reveal as="p" delay={0.15} className={clsx("mt-6 max-w-xl body-lg opacity-85", introClassName)}>
          {intro}
        </Reveal>
      )}
    </div>
  );
}
