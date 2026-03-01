# Setup Checklist

Use this checklist to get the website + tracking dashboard running locally and connected to Supabase.

## 1) Supabase project

- Create a new Supabase project.
- In Supabase SQL Editor, run migrations in order:
  - `website/supabase/migrations/001_create_tables.sql`
  - `website/supabase/migrations/002_create_leads_table.sql`
  - `website/supabase/migrations/003_add_preview_page_to_leads.sql`
  - `website/supabase/migrations/004_add_website_generation_fields.sql`
- Optional (only if you use website contact/booking forms):
  - `website/supabase-setup.sql`

## 2) Website env vars

- Copy `website/.env.example` → `website/.env.local`
- Set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `ADMIN_ACCESS_KEY`
  - `NEXT_PUBLIC_BASE_URL`

## 3) Run the website

- `cd website`
- `npm install`
- `npm run dev`
- Open `http://localhost:3000/admin` and unlock with your `ADMIN_ACCESS_KEY`.

## 4) Smoke test tracking

- Create a campaign in `/admin` and copy the tracking URL.
- Open the tracking URL in a new tab.
- Refresh `/admin` and verify page views increased.

## 5) Scripts (optional)

- `pip install -r requirements.txt`
- Scripts read env from `.env.local` (root) and/or `website/.env.local`.
- Run:
  - `python scripts/enrich-leads.py`
  - `python scripts/generate-preview-sites.py`

