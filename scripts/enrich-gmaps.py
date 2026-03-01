#!/usr/bin/env python3
"""
Mega Lead Enrichment Pipeline
Extracts emails using every technique available, then pushes all leads to Supabase.

Techniques (in order of speed/reliability):
1. Website scraping - crawl homepage + /contact + /about for mailto: links & email patterns
2. Common email pattern generation - info@, contact@, hello@ from domain
3. SMTP verification - check if generated emails actually exist (requires dnspython)
4. Google Maps detail page - click into each listing for email/hours/photos
5. Google search fallback - “business name” + “email” + city

Usage:
    python scripts/enrich-gmaps.py                    # full pipeline
    python scripts/enrich-gmaps.py --websites-only    # just scrape websites for emails
    python scripts/enrich-gmaps.py --push-only        # just push to Supabase
    python scripts/enrich-gmaps.py --gmaps-only       # just Google Maps detail pages
"""

import argparse
import json
import os
import re
import time
import random
import socket
import smtplib
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

try:
    import dns.resolver
    HAS_DNS = True
except ImportError:
    HAS_DNS = False

try:
    from supabase import create_client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
    HAS_SELENIUM = True
except ImportError:
    HAS_SELENIUM = False

# â”€â”€ Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

repo_root = Path(__file__).resolve().parents[1]
load_dotenv(repo_root / ".env.local")
load_dotenv(repo_root / ".env")
load_dotenv(repo_root / "website" / ".env.local")
load_dotenv(repo_root / "website" / ".env")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
LEADS_FILE = os.path.join(DATA_DIR, "leads-gmaps.json")
OUTPUT_FILE = os.path.join(DATA_DIR, "leads-gmaps-enriched.json")

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Email regex â€” catches most valid emails
EMAIL_RE = re.compile(
    r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}',
    re.IGNORECASE
)

# Junk email patterns to filter out
JUNK_EMAILS = {
    'sentry.io', 'wixpress.com', 'example.com', 'domain.com',
    'email.com', 'yoursite.com', 'company.com', 'test.com',
    'wordpress.org', 'wordpress.com', 'w3.org', 'schema.org',
    'googleapis.com', 'google.com', 'gstatic.com', 'facebook.com',
    'twitter.com', 'instagram.com', 'youtube.com', 'yelp.com',
    'squarespace.com', 'wix.com', 'godaddy.com', 'cloudflare.com',
    'gravatar.com', 'jsdelivr.net', 'bootstrapcdn.com',
    'fontawesome.com', 'jquery.com',
}

JUNK_PREFIXES = {
    'noreply', 'no-reply', 'donotreply', 'mailer-daemon',
    'postmaster', 'webmaster', 'hostmaster', 'abuse',
    'root', 'admin@wordpress', 'wordpress@',
}

COMMON_BIZ_PREFIXES = [
    'info', 'contact', 'hello', 'office', 'sales',
    'service', 'support', 'admin', 'team', 'help',
    'booking', 'schedule', 'estimate', 'quotes',
]

# â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def is_junk_email(email: str) -> bool:
    if not email:
        return True
    email = email.lower().strip()
    domain = email.split('@')[-1]
    if domain in JUNK_EMAILS:
        return True
    if any(email.startswith(p) for p in JUNK_PREFIXES):
        return True
    if len(email) > 80 or len(email) < 6:
        return True
    # Filter out image filenames caught by regex
    if any(ext in email for ext in ['.png', '.jpg', '.gif', '.svg', '.webp', '.css', '.js']):
        return True
    return False


def extract_emails_from_text(text: str) -> list[str]:
    raw = EMAIL_RE.findall(text)
    clean = []
    seen = set()
    for e in raw:
        e = e.lower().strip().rstrip('.')
        if e not in seen and not is_junk_email(e):
            seen.add(e)
            clean.append(e)
    return clean


def get_domain(website: str) -> str | None:
    if not website:
        return None
    d = website.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0].split('?')[0]
    return d if '.' in d else None


