#!/usr/bin/env python3
"""Fix the 7 broken preview pages that have Ohio/concrete data leaked in."""

from pathlib import Path
from datetime import datetime

PREVIEW_DIR = Path(__file__).resolve().parent.parent / "public" / "preview-pages"

FIXES = [
    {
        "slug": "garys-electrical",
        "company": "Gary's Electrical",
        "tagline": "Licensed Master Electrician — Serving All of Western NY",
        "location": "Middleport & All of WNY",
        "phone": "(716) 352-0301",
        "services": ["Panel Upgrades", "EV Charger Installation", "Generator Hookups", "Residential Wiring", "Electrical Repairs", "Code Corrections"],
    },
    {
        "slug": "tonys-residential-handyman",
        "company": "Tony's Residential Handyman",
        "tagline": "40 Years of Trusted Home Repairs in Tonawanda",
        "location": "Tonawanda & WNY",
        "phone": "(716) 431-9201",
        "services": ["Carpentry", "Painting", "Flooring", "Electrical Repairs", "Plumbing Repairs", "Deck Building"],
    },
    {
        "slug": "buffalo-hvac-heating-services",
        "company": "Buffalo HVAC & Heating Services",
        "tagline": "24/7 Emergency HVAC — Heating & Cooling for Buffalo",
        "location": "Buffalo, NY",
        "phone": "(716) 330-3146",
        "services": ["Furnace Repair", "AC Installation", "Emergency Heating", "Duct Cleaning", "Heat Pump Service", "System Maintenance"],
    },
    {
        "slug": "buffalo-plumbing-services",
        "company": "Buffalo Plumbing Services",
        "tagline": "24/7 Emergency Plumbing — Licensed & Insured",
        "location": "Buffalo, NY",
        "phone": "(716) 271-5266",
        "services": ["Emergency Plumbing", "Drain Cleaning", "Water Heater Repair", "Pipe Repair", "Sewer Line Service", "Fixture Installation"],
    },
    {
        "slug": "dons-roofing",
        "company": "Don's Roofing",
        "tagline": "Professional Roofing Contractor — 25 Years Experience",
        "location": "Buffalo & WNY",
        "phone": "(716) 514-6018",
        "services": ["Roof Replacement", "Roof Repair", "Storm Damage", "Gutter Installation", "Roof Inspection", "Shingle & Metal Roofing"],
    },
    {
        "slug": "wny-plumber",
        "company": "WNY Plumber",
        "tagline": "Professional Plumbing — Licensed & Insured in Buffalo",
        "location": "Buffalo & Western NY",
        "phone": "(716) 910-5554",
        "services": ["Emergency Plumbing", "Drain Cleaning", "Water Heater Service", "Pipe Repair", "Bathroom Plumbing", "Kitchen Plumbing"],
    },
    {
        "slug": "buffalo-bath-and-tile",
        "company": "Buffalo Bath and Tile",
        "tagline": "Professional Bathroom Remodeling & Tile Installation",
        "location": "Buffalo & Western NY",
        "phone": "(716) 574-3245",
        "services": ["Bathroom Remodeling", "Tile Installation", "Shower Renovation", "Floor Tiling", "Backsplash Installation", "Tub Surrounds"],
    },
    {
        "slug": "derme-family-remodeling",
        "company": "Derme Family Remodeling",
        "tagline": "Custom Carpentry & Remodeling in Buffalo",
        "location": "Buffalo & Western NY",
        "phone": "(716) 536-3133",
        "services": ["Kitchen Remodeling", "Bathroom Remodeling", "Custom Carpentry", "Basement Finishing", "Trim & Molding", "Home Additions"],
    },
]


def generate_clean_page(lead: dict) -> str:
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
    fixed = 0
    for lead in FIXES:
        slug = lead["slug"]
        path = PREVIEW_DIR / f"{slug}.html"
        html = generate_clean_page(lead)
        path.write_text(html, encoding="utf-8")
        print(f"  FIXED {slug}.html — {lead['company']} / {lead['phone']} / {lead['location']}")
        fixed += 1

    print(f"\nFixed {fixed} pages")

    # Verify no Ohio/concrete remnants
    print("\n--- Verification ---")
    import subprocess
    result = subprocess.run(
        ["grep", "-ril", "ohio\\|Cleveland\\|Elyria\\|440-941"],
        capture_output=True, text=True, cwd=str(PREVIEW_DIR)
    )
    if result.stdout.strip():
        print(f"  WARNING: Still found issues in: {result.stdout.strip()}")
    else:
        print("  All clean — no Ohio/concrete/wrong phone remnants")


if __name__ == "__main__":
    main()
