# ClockOutNow — Full CEO Review
**Date:** 2026-03-13
**Reviewer:** Chrissy (AI Chief of Staff)
**Mode:** HOLD SCOPE
**Repo:** `C:\Users\mike\Desktop\ClockOutNow`
**GitHub:** `gyrow32/ClockOutNow.git` (PRIVATE)
**Live:** https://clockoutnow.com/ (✅ 200 OK)

---

## PRE-REVIEW SYSTEM AUDIT

### Git State — 🔴 CRITICAL
- **15 uncommitted files** including core new features (Retell AI integration)
- **Modified (staged/unstaged):**
  - `AGENTS.md`, `CLAUDE.md`, `RETELL_AI_AGENT_SETUP.md`
  - 11 preview `.htm` pages
  - `scripts/generate-preview-sites.py`
  - `src/app/admin/page.tsx`
- **Untracked (NEW files, never committed):**
  - `src/components/admin/RetellAgentPanel.tsx` ← NEW FEATURE
  - `src/app/api/admin/retell/route.ts` ← NEW API ROUTE
  - `docs/CONVERSICA-RESEARCH.md` ← RESEARCH DOC
  - `ClockOutNow - Shortcut.lnk` ← junk
- **Two branches:** `main` + `master` (likely from early rename)
- **No stashes**
- **Last commit:** `8110da5` — Fix campaign tracking URL

### ⚠️ IMMEDIATE RISK
The Retell AI integration code (`RetellAgentPanel.tsx` + `/api/admin/retell/route.ts`) exists ONLY on this machine. If the hard drive fails, it's gone. This is the single highest-priority fix.

### Code Artifacts Found
- **Admin password in CLAUDE.md:** `buffalo2026` — committed to git in a private repo. Still a bad practice.
- **Hardcoded Retell IDs:** Agent ID and LLM ID hardcoded in route.ts (not in env vars)
- **framer-motion is broken** — noted in CLAUDE.md, workaround in place (CSS animations)
- **No tests at all** — zero test files

### What's Already Built
- Full outbound sales pipeline (lead discovery → enrichment → site gen → email → tracking)
- 26 preview sites generated
- Admin dashboard with campaign management, analytics, leads table
- Retell AI voice agent integration (uncommitted)
- Page view tracking
- Client domain middleware (dermeremodeling.com)
- 12 Python automation scripts
- Conversica competitive research

---

## STEP 0: NUCLEAR SCOPE CHALLENGE

### 0A. Premise Challenge

**Is this the right product?** STRONG YES. ClockOutNow solves a real, painful problem: contractors miss calls and lose jobs because they're physically doing the work. The positioning is clear — "blue-collar Conversica at 1/30th the price." Conversica charges $3K/mo; ClockOutNow targets $49-$149/mo. Massive gap.

**What's the actual user outcome?** A plumber on a job site gets a lead captured and qualified by AI instead of sending it to voicemail. They see the lead summary on their phone and call back when they're free. They stop losing 40% of inbound leads to voicemail.

**What happens if we do nothing?** The pipeline sits idle. 92 leads found, 0 pitches sent. Spring contractor season (the best time to sell) passes. The Retell AI integration stays uncommitted and at risk of being lost.

### 0B. Existing Code Leverage

| Sub-problem | Existing Code | Status |
|---|---|---|
| Public website | 8-page Next.js app | ✅ Live on Vercel |
| Lead discovery | 5 Python scripts (scraping, enrichment) | ✅ Built, tested manually |
| Preview site generation | `generate-preview-sites.py` + Gemini AI | ✅ 26 sites generated |
| Email outreach | `send-outreach.py` via Gmail SMTP | ✅ Built, CAN-SPAM compliant |
| Campaign tracking | Supabase tables + admin dashboard | ✅ Working |
| Page view analytics | Track-view API + admin charts | ✅ Working |
| AI voice agent | Retell AI integration | 🟡 Built but UNCOMMITTED |
| Client custom domains | Middleware routing + client-site handler | ✅ Working (dermeremodeling.com) |
| Admin dashboard | Full CRUD + analytics + Retell panel | ✅ Working |
| Competitive research | Conversica deep dive | ✅ Complete |

### 0C. Dream State Mapping

