#!/usr/bin/env python3
"""
Premium Preview Site Generator
Generates stalczynski-quality HTML preview pages for all leads using:
- Industry-based color theming
- Gemini AI for content generation
- Google Maps photos / Unsplash fallback for images

Usage:
    python generate-preview-sites.py              # READY leads only
    python generate-preview-sites.py --all        # all leads with a slug
    python generate-preview-sites.py --slug NAME  # single page
    python generate-preview-sites.py --skip-gemini # fallback content only
    python generate-preview-sites.py --dry-run    # preview without writing
"""

import os
import sys
import json
import re
import argparse
import urllib.request
import urllib.error
from html import escape as html_escape
from pathlib import Path
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# ── Paths & env ──────────────────────────────────────────────────────────────
repo_root = Path(__file__).resolve().parents[1]
load_dotenv(repo_root / ".env.local")
load_dotenv(repo_root / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
    or os.getenv("SUPABASE_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)
BASE_URL = (os.getenv("NEXT_PUBLIC_BASE_URL") or os.getenv("BASE_URL") or "http://localhost:3000").rstrip("/")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Missing SUPABASE_URL or SUPABASE_KEY in .env file")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

PREVIEW_DIR = repo_root / "public" / "preview-pages"
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR = PREVIEW_DIR / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)


# ── SVG Icon Library ─────────────────────────────────────────────────────────
SVG_ICONS = {
    "phone": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
    "shield": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/></svg>',
    "shield_check": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
    "clock": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    "wrench": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    "house": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M2 20h20M5 20V10l7-7 7 7v10M4 10l8-7 8 7"/><path d="M10 20v-6h4v6"/></svg>',
    "building": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
    "star": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>',
    "check_circle": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    "truck": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    "zap": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    "droplet": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
    "thermometer": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>',
    "sparkles": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
    "users": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>',
    "map_pin": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    "award": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>',
    "tool": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
    "paint_bucket": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>',
    "home": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
    "trash": '<svg width="{s}" height="{s}" fill="none" stroke="{c}" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>',
}


def icon(name, size=22, color="currentColor"):
    svg = SVG_ICONS.get(name, SVG_ICONS["star"])
    return svg.format(s=size, c=color)


def icon_filled(name, size=22, color="currentColor"):
    """Return a filled version (uses fill instead of stroke)."""
    svg = SVG_ICONS.get(name, SVG_ICONS["star"])
    return svg.format(s=size, c=color).replace('fill="none"', f'fill="{color}"').replace(f'stroke="{color}"', 'stroke="none"')


# ── Industry Color Themes ────────────────────────────────────────────────────
THEMES = {
    "roofing": {
        "primary": "#b45309", "primary_hover": "#92400e",
        "primary_rgb": "180,83,9",
        "dark": "#1c1917", "dark_light": "#292524",
        "accent": "#f59e0b", "accent_hover": "#d97706",
        "badge_bg": "#fef3c7", "badge_text": "#92400e",
        "icon_bg_1": "#fef3c7", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
        "unsplash_hero": "photo-1632778149955-e80f8ceca2e8",
        "unsplash_services": ["photo-1632778149955-e80f8ceca2e8", "photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd"],
    },
    "plumbing": {
        "primary": "#0369a1", "primary_hover": "#075985",
        "primary_rgb": "3,105,161",
        "dark": "#0c1524", "dark_light": "#172135",
        "accent": "#0ea5e9", "accent_hover": "#0284c7",
        "badge_bg": "#e0f2fe", "badge_text": "#075985",
        "icon_bg_1": "#e0f2fe", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #0c1524 0%, #172135 50%, #1e3a5f 100%)",
        "unsplash_hero": "photo-1585704032915-c3400ca199e7",
        "unsplash_services": ["photo-1585704032915-c3400ca199e7", "photo-1504307651254-35680f356dfd", "photo-1558618666-fcd25c85f82e"],
    },
    "hvac": {
        "primary": "#4338ca", "primary_hover": "#3730a3",
        "primary_rgb": "67,56,202",
        "dark": "#0f0e24", "dark_light": "#1a1838",
        "accent": "#818cf8", "accent_hover": "#6366f1",
        "badge_bg": "#e0e7ff", "badge_text": "#3730a3",
        "icon_bg_1": "#e0e7ff", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #0f0e24 0%, #1a1838 50%, #2d2b55 100%)",
        "unsplash_hero": "photo-1631545806609-02fa6e4956d7",
        "unsplash_services": ["photo-1631545806609-02fa6e4956d7", "photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd"],
    },
    "cleaning": {
        "primary": "#0d9488", "primary_hover": "#0f766e",
        "primary_rgb": "13,148,136",
        "dark": "#0a1a1a", "dark_light": "#142828",
        "accent": "#2dd4bf", "accent_hover": "#14b8a6",
        "badge_bg": "#ccfbf1", "badge_text": "#0f766e",
        "icon_bg_1": "#ccfbf1", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #0a1a1a 0%, #142828 50%, #1a3a3a 100%)",
        "unsplash_hero": "photo-1581578731548-c64695cc6952",
        "unsplash_services": ["photo-1581578731548-c64695cc6952", "photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd"],
    },
    "electrical": {
        "primary": "#ca8a04", "primary_hover": "#a16207",
        "primary_rgb": "202,138,4",
        "dark": "#1a1700", "dark_light": "#2a2510",
        "accent": "#facc15", "accent_hover": "#eab308",
        "badge_bg": "#fef9c3", "badge_text": "#854d0e",
        "icon_bg_1": "#fef9c3", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1a1700 0%, #2a2510 50%, #3d3820 100%)",
        "unsplash_hero": "photo-1621905252507-b35492cc74b4",
        "unsplash_services": ["photo-1621905252507-b35492cc74b4", "photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd"],
    },
    "concrete": {
        "primary": "#525252", "primary_hover": "#404040",
        "primary_rgb": "82,82,82",
        "dark": "#171717", "dark_light": "#262626",
        "accent": "#a3a3a3", "accent_hover": "#737373",
        "badge_bg": "#f5f5f5", "badge_text": "#404040",
        "icon_bg_1": "#f5f5f5", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #171717 0%, #262626 50%, #3f3f3f 100%)",
        "unsplash_hero": "photo-1504307651254-35680f356dfd",
        "unsplash_services": ["photo-1504307651254-35680f356dfd", "photo-1558618666-fcd25c85f82e", "photo-1590496793929-36417d3117de"],
    },
    "remodeling": {
        "primary": "#9333ea", "primary_hover": "#7e22ce",
        "primary_rgb": "147,51,234",
        "dark": "#1a0a2e", "dark_light": "#2a1548",
        "accent": "#a855f7", "accent_hover": "#9333ea",
        "badge_bg": "#f3e8ff", "badge_text": "#7e22ce",
        "icon_bg_1": "#f3e8ff", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1a0a2e 0%, #2a1548 50%, #3d2066 100%)",
        "unsplash_hero": "photo-1558618666-fcd25c85f82e",
        "unsplash_services": ["photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd", "photo-1590496793929-36417d3117de"],
    },
    "moving": {
        "primary": "#c2410c", "primary_hover": "#9a3412",
        "primary_rgb": "194,65,12",
        "dark": "#1c1008", "dark_light": "#2c1a10",
        "accent": "#fb923c", "accent_hover": "#f97316",
        "badge_bg": "#ffedd5", "badge_text": "#9a3412",
        "icon_bg_1": "#ffedd5", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1c1008 0%, #2c1a10 50%, #44281a 100%)",
        "unsplash_hero": "photo-1600585152220-90363fe7e115",
        "unsplash_services": ["photo-1600585152220-90363fe7e115", "photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd"],
    },
    "flooring": {
        "primary": "#92400e", "primary_hover": "#78350f",
        "primary_rgb": "146,64,14",
        "dark": "#1c1408", "dark_light": "#2c2010",
        "accent": "#d97706", "accent_hover": "#b45309",
        "badge_bg": "#fef3c7", "badge_text": "#78350f",
        "icon_bg_1": "#fef3c7", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1c1408 0%, #2c2010 50%, #44321a 100%)",
        "unsplash_hero": "photo-1558618666-fcd25c85f82e",
        "unsplash_services": ["photo-1558618666-fcd25c85f82e", "photo-1504307651254-35680f356dfd", "photo-1590496793929-36417d3117de"],
    },
    "handyman": {
        "primary": "#b45309", "primary_hover": "#92400e",
        "primary_rgb": "180,83,9",
        "dark": "#1c1917", "dark_light": "#292524",
        "accent": "#f59e0b", "accent_hover": "#d97706",
        "badge_bg": "#fef3c7", "badge_text": "#92400e",
        "icon_bg_1": "#fef3c7", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
        "unsplash_hero": "photo-1504307651254-35680f356dfd",
        "unsplash_services": ["photo-1504307651254-35680f356dfd", "photo-1558618666-fcd25c85f82e", "photo-1590496793929-36417d3117de"],
    },
    "garage": {
        "primary": "#dc2626", "primary_hover": "#b91c1c",
        "primary_rgb": "220,38,38",
        "dark": "#1c0e0e", "dark_light": "#2c1818",
        "accent": "#ef4444", "accent_hover": "#dc2626",
        "badge_bg": "#fee2e2", "badge_text": "#991b1b",
        "icon_bg_1": "#fee2e2", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1c0e0e 0%, #2c1818 50%, #442020 100%)",
        "unsplash_hero": "photo-1486006920555-c77dcf18193c",
        "unsplash_services": ["photo-1486006920555-c77dcf18193c", "photo-1504307651254-35680f356dfd", "photo-1558618666-fcd25c85f82e"],
    },
    "demolition": {
        "primary": "#b45309", "primary_hover": "#92400e",
        "primary_rgb": "180,83,9",
        "dark": "#1c1917", "dark_light": "#292524",
        "accent": "#f59e0b", "accent_hover": "#d97706",
        "badge_bg": "#fef3c7", "badge_text": "#92400e",
        "icon_bg_1": "#fef3c7", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
        "unsplash_hero": "photo-1590496793929-36417d3117de",
        "unsplash_services": ["photo-1590496793929-36417d3117de", "photo-1504307651254-35680f356dfd", "photo-1558618666-fcd25c85f82e"],
    },
    "default": {
        "primary": "#2563eb", "primary_hover": "#1d4ed8",
        "primary_rgb": "37,99,235",
        "dark": "#0f172a", "dark_light": "#1e293b",
        "accent": "#3b82f6", "accent_hover": "#2563eb",
        "badge_bg": "#dbeafe", "badge_text": "#1e40af",
        "icon_bg_1": "#dbeafe", "icon_bg_2": "#e7e5e4", "icon_bg_3": "#dcfce7",
        "hero_gradient": "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        "unsplash_hero": "photo-1504307651254-35680f356dfd",
        "unsplash_services": ["photo-1504307651254-35680f356dfd", "photo-1558618666-fcd25c85f82e", "photo-1590496793929-36417d3117de"],
    },
}

# Keywords to theme mapping (fuzzy match)
INDUSTRY_KEYWORDS = {
    "roofing": ["roof", "roofing", "roofer", "shingle", "gutter"],
    "plumbing": ["plumb", "plumber", "plumbing", "drain", "pipe", "sewer", "water heater"],
    "hvac": ["hvac", "heating", "cooling", "air condition", "furnace", "heat pump", "ac "],
    "cleaning": ["clean", "cleaning", "maid", "janitorial", "housekeep", "turnover", "cleanout"],
    "electrical": ["electrical", "electrician", "wiring", "electric work", "master electrician"],
    "concrete": ["concrete", "masonry", "cement", "paving", "asphalt"],
    "remodeling": ["remodel", "renovation", "kitchen", "bath", "bathroom", "tile", "cabinet"],
    "moving": ["mov", "mover", "moving", "hauling", "relocation"],
    "flooring": ["floor", "flooring", "carpet", "hardwood", "laminate", "vinyl"],
    "handyman": ["handyman", "handy", "maintenance", "repair", "odd job", "home improvement"],
    "garage": ["garage door", "garage", "auto", "mechanic", "car repair", "automotive", "body shop"],
    "demolition": ["demolition", "demo", "excavat", "tear down", "wrecking"],
}


def detect_theme(lead):
    """Detect the best color theme from industry + company name + services."""
    search_text = " ".join([
        lead.get("industry") or "",
        lead.get("company_name") or "",
        lead.get("services_offered") or "",
        lead.get("business_description") or "",
    ]).lower()

    best_match = "default"
    best_score = 0
    for theme_name, keywords in INDUSTRY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in search_text)
        if score > best_score:
            best_score = score
            best_match = theme_name

    return THEMES[best_match]


# ── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')


def parse_services(services_text):
    if not services_text:
        return []
    services = re.split(r'[,;]', services_text)
    return [s.strip() for s in services if s.strip()][:8]


def parse_photos(lead):
    photos_raw = lead.get('photos_json', [])
    if isinstance(photos_raw, str):
        try:
            return json.loads(photos_raw)
        except (json.JSONDecodeError, TypeError):
            return []
    return photos_raw or []


def e(text):
    """Shorthand for HTML escape."""
    return html_escape(str(text)) if text else ""


# ── Gemini Content Generation ────────────────────────────────────────────────

def call_gemini(lead):
    """Call Gemini 2.0 Flash to generate missing content for a lead."""
    if not GEMINI_API_KEY:
        return None

    company = lead.get("company_name", "Business")
    industry = lead.get("industry", "services")
    city = lead.get("city_region", "Buffalo, NY")
    desc = lead.get("business_description", "")
    services = lead.get("services_offered", "")
    phone = lead.get("phone", "")

    prompt = f"""Generate website content for a local business. Return ONLY valid JSON, no markdown.

Business: {company}
Industry: {industry}
Location: {city}
Description: {desc}
Services: {services}
Phone: {phone}

Return this exact JSON structure:
{{
  "tagline": "Short tagline for hero section (8-12 words)",
  "hero_description": "2-3 sentence hero description highlighting what makes them stand out (40-60 words)",
  "hero_badge_text": "Short badge text like 'Serving [City] & Surrounding Areas' (5-8 words)",
  "hero_accent_word": "One powerful word from the h1 to highlight in color (e.g. 'Experts', 'Trusted', 'Reliable')",
  "trust_bar_items": ["item1", "item2", "item3", "item4"],
  "why_choose_us": [
    {{"title": "Card title", "description": "1-2 sentence description", "icon_category": "shield_check"}},
    {{"title": "Card title", "description": "1-2 sentence description", "icon_category": "clock"}},
    {{"title": "Card title", "description": "1-2 sentence description", "icon_category": "star"}}
  ],
  "services_detailed": [
    {{"name": "Service Name", "description": "1 sentence description", "icon_category": "wrench"}},
    {{"name": "Service Name", "description": "1 sentence description", "icon_category": "house"}}
  ],
  "cta_headline": "Call-to-action headline (6-10 words)",
  "cta_description": "1-2 sentence CTA description"
}}

For icon_category use ONLY these values: phone, shield, shield_check, clock, wrench, house, building, star, check_circle, truck, zap, droplet, thermometer, sparkles, users, map_pin, award, tool, paint_bucket, home, trash

Make the content specific to {industry} in {city}. Be enthusiastic but professional. Do not use generic filler text."""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048}
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        # Strip markdown code fences if present
        text = re.sub(r'^```(?:json)?\s*', '', text.strip())
        text = re.sub(r'\s*```$', '', text.strip())
        return json.loads(text)
    except Exception as ex:
        print(f"    Gemini API error: {ex}")
        return None


