"""
Generate images for businesses without CL photos using Gemini/Imagen API
"""
import os
import requests
import sqlite3
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('website/.env')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
IMAGES_DIR = Path('website/public/preview-images')

def generate_image_with_gemini(prompt, output_filename):
    """
    Generate image using Google's Imagen API (via Gemini key)
    Note: This uses Vertex AI Imagen - you may need to enable it in Google Cloud
    """
    print(f"Generating image: {output_filename}")
    print(f"Prompt: {prompt}")

    # For now, using Unsplash as fallback since Imagen requires Vertex AI setup
    # You can replace this with actual Imagen API call once Vertex AI is configured

    # Fallback: Get relevant stock photo from Unsplash
    try:
        # Map business type to Unsplash search term
        if "handyman" in prompt.lower():
            search_term = "handyman tools home repair"
        elif "roofing" in prompt.lower():
            search_term = "roofing contractor residential"
        else:
            search_term = "contractor home improvement"

        # Unsplash API (no key needed for basic use)
        url = f"https://source.unsplash.com/800x600/?{search_term}"

        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            output_path = IMAGES_DIR / output_filename
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"  Saved: {output_path}\n")
            return str(output_path)
        else:
            print(f"  Failed to get image\n")
            return None

    except Exception as e:
        print(f"  Error: {e}\n")
        return None

def main():
    conn = sqlite3.connect('leads.db')

    # Find leads without images
    leads_without_images = conn.execute('''
        SELECT l.id, l.company_name, l.industry
        FROM leads l
        WHERE l.cl_email IS NOT NULL
        AND l.cl_email NOT LIKE '%ERROR%'
        AND l.cl_email NOT LIKE '%PHONE_ONLY%'
        AND l.id NOT IN (SELECT DISTINCT lead_id FROM images WHERE image_path IS NOT NULL)
        ORDER BY l.id
    ''').fetchall()

    print(f"Generating images for {len(leads_without_images)} businesses...\n")

    for lead_id, company, industry in leads_without_images:
        print(f"{lead_id}. {company} ({industry})")

        # Generate slug
        slug = company.lower().replace("'", "").replace(" ", "-").replace("(", "").replace(")", "")
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')[:50]

        # Create prompt
        prompt = f"Professional {industry} contractor working on residential project, modern tools, clean photo style"

        # Generate image
        filename = f"{slug}-1.jpg"
        image_path = generate_image_with_gemini(prompt, filename)

        if image_path:
            # Save to database
            conn.execute('''
                INSERT INTO images (lead_id, image_path, image_prompt, generated_at)
                VALUES (?, ?, ?, datetime('now'))
            ''', (lead_id, image_path, prompt))
            conn.commit()

    conn.close()
    print("Done!")

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not found")
        print("Using Unsplash fallback for images\n")

    main()
