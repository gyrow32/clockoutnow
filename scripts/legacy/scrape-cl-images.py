"""
Scrape images from Craigslist ads and save them for preview pages
"""
import sqlite3
import requests
from bs4 import BeautifulSoup
import os
from pathlib import Path
from urllib.parse import urljoin
import time

# Output directory for images
IMAGES_DIR = Path('website/public/preview-images')
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def scrape_images_from_cl_ad(url, lead_id, company_slug):
    """Extract all images from a Craigslist ad"""
    try:
        print(f"Fetching images from: {url}")

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all images in the posting
        images = []

        # Look for main image gallery
        gallery_images = soup.select('.gallery img, .slide img, .iw img')
        for img in gallery_images:
            img_url = img.get('src')
            if img_url and 'images.craigslist.org' in img_url:
                # Get full-size version (replace thumbnail indicators)
                img_url = img_url.replace('50x50c', '600x450').replace('300x300', '600x450')
                images.append(img_url)

        # Also check for thumbnail links that point to full images
        thumb_links = soup.select('a[href*="images.craigslist.org"]')
        for link in thumb_links:
            img_url = link.get('href')
            if img_url and img_url not in images:
                images.append(img_url)

        print(f"  Found {len(images)} images")

        # Download images
        downloaded = []
        for idx, img_url in enumerate(images[:5]):  # Max 5 images per ad
            try:
                print(f"  Downloading image {idx + 1}...")
                img_response = requests.get(img_url, headers=headers, timeout=10)
                img_response.raise_for_status()

                # Save image
                filename = f"{company_slug}-{idx + 1}.jpg"
                filepath = IMAGES_DIR / filename

                with open(filepath, 'wb') as f:
                    f.write(img_response.content)

                downloaded.append(str(filepath))
                print(f"    Saved: {filename}")

                time.sleep(0.5)  # Be nice to Craigslist

            except Exception as e:
                print(f"    Error downloading image {idx + 1}: {e}")

        return downloaded

    except Exception as e:
        print(f"  Error scraping images: {e}")
        return []

def main():
    # Get leads with CL URLs
    conn = sqlite3.connect('leads.db')
    leads = conn.execute('''
        SELECT id, company_name, cl_url, cl_email
        FROM leads
        WHERE cl_url IS NOT NULL
        AND cl_email IS NOT NULL
        AND cl_email NOT LIKE '%ERROR%'
        AND cl_email NOT LIKE '%PHONE_ONLY%'
        ORDER BY id
    ''').fetchall()

    print(f"Scraping images for {len(leads)} leads...\n")

    for lead_id, company, cl_url, cl_email in leads:
        print(f"{lead_id}. {company}")

        # Generate slug for filenames
        slug = company.lower().replace("'", "").replace(" ", "-").replace("(", "").replace(")", "").replace("/", "-")
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')[:50]

        # Scrape images
        images = scrape_images_from_cl_ad(cl_url, lead_id, slug)

        # Update database with image paths
        if images:
            cursor = conn.cursor()
            for img_path in images:
                cursor.execute('''
                    INSERT INTO images (lead_id, image_path, image_prompt, generated_at)
                    VALUES (?, ?, ?, datetime('now'))
                ''', (lead_id, img_path, 'Scraped from Craigslist ad'))
            conn.commit()
            print(f"  Saved {len(images)} images to database\n")
        else:
            print(f"  No images found\n")

        time.sleep(2)  # Delay between ads

    conn.close()
    print(f"\nDone! Images saved to: {IMAGES_DIR}")

if __name__ == '__main__':
    main()
