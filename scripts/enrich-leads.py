#!/usr/bin/env python3
"""
Lead Enrichment Tool
Interactive script for Chrissy to enrich leads with business details
for auto-generated preview websites.

Usage:
    python enrich-leads.py
"""

import os
import json
from datetime import datetime
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from common locations (repo + website)
repo_root = Path(__file__).resolve().parents[1]
load_dotenv(repo_root / ".env.local")
load_dotenv(repo_root / ".env")
load_dotenv(repo_root / "website" / ".env.local")
load_dotenv(repo_root / "website" / ".env")

# Supabase setup
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("SUPABASE_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Missing SUPABASE_URL or SUPABASE_KEY environment variables")
    print("Set them in your .env file or export them:")
    print("  export SUPABASE_URL='https://your-project.supabase.co'")
    print("  export SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'  # preferred")
    print("  export SUPABASE_ANON_KEY='your-anon-key'")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_leads_to_enrich():
    """Get leads that need enrichment (NEW or RESEARCHING status)"""
    response = supabase.table("leads").select("*").in_(
        "status", ["NEW", "RESEARCHING"]
    ).is_("owner_name", "null").order("created_at", desc=False).execute()

    return response.data


def display_lead(lead):
    """Display current lead information"""
    print("\n" + "="*70)
    print(f"🏢 {lead['company_name']}")
    print("="*70)
    print(f"Industry:        {lead.get('industry', 'N/A')}")
    print(f"Location:        {lead.get('city_region', 'N/A')}")
    print(f"Service Area:    {lead.get('service_area', 'N/A')}")
    print(f"Services:        {lead.get('services_offered', 'N/A')}")
    print(f"Phone:           {lead.get('phone', 'N/A')}")
    print(f"Email:           {lead.get('email', 'N/A')}")
    print(f"Website:         {lead.get('website', 'N/A')}")
    print(f"Craigslist:      {lead.get('craigslist_url', 'N/A')}")
    print(f"Status:          {lead.get('status', 'N/A')}")
    print("="*70)


def prompt_with_skip(prompt_text, current_value=None):
    """Prompt for input with option to skip"""
    if current_value:
        print(f"  Current: {current_value}")
    value = input(f"{prompt_text} (or press Enter to skip): ").strip()
    return value if value else None


def prompt_multiline(prompt_text):
    """Prompt for multi-line input (like business description)"""
    print(f"{prompt_text}")
    print("  (Enter text, then press Enter twice when done)")
    lines = []
    empty_count = 0

    while True:
        line = input("  ")
        if line == "":
            empty_count += 1
            if empty_count >= 2:
                break
        else:
            empty_count = 0
            lines.append(line)

    result = " ".join(lines).strip()
    return result if result else None


def prompt_photos():
    """Prompt for photos as JSON array"""
    print("\n📸 Photos (from Facebook, Google, or CL post)")
    print("  Enter photo URLs one at a time. Press Enter with no URL when done.")

    photos = []
    while True:
        url = input(f"  Photo {len(photos) + 1} URL (or Enter to finish): ").strip()
        if not url:
            break

        description = input(f"    Description (optional): ").strip()
        photos.append({
            "url": url,
            "description": description if description else None
        })

    return photos if photos else None


def enrich_lead(lead):
    """Interactive enrichment for a single lead"""
    display_lead(lead)

    print("\n🔍 ENRICHMENT - Fill in details from Facebook, Google, CL post")

    # Owner name
    owner_name = prompt_with_skip(
        "\n👤 Owner Name (e.g., 'Mike Johnson')",
        lead.get('owner_name')
    )

    # Tagline
    tagline = prompt_with_skip(
        "\n✨ Tagline (catchy one-liner for hero section)",
        lead.get('tagline')
    )

    # Business description
    print("\n📝 Business Description (2-3 sentences for About section)")
    if lead.get('business_description'):
        print(f"  Current: {lead.get('business_description')}")
    description = prompt_multiline("  Enter description:")

    # Facebook URL
    facebook_url = prompt_with_skip(
        "\n🔗 Facebook URL",
        lead.get('facebook_url')
    )

    # Google Business URL
    google_url = prompt_with_skip(
        "\n🔗 Google Business URL",
        lead.get('google_business_url')
    )

    # Photos
    print("\n" + "-"*70)
    current_photos = lead.get('photos_json')
    if current_photos:
        print(f"  Current photos: {len(current_photos)} saved")
    add_photos = input("Add/update photos? (y/n): ").strip().lower()
    photos_json = None
    if add_photos == 'y':
        photos_json = prompt_photos()

    # Build update payload
    updates = {}
    if owner_name:
        updates['owner_name'] = owner_name
    if tagline:
        updates['tagline'] = tagline
    if description:
        updates['business_description'] = description
    if facebook_url:
        updates['facebook_url'] = facebook_url
    if google_url:
        updates['google_business_url'] = google_url
    if photos_json:
        updates['photos_json'] = photos_json

    # Update status if this is the first enrichment
    if lead.get('status') == 'NEW':
        updates['status'] = 'RESEARCHING'

    # Show summary
    print("\n" + "="*70)
    print("📋 SUMMARY OF CHANGES")
    print("="*70)
    for key, value in updates.items():
        if key == 'photos_json':
            print(f"  {key}: {len(value)} photos")
        else:
            print(f"  {key}: {value}")
    print("="*70)

    # Confirm
    confirm = input("\n💾 Save these changes? (y/n): ").strip().lower()
    if confirm == 'y':
        # Update in Supabase
        supabase.table("leads").update(updates).eq("id", lead['id']).execute()
        print("✅ Lead enriched successfully!")
        return True
    else:
        print("❌ Changes discarded")
        return False


def mark_ready_for_site_generation(lead_id):
    """Mark a lead as READY (enrichment complete, ready for site generation)"""
    confirm = input("\n🎯 Mark this lead as READY for site generation? (y/n): ").strip().lower()
    if confirm == 'y':
        supabase.table("leads").update({
            'status': 'READY',
            'updated_at': datetime.utcnow().isoformat()
        }).eq("id", lead_id).execute()
        print("✅ Lead marked as READY")


def main():
    """Main enrichment loop"""
    print("\n" + "="*70)
    print("🎯 LEAD ENRICHMENT TOOL")
    print("="*70)
    print("This tool helps you enrich leads with business details")
    print("for auto-generated preview websites.")
    print("="*70)

    leads = get_leads_to_enrich()

    if not leads:
        print("\n✨ No leads need enrichment! All caught up.")
        return

    print(f"\n📊 Found {len(leads)} leads to enrich")

    for i, lead in enumerate(leads, 1):
        print(f"\n\n🔄 Lead {i} of {len(leads)}")

        enriched = enrich_lead(lead)

        if enriched:
            mark_ready_for_site_generation(lead['id'])

        # Ask to continue
        if i < len(leads):
            continue_prompt = input("\n▶️  Continue to next lead? (y/n): ").strip().lower()
            if continue_prompt != 'y':
                print("\n👋 Enrichment session ended. Run again to continue.")
                break

    print("\n" + "="*70)
    print("✅ ENRICHMENT SESSION COMPLETE")
    print("="*70)
    print("Next steps:")
    print("  1. Run Claude Code to generate preview sites for READY leads")
    print("  2. Run Gemini image generation for hero images")
    print("  3. Send preview emails")
    print("="*70)


if __name__ == "__main__":
    main()
