/**
 * Server-only Supabase content reads (Projects + Education).
 *
 * Uses Supabase's REST API directly with the project's publishable key — no
 * SDK needed. Row-level security on both tables only allows public SELECT of
 * rows where `published = true`, so this key can read but never write.
 *
 * Both getters return `null` — never throw — when the connector isn't
 * configured (missing env vars) or the request fails for any reason (network
 * error, project paused, bad key, etc.). Callers fall back to hardcoded content
 * in that case, so the site never breaks or shows an empty section just because
 * the database is unreachable.
 *
 * This only ever reads short display copy — it has no connection to the actual
 * systems the project cards describe.
 */

const REVALIDATE_SECONDS = 300;

async function query<T>(table: string, select: string): Promise<T[] | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?select=${select}&order=sort_order.asc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${await res.text()}`);
    return (await res.json()) as T[];
  } catch (err) {
    console.error(`[supabase] ${table} read failed, falling back to hardcoded content:`, err);
    return null;
  }
}

export type CmsProject = {
  title: string;
  category: string;
  status: string;
  body: string;
  chips: string[];
  icon: string;
  link: { href: string; label: string } | null;
};

type ProjectRow = {
  title: string;
  category: string;
  status: string;
  description: string;
  chips: string[];
  icon: string;
  link_url: string | null;
  link_label: string | null;
};

export async function getProjects(): Promise<CmsProject[] | null> {
  const rows = await query<ProjectRow>(
    "projects",
    "title,category,status,description,chips,icon,link_url,link_label",
  );
  if (!rows) return null;
  return rows.map((r) => ({
    title: r.title,
    category: r.category,
    status: r.status,
    body: r.description,
    chips: r.chips ?? [],
    icon: r.icon,
    link: r.link_url ? { href: r.link_url, label: r.link_label || "View project" } : null,
  }));
}

export type CmsEducation = {
  title: string;
  institution: string;
  location: string;
  tag: string;
};

type EducationRow = {
  course: string;
  institution: string;
  location: string;
  tag: string;
};

export async function getEducation(): Promise<CmsEducation[] | null> {
  const rows = await query<EducationRow>("education", "course,institution,location,tag");
  if (!rows) return null;
  return rows.map((r) => ({
    title: r.course,
    institution: r.institution,
    location: r.location,
    tag: r.tag,
  }));
}
