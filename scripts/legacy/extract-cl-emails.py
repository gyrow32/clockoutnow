"""
Extract Craigslist anonymous reply emails from all leads
"""
import pandas as pd
import re
from urllib.parse import urlparse, parse_qs
import requests
from bs4 import BeautifulSoup
import time

def extract_cl_email_from_url(url):
    """Extract anonymous Craigslist email from a CL ad URL"""
    try:
        print(f"  Fetching: {url}")

        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Look for the email pattern in mailto links
        mailto_links = soup.find_all('a', href=re.compile(r'mailto:.*@serv\.craigslist\.org'))

        if mailto_links:
            # Extract email from mailto: link
            mailto_href = mailto_links[0]['href']
            email_match = re.search(r'mailto:([a-f0-9]+@serv\.craigslist\.org)', mailto_href)
            if email_match:
                email = email_match.group(1)
                print(f"  + Found: {email}")
                return email

        # Alternative: look for email in page text
        email_pattern = r'([a-f0-9]{32}@serv\.craigslist\.org)'
        email_match = re.search(email_pattern, response.text)
        if email_match:
            email = email_match.group(1)
            print(f"  + Found: {email}")
            return email

        print("  - No email found")
        return None

    except Exception as e:
        print(f"  - Error: {e}")
        return None

def main():
    # Read Excel file
    df = pd.read_excel('chrissy-cl-leads.xlsx')

    print(f"\nExtracting Craigslist emails for {len(df)} leads...\n")

    # Track results
    found_count = 0

    # Process each lead
    for idx, row in df.iterrows():
        company = row['Company Name']
        cl_url = row['Craigslist URL']

        if pd.isna(cl_url):
            print(f"{idx + 1}. {company}: No Craigslist URL")
            continue

        print(f"{idx + 1}. {company}")

        # Extract email
        email = extract_cl_email_from_url(cl_url)

        if email:
            # Update Email column
            df.at[idx, 'Email'] = email
            found_count += 1

        # Be nice to Craigslist - add delay
        time.sleep(2)

    # Save updated Excel
    df.to_excel('chrissy-cl-leads.xlsx', index=False)

    print(f"\nDone! Found {found_count}/{len(df)} emails")
    print(f"Updated: chrissy-cl-leads.xlsx")

if __name__ == '__main__':
    main()
