# Campaign Tracking - Quick Start

## What you have

- Admin dashboard: `/admin` (protected by `ADMIN_ACCESS_KEY`)
- Tracking endpoint: `POST /api/track-view`
- Supabase tables: `campaigns`, `page_views`, `leads`

## 5-minute setup

1. Create a Supabase project.
2. Run migrations (SQL Editor):
   - `website/supabase/migrations/001_create_tables.sql`
   - `website/supabase/migrations/002_create_leads_table.sql`
3. Create `website/.env.local` from `website/.env.example`.
4. Run:
   - `cd website`
   - `npm install`
   - `npm run dev`
5. Open `http://localhost:3000/admin` and unlock with your `ADMIN_ACCESS_KEY`.

## Using the dashboard

1. Build or generate a preview page (`website/public/preview-pages/<slug>.html`).
2. In `/admin`, click **Log New Email** and create a campaign.
3. Copy the tracking URL and use it in your email:
   - `/preview/<slug>?utm_source=email&utm_campaign=<campaign_id>`
4. When they reply, mark the campaign `REPLIED`.

## Security

- Never commit `website/.env.local`.
- Rotate secrets if they were ever exposed.

