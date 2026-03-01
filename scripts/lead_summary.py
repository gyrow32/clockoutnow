"""Quick summary of leads-auto.json"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import json
from pathlib import Path

repo_root = Path(__file__).resolve().parents[1]
leads_path = repo_root / "data" / "leads-auto.json"

with leads_path.open('r', encoding='utf-8') as f:
    leads = json.load(f)

hot = [l for l in leads if l.get('score', 0) >= 8]
warm = [l for l in leads if 6 <= l.get('score', 0) < 8]
with_phone = [l for l in leads if l.get('phone')]
no_site = [l for l in leads if not l.get('website')]

markets = {}
for l in leads:
    m = l['market']
    markets[m] = markets.get(m, 0) + 1

print(f'TOTAL LEADS: {len(leads)}')
print(f'HOT (8+): {len(hot)}')
print(f'WARM (6-7): {len(warm)}')
print(f'With phone: {len(with_phone)}')
print(f'No website: {len(no_site)}')
print()
print('BY MARKET:')
for m, c in sorted(markets.items(), key=lambda x: -x[1]):
    h = len([l for l in hot if l['market'] == m])
    print(f'  {m}: {c} total, {h} hot')

print()
print('TOP 10 HOT LEADS:')
hot.sort(key=lambda x: -x.get('score', 0))
for i, l in enumerate(hot[:10], 1):
    phone = l.get('phone', 'no phone')
    inds = ', '.join(l.get('indicators', []))
    print(f"  {i}. [{l['score']}] {l['title'][:50]} | {l['market']} | {phone} | {inds}")
