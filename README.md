# ClockOutNow

Outbound email + preview website workflow with click-tracking and an admin dashboard.

## What’s here

- **`website/`**: Next.js site with:
  - `/preview/[slug]` route that serves static HTML preview pages from `website/public/preview-pages/`
  - `/admin` dashboard to log campaigns and view analytics (Supabase-backed)
- **`scripts/`**: Python automation for lead enrichment and preview-page generation (Supabase-backed)
- **`website/supabase/migrations/`**: Database schema for Supabase (`campaigns`, `page_views`, `leads`)

## Source of truth

- **Campaign tracking + analytics:** Supabase tables `campaigns` + `page_views`
- **Lead records:** Supabase table `leads`
- **Preview pages (what prospects see):** `website/public/preview-pages/*.html`

## Quick start (local)

1. **Website**
   - `cd website`
   - `npm install`
   - Copy `website/.env.example` → `website/.env.local` and fill values
   - `npm run dev` then open `http://localhost:3000/admin`

2. **Scripts**
   - `pip install -r requirements.txt`
   - Copy `.env.example` → `.env.local` (optional; scripts can also read `website/.env.local`)
   - Run:
     - `python scripts/enrich-leads.py`
     - `python scripts/generate-preview-sites.py`

## Docs

See `docs/PROCESS.md` for the operating loop and `docs/setup-checklist.md` for setup steps.

## Security

- Never commit `.env.local` files (see `.gitignore`).
- If any secrets ever lived in this folder, assume they’re compromised and rotate them.

