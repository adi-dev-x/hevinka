import { getSolution, solutions } from "@/lib/content";
import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";

export const alt = "HEVINKA solution";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const s = getSolution((await params).slug)!;
  return ogImage({ eyebrow: `Solution ${s.number}`, title: s.titleParts });
}
