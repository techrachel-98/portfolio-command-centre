import { isAdmin } from "@/lib/admin-auth";
import { addApplication, applicationsConfigured, listApplications, removeApplication } from "@/lib/applications";

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

async function guard(): Promise<Response | null> {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!applicationsConfigured()) {
    return Response.json(
      { error: "Application tracking is off. Add SUPABASE_SERVICE_ROLE_KEY to web/.env.local and restart." },
      { status: 503 },
    );
  }
  return null;
}

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    return Response.json({ applications: await listApplications() });
  } catch (err) {
    console.error("[applications] list failed:", err);
    return Response.json({ error: "Couldn't load applications." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const job_id = clip(body?.job_id, 200);
  const title = clip(body?.title, 300);
  if (!job_id || !title) return Response.json({ error: "job_id and title are required." }, { status: 400 });
  const url = clip(body?.url, 1000);
  try {
    await addApplication({
      job_id,
      title,
      company: clip(body?.company, 300),
      location: clip(body?.location, 300),
      url: /^https:\/\//.test(url) ? url : null,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[applications] add failed:", err);
    return Response.json({ error: "Couldn't save." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  const jobId = clip(new URL(request.url).searchParams.get("job_id"), 200);
  if (!jobId) return Response.json({ error: "job_id is required." }, { status: 400 });
  try {
    await removeApplication(jobId);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[applications] remove failed:", err);
    return Response.json({ error: "Couldn't remove." }, { status: 502 });
  }
}
