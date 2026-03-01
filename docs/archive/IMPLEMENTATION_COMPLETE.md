# Campaign Tracking System (Archived Summary)

This file is kept for historical context only. The canonical docs are:

- `README.md`
- `docs/PROCESS.md`
- `docs/setup-checklist.md`

## Core feature set

- Log outbound emails as campaigns (Supabase `campaigns`)
- Generate tracking URLs (`/preview/<slug>?utm_source=email&utm_campaign=<campaign_id>`)
- Track preview page visits (Supabase `page_views`)
- View metrics in `/admin`

## Notes

- Do not store real credentials in docs. Use env files (`.env.local`, `website/.env.local`).
- If credentials were ever exposed, rotate them.