```
  CURRENT STATE                    THIS PLAN                     12-MONTH IDEAL
  ┌──────────────────┐            ┌──────────────────┐          ┌──────────────────┐
  │ Full pipeline     │            │ Commit all code  │          │ 50+ paying        │
  │ built but idle    │            │ Fix security     │          │ customers         │
  │ 92 leads, 0 sent  │   --->    │ Add CI pipeline  │   --->   │ $5K-$15K MRR     │
  │ 0 paying customers│            │ Clean up repo    │          │ Self-serve signup │
  │ 0 revenue         │            │                  │          │ Automated pipeline│
  │ Retell uncomitted │            │                  │          │ Multi-vertical    │
  │ No tests          │            │                  │          │ (HVAC, plumbing,  │
  │ Password in git   │            │                  │          │  cleaning, etc.)  │
  └──────────────────┘            └──────────────────┘          └──────────────────┘
```

---

## SECTION 1: ARCHITECTURE REVIEW

### System Architecture
```
  ┌─────────────────────────────────────────────────────────────┐
  │                        VERCEL                               │
  │  ┌───────────────────────────────────────────────────────┐  │
  │  │              Next.js 14 App + Middleware               │  │
  │  │                                                       │  │
  │  │  ┌──────────┐ ┌──────────────┐ ┌──────────────────┐  │  │
  │  │  │ 8 Pages  │ │ API Routes   │ │ Middleware        │  │  │
  │  │  │ (public  │ │ /track-view  │ │ - Client domain   │  │  │
  │  │  │  site)   │ │ /admin/*     │ │   routing         │  │  │
  │  │  │          │ │ /preview/*   │ │ - Path blocking   │  │  │
  │  │  └──────────┘ └──────┬───────┘ │ - www redirect    │  │  │
  │  │                      │         └──────────────────┘  │  │
  │  │  ┌──────────────────────────────────────────────┐    │  │
  │  │  │         26 Static Preview Sites (.htm)       │    │  │
  │  │  │         Served via CDN fetch in route        │    │  │
  │  │  └──────────────────────────────────────────────┘    │  │
  │  └──────────────────────┬────────────────────────────────┘  │
  └──────────────────────────┼──────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────┴──────┐ ┌────┴────┐  ┌──────┴──────┐
       │  Supabase   │ │ Retell  │  │    Gmail     │
       │ - campaigns │ │ AI API  │  │    SMTP      │
       │ - page_views│ │ (voice) │  │  (outreach)  │
       │ - leads     │ │         │  │              │
       └─────────────┘ └─────────┘  └──────────────┘

  ┌──────────────────────────────────────────────┐
  │           LOCAL PYTHON SCRIPTS               │
  │  lead_finder → enrich → generate → send      │
  │  (manual execution from Mike's desktop)      │
  └──────────────────────────────────────────────┘
```

### Findings

**1. Preview site serving is clever but fragile.** The `/preview/[slug]` route fetches the `.htm` file from the app's own CDN URL, injects navbar links and a floating badge, then serves it. This avoids Vercel's filesystem limitations. BUT — the route does a network round-trip to itself (`fetch(origin + '/preview-pages/...')`). Under load or cold starts, this could timeout.

**2. Client domain middleware is well-designed.** Clean separation: client domains get their own robots.txt, sitemap, and routing. Internal paths (/admin, /api) are blocked. Good security boundary.

**3. Python scripts are fully local.** Lead discovery, enrichment, site generation, and email sending all run from Mike's desktop. Not deployed anywhere. If Mike's machine is down, the pipeline stops. This is fine for current scale but won't scale to "runs unattended."

**4. Retell AI IDs are hardcoded.** Agent and LLM IDs are in the route file, not env vars. If the agent is recreated, code must change. Should be env vars.

**5. No database migrations tracked.** Supabase tables (campaigns, page_views, leads) exist but there's no migration file showing the schema. A new developer couldn't set up a fresh environment.

### Issues Found: 3
- **CRITICAL:** Uncommitted code at risk of loss
- **WARNING:** Self-referencing fetch in preview route (fragile under load)
- **WARNING:** No tracked database schema/migrations

---

## SECTION 2: ERROR & RESCUE MAP

