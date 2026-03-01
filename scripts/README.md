# scripts/

Python automation for the lead -> preview page -> outreach workflow.

## Setup

1. Install deps:
   - `pip install -r requirements.txt`

2. Env vars (set either place):
   - Root: `.env.local` (see `.env.example`)
   - Website: `website/.env.local` (see `website/.env.example`)

Scripts accept either:
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (preferred for scripts), or
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` (fallback; requires permissive RLS/policies), or
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from website env)

## Main scripts

- `lead_finder.py`
  - Scrapes Craigslist markets and writes results to `data/leads-auto.json` (local-only).
- `lead_summary.py`
  - Quick stats for `data/leads-auto.json`.
- `enrich-leads.py`
  - Interactive enrichment of Supabase `leads` (marks leads `READY`).
- `generate-preview-sites.py`
  - Pulls `READY` leads from Supabase and writes:
    - `website/public/preview-pages/<slug>.html`
  - Updates lead fields: `preview_page_slug`, `preview_site_url`, `status = SITE_GENERATED`.

- `enrich-gmaps.py`
  - 5-technique email enrichment pipeline (website scrape, SMTP verify, GMaps, Google search, pattern gen).
  - Reads `data/leads-gmaps.json`, writes `data/leads-gmaps-enriched.json`, pushes to Supabase.
- `enrich-phase3.py`
  - Phase 3+4 continuation: Selenium GMaps scraping, website discovery, Google search fallback.
  - Reads `data/leads-gmaps-enriched.json`, pushes updates to Supabase.
- `send-outreach.py`
  - Sends personalized plain-text outreach email with preview site link.
  - Logs campaign to dashboard API first to get a tracked URL.
  - Uses Gmail SMTP (credentials from `.env.local`).
  - Usage: `python send-outreach.py <slug> --email <addr> [--name NAME] [--business BUSINESS] [--dry-run]`

## Legacy

`scripts/legacy/` contains older SQLite/one-off scripts kept only for reference.
