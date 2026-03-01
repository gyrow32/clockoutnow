"""
ClockOutNow Lead Finder
Scrapes Craigslist service ads across multiple markets,
researches each business, and outputs a structured lead list.

Usage: python lead_finder.py [--market buffalo|rochester|syracuse|erie|pittsburgh|cleveland|all]
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
import requests
from bs4 import BeautifulSoup
import json
import time
import re
from datetime import datetime
from pathlib import Path

MARKETS = {
    "buffalo": "https://buffalo.craigslist.org",
    "rochester": "https://rochester.craigslist.org",
    "syracuse": "https://syracuse.craigslist.org",
    "erie": "https://erie.craigslist.org",
    "pittsburgh": "https://pittsburgh.craigslist.org",
    "cleveland": "https://cleveland.craigslist.org",
    "binghamton": "https://binghamton.craigslist.org",
    "ithaca": "https://ithaca.craigslist.org",
    "elmira": "https://elmira.craigslist.org",
    "jamestown": "https://jamestown.craigslist.org",
}

# CL categories with service businesses
CATEGORIES = [
    "/search/sks",   # skilled trade services
    "/search/hss",   # household services  
    "/search/bbb",   # services (general)
]

# Keywords that indicate good targets
TARGET_KEYWORDS = [
    "plumbing", "plumber", "hvac", "heating", "cooling", "furnace", "boiler",
    "roofing", "roofer", "electrical", "electrician", "contractor",
    "handyman", "remodel", "renovation", "painting", "painter",
    "landscaping", "lawn", "tree service", "fencing", "fence",
    "concrete", "masonry", "drywall", "flooring", "carpet",
    "cleaning", "maid", "janitorial", "pressure wash",
    "moving", "mover", "hauling", "junk removal", "demolition",
    "pest control", "exterminator", "towing", "auto repair",
    "garage door", "window", "siding", "gutter",
    "snow removal", "plow", "excavat",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}


def scrape_market(market_name, base_url, max_per_category=50):
    """Scrape one CL market for service business ads."""
    leads = []
    seen_titles = set()
    
    for cat in CATEGORIES:
        url = f"{base_url}{cat}"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code != 200:
                print(f"  SKIP {cat} - status {resp.status_code}")
                continue
                
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Find listing items
            listings = soup.select("li.cl-static-search-result, li.cl-search-result")
            if not listings:
                # Try alternate selector
                listings = soup.select(".result-row, .cl-search-result")
            
            print(f"  {cat}: {len(listings)} listings found")
            
            for item in listings[:max_per_category]:
                try:
                    # Get title and URL
                    link = item.select_one("a")
                    if not link:
                        continue
                    title = link.get_text(strip=True)
                    href = link.get("href", "")
                    
                    if not title or title.lower() in seen_titles:
                        continue
                    
                    # Check if matches our target keywords
                    title_lower = title.lower()
                    matched_keywords = [kw for kw in TARGET_KEYWORDS if kw in title_lower]
                    
                    if not matched_keywords:
                        continue
                    
                    seen_titles.add(title_lower)
                    
                    # Build full URL
                    if href.startswith("/"):
                        href = base_url + href
                    
                    # Extract location from title if present (often in parentheses)
                    location_match = re.search(r'\(([^)]+)\)', title)
                    location = location_match.group(1) if location_match else market_name
                    
                    leads.append({
                        "title": title,
                        "url": href,
                        "market": market_name,
                        "location": location,
                        "category": cat,
                        "keywords": matched_keywords,
                        "scraped_at": datetime.now().isoformat(),
                    })
                    
                except Exception as e:
                    continue
                    
        except Exception as e:
            print(f"  ERROR {cat}: {e}")
        
        time.sleep(1)  # Be polite
    
    return leads


def research_lead(lead):
    """Try to get more details from the individual CL posting."""
    try:
        resp = requests.get(lead["url"], headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return lead
            
        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Get full description
        body = soup.select_one("#postingbody, .posting-body, section#postingbody")
        if body:
            # Remove QR code notice
            for notice in body.select(".print-information"):
                notice.decompose()
            desc = body.get_text(strip=True)
            lead["description"] = desc[:500]
            
            # Extract phone numbers
            phones = re.findall(r'[\(]?\d{3}[\)]?[-.\s]?\d{3}[-.\s]?\d{4}', desc)
            if phones:
                lead["phone"] = phones[0]
            
            # Extract emails
            emails = re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', desc)
            if emails:
                lead["email"] = emails[0]
            
            # Check for website mentions
            urls = re.findall(r'(?:www\.|https?://)\S+', desc)
            if urls:
                lead["website"] = urls[0]
            
            # Business indicators
            indicators = []
            desc_lower = desc.lower()
            if "licensed" in desc_lower: indicators.append("Licensed")
            if "insured" in desc_lower: indicators.append("Insured")
            if "bonded" in desc_lower: indicators.append("Bonded")
            if "llc" in desc_lower: indicators.append("LLC")
            if "inc" in desc_lower or "incorporated" in desc_lower: indicators.append("Inc")
            if "year" in desc_lower:
                yr_match = re.search(r'(\d+)\+?\s*year', desc_lower)
                if yr_match:
                    indicators.append(f"{yr_match.group(1)}+ years")
            if "24" in desc_lower and ("7" in desc_lower or "hour" in desc_lower):
                indicators.append("24/7")
            if "free estimate" in desc_lower or "free quote" in desc_lower:
                indicators.append("Free estimates")
            
            lead["indicators"] = indicators
            
        # Get post ID
        post_id_el = soup.select_one(".postinginfos .postinginfo")
        if post_id_el:
            pid_match = re.search(r'\d{10}', post_id_el.get_text())
            if pid_match:
                lead["post_id"] = pid_match.group()
        
        time.sleep(0.5)
        
    except Exception as e:
        lead["error"] = str(e)
    
    return lead


def score_lead(lead):
    """Score a lead 1-10 based on business quality and website status."""
    score = 5  # base
    
    indicators = lead.get("indicators", [])
    
    # No website = higher value target
    if not lead.get("website"):
        score += 2
    elif "wix" in str(lead.get("website", "")).lower() or "godaddy" in str(lead.get("website", "")).lower():
        score += 1  # Bad website = upgrade candidate
    else:
        score -= 1  # Has website already
    
    # Business legitimacy
    if "Licensed" in indicators: score += 1
    if "Insured" in indicators: score += 0.5
    if "LLC" in indicators or "Inc" in indicators: score += 1
    
    # Experience
    for ind in indicators:
        if "years" in ind:
            try:
                yrs = int(re.search(r'\d+', ind).group())
                if yrs >= 10: score += 1
                if yrs >= 20: score += 0.5
            except:
                pass
    
    # Has phone = reachable
    if lead.get("phone"): score += 0.5
    
    # Cap at 10
    lead["score"] = min(10, round(score, 1))
    return lead


def output_results(leads, format="md"):
    """Output leads as markdown or JSON."""
    if format == "json":
        print(json.dumps(leads, indent=2))
        return
    
    # Markdown table
    print(f"\n# ClockOutNow Lead Research — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"\n**Total leads found: {len(leads)}**\n")
    
    # Sort by score descending
    leads.sort(key=lambda x: x.get("score", 0), reverse=True)
    
    hot = [l for l in leads if l.get("score", 0) >= 8]
    warm = [l for l in leads if 6 <= l.get("score", 0) < 8]
    cold = [l for l in leads if l.get("score", 0) < 6]
    
    if hot:
        print(f"\n## 🔥 HOT LEADS (Score 8+) — {len(hot)} found\n")
        print("| # | Business | Market | Score | Phone | Website? | Indicators | CL URL |")
        print("|---|----------|--------|-------|-------|----------|------------|--------|")
        for i, l in enumerate(hot, 1):
            indicators = ", ".join(l.get("indicators", []))[:40]
            has_site = "YES" if l.get("website") else "NO"
            phone = l.get("phone", "—")
            print(f"| {i} | {l['title'][:40]} | {l['market']} | {l['score']} | {phone} | {has_site} | {indicators} | [link]({l['url']}) |")
    
    if warm:
        print(f"\n## 🟡 WARM LEADS (Score 6-7) — {len(warm)} found\n")
        print("| # | Business | Market | Score | Phone | Website? | CL URL |")
        print("|---|----------|--------|-------|-------|----------|--------|")
        for i, l in enumerate(warm, 1):
            has_site = "YES" if l.get("website") else "NO"
            phone = l.get("phone", "—")
            print(f"| {i} | {l['title'][:40]} | {l['market']} | {l['score']} | {phone} | {has_site} | [link]({l['url']}) |")
    
    print(f"\n## Summary")
    print(f"- Hot: {len(hot)} | Warm: {len(warm)} | Cold: {len(cold)}")
    print(f"- Markets scanned: {len(set(l['market'] for l in leads))}")
    print(f"- No website: {len([l for l in leads if not l.get('website')])}")
    print(f"- Have phone: {len([l for l in leads if l.get('phone')])}")


def main():
    market_filter = sys.argv[1].replace("--market=", "") if len(sys.argv) > 1 else "all"
    
    if market_filter == "all":
        markets = MARKETS
    elif market_filter in MARKETS:
        markets = {market_filter: MARKETS[market_filter]}
    else:
        print(f"Unknown market: {market_filter}")
        print(f"Available: {', '.join(MARKETS.keys())}, all")
        sys.exit(1)
    
    all_leads = []
    
    for name, url in markets.items():
        print(f"\nScanning {name}...", flush=True)
        leads = scrape_market(name, url)
        print(f"  Found {len(leads)} matching ads", flush=True)
        
        # Research top leads (limit to 30 per market to be fast)
        for i, lead in enumerate(leads[:30]):
            print(f"  Researching {i+1}/{min(30,len(leads))}: {lead['title'][:50]}...", flush=True)
            lead = research_lead(lead)
            lead = score_lead(lead)
        
        all_leads.extend(leads)
    
    # Output
    output_results(all_leads)
    
    # Also save JSON for programmatic use
    repo_root = Path(__file__).resolve().parents[1]
    data_dir = repo_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    outpath = data_dir / "leads-auto.json"
    with outpath.open("w", encoding="utf-8") as f:
        json.dump(all_leads, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(all_leads)} leads to {outpath}")


if __name__ == "__main__":
    main()