```
  METHOD/CODEPATH              | WHAT CAN GO WRONG             | RESCUED? | USER SEES
  -----------------------------|-------------------------------|----------|------------------
  POST /api/track-view         | Missing page param            | Y        | 400 error
                               | Supabase insert fails         | Y        | 200 (silent fail)
                               | Invalid JSON body             | Y (catch)| 200 (silent fail)
  -----------------------------|-------------------------------|----------|------------------
  GET /preview/[slug]          | Invalid slug chars            | Y        | 404
                               | .htm file not found           | Y        | 404
                               | Self-fetch timeout            | N ← GAP  | Hang/500
                               | Malformed HTML injection      | N ← GAP  | Broken page
  -----------------------------|-------------------------------|----------|------------------
  GET /api/admin/campaigns     | No auth header                | Y        | 401
                               | Supabase query fails          | Y        | 500
  -----------------------------|-------------------------------|----------|------------------
  POST /api/admin/campaigns    | No auth                       | Y        | 401
                               | Missing required fields       | N ← GAP  | Supabase error
  -----------------------------|-------------------------------|----------|------------------
  GET /api/admin/retell        | No auth                       | Y        | 401
                               | RETELL_API_KEY missing        | Y        | 500
                               | Retell API down               | Y        | 500
                               | Retell returns non-JSON       | N ← GAP  | Unhandled
  -----------------------------|-------------------------------|----------|------------------
  PATCH /api/admin/retell      | No auth                       | Y        | 401
                               | general_prompt not string     | Y        | 400
                               | Retell API rejects update     | Y        | 500
  -----------------------------|-------------------------------|----------|------------------
  Python: send-outreach.py     | Gmail SMTP auth fails         | ?        | Script error
                               | Email bounces                 | ?        | Silent
                               | Rate limit hit                | ?        | Script error
  -----------------------------|-------------------------------|----------|------------------
  Python: generate-preview.py  | Gemini API fails              | ?        | Script error
                               | Generated HTML is broken      | ?        | Bad preview page
```

### Critical Gaps: 1
- **Self-fetch timeout in preview route** — If the CDN is slow or Vercel cold-starts, the route handler fetches from itself and could hang. Low probability but high impact (broken preview = broken sales pitch).

---

## SECTION 3: SECURITY & THREAT MODEL

| Threat | Likelihood | Impact | Mitigated? |
|---|---|---|---|
| **🔴 Admin password in CLAUDE.md (committed to git)** | HIGH | HIGH | NO — `buffalo2026` is in git history forever |
| **🔴 Retell Agent/LLM IDs hardcoded** | MED | MED | NO — should be env vars |
| **Bot spam on /api/track-view** | MED | LOW (just inflates analytics) | NO — open endpoint, CORS * |
| **Admin auth is shared bearer token** | LOW | MED | PARTIAL — env var, but single password for all access |
| **Gmail credentials in .env.local** | LOW | HIGH (if leaked) | YES — gitignored |
| **Preview route XSS** | LOW | MED | PARTIAL — slug is sanitized, but injected HTML is static |
| **Supabase anon key exposed client-side** | LOW | LOW (RLS should protect) | PARTIAL — depends on RLS config |
| **Python scripts run as admin** | LOW | MED | N/A — local execution only |

### 🔴 CRITICAL: Admin Password in Git History
`CLAUDE.md` line 92 contains `buffalo2026` in plaintext. Even if removed from the current file, it's in git history forever. Since this is a private repo, the blast radius is limited to anyone with repo access. But:
1. **Rotate the password immediately** — change `ADMIN_ACCESS_KEY` in Vercel env vars
2. **Remove from CLAUDE.md** — replace with "see Vercel env vars"
3. Consider whether the git history needs scrubbing (BFG Repo Cleaner)

---

## SECTION 4: DATA FLOW & EDGE CASES

### Outreach Pipeline Flow
```
  LOCAL SCRIPTS                           VERCEL + SUPABASE
  ┌──────────┐                           ┌──────────────┐
  │ Find Lead│                           │              │
  │ (Python) │──── insert ──────────────▶│ Supabase     │
  └────┬─────┘                           │ leads table  │
       │                                 └──────────────┘
  ┌────┴─────┐
  │ Enrich   │ (Google Maps, web scrape)
  └────┬─────┘
  ┌────┴─────┐
  │ Generate │ (Gemini AI → .htm file)
  │ Preview  │──── git add + push ──────▶ Vercel CDN
  └────┬─────┘
  ┌────┴─────┐                           ┌──────────────┐
  │ Send     │                           │              │
  │ Email    │──── insert ──────────────▶│ campaigns    │
  │ (Gmail)  │                           │ table        │
  └──────────┘                           └──────────────┘

  PROSPECT CLICKS EMAIL LINK:
  ┌──────────┐     ┌──────────────┐     ┌──────────────┐
  │ Email    │────▶│ /preview/    │────▶│ page_views   │
  │ link     │     │ {slug}       │     │ table        │
  └──────────┘     └──────────────┘     └──────────────┘
```

