import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/og";

export const alt = "Contact HEVINKA — Let's build what's next";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default async function Image() {
  return ogImage({ eyebrow: "Contact", title: ["Let's build", "what's next"] });
}
