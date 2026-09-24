/**
 * Server-only. Tracks jobs Rachel has applied to (public."Job Applied").
 *
 * The table has RLS on with no policies and no public grants, so only the
 * service role key can touch it. That key must never reach the browser: this
 * file is only imported by admin-authenticated route handlers.
 */

export type Application = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  url: string | null;
  applied_at: string;
};

// The table was renamed to "Job Applied" in the Supabase dashboard.
const TABLE = encodeURIComponent("Job Applied");

export const applicationsConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function rest(path: string, init: RequestInit = {}): Promise<Response> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${TABLE}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

export async function listApplications(): Promise<Application[]> {
  const res = await rest("?select=*&order=applied_at.desc");
  return (await res.json()) as Application[];
}

export async function addApplication(a: Omit<Application, "applied_at">): Promise<void> {
  await rest("?on_conflict=job_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(a),
  });
}

export async function removeApplication(jobId: string): Promise<void> {
  await rest(`?job_id=eq.${encodeURIComponent(jobId)}`, { method: "DELETE" });
}
