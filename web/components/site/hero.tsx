"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { GradientOrb } from "@/components/ui/gradient-orb";

/**
 * Lightweight scroll + pointer parallax, ported from the original site's
 * vanilla-JS engine: each ref gets a translate3d driven by an eased
 * (lerp) loop so movement feels smooth rather than snapping to the target.
 */
function useParallax() {
  const bgRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce) return;

    const targets = [
      { el: bgRef.current, scroll: 0.18, mouse: 0 },
      { el: blob1Ref.current, scroll: 0.32, mouse: 26 },
      { el: blob2Ref.current, scroll: -0.16, mouse: -18 },
    ].filter((t): t is { el: HTMLDivElement; scroll: number; mouse: number } => !!t.el);
    if (!targets.length) return;

    const state = targets.map(() => ({ cx: 0, cy: 0, tx: 0, ty: 0 }));
    let mx = 0;
    let my = 0;
    let running = false;

    function computeTargets() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      targets.forEach((t, i) => {
        state[i].ty = scrollY * t.scroll + (coarse ? 0 : my * t.mouse);
        state[i].tx = coarse ? 0 : mx * t.mouse;
      });
    }

    function frame() {
      let moving = false;
      targets.forEach((t, i) => {
        const s = state[i];
        s.cx += (s.tx - s.cx) * 0.09;
        s.cy += (s.ty - s.cy) * 0.09;
        if (Math.abs(s.tx - s.cx) > 0.05 || Math.abs(s.ty - s.cy) > 0.05) moving = true;
        t.el.style.transform = `translate3d(${s.cx.toFixed(2)}px, ${s.cy.toFixed(2)}px, 0)`;
      });
      if (moving) requestAnimationFrame(frame);
      else running = false;
    }
    function kick() {
      if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
    }

    const onScroll = () => {
      computeTargets();
      kick();
    };
    const onPointerMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      computeTargets();
      kick();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!coarse) window.addEventListener("pointermove", onPointerMove, { passive: true });
    computeTargets();
    kick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return { bgRef, blob1Ref, blob2Ref };
}

export function Hero() {
  const { bgRef, blob1Ref, blob2Ref } = useParallax();

  return (
    <section className="relative pt-[110px] pb-[90px] lg:pt-[150px] lg:pb-[130px] overflow-hidden isolate">
      <div ref={bgRef} className="hero-grid-bg absolute inset-0 -z-10 will-change-transform" />
      <div
        ref={blob1Ref}
        className="animate-float-blob absolute -top-[140px] -right-[90px] -z-10 w-[420px] h-[420px] rounded-full opacity-55 blur-[70px] will-change-transform"
        style={{ background: "radial-gradient(circle at 30% 30%, var(--purple-soft), transparent 70%)" }}
      />
      <div
        ref={blob2Ref}
        className="animate-float-blob absolute top-[120px] -left-[120px] -z-10 w-[340px] h-[340px] rounded-full opacity-35 blur-[70px] will-change-transform"
        style={{
          background: "radial-gradient(circle at 60% 40%, var(--purple-bright), transparent 70%)",
          animationDelay: "-6s",
        }}
      />

      <div className="max-w-[1080px] mx-auto px-5 sm:px-7 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-text-soft bg-card border border-input rounded-full py-1.5 pl-3 pr-4 mb-7 shadow-sm">
            <span className="relative w-[7px] h-[7px] rounded-full bg-purple">
              <span className="animate-ping-dot absolute -inset-1 rounded-full bg-purple opacity-35" />
            </span>
            Open to AI Automation &amp; AI Engineering roles
          </span>

          <h1 className="font-heading font-bold tracking-tight text-[2.7rem] sm:text-[3.4rem] lg:text-[4.2rem] leading-[1.05] mb-6">
            Rachel <span className="grad-text">Sigamani</span>
          </h1>

          <p className="text-text-soft text-[1.08rem] sm:text-[1.3rem] font-normal leading-snug max-w-[560px]">
            <span className="block text-foreground font-medium">AI Builder &amp; Full-Stack Developer</span>
            <span className="block mt-1">AI Automation, Agents &amp; Applied Engineering</span>
          </p>

          <div className="flex flex-wrap gap-3.5 mt-10">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 font-heading font-semibold text-[15px] px-6 py-3.5 rounded-xl text-[#100e16] transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98]"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                boxShadow: "0 10px 30px -10px var(--glow)",
              }}
            >
              Get in touch
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-2 font-heading font-semibold text-[15px] px-6 py-3.5 rounded-xl bg-card border border-input text-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:border-purple hover:text-purple active:translate-y-0 active:scale-[.98]"
            >
              See what I&apos;m building
            </a>
          </div>
        </div>

        {/* Right: gradient orb */}
        <div className="relative h-[300px] sm:h-[380px] lg:h-[460px] rounded-[28px] border border-border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,.5),0_28px_60px_-20px_rgba(0,0,0,.7)]">
          <GradientOrb config={{ background: "#0b0a0f", hue: -18, rotationSpeed: 0.22, noiseScale: 0.7 }} />
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to explore"
        className="hidden lg:flex absolute left-1/2 bottom-9 -translate-x-1/2 flex-col items-center gap-2 text-text-faint font-heading text-[11px] font-medium tracking-[0.14em] uppercase hover:text-purple hover:no-underline"
      >
        Scroll to explore
        <ArrowDown size={15} className="animate-bob" />
      </a>
    </section>
  );
}
