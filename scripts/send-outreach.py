#!/usr/bin/env python3
"""
send-outreach.py — Send personalized outreach emails from personal Gmail.

Logs to Supabase dashboard FIRST to get a tracked URL, then sends the email
with that URL so click-throughs show up in analytics.

Usage:
    python send-outreach.py <slug> --email <recipient> [--dry-run] [--name NAME] [--business BUSINESS]

Examples:
    python send-outreach.py buffalo-bath-and-tile --email Tileguy70@yahoo.com --dry-run
    python send-outreach.py buffalo-bath-and-tile --email Tileguy70@yahoo.com
"""

import argparse
import json
import os
import smtplib
import ssl
import sys
import urllib.request
from email.mime.text import MIMEText
from pathlib import Path

# ---------- paths ----------
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT_DIR = SCRIPT_DIR.parent
ENV_FILE = ROOT_DIR / ".env.local"
WEBSITE_ENV_FILE = ROOT_DIR / ".env.local"  # website files are at repo root
LEADS_FILE = ROOT_DIR / "data" / "leads-auto.json"
PREVIEW_DIR = ROOT_DIR / "public" / "preview-pages"


def load_env(path: Path) -> dict:
    """Parse a .env.local file into a dict."""
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


def find_lead(slug: str, leads: list) -> dict | None:
    """Try to match a lead by slug-ifying the title or post_id."""
    import re
    def slugify(text: str) -> str:
        text = text.lower()
        text = re.sub(r"[^a-z0-9]+", "-", text)
        return text.strip("-")

    for lead in leads:
        title_slug = slugify(lead.get("title", ""))
        if slug in title_slug or title_slug in slug:
            return lead
    return None


def log_campaign(
    api_base_url: str,
    admin_key: str,
    business_name: str,
    contact: str,
    slug: str,
    subject: str,
) -> str | None:
    """Log campaign to dashboard and return the tracking URL."""
    payload = json.dumps({
        "business_name": business_name,
        "contact": contact,
        "preview_page_slug": slug,
        "subject_line": subject,
    }).encode("utf-8")

    req = urllib.request.Request(
        api_base_url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {admin_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            campaign_id = data.get("campaign", {}).get("id", "?")
            tracking_url = data.get("tracking_url", "")
            print(f"  Logged to dashboard (campaign #{campaign_id[:8]}...)")
            if tracking_url:
                print(f"  Tracking URL: {tracking_url}")
            return tracking_url
    except Exception as e:
        print(f"  WARNING: Dashboard log failed: {e}")
        return None


def build_email_body(name: str, business: str, preview_url: str) -> str:
    """Plain text only. Reads like a real person typing in Gmail.

    Rules (from session skill):
    - Always introduce Mike first — who we are, Lancaster
    - Never mention how we found them (no "saw your ad", no "Craigslist")
    - No pricing in early outreach — first users are free for social proof
    - Include: preview link, clockoutnow.com link, voice agent CTA
    - Sign as just "Mike"
    """
    greeting = f"Hey {name}," if name != "there" else "Hey there,"

    return f"""\
{greeting}

My name's Mike, I run a small web and AI shop called ClockOutNow out of Lancaster. We build websites and AI tools for local service businesses in the Buffalo area.

I put together a quick preview of what a professional site could look like for {business}:

{preview_url}

Take a look — it's yours to keep either way. If you want to see what our AI can do, give us a ring at (607) 225-3400 — that's our AI assistant and it picks up 24/7.

You can check out more of our work at https://clockoutnow.com

Happy to jump on a quick call if you're interested.

Mike
ClockOutNow | Lancaster, NY
(607) 225-3400

---
To stop receiving these emails, reply "unsubscribe" and we'll remove you immediately."""


def send_email(
    gmail_user: str,
    gmail_password: str,
    from_email: str,
    to_email: str,
    subject: str,
    body: str,
    dry_run: bool = False,
):
    """Send plain text email via Gmail SMTP with Send As address."""

    msg = MIMEText(body, "plain")
    msg["From"] = f"Mike <{from_email}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    if dry_run:
        print("\n" + "=" * 60)
        print("DRY RUN — Email would be sent as follows:")
        print("=" * 60)
        print(f"  From:    {msg['From']}")
        print(f"  To:      {msg['To']}")
        print(f"  Subject: {msg['Subject']}")
        print("-" * 60)
        print(body)
        print("=" * 60)
        return

    # Actually send
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, to_email, msg.as_string())

    print(f"\n  Email SENT to {to_email}")


def main():
    parser = argparse.ArgumentParser(description="Send outreach email with preview site link")
    parser.add_argument("slug", help="Lead slug (matches preview page filename, e.g. buffalo-bath-and-tile)")
    parser.add_argument("--email", required=True, help="Recipient email address")
    parser.add_argument("--name", help="Contact first name (auto-detected from leads if omitted)")
    parser.add_argument("--business", help="Business name (auto-detected from leads if omitted)")
    parser.add_argument("--dry-run", action="store_true", help="Preview email without sending")
    args = parser.parse_args()

    # --- load env ---
    env = load_env(ENV_FILE)
    gmail_user = env.get("GMAIL_USER")
    gmail_password = env.get("GMAIL_APP_PASSWORD")
    from_email = gmail_user  # Personal Gmail for deliverability

    if not gmail_user or not gmail_password:
        print("ERROR: GMAIL_USER / GMAIL_APP_PASSWORD not found in .env.local")
        sys.exit(1)

    # --- resolve lead info ---
    contact_name = args.name
    business_name = args.business

    if not contact_name or not business_name:
        if LEADS_FILE.exists():
            leads = json.loads(LEADS_FILE.read_text(encoding="utf-8"))
            lead = find_lead(args.slug, leads)
            if lead:
                print(f"  Matched lead: {lead.get('title', '?')}")
                if not contact_name:
                    contact_name = "there"  # safe fallback
                if not business_name:
                    business_name = lead.get("title", "").split("$")[0].strip()

    contact_name = contact_name or "there"
    business_name = business_name or args.slug.replace("-", " ").title()
    print(f"  Lead: {business_name} / {contact_name}")

    # --- verify preview page exists ---
    preview_html = PREVIEW_DIR / f"{args.slug}.html"
    if not preview_html.exists():
        print(f"WARNING: Preview page not found: {preview_html}")
        print("  The email will still link to it — make sure it's deployed.")

    subject = f"Built something for {business_name}"

    # --- log campaign FIRST to get tracking URL ---
    website_env = load_env(WEBSITE_ENV_FILE)
    base_url = (website_env.get("NEXT_PUBLIC_BASE_URL") or env.get("BASE_URL") or "https://clockoutnow.com").rstrip("/")
    api_base_url = f"{base_url}/api/admin/campaigns"

    preview_url = f"{base_url}/preview/{args.slug}"
    admin_key = website_env.get("ADMIN_ACCESS_KEY")

    if admin_key and not args.dry_run:
        tracking_url = log_campaign(
            api_base_url=api_base_url,
            admin_key=admin_key,
            business_name=business_name,
            contact=args.email,
            slug=args.slug,
            subject=subject,
        )
        if tracking_url:
            preview_url = tracking_url

    # --- build & send ---
    body = build_email_body(contact_name, business_name, preview_url)

    send_email(
        gmail_user=gmail_user,
        gmail_password=gmail_password,
        from_email=from_email,
        to_email=args.email,
        subject=subject,
        body=body,
        dry_run=args.dry_run,
    )

    if not args.dry_run:
        print(f"  Status: CONTACTED")


if __name__ == "__main__":
    main()
