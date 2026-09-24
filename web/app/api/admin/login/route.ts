import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_SECONDS, adminConfigured, createSessionValue, passwordMatches } from "@/lib/admin-auth";

const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return Response.json({ error: "No admin password set. Add ADMIN_PASSWORD (8+ characters) to web/.env.local and restart the server." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";

  if (!passwordMatches(password)) {
    attempts.set(ip, [...recent, now]);
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return Response.json({ ok: true });
}
