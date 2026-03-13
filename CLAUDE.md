# CLAUDE.md — ClockOutNow Pipeline Constitution

This is the master playbook. Every session, every agent, every script must follow this.

## What This Project Is

An **end-to-end automated outbound sales pipeline** that finds service businesses **nationwide** (started in Buffalo/WNY, now expanding), builds them stunning custom preview websites, and emails them the link to close deals. Also includes a **Retell AI voice agent** that prospects can call and talk to.

**Owner:** Mike (gyrow32@gmail.com)
**Website:** clockoutnow.com (Next.js on Vercel)
**Database:** Supabase

## The Pipeline (End-to-End)

### Phase 1: Lead Discovery
- Scrape leads from **everywhere**: Google, Craigslist, Yelp, Facebook, anywhere service businesses advertise
- **Going nationwide** — not limited to Buffalo anymore, target service businesses across the US
- **Email addresses are the #1 priority** — this is an email campaign, no email = no value
- Collect everything: business name, owner name, phone, email, address, services, photos, reviews, social links
- Store all data in Supabase `leads` table immediately
- Status: `NEW` → `RESEARCHING`

### Phase 2: Data Enrichment
- Scrape Google Maps for photos, reviews, hours, full business details
- Cross-reference multiple sources for email addresses
- If business has a website, scrape it for content/photos we can use
- If no photos available online, generate professional images using Gemini API
- The more data we have, the better the preview site will be
- Status: `RESEARCHING` → `READY`

### Phase 3: Preview Site Generation
- **THIS IS THE CLOSER** — quality here is everything
- Every preview site must match the quality of `derme-family-remodeling.htm` or `stalczynski-contracting.htm`
- Sites must look like real, custom-built professional websites — NOT generic templates
- Use the business's actual photos, services, location, phone number
- Design should reflect the industry (colors, imagery, tone)
- Include: navbar, hero with business name, services section, about/trust section, gallery (if photos available), contact section, footer
- Must use Google Fonts (Inter + Playfair Display), CSS variables, hover animations, responsive design
- **NEVER** generate a page under 400 lines — if it's short, it's a template and it's garbage
- Status: `READY` → `SITE_GENERATED`

### Phase 4: Email Campaign
- Send from Mike's personal Gmail (gyrow32@gmail.com) via SMTP
- Pitch style: short, question-first, local angle, no jargon, sign as "Mike"
- Include tracked preview link (clockoutnow.com/preview/{slug})
- CAN-SPAM compliant (unsubscribe line required)
- Max 3 Craigslist pitches/day to avoid flagging
- Email should reference specific details about THEIR business to show we did research
- Status: `SITE_GENERATED` → `CONTACTED`

### Phase 5: Follow-up & Close
- Track page views in Supabase `page_views` table
- Monitor who clicked, how long they stayed
- Follow up with engaged leads
- Status flow: `CONTACTED` → `REPLIED` → `CLOSED`

### Retell AI Voice Agent
- Retell provides an AI phone agent that prospects can call and talk to
- Agent must be **nationwide/generic** — remove any Buffalo-specific language or references
- Should be configurable/adjustable from within this application
- Voice agent complements the email campaign — another touchpoint for leads
- TODO: Integrate Retell management into the admin dashboard

## Quality Standards

**Preview sites are the product.** If the preview site doesn't impress the business owner in 3 seconds, the entire pipeline was a waste. Every site must:
- Look like it was custom-designed by a professional
- Use their real business data, photos, and services
- Have smooth animations, professional typography, proper spacing
- Be mobile responsive
- Reference pages for quality: `derme-family-remodeling.htm`, `stalczynski-contracting.htm`, `exact-hvac.htm`
- Anti-reference (what NOT to do): any page under 400 lines with generic checkmark icons

## Goal: Full Automation

The end state is: pipeline runs unattended. Scripts find leads, enrich data, generate sites, send emails — all automated on a schedule. Mike shouldn't need to be at the computer for this to work.

## Repo Structure

- `src/` — Next.js app (root level, NOT in website/ subdir)
- `public/preview-pages/*.htm` — Generated preview sites (.htm extension, NOT .html)
- `scripts/` — Python automation (lead scraping, enrichment, email sending, site generation)
- `docs/` — Operations documentation
- `.env.local` — Gmail creds + Supabase keys (root level)

## Tech Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind (deployed on Vercel from `main` branch)
- **Database:** Supabase (tables: leads, campaigns, page_views)
- **Email:** Gmail SMTP via `scripts/send-outreach.py`
- **Site Generation:** `scripts/generate-preview-sites.py` (uses Gemini AI for content)
- **Enrichment:** `scripts/enrich-gmaps.py`, `scripts/enrich-phase3.py`
- **Admin:** clockoutnow.com/admin (password in Vercel env vars as ADMIN_ACCESS_KEY)
- **Voice Agent:** Retell AI (needs integration into admin dashboard)

## Security Rules
- Never commit API keys/passwords to code
- `.env.local` is gitignored
- Email from personal Gmail as "Mike" (NOT hello@clockoutnow.com)

## Agent Guidance
- `AnimatedSection` for scroll animations (framer-motion is BROKEN — don't use motion.* components)
- Preview files use `.htm` extension (Vercel intercepts `.html` as page routes)
- Preview route handler fetches from CDN, NOT filesystem (Vercel serverless can't use fs)
- Chrome installed at `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