def get_fallback_content(lead):
    """Generate fallback content when Gemini is unavailable."""
    company = lead.get("company_name", "Business")
    industry = lead.get("industry", "services")
    city = lead.get("city_region", "Buffalo, NY")
    services = parse_services(lead.get("services_offered", ""))

    return {
        "tagline": f"Professional {industry.title()} Services in {city}",
        "hero_description": f"{company} provides professional {industry} services to homeowners and businesses in {city} and surrounding areas. Quality work, fair prices, and reliable service you can count on.",
        "hero_badge_text": f"Serving {city} & Surrounding Areas",
        "hero_accent_word": "Experts",
        "trust_bar_items": ["Free Estimates", "Licensed & Insured", "Locally Owned", "Satisfaction Guaranteed"],
        "why_choose_us": [
            {"title": "Licensed & Insured", "description": f"Fully licensed and insured for your peace of mind. Every job meets local code requirements.", "icon_category": "shield_check"},
            {"title": "Fast Response", "description": f"Quick turnaround on estimates and project starts. We respect your time and schedule.", "icon_category": "clock"},
            {"title": "Quality Work", "description": f"We take pride in delivering top-quality {industry} work that stands the test of time.", "icon_category": "star"},
        ],
        "services_detailed": [
            {"name": s, "description": f"Professional {s.lower()} services for residential and commercial clients.", "icon_category": "wrench"}
            for s in (services or [f"{industry.title()} Service"])[:6]
        ],
        "cta_headline": f"Need {industry.title()} Help? Call Today.",
        "cta_description": f"Get a free estimate from {company}. Professional {industry} services in {city} and surrounding areas.",
    }


