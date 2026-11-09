// Contact enquiry: shared by the client form (inline validation) and the server action.
import { contact, solutions } from "./content";

export const FIELDS = ["name", "company", "email", "phone", "interest", "message"] as const;
export type Field = (typeof FIELDS)[number];
export type Enquiry = Record<Field, string>;
export type Errors = Partial<Record<Field, string>>;

export const INTERESTS = [...solutions.map((s) => ({ value: s.slug, label: s.title })), { value: "other", label: "Something else" }];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{6,20}$/;

export function validateField(field: Field, raw: string): string | undefined {
  const v = raw.trim();
  switch (field) {
    case "name":
      return v.length < 2 ? "Please enter your name." : v.length > 100 ? "Please keep this under 100 characters." : undefined;
    case "company":
      return v.length > 120 ? "Please keep this under 120 characters." : undefined;
    case "email":
      return !v ? "Please enter your email." : !EMAIL.test(v) || v.length > 200 ? "Please enter a valid email address." : undefined;
    case "phone":
      return v && !PHONE.test(v) ? "Please enter a valid phone number." : undefined;
    case "interest":
      return v && !INTERESTS.some((i) => i.value === v) ? "Please choose an option." : undefined;
    case "message":
      return v.length < 10 ? "Tell us a little about your project (10+ characters)." : v.length > 4000 ? "Please keep this under 4,000 characters." : undefined;
  }
}

export function validate(e: Enquiry): Errors {
  const errors: Errors = {};
  for (const f of FIELDS) {
    const msg = validateField(f, e[f]);
    if (msg) errors[f] = msg;
  }
  return errors;
}

export const interestLabel = (v: string) => INTERESTS.find((i) => i.value === v)?.label ?? "General enquiry";

export function enquiryText(e: Enquiry) {
  return [
    `Name: ${e.name}`,
    e.company ? `Company: ${e.company}` : null,
    `Email: ${e.email}`,
    e.phone ? `Phone: ${e.phone}` : null,
    `Interested in: ${interestLabel(e.interest)}`,
    "",
    e.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export const enquirySubject = (e: Enquiry) => `Website enquiry — ${interestLabel(e.interest)} — ${e.name}`;

/** mailto: fallback so an enquiry is never lost when email delivery is not configured. */
export function mailtoFor(e: Enquiry) {
  return `mailto:${contact.email}?subject=${encodeURIComponent(enquirySubject(e))}&body=${encodeURIComponent(enquiryText(e))}`;
}
