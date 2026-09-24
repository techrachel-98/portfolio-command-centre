"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const st = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setPct(h > 0 ? (st / h) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[100] transition-[width] duration-100 ease-linear"
      style={{
        width: `${pct}%`,
        backgroundImage: "linear-gradient(90deg, var(--foreground), var(--purple))",
      }}
    />
  );
}
