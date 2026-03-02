# CL Outreach Tracker

## Email Template (used by send-outreach.py)

Subject: Built something for [BUSINESS NAME]

Hey [NAME],

My name's Mike, I run a small web and AI shop called ClockOutNow out of
Lancaster. We build websites and AI tools for local service businesses
in the Buffalo area.

I put together a quick preview of what a professional site could look
like for [BUSINESS]:

https://clockoutnow.com/preview/[SLUG]

Take a look — it's yours to keep either way. If you want to see what
our AI can do, give us a ring at (607) 225-3400 — that's our AI
assistant and it picks up 24/7.

You can check out more of our work at https://clockoutnow.com

Happy to jump on a quick call if you're interested.

Mike
ClockOutNow | Lancaster, NY
(607) 225-3400

---
To stop receiving these emails, reply "unsubscribe" and we'll remove
you immediately.

### Email Rules
- Never mention how we found them (no "saw your ad", no "Craigslist")
- No pricing in first email — first several users are free for social proof
- Sign as just "Mike" — personal, not "Mike & Team"
- Always include: preview link, clockoutnow.com link, voice agent CTA
- From address: gyrow32@gmail.com (personal Gmail — better deliverability)

## Rules
- Max 3 pitches per day (avoid flagging)
- Send from gyrow32@gmail.com (personal Gmail for deliverability, not hello@clockoutnow.com)
- Preview page MUST exist and be deployed BEFORE sending
- Log every outreach below with date, status, and follow-up plan
- Follow up once after 3 days if no response, then move on
- Use send-outreach.py with --dry-run FIRST, review, then send for real

## Send Command
```bash
python scripts/send-outreach.py <slug> --email <addr> --name <name> --business "<biz>" --dry-run
python scripts/send-outreach.py <slug> --email <addr> --name <name> --business "<biz>"
```

## Outreach Log

| Date | Business | Contact | Trade | Has Site? | Template | Demo URL | Status | Notes |
|------|----------|---------|-------|-----------|----------|----------|--------|-------|
| 2026-02-16 | Gagan's Plumbing & Remodel | Gagan | Plumbing/Bath | No | B | /preview/gagan-plumbing | READY | CL post 7915381209, Grand Island |
| 2026-02-16 | Matt's Cleanouts & Handyman | Matt | Handyman | No | A | /preview/matts-cleanouts | READY | CL post 7915449911, Lockport |
| 2026-02-16 | Cleaning by Nat | Natalie Mac | Cleaning | No | C | /preview/cleaning-by-nat | READY | CL post 7914169200, Lockport, has CL email relay, 6+ yrs exp |
| 2026-02-16 | Dayton's Roofing and Remodeling | Jacob Dayton | Roofing/Remodel | No | A | /preview/daytons-roofing | READY | CL post 7914740575, Clarence, licensed/insured, has CL email relay |
| 2026-02-16 | Buffalo HVAC & Heating Services | Unknown | HVAC | No | B | /preview/buffalo-hvac | READY | CL post 7914290759, Buffalo, 24/7 service, has CL email relay, (716) 330-3146 |
| 2026-02-16 | Zach's Garage Door Service | Zach Bohlman | Garage Doors | No | B | /preview/zachs-garage | READY | CL post 7914286253, Lockport, 25 yrs exp, owner/operator, has CL email relay, (716) 438-6805 |
| 2026-02-16 | Reliable Home & Airbnb Cleaning | Aquan Payne | Cleaning | No | C | /preview/reliable-cleaning | READY | CL post 7914072229, Buffalo, homes/apartments/Airbnb, has CL email relay, (716) 578-1596 |
| 2026-02-16 | Heating & Cooling (Eden) | Mike | HVAC | No | A | /preview/eden-hvac | READY | CL post 7914005311, Eden/WNY, EPA licensed, full HVAC, has CL email relay, (716) 466-1000 |
| 2026-02-17 | MCH Flooring | Unknown | Flooring | No | B | /preview/mch-flooring | READY | CL post 7914985726, Lockport/Buffalo, 35 yrs exp, has CL email relay (70d9145bac6a370a91b7b4f80c503944@serv.craigslist.org), (716) 946-5529 |
| 2026-02-17 | Marshall's Carpet/Flooring | Marshall | Flooring/Carpet | No | C | /preview/marshalls-carpet | READY | CL post 7914556310, WNY Buffalo, 17+ yrs, licensed/insured, looking to expand, has CL reply, (716) 462-2746 |
| 2026-02-17 | Landlord Turnovers | Unknown | Painting/Drywall | No | A | /preview/landlord-turnovers | READY | CL post 7914784065, Buffalo, specializes in rental turnover painting/drywall, has CL reply, (716) 808-2801 |
| 2026-02-17 | 🔥The Roofing Guy🔥 | Unknown | Roofing | No | B | /preview/the-roofing-guy | READY | CL post 7915736548, Buffalo/Chaffee, licensed/insured, residential metal+asphalt roofs, has permits, no phone listed |
| 2026-02-17 | Gary's Electrical (Residential) | Gary | Electrical | No | C | /preview/garys-electrical | READY | CL post 7915532575, Middleport/All WNY, licensed master electrician, owner/operator, decades exp, lifetime guarantee, (716) 352-0301 |
| 2026-02-17 | Positive Home Planning | Unknown | Cleaning | No | A | /preview/positive-home-planning | READY | CL post 7915497720, Lancaster NY, 15+ yrs, independently owned/insured, residential cleaning, non-medical assisted living, serves Lancaster/Alden/Depew/Elma area |
