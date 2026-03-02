#!/usr/bin/env python3
"""
Generate preview pages for the 12 tracker entries that don't have HTML files.
Uses tracker data from cl-outreach-tracker.md and the same HTML template as
generate-preview-sites.py.
"""

import re
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent
PREVIEW_DIR = ROOT_DIR / "public" / "preview-pages"

# Tracker entries that need pages (extracted from cl-outreach-tracker.md)
LEADS = [
    {
        "slug": "gagan-plumbing",
        "company": "Gagan's Plumbing & Remodel",
        "contact": "Gagan",
        "trade": "Plumbing & Bathroom Remodeling",
        "location": "Grand Island, NY",
        "services": ["Plumbing Repairs", "Bathroom Remodeling", "Kitchen Plumbing", "Drain Cleaning", "Water Heater Service", "Fixture Installation"],
        "tagline": "Professional Plumbing & Remodeling in Grand Island",
        "phone": "",
    },
    {
        "slug": "matts-cleanouts",
        "company": "Matt's Cleanouts & Handyman",
        "contact": "Matt",
        "trade": "Handyman & Cleanout Services",
        "location": "Lockport, NY",
        "services": ["Property Cleanouts", "Junk Removal", "Handyman Repairs", "Light Demolition", "Garage Cleaning", "Estate Cleanouts"],
        "tagline": "Reliable Cleanouts & Handyman Services in Lockport",
        "phone": "",
    },
    {
        "slug": "cleaning-by-nat",
        "company": "Cleaning by Nat",
        "contact": "Natalie",
        "trade": "Professional Cleaning",
        "location": "Lockport, NY",
        "services": ["Residential Cleaning", "Deep Cleaning", "Move-In/Out Cleaning", "Recurring Service", "Office Cleaning", "Seasonal Cleaning"],
        "tagline": "Trusted Cleaning Services — 6+ Years Experience",
        "phone": "",
    },
    {
        "slug": "daytons-roofing",
        "company": "Dayton's Roofing and Remodeling",
        "contact": "Jacob Dayton",
        "trade": "Roofing & Remodeling",
        "location": "Clarence, NY",
        "services": ["Roof Replacement", "Roof Repair", "Storm Damage", "Kitchen Remodeling", "Bathroom Remodeling", "Siding Installation"],
        "tagline": "Licensed & Insured Roofing and Remodeling in Clarence",
        "phone": "",
    },
    {
        "slug": "zachs-garage",
        "company": "Zach's Garage Door Service",
        "contact": "Zach Bohlman",
        "trade": "Garage Door Service",
        "location": "Lockport, NY",
        "services": ["Garage Door Repair", "Garage Door Installation", "Spring Replacement", "Opener Installation", "Emergency Service", "Maintenance"],
        "tagline": "25 Years of Garage Door Expertise in WNY",
        "phone": "(716) 438-6805",
    },
    {
        "slug": "reliable-cleaning",
        "company": "Reliable Home & Airbnb Cleaning",
        "contact": "Aquan Payne",
        "trade": "Cleaning Services",
        "location": "Buffalo, NY",
        "services": ["Home Cleaning", "Airbnb Turnover", "Apartment Cleaning", "Deep Cleaning", "Move-In/Out Cleaning", "Recurring Service"],
        "tagline": "Reliable Cleaning for Homes & Airbnb Properties",
        "phone": "(716) 578-1596",
    },
    {
        "slug": "eden-hvac",
        "company": "Heating & Cooling Services",
        "contact": "Mike",
        "trade": "HVAC",
        "location": "Eden, NY",
        "services": ["Furnace Repair", "AC Installation", "Heat Pump Service", "Duct Cleaning", "Emergency HVAC", "System Maintenance"],
        "tagline": "EPA Licensed HVAC — Serving Eden & All of WNY",
        "phone": "(716) 466-1000",
    },
    {
        "slug": "mch-flooring",
        "company": "MCH Flooring",
        "contact": "",
        "trade": "Flooring",
        "location": "Lockport & Buffalo, NY",
        "services": ["Hardwood Flooring", "Laminate Installation", "Vinyl Plank", "Tile Work", "Carpet Installation", "Floor Refinishing"],
        "tagline": "35 Years of Flooring Excellence in WNY",
        "phone": "(716) 946-5529",
    },
    {
        "slug": "marshalls-carpet",
        "company": "Marshall's Carpet & Flooring",
        "contact": "Marshall",
        "trade": "Flooring & Carpet",
        "location": "WNY Buffalo, NY",
        "services": ["Carpet Installation", "Vinyl Plank", "Laminate Flooring", "Hardwood Floors", "Pergo Flooring", "Sheet Vinyl"],
        "tagline": "17+ Years — Licensed & Insured Flooring in Buffalo",
        "phone": "(716) 462-2746",
    },
    {
        "slug": "landlord-turnovers",
        "company": "Landlord Turnover Specialists",
        "contact": "",
        "trade": "Painting & Drywall",
        "location": "Buffalo, NY",
        "services": ["Rental Turnover Painting", "Drywall Repair", "Apartment Prep", "Property Maintenance", "Touch-Up Painting", "Wall Repair"],
        "tagline": "Fast Rental Turnovers — Painting & Drywall in Buffalo",
        "phone": "(716) 808-2801",
    },
    {
        "slug": "the-roofing-guy",
        "company": "The Roofing Guy",
        "contact": "",
        "trade": "Roofing",
        "location": "Buffalo & Chaffee, NY",
        "services": ["Metal Roofing", "Asphalt Shingles", "Roof Repair", "Storm Damage", "Roof Inspection", "Gutter Installation"],
        "tagline": "Licensed & Insured Residential Roofing — Buffalo/Chaffee",
        "phone": "",
    },
    {
        "slug": "positive-home-planning",
        "company": "Positive Home Planning",
        "contact": "",
        "trade": "Residential Cleaning",
        "location": "Lancaster, NY",
        "services": ["Residential Cleaning", "Assisted Living Support", "Deep Cleaning", "Recurring Service", "Move-In/Out Cleaning", "Organizing"],
        "tagline": "15+ Years of Trusted Home Care in Lancaster",
        "phone": "",
    },
]


