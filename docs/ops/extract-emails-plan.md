# Extract CL Emails - Browser Automation Plan

## Problem
Craigslist anonymous emails are only revealed AFTER clicking the "reply" button. They're not in the static HTML - generated dynamically with JavaScript.

## Solution
Use Chrome browser automation to:
1. Loop through all 20 Craigslist URLs
2. Click reply button on each
3. Click email option
4. Extract the `xxxxx@serv.craigslist.org` email
5. Update Excel spreadsheet

## Alternative (Easier)
Instead of extracting emails, we can:
1. Use the **Gmail "Send As" feature** with the Comms .env credentials
2. Send emails directly via **mailto: links** from each CL ad
3. OR use Craigslist's web reply form (no email extraction needed)

## Recommendation
**Option 2 (mailto links)** is faster:
- Each CL ad has a mailto: link that opens with the anonymous email pre-filled
- We can construct these links programmatically
- Send via Gmail SMTP using the credentials in .env

Let's build a script that:
1. Constructs mailto: links for each CL ad
2. Sends emails via Gmail SMTP
3. Includes personalized demo links
