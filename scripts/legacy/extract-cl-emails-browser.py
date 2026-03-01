"""
Extract Craigslist anonymous emails using browser automation
Uses Claude's Chrome browser tools to click reply buttons and extract emails
"""
import pandas as pd
import json
import time

def create_extraction_prompts():
    """Create a list of extraction tasks for the agent"""
    # Read Excel file
    df = pd.read_excel('chrissy-cl-leads.xlsx')

    tasks = []
    for idx, row in df.iterrows():
        if pd.notna(row['Craigslist URL']):
            tasks.append({
                'id': int(row['No.']),
                'company': row['Company Name'],
                'url': row['Craigslist URL'],
                'index': idx
            })

    # Save tasks to JSON for processing
    with open('scripts/cl-email-tasks.json', 'w') as f:
        json.dump(tasks, f, indent=2)

    print(f"Created {len(tasks)} extraction tasks")
    print("Tasks saved to: scripts/cl-email-tasks.json")
    print("\nNext: Use browser automation to process these tasks")

    return tasks

if __name__ == '__main__':
    create_extraction_prompts()
