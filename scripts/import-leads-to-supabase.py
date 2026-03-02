#!/usr/bin/env python3
"""
import-leads-to-supabase.py — Consolidate all lead data and push to Supabase.

Merges data from:
  1. leads-gmaps-enriched.json (Google Maps, best email coverage)
  2. new-cl-leads.json (hand-curated Craigslist leads)
  3. leads-auto.json (raw CL scrapes, Buffalo high-score only)

Deduplicates by normalized phone number, maps to Supabase schema, and upserts.

Usage:
    python import-leads-to-supabase.py [--dry-run]
"""

import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime

# ---------- paths ----------
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
DATA_DIR = ROOT_DIR / "data"

# ---------- env ----------
def load_env(path: Path) -> dict:
    env = {}
    if not path.exists():
        return env
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env

env = load_env(ROOT_DIR / ".env.local")
SUPABASE_URL = env.get("SUPABASE_URL") or env.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = env.get("SUPABASE_ANON_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials in .env.local")
    sys.exit(1)


# ---------- helpers ----------
def normalize_phone(phone: str) -> str:
    """Strip to digits only for dedup."""
    if not phone:
        return ""
    digits = re.sub(r'\D', '', str(phone))
    # Handle leading 1 (country code)
    if len(digits) == 11 and digits.startswith('1'):
        digits = digits[1:]
    return digits


def format_phone(phone: str) -> str:
    """Format phone as (XXX) XXX-XXXX."""
    digits = normalize_phone(phone)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    return phone  # return as-is if can't format


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def clean_website_url(url: str) -> str:
    """Extract actual URL from Google redirect wrappers."""
    if not url:
        return ""
    # Handle Google redirect URLs
    match = re.search(r'[?&]q=(https?://[^&]+)', url)
    if match:
        from urllib.parse import unquote
        return unquote(match.group(1))
    return url


def map_trade_to_industry(trade: str) -> str:
    """Map GMaps trade names to clean industry labels."""
    mapping = {
        'plumber': 'Plumbing',
        'plumbing': 'Plumbing',
        'electrician': 'Electrical',
        'electrical': 'Electrical',
        'roofer': 'Roofing',
        'roofing': 'Roofing',
        'HVAC': 'HVAC',
        'hvac': 'HVAC',
        'heating': 'HVAC',
        'handyman': 'Handyman',
        'painter': 'Painting',
        'painting': 'Painting',
        'cleaning': 'Cleaning',
        'flooring': 'Flooring',
        'carpet': 'Flooring',
        'remodeling': 'Remodeling',
        'remodel': 'Remodeling',
        'garage door': 'Garage Doors',
        'concrete': 'Concrete',
        'paving': 'Paving',
        'siding': 'Siding',
        'gutter': 'Roofing',
        'landscaping': 'Landscaping',
        'window': 'Windows',
        'drywall': 'Remodeling',
        'demolition': 'General Contractor',
        'snow': 'Snow Removal',
        'tree': 'Tree Service',
    }
    return mapping.get(trade, trade.title() if trade else 'General Contractor')


# ---------- load sources ----------
def load_gmaps_enriched() -> list:
    """Load Google Maps enriched leads — our strongest source."""
    path = DATA_DIR / "leads-gmaps-enriched.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding='utf-8'))
    leads = []
    for r in data:
        phone = normalize_phone(r.get('phone', ''))
        if not phone and not r.get('email'):
            continue  # Skip leads with no contact info

        website = clean_website_url(r.get('website', ''))

        lead = {
            'company_name': r.get('title', '').strip(),
            'industry': map_trade_to_industry(r.get('trade', '')),
            'city_region': r.get('location', ''),
            'location': r.get('address', ''),
            'phone': format_phone(r.get('phone', '')),
            'email': (r.get('email') or '').strip().lower(),
            'website': website,
            'has_website': bool(website and r.get('has_website')),
            'craigslist_url': None,
            'google_business_url': r.get('google_maps_url', ''),
            'status': 'NEW',
            'business_strength': f"Rating: {r.get('rating', 'N/A')} ({r.get('review_count', 0)} reviews)",
            'service_area': r.get('location', ''),
            '_source': 'gmaps',
            '_phone_key': phone,
            '_score': r.get('score', 0),
            '_rating': r.get('rating', 0),
            '_reviews': r.get('review_count', 0),
        }
        leads.append(lead)
    return leads


