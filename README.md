# Portfolio Command Centre

A personal portfolio site for **Rachel Sigamani** (AI Builder & Full-Stack Developer) with a private **admin command centre** behind it, including an **Apify-powered LinkedIn job search** that scores every job against her skills.

Two things in one Next.js app:

1. **The public portfolio**: a fast, dark black-and-purple site whose Projects and Education are editable from a database.
2. **The admin command centre** (`/admin`): a password-protected dashboard with Job Match, which finds LinkedIn jobs, scores them against her skill set, and tracks which ones she has applied to.

---

## What's inside

### 1. Personal portfolio (public)

- **Hero** with an interactive WebGL gradient orb (React Three Fiber) and smooth scroll/pointer parallax.
- **Sections:** About, Focus, Education, Projects, live GitHub stats, Contact.
- **Content from a database.** Projects and Education are read from **Supabase**, so they can be edited without touching code or redeploying (changes appear within ~5 minutes). Every section has hardcoded fallback content, so the site never breaks if the database is unreachable.
- **Contact form** (FormSubmit, with a `mailto:` fallback) and a floating **WhatsApp** button.
- Dark-only design, responsive, accessible navigation with scroll-spy and a scroll progress bar.

### 2. Admin command centre (private, `/admin`)

Not linked from the public site and marked `noindex`. Sign in with a single password.

- **Dashboard:** counts of Projects and Education, job-search status, and a data-sources table.
- **Job Match**, powered by [Apify](https://apify.com):
  - Searches **LinkedIn** live by keywords and location through an Apify actor (10 jobs per search).
  - Every job gets a **Match badge** from plain keyword matching against the skills in `web/lib/job-match.ts` (AI tools, Claude Code, n8n automation, LLMs and agents, Python, React/Next.js, TypeScript, Supabase, APIs and more):
    - 🟢 **Strong Match**: 3 or more skills found
    - 🟡 **Good Match**: 1–2 skills found
    - 🔴 **Explore**: no skills found
  - **Sort** by Match Score or Date Posted, with a **Refresh** button that skips the 10-minute cache and re-scrapes.
  - **Applied tracking:** tick a job once you've applied on LinkedIn. It's saved to Supabase, and an "Applied (all time)" counter keeps the total.
  - Without an Apify token, it falls back to labelled sample data so the UI still works.

---

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js (App Router, Server Components, Route Handlers), React, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, lucide-react |
| 3D | three.js, React Three Fiber |
| Database | Supabase (Postgres, Row Level Security, PostgREST) |
| Job data | Apify (LinkedIn Jobs Scraper actor) |
| Auth | Password → HMAC-signed, httpOnly session cookie |
| Hosting | Vercel |

## How it fits together

```
Visitor ──► Portfolio (Server Components) ──► Supabase  [projects, education]  (public key, read-only, RLS)

Admin ──► /admin (cookie session)
            ├─ Job Match ──► /api/jobs ──► Apify (LinkedIn scraper) ──► keyword scoring
            └─ Applied ticks ──► /api/admin/applications ──► Supabase ["Job Applied"]  (service key, server-only)
```

## Security notes

- **Public Supabase key is read-only.** RLS allows `SELECT` only on rows where `published = true`.
- **Applied-jobs table is locked.** RLS is on with no policies and grants only to `service_role`. It is reachable only through admin-authenticated server routes, and the secret key never reaches the browser.
- **Admin auth:** constant-time password comparison, signed httpOnly cookie (8 hours), login rate limiting, and every admin page and API route checks the session.
- **Job API protection:** `/api/jobs` requires the admin session, caches results for 10 minutes and is rate limited to protect Apify credits. The in-memory limits are best-effort on serverless.
- **No secrets in the repo.** Copy `web/.env.example` to `web/.env.local` and fill in your own values.

---

## Getting started

```bash
git clone https://github.com/techrachel-98/portfolio-command-centre.git
cd portfolio-command-centre/web
cp .env.example .env.local     # then fill in your values
npm install
npm run dev
```

Open <http://localhost:3000>. The admin panel is at <http://localhost:3000/admin/login>.

### Environment variables (`web/.env.local`)

| Variable | Required | Purpose |
|---|---|---|
| `SUPABASE_URL` | for CMS content | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | for CMS content | Public read-only key |
| `ADMIN_PASSWORD` | for `/admin` | Your admin password, 8+ characters. Unset means admin is disabled |
| `APIFY_TOKEN` | for live jobs | Apify API token. Without it you get sample data |
| `APIFY_ACTOR_ID` | optional | Override the actor (default `curious_coder~linkedin-jobs-scraper`) |
| `SUPABASE_SERVICE_ROLE_KEY` | for Applied tracking | Server-only secret. Never expose it |

Everything degrades gracefully: with no env vars at all, the portfolio still renders using its built-in content.

### Supabase setup

Create three tables (Projects and Education are public-read, Applied is admin-only):

```sql
create table public.projects (
  id bigint generated always as identity primary key,
  title text not null, category text not null, status text not null default 'Active',
  description text not null, chips text[] not null default '{}',
  icon text not null default 'layers', link_url text, link_label text default 'View project',
  sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.education (
  id bigint generated always as identity primary key,
  course text not null, institution text not null, location text not null,
  tag text not null default 'Course',
  sort_order int not null default 0, published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.projects  enable row level security;
alter table public.education enable row level security;
create policy "Public can read published projects"  on public.projects  for select to anon, authenticated using (published);
create policy "Public can read published education" on public.education for select to anon, authenticated using (published);
grant select on public.projects, public.education to anon, authenticated;

-- Admin-only: RLS on, no policies, service role only
create table public."Job Applied" (
  job_id text primary key, title text not null,
  company text not null default '', location text not null default '',
  url text, applied_at timestamptz not null default now()
);
alter table public."Job Applied" enable row level security;
revoke all on public."Job Applied" from anon, authenticated;
grant select, insert, update, delete on public."Job Applied" to service_role;
```

Project `icon` values supported on the site: `mic`, `share-2`, `graduation-cap`, `layers`, `workflow`, `cpu`, `arrow-left-right`.

## Deploy on Vercel

1. Import this repository in Vercel.
2. Set **Root Directory** to `web`.
3. Add the environment variables above (`.env.local` is not deployed).
4. Deploy. Changes to Projects and Education in Supabase appear on the live site within about 5 minutes with no redeploy. Applied ticks are instant.

## Project structure

```
.
├── index.html            Original single-file static version (kept as a fallback)
└── web/                  The Next.js app (Vercel root directory)
    ├── app/
    │   ├── page.tsx                 Public portfolio
    │   ├── admin/                   Login, dashboard, Job Match
    │   └── api/                     jobs, admin login/logout, applications
    ├── components/
    │   ├── site/                    Portfolio sections
    │   ├── admin/                   Admin shell and Job Match panel
    │   └── ui/                      shadcn + gradient orb
    └── lib/
        ├── supabase.ts              Public content reads (with fallbacks)
        ├── applications.ts          Applied-jobs storage (service role)
        ├── admin-auth.ts            Password → signed session cookie
        └── job-match.ts             Skills list, scoring and sorting
```

## Roadmap

- Route the contact form through an n8n webhook to Gmail (currently FormSubmit).
- AI chat assistant for visitors.
- An MCP server exposing portfolio data.

## Contact

Built by **Rachel Sigamani**. [GitHub](https://github.com/techrachel-98) · [LinkedIn](https://www.linkedin.com/in/rachelavrill/)

> The Apify job search scrapes LinkedIn through a third-party Apify actor. Check LinkedIn's terms and Apify's pricing before using it heavily.
