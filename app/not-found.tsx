import type { Metadata } from "next";
import { LostNetwork } from "@/components/pages/LostNetwork";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return <LostNetwork />;
}
