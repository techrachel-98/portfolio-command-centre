"use client";

import { useEffect, useState } from "react";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      const st = window.scrollY || document.documentElement.scrollTop;
      setShow(st > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/60108874129?text=Hi%20Rachel%2C%20I%20saw%20your%20portfolio%20and%20wanted%20to%20connect!"
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className={`fixed right-[22px] bottom-[22px] z-[80] w-14 h-14 rounded-full bg-[#25d366] text-white grid place-items-center transition-all duration-200 ${
        show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3.5 pointer-events-none"
      }`}
      style={{ boxShadow: "0 10px 28px -8px rgba(37,211,102,.55)" }}
    >
      <span className="animate-wa-ping absolute -inset-1.5 rounded-full border-2 border-[#25d366] opacity-45" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[27px] h-[27px]">
        <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.6 14.3c-.24.66-1.4 1.26-1.93 1.32-.5.06-1.06.27-3.55-.74-2.98-1.22-4.9-4.24-5.05-4.44-.15-.2-1.2-1.6-1.2-3.05s.76-2.17 1.03-2.47c.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.67.52.24.6.83 2.04.9 2.19.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.76.83 2.06.98.3.15.5.22.57.35.08.13.08.75-.16 1.4z" />
      </svg>
    </a>
  );
}