# ── Image Selection ──────────────────────────────────────────────────────────

def get_hero_image(lead, theme):
    """Get the best hero image URL: Google Maps photos > Unsplash fallback."""
    photos = parse_photos(lead)
    if photos:
        first = photos[0]
        url = first.get("url", "") if isinstance(first, dict) else str(first)
        if url:
            return url
    # Unsplash fallback
    return f"https://images.unsplash.com/{theme['unsplash_hero']}?w=600&h=500&fit=crop"


def get_service_images(lead, theme):
    """Get 3 images for the services strip."""
    photos = parse_photos(lead)
    urls = []
    for p in photos[:3]:
        url = p.get("url", "") if isinstance(p, dict) else str(p)
        if url:
            urls.append(url)
    # Fill remaining with unsplash
    for unsplash_id in theme["unsplash_services"]:
        if len(urls) >= 3:
            break
        u = f"https://images.unsplash.com/{unsplash_id}?w=400&h=200&fit=crop"
        if u not in urls:
            urls.append(u)
    return urls[:3]


# ── HTML Template ────────────────────────────────────────────────────────────

def generate_premium_html(lead, content, theme):
    """Generate stalczynski-quality HTML from lead data + Gemini content + theme."""
    company = e(lead.get("company_name", "Your Business"))
    phone = lead.get("phone", "")
    phone_display = e(phone)
    phone_href = re.sub(r'[^\d+]', '', phone)
    city = e(lead.get("city_region", "Buffalo, NY"))
    industry = e(lead.get("industry", "Services"))

    tagline = e(content.get("tagline", f"Professional {industry} in {city}"))
    hero_desc = e(content.get("hero_description", ""))
    badge_text = e(content.get("hero_badge_text", f"Serving {city} & Surrounding Areas"))
    accent_word = content.get("hero_accent_word", "Experts")

    hero_img = get_hero_image(lead, theme)
    service_imgs = get_service_images(lead, theme)

    # Build h1 — highlight the accent word
    h1_text = tagline
    if accent_word and accent_word.lower() in tagline.lower():
        # Replace last occurrence of accent word with highlighted version
        idx = tagline.lower().rfind(accent_word.lower())
        original_word = tagline[idx:idx+len(accent_word)]
        h1_text = tagline[:idx] + f'<span class="highlight">{e(original_word)}</span>' + tagline[idx+len(accent_word):]

    # Trust bar
    trust_items_data = content.get("trust_bar_items", ["Free Estimates", "Licensed & Insured", "Locally Owned"])
    trust_icons = ["shield", "check_circle", "clock", "building", "award"]
    trust_bar_html = ""
    for i, item in enumerate(trust_items_data[:5]):
        ic = trust_icons[i % len(trust_icons)]
        trust_bar_html += f"""
    <div class="trust-item">
      {icon_filled(ic, 22, "var(--accent)")}
      {e(item)}
    </div>"""

    # Why choose us cards
    why_cards_data = content.get("why_choose_us", [])
    icon_bg_cycle = ["icon_bg_1", "icon_bg_2", "icon_bg_3"]
    icon_color_map = {"icon_bg_1": "var(--accent)", "icon_bg_2": "var(--steel)", "icon_bg_3": "var(--green)"}
    why_cards_html = ""
    for i, card in enumerate(why_cards_data[:6]):
        bg_key = icon_bg_cycle[i % 3]
        ic_color = icon_color_map[bg_key]
        ic_name = card.get("icon_category", "star")
        if ic_name not in SVG_ICONS:
            ic_name = "star"
        why_cards_html += f"""
        <div class="why-card">
          <div class="why-icon" style="background: var(--{bg_key});">
            {icon(ic_name, 28, ic_color)}
          </div>
          <h3>{e(card.get("title", ""))}</h3>
          <p>{e(card.get("description", ""))}</p>
        </div>"""

    # Services grid
    services_data = content.get("services_detailed", [])
    services_html = ""
    for i, svc in enumerate(services_data[:8]):
        ic_name = svc.get("icon_category", "wrench")
        if ic_name not in SVG_ICONS:
            ic_name = "wrench"
        # Alternate some service icons with accent background
        bg_style = ""
        if i >= 4:
            bg_style = ' style="background: var(--accent);"'
            stroke_color = "var(--dark)"
        else:
            stroke_color = "#fff"
        services_html += f"""
        <div class="service-card">
          <div class="service-icon"{bg_style}>
            {icon(ic_name, 22, stroke_color)}
          </div>
          <div>
            <h4>{e(svc.get("name", ""))}</h4>
            <p>{e(svc.get("description", ""))}</p>
          </div>
        </div>"""

    # Service image strip
    img_strip_html = ""
    for img_url in service_imgs:
        img_strip_html += f"""
        <div style="border-radius: 14px; overflow: hidden; height: 180px;"><img src="{e(img_url)}" alt="{company} work" style="width: 100%; height: 100%; object-fit: cover;"></div>"""

    # Hero overlay stats (up to 3 trust items)
    overlay_stats_html = ""
    for item in trust_items_data[:3]:
        overlay_stats_html += f"""
            <div class="hero-stat"><span class="check">&#10003;</span> {e(item)}</div>"""

    cta_headline = e(content.get("cta_headline", f"Need {industry} Help? Call Today."))
    cta_desc = e(content.get("cta_description", f"Get a free estimate from {company}."))

    year = datetime.now().year

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{company} | {city} | {tagline}</title>
  <meta name="description" content="{hero_desc[:160]}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {{ margin: 0; padding: 0; box-sizing: border-box; }}
    :root {{
      --dark: {theme["dark"]};
      --dark-light: {theme["dark_light"]};
      --accent: {theme["accent"]};
      --accent-hover: {theme["accent_hover"]};
      --primary: {theme["primary"]};
      --primary-rgb: {theme["primary_rgb"]};
      --steel: #57534e;
      --steel-light: #78716c;
      --warm-white: #fafaf9;
      --gray-50: #f5f5f4;
      --gray-100: #e7e5e4;
      --gray-600: #57534e;
      --gray-800: #1c1917;
      --green: #16a34a;
      --green-light: #dcfce7;
      --icon-bg-1: {theme["icon_bg_1"]};
      --icon-bg-2: {theme["icon_bg_2"]};
      --icon-bg-3: {theme["icon_bg_3"]};
      --badge-bg: {theme["badge_bg"]};
      --badge-text: {theme["badge_text"]};
    }}
    html {{ scroll-behavior: smooth; }}
    body {{ font-family: 'Inter', sans-serif; color: var(--gray-800); background: var(--warm-white); overflow-x: hidden; }}

    /* === NAVBAR === */
    .navbar {{
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      background: rgba({theme["primary_rgb"]}, 0.08); backdrop-filter: blur(12px);
      background: rgba(28, 25, 23, 0.95); backdrop-filter: blur(10px);
      padding: 0.8rem 2rem;
      display: flex; justify-content: space-between; align-items: center;
    }}
    .navbar-brand {{
      display: flex; align-items: center; gap: 0.6rem;
      text-decoration: none; color: #fff;
    }}
    .navbar-brand .icon {{
      width: 40px; height: 40px; background: var(--accent);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
    }}
    .navbar-brand span {{ font-weight: 700; font-size: 1.1rem; letter-spacing: -0.5px; }}
    .navbar-phone {{
      display: flex; align-items: center; gap: 0.5rem;
      background: var(--accent); color: var(--dark);
      padding: 0.6rem 1.2rem; border-radius: 50px;
      text-decoration: none; font-weight: 700; font-size: 0.95rem;
      transition: all 0.3s;
    }}
    .navbar-phone:hover {{ background: var(--accent-hover); transform: scale(1.05); }}

    /* === HERO === */
    .hero {{
      min-height: 100vh; padding: 8rem 2rem 4rem;
      background: {theme["hero_gradient"]};
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
    }}
    .hero::before {{
      content: ''; position: absolute; top: -50%; right: -20%;
      width: 800px; height: 800px;
      background: radial-gradient(circle, rgba(var(--primary-rgb), 0.12) 0%, transparent 70%);
      border-radius: 50%;
    }}
    .hero::after {{
      content: ''; position: absolute; bottom: -10%; left: -10%;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(87,83,78,0.4) 0%, transparent 70%);
      border-radius: 50%;
    }}
    .hero-inner {{
      max-width: 1100px; width: 100%; position: relative; z-index: 2;
      display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem; align-items: center;
    }}
    .hero-text {{ color: #fff; }}
    .hero-badge {{
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
      padding: 0.4rem 1rem; border-radius: 50px;
      font-size: 0.85rem; color: rgba(255,255,255,0.9);
      margin-bottom: 1.5rem; backdrop-filter: blur(5px);
    }}
    .hero-badge .dot {{ width: 8px; height: 8px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }}
    @keyframes pulse {{ 0%, 100% {{ opacity: 1; }} 50% {{ opacity: 0.4; }} }}
    .hero h1 {{
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem; font-weight: 800; line-height: 1.1;
      margin-bottom: 1.2rem;
    }}
    .hero h1 .highlight {{ color: var(--accent); }}
    .hero-sub {{
      font-size: 1.15rem; line-height: 1.7; color: rgba(255,255,255,0.8);
      margin-bottom: 2rem; max-width: 500px;
    }}
    .hero-ctas {{ display: flex; gap: 1rem; flex-wrap: wrap; }}
    .btn-primary {{
      background: var(--accent); color: var(--dark); border: none;
      padding: 1rem 2rem; border-radius: 12px;
      font-size: 1.05rem; font-weight: 700; cursor: pointer;
      text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
      transition: all 0.3s; box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.4);
    }}
    .btn-primary:hover {{ background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 6px 25px rgba(var(--primary-rgb), 0.5); }}
    .btn-secondary {{
      background: rgba(255,255,255,0.1); color: #fff;
      border: 2px solid rgba(255,255,255,0.3);
      padding: 1rem 2rem; border-radius: 12px;
      font-size: 1.05rem; font-weight: 600; cursor: pointer;
      text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;
      transition: all 0.3s;
    }}
    .btn-secondary:hover {{ background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.5); }}
    .hero-image-wrapper {{
      position: relative; border-radius: 20px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }}
    .hero-image-wrapper img {{ width: 100%; height: 420px; object-fit: cover; display: block; }}
    .hero-image-overlay {{
      position: absolute; bottom: 0; left: 0; right: 0;
      background: linear-gradient(to top, rgba(28,25,23,0.95), transparent);
      padding: 2rem 1.5rem 1.5rem;
    }}
    .hero-overlay-stats {{ display: flex; flex-direction: column; gap: 0.5rem; }}
    .hero-stat {{
      display: flex; align-items: center; gap: 0.7rem;
      font-size: 0.9rem; color: rgba(255,255,255,0.9);
    }}
    .hero-stat .check {{
      width: 26px; height: 26px; background: rgba(22,163,74,0.25);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; flex-shrink: 0; color: #4ade80;
    }}

    /* === TRUST BAR === */
    .trust-bar {{
      background: var(--dark); padding: 1.5rem 2rem;
      display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap;
    }}
    .trust-item {{
      display: flex; align-items: center; gap: 0.6rem;
      color: rgba(255,255,255,0.85); font-size: 0.9rem; font-weight: 500;
    }}
    .trust-item svg {{ width: 22px; height: 22px; flex-shrink: 0; }}

    /* === SECTIONS === */
    .section {{ padding: 5rem 2rem; }}
    .section-inner {{ max-width: 1100px; margin: 0 auto; }}
    .section-label {{
      display: inline-block; background: var(--badge-bg); color: var(--badge-text);
      padding: 0.3rem 1rem; border-radius: 50px; font-size: 0.8rem;
      font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 1rem;
    }}
    .section-title {{
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem; font-weight: 800; color: var(--dark);
      line-height: 1.2; margin-bottom: 1rem;
    }}
    .section-sub {{ font-size: 1.1rem; color: var(--gray-600); line-height: 1.7; max-width: 600px; margin-bottom: 3rem; }}

    /* === WHY US === */
    .why-section {{ background: var(--gray-50); }}
    .why-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }}
    .why-card {{
      background: #fff; border-radius: 16px; padding: 2rem;
      border: 1px solid var(--gray-100); transition: all 0.3s;
    }}
    .why-card:hover {{ transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }}
    .why-icon {{
      width: 56px; height: 56px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 1.2rem;
    }}
    .why-card h3 {{ font-size: 1.15rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--dark); }}
    .why-card p {{ font-size: 0.92rem; line-height: 1.6; color: var(--gray-600); }}

    /* === SERVICES === */
    .services-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.2rem; }}
    .service-card {{
      background: #f5f5f4; border-radius: 14px; padding: 1.5rem;
      display: flex; align-items: flex-start; gap: 1rem;
      transition: all 0.3s; border: 2px solid transparent;
    }}
    .service-card:hover {{ border-color: var(--accent); background: #fff; }}
    .service-icon {{
      width: 44px; height: 44px; background: var(--dark); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }}
    .service-card h4 {{ font-size: 0.95rem; font-weight: 700; color: var(--dark); margin-bottom: 0.3rem; }}
    .service-card p {{ font-size: 0.82rem; color: var(--gray-600); line-height: 1.5; }}

    /* === CTA BANNER === */
    .cta-banner {{
      background: linear-gradient(135deg, var(--dark) 0%, #44403c 100%);
      padding: 4rem 2rem; text-align: center; color: #fff;
    }}
    .cta-banner h2 {{
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem;
    }}
    .cta-banner p {{ font-size: 1.1rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; }}
    .cta-phone-big {{
      display: inline-flex; align-items: center; gap: 0.7rem;
      background: var(--accent); color: var(--dark);
      padding: 1.2rem 2.5rem; border-radius: 16px;
      font-size: 1.5rem; font-weight: 800;
      text-decoration: none; transition: all 0.3s;
      box-shadow: 0 4px 30px rgba(var(--primary-rgb), 0.4);
    }}
    .cta-phone-big:hover {{ background: var(--accent-hover); transform: scale(1.05); }}
    .cta-sub {{ margin-top: 1rem; font-size: 0.9rem; color: rgba(255,255,255,0.6); }}

    /* === FOOTER === */
    .footer {{
      background: var(--dark); color: rgba(255,255,255,0.7);
      padding: 3rem 2rem; text-align: center;
    }}
    .footer-brand {{ font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }}
    .footer-info {{ font-size: 0.9rem; line-height: 1.8; }}
    .footer-phone {{ color: var(--accent); text-decoration: none; font-weight: 700; }}
    .footer-bottom {{ margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; }}

    /* === RESPONSIVE === */
    @media (max-width: 768px) {{
      .hero-inner {{ grid-template-columns: 1fr; gap: 2rem; }}
      .hero h1 {{ font-size: 2.5rem; }}
      .why-grid {{ grid-template-columns: 1fr; }}
      .trust-bar {{ gap: 1.5rem; }}
      .navbar-brand span {{ display: none; }}
    }}
  </style>
</head>
<body>

  <!-- NAVBAR -->
  <nav class="navbar">
    <a href="#" class="navbar-brand">
      <div class="icon">
        {icon("house", 22, theme["dark"])}
      </div>
      <span>{company}</span>
    </a>
    {"" if not phone else f'''<a href="tel:{phone_href}" class="navbar-phone">
      {icon("phone", 18, "currentColor")}
      {phone_display}
    </a>'''}
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-text">
        <div class="hero-badge">
          <span class="dot"></span>
          {badge_text}
        </div>
        <h1>{h1_text}</h1>
        <p class="hero-sub">{hero_desc}</p>
        <div class="hero-ctas">
          {"" if not phone else f'''<a href="tel:{phone_href}" class="btn-primary">
            {icon("phone", 20, "currentColor")}
            Call Now - Free Estimate
          </a>'''}
          <a href="#services" class="btn-secondary">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            View Services
          </a>
        </div>
      </div>
      <div class="hero-image-wrapper">
        <img src="{e(hero_img)}" alt="{company} - {industry}">
        <div class="hero-image-overlay">
          <div class="hero-overlay-stats">{overlay_stats_html}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TRUST BAR -->
  <div class="trust-bar">{trust_bar_html}
  </div>

  <!-- WHY CHOOSE US -->
  <section class="section why-section">
    <div class="section-inner">
      <span class="section-label">Why Choose {company}</span>
      <h2 class="section-title">Why {city} Trusts {company}</h2>
      <div class="why-grid">{why_cards_html}
      </div>
    </div>
  </section>

  <!-- SERVICES -->
  <section class="section" id="services">
    <div class="section-inner">
      <span class="section-label">Our Services</span>
      <h2 class="section-title">{industry.title()} Services</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 2.5rem;">{img_strip_html}
      </div>
      <div class="services-grid">{services_html}
      </div>
    </div>
  </section>

  <!-- CTA BANNER -->
  <section class="cta-banner">
    <h2>{cta_headline}</h2>
    <p>{cta_desc}</p>
    {"" if not phone else f'''<a href="tel:{phone_href}" class="cta-phone-big">
      {icon("phone", 28, "currentColor")}
      {phone_display}
    </a>'''}
    <p class="cta-sub">{badge_text}</p>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-brand">{company}</div>
    <div class="footer-info">
      {badge_text}<br>
      {"" if not phone else f'<a href="tel:{phone_href}" class="footer-phone">{phone_display}</a><br>'}
      {industry.title()} &bull; {city}
    </div>
    <div class="footer-bottom">
      &copy; {year} {company}. All rights reserved.<br>
      <span style="color: rgba(255,255,255,0.4); font-size: 0.75rem;">Landing page designed by ClockOutNow.com</span>
    </div>
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
      }}).catch(function() {{}});
    }})();
  </script>
