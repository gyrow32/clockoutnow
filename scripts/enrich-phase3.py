#!/usr/bin/env python3
"""
Phase 3+4: Google Maps detail pages + Google search for remaining leads.
Reads leads-gmaps-enriched.json, enriches leads without emails, saves back + pushes to Supabase.
"""
import json, os, re, sys, time, random, urllib.parse
from datetime import datetime, timezone
from pathlib import Path

import urllib3
urllib3.disable_warnings()
import requests
from dotenv import load_dotenv

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

repo_root = Path(__file__).resolve().parents[1]
load_dotenv(repo_root / ".env.local")
load_dotenv(repo_root / ".env")
load_dotenv(repo_root / "website" / ".env.local")
load_dotenv(repo_root / "website" / ".env")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
ENRICHED_FILE = os.path.join(DATA_DIR, "leads-gmaps-enriched.json")

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)
EMAIL_RE = re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}')
JUNK_DOMAINS = {
    'sentry-next.wixpress.com', 'wixpress.com', 'example.com', 'domain.com',
    'google.com', 'gstatic.com', 'facebook.com', 'googleapis.com',
    'schema.org', 'w3.org', 'youtube.com', 'yelp.com', 'instagram.com',
    'twitter.com', 'squarespace.com', 'wix.com', 'godaddy.com',
    'fontawesome.com', 'jquery.com', 'jsdelivr.net', 'bootstrapcdn.com',
    'gravatar.com', 'cloudflare.com', 'wordpress.org', 'wordpress.com',
    'webador.com', 'indiantypefoundry.com', 'latofonts.com',
    'sansoxygen.com', 'pixelspread.com', 'astigmatic.com',
    'homedepot.com', 'amtrak.com', 'teamhealth.com',
}

def is_junk(email):
    if not email: return True
    e = email.lower().strip()
    d = e.split('@')[-1]
    if d in JUNK_DOMAINS: return True
    if any(e.startswith(p) for p in ['noreply','no-reply','postmaster','mailer-daemon']): return True
    if any(ext in e for ext in ['.png','.jpg','.gif','.svg','.css','.js']): return True
    if len(e) > 80 or len(e) < 6: return True
    return False

def extract_emails(text):
    raw = EMAIL_RE.findall(text)
    return [e.lower().strip().rstrip('.') for e in raw if not is_junk(e)]


def scrape_website_for_email(url):
    """Quick single-page scrape for email."""
    try:
        resp = requests.get(url, timeout=8, verify=False, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0'
        }, allow_redirects=True)
        emails = extract_emails(resp.text)
        return emails[0] if emails else None
    except:
        return None


