# Session Summary (Archived)

**Date:** 2026-02-22  
**Topic:** Campaign tracking + analytics dashboard (Next.js + Supabase)

## What was implemented

- Admin dashboard at `/admin` to log campaigns and view analytics
- Supabase tables for:
  - `campaigns` (emails sent + pipeline status)
  - `page_views` (preview page view events + UTM attribution)
  - `leads` (prospect database)
- Preview pages instrumented to call `POST /api/track-view`

## Where it lives now

- Schema: `website/supabase/migrations/`
- Dashboard UI: `website/src/app/admin/` + `website/src/components/admin/`
- Tracking endpoint: `website/src/app/api/track-view/route.ts`

## Credentials

Any credentials that previously appeared in this archive have been removed. Use:

- `website/.env.local` for website/runtime values
- `.env.local` (root) for script-only values

If secrets were ever committed or shared, rotate them.

