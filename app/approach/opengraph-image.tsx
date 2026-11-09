import { approach } from "@/lib/content";
import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";

export const alt = "HEVINKA — Our Approach";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image() {
  return ogImage({ eyebrow: "How we work", title: approach.title });
}
