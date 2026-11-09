import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { contact, cta } from "@/lib/content";
import { DeferMotion } from "@/components/motion/DeferMotion";
import { PageHero } from "@/components/pages/PageHero";
import { FootprintMap } from "@/components/pages/FootprintMap";
import { ContactSection } from "@/components/pages/ContactSections";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = pageMeta({ title: "Contact", description: `${cta.body} Call ${contact.phones[0].display} or email ${contact.email}.`, path: "/contact" });

/** /contact — Let's build what's next (p.16): contact cards, enquiry form, WhatsApp. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        labels={cta.labels}
        title={["Let's build", "what's next"]}
        intro={cta.body}
        media={<FootprintMap />}
      >
        <div className="flex flex-wrap gap-4">
          <Button href="#enquiry">Send an enquiry</Button>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/25 px-6 py-3.5 font-display text-sm font-semibold text-white transition-colors hover:border-electric"
          >
            WhatsApp {contact.phones[0].display}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </PageHero>
      <DeferMotion>
        <ContactSection />
      </DeferMotion>
    </>
  );
}