</body>
</html>"""

    return html


# ── Save & DB Update ─────────────────────────────────────────────────────────

def save_preview_site(lead, html, dry_run=False):
    slug = lead.get('_override_slug') or lead.get('preview_page_slug')
    if not slug:
        slug = slugify(lead['company_name'])

    html_file = PREVIEW_DIR / f"{slug}.htm"
    preview_url = f"{BASE_URL}/preview/{slug}"

    if dry_run:
        print(f"    [DRY RUN] Would write {html_file} ({len(html)} chars)")
        return preview_url, html_file

    html_file.write_text(html, encoding='utf-8')

    # Update database
    updates = {
        'preview_page_slug': slug,
        'preview_site_url': preview_url,
        'status': 'SITE_GENERATED',
        'updated_at': datetime.now(tz=None).isoformat()
    }
    supabase.table("leads").update(updates).eq("id", lead['id']).execute()

    return preview_url, html_file


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Premium Preview Site Generator")
    parser.add_argument("--all", action="store_true", help="Regenerate all leads (not just READY)")
    parser.add_argument("--slug", type=str, help="Regenerate a single page by slug")
    parser.add_argument("--skip-gemini", action="store_true", help="Use fallback content only")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing files")
    args = parser.parse_args()

    print("\n" + "=" * 70)
    print("PREMIUM PREVIEW SITE GENERATOR")
    print("=" * 70)

    # Fetch leads
    if args.slug:
        response = supabase.table("leads").select("*").eq("preview_page_slug", args.slug).execute()
        if not response.data:
            # Try matching by slugified company name (exact or contains)
            response = supabase.table("leads").select("*").execute()
            exact = [l for l in response.data if slugify(l.get("company_name", "")) == args.slug]
            if exact:
                response.data = exact
            else:
                # Partial match: slug contains the search term or vice versa
                # Loose match: compare with hyphens removed for fuzzy matching
                search_flat = args.slug.replace("-", "")
                partial = [l for l in response.data if search_flat in slugify(l.get("company_name", "")).replace("-", "")]
                response.data = partial[:1]  # Take first match
        leads = response.data
    elif args.all:
        # Match leads to existing .htm files by fuzzy slug match
        existing_slugs = [f.stem for f in PREVIEW_DIR.glob("*.htm")]
        response = supabase.table("leads").select("*").execute()
        all_leads = response.data
        leads = []
        matched_slugs = set()
        matched_lead_ids = set()
        for slug in existing_slugs:
            slug_flat = slug.replace("-", "")
            for lead in all_leads:
                lid = lead.get("id")
                if lid in matched_lead_ids:
                    continue
                name_slug = slugify(lead.get("company_name") or "")
                name_flat = name_slug.replace("-", "")
                # Match: exact, contains, or one is prefix of the other (handles shortened slugs)
                if (name_flat == slug_flat
                    or slug_flat in name_flat
                    or name_flat in slug_flat
                    or name_flat.startswith(slug_flat[:8])  # first 8 chars match
                    or slug_flat.startswith(name_flat[:8])):
                    lead_copy = dict(lead)
                    lead_copy["_override_slug"] = slug
                    leads.append(lead_copy)
                    matched_slugs.add(slug)
                    matched_lead_ids.add(lid)
                    break
        unmatched = set(existing_slugs) - matched_slugs
        if unmatched:
            print(f"  Warning: {len(unmatched)} .htm files had no matching lead: {unmatched}")
    else:
        response = supabase.table("leads").select("*").eq("status", "READY").execute()
        leads = response.data

    if not leads:
        print("\nNo leads found matching criteria.")
        return

    print(f"\nFound {len(leads)} leads to process")
    if args.skip_gemini:
        print("Gemini SKIPPED - using fallback content")
    if args.dry_run:
        print("DRY RUN - no files will be written")
    print()

    generated = []
    for i, lead in enumerate(leads, 1):
        company = lead.get('company_name', 'Unknown')
        print(f"[{i}/{len(leads)}] {company}")

        try:
            # Detect theme
            theme = detect_theme(lead)
            print(f"    Theme: {[k for k, v in THEMES.items() if v is theme][0]}")

            # Generate content
            content = None
            if not args.skip_gemini:
                print("    Calling Gemini...")
                content = call_gemini(lead)
                if content:
                    print("    Gemini content OK")

            if not content:
                content = get_fallback_content(lead)
                if not args.skip_gemini:
                    print("    Using fallback content")

            # Generate HTML
            html = generate_premium_html(lead, content, theme)

            # Save
            preview_url, file_path = save_preview_site(lead, html, dry_run=args.dry_run)

            generated.append({'company': company, 'url': preview_url, 'file': str(file_path)})
            print(f"    -> {preview_url}")

        except Exception as ex:
            print(f"    ERROR: {ex}")
            import traceback
            traceback.print_exc()

    # Summary
    print("\n" + "=" * 70)
    print(f"GENERATED {len(generated)} PREMIUM PREVIEW SITES")
    print("=" * 70)
    for site in generated:
        print(f"  {site['company']}: {site['url']}")
    print()


if __name__ == "__main__":
    main()
