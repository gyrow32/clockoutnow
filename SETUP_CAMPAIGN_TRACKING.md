# Campaign Tracking Setup Guide

This guide walks you through setting up the campaign tracking and analytics system.

## Overview

You've built a complete campaign tracking system with:
- **Admin Dashboard** at `/admin` - Track emails, leads, and page views
- **Analytics** - See which preview pages get clicked and from what source
- **Supabase Backend** - Store campaign data and page view analytics

---

## Step 1: Create Supabase Project (30 minutes)

### 1.1 Sign Up & Create Project

1. Go to https://supabase.com
2. Sign in with GitHub (or create account)
3. Click **"New Project"**
4. Fill in:
   - **Name:** `clockout-campaigns` (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose **US East (North Virginia)** (closest to Buffalo)
   - **Plan:** Free tier is plenty

5. Click **Create new project** and wait 2-3 minutes

### 1.2 Run Database Migration

Once your project is ready:

1. In Supabase dashboard, click **SQL Editor** in left sidebar
2. Click **New query**
3. Copy the entire contents of `website/supabase/migrations/001_create_tables.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see: **"Success. No rows returned"**

### 1.3 Get Your API Keys

1. Click **Project Settings** (gear icon) in left sidebar
2. Click **API** in settings menu
3. Copy these two values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## Step 2: Update Environment Variables

1. Open `website/.env` in your code editor
2. Replace the Supabase placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file
4. **IMPORTANT:** If you deploy to production, add these same variables to your hosting platform (Vercel, etc.)

---

## Step 3: Test the Connection

1. Start your dev server:
   ```bash
   cd website
   npm run dev
   ```

2. Open http://localhost:3000/admin
3. Enter password: `buffalo2026`
4. You should see the dashboard (empty at first)

If you see an error, check:
- Supabase project is fully initialized (wait 2-3 min after creation)
- Environment variables are correct
- No typos in the API key

---

## Step 4: Test Adding a Campaign

1. Click **"Log New Email"** button
2. Fill in the form:
   - **Business Name:** Test Business
   - **Contact:** 716-555-0000
   - **Preview Page Slug:** Select one from the dropdown
   - **Subject Line:** (optional)
   - **Notes:** (optional)

3. Click **"Create Campaign"**
4. You should see a success screen with a tracking URL
5. Copy the tracking URL

---

## Step 5: Test Analytics Tracking

1. Open the tracking URL in a new tab (paste it into your browser)
2. The preview page should load normally
3. Go back to `/admin` dashboard
4. Click **Refresh** button
5. Check the **Analytics** section at the bottom
6. You should see:
   - 1 view for that preview page
   - 1 view from "email" source

**If you don't see analytics:**
- Open browser console (F12) and reload the preview page
- Check for any errors in the Network tab
- Make sure the tracking script is in the HTML (view source)

---

## Step 6: Verify in Supabase

1. Go back to Supabase dashboard
2. Click **Table Editor** in left sidebar
3. You should see two tables:
   - **campaigns** - Should have your test campaign
   - **page_views** - Should have your test page view

4. Click on each table to see the data

---

## Using the Dashboard

### Adding a Campaign

When you send an email to a lead:

1. Go to `/admin`
2. Click **"Log New Email"**
3. Fill in:
   - Business name (from leads.md)
   - Contact (phone/email)
   - Select the preview page slug you built for them
   - Subject line (optional but helpful)
   - Notes (e.g., "Found on Craigslist - roofing services")
4. **Copy the tracking URL**
5. **Use that URL in your email** instead of the regular URL

### Tracking URL Format

```
https://clockoutnow.com/preview/dons-roofing?utm_source=email&utm_campaign=abc-123-def
```

The `utm_campaign` parameter contains the unique campaign ID. When they click the link, the analytics system tracks:
- Which page they viewed
- That it came from email (utm_source=email)
- Which specific campaign it was (utm_campaign=abc-123-def)

### Updating Status

When a lead replies to your email:

1. Find their row in the Campaign Timeline table
2. Click **"Mark Replied"** button
3. The status changes from 🟡 CONTACTED → 🟢 REPLIED
4. Response date is auto-recorded

To see more details:
- Click anywhere on the row to expand
- You'll see notes, subject line, response notes, and the full tracking URL

### Understanding Analytics

**Summary Cards (top):**
- **Sent** - Total campaigns logged
- **Rate** - Response rate (Replied / Sent)
- **Views** - Total page views in last 30 days
- **Pages** - Number of preview pages built

**Analytics Panel (bottom):**
- Bar chart shows view counts per page
- Green = views from email links
- Purple = total views (includes direct visits)
- Traffic sources show email vs direct traffic

---

## Workflow: From Lead to Campaign

**Old workflow:**
1. Find lead on Craigslist
2. Add to leads.md
3. Build preview page
4. Send email with link
5. ❌ No tracking

**New workflow:**
1. Find lead on Craigslist
2. Add to leads.md *(still useful for research)*
3. Build preview page (static HTML)
4. **Go to `/admin` dashboard**
5. **Click "Log Email Sent"**
6. **Copy tracking link** (e.g., `/preview/slug?utm_campaign=123`)
7. **Send email with tracking link**
8. **Dashboard auto-shows page views** as they happen
9. When reply comes: **Click "Mark as Replied"**
10. Campaign data lives in Supabase (source of truth)

---

## Security Notes

- Admin dashboard is password-protected
- Password is `buffalo2026` (set in `.env` as `ADMIN_ACCESS_KEY`)
- Change this in production!
- Dashboard is not indexed by search engines (noindex meta tag)
- Tracking endpoint is public (needs to be for preview pages to work)

---

## Troubleshooting

### Dashboard shows "Unauthorized"
- Check that `ADMIN_ACCESS_KEY` is set in `.env`
- Try refreshing the page
- Re-enter the password

### Analytics not showing
- Make sure you clicked the tracking URL (with `utm_source=email`)
- Check browser console for errors
- Verify Supabase credentials are correct
- Check that tracking script is in the HTML file

### "Failed to create campaign"
- Verify Supabase credentials in `.env`
- Check that database migration ran successfully
- Look at browser console for specific error

### Can't connect to Supabase
- Wait 2-3 minutes after creating project
- Double-check the Project URL and API key
- Make sure you copied the **anon public** key, not the service role key

---

## Next Steps

1. **Delete test data:**
   - Go to Supabase Table Editor
   - Delete test rows from `campaigns` and `page_views`

2. **Backfill existing campaigns:**
   - For the 4 emails you already sent (Don's Roofing, Buffalo Plumbing, etc.)
   - Click "Log New Email" for each one
   - Set sent_date to when you actually sent them (edit in Supabase if needed)

3. **Start using it:**
   - For every new email you send, log it via dashboard
   - Use the tracking URLs
   - Watch the analytics come in
   - Mark leads as REPLIED when they respond

4. **Optional - Export to CSV:**
   - In Supabase, you can export tables to CSV
   - Useful for backing up your campaign data

---

## Files Created

**Database:**
- `supabase/migrations/001_create_tables.sql` - Database schema

**Backend:**
- `src/lib/supabase-queries.ts` - Database query functions
- `src/lib/analytics.ts` - Analytics utilities
- `src/app/api/admin/campaigns/route.ts` - GET/POST campaigns
- `src/app/api/admin/campaigns/[id]/route.ts` - PATCH campaign
- `src/app/api/admin/analytics/route.ts` - GET analytics data
- `src/app/api/track-view/route.ts` - Track page views

**Frontend:**
- `src/app/admin/page.tsx` - Main dashboard page
- `src/app/admin/layout.tsx` - Admin layout
- `src/components/admin/SummaryCards.tsx` - Top metrics cards
- `src/components/admin/CampaignTable.tsx` - Campaign timeline table
- `src/components/admin/AddCampaignModal.tsx` - "Log Email" form
- `src/components/admin/AnalyticsChart.tsx` - Analytics visualization

**Modified:**
- All 11 preview pages in `public/preview-pages/` - Added tracking script
- `.env` - Added Supabase credentials and admin key

---

## Support

If something isn't working:
1. Check the Troubleshooting section above
2. Look at browser console for errors
3. Check Supabase logs (Project Settings → Logs)
4. Verify environment variables are loaded (restart dev server after changing .env)

**The system is designed to be bulletproof:**
- If Supabase is down, tracking fails silently (preview pages still work)
- If analytics tracking fails, it doesn't break the page
- Admin dashboard shows clear error messages
