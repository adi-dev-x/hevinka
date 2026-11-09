import { company } from "@/lib/content";
import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";

export const alt = `About ${company.legalName}`;
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image() {
  return ogImage({ eyebrow: "About", title: ["About", company.shortName] });
}
