import { isAdmin } from "@/lib/admin-auth";
import { scoreJob, type Job } from "@/lib/job-match";

export const maxDuration = 60;

const ACTOR_ID = process.env.APIFY_ACTOR_ID || "curious_coder~linkedin-jobs-scraper";
const RESULT_LIMIT = 10;
const CACHE_MS = 10 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Best-effort, per server instance. Protects Apify credits from casual abuse.
const cache = new Map<string, { at: number; jobs: Job[] }>();
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

type RawJob = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v : "");

function normalize(raw: RawJob, i: number): Job | null {
  const title = str(raw.title).trim();
  if (!title) return null;
  const description = str(raw.descriptionText) || str(raw.description);
  const link = str(raw.link) || str(raw.url);
  return {
    id: str(raw.id) || `${i}-${title}`,
    title,
    company: str(raw.companyName) || str(raw.company) || "Unknown company",
    location: str(raw.location),
    url: /^https:\/\//.test(link) ? link : null,
    postedAt: str(raw.postedAt) || str(raw.publishedAt) || null,
    snippet: description.replace(/\s+/g, " ").trim().slice(0, 260),
    match: scoreJob(title, description),
  };
}

// Shown when APIFY_TOKEN isn't configured, so the UI is still usable.
const SAMPLE: { title: string; company: string; location: string; days: number; description: string }[] = [
  { title: "AI Automation Engineer", company: "Northwind Labs", location: "Kuala Lumpur, Malaysia", days: 1, description: "Build n8n workflow automation and LLM agents. Python, APIs, webhook integrations, Claude." },
  { title: "Full-Stack Developer (React / Next.js)", company: "Brightpath", location: "Remote", days: 3, description: "TypeScript, React, Next.js, Postgres. Some AI features using LLM APIs." },
  { title: "Customer Support Lead", company: "Harbor & Co", location: "Penang, Malaysia", days: 2, description: "Lead a support team, handle escalations and reporting." },
  { title: "Software Engineer", company: "Kite Systems", location: "Singapore", days: 6, description: "Python backend services, REST APIs and SQL databases." },
];

function sampleJobs(): Job[] {
  return SAMPLE.map((s, i) => ({
    id: `sample-${i}`,
    title: s.title,
    company: s.company,
    location: s.location,
    url: null,
    postedAt: new Date(Date.now() - s.days * 86_400_000).toISOString(),
    snippet: s.description,
    match: scoreJob(s.title, s.description),
  }));
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
  const location = (searchParams.get("location") ?? "").trim().slice(0, 100);
  if (!q) return Response.json({ error: "Enter a job title or keywords." }, { status: 400 });

  const token = process.env.APIFY_TOKEN;
  if (!token) return Response.json({ jobs: sampleJobs(), demo: true });

  // refresh=1 skips the cache read (still rate limited) and re-scrapes.
  const refresh = searchParams.get("refresh") === "1";
  const key = `${q.toLowerCase()}|${location.toLowerCase()}`;
  const cached = cache.get(key);
  if (!refresh && cached && Date.now() - cached.at < CACHE_MS) return Response.json({ jobs: cached.jobs });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "Too many searches. Try again in a few minutes." }, { status: 429 });
  }

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?timeout=50`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ keywords: q, location, limitPerSource: RESULT_LIMIT }),
        signal: AbortSignal.timeout(55_000),
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error(`Apify responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const items = (await res.json()) as RawJob[];
    const jobs = items.map(normalize).filter((j): j is Job => j !== null);
    cache.set(key, { at: Date.now(), jobs });
    return Response.json({ jobs });
  } catch (err) {
    console.error("[jobs] Apify request failed:", err);
    return Response.json({ error: "Couldn't fetch jobs right now. Please try again." }, { status: 502 });
  }
}