def generate_html(lead: dict) -> str:
    company = lead["company"]
    tagline = lead["tagline"]
    location = lead["location"]
    phone = lead.get("phone", "")
    services = lead.get("services", [])

    service_cards = ""
    for s in services:
        service_cards += f"""
            <div class="service-card">
                <div class="service-icon">&#10003;</div>
                <h3>{s}</h3>
            </div>"""

    phone_html = ""
    if phone:
        phone_html = f'<a href="tel:{phone}" class="contact-item phone"><span class="icon">&#128222;</span> {phone}</a>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{company} - {tagline}</title>
    <meta name="description" content="{company} - {tagline}. Serving {location}.">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 0 20px; }}
        .hero {{ background: linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #111827 100%); color: white; text-align: center; padding: 120px 20px; }}
        .hero h1 {{ font-size: 3rem; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }}
        .hero p {{ font-size: 1.3rem; margin-bottom: 30px; opacity: 0.9; }}
        .cta-button {{ display: inline-block; background: #ff6b6b; color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-size: 1.1rem; font-weight: bold; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }}
        .cta-button:hover {{ transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }}
        .services-section {{ padding: 80px 20px; background: #f8f9fa; }}
        .services-section h2 {{ text-align: center; font-size: 2.5rem; margin-bottom: 50px; color: #2c3e50; }}
        .services-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }}
        .service-card {{ background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; transition: transform 0.2s; }}
        .service-card:hover {{ transform: translateY(-5px); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }}
        .service-icon {{ font-size: 2.5rem; color: #667eea; margin-bottom: 15px; }}
        .service-card h3 {{ font-size: 1.2rem; color: #2c3e50; }}
        .contact-section {{ padding: 80px 20px; background: white; text-align: center; }}
        .contact-section h2 {{ font-size: 2.5rem; margin-bottom: 40px; color: #2c3e50; }}
        .contact-info {{ max-width: 600px; margin: 0 auto 40px; }}
        .contact-item {{ display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin: 15px 0; color: #555; text-decoration: none; transition: color 0.2s; }}
        .contact-item:hover {{ color: #667eea; }}
        .contact-item .icon {{ margin-right: 10px; font-size: 1.5rem; }}
        footer {{ background: #2c3e50; color: white; text-align: center; padding: 30px 20px; }}
        footer p {{ margin: 5px 0; opacity: 0.8; }}
        @media (max-width: 768px) {{ .hero h1 {{ font-size: 2rem; }} .hero p {{ font-size: 1.1rem; }} .services-section h2, .contact-section h2 {{ font-size: 2rem; }} }}
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>{company}</h1>
            <p>{tagline}</p>
            <a href="#contact" class="cta-button">Get A Free Quote</a>
        </div>
    </section>

    <section id="services" class="services-section">
        <div class="container">
            <h2>Our Services</h2>
            <div class="services-grid">{service_cards}
            </div>
        </div>
    </section>

    <section id="contact" class="contact-section">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-info">
                {phone_html}
                <p class="contact-item location"><span class="icon">&#128205;</span> Serving {location}</p>
            </div>
            {"<a href='tel:" + phone + "' class='cta-button'>Call Now</a>" if phone else "<a href='#' class='cta-button'>Contact Us</a>"}
        </div>
    </section>

    <footer>
        <p>&copy; {datetime.now().year} {company}. All rights reserved.</p>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.6;">
            This preview site was generated with AI to show {company} what their online presence could look like.
        </p>
    </footer>

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


def main():
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    generated = 0
    skipped = 0

    for lead in LEADS:
        slug = lead["slug"]
        path = PREVIEW_DIR / f"{slug}.html"

        if path.exists():
            print(f"  SKIP {slug} (already exists)")
            skipped += 1
            continue

        html = generate_html(lead)
        path.write_text(html, encoding="utf-8")
        print(f"  CREATED {slug}.html")
        generated += 1

    print(f"\nGenerated: {generated}, Skipped: {skipped}")
    print(f"Total preview pages: {len(list(PREVIEW_DIR.glob('*.html')))}")


if __name__ == "__main__":
    main()