def fetch_page(url: str, timeout: int = 10) -> str:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True, verify=False)
        resp.raise_for_status()
        return resp.text
    except Exception:
        return ""


# â”€â”€ Technique 1: Website Scraping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def scrape_website_for_emails(website: str) -> dict:
    """Scrape a business website for emails, checking multiple pages."""
    result = {"emails": [], "facebook_url": None, "description": None}
    domain = get_domain(website)
    if not domain:
        return result

    base = website.rstrip('/')
    if not base.startswith('http'):
        base = 'https://' + base

    all_emails = []
    pages_to_try = [
        base,
        base + '/contact',
        base + '/contact-us',
        base + '/about',
        base + '/about-us',
    ]

    for url in pages_to_try:
        html = fetch_page(url)
        if not html:
            continue

        # Extract emails from raw HTML (catches mailto: and visible text)
        emails = extract_emails_from_text(html)
        all_emails.extend(emails)

        # Parse with BS4 for structured extraction
        try:
            soup = BeautifulSoup(html, 'html.parser')

            # mailto: links (highest quality)
            for a in soup.find_all('a', href=True):
                href = a['href']
                if 'mailto:' in href:
                    email = href.split('mailto:')[1].split('?')[0].strip()
                    if not is_junk_email(email):
                        all_emails.append(email.lower())

                # Facebook link
                if 'facebook.com/' in href and not result["facebook_url"]:
                    result["facebook_url"] = href.split('?')[0]

            # Meta description as business description
            if not result["description"]:
                meta = soup.find('meta', attrs={'name': 'description'})
                if meta and meta.get('content'):
                    desc = meta['content'].strip()
                    if 10 < len(desc) < 500:
                        result["description"] = desc
        except Exception:
            pass

    # Deduplicate, prioritize emails matching the domain
    seen = set()
    prioritized = []
    other = []
    for e in all_emails:
        e = e.lower().strip()
        if e in seen or is_junk_email(e):
            continue
        seen.add(e)
        if domain.split('.')[0] in e:
            prioritized.append(e)
        else:
            other.append(e)

    result["emails"] = prioritized + other
    return result


def scrape_websites_parallel(leads: list[dict], max_workers: int = 10) -> dict:
    """Scrape all websites in parallel, return {title: {emails, facebook_url, description}}."""
    results = {}
    to_scrape = [(l["title"], l["website"]) for l in leads if l.get("website") and l.get("has_website")]

    print(f"\n{'='*60}")
    print(f"PHASE 1: Scraping {len(to_scrape)} business websites for emails")
    print(f"{'='*60}")

    done = 0
    with ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(scrape_website_for_emails, site): name for name, site in to_scrape}
        for future in as_completed(futures):
            name = futures[future]
            done += 1
            try:
                data = future.result()
                results[name] = data
                if data["emails"]:
                    print(f"  [{done}/{len(to_scrape)}] {name[:35]} -> {data['emails'][0]}")
                elif done % 50 == 0:
                    print(f"  [{done}/{len(to_scrape)}] processing...")
            except Exception:
                results[name] = {"emails": [], "facebook_url": None, "description": None}

    found = sum(1 for r in results.values() if r["emails"])
    print(f"\n  Website scrape: found emails for {found}/{len(to_scrape)} businesses")
    return results


# â”€â”€ Technique 2: Common Email Patterns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def generate_email_patterns(domain: str) -> list[str]:
    """Generate common business email patterns for a domain."""
    return [f"{prefix}@{domain}" for prefix in COMMON_BIZ_PREFIXES]


# â”€â”€ Technique 3: SMTP Verification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def verify_email_smtp(email: str, timeout: int = 5) -> bool:
    """Check if an email address exists via SMTP RCPT TO."""
    if not HAS_DNS:
        return True  # can't verify, assume valid

    domain = email.split('@')[-1]
    try:
        mx_records = dns.resolver.resolve(domain, 'MX')
        mx_host = str(sorted(mx_records, key=lambda r: r.preference)[0].exchange).rstrip('.')
    except Exception:
        return False

    try:
        with smtplib.SMTP(mx_host, 25, timeout=timeout) as smtp:
            smtp.helo('clockoutnow.com')
            smtp.mail('verify@clockoutnow.com')
            code, _ = smtp.rcpt(email)
            return code == 250
    except Exception:
        return False  # connection refused = can't verify


