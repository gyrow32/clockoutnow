# AGENTS.md — Agent Guidance

Read `CLAUDE.md` first. This file covers agent-specific rules.

## Key Principle
The preview website IS the product. Everything in the pipeline exists to produce a stunning preview site and get it in front of the right person's inbox. If any step is broken, the whole thing is worthless.

## Pipeline Status Flow
`NEW` → `RESEARCHING` → `READY` → `SITE_GENERATED` → `IMAGE_GENERATED` → `CONTACTED` → `REPLIED` → `CLOSED`

## Source of Truth
- All lead/campaign/analytics data lives in **Supabase** (leads, campaigns, page_views tables)
- Preview pages live in `public/preview-pages/*.htm`
- Scripts live in `scripts/`

## Site Generation Rules
- Reference quality: `derme-family-remodeling.htm`, `stalczynski-contracting.htm`
- Minimum 400+ lines of HTML — anything shorter is a generic template and must be regenerated
- Must include: Google Fonts, CSS variables, hover effects, responsive design, real business data
- If no photos found online, generate with Gemini API — never leave image placeholders empty
- Every site should feel unique to that business, not cookie-cutter
