/**
 * Job ↔ portfolio matching. Pure functions, safe to import on server or client.
 *
 * Plain keyword matching: a job's title/description is checked against the
 * skills listed on the site (About, Focus, tech marquee). No LLM call involved.
 */

export type Skill = { name: string; aliases: string[] };

// Edit this list to change what counts as a match.
export const SKILLS: Skill[] = [
  { name: "AI Tools", aliases: ["ai tools", "generative ai", "genai", "ai", "artificial intelligence"] },
  { name: "Claude Code", aliases: ["claude code", "claude", "anthropic"] },
  { name: "n8n Automation", aliases: ["n8n", "workflow automation", "automation", "zapier", "make.com"] },
  { name: "LLM & Agents", aliases: ["llm", "llms", "large language model", "agent", "agents", "agentic", "rag", "prompt engineering"] },
  { name: "Python", aliases: ["python", "fastapi", "django", "flask"] },
  { name: "React / Next.js", aliases: ["react", "next.js", "nextjs"] },
  { name: "TypeScript", aliases: ["typescript", "javascript", "node.js", "nodejs"] },
  { name: "Full-Stack", aliases: ["full-stack", "full stack", "fullstack"] },
  { name: "Supabase / Postgres", aliases: ["supabase", "postgres", "postgresql", "sql"] },
  { name: "APIs & Integrations", aliases: ["api", "apis", "rest", "webhook", "webhooks", "integration", "integrations"] },
];

export type MatchLevel = "strong" | "good" | "explore";

export type JobMatch = {
  level: MatchLevel;
  score: number;
  skills: string[];
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const PATTERNS = SKILLS.map((skill) => ({
  name: skill.name,
  re: new RegExp(`(?<![a-z0-9])(?:${skill.aliases.map(escape).join("|")})(?![a-z0-9])`, "i"),
}));

/**
 * score = 2 points per skill found in the title + 1 per skill found only in the
 * description. Level: 3+ distinct skills → strong, 1–2 → good, 0 → explore.
 */
export function scoreJob(title: string, description: string): JobMatch {
  const skills: string[] = [];
  let score = 0;
  for (const { name, re } of PATTERNS) {
    if (re.test(title)) {
      skills.push(name);
      score += 2;
    } else if (re.test(description)) {
      skills.push(name);
      score += 1;
    }
  }
  const level: MatchLevel = skills.length >= 3 ? "strong" : skills.length >= 1 ? "good" : "explore";
  return { level, score, skills };
}

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string | null;
  postedAt: string | null;
  snippet: string;
  match: JobMatch;
};

export type SortKey = "match" | "date";

export function sortJobs(jobs: Job[], key: SortKey): Job[] {
  const time = (j: Job) => {
    const t = j.postedAt ? Date.parse(j.postedAt) : NaN;
    return Number.isNaN(t) ? 0 : t;
  };
  return [...jobs].sort((a, b) =>
    key === "match" ? b.match.score - a.match.score || time(b) - time(a) : time(b) - time(a),
  );
}