def load_cl_curated() -> list:
    """Load hand-curated CL leads — best business context."""
    path = DATA_DIR / "new-cl-leads.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding='utf-8'))
    leads = []
    for r in data:
        phone = normalize_phone(r.get('Phone', ''))
        lead = {
            'company_name': r.get('Company Name', '').strip(),
            'industry': r.get('Industry', ''),
            'city_region': r.get('City / Region', ''),
            'location': r.get('Location', ''),
            'service_area': r.get('Service Area', ''),
            'services_offered': r.get('Services Offered', ''),
            'phone': format_phone(r.get('Phone', '')),
            'email': (r.get('Email') or '').strip().lower(),
            'website': r.get('Website', ''),
            'craigslist_url': r.get('Craigslist URL', ''),
            'has_website': r.get('Has Website?', '').lower() == 'yes',
            'status': 'NEW',
            'business_strength': r.get('Business Strength', ''),
            'landing_page_notes': r.get('Landing Page Notes', ''),
            '_source': 'cl_curated',
            '_phone_key': phone,
            '_score': 8,  # curated = high value
        }
        leads.append(lead)
    return leads


def load_cl_auto() -> list:
    """Load high-score Buffalo CL leads."""
    path = DATA_DIR / "leads-auto.json"
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding='utf-8'))
    leads = []
    for r in data:
        # Only Buffalo, score 7+, with phone
        if r.get('market') != 'buffalo':
            continue
        if r.get('score', 0) < 7:
            continue
        phone = normalize_phone(r.get('phone', ''))
        if not phone:
            continue

        # Extract business name from title (strip price/location suffix)
        title = r.get('title', '')
        name = title.split('$')[0].strip()
        # Clean up common CL title patterns
        name = re.sub(r'\s*\d{3}[-.]?\d{3}[-.]?\d{4}\s*', '', name).strip()

        # Map CL keywords to clean industry label (use first keyword)
        keywords = r.get('keywords', [])
        industry = map_trade_to_industry(keywords[0] if keywords else '') if keywords else 'General Contractor'

        lead = {
            'company_name': name or title,
            'industry': industry,
            'city_region': r.get('location', ''),
            'location': r.get('location', ''),
            'phone': format_phone(r.get('phone', '')),
            'email': (r.get('email') or '').strip().lower(),
            'website': r.get('website', ''),
            'has_website': bool(r.get('website')),
            'craigslist_url': r.get('url', ''),
            'status': 'NEW',
            'business_strength': ', '.join(r.get('indicators', [])),
            '_source': 'cl_auto',
            '_phone_key': phone,
            '_score': r.get('score', 0),
        }
        leads.append(lead)
    return leads


# ---------- merge & deduplicate ----------
def merge_leads(gmaps: list, cl_curated: list, cl_auto: list) -> list:
    """
    Merge all sources. Priority: cl_curated > gmaps (has emails) > cl_auto.
    Deduplicate by phone number, keeping the richest record.
    """
    seen = {}  # phone_key -> lead

    # Load in priority order (lower priority first, higher overwrites)
    # cl_auto first (lowest priority)
    for lead in cl_auto:
        key = lead['_phone_key']
        if key and key not in seen:
            seen[key] = lead

    # gmaps next (has emails, ratings)
    for lead in gmaps:
        key = lead['_phone_key']
        if not key:
            # No phone — use company name as key
            key = slugify(lead['company_name'])
        if key not in seen:
            seen[key] = lead
        else:
            # Merge: keep gmaps email/rating if existing record doesn't have them
            existing = seen[key]
            if lead.get('email') and not existing.get('email'):
                existing['email'] = lead['email']
            if lead.get('google_business_url') and not existing.get('google_business_url'):
                existing['google_business_url'] = lead['google_business_url']
            if lead.get('business_strength') and 'Rating' in lead.get('business_strength', ''):
                existing['business_strength'] = lead['business_strength']

    # cl_curated last (highest priority — overwrites with enriched data)
    for lead in cl_curated:
        key = lead['_phone_key']
        if key and key in seen:
            existing = seen[key]
            # Merge curated data over existing
            for field in ['company_name', 'services_offered', 'service_area', 'landing_page_notes', 'business_strength']:
                if lead.get(field):
                    existing[field] = lead[field]
            if lead.get('craigslist_url'):
                existing['craigslist_url'] = lead['craigslist_url']
        elif key:
            seen[key] = lead
        else:
            # No phone — add by name
            name_key = slugify(lead['company_name'])
            if name_key not in seen:
                seen[name_key] = lead

    return list(seen.values())


