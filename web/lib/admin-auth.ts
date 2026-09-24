/**
 * Minimal admin auth: one password (ADMIN_PASSWORD) → signed, httpOnly session cookie.
 * The cookie value is `<expiry>.<hmac>`; the HMAC key is the password itself, so
 * changing the password signs everyone out. If ADMIN_PASSWORD is unset the admin
 * panel is disabled entirely.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 8;

const sign = (payload: string, password: string) =>
  createHmac("sha256", password).update(payload).digest("hex");

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

// A missing or too-short password disables the admin panel.
export const adminConfigured = () => (process.env.ADMIN_PASSWORD ?? "").length >= 8;

export function passwordMatches(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !adminConfigured()) return false;
  // Compare HMACs so length differences don't leak.
  return safeEqual(sign(input, "cmp"), sign(password, "cmp"));
}

export function createSessionValue(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const expiry = String(Date.now() + SESSION_SECONDS * 1000);
  return `${expiry}.${sign(expiry, password)}`;
}

export async function isAdmin(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !adminConfigured()) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [expiry, sig] = value.split(".");
  if (!expiry || !sig || Number(expiry) < Date.now()) return false;
  return safeEqual(sig, sign(expiry, password));
}

/** Call at the top of every admin page (layouts don't re-run on client navigation). */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