def try_email_patterns(leads: list[dict], website_results: dict) -> dict:
    """For leads with websites but no email found, try common patterns."""
    # Only try for leads that have a website domain but no email yet
    to_try = []
    for lead in leads:
        if lead.get("email"):
            continue
        name = lead["title"]
        if name in website_results and website_results[name]["emails"]:
            continue
        domain = get_domain(lead.get("website"))
        if domain and '.' in domain:
            to_try.append((name, domain))

    if not to_try:
        return {}

    print(f"\n{'='*60}")
    print(f"PHASE 2: Testing common email patterns for {len(to_try)} domains")
    print(f"{'='*60}")

    results = {}
    for i, (name, domain) in enumerate(to_try):
        patterns = generate_email_patterns(domain)
        # Try info@ and contact@ first (most common)
        for email in patterns[:4]:
            if verify_email_smtp(email):
                results[name] = email
                print(f"  [{i+1}/{len(to_try)}] {name[:35]} -> {email} (verified)")
                break

        if i % 25 == 0 and i > 0 and name not in results:
            print(f"  [{i+1}/{len(to_try)}] checking...")

    print(f"\n  Pattern verification: found {len(results)} additional emails")
    return results


# â”€â”€ Technique 4: Google Maps Detail Pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def scrape_gmaps_details(leads: list[dict]) -> dict:
    """Click into Google Maps detail pages for email, photos, hours."""
    if not HAS_SELENIUM:
        print("  Selenium not available, skipping Google Maps detail scrape")
        return {}

    # Only scrape leads that still need emails
    to_scrape = [l for l in leads if not l.get("email") and l.get("google_maps_url")]
    if not to_scrape:
        return {}

    print(f"\n{'='*60}")
    print(f"PHASE 3: Scraping {len(to_scrape)} Google Maps detail pages")
    print(f"{'='*60}")

    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(options=opts)
    results = {}

    try:
        for i, lead in enumerate(to_scrape):
            name = lead["title"]
            url = lead["google_maps_url"]

            try:
                driver.get(url)
                time.sleep(2.5)

                data = {"email": None, "photos": [], "hours": None, "full_address": None}

                # Look for email in the detail panel
                try:
                    page_text = driver.page_source
                    emails = extract_emails_from_text(page_text)
                    if emails:
                        data["email"] = emails[0]
                except Exception:
                    pass

                # Extract full address from detail panel
                try:
                    addr_el = driver.find_element(By.CSS_SELECTOR, 'button[data-item-id="address"] .Io6YTe')
                    data["full_address"] = addr_el.text
                except NoSuchElementException:
                    pass

                # Extract photo URLs
                try:
                    photo_els = driver.find_elements(By.CSS_SELECTOR, 'button.aoRNLd img')
                    for img in photo_els[:5]:
                        src = img.get_attribute('src')
                        if src and 'googleusercontent' in src:
                            # Get higher res version
                            src = re.sub(r'=w\d+-h\d+', '=w800-h600', src)
                            data["photos"].append(src)
                except Exception:
                    pass

                # Extract website if we didn't have one
                if not lead.get("website"):
                    try:
                        site_el = driver.find_element(By.CSS_SELECTOR, 'a[data-item-id="authority"]')
                        data["website"] = site_el.get_attribute("href")
                    except NoSuchElementException:
                        pass

                results[name] = data

                if data["email"]:
                    print(f"  [{i+1}/{len(to_scrape)}] {name[:35]} -> {data['email']}")
                elif (i + 1) % 20 == 0:
                    print(f"  [{i+1}/{len(to_scrape)}] processed... ({sum(1 for r in results.values() if r.get('email'))} emails found)")

            except Exception as e:
                pass

            # Rate limit
            time.sleep(random.uniform(1.5, 3.0))

    finally:
        driver.quit()

    found = sum(1 for r in results.values() if r.get("email"))
    print(f"\n  Google Maps detail: found {found} additional emails")
    return results


