"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/reveal";

// lucide-react ships generic icons only, not brand logos — the GitHub mark
// is an inline SVG (same path used elsewhere on the site) for consistency.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2A10 10 0 0 0 8.84 21.5c.5.08.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.57.67.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (loading || started.current) return;
    started.current = true;
    const duration = 900;
    let startTime: number | null = null;
    function step(ts: number) {
      if (startTime === null) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [loading, value]);

  return (
    <span
      className={`block font-heading font-bold text-[1.6rem] sm:text-[2.1rem] ${
        loading ? "text-text-faint animate-pulse-skel" : ""
      }`}
      style={
        loading
          ? undefined
          : {
              backgroundImage: "linear-gradient(103deg, #d8b4fe, #a78bfa 70%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }
      }
    >
      {loading ? "—" : display}
    </span>
  );
}

export function GithubStats() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [stats, setStats] = useState({ public_repos: 0, followers: 0, following: 0 });

  useEffect(() => {
    fetch("https://api.github.com/users/techrachel-98")
      .then((r) => {
        if (!r.ok) throw new Error("GitHub API error " + r.status);
        return r.json();
      })
      .then((data) => {
        setStats({
          public_repos: data.public_repos || 0,
          followers: data.followers || 0,
          following: data.following || 0,
        });
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  const loading = status === "loading";

  return (
    <section className="py-[78px] lg:py-[116px] pt-0!">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7">
        <Reveal>
          <div className="bg-card border border-border rounded-[22px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6.5">
              <span className="shrink-0 w-12 h-12 rounded-xl bg-purple-wash border border-purple-line grid place-items-center text-purple">
                <GithubIcon className="w-[22px] h-[22px]" />
              </span>
              <div>
                <h2 className="font-heading font-bold text-[1.25rem] sm:text-[1.6rem] mb-1">
                  Live from GitHub
                </h2>
                <p className="text-text-soft text-[0.92rem]">
                  Pulled straight from the public API for{" "}
                  <a href="https://github.com/techrachel-98" target="_blank" rel="noopener">
                    github.com/techrachel-98
                  </a>
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center px-3 py-5 rounded-[14px] bg-surface-2 border border-border">
                <AnimatedNumber value={stats.public_repos} loading={loading} />
                <span className="block mt-1.5 text-[12.5px] font-medium text-text-faint">Public repos</span>
              </div>
              <div className="text-center px-3 py-5 rounded-[14px] bg-surface-2 border border-border">
                <AnimatedNumber value={stats.followers} loading={loading} />
                <span className="block mt-1.5 text-[12.5px] font-medium text-text-faint">Followers</span>
              </div>
              <div className="text-center px-3 py-5 rounded-[14px] bg-surface-2 border border-border">
                <AnimatedNumber value={stats.following} loading={loading} />
                <span className="block mt-1.5 text-[12.5px] font-medium text-text-faint">Following</span>
              </div>
            </div>

            <p className="mt-4.5 text-[12.5px] text-text-faint text-center">
              {status === "loading" && "Loading live stats…"}
              {status === "ok" && "Live · updated on every page load"}
              {status === "error" && (
                <>
                  Couldn&apos;t reach the GitHub API right now — see{" "}
                  <a href="https://github.com/techrachel-98" target="_blank" rel="noopener">
                    the profile directly
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
