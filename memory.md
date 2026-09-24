# Project memory (current state)

## Done
- Next.js migration of the portfolio, with the gradient-orb hero.
- Sections: Hero, Capability strip, Tech marquee, About, Focus, Education, Projects, GitHub stats, Contact, WhatsApp button.
- Projects and Education editable in Supabase. The fallback content shows if the database is unreachable.
- Contact form live on FormSubmit.

## Decisions
- Notion CMS was dropped in favour of Supabase. Revoke the old Notion connection (user task).
- No `messages` table in Supabase (declined).
- Keep FormSubmit for now. n8n Cloud arrives at the end of the month, then implement the plan. Revisit "n8n only" vs "n8n plus FormSubmit backup".

## Ideas, not committed
- AI chat assistant (free tier LLM, with rate limiting).
- Own MCP server exposing portfolio data.
- Analytics.

## Notes
- WhatsApp number and contact email are already in the code; no secrets are stored in these docs.