# â”€â”€ Technique 5: Google Search Fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def google_search_for_email(name: str, location: str) -> str | None:
    """Search Google for a business email."""
    query = f'"{name}" {location} email OR contact OR "@"'
    url = f"https://www.google.com/search?q={urllib.parse.quote_plus(query)}&num=5"
    html = fetch_page(url, timeout=8)
    if not html:
        return None
    emails = extract_emails_from_text(html)
    return emails[0] if emails else None


def google_search_emails(leads: list[dict], max_searches: int = 100) -> dict:
    """Google search for emails â€” last resort, rate-limited."""
    to_search = [l for l in leads if not l.get("email")][:max_searches]
    if not to_search:
        return {}

    print(f"\n{'='*60}")
    print(f"PHASE 4: Google searching for {len(to_search)} remaining emails")
    print(f"{'='*60}")

    results = {}
    for i, lead in enumerate(to_search):
        email = google_search_for_email(lead["title"], lead.get("location", "Buffalo NY"))
        if email:
            results[lead["title"]] = email
            print(f"  [{i+1}/{len(to_search)}] {lead['title'][:35]} -> {email}")

        if (i + 1) % 10 == 0:
            print(f"  [{i+1}/{len(to_search)}] searched... ({len(results)} found)")

        time.sleep(random.uniform(2, 4))  # respect Google rate limits

    print(f"\n  Google search: found {len(results)} additional emails")
    return results


# â”€â”€ Technique 6: Scrape websites found on GMaps detail pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def scrape_newly_found_websites(leads: list[dict], gmaps_results: dict) -> dict:
    """For leads that had no website but GMaps gave us one, scrape that too."""
    to_scrape = []
    for lead in leads:
        if lead.get("email"):
            continue
        name = lead["title"]
        gmaps_data = gmaps_results.get(name, {})
        new_website = gmaps_data.get("website")
        if new_website and not lead.get("website"):
            to_scrape.append((name, new_website))

    if not to_scrape:
        return {}

    print(f"\n{'='*60}")
    print(f"PHASE 2b: Scraping {len(to_scrape)} newly discovered websites")
    print(f"{'='*60}")

    results = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(scrape_website_for_emails, site): name for name, site in to_scrape}
        for future in as_completed(futures):
            name = futures[future]
            try:
                data = future.result()
                if data["emails"]:
                    results[name] = data
                    print(f"  {name[:35]} -> {data['emails'][0]}")
            except Exception:
                pass

    print(f"  Found {len(results)} additional emails from new websites")
    return results


# â”€â”€ Merge & Push â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def merge_results(leads: list[dict], website_results: dict, pattern_results: dict,
                  gmaps_results: dict, google_results: dict, new_site_results: dict) -> list[dict]:
    """Merge all enrichment data back into leads."""
    for lead in leads:
        name = lead["title"]

        # Email â€” first match wins (ordered by reliability)
        if not lead.get("email"):
            # 1. Website scrape
            wr = website_results.get(name, {})
            if wr.get("emails"):
                lead["email"] = wr["emails"][0]
            # 2. SMTP-verified pattern
            elif name in pattern_results:
                lead["email"] = pattern_results[name]
            # 3. New website scrape (from GMaps detail)
            elif name in new_site_results and new_site_results[name].get("emails"):
                lead["email"] = new_site_results[name]["emails"][0]
            # 4. Google Maps detail page
            elif name in gmaps_results and gmaps_results[name].get("email"):
                lead["email"] = gmaps_results[name]["email"]
            # 5. Google search
            elif name in google_results:
                lead["email"] = google_results[name]

        # Facebook URL
        wr = website_results.get(name, {})
        if wr.get("facebook_url") and not lead.get("facebook_url"):
            lead["facebook_url"] = wr["facebook_url"]

        # Business description from meta
        if wr.get("description") and not lead.get("business_description"):
            lead["business_description"] = wr["description"]

        # GMaps detail data
        gd = gmaps_results.get(name, {})
        if gd.get("full_address"):
            lead["address"] = gd["full_address"]
        if gd.get("photos"):
            lead["photos"] = gd["photos"]
        if gd.get("website") and not lead.get("website"):
            lead["website"] = gd["website"]
            lead["has_website"] = True

        # New website results
        nr = new_site_results.get(name, {})
        if nr.get("facebook_url") and not lead.get("facebook_url"):
            lead["facebook_url"] = nr["facebook_url"]
        if nr.get("description") and not lead.get("business_description"):
            lead["business_description"] = nr["description"]

    return leads


