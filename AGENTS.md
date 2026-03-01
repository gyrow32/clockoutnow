# Agent Notes (ClockOutNow)

## Mission
Generate **preview websites** for cold outbound, send **tracked links**, and measure **clicks + replies** in an admin dashboard.

## Canonical components
- **Next.js app:** `website/`
- **Automation scripts:** `scripts/`
- **Supabase schema:** `website/supabase/migrations/`
- **Preview page files:** `website/public/preview-pages/*.html`

## Source of truth (avoid duplicates)
- Leads/campaigns/analytics live in **Supabase** (`leads`, `campaigns`, `page_views`).
- Treat `docs/ops/leads.md`, `data/*`, and `tools/legacy/*` as **legacy or local-only** unless explicitly re-adopted.

## Security rules
- Never add real API keys/passwords to code or docs.
- Env files must be local-only: `.env.local`, `website/.env.local`.
- If you find secrets in repo history/files, redact + instruct rotation.

## Local run
- Website: `cd website && npm run dev`
- Scripts: `pip install -r requirements.txt` then run scripts in `scripts/`

