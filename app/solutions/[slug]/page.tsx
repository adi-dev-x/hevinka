import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { notFound } from "next/navigation";
import { getSolution, solutions } from "@/lib/content";
import { DeferMotion } from "@/components/motion/DeferMotion";
import { PageHero } from "@/components/pages/PageHero";
import { CtaBand } from "@/components/pages/CtaBand";
import { HeroExtras, Modules, Principles, Related, Showcase, SolutionEmblem } from "@/components/pages/solution/SolutionSections";

/** Trim to a word boundary for meta descriptions. */
const clip = (t: string, n: number) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(" ", n - 1)) + "…");

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const s = getSolution((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.title, description: clip(`${s.short} ${s.detail.intro[0]}`, 160), path: `/solutions/${s.slug}` });
}

/** Solution detail (brochure p.10–15): hero → principles → showcase → modules → benefits + related → CTA. */
export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const s = getSolution((await params).slug);
  if (!s) notFound();
  const d = s.detail;
  const labels = d.microLabel?.split(/\s*\|\s*|(?<=\.)\s+/);

  return (
    <>
      <PageHero
        label={s.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Solutions", href: "/#solutions" }, { label: s.title }]}
        labels={labels}
        title={d.heading}
        intro={d.intro}
        media={<SolutionEmblem s={s} />}
      >
        <HeroExtras s={s} />
      </PageHero>
      {d.principles && (
        <DeferMotion>
          <Principles items={d.principles} />
        </DeferMotion>
      )}
      {/* The rental lifecycle pins on desktop, so only defer this section where it doesn't pin. */}
      <DeferMotion media={d.visual === "rental-ring" ? "(max-width: 1023px)" : undefined}>
        <Showcase s={s} />
      </DeferMotion>
      {d.visual !== "rental-ring" && (
        <DeferMotion>
          <Modules s={s} />
        </DeferMotion>
      )}
      <DeferMotion>
        <Related s={s} />
      </DeferMotion>
      <DeferMotion>
        <CtaBand href={`/contact?solution=${s.slug}`} />
      </DeferMotion>
    </>
  );
}
