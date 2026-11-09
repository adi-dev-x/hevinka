"use client";
// Rendered once; GSAP owns the motion — React Compiler memoisation would only add bytes here.
"use no memo";

import { clsx } from "clsx";
import { Check, ChevronDown, Mail, MapPin, MessageCircle, Phone, Send, type LucideIcon } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { contact } from "@/lib/content";
import { INTERESTS, validateField, type Errors, type Field } from "@/lib/enquiry";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { sendEnquiry, type EnquiryState } from "@/app/contact/actions";
import { Section, Container } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Brand";

const CARDS: { icon: LucideIcon; label: string; value: string; href: string; external?: boolean }[] = [
  ...contact.phones.map((p) => ({ icon: Phone, label: "Call", value: p.display, href: p.href })),
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { icon: MessageCircle, label: "WhatsApp", value: contact.phones[0].display, href: contact.whatsapp, external: true },
];

/** Contact cards + enquiry form (brochure p.16–17). */
export function ContactSection() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ct-card", { x: -30, autoAlpha: 0, duration: 0.7, stagger: 0.08, scrollTrigger: { trigger: ".ct-cards", start: "top 85%", toggleActions: "play none none none" } });
        gsap.from(".ct-form", { y: 50, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: ".ct-form", start: "top 88%", toggleActions: "play none none none" } });
        // Scroll-linked: the glow behind the form follows the scroll.
        gsap.fromTo(".ct-glow", { yPercent: -20 }, { yPercent: 30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      mm.add(MQ.reduce, () => {});
    },
    { scope: root },
  );

  return (
    <Section ref={root} tone="mist" cut="right" morph label="Contact" id="enquiry" className="overflow-hidden pb-32 md:pb-44">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <Eyebrow>Talk to us</Eyebrow>
            <h2 className="h2 mt-5 text-ink">
              Reach the <span className="text-royal">HEVINKA team</span>
            </h2>
            <span aria-hidden className="brand-bar mt-6 block" />
            <ul className="ct-cards mt-10 grid gap-3">
              {CARDS.map((c) => (
                <li key={c.label + c.value} className="ct-card">
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5 transition-[transform,box-shadow] duration-500 ease-[var(--ease-expo)] hover:-translate-y-0.5 hover:shadow-card-light"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-royal ring-1 ring-royal/15 transition-colors group-hover:bg-royal group-hover:text-white">
                      <c.icon aria-hidden size={20} strokeWidth={1.5} />
                    </span>
                    <span>
                      <span className="label block !text-[10px] text-slate">{c.label}</span>
                      <span className="mt-0.5 block font-display font-semibold text-ink">{c.value}</span>
                    </span>
                    {c.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
              <li className="ct-card flex items-start gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-mist text-royal ring-1 ring-royal/15">
                  <MapPin aria-hidden size={20} strokeWidth={1.5} />
                </span>
                <address className="not-italic">
                  <span className="label block !text-[10px] text-slate">Office</span>
                  {contact.address.lines.map((l) => (
                    <span key={l} className="mt-0.5 block text-[0.95rem] leading-snug text-ink">
                      {l}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>

          <div className="relative">
            <span aria-hidden className="ct-glow pointer-events-none absolute -right-[10%] top-0 size-[70%] rounded-full bg-sky/30 blur-[100px]" />
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}

const initial: EnquiryState = { status: "idle" };

function ContactForm() {
  const [state, action, pending] = useActionState(sendEnquiry, initial);
  const [touched, setTouched] = useState<Errors>({});
  const select = useRef<HTMLSelectElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const errors: Errors = { ...(state.status === "invalid" ? state.errors : {}), ...touched };

  // Preselect the solution when arriving from a solution page (?solution=slug).
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("solution");
    if (s && select.current && !select.current.value && INTERESTS.some((i) => i.value === s)) select.current.value = s;
  }, []);

  useEffect(() => {
    // React resets the form after the action; an uncontrolled <select> ignores new defaultValues, so restore it.
    if (state.values?.interest && select.current) select.current.value = state.values.interest;
    if (state.status === "sent" || state.status === "fallback") done.current?.focus();
    if (state.status === "sent" && done.current && !window.matchMedia(MQ.reduce).matches) {
      gsap.fromTo(done.current.querySelector(".ct-check"), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.9, ease: "back.out(2)" });
    }
  }, [state]);

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const f = e.target.name as Field;
    const msg = validateField(f, e.target.value);
    setTouched((t) => ({ ...t, [f]: msg }));
  };

  if (state.status === "sent") {
    return (
      <div ref={done} tabIndex={-1} role="status" className="ct-form relative rounded-[2rem] bg-white p-10 text-center shadow-card-light outline-none ring-1 ring-ink/5 md:p-14">
        <span className="ct-check mx-auto grid size-20 place-items-center rounded-full text-white [background:var(--grad-brand)] shadow-[0_0_40px_rgb(0_168_252/0.5)]">
          <Check aria-hidden size={36} strokeWidth={2} />
        </span>
        <h3 className="mt-8 font-display text-2xl font-bold text-ink">Thank you — your enquiry is on its way.</h3>
        <p className="mx-auto mt-3 max-w-md text-slate">Our team will get back to you shortly at the email you provided.</p>
      </div>
    );
  }

  const v = state.values ?? {};
  return (
    <form action={action} onSubmit={() => setTouched({})} noValidate className="ct-form relative rounded-[2rem] bg-white p-6 shadow-card-light ring-1 ring-ink/5 sm:p-10">
      {state.status === "fallback" && (
        <div ref={done} tabIndex={-1} role="status" className="mb-8 rounded-2xl bg-mist p-5 outline-none ring-1 ring-royal/20">
          <p className="font-display font-semibold text-ink">Almost there — send it from your email app.</p>
          <p className="mt-1 text-sm text-slate">We couldn&apos;t deliver the form directly, so we&apos;ve prepared the email for you.</p>
          <a href={state.mailto} className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold text-white [background:var(--grad-brand)]">
            <Mail aria-hidden size={16} strokeWidth={1.75} /> Open email to {contact.email}
          </a>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="name" label="Your name" autoComplete="name" required defaultValue={v.name} error={errors.name} onBlur={onBlur} />
        <TextField name="company" label="Company" autoComplete="organization" defaultValue={v.company} error={errors.company} onBlur={onBlur} />
        <TextField name="email" type="email" label="Email" autoComplete="email" required defaultValue={v.email} error={errors.email} onBlur={onBlur} />
        <TextField name="phone" type="tel" label="Phone" autoComplete="tel" defaultValue={v.phone} error={errors.phone} onBlur={onBlur} />
        <div className="sm:col-span-2">
          <div className="relative">
            <select
              ref={select}
              id="f-interest"
              name="interest"
              defaultValue={v.interest ?? ""}
              onBlur={onBlur}
              aria-invalid={!!errors.interest}
              aria-describedby={errors.interest ? "f-interest-err" : undefined}
              className={clsx(fieldBase, "appearance-none pr-12 [&:has(option[value='']:checked)]:text-slate")}
            >
              <option value="">Select a solution (optional)</option>
              {INTERESTS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
            <label htmlFor="f-interest" className="pointer-events-none absolute left-5 top-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-royal">
              Interested in
            </label>
            <ChevronDown aria-hidden size={18} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate" />
          </div>
          <ErrorText id="f-interest-err" msg={errors.interest} />
        </div>
        <div className="sm:col-span-2">
          <TextField name="message" label="Tell us about your project" multiline required defaultValue={v.message} error={errors.message} onBlur={onBlur} />
        </div>
      </div>
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
        <p className="max-w-xs text-xs leading-relaxed text-slate">We use your details only to respond to this enquiry.</p>
        <button
          type="submit"
          disabled={pending}
          className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 font-display text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgb(0_168_252/0.6)] [background:var(--grad-brand)] disabled:opacity-70"
        >
          {pending ? "Sending…" : "Send enquiry"}
          <Send aria-hidden size={16} strokeWidth={1.75} className={clsx("transition-transform duration-500", pending ? "translate-x-1 -translate-y-1" : "group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5")} />
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {state.status === "invalid" ? "Please correct the highlighted fields." : ""}
      </p>
    </form>
  );
}

const fieldBase =
  "peer block w-full rounded-2xl border border-ink/12 bg-mist/60 px-5 pb-3 pt-7 text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-royal focus:bg-white focus:shadow-[0_0_0_4px_rgb(11_91_211/0.12)] aria-[invalid=true]:border-red-500/70";

function TextField({
  name,
  label,
  error,
  multiline,
  ...rest
}: {
  name: Field;
  label: string;
  error?: string;
  multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = `f-${name}`;
  const props = {
    id,
    name,
    placeholder: " ",
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-err` : undefined,
    className: clsx(fieldBase, multiline && "min-h-40 resize-y"),
    ...rest,
  };
  return (
    <div>
      <div className="relative">
        {multiline ? <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={5} /> : <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />}
        {/* floating label: sits in the field until focused/filled */}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-5 top-2 origin-left text-[11px] font-semibold uppercase tracking-[0.14em] text-royal transition-all duration-300 peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-[0.95rem] peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-royal"
        >
          {label}
          {rest.required && <span aria-hidden className="text-electric"> *</span>}
        </label>
      </div>
      <ErrorText id={`${id}-err`} msg={error} />
    </div>
  );
}

function ErrorText({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 pl-2 text-xs font-medium text-red-700">
      {msg}
    </p>
  );
}
