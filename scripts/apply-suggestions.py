"""
apply-suggestions.py

Fetches editorial suggestions from Formspree API, applies them to the CSVs,
and logs every change with IP + timestamp for the audit trail.

Usage:
    python scripts/apply-suggestions.py

Required env vars (or edit the CONFIG block below):
    FORMSPREE_API_KEY   — your Formspree API key (account settings)
    FORMSPREE_FORM_ID   — the form ID (e.g. xpzgkqrb)
"""

import csv
import json
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

import urllib.request
import urllib.error

# ── CONFIG ────────────────────────────────────────────────────────────
FORMSPREE_API_KEY = os.environ.get('FORMSPREE_API_KEY', 'YOUR_API_KEY')
FORMSPREE_FORM_ID = os.environ.get('FORMSPREE_FORM_ID', 'YOUR_FORM_ID')

ARTIST_CSV   = Path('public/data/artist-editorial.csv')
ALBUM_CSV    = Path('public/data/album-editorial.csv')
LOG_CSV      = Path('data/editorial-suggestions-log.csv')
BACKUPS_DIR  = Path('data/backups')
STATE_FILE   = Path('data/apply-suggestions-state.json')

LOG_FIELDS = [
    'applied_at', 'formspree_id', 'submission_at', 'ip',
    'artist_name', 'album_title', 'field',
    'old_value', 'new_value',
]

# ── Helpers ───────────────────────────────────────────────────────────

def api_get(path):
    url = f'https://formspree.io/api/0{path}'
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {FORMSPREE_API_KEY}',
        'Accept': 'application/json',
    })
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {'processed_ids': []}

def save_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2))

def backup_csvs():
    stamp = datetime.now(timezone.utc).strftime('%Y-%m-%d_%H%M%S')
    dest = BACKUPS_DIR / stamp
    dest.mkdir(parents=True, exist_ok=True)
    shutil.copy(ARTIST_CSV, dest / 'artist-editorial.csv')
    shutil.copy(ALBUM_CSV,  dest / 'album-editorial.csv')
    print(f'  Backed up CSVs → {dest}')

def read_csv(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f)), None

def read_csv_with_fields(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        return rows, reader.fieldnames

def write_csv(path, rows, fieldnames):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

def append_log(entry):
    LOG_CSV.parent.mkdir(parents=True, exist_ok=True)
    exists = LOG_CSV.exists()
    with open(LOG_CSV, 'a', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=LOG_FIELDS)
        if not exists:
            writer.writeheader()
        writer.writerow(entry)

# ── Apply logic ───────────────────────────────────────────────────────

def apply_artist(rows, fieldnames, artist_name, field, new_value):
    name_lower = artist_name.lower()
    for row in rows:
        if row['name'].lower() == name_lower:
            old = row.get(field, '')
            row[field] = new_value
            return old, True
    return None, False

def apply_album(rows, fieldnames, artist_name, album_title, field, new_value):
    a_lower = artist_name.lower()
    t_lower = album_title.lower()
    for row in rows:
        if row['artist_name'].lower() == a_lower and row['album_title'].lower() == t_lower:
            old = row.get(field, '')
            row[field] = new_value
            return old, True
    return None, False

# ── Main ──────────────────────────────────────────────────────────────

def main():
    print('Fetching submissions from Formspree...')
    try:
        data = api_get(f'/forms/{FORMSPREE_FORM_ID}/submissions')
    except urllib.error.HTTPError as e:
        print(f'  API error: {e.code} {e.reason}')
        sys.exit(1)

    submissions = data.get('submissions', [])
    print(f'  {len(submissions)} total submissions')

    state = load_state()
    processed = set(state['processed_ids'])
    new_subs = [s for s in submissions if s['id'] not in processed]
    print(f'  {len(new_subs)} new to process')

    if not new_subs:
        print('Nothing to do.')
        return

    backup_csvs()

    artist_rows, artist_fields = read_csv_with_fields(ARTIST_CSV)
    album_rows, album_fields   = read_csv_with_fields(ALBUM_CSV)
    applied = 0

    for sub in new_subs:
        sid    = sub['id']
        s_at   = sub.get('_date', '')
        ip     = sub.get('_ip', '')
        body   = sub.get('data', sub)  # Formspree wraps fields in 'data' on some endpoints

        artist_name    = (body.get('artist_name') or sub.get('artist_name', '')).strip()
        album_title    = (body.get('album_title') or sub.get('album_title', '')).strip()
        field          = (body.get('field') or sub.get('field', 'description')).strip()
        old_value      = (body.get('old_value') or sub.get('old_value', '')).strip()
        suggested      = (body.get('suggested_value') or sub.get('suggested_value', '')).strip()

        if not artist_name or not suggested:
            print(f'  [{sid}] Skipping — missing artist_name or suggested_value')
            processed.add(sid)
            continue

        if album_title:
            # Album edit
            old, ok = apply_album(album_rows, album_fields, artist_name, album_title, field, suggested)
            target = f'{artist_name} / {album_title}'
        else:
            # Artist edit
            old, ok = apply_artist(artist_rows, artist_fields, artist_name, field, suggested)
            target = artist_name

        if ok:
            applied += 1
            print(f'  [{sid}] Applied — {target} [{field}]')
            append_log({
                'applied_at':    datetime.now(timezone.utc).isoformat(),
                'formspree_id':  sid,
                'submission_at': s_at,
                'ip':            ip,
                'artist_name':   artist_name,
                'album_title':   album_title,
                'field':         field,
                'old_value':     old or old_value,
                'new_value':     suggested,
            })
        else:
            print(f'  [{sid}] No match — {target}')

        processed.add(sid)

    if applied:
        write_csv(ARTIST_CSV, artist_rows, artist_fields)
        write_csv(ALBUM_CSV,  album_rows,  album_fields)
        print(f'\nWrote {applied} change(s) to CSV files.')
        print('Review with: git diff public/data/')
        print('Commit with: git add public/data/ && git commit -m "Apply editorial suggestions from site"')
    else:
        print('\nNo changes applied.')

    save_state({'processed_ids': list(processed)})

if __name__ == '__main__':
    main()
