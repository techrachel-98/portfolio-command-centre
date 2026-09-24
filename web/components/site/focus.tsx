import { Workflow, ArrowLeftRight } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const CARDS = [
  {
    index: "01",
    icon: Workflow,
    title: "AI Automation & Agentic Systems",
    body: "Workflows and agents that connect AI to real tools and real triggers — not chat windows that go nowhere. Speech pipelines, LLM orchestration, memory, and automation wired through n8n so the system actually acts on its own.",
    chips: ["Agent orchestration", "n8n workflows", "Task automation", "Memory & state"],
  },
  {
    index: "02",
    icon: ArrowLeftRight,
    title: "Software with AI Built In",
    body: "Full-stack applications where an LLM API is core product logic, not a feature bolted on afterward — designed, built, and shipped end to end with real users, real portals, and production concerns like auth, data, and deployment.",
    chips: ["Claude API", "React / Next.js", "Full-stack delivery", "Multi-role portals"],
  },
];

export function Focus() {
  return (
    <section className="py-[78px] lg:py-[116px] pt-0!">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7">
        <Reveal>
          <p className="font-heading font-semibold text-[12.5px] tracking-[0.16em] uppercase text-purple mb-5 inline-flex items-center gap-2.5">
            <span className="w-[26px] h-px bg-purple opacity-50" />
            What I do
          </p>
          <h2 className="font-heading font-bold text-[1.6rem] lg:text-[2.2rem] mb-2.5">
            Two disciplines, one goal — AI that ships
          </h2>
          <p className="text-text-soft max-w-[560px] mb-10">
            Everything I build falls into one of these, usually both at once.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-5.5">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <article className="group relative bg-card border border-border rounded-[22px] p-7 overflow-hidden transition-all hover:-translate-y-1.5 hover:border-purple-line hover:shadow-[0_2px_8px_rgba(0,0,0,.5),0_28px_60px_-20px_rgba(0,0,0,.7)]">
                <span
                  className="absolute left-0 top-0 right-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: "linear-gradient(90deg, var(--foreground), var(--purple))" }}
                />
                <span className="absolute top-6 right-7 font-heading font-bold text-[44px] leading-none text-border opacity-80 pointer-events-none">
                  {c.index}
                </span>
                <span className="relative w-11 h-11 rounded-xl bg-purple-wash border border-purple-line grid place-items-center text-purple mb-4.5">
                  <c.icon size={21} />
                </span>
                <h3 className="relative font-heading font-semibold text-[1.2rem] tracking-tight mb-3">
                  {c.title}
                </h3>
                <p className="relative text-text-soft text-[0.96rem] leading-relaxed">{c.body}</p>
                <div className="relative flex flex-wrap gap-1.75 mt-5">
                  {c.chips.map((chip) => (
                    <span
                      key={chip}
                      className="font-heading text-[11.5px] font-medium text-purple bg-purple-wash border border-purple-line px-2.5 py-1 rounded-full"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
