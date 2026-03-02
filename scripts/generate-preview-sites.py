#!/usr/bin/env python3
"""
Preview Site Generator
Pulls enriched leads from Supabase and generates static HTML preview sites.

Usage:
    python generate-preview-sites.py
"""

import os
import json
import re
from html import escape as html_escape
from pathlib import Path
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from common locations (repo + website)
repo_root = Path(__file__).resolve().parents[1]
load_dotenv(repo_root / ".env.local")
load_dotenv(repo_root / ".env")
load_dotenv(repo_root / "website" / ".env.local")
load_dotenv(repo_root / "website" / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("SUPABASE_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)

# Base origin for preview links (e.g., http://localhost:3000 or https://clockoutnow.com)
BASE_URL = (os.getenv("NEXT_PUBLIC_BASE_URL") or os.getenv("BASE_URL") or "http://localhost:3000").rstrip("/")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Missing SUPABASE_URL or SUPABASE_KEY in .env file")
    print("Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Output directory
# Served by Next.js via /preview/[slug]
PREVIEW_DIR = repo_root / "public" / "preview-pages"
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)


def slugify(text):
    """Convert text to URL-friendly slug"""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text


def get_ready_leads():
    """Get leads that are enriched and ready for site generation"""
    response = supabase.table("leads").select("*").eq("status", "READY").execute()
    return response.data


def parse_services(services_text):
    """Parse services_offered text into array"""
    if not services_text:
        return []

    # Split by comma or semicolon
    services = re.split(r'[,;]', services_text)
    services = [s.strip() for s in services if s.strip()]
    return services[:6]  # Max 6 services for clean grid


def generate_html(lead):
    """Generate HTML preview site from lead data"""

    # Extract data (HTML-escaped to prevent XSS in generated pages)
    company = html_escape(lead.get('company_name', 'Your Business'))
    tagline = html_escape(lead.get('tagline', f"Professional {lead.get('industry', 'Services')} in {lead.get('city_region', 'Buffalo')}"))
    description = html_escape(lead.get('business_description', ''))
    owner_name = html_escape(lead.get('owner_name', ''))
    phone = html_escape(lead.get('phone', ''))
    email = html_escape(lead.get('email', ''))
    service_area = html_escape(lead.get('service_area', lead.get('city_region', '')))
    services = [html_escape(s) for s in parse_services(lead.get('services_offered', ''))]
    photos_raw = lead.get('photos_json', [])
    if isinstance(photos_raw, str):
        try:
            photos = json.loads(photos_raw)
        except (json.JSONDecodeError, TypeError):
            photos = []
    else:
        photos = photos_raw or []
    hero_image = lead.get('hero_image_url', '')

    # Build services HTML
    services_html = ""
    if services:
        service_cards = ""
        for service in services:
            service_cards += f"""
            <div class="service-card">
                <div class="service-icon">✓</div>
                <h3>{service}</h3>
            </div>
            """
        services_html = f"""
        <section id="services" class="services-section">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    {service_cards}
                </div>
            </div>
        </section>
        """

    # Build about section
    about_html = ""
    if description:
        about_html = f"""
        <section id="about" class="about-section">
            <div class="container">
                <h2>About {company}</h2>
                <p class="about-text">{description}</p>
                {f'<p class="owner-intro"><strong>- {owner_name}</strong></p>' if owner_name else ''}
            </div>
        </section>
        """

    # Build photo gallery
    gallery_html = ""
    if photos and len(photos) > 0:
        photo_items = ""
        for photo in photos[:6]:  # Max 6 photos
            url = html_escape(photo.get('url', ''))
            desc = html_escape(photo.get('description', ''))
            if url:
                photo_items += f"""
                <div class="gallery-item">
                    <img src="{url}" alt="{desc}" loading="lazy">
                    {f'<p class="photo-caption">{desc}</p>' if desc else ''}
                </div>
                """

        if photo_items:
            gallery_html = f"""
            <section class="gallery-section">
                <div class="container">
                    <h2>Our Work</h2>
                    <div class="gallery-grid">
                        {photo_items}
                    </div>
                </div>
            </section>
            """

    # Hero background style
    hero_style = ""
    if hero_image:
        safe_hero = html_escape(hero_image)
        hero_style = f"background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('{safe_hero}');"
    else:
        hero_style = "background: linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #111827 100%);"

    # Build contact section
    contact_html = f"""
    <section id="contact" class="contact-section">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-info">
                {f'<a href="tel:{phone}" class="contact-item phone"><span class="icon">📞</span> {phone}</a>' if phone else ''}
                {f'<a href="mailto:{email}" class="contact-item email"><span class="icon">✉️</span> {email}</a>' if email else ''}
                {f'<p class="contact-item location"><span class="icon">📍</span> Serving {service_area}</p>' if service_area else ''}
            </div>
            <a href="tel:{phone}" class="cta-button">Call Now</a>
        </div>
    </section>
    """

    # Full HTML template
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{company} - {tagline}</title>
    <meta name="description" content="{description[:160]}">
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }}

        /* Hero Section */
        .hero {{
            {hero_style}
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 120px 20px;
            position: relative;
        }}

        .hero h1 {{
            font-size: 3rem;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }}

        .hero p {{
            font-size: 1.3rem;
            margin-bottom: 30px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }}

        .cta-button {{
            display: inline-block;
            background: #ff6b6b;
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }}

        .cta-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }}

        /* Services Section */
        .services-section {{
            padding: 80px 20px;
            background: #f8f9fa;
        }}

        .services-section h2 {{
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: #2c3e50;
        }}

        .services-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }}

        .service-card {{
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.2s;
        }}

        .service-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }}

        .service-icon {{
            font-size: 2.5rem;
            color: #667eea;
            margin-bottom: 15px;
        }}

        .service-card h3 {{
            font-size: 1.2rem;
            color: #2c3e50;
        }}

        /* About Section */
        .about-section {{
            padding: 80px 20px;
            background: white;
        }}

        .about-section h2 {{
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 30px;
            color: #2c3e50;
        }}

        .about-text {{
            font-size: 1.2rem;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto 20px;
            color: #555;
        }}

        .owner-intro {{
            text-align: right;
            font-size: 1.1rem;
            max-width: 800px;
            margin: 20px auto 0;
            color: #667eea;
        }}

        /* Gallery Section */
        .gallery-section {{
            padding: 80px 20px;
            background: #f8f9fa;
        }}

        .gallery-section h2 {{
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: #2c3e50;
        }}

        .gallery-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }}

        .gallery-item {{
            position: relative;
            overflow: hidden;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}

        .gallery-item img {{
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s;
        }}

        .gallery-item:hover img {{
            transform: scale(1.05);
        }}

        .photo-caption {{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            font-size: 0.9rem;
        }}

        /* Contact Section */
        .contact-section {{
            padding: 80px 20px;
            background: white;
            text-align: center;
        }}

        .contact-section h2 {{
            font-size: 2.5rem;
            margin-bottom: 40px;
            color: #2c3e50;
        }}

        .contact-info {{
            max-width: 600px;
            margin: 0 auto 40px;
        }}

        .contact-item {{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            margin: 15px 0;
            color: #555;
            text-decoration: none;
            transition: color 0.2s;
        }}

        .contact-item:hover {{
            color: #667eea;
        }}

        .contact-item .icon {{
            margin-right: 10px;
            font-size: 1.5rem;
        }}

        /* Footer */
        footer {{
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 30px 20px;
        }}

        footer p {{
            margin: 5px 0;
            opacity: 0.8;
        }}

        /* Responsive */
        @media (max-width: 768px) {{
            .hero h1 {{
                font-size: 2rem;
            }}

            .hero p {{
                font-size: 1.1rem;
            }}

            .services-section h2,
            .about-section h2,
            .gallery-section h2,
            .contact-section h2 {{
                font-size: 2rem;
            }}
        }}
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>{company}</h1>
            <p>{tagline}</p>
            <a href="#contact" class="cta-button">Get A Free Quote</a>
        </div>
    </section>

    <!-- Services Section -->
    {services_html}

    <!-- About Section -->
    {about_html}

    <!-- Gallery Section -->
    {gallery_html}

    <!-- Contact Section -->
    {contact_html}

    <!-- Footer -->
    <footer>
        <p>&copy; {datetime.now().year} {company}. All rights reserved.</p>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.6;">
            This preview site was generated with AI to show {company} what their online presence could look like.
        </p>
    </footer>

    <!-- Analytics Tracking -->
    <script>
        (function() {{
            const params = new URLSearchParams(window.location.search);
            fetch('/api/track-view', {{
                method: 'POST',
                headers: {{ 'Content-Type': 'application/json' }},
                body: JSON.stringify({{
                    page: window.location.pathname.split('/').pop(),
                    utm_source: params.get('utm_source'),
                    utm_campaign: params.get('utm_campaign'),
                    referrer: document.referrer,
                    timestamp: new Date().toISOString()
                }})
            }}).catch(() => {{}});
        }})();
    </script>
</body>
</html>"""

    return html


def save_preview_site(lead, html):
    """Save HTML to preview directory and update database"""

    # Create slug if it doesn't exist
    slug = lead.get('preview_page_slug')
    if not slug:
        slug = slugify(lead['company_name'])

    # Save HTML
    html_file = PREVIEW_DIR / f"{slug}.html"
    html_file.write_text(html, encoding='utf-8')

    # Generate preview URL
    preview_url = f"{BASE_URL}/preview/{slug}"

    # Update database
    updates = {
        'preview_page_slug': slug,
        'preview_site_url': preview_url,
        'status': 'SITE_GENERATED',
        'updated_at': datetime.utcnow().isoformat()
    }

    supabase.table("leads").update(updates).eq("id", lead['id']).execute()

    return preview_url, html_file


def main():
    """Generate preview sites for all READY leads"""

    print("\n" + "="*70)
    print("🎨 PREVIEW SITE GENERATOR")
    print("="*70)

    leads = get_ready_leads()

    if not leads:
        print("\n✨ No leads ready for site generation")
        print("Run enrich-leads.py to mark leads as READY")
        return

    print(f"\n📊 Found {len(leads)} leads ready for site generation\n")

    generated = []

    for i, lead in enumerate(leads, 1):
        company = lead.get('company_name', 'Unknown')
        print(f"[{i}/{len(leads)}] Generating site for {company}...")

        try:
            # Generate HTML
            html = generate_html(lead)

            # Save and update database
            preview_url, file_path = save_preview_site(lead, html)

            generated.append({
                'company': company,
                'url': preview_url,
                'file': str(file_path)
            })

            print(f"  ✅ {preview_url}")
            print(f"     Saved to: {file_path}")

        except Exception as e:
            print(f"  ❌ Error: {e}")

    # Summary
    print("\n" + "="*70)
    print(f"✅ GENERATED {len(generated)} PREVIEW SITES")
    print("="*70)

    for site in generated:
        print(f"\n🏢 {site['company']}")
        print(f"   URL:  {site['url']}")
        print(f"   File: {site['file']}")

    print("\n" + "="*70)
    print("Next steps:")
    print("  1. Test preview sites locally")
    print("  2. Run Gemini image generation for hero images")
    print("  3. Deploy preview sites to production")
    print("  4. Send preview emails to leads")
    print("="*70)


if __name__ == "__main__":
    main()
