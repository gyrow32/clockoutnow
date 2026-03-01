"""
Proper Google Imagen API setup for generating business images
Using Vertex AI Imagen
"""
import os
import requests
import json
import base64
from pathlib import Path
from dotenv import load_dotenv

load_dotenv('website/.env')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
IMAGES_DIR = Path('website/public/preview-images')

def test_gemini_api_access():
    """Test what the API key has access to"""
    print("Testing Gemini API access...")
    print(f"API Key: {GEMINI_API_KEY[:20]}...\n")

    # Try Gemini API endpoints
    endpoints_to_test = [
        {
            'name': 'Gemini Pro (Text)',
            'url': f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}',
            'method': 'POST',
            'data': {
                "contents": [{"parts": [{"text": "Test"}]}]
            }
        },
        {
            'name': 'List Models',
            'url': f'https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}',
            'method': 'GET',
            'data': None
        }
    ]

    results = {}
    for endpoint in endpoints_to_test:
        try:
            print(f"Testing {endpoint['name']}...")
            if endpoint['method'] == 'POST':
                response = requests.post(
                    endpoint['url'],
                    json=endpoint['data'],
                    timeout=10
                )
            else:
                response = requests.get(endpoint['url'], timeout=10)

            print(f"  Status: {response.status_code}")
            if response.status_code == 200:
                print(f"  + Access confirmed")
                results[endpoint['name']] = True
                # Print available models
                if 'models' in response.json():
                    models = response.json()['models']
                    print(f"  Available models: {len(models)}")
                    for model in models[:3]:
                        print(f"    - {model.get('name', 'Unknown')}")
            else:
                print(f"  - Error: {response.text[:200]}")
                results[endpoint['name']] = False
            print()

        except Exception as e:
            print(f"  - Error: {e}\n")
            results[endpoint['name']] = False

    return results

def generate_image_with_imagen(prompt, output_filename):
    """
    Generate image using Imagen API
    Note: Imagen 2 is available through Google AI Studio API
    """
    print(f"Generating image with Imagen...")
    print(f"Prompt: {prompt}")

    # Imagen 2 endpoint (if available via the API key)
    # Note: You may need to enable Imagen in Google Cloud Console
    url = f'https://generativelanguage.googleapis.com/v1beta/models/imagen-2.0:generate?key={GEMINI_API_KEY}'

    try:
        response = requests.post(
            url,
            json={
                "prompt": prompt,
                "number_of_images": 1,
                "aspect_ratio": "16:9",
                "safety_filter_level": "block_some",
                "person_generation": "allow_adult"
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            # Extract and save image
            if 'images' in result and len(result['images']) > 0:
                image_data = result['images'][0].get('image_data')
                if image_data:
                    # Decode base64 image
                    image_bytes = base64.b64decode(image_data)

                    output_path = IMAGES_DIR / output_filename
                    with open(output_path, 'wb') as f:
                        f.write(image_bytes)

                    print(f"  + Image saved: {output_path}\n")
                    return str(output_path)
        else:
            print(f"  - Error {response.status_code}: {response.text[:500]}\n")
            return None

    except Exception as e:
        print(f"  - Error: {e}\n")
        return None

def main():
    print("="*60)
    print("Google Imagen API Setup & Testing")
    print("="*60 + "\n")

    # Test API access
    results = test_gemini_api_access()

    print("\n" + "="*60)
    print("Summary")
    print("="*60)
    for endpoint, success in results.items():
        status = "+ Working" if success else "- Not Available"
        print(f"{endpoint}: {status}")

    print("\n")
    if not any(results.values()):
        print("! API key doesn't have access to tested endpoints")
        print("Next steps:")
        print("1. Enable Gemini API in Google Cloud Console")
        print("2. Enable Imagen API (if needed)")
        print("3. Ensure API key has proper permissions")
    else:
        print("+ API key is working! Testing image generation...")
        # Test image generation
        test_prompt = "Professional handyman working on home repairs, toolbelt, ladder, residential setting, clean professional photo"
        generate_image_with_imagen(test_prompt, "test-image.jpg")

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY not found in website/.env")
        exit(1)

    main()
