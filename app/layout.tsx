import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import { company } from "@/lib/content";
import { headScript } from "@/lib/ready";
import { JsonLd } from "@/components/seo/JsonLd";
import { IconSprite } from "@/components/ui/IconSprite";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { DeferMotion } from "@/components/motion/DeferMotion";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hevinka.com"),
  title: {
    default: `${company.legalName} — ${company.tagline.join(" ")}`,
    template: `%s | ${company.shortName} Technologies`,
  },
  description: `${company.positioning}: ERP, CRM, custom software, automation, logistics, asset rental, web and digital growth. ${company.strapline} India | UAE | Beyond.`,
  applicationName: company.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: company.legalName,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000e21",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <JsonLd />
        <IconSprite />
        <SmoothScroll>
          <PageTransition>
            <Preloader />
            <ScrollProgress />
            <Nav />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <DeferMotion>
              <Footer />
            </DeferMotion>
            <Cursor />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
