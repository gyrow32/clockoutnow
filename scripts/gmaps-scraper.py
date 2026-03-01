#!/usr/bin/env python3
"""
Google Maps Business Scraper (Selenium)
Searches Google Maps for local trades in Buffalo area,
extracts business info, flags businesses without websites.
"""

import argparse
import json
import os
import re
import time
import random
import urllib.parse
from datetime import datetime, timezone

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# ── Config ───────────────────────────────────────────────────────────────────

TRADES = [
    "plumber", "electrician", "roofer", "HVAC", "handyman",
    "painter", "flooring", "cleaning", "remodeling", "garage door",
]

LOCATIONS = [
    "Lancaster NY", "Buffalo NY", "Cheektowaga NY",
    "Depew NY", "Tonawanda NY", "Lockport NY",
]

NEARBY_LOCATIONS = {"Lancaster", "Depew", "Cheektowaga"}

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "leads-gmaps.json")
EXISTING_FILE = os.path.join(DATA_DIR, "leads-auto.json")

REQUEST_DELAY = (3, 6)


# ── Browser ──────────────────────────────────────────────────────────────────

def create_driver(headless: bool = True) -> webdriver.Chrome:
    """Create a Chrome WebDriver instance."""
    opts = Options()
    if headless:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--window-size=1920,1080")
    opts.add_argument("--lang=en-US")
    opts.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
    driver = webdriver.Chrome(options=opts)
    return driver


# ── Scraping ─────────────────────────────────────────────────────────────────

def scrape_listings(driver: webdriver.Chrome, trade: str, location: str) -> list[dict]:
    """Navigate to Google Maps, scroll results, extract business data."""
    query = f"{trade} {location}"
    url = f"https://www.google.com/maps/search/{urllib.parse.quote_plus(query)}"
    driver.get(url)

    # Wait for results panel to load
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div[role="feed"], div.Nv2PK'))
        )
    except TimeoutException:
        print("  ⚠ Timeout waiting for results")
        return []

    time.sleep(2)  # let results fully render

    # Scroll the results panel to load more listings
    feed = None
    try:
        feed = driver.find_element(By.CSS_SELECTOR, 'div[role="feed"]')
    except NoSuchElementException:
        pass

    if feed:
        for _ in range(3):
            driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", feed)
            time.sleep(1.5)

    # Extract business cards
    listings = []
    cards = driver.find_elements(By.CSS_SELECTOR, 'div.Nv2PK')

    for card in cards:
        try:
            listing = extract_card(card, trade, location)
            if listing:
                listings.append(listing)
        except Exception:
            continue

    return listings


def extract_card(card, trade: str, location: str) -> dict | None:
    """Extract business data from a single result card element."""
    # Business name: the main link with aria-label
    name = None
    try:
        link_el = card.find_element(By.CSS_SELECTOR, 'a.hfpxzc')
        name = link_el.get_attribute("aria-label")
        gmaps_url = link_el.get_attribute("href")
    except NoSuchElementException:
        return None

    if not name:
        return None

    # Rating and review count
    rating = None
    review_count = None
    try:
        rating_el = card.find_element(By.CSS_SELECTOR, 'span.MW4etd')
        rating = float(rating_el.text)
    except (NoSuchElementException, ValueError):
        pass
    try:
        review_el = card.find_element(By.CSS_SELECTOR, 'span.UY7F9')
        review_text = review_el.text.strip("()")
        review_count = int(re.sub(r'[^\d]', '', review_text))
    except (NoSuchElementException, ValueError):
        pass

    # Address and other info from the detail lines
    address = None
    phone = None
    website = None
    try:
        # Info lines are in various spans/divs below the name
        info_texts = [el.text for el in card.find_elements(By.CSS_SELECTOR, '.W4Efsd span, .W4Efsd')]
        full_info = " | ".join(info_texts)

        # Phone: 716 area code
        phone_match = re.search(r'\(716\)\s*\d{3}[-.]?\d{4}|716[-.]?\d{3}[-.]?\d{4}', full_info)
        if phone_match:
            phone = phone_match.group()

        # Address: look for street number pattern
        addr_match = re.search(r'(\d+\s+[A-Z][^\|·]{5,50}(?:NY|New York)\s*\d{5})', full_info)
        if not addr_match:
            # Simpler: just a street address line
            addr_match = re.search(r'(\d+\s+\w[\w\s]{3,30}(?:St|Ave|Rd|Dr|Blvd|Ln|Way|Ct|Pkwy|Pl)\.?[^|·]*)', full_info)
        if addr_match:
            address = addr_match.group().strip(" ·|")
            # Clean trailing noise (hours, status)
            address = re.split(r'\n|Open |Closed|Hours', address)[0].strip()
    except Exception:
        pass

    # Check for website link
    has_website = False
    try:
        site_el = card.find_element(By.CSS_SELECTOR, 'a.lcr4fd[data-value="Website"]')
        website = site_el.get_attribute("href")
        has_website = True
    except NoSuchElementException:
        # Also check for any website indicators in text
        try:
            all_text = card.text.lower()
            if "website" in all_text:
                has_website = True
        except Exception:
            pass

    lead = {
        "title": name,
        "source": "google_maps",
        "market": "buffalo",
        "location": location,
        "phone": phone,
        "website": website,
        "has_website": has_website,
        "address": address,
        "rating": rating,
        "review_count": review_count,
        "google_maps_url": gmaps_url or f"https://www.google.com/maps/search/{urllib.parse.quote_plus(name + ' ' + location)}",
        "trade": trade,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "score": 0,
    }
    lead["score"] = score_lead(lead)
    return lead


