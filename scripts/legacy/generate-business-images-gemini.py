"""
Generate professional business images using Gemini Image Generation
"""
import os
import requests
import json
import base64
import sqlite3
from pathlib import Path
from dotenv import load_dotenv
import time

load_dotenv('website/.env')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
IMAGES_DIR = Path('website/public/preview-images')
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def generate_image_gemini(prompt, output_filename):
    """Generate image using Imagen 4.0 Ultra"""
    print(f"Generating: {output_filename}")
    print(f"Prompt: {prompt[:80]}...")

    # Use Imagen 4.0 Ultra with predict method
    url = f'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key={GEMINI_API_KEY}'

    payload = {
        "instances": [{
            "prompt": prompt
        }],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "16:9",
            "safetyFilterLevel": "block_some",
            "personGeneration": "allow_adult"
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=60)

        if response.status_code == 200:
            result = response.json()

            # Extract image from predictions
            if 'predictions' in result and len(result['predictions']) > 0:
                prediction = result['predictions'][0]

                if 'bytesBase64Encoded' in prediction:
                    # Decode base64 image
                    image_data = prediction['bytesBase64Encoded']
                    image_bytes = base64.b64decode(image_data)

                    output_path = IMAGES_DIR / output_filename
                    with open(output_path, 'wb') as f:
                        f.write(image_bytes)

                    file_size = len(image_bytes) / 1024  # KB
                    print(f"  + Saved: {output_path} ({file_size:.1f} KB)")
                    return str(output_path)

            print(f"  - No image data in response")
            print(f"  Response: {json.dumps(result, indent=2)[:500]}")
            return None

        else:
            print(f"  - Error {response.status_code}")
            print(f"  {response.text[:500]}")
            return None

    except Exception as e:
        print(f"  - Exception: {e}")
        return None

def create_prompt_for_business(company_name, industry, style="professional photo"):
    """Create detailed, professional prompt for business image"""

    prompts = {
        "Handyman": f"Professional photograph of a skilled handyman contractor working on a residential home repair project. Show toolbelt with professional tools, ladder, clean residential interior or exterior setting. Natural lighting, sharp focus, professional craftsmanship visible. Photorealistic style, high quality, 16:9 aspect ratio.",

        "Roofing": f"Professional photograph of a roofing contractor working on a residential roof. Show safety equipment, modern roofing materials, suburban house setting, blue sky background. Professional uniform, quality craftsmanship. Photorealistic style, natural lighting, high quality, 16:9 aspect ratio.",

        "Plumbing": f"Professional photograph of a licensed plumber working on modern plumbing installation in a clean residential bathroom or kitchen. Show professional tools, clean workspace, attention to detail. Natural lighting, professional uniform, high quality photorealistic style, 16:9 aspect ratio.",

        "HVAC": f"Professional photograph of an HVAC technician working on a modern heating and cooling system. Show technical equipment, professional uniform, residential setting, clean professional workspace. Photorealistic style, natural lighting, high quality, 16:9 aspect ratio.",

        "Electrical": f"Professional photograph of a licensed electrician working on electrical panel or modern electrical installation. Show professional tools, safety equipment, clean residential setting. Technical precision, professional uniform, natural lighting, photorealistic style, 16:9 aspect ratio.",

        "General Contractor": f"Professional photograph of a general contractor on a residential construction or remodeling site. Show building materials, professional tools, clean organized workspace. Professional appearance, quality craftsmanship, natural lighting, photorealistic style, 16:9 aspect ratio.",
    }

    # Find matching industry
    for key, prompt in prompts.items():
        if key.lower() in industry.lower():
            return prompt

    # Default
    return f"Professional photograph of a {industry} contractor working on a residential project. Modern equipment, professional appearance, clean workspace, natural lighting. Photorealistic style, high quality, 16:9 aspect ratio."

def generate_images_for_leads():
    """Generate images for leads that don't have them yet"""
    conn = sqlite3.connect('leads.db')

    # Get leads without images
    leads = conn.execute('''
        SELECT l.id, l.company_name, l.industry
        FROM leads l
        WHERE l.cl_email IS NOT NULL
        AND l.cl_email NOT LIKE '%ERROR%'
        AND l.cl_email NOT LIKE '%PHONE_ONLY%'
        AND l.id NOT IN (SELECT DISTINCT lead_id FROM images WHERE image_path IS NOT NULL)
        ORDER BY l.id
    ''').fetchall()

    print(f"Generating images for {len(leads)} businesses")
    print("="*60 + "\n")

    generated = []

    for lead_id, company, industry in leads:
        print(f"\n{lead_id}. {company} ({industry})")
        print("-" * 60)

        # Create slug
        slug = company.lower().replace("'", "").replace(" ", "-").replace("(", "").replace(")", "")
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')[:50]

        # Create prompt
        prompt = create_prompt_for_business(company, industry)

        # Generate filename
        filename = f"{slug}-hero.jpg"

        # Generate image
        image_path = generate_image_gemini(prompt, filename)

        if image_path:
            # Save to database
            conn.execute('''
                INSERT INTO images (lead_id, image_path, image_prompt, generated_at)
                VALUES (?, ?, ?, datetime('now'))
            ''', (lead_id, image_path, prompt))
            conn.commit()
            generated.append((lead_id, company, filename))

        # Rate limit - be nice to the API
        time.sleep(3)

    conn.close()

    print("\n" + "="*60)
    print(f"Generation Complete: {len(generated)}/{len(leads)} images created")
    print("="*60)

    if generated:
        print("\nGenerated images:")
        for lead_id, company, filename in generated:
            print(f"  {lead_id}. {company} -> {filename}")

    print(f"\nImages saved to: {IMAGES_DIR}")
    return generated

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY not found in website/.env")
        exit(1)

    print("Gemini Image Generation")
    print("="*60)
    print(f"API Key: {GEMINI_API_KEY[:25]}...")
    print(f"Output: {IMAGES_DIR}\n")

    generate_images_for_leads()