def main():
    print("Loading enriched leads...")
    with open(ENRICHED_FILE, encoding='utf-8') as f:
        leads = json.load(f)

    need_email = [l for l in leads if not l.get('email')]
    print(f"Total: {len(leads)}, Need email: {len(need_email)}")

    # â”€â”€ Phase 3: Google Maps detail pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    print(f"\n{'='*60}")
    print(f"PHASE 3: Google Maps detail pages ({len(need_email)} leads)")
    print(f"{'='*60}")

    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0")

    driver = webdriver.Chrome(options=opts)
    gmaps_emails = 0
    gmaps_photos = 0
    new_websites = []

    try:
        for i, lead in enumerate(need_email):
            url = lead.get('google_maps_url')
            if not url:
                continue

            try:
                driver.get(url)
                time.sleep(2.5)

                page = driver.page_source
                emails = extract_emails(page)
                if emails:
                    lead['email'] = emails[0]
                    gmaps_emails += 1
                    print(f"  [{i+1}/{len(need_email)}] {lead['title'][:35]} -> {emails[0]}")

                # Full address
                try:
                    addr_el = driver.find_element(By.CSS_SELECTOR, 'button[data-item-id="address"] .Io6YTe')
                    lead['address'] = addr_el.text
                except NoSuchElementException:
                    pass

                # Photos
                try:
                    imgs = driver.find_elements(By.CSS_SELECTOR, 'button.aoRNLd img')
                    photos = []
                    for img in imgs[:5]:
                        src = img.get_attribute('src')
                        if src and 'googleusercontent' in src:
                            src = re.sub(r'=w\d+-h\d+', '=w800-h600', src)
                            photos.append(src)
                    if photos:
                        lead['photos'] = photos
                        gmaps_photos += 1
                except:
                    pass

                # Website discovery for no-site leads
                if not lead.get('website'):
                    try:
                        site_el = driver.find_element(By.CSS_SELECTOR, 'a[data-item-id="authority"]')
                        new_site = site_el.get_attribute('href')
                        if new_site:
                            lead['website'] = new_site
                            lead['has_website'] = True
                            new_websites.append((lead['title'], new_site))
                    except NoSuchElementException:
                        pass

            except Exception as e:
                if (i+1) % 50 == 0:
                    print(f"  [{i+1}/{len(need_email)}] error: {str(e)[:50]}")

            if (i+1) % 50 == 0 and not lead.get('email'):
                print(f"  [{i+1}/{len(need_email)}] processed... ({gmaps_emails} emails, {gmaps_photos} photos)")

            time.sleep(random.uniform(1.0, 2.0))

    finally:
        driver.quit()

    print(f"\n  GMaps detail: {gmaps_emails} emails, {gmaps_photos} with photos")

    # â”€â”€ Phase 3b: Scrape newly discovered websites â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if new_websites:
        print(f"\n  Scraping {len(new_websites)} newly discovered websites...")
        for name, site in new_websites:
            lead_obj = next((l for l in leads if l['title'] == name), None)
            if lead_obj and not lead_obj.get('email'):
                email = scrape_website_for_email(site)
                if email:
                    lead_obj['email'] = email
                    gmaps_emails += 1
                    print(f"    {name[:35]} -> {email}")

    # â”€â”€ Phase 4: Google search fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    still_need = [l for l in leads if not l.get('email')]
    search_limit = min(len(still_need), 150)
    print(f"\n{'='*60}")
    print(f"PHASE 4: Google search ({search_limit} of {len(still_need)} remaining)")
    print(f"{'='*60}")

    google_emails = 0
    for i, lead in enumerate(still_need[:search_limit]):
        query = f'"{lead["title"]}" {lead.get("location","Buffalo NY")} email OR "@"'
        url = f"https://www.google.com/search?q={urllib.parse.quote_plus(query)}&num=5"
        try:
            resp = requests.get(url, timeout=8, verify=False, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/131.0.0.0'
            })
            emails = extract_emails(resp.text)
            if emails:
                lead['email'] = emails[0]
                google_emails += 1
                print(f"  [{i+1}/{search_limit}] {lead['title'][:35]} -> {emails[0]}")
        except:
            pass

        if (i+1) % 25 == 0 and not lead.get('email'):
            print(f"  [{i+1}/{search_limit}] searched... ({google_emails} found)")

        time.sleep(random.uniform(2, 4))

    print(f"\n  Google search: {google_emails} additional emails")

    # â”€â”€ Save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    leads.sort(key=lambda x: (bool(x.get('email')), x.get('score', 0)), reverse=True)
    with open(ENRICHED_FILE, 'w', encoding='utf-8') as f:
        json.dump(leads, f, indent=2, ensure_ascii=False)

    total = len(leads)
    has_email = sum(1 for l in leads if l.get('email'))
    has_photos = sum(1 for l in leads if l.get('photos'))
    print(f"\n{'='*60}")
    print(f"DONE â€” Emails: {has_email}/{total} ({has_email*100//total}%) | Photos: {has_photos}")
    print(f"{'='*60}")

    # â”€â”€ Push updates to Supabase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    print(f"\nPushing updates to Supabase...")
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("  Missing SUPABASE_URL / SUPABASE_* key, skipping push")
        return
    from supabase import create_client
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    updated = 0
    for lead in leads:
        if not lead.get('email') and not lead.get('photos'):
            continue
        try:
            existing = sb.table('leads').select('id').eq('company_name', lead['title']).execute()
            if existing.data:
                update = {}
                if lead.get('email'):
                    update['email'] = lead['email']
                if lead.get('photos'):
                    update['photos_json'] = json.dumps(
                        [{"url": p, "description": f"Photo {j+1}"} for j, p in enumerate(lead['photos'])]
                    )
                if lead.get('address'):
                    update['location'] = lead['address']
                existing_website = existing.data[0].get('website') if existing.data else None
                if lead.get('website') and not existing_website:
                    update['website'] = lead['website']
                    update['has_website'] = True
                if update:
                    sb.table('leads').update(update).eq('id', existing.data[0]['id']).execute()
                    updated += 1
        except:
            pass

        if updated % 50 == 0 and updated > 0:
            print(f"  {updated} rows updated...")

    print(f"  Supabase: {updated} rows updated")

    # Top new finds
    new_email_leads = [l for l in leads if l.get('email')]
    print(f"\nTop 10 leads with emails:")
    for lead in new_email_leads[:10]:
        site = "NO SITE" if not lead.get('has_website') else "has site"
        phone = lead.get('phone', '?')
        print(f"  [{lead.get('score',0)}] {lead['title'][:35]} | {lead['email'][:35]} | {phone} | {site}")


if __name__ == '__main__':
    main()

