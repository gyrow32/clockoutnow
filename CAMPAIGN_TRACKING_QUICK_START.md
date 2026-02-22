# Campaign Tracking - Quick Start

## 🚀 What You Have

A complete campaign tracking system for your Buffalo outreach:
- **Admin Dashboard:** `/admin` (password: `buffalo2026`)
- **Analytics Tracking:** Automatic page view tracking on all preview pages
- **Supabase Backend:** Stores campaigns and analytics data

---

## ⚡ 5-Minute Setup

### 1. Create Supabase Project
```
1. Go to https://supabase.com
2. Create new project (US East region)
3. Wait 2-3 minutes for initialization
```

### 2. Run Database Migration
```
1. Open Supabase SQL Editor
2. Copy/paste: website/supabase/migrations/001_create_tables.sql
3. Click "Run"
```

### 3. Update Environment Variables
```bash
# Edit website/.env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your-key
```

### 4. Start & Test
```bash
cd website
npm run dev
# Visit: http://localhost:3000/admin
# Password: buffalo2026
```

---

## 📧 Using the Dashboard

### Log an Email Sent
1. Go to `/admin`
2. Click **"Log New Email"**
3. Fill in business name, contact, preview page slug
4. **Copy the tracking URL**
5. Use that URL in your email

### When They Reply
1. Find campaign in the table
2. Click **"Mark Replied"**
3. Done! Response tracked automatically.

---

## 📊 Understanding the Dashboard

**Top Row (Metrics):**
- 📧 **Sent** - Total emails logged
- 📊 **Rate** - Response rate (%)
- 👀 **Views** - Page views (last 30 days)
- 📄 **Pages** - Total preview pages built

**Campaign Timeline:**
- Click any row to expand details
- 🟡 CONTACTED = Email sent, awaiting response
- 🟢 REPLIED = They responded!
- ⚪ CLOSED = Deal done or dead

**Analytics Panel:**
- Shows which pages get the most views
- Green bars = views from email
- Purple bars = total views

---

## 🔗 Tracking URLs

**Regular URL:**
```
https://clockoutnow.com/preview/dons-roofing
```

**Tracking URL (use this!):**
```
https://clockoutnow.com/preview/dons-roofing?utm_source=email&utm_campaign=abc-123
```

The `utm_campaign` parameter tells you exactly which email they clicked.

---

## 📁 Files Created

**Core Backend:**
- `src/lib/supabase-queries.ts` - Database queries
- `src/lib/analytics.ts` - Utility functions
- `supabase/migrations/001_create_tables.sql` - Database schema

**API Routes:**
- `src/app/api/admin/campaigns/route.ts` - List/create campaigns
- `src/app/api/admin/campaigns/[id]/route.ts` - Update campaign
- `src/app/api/admin/analytics/route.ts` - Get analytics
- `src/app/api/track-view/route.ts` - Track page views

**Dashboard UI:**
- `src/app/admin/page.tsx` - Main dashboard
- `src/components/admin/SummaryCards.tsx` - Metric cards
- `src/components/admin/CampaignTable.tsx` - Campaign list
- `src/components/admin/AddCampaignModal.tsx` - Log email form
- `src/components/admin/AnalyticsChart.tsx` - Analytics viz

**Modified:**
- All 11 preview pages - Added tracking script
- `.env` - Added Supabase credentials

---

## 🛠️ Troubleshooting

**"Unauthorized" on dashboard:**
→ Password is `buffalo2026` (or check `ADMIN_ACCESS_KEY` in `.env`)

**No analytics showing:**
→ Make sure you used the tracking URL (with `?utm_source=email&utm_campaign=...`)

**Can't connect to Supabase:**
→ Double-check credentials in `.env`
→ Make sure you copied the **anon public** key, not service role

**Tracking script not working:**
→ Check browser console for errors
→ Verify script is in HTML: view source on preview page

---

## 🎯 Next Steps

1. **Delete test data** (if you created test campaigns)
2. **Backfill existing campaigns** (Don's Roofing, Buffalo Plumbing, etc.)
3. **Start using it for new emails**
4. **Track responses** by marking campaigns as REPLIED
5. **Monitor analytics** to see what's working

---

## 📚 Full Setup Guide

See `SETUP_CAMPAIGN_TRACKING.md` for detailed instructions, screenshots, and advanced usage.

---

## 🔐 Security

- Dashboard requires password (`buffalo2026`)
- Change password in `.env` for production
- Dashboard hidden from search engines
- Tracking endpoint is public (required for preview pages)

---

**You're ready to go! 🎉**

Visit `/admin` to start tracking your campaigns.