### Edge Cases
```
  INTERACTION              | EDGE CASE                | HANDLED?
  -------------------------|--------------------------|----------
  Preview page load        | Slug doesn't match file  | ✅ 404
  Preview page load        | Very large .htm file     | ? (no size limit)
  Admin login              | Wrong password           | ✅ Rejected
  Admin login              | Brute force attempts     | ❌ No rate limit
  Campaign status update   | Invalid status value     | ❌ No validation
  Retell prompt update     | Extremely long prompt    | ❌ No length check
  Email sent to lead       | Lead's email is invalid  | ? (Gmail bounces)
  Email sent to lead       | Gmail daily send limit   | ? (manual awareness)
  Client domain access     | /admin on client domain  | ✅ Blocked by middleware
  Client domain access     | DNS not pointed yet      | N/A (middleware checks host)
```

---

## SECTION 5: CODE QUALITY REVIEW

### Strengths
1. **Clean TypeScript throughout.** Proper interfaces for Campaign, PageView, etc.
2. **supabase-queries.ts is excellent.** 300+ lines of well-organized, typed query functions with proper error handling. CTR calculations, response time analytics, time-series data — all clean.
3. **Middleware is production-quality.** Client domain routing with proper security boundaries (blocks /admin, /api on client domains).
4. **Preview route is clever.** Slug sanitization, HTML injection for branding, noindex/nofollow headers, caching.
5. **Python scripts are practical.** Not over-engineered. They do the job.

### Issues
1. **No input validation on campaign creation.** The POST endpoint passes whatever the client sends directly to Supabase. No validation on business_name, contact, preview_page_slug.

2. **CORS is wide open on track-view.** `Access-Control-Allow-Origin: *` — acceptable since it's a public tracking pixel, but worth noting.

3. **DRY violation: auth verification.** `verifyAuth()` is duplicated across campaigns/route.ts and retell/route.ts. Should be shared middleware or utility.

4. **framer-motion is a dead dependency.** CLAUDE.md says it's broken. If it's not used, remove it from package.json to reduce bundle.

5. **Windows shortcut file in repo root.** `ClockOutNow - Shortcut.lnk` — junk file, should be gitignored.

---

## SECTION 6: TEST REVIEW

### What Exists
**NOTHING.** Zero test files. Zero test configuration.

### What MUST Be Tested (Priority Order)

| Missing Test | Type | Priority | Why |
|---|---|---|---|
| Preview route (slug sanitization, 404, HTML injection) | Integration | P1 | Revenue-critical — broken preview = lost deal |
| Admin auth (reject bad tokens) | Unit | P1 | Security-critical |
| Campaign CRUD operations | Integration | P2 | Core business logic |
| Track-view API | Unit | P2 | Analytics accuracy |
| Middleware (client domain routing, path blocking) | Integration | P2 | Client site integrity |
| Retell API proxy | Unit | P3 | Internal tool |
| Python scripts | Unit | P3 | Manual execution, low risk |

### The 2am Friday Test
*"What would make me confident shipping at 2am?"*
- **Preview pages render correctly with branding injected** ❌
- **Admin rejects unauthorized access** ❌
- **Client domains can't access /admin** ❌
- **Track-view doesn't crash on bad input** ❌

**All missing. This is the most under-tested repo in the portfolio.**

---

## SECTION 7: PERFORMANCE REVIEW

### Findings
1. **Preview route self-fetch** — The `/preview/[slug]` handler fetches from its own CDN. On Vercel, this adds ~50-200ms of latency plus cold start risk. Not a problem at current traffic (near zero) but architecturally concerning.

2. **Analytics queries are efficient.** `getPageViewsBySlug` aggregates in JS after a single Supabase fetch — fine for current scale (<1000 rows). Would need server-side aggregation at 10K+ rows.

3. **26 .htm files in public/.** Each is ~400-800 lines of HTML. Total ~15-20KB per file. No performance concern — served from CDN.