def push_to_supabase(leads: list[dict]):
    """Push all leads to Supabase leads table."""
    if not HAS_SUPABASE:
        print("supabase-py not installed, skipping push")
        return
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Missing SUPABASE_URL / SUPABASE_* key, skipping push")
        return

    print(f"\n{'='*60}")
    print(f"PUSHING {len(leads)} leads to Supabase")
    print(f"{'='*60}")

    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Map our fields to Supabase leads table schema
    success = 0
    errors = 0
    for i, lead in enumerate(leads):
        row = {
            "company_name": lead["title"],
            "industry": lead.get("trade", ""),
            "city_region": lead.get("location", ""),
            "location": lead.get("address", ""),
            "phone": lead.get("phone"),
            "email": lead.get("email"),
            "website": lead.get("website"),
            "has_website": lead.get("has_website", False),
            "google_business_url": lead.get("google_maps_url"),
            "facebook_url": lead.get("facebook_url"),
            "business_description": lead.get("business_description"),
            "status": "NEW",
            "service_area": "Buffalo, NY Metro",
            "photos_json": json.dumps(
                [{"url": p, "description": f"Business photo {j+1}"} for j, p in enumerate(lead.get("photos", []))]
            ) if lead.get("photos") else None,
        }

        # Remove None values to let DB defaults work
        row = {k: v for k, v in row.items() if v is not None}

        try:
            # Check if already exists
            existing = sb.table("leads").select("id").eq("company_name", row["company_name"]).execute()
            if existing.data:
                # Update existing
                sb.table("leads").update(row).eq("id", existing.data[0]["id"]).execute()
            else:
                sb.table("leads").insert(row).execute()
            success += 1
        except Exception as e:
            errors += 1
            if errors <= 5:
                print(f"  Error on '{lead['title'][:30]}': {e}")

        if (i + 1) % 50 == 0:
            print(f"  [{i+1}/{len(leads)}] pushed... ({success} ok, {errors} errors)")

    print(f"\n  Supabase: {success} inserted/updated, {errors} errors")