# ---------- push to supabase ----------
def push_to_supabase(leads: list, dry_run: bool = False):
    """Insert leads into Supabase via REST API."""
    import urllib.request

    url = f"{SUPABASE_URL}/rest/v1/leads"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    # Clean internal fields before sending
    clean_fields = [
        'company_name', 'industry', 'city_region', 'location', 'service_area',
        'services_offered', 'phone', 'email', 'website', 'craigslist_url',
        'has_website', 'business_strength', 'landing_page_notes', 'status',
        'google_business_url',
    ]

    records = []
    for lead in leads:
        # Every record must have ALL fields (PostgREST requires uniform keys in batch)
        record = {}
        for field in clean_fields:
            val = lead.get(field)
            record[field] = val if val is not None and val != '' else None
        # has_website should be boolean, not None
        record['has_website'] = bool(lead.get('has_website'))
        if record.get('company_name'):
            records.append(record)

    if dry_run:
        print(f"\nDRY RUN — Would insert {len(records)} leads to Supabase")
        print("\nSample records:")
        for r in records[:5]:
            print(f"  {r['company_name']:40s} | {r.get('industry',''):15s} | {r.get('email',''):30s} | {r.get('phone','')}")
        return len(records)

    # Batch insert (Supabase REST supports array POST)
    BATCH_SIZE = 50
    inserted = 0
    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i:i+BATCH_SIZE]
        payload = json.dumps(batch).encode('utf-8')
        req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                inserted += len(batch)
                print(f"  Inserted batch {i//BATCH_SIZE + 1}: {len(batch)} records (total: {inserted})")
        except Exception as e:
            error_body = ""
            if hasattr(e, 'read'):
                error_body = e.read().decode()
            print(f"  ERROR inserting batch {i//BATCH_SIZE + 1}: {e}")
            if error_body:
                print(f"  Response: {error_body[:300]}")

    return inserted


# ---------- main ----------
def main():
    dry_run = "--dry-run" in sys.argv

    print("=" * 70)
    print("LEAD DATA CONSOLIDATION & SUPABASE IMPORT")
    print("=" * 70)

    # Load all sources
    print("\n--- Loading data sources ---")
    gmaps = load_gmaps_enriched()
    print(f"  GMaps enriched: {len(gmaps)} leads ({sum(1 for l in gmaps if l.get('email'))} with email)")

    cl_curated = load_cl_curated()
    print(f"  CL curated:     {len(cl_curated)} leads")

    cl_auto = load_cl_auto()
    print(f"  CL auto (BUF 7+): {len(cl_auto)} leads")

    # Merge
    print("\n--- Merging & deduplicating ---")
    merged = merge_leads(gmaps, cl_curated, cl_auto)
    print(f"  Total unique leads: {len(merged)}")

    # Stats
    with_email = sum(1 for l in merged if l.get('email'))
    with_phone = sum(1 for l in merged if l.get('phone'))
    no_website = sum(1 for l in merged if not l.get('has_website'))
    print(f"  With email:    {with_email}")
    print(f"  With phone:    {with_phone}")
    print(f"  No website:    {no_website} (our best prospects)")

    # By industry
    industries = {}
    for l in merged:
        ind = l.get('industry', 'Unknown')
        industries[ind] = industries.get(ind, 0) + 1
    print(f"\n  By industry:")
    for ind, count in sorted(industries.items(), key=lambda x: -x[1]):
        print(f"    {ind:20s}: {count}")

    # Push
    print("\n--- Pushing to Supabase ---")
    count = push_to_supabase(merged, dry_run=dry_run)
    print(f"\n{'Would insert' if dry_run else 'Inserted'}: {count} leads")

    # Save merged data locally as backup
    backup_path = DATA_DIR / "leads-merged-clean.json"
    clean = []
    for l in merged:
        c = {k: v for k, v in l.items() if not k.startswith('_')}
        clean.append(c)
    backup_path.write_text(json.dumps(clean, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"\nLocal backup saved: {backup_path}")

    print("\n" + "=" * 70)
    if dry_run:
        print("DRY RUN COMPLETE — run without --dry-run to push to Supabase")
    else:
        print("IMPORT COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()