4. **No lazy loading on admin dashboard.** All components (SummaryCards, CampaignTable, AnalyticsChart, LeadsTable, RetellAgentPanel, PerformanceChart, EngagementMetrics) load together. Fine for admin page, would be a problem for public pages.

---

## SECTION 8: OBSERVABILITY & DEBUGGABILITY

### Current State
- **Logging:** `console.error` for API failures. No structured logging.
- **Metrics:** Campaign analytics (CTR, response time, page views) built into admin dashboard. Good for business metrics.
- **Alerting:** NONE.
- **Monitoring:** NONE.
- **Debuggability:** Vercel function logs only.

### Gaps
1. **No uptime monitoring** — clockoutnow.com or dermeremodeling.com could go down unnoticed.
2. **No outreach pipeline monitoring** — If Python scripts fail, no alerting.
3. **No Supabase usage alerts** — Could hit free tier limits silently.
4. **No email delivery monitoring** — No bounce tracking, no delivery rate metrics.

---

## SECTION 9: DEPLOYMENT & ROLLOUT

### Current Setup
- **Deploy:** Push to `main` → Vercel auto-deploys
- **CI/CD:** NONE — no GitHub Actions, no pre-deploy checks
- **Preview deploys:** Vercel creates per-push previews
- **Rollback:** Vercel instant rollback

### Risks
1. **🔴 No CI/CD at all.** Any push goes straight to production. No lint, no build check, no tests.
2. **Direct pushes to main.** No branch protection, no PR review.
3. **Uncommitted code risk.** 15 files including a full new feature could be lost.

---

## SECTION 10: LONG-TERM TRAJECTORY

### Technical Debt Inventory
| Debt Item | Type | Severity | Effort to Fix |
|---|---|---|---|
| 🔴 15 uncommitted files | Critical risk | CRITICAL | S (git add, commit, push) |
| 🔴 Admin password in git history | Security | HIGH | S (rotate) + M (scrub history) |
| 🔴 Zero tests | Testing | HIGH | M (add critical path tests) |
| 🔴 No CI/CD pipeline | Process | HIGH | S (add GitHub Actions) |
| Retell IDs hardcoded | Config | MED | S (move to env vars) |
| DRY: auth verification | Code quality | LOW | S (extract utility) |
| framer-motion dead dep | Cleanup | LOW | S (npm uninstall) |
| No DB schema tracking | Documentation | MED | S (create schema.sql) |
| Python scripts not automated | Architecture | MED | L (cron/scheduler) |
| .lnk junk file | Cleanup | LOW | S (delete + gitignore) |

### Reversibility: 4/5
Most changes are easily reversible (Vercel rollback). The only concern is database schema — no migration tracking means schema changes are harder to undo.

### The 1-Year Question
*"Reading this codebase as a new engineer in 12 months — is it obvious?"*
**Mostly yes.** CLAUDE.md is excellent — it explains the full pipeline clearly. Code organization is clean. The only confusing part is the dual branch (main + master) and the local Python scripts that aren't documented in terms of execution order or dependencies.

---

## FAILURE MODES REGISTRY

```
  CODEPATH              | FAILURE MODE        | RESCUED? | TEST? | USER SEES    | LOGGED?
  ----------------------|---------------------|----------|-------|--------------|--------
  /preview/[slug]       | Self-fetch timeout  | N ← CRIT | N    | Hang/500     | N
  POST /admin/campaigns | No input validation | N        | N    | Supabase err | Y
  CLAUDE.md             | Password exposed    | N ← CRIT | N/A  | N/A          | N/A
  Retell route          | Non-JSON response   | N        | N    | 500          | Y
  Admin auth            | Brute force         | N        | N    | Silent       | N
  Git repo              | 15 uncommitted files| N ← CRIT | N/A  | Data loss    | N/A
```

**CRITICAL GAPS: 3** (uncommitted code, password in git, preview timeout)

---

## TODOS — PRIORITY ORDER

### 🔴 DO RIGHT NOW (Today)

**TODO-1: Commit and push all 15 files**
```bash
git add -A
git commit -m "feat: Retell AI admin panel + preview updates + research docs"
git push origin main
```
Effort: S | Priority: P0 | **DATA LOSS RISK**

