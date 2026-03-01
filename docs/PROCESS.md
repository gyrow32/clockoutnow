# ClockOutNow Process

Goal: find prospects, generate a preview website, send a tracked link, and measure clicks + replies.

## Components

1. **Lead ingestion**
   - Input lives in Supabase `leads` (canonical).
   - Optional scraping output: `scripts/lead_finder.py` → `data/leads-auto.json` (local-only).

2. **Lead enrichment (manual)**
   - `scripts/enrich-leads.py` adds enrichment fields in Supabase and marks a lead `READY`.

3. **Preview page generation**
   - `scripts/generate-preview-sites.py` pulls `READY` leads and writes:
     - `website/public/preview-pages/<slug>.html`
   - Updates Supabase lead fields:
     - `preview_page_slug`, `preview_site_url`, `status = SITE_GENERATED`

4. **Outreach + tracking**
   - Use the admin dashboard at `website/src/app/admin` (`/admin`) to:
     - log emails in `campaigns`
     - generate a tracking URL
   - Preview pages call `POST /api/track-view` which writes to `page_views`.

## Status conventions

### Leads (`leads.status`)
`NEW` → `RESEARCHING` → `READY` → `SITE_GENERATED` → `IMAGE_GENERATED` → `CONTACTED` → `REPLIED` → `CLOSED` (or `SKIPPED`)

### Campaigns (`campaigns.status`)
`CONTACTED` → `REPLIED` → `CLOSED`

## Where to find things

- Strategy / ops notes: `docs/ops/`
- Logs / history: `docs/logs/` and `docs/archive/`
- Local-only inputs/outputs (ignored by git): `data/`

