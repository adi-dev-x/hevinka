import { company, contact, solutions } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const org = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: company.legalName,
      alternateName: company.shortName,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/logo.svg`,
      slogan: company.tagline.join(" "),
      description: company.positioning,
      email: contact.email,
      telephone: contact.phones.map((p) => p.href.replace("tel:", "")),
      areaServed: ["IN", "AE"],
      knowsAbout: solutions.map((s) => s.title),
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: company.legalName,
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      email: contact.email,
      telephone: contact.phones[0].href.replace("tel:", ""),
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address.street,
        addressLocality: contact.address.locality,
        addressRegion: contact.address.region,
        postalCode: contact.address.postalCode,
        addressCountry: contact.address.country,
      },
      areaServed: ["IN", "AE"],
    },
  ],
};

/** Organization + LocalBusiness structured data (rendered once in the root layout). */
export function JsonLd() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org).replace(/</g, "\\u003c") }} />;
}