**TODO-2: Rotate admin password**
- Change `ADMIN_ACCESS_KEY` in Vercel env vars to a new value
- Remove password from CLAUDE.md line 92
- Effort: S | Priority: P0 | **SECURITY**

**TODO-3: Move Retell IDs to env vars**
- Add `RETELL_AGENT_ID` and `RETELL_LLM_ID` to `.env.local` and Vercel
- Update `src/app/api/admin/retell/route.ts`
- Effort: S | Priority: P1

### 🟡 DO THIS WEEK

**TODO-4: Add GitHub Actions CI**
- At minimum: lint + build on push to main
- Effort: S | Priority: P1

**TODO-5: Delete junk files**
- Remove `ClockOutNow - Shortcut.lnk`
- Add `*.lnk` to .gitignore
- Effort: S | Priority: P1

**TODO-6: Delete `master` branch**
- `git branch -d master` — only `main` should exist
- Effort: S | Priority: P2

**TODO-7: Add uptime monitoring**
- UptimeRobot free tier for clockoutnow.com + dermeremodeling.com
- Effort: S | Priority: P2

### 🟢 TRACK FOR LATER

**TODO-8: Add critical path tests** (preview route, admin auth, middleware)
- Effort: M | Priority: P2

**TODO-9: Document database schema**
- Create `supabase/schema.sql` with current table definitions
- Effort: S | Priority: P3

**TODO-10: DRY up auth verification**
- Extract shared `verifyAdminAuth()` utility
- Effort: S | Priority: P3

**TODO-11: Remove framer-motion dependency**
- `npm uninstall framer-motion` if truly unused
- Effort: S | Priority: P3

**TODO-12: Add input validation to campaign creation**
- Validate business_name, contact, slug before Supabase insert
- Effort: S | Priority: P3

---

## COMPLETION SUMMARY

```
  +====================================================================+
  |            CEO REVIEW — COMPLETION SUMMARY                         |
  +====================================================================+
  | Mode selected        | HOLD SCOPE                                  |
  | System Audit         | 🔴 15 uncommitted files, password in git,   |
  |                      | zero tests, no CI/CD                        |
  | Step 0               | Product is RIGHT. Market gap is real.       |
  |                      | Execution risk from poor git hygiene.       |
  | Section 1  (Arch)    | 3 issues (uncommitted, self-fetch, no      |
  |                      | migrations)                                 |
  | Section 2  (Errors)  | 14 error paths mapped, 1 CRITICAL GAP      |
  | Section 3  (Security)| 8 threats assessed, 2 HIGH (pw in git,     |
  |                      | hardcoded IDs)                              |
  | Section 4  (Data/UX) | 10 edge cases mapped, 4 unhandled          |
  | Section 5  (Quality) | 5 issues found (code is actually clean)    |
  | Section 6  (Tests)   | 0/48 files tested — ZERO COVERAGE          |
  | Section 7  (Perf)    | 1 concern (self-fetch latency)             |
  | Section 8  (Observ)  | 4 gaps (no monitoring at all)              |
  | Section 9  (Deploy)  | 2 risks (no CI, direct to prod)            |
  | Section 10 (Future)  | Reversibility: 4/5, 10 debt items          |
  +--------------------------------------------------------------------+
  | NOT in scope         | Pipeline automation, new features, outreach |
  | What already exists  | 10 reusable systems (all built!)            |
  | Dream state delta    | Housekeeping → ready to sell                |
  | Error/rescue registry| 14 methods, 1 CRITICAL GAP                 |
  | Failure modes        | 6 total, 3 CRITICAL GAPS                   |
  | TODOS                | 12 items (3 P0, 4 P1-P2, 5 P3)             |
  | Diagrams produced    | 2 (system arch, pipeline flow)             |
  | Stale diagrams found | 0                                          |
  | Unresolved decisions | 0                                          |
  +====================================================================+
```

### Overall Grade: B- (dragged down by operational risk, NOT code quality)

**The paradox of ClockOutNow:** The code is actually GOOD. Clean TypeScript, smart middleware, solid admin dashboard, practical Python scripts. The product vision is sharp. But the operational hygiene is terrible — 15 uncommitted files including a full new feature, admin password in git history, zero tests, no CI/CD.

**In one sentence:** ClockOutNow has excellent code and product vision trapped inside a repo that's one hard drive failure away from losing its latest feature — commit, rotate the password, and add CI before touching anything else.
