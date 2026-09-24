import {
  Mic,
  Share2,
  GraduationCap,
  Layers,
  Workflow,
  Cpu,
  ArrowLeftRight,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { getProjects, type CmsProject } from "@/lib/supabase";

export const revalidate = 300;

const ICONS: Record<string, LucideIcon> = {
  mic: Mic,
  "share-2": Share2,
  "graduation-cap": GraduationCap,
  layers: Layers,
  workflow: Workflow,
  cpu: Cpu,
  "arrow-left-right": ArrowLeftRight,
};

// Fallback content — rendered whenever the database connector isn't configured
// (no env vars) or the API call fails for any reason, so the section never
// breaks or shows up empty.
const FALLBACK_PROJECTS: CmsProject[] = [
  {
    icon: "mic",
    category: "AI Assistant",
    status: "Active",
    title: "Jarvis",
    body: "A voice-and-text AI assistant built in phases — speech pipeline, LLM orchestration, memory, and task automation — now integrated with n8n for real-world workflow triggering.",
    chips: ["Speech pipeline", "LLM orchestration", "Memory", "n8n"],
    link: null,
  },
  {
    icon: "share-2",
    category: "Automation",
    status: "Active",
    title: "n8n Automation Workflow Portfolio",
    body: "A growing set of documented automation builds — meeting-notes processing, contact enrichment, form handling — published on GitHub.",
    chips: ["n8n", "Workflow design", "Documentation"],
    link: { href: "https://github.com/techrachel-98", label: "View on GitHub" },
  },
  {
    icon: "graduation-cap",
    category: "EdTech",
    status: "Active",
    title: "GradTech AI",
    body: "An LLM-powered grading platform for Malaysian schools, built with React and the Claude API, with teacher, student, and parent portals.",
    chips: ["React", "Claude API", "EdTech", "Multi-portal"],
    link: null,
  },
];

export async function Projects() {
  const cmsProjects = await getProjects();
  const projects = cmsProjects && cmsProjects.length > 0 ? cmsProjects : FALLBACK_PROJECTS;

  return (
    <section id="work" className="py-[78px] lg:py-[116px] bg-secondary border-t border-b border-border">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-7">
        <Reveal>
          <p className="font-heading font-semibold text-[12.5px] tracking-[0.16em] uppercase text-purple mb-5 inline-flex items-center gap-2.5">
            <span className="w-[26px] h-px bg-purple opacity-50" />
            Projects
          </p>
          <h2 className="font-heading font-bold text-[1.8rem] lg:text-[2.6rem] mb-3.5">
            Things I&apos;ve built with AI
          </h2>
          <p className="text-text-soft max-w-[560px] mb-13">
            Projects across assistants, automation, and applied LLM products.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-[520px] md:max-w-none mx-auto md:mx-0">
          {projects.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Layers;
            return (
              <Reveal key={p.title} delay={i * 80}>
                <article className="group relative flex flex-col h-full bg-card border border-border rounded-[22px] p-7 pb-7 overflow-hidden transition-all hover:-translate-y-1.5 hover:border-purple-line hover:shadow-[0_2px_8px_rgba(0,0,0,.5),0_28px_60px_-20px_rgba(0,0,0,.7)]">
                  <span
                    className="absolute left-0 top-0 right-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ background: "linear-gradient(90deg, var(--foreground), var(--purple))" }}
                  />
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-11 h-11 rounded-xl bg-purple-wash border border-purple-line grid place-items-center text-purple transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
                      <Icon size={21} />
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="font-heading font-semibold text-[11px] tracking-wider uppercase text-text-faint">
                        {p.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-purple">
                        <span className="relative w-1.5 h-1.5 rounded-full bg-purple">
                          <span className="animate-ping-dot absolute -inset-[3px] rounded-full bg-purple opacity-35" />
                        </span>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-[1.28rem] tracking-tight mb-3">{p.title}</h3>
                  <p className="text-text-soft text-[0.97rem] leading-relaxed">{p.body}</p>
                  <div className="flex flex-wrap gap-1.75 mt-auto pt-5">
                    {p.chips.map((chip) => (
                      <span
                        key={chip}
                        className="font-heading text-[11.5px] font-medium text-purple bg-purple-wash border border-purple-line px-2.5 py-1 rounded-full"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  {p.link && (
                    <a
                      href={p.link.href}
                      target="_blank"
                      rel="noopener"
                      className="group/link mt-4 inline-flex items-center gap-1.5 self-start font-heading font-semibold text-[13.5px] hover:no-underline"
                    >
                      {p.link.label}
                      <ExternalLink size={13} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