# ── Scoring ──────────────────────────────────────────────────────────────────

def score_lead(lead: dict) -> float:
    score = 0
    if not lead.get("has_website"):
        score += 3
    if lead.get("phone"):
        score += 2
    if lead.get("rating") and lead["rating"] >= 4.0:
        score += 1
    if lead.get("review_count") and lead["review_count"] >= 10:
        score += 1
    loc = lead.get("location", "")
    if any(n in loc for n in NEARBY_LOCATIONS):
        score += 1
    desc = (lead.get("title", "") + " " + (lead.get("address") or "")).lower()
    if any(w in desc for w in ["licensed", "insured", "bonded"]):
        score += 1
    return score


# ── Dedup ────────────────────────────────────────────────────────────────────

def load_existing_phones() -> set:
    phones = set()
    if os.path.exists(EXISTING_FILE):
        try:
            with open(EXISTING_FILE, encoding="utf-8") as f:
                for lead in json.load(f):
                    p = lead.get("phone")
                    if p:
                        phones.add(re.sub(r'\D', '', p))
        except Exception:
            pass
    return phones


def dedup_leads(leads: list[dict], existing_phones: set) -> list[dict]:
    seen_phones = set(existing_phones)
    seen_names = set()
    unique = []
    for lead in leads:
        phone_digits = re.sub(r'\D', '', lead.get("phone") or "")
        name_key = lead["title"].lower().strip()
        if phone_digits and phone_digits in seen_phones:
            continue
        if name_key in seen_names:
            continue
        if phone_digits:
            seen_phones.add(phone_digits)
        seen_names.add(name_key)
        unique.append(lead)
    return unique


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Scrape Google Maps for local business leads")
    parser.add_argument("--trade", help="Single trade to search (e.g. plumber)")
    parser.add_argument("--location", help="Single location (e.g. 'Lancaster NY')")
    parser.add_argument("--no-website-only", action="store_true", help="Only output businesses without websites")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be searched")
    parser.add_argument("--visible", action="store_true", help="Run browser in visible (non-headless) mode")
    args = parser.parse_args()

    trades = [args.trade] if args.trade else TRADES
    locations = [args.location] if args.location else LOCATIONS

    if args.dry_run:
        combos = [(t, l) for t in trades for l in locations]
        print(f"Would search {len(combos)} combinations:")
        for t, l in combos:
            print(f"  {t} in {l}")
        return

    os.makedirs(DATA_DIR, exist_ok=True)

    existing_phones = load_existing_phones()
    print(f"Loaded {len(existing_phones)} existing phone numbers for dedup")

    all_leads = []
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, encoding="utf-8") as f:
                all_leads = json.load(f)
            print(f"Loaded {len(all_leads)} existing gmaps leads")
        except Exception:
            pass

    combos = [(t, l) for t in trades for l in locations]
    print(f"\nSearching {len(combos)} trade/location combos...\n")

    driver = create_driver(headless=not args.visible)
    new_count = 0

    try:
        for i, (trade, location) in enumerate(combos):
            print(f"[{i+1}/{len(combos)}] {trade} in {location}...")

            listings = scrape_listings(driver, trade, location)
            print(f"  Found {len(listings)} raw listings")

            before = len(listings)
            listings = dedup_leads(listings, existing_phones)
            if before > len(listings):
                print(f"  Removed {before - len(listings)} duplicates")

            all_leads.extend(listings)
            new_count += len(listings)

            for lead in listings:
                p = re.sub(r'\D', '', lead.get("phone") or "")
                if p:
                    existing_phones.add(p)

            if i < len(combos) - 1:
                delay = random.uniform(*REQUEST_DELAY)
                print(f"  Waiting {delay:.1f}s...")
                time.sleep(delay)

    finally:
        driver.quit()

    # Final dedup
    all_leads = dedup_leads(all_leads, set())

    if args.no_website_only:
        all_leads = [l for l in all_leads if not l.get("has_website")]

    all_leads.sort(key=lambda x: x.get("score", 0), reverse=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_leads, f, indent=2, ensure_ascii=False)

    no_site = sum(1 for l in all_leads if not l.get("has_website"))
    print(f"\n{'='*50}")
    print(f"Total leads: {len(all_leads)}")
    print(f"New this run: {new_count}")
    print(f"Without website (hot leads): {no_site}")
    print(f"Saved to: {OUTPUT_FILE}")

    if all_leads:
        print(f"\nTop 10 leads:")
        for lead in all_leads[:10]:
            site = "NO SITE *" if not lead.get("has_website") else (lead.get("website") or "has site")[:30]
            print(f"  [{lead['score']}] {lead['title'][:40]} | {lead.get('phone','?')} | {site}")


if __name__ == "__main__":
    main()
