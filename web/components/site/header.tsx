"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#education", label: "Education" },
  { href: "#work", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled((window.scrollY || document.documentElement.scrollTop) > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 640) setMenuOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => !!el,
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive("#" + entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-[60] bg-background/72 backdrop-blur-md backdrop-saturate-150 border-b transition-colors duration-200 ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7 flex items-center justify-between h-[70px]">
        <a href="#top" className="inline-flex items-center gap-2.5 font-heading font-bold text-base tracking-tight">
          <span
            className="w-[30px] h-[30px] rounded-[9px] grid place-items-center text-white text-[15px] font-bold"
            style={{
              background: "linear-gradient(140deg, #241d38, #7c3aed)",
              boxShadow: "0 4px 14px -3px rgba(167,139,250,.35)",
            }}
          >
            R
          </span>
          Rachel Sigamani
        </a>

        <div className="flex items-center gap-7">
          <nav className="hidden sm:flex gap-7 text-[14.5px]">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`relative py-1 font-medium transition-colors hover:text-foreground ${
                  active === l.href ? "text-foreground" : "text-text-soft"
                }`}
              >
                {l.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] rounded bg-purple transition-all duration-200 ${
                    active === l.href ? "w-full" : "w-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden w-[38px] h-[38px] grid place-items-center rounded-[10px] border border-border bg-card text-foreground cursor-pointer"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(.16,.8,.24,1)] border-t ${
          menuOpen ? "max-h-[260px] border-border" : "max-h-0 border-transparent"
        }`}
      >
        <nav className="max-w-[1080px] mx-auto px-5 flex flex-col pt-2 pb-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-3.5 px-1 font-heading font-medium text-[15px] text-text-soft border-b border-border last:border-none hover:text-purple"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
