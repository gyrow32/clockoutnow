#!/usr/bin/env python3
"""
rescrape-emails.py — Re-scrape Craigslist post URLs to extract emails
from full descriptions (original scraper truncated at 500 chars).

Usage:
    python rescrape-emails.py                  # all leads
    python rescrape-emails.py --market buffalo # buffalo only
    python rescrape-emails.py --top 50         # top 50 by score
"""

import argparse
import io
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
LEADS_FILE = ROOT_DIR / "data" / "leads-auto.json"
OUTPUT_FILE = ROOT_DIR / "data" / "leads-with-emails.json"

EMAIL_RE = re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}')


def fetch_page(url: str) -> str:
    """Fetch a CL page and return the HTML."""
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    })
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_body_text(html: str) -> str:
    """Pull the posting body text from CL HTML."""
    # CL puts the post body in <section id="postingbody">
    match = re.search(r'<section id="postingbody">(.*?)</section>', html, re.DOTALL)
    if match:
        text = match.group(1)
        # strip HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        # collapse whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    return ""


def extract_emails(text: str) -> list[str]:
    """Find real emails (not craigslist relay) in text."""
    emails = EMAIL_RE.findall(text)
    return [e for e in emails if 'craigslist' not in e.lower()]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--market", help="Filter by market (e.g. buffalo)")
    parser.add_argument("--top", type=int, help="Only scrape top N leads by score")
    parser.add_argument("--delay", type=float, default=2.0, help="Seconds between requests (default 2)")
    args = parser.parse_args()

    data = json.loads(LEADS_FILE.read_text(encoding="utf-8"))
    print(f"Loaded {len(data)} leads")

    # filter
    if args.market:
        data = [l for l in data if l.get("market", "") == args.market]
        print(f"Filtered to {len(data)} leads in {args.market}")

    # sort by score descending
    data.sort(key=lambda l: l.get("score", 0), reverse=True)

    if args.top:
        data = data[:args.top]
        print(f"Taking top {len(data)} by score")

    found = []
    errors = 0

    for i, lead in enumerate(data):
        url = lead.get("url", "")
        if not url:
            continue

        title = lead.get("title", "")[:50]
        sys.stdout.write(f"\r  [{i+1}/{len(data)}] Scraping... {title[:40]:<40}")
        sys.stdout.flush()

        try:
            html = fetch_page(url)
            body = extract_body_text(html)
            emails = extract_emails(body)

            # also check the full HTML for emails (some are in mailto: links)
            html_emails = extract_emails(html)
            all_emails = list(set(emails + html_emails))

            if all_emails:
                lead["extracted_emails"] = all_emails
                lead["full_description"] = body[:2000]
                found.append(lead)
                print(f"\n    FOUND: {all_emails} — {title}")

        except Exception as e:
            errors += 1
            # CL post may be expired/deleted
            if "404" in str(e) or "410" in str(e):
                pass  # expired post, skip silently
            else:
                print(f"\n    ERROR: {e}")

        time.sleep(args.delay)

    print(f"\n\nDone! Scraped {len(data)} posts.")
    print(f"  Found emails: {len(found)}")
    print(f"  Errors: {errors}")

    if found:
        OUTPUT_FILE.write_text(json.dumps(found, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  Saved to: {OUTPUT_FILE}")
        print("\n--- Results ---")
        for f in found:
            market = f.get("market", "")
            title = f.get("title", "")[:50]
            emails = f.get("extracted_emails", [])
            phone = f.get("phone", "")
            score = f.get("score", "")
            print(f"  {score:>5} | {market:<10} | {title:<50} | {', '.join(emails):<35} | {phone}")


if __name__ == "__main__":
    main()