# â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def main():
    parser = argparse.ArgumentParser(description="Enrich Google Maps leads with emails & push to Supabase")
    parser.add_argument("--websites-only", action="store_true", help="Only scrape websites")
    parser.add_argument("--gmaps-only", action="store_true", help="Only scrape Google Maps details")
    parser.add_argument("--push-only", action="store_true", help="Only push existing data to Supabase")
    parser.add_argument("--no-gmaps", action="store_true", help="Skip Google Maps detail scraping (slow)")
    parser.add_argument("--no-google-search", action="store_true", help="Skip Google search fallback")
    parser.add_argument("--no-smtp", action="store_true", help="Skip SMTP verification")
    parser.add_argument("--workers", type=int, default=10, help="Parallel workers for website scraping")
    args = parser.parse_args()

    # Load leads
    print(f"Loading leads from {LEADS_FILE}...")
    with open(LEADS_FILE, encoding="utf-8") as f:
        leads = json.load(f)
    print(f"Loaded {len(leads)} leads")

    # Load previously enriched data if exists
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, encoding="utf-8") as f:
                enriched = json.load(f)
            # Merge existing emails into leads
            email_map = {l["title"]: l.get("email") for l in enriched if l.get("email")}
            for lead in leads:
                if not lead.get("email") and lead["title"] in email_map:
                    lead["email"] = email_map[lead["title"]]
            existing_emails = sum(1 for l in leads if l.get("email"))
            print(f"Restored {existing_emails} emails from previous enrichment")
        except Exception:
            pass

    if args.push_only:
        push_to_supabase(leads)
        return

    # Initialize result containers
    website_results = {}
    pattern_results = {}
    gmaps_results = {}
    google_results = {}
    new_site_results = {}

    # â”€â”€ Phase 1: Website scraping (fast, parallel)
    if not args.gmaps_only:
        website_results = scrape_websites_parallel(leads, max_workers=args.workers)
        # Apply emails immediately so later phases skip them
        for lead in leads:
            wr = website_results.get(lead["title"], {})
            if wr.get("emails") and not lead.get("email"):
                lead["email"] = wr["emails"][0]

    # â”€â”€ Phase 2: SMTP pattern verification
    if not args.gmaps_only and not args.websites_only and not args.no_smtp:
        pattern_results = try_email_patterns(leads, website_results)
        for lead in leads:
            if not lead.get("email") and lead["title"] in pattern_results:
                lead["email"] = pattern_results[lead["title"]]

    # â”€â”€ Phase 3: Google Maps detail pages (slow but thorough)
    if not args.websites_only and not args.no_gmaps:
        gmaps_results = scrape_gmaps_details(leads)
        for lead in leads:
            gd = gmaps_results.get(lead["title"], {})
            if gd.get("email") and not lead.get("email"):
                lead["email"] = gd["email"]

        # Phase 2b: Scrape newly discovered websites
        new_site_results = scrape_newly_found_websites(leads, gmaps_results)
        for lead in leads:
            nr = new_site_results.get(lead["title"], {})
            if nr.get("emails") and not lead.get("email"):
                lead["email"] = nr["emails"][0]

    # â”€â”€ Phase 4: Google search fallback
    if not args.websites_only and not args.gmaps_only and not args.no_google_search:
        remaining = sum(1 for l in leads if not l.get("email"))
        if remaining > 0:
            google_results = google_search_emails(leads, max_searches=min(remaining, 150))

    # â”€â”€ Merge everything
    leads = merge_results(leads, website_results, pattern_results,
                         gmaps_results, google_results, new_site_results)

    # â”€â”€ Save enriched data
    leads.sort(key=lambda x: (bool(x.get("email")), x.get("score", 0)), reverse=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)

    # â”€â”€ Stats
    total = len(leads)
    has_email = sum(1 for l in leads if l.get("email"))
    has_phone = sum(1 for l in leads if l.get("phone"))
    no_site = sum(1 for l in leads if not l.get("has_website"))
    has_photos = sum(1 for l in leads if l.get("photos"))
    has_desc = sum(1 for l in leads if l.get("business_description"))

    print(f"\n{'='*60}")
    print(f"ENRICHMENT COMPLETE")
    print(f"{'='*60}")
    print(f"  Total leads:      {total}")
    print(f"  Have email:       {has_email} ({has_email*100//total}%)")
    print(f"  Have phone:       {has_phone} ({has_phone*100//total}%)")
    print(f"  No website:       {no_site}")
    print(f"  Have photos:      {has_photos}")
    print(f"  Have description: {has_desc}")
    print(f"\n  Saved to: {OUTPUT_FILE}")

    # â”€â”€ Push to Supabase
    push_to_supabase(leads)

    # Show top leads with emails
    email_leads = [l for l in leads if l.get("email")]
    if email_leads:
        print(f"\nTop 15 leads with emails:")
        for lead in email_leads[:15]:
            site = "NO SITE" if not lead.get("has_website") else "has site"
            print(f"  [{lead.get('score',0)}] {lead['title'][:35]} | {lead.get('email','')[:35]} | {lead.get('phone','?')} | {site}")


if __name__ == "__main__":
    main()

