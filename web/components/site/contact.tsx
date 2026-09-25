"use client";

import { useState, FormEvent } from "react";
import { Send, Mail } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const LINKS = [
  {
    href: "https://www.linkedin.com/in/rachelavrill/",
    label: "LinkedIn",
    sub: "in/rachelavrill",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-purple">
        <path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5zM2.9 8.6h4.16V21H2.9zM9.5 8.6h3.99v1.7h.06a4.37 4.37 0 0 1 3.93-2.16c4.2 0 4.98 2.77 4.98 6.37V21h-4.15v-5.5c0-1.31-.02-3-1.83-3s-2.11 1.43-2.11 2.9V21H9.5z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/techrachel-98",
    label: "GitHub",
    sub: "github.com/techrachel-98",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-purple">
        <path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.57.67.48A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
  {
    href: "mailto:techwithrachel@gmail.com",
    label: "Email",
    sub: "techwithrachel@gmail.com",
    icon: <Mail size={16} className="text-purple" />,
  },
];

type Status = { text: string; type: "ok" | "err" } | null;

export function Contact() {
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);

  function openMailFallback(name: string, email: string, message: string) {
    const subject = "Portfolio enquiry from " + name;
    const body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
    window.location.href =
      "mailto:techwithrachel@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !message || !emailOk) {
      setStatus({ text: "Please add your name, a valid email, and a message.", type: "err" });
      return;
    }

    setSending(true);
    setStatus({ text: "Sending…", type: "ok" });

    try {
      const res = await fetch("https://formsubmit.co/ajax/techwithrachel@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error("relay responded " + res.status);
      const data = await res.json();
      // FormSubmit returns HTTP 200 even when it hasn't sent anything yet
      // (e.g. "needs activation") — success is only real when data.success is truthy.
      if (data.success !== true && data.success !== "true") {
        throw new Error(data.message || "relay did not confirm delivery");
      }
      setStatus({ text: "Message sent — I'll get back to you soon.", type: "ok" });
      form.reset();
    } catch {
      openMailFallback(name, email, message);
      setStatus({
        text: "Couldn't reach the mail relay, so I opened your email app instead — if nothing happened, email techwithrachel@gmail.com directly.",
        type: "err",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="py-[78px] lg:py-[116px]">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7 grid lg:grid-cols-[0.82fr_1.18fr] gap-10 lg:gap-15 items-start">
        <Reveal>
          <p className="font-heading font-semibold text-[12.5px] tracking-[0.16em] uppercase text-purple mb-5 inline-flex items-center gap-2.5">
            <span className="w-[26px] h-px bg-purple opacity-50" />
            Contact
          </p>
          <h2 className="font-heading font-bold text-[1.8rem] lg:text-[2.6rem] mb-4">Let&apos;s talk</h2>
          <p className="text-text-soft mb-7.5">
            Building something in AI automation or agentic systems, or hiring for one? Send a note
            and I&apos;ll get back to you.
          </p>
          <ul className="grid gap-3">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener" : undefined}
                  className="flex items-center gap-3.5 text-foreground font-medium text-[14.5px] px-3.5 py-2.75 rounded-xl border border-border bg-card transition-all hover:no-underline hover:border-purple-line hover:translate-x-1 hover:shadow-sm"
                >
                  <span className="shrink-0 w-8.5 h-8.5 rounded-[9px] bg-purple-wash border border-purple-line grid place-items-center">
                    {l.icon}
                  </span>
                  <span className="flex flex-col leading-tight">
                    {l.label}
                    <span className="text-[12px] text-text-faint font-normal">{l.sub}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-[22px] p-6 sm:p-8.5 shadow-[0_2px_8px_rgba(0,0,0,.5),0_28px_60px_-20px_rgba(0,0,0,.7)]"
          >
            <input type="hidden" name="_subject" value="New portfolio enquiry" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="text"
              name="_honey"
              className="absolute -left-[9999px]"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid sm:grid-cols-2 gap-4 mb-4.5">
              <div>
                <label htmlFor="name" className="block font-heading font-semibold text-[12.5px] mb-1.75">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                  className="w-full text-[15px] text-foreground bg-background border border-input rounded-[11px] px-3.5 py-3 placeholder:text-text-faint focus:outline-none focus:border-purple focus:ring-4 focus:ring-purple/20"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-heading font-semibold text-[12.5px] mb-1.75">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="w-full text-[15px] text-foreground bg-background border border-input rounded-[11px] px-3.5 py-3 placeholder:text-text-faint focus:outline-none focus:border-purple focus:ring-4 focus:ring-purple/20"
                />
              </div>
            </div>
            <div className="mb-4.5">
              <label htmlFor="message" className="block font-heading font-semibold text-[12.5px] mb-1.75">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="What are you working on?"
                required
                rows={5}
                className="w-full text-[15px] text-foreground bg-background border border-input rounded-[11px] px-3.5 py-3 placeholder:text-text-faint focus:outline-none focus:border-purple focus:ring-4 focus:ring-purple/20 resize-y min-h-[130px]"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 font-heading font-semibold text-[15px] px-6 py-3.5 rounded-xl text-[#100e16] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98] disabled:opacity-60 disabled:cursor-default disabled:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                boxShadow: "0 10px 30px -10px var(--glow)",
              }}
            >
              Send message
              <Send size={15} />
            </button>
            {status && (
              <p
                role="status"
                aria-live="polite"
                className={`text-sm font-medium mt-3 text-center ${
                  status.type === "ok" ? "text-green-400" : "text-red-400"
                }`}
              >
                {status.text}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
