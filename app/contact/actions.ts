"use server";

import { contact } from "@/lib/content";
import { FIELDS, enquirySubject, enquiryText, mailtoFor, validate, type Enquiry, type Errors } from "@/lib/enquiry";

export type EnquiryState = {
  status: "idle" | "sent" | "invalid" | "fallback";
  errors?: Errors;
  values?: Partial<Enquiry>;
  mailto?: string;
};

/**
 * Sends the enquiry to info@hevinka.com through Resend (env RESEND_API_KEY, optional CONTACT_FROM_EMAIL
 * on a verified domain). Without a key — or if delivery fails — it returns a prefilled mailto: link.
 */
export async function sendEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  const e = Object.fromEntries(FIELDS.map((f) => [f, String(form.get(f) ?? "").trim()])) as Enquiry;

  // Honeypot: bots fill the hidden field; pretend success.
  if (String(form.get("website") ?? "")) return { status: "sent" };

  const errors = validate(e);
  if (Object.keys(errors).length) return { status: "invalid", errors, values: e };

  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "HEVINKA Website <onboarding@resend.dev>",
          to: [contact.email],
          reply_to: e.email,
          subject: enquirySubject(e),
          text: enquiryText(e),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return { status: "sent" };
      console.error("[contact] Resend responded", res.status, await res.text().catch(() => ""));
    } catch (err) {
      console.error("[contact] Resend request failed", err);
    }
  }
  return { status: "fallback", values: e, mailto: mailtoFor(e) };
}
