# Rachel Sigamani — Personal Portfolio

AI Builder & Full-Stack Developer site. Dark-only, black + purple design. Keep changes simple and direct.

## Layout
- `web/` — the real site (Next.js 16, App Router, TypeScript, Tailwind v4, shadcn, React Three Fiber).
- `index.html` (root) — legacy static version. Untouched, kept as fallback.
- `.claude/launch.json` — dev configs: `personal-website-next` (port 3000), `personal-website` (static, port 5500).

## Rules
- Read `web/AGENTS.md` and `web/node_modules/next/dist/docs/` before writing Next.js code (this version has breaking changes).
- Never print or commit secrets. Env lives in gitignored `web/.env.local`.
- Rachel does account signups and OAuth herself; never enter credentials for her.
- Every external read or write must fail gracefully (hardcoded fallback content or `mailto:`).
- Dark mode only. No theme toggle.

## Content (Supabase)
- Project "Personal Web" (`plyejkswknlqvjpjrdki`). Tables: `projects`, `education`.
- RLS on, public SELECT of `published = true` only, plus `GRANT SELECT` (both are needed).
- Read in `web/lib/supabase.ts` via plain fetch. Env: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`.
- Fallbacks are hardcoded in `components/site/projects.tsx` and `education.tsx`. Revalidate 300s.

## Contact form
- Currently FormSubmit AJAX in `web/components/site/contact.tsx` (activated), with a `mailto:` fallback. Check `data.success`, not just HTTP 200.
- Planned: n8n Cloud webhook to Gmail, after Rachel gets n8n Cloud (end of month). Plan: `C:\Users\Rachel\.claude\plans\i-need-to-have-woolly-thunder.md`.

## Admin panel (`/admin`, not linked from the public site)
- Layout modelled on the CoreUI React dashboard: sidebar + header + stat cards + tables (`components/admin/shell.tsx`, dark theme kept).
- Pages: `app/admin/(panel)/page.tsx` (dashboard), `app/admin/(panel)/jobs/page.tsx` (Job Match), `app/admin/login/page.tsx`.
- Auth: `ADMIN_PASSWORD` (8+ chars, Rachel types it herself in `web/.env.local`) → HMAC-signed httpOnly cookie, 8h (`lib/admin-auth.ts`). Unset/short = admin disabled. Every admin page calls `requireAdmin()`; `/api/jobs` returns 401 unless signed in. Login is rate limited (5 / 10 min per IP).
- Password change = edit env var and restart (also signs everyone out). No in-app change: no DB write access by design.

## Job Match (LinkedIn via Apify) — admin only
- `components/admin/job-match-panel.tsx` (client) → `GET /api/jobs?q=&location=` (`app/api/jobs/route.ts`) → Apify actor `curious_coder~linkedin-jobs-scraper` (override with `APIFY_ACTOR_ID`).
- Scoring is plain keyword matching in `lib/job-match.ts` (edit `SKILLS` there): 3+ skills = Strong (green), 1–2 = Good (yellow), 0 = Explore (red). Sort by Match Score or Date Posted.
- Env: `APIFY_TOKEN` in `web/.env.local` (Rachel adds it herself). Without it the API returns labelled sample data.
- Applied tracking: "Applied" checkbox column + all-time counter. Stored in Supabase `public."Job Applied"` (Rachel renamed it from `applications`; RLS on, no policies, grants only to `service_role`) via `SUPABASE_SERVICE_ROLE_KEY` (server-only secret Rachel pastes herself; never expose or commit). Code: `lib/applications.ts`, `app/api/admin/applications/route.ts` (admin-only). Sample jobs can't be tracked.
- Public endpoint spends Apify credits: 10-min in-memory cache + 5 searches/10 min per IP (best-effort on serverless).

## Deploy (Vercel, later)
- Root Directory = `web`. Add the env vars there (`.env.local` isn't deployed).

## Pitfalls
- Don't name a variable `status` in browser scripts (collides with `window.status`).
- Lucide has no brand icons; use inline SVGs.
- Node fetch may resolve `localhost` to IPv6; use `127.0.0.1` for local services.
