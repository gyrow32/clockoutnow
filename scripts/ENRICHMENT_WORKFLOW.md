# Enrichment -> Preview Page Workflow

This workflow treats **Supabase** as the source of truth.

## Status flow (Supabase `leads.status`)

`NEW` -> `RESEARCHING` -> `READY` -> `SITE_GENERATED` -> `CONTACTED` -> `REPLIED` -> `CLOSED`

(Optional stages like `IMAGE_GENERATED` are supported by the schema but not required to launch outreach.)

## Step 1: Enrich leads (manual)

- Run: `python scripts/enrich-leads.py`
- Fill in fields like:
  - `owner_name`, `tagline`, `business_description`
  - `facebook_url`, `google_business_url`
  - `photos_json` (optional)
- When done, mark the lead `READY`.

## Step 2: Generate preview pages (automated)

- Run: `python scripts/generate-preview-sites.py`
- What it does:
  - pulls all `READY` leads from Supabase
  - writes `website/public/preview-pages/<slug>.html`
  - updates the lead with `preview_page_slug`, `preview_site_url`, and `status = SITE_GENERATED`

Preview pages are served by the Next.js route:

- `GET /preview/<slug>`

## Step 3: Send outreach + track clicks

1. Open the admin dashboard (`/admin`).
2. Log the email you’re sending (creates a row in Supabase `campaigns`).
3. Copy the tracking URL and use it in the email:
   - `/preview/<slug>?utm_source=email&utm_campaign=<campaign_id>`
4. When the lead clicks, `page_views` updates automatically.
5. When the lead replies, mark the campaign `REPLIED`.

## Notes

- Local-only artifacts go in `data/` (gitignored).
- Older scripts live in `scripts/legacy/` and are not part of the current pipeline.

