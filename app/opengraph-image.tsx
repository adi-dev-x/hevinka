import { company } from "@/lib/content";
import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";

export const alt = `${company.legalName} — ${company.tagline.join(" ")}`;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image() {
  return ogImage({ eyebrow: company.positioning, title: ["Innovate. Integrate.", "Elevate."] });
}
