"""
Generate unique hero images for each business using Gemini API
"""
import os
import sqlite3
import requests
import json
from datetime import datetime
from pathlib import Path

# Load Gemini API key from .env
from dotenv import load_dotenv
load_dotenv('website/.env')

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
IMAGES_DIR = Path('website/public/preview-images')
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def get_image_prompt_for_business(company_name, industry, services):
    """Generate a detailed image prompt based on business type"""

    # Map industry to visual style
    prompts = {
        'Handyman': f"Professional handyman working on home repairs, toolbelt, ladder, residential setting, clean professional photo style, bright natural lighting, {company_name}",
        'HVAC': f"HVAC technician working on modern heating and cooling system, professional uniform, technical equipment, residential setting, clean professional photo style, {company_name}",
        'Plumbing': f"Professional plumber working on modern plumbing installation, clean workspace, professional tools, residential bathroom or kitchen setting, bright natural lighting, {company_name}",
        'Roofing': f"Professional roofer working on residential roof, safety equipment, suburban house, blue sky, professional photo style, {company_name}",
        'Electrical': f"Licensed electrician working on electrical panel upgrade, modern electrical equipment, professional tools, safety gear, residential setting, clean professional photo, {company_name}",
        'Paving': f"Professional paving contractor, freshly paved driveway, modern equipment, residential property, clean professional photo style, {company_name}",
        'Garage Doors': f"Professional garage door technician, modern garage door installation, residential home, professional tools, clean photo style, {company_name}",
        'Landscaping': f"Professional landscaper, beautiful residential yard, lawn maintenance equipment, green grass, professional photo style, {company_name}",
        'General Contractor': f"Professional general contractor on residential construction site, modern tools, building materials, professional uniform, clean photo style, {company_name}",
    }

    # Find matching industry
    for key, prompt in prompts.items():
        if key.lower() in industry.lower():
            return prompt

    # Default prompt
    return f"Professional contractor working on residential property, modern equipment, clean professional photo style, suburban home, bright natural lighting, {company_name}"

def generate_image_with_gemini(prompt, output_path):
    """
    Generate image using Gemini API
    Note: As of now, Gemini primarily does text. For actual image generation,
    you'd use Imagen API or similar. This is a placeholder structure.
    """
    # TODO: Replace with actual Imagen/image generation API call
    # For now, we'll use a placeholder approach

    print(f"  Would generate image with prompt: {prompt[:100]}...")
    print(f"  Output path: {output_path}")

    # Placeholder: In production, you'd call the actual image generation API here
    # Example structure:
    # response = requests.post(
    #     f'https://generativelanguage.googleapis.com/v1/models/imagen:predict',
    #     headers={'Authorization': f'Bearer {GEMINI_API_KEY}'},
    #     json={'prompt': prompt, 'num_images': 1}
    # )

    return True  # Placeholder success

def generate_images_for_all_leads():
    """Generate images for all leads in database"""
    conn = sqlite3.connect('leads.db')
    cursor = conn.cursor()

    leads = cursor.execute('''
        SELECT id, company_name, industry, cl_url
        FROM leads
        WHERE cl_url IS NOT NULL
    ''').fetchall()

    print(f"Generating images for {len(leads)} businesses...\n")

    for lead_id, company, industry, cl_url in leads:
        print(f"{lead_id}. {company} ({industry})")

        # Generate prompt
        prompt = get_image_prompt_for_business(company, industry, "")

        # Output filename
        slug = company.lower().replace("'", "").replace(" ", "-").replace("/", "-")
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        image_filename = f"{slug}-hero.jpg"
        image_path = IMAGES_DIR / image_filename

        # Generate image
        success = generate_image_with_gemini(prompt, image_path)

        if success:
            # Save to database
            cursor.execute('''
                INSERT INTO images (lead_id, image_prompt, image_path, generated_at)
                VALUES (?, ?, ?, ?)
            ''', (lead_id, prompt, str(image_path), datetime.now().isoformat()))
            print(f"  ✓ Image generated: {image_filename}\n")
        else:
            print(f"  ✗ Failed to generate image\n")

    conn.commit()
    conn.close()
    print(f"\nDone! Images saved to: {IMAGES_DIR}")

if __name__ == '__main__':
    print("Gemini Image Generation System")
    print("=" * 50)
    print(f"API Key: {GEMINI_API_KEY[:20]}..." if GEMINI_API_KEY else "API Key: NOT FOUND")
    print(f"Output directory: {IMAGES_DIR}\n")

    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY not found in website/.env")
        exit(1)

    generate_images_for_all_leads()
