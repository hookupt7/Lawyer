#!/usr/bin/env python3
"""Audit every public page for contrast, tap targets, alt text, headings and
horizontal overflow. Drives the in-app browser through minis-browser-use.
Needs the dev server on :3000."""
import json
import subprocess
import time
import sys
from pathlib import Path

ROOT = Path('/var/minis/workspace/lawyer')
AUDIT = (ROOT / 'tools' / 'page-audit.js').read_text()
SCRIPT = AUDIT + "\n;return JSON.stringify(window.pageAudit());\n"
TMP = Path('/tmp/_pageaudit.js')
TMP.write_text(SCRIPT)

PAGES = [
    '/home', '/practice-areas', '/attorneys', '/pricing', '/book', '/contact',
    '/faq', '/cyber-law-center', '/outcomes', '/coverage', '/disclaimer',
    '/privacy', '/practice-areas/family', '/practice-areas/cyber',
    '/practice-areas/survivor', '/practice-areas/criminal',
    '/practice-areas/business', '/practice-areas/immigration',
]

def run(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=180).stdout

totals = {'pages': 0, 'fails': 0, 'overflow': 0, 'noalt': 0, 'small': 0, 'badh1': 0}
report = []

for page in PAGES:
    run(f'minis-browser-use navigate --url "http://localhost:3000{page}"')
    time.sleep(1.2)
    payload = json.dumps({'action': 'execute_js', 'script': SCRIPT})
    Path('/tmp/_pa_payload.json').write_text(payload)
    out = run('minis-browser-use --json "$(cat /tmp/_pa_payload.json)"')
    try:
        env = json.loads(out)
        inner = env.get('data', {}).get('text', '')
        inner = inner.split('\n  tab_id')[0].strip()
        d = json.loads(inner)
    except Exception as e:
        print(f'!! {page}: could not parse audit output ({e})')
        continue
    totals['pages'] += 1
    totals['fails'] += d.get('failCount', 0)
    if d.get('overflow'):
        totals['overflow'] += 1
    totals['noalt'] += d.get('imgNoAlt', 0)
    totals['small'] += len(d.get('smallTargets', []))
    if d.get('h1', 1) != 1:
        totals['badh1'] += 1
    flag = 'OK ' if d.get('failCount', 0) == 0 and not d.get('overflow') else 'FAIL'
    print(f'{flag} {page:<32} contrast-checked={d.get("checked"):>4} fails={d.get("failCount"):>3} overflow={bool(d.get("overflow"))} noAlt={d.get("imgNoAlt")} h1={d.get("h1")}')
    for f in d.get('fails', []):
        print(f'        {f["r"]:>5}:1 need {f["need"]}  {f["fs"]}px  {f["t"]!r}  [{f["cls"]}]')
    for s in d.get('smallTargets', []):
        print(f'        small target h={s["h"]} {s["t"]!r} [{s["cls"]}]')
    report.append({'page': page, **d})

print()
print('TOTALS', json.dumps(totals))
Path('/var/minis/workspace/lawyer/tools/audit-report.json').write_text(json.dumps(report, indent=1))
