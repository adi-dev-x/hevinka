import { industries } from "@/lib/content";
import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";

export const alt = "HEVINKA — Industries";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image() {
  return ogImage({ eyebrow: "Industries", title: industries.title });
}
