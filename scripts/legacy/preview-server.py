#!/usr/bin/env python3
"""
Local Preview Server
Serves generated preview sites for testing before deployment.

Usage:
    python preview-server.py

Then visit: http://localhost:8000/preview-site-slug
"""

import http.server
import socketserver
from pathlib import Path

# Preview sites directory
PREVIEW_DIR = Path(__file__).parent.parent / "website" / "previews"
PORT = 8000


class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve from previews directory"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PREVIEW_DIR), **kwargs)

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()


def main():
    """Start local preview server"""

    if not PREVIEW_DIR.exists():
        print(f"❌ Preview directory not found: {PREVIEW_DIR}")
        print("Run generate-preview-sites.py first to create preview sites")
        return

    # Count preview sites
    sites = [d for d in PREVIEW_DIR.iterdir() if d.is_dir()]

    print("\n" + "="*70)
    print("🌐 LOCAL PREVIEW SERVER")
    print("="*70)
    print(f"Serving from: {PREVIEW_DIR}")
    print(f"Preview sites: {len(sites)}")
    print("="*70)

    if sites:
        print("\n📋 Available preview sites:\n")
        for site in sorted(sites):
            print(f"   http://localhost:{PORT}/{site.name}")
        print()

    print("="*70)
    print(f"Server running at: http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    print("="*70 + "\n")

    try:
        with socketserver.TCPServer(("", PORT), PreviewHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped")


if __name__ == "__main__":
    main()
