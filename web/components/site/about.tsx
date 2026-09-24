import { Layers, CheckSquare, Workflow } from "lucide-react";
import { Reveal } from "@/components/site/reveal";

const PRINCIPLES = [
  {
    icon: Layers,
    title: "Architecture to deployment",
    body: "I own the whole path — design, build, ship — not just the prototype.",
  },
  {
    icon: CheckSquare,
    title: "Built to be used",
    body: "Real workflows, real triggers, real users — not screenshots and slide decks.",
  },
  {
    icon: Workflow,
    title: "Agentic by default",
    body: "LLM orchestration, memory, and automation wired into systems that act.",
  },
];

export function About() {
  return (
    <section id="about" className="py-[78px] lg:py-[116px]">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7 grid lg:grid-cols-2 gap-9 lg:gap-15 items-start">
        <Reveal>
          <p className="font-heading font-semibold text-[12.5px] tracking-[0.16em] uppercase text-purple mb-5 inline-flex items-center gap-2.5">
            <span className="w-[26px] h-px bg-purple opacity-50" />
            About
          </p>
          <h2 className="font-heading font-bold text-[1.8rem] lg:text-[2.6rem] leading-tight mb-2">
            Turning AI capability into tools that get used
          </h2>
          <p className="text-foreground text-[1.16rem] font-normal mt-5">
            I&apos;m transitioning into AI Automation and AI Engineering roles, building full-stack
            projects that turn AI capability into practical, working tools.
          </p>
          <p className="text-text-soft text-[1.04rem] mt-4">
            My focus is{" "}
            <strong className="text-foreground">full-stack development with AI integration</strong> —
            building software systems that work and solve real business problems, from architecture
            to deployment. I care about tools that actually get used, not demos that stay demos.
          </p>
          <p className="text-text-soft text-[1.04rem] mt-4">
            Alongside that, I build{" "}
            <strong className="text-foreground">AI automation and agents</strong> that take over
            repetitive business work in real time — workflows and agents that connect AI to real
            systems and trigger real actions, most of it wired through n8n.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <ul className="grid gap-4.5 bg-surface-2 border border-border rounded-[22px] p-6.5">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="flex gap-3.5 text-[0.99rem] text-text-soft">
                <span className="shrink-0 w-8 h-8 rounded-[9px] bg-purple-wash border border-purple-line grid place-items-center text-purple">
                  <p.icon size={16} />
                </span>
                <span>
                  <b className="block text-foreground font-semibold font-heading text-[0.96rem] mb-0.5">
                    {p.title}
                  </b>
                  {p.body}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
