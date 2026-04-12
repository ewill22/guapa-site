"""
apply-suggestions.py

Reads Formspree submission emails via IMAP (using homebase gmail connection),
applies suggestions to the editorial CSVs, logs every change with metadata.

Usage:
    python scripts/apply-suggestions.py

Requires homebase to be importable (sys.path set below).
"""

import csv
import email
import html
import json
import os
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

# ── Homebase gmail connection ─────────────────────────────────────────
HOMEBASE = Path(r'C:\Users\eewil\homebase')
sys.path.insert(0, str(HOMEBASE))
from gmail import get_imap
from emailer import send_email

# ── Paths ─────────────────────────────────────────────────────────────
ARTIST_CSV  = Path('public/data/artist-editorial.csv')
ALBUM_CSV   = Path('public/data/album-editorial.csv')
LOG_CSV     = Path('data/editorial-suggestions-log.csv')
BACKUPS_DIR = Path('data/backups')
STATE_FILE  = Path('data/apply-suggestions-state.json')

LOG_FIELDS = [
    'applied_at', 'email_subject', 'submission_at', 'artist_name',
    'album_title', 'field', 'old_value', 'new_value',
]

FORMSPREE_SENDER = 'formspree'

# ── State (tracks which email UIDs we've already processed) ───────────

def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {'processed_uids': []}

def save_state(state):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))

# ── Backup ────────────────────────────────────────────────────────────

def backup_csvs():
    stamp = datetime.now(timezone.utc).strftime('%Y-%m-%d_%H%M%S')
    dest = BACKUPS_DIR / stamp
    dest.mkdir(parents=True, exist_ok=True)
    shutil.copy(ARTIST_CSV, dest / 'artist-editorial.csv')
    shutil.copy(ALBUM_CSV,  dest / 'album-editorial.csv')
    print(f'  Backed up CSVs -> {dest}')

# ── CSV helpers ───────────────────────────────────────────────────────

def read_csv_with_fields(path):
    with open(path, encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        return rows, list(reader.fieldnames or [])

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

# ── Email parsing ─────────────────────────────────────────────────────

def parse_field(body, field_name):
    """Extract a field value from Formspree plain-text email body."""
    # Normalize line endings
    body = body.replace('\r\n', '\n').replace('\r', '\n')
    # Split into double-newline chunks, find the one starting with field_name:
    chunks = re.split(r'\n{2,}', body)
    for chunk in chunks:
        lines = chunk.strip().splitlines()
        if not lines:
            continue
        if lines[0].strip().rstrip(':').lower() == field_name.lower():
            value = '\n'.join(lines[1:]).strip()
            return html.unescape(value)
    return ''

def parse_submission_email(msg):
    """Return dict of fields from a Formspree email, or None if unparseable."""
    body = ''
    for part in msg.walk():
        if part.get_content_type() == 'text/plain':
            body = part.get_payload(decode=True).decode('utf-8', errors='replace')
            break

    body = body.replace('\r\n', '\n').replace('\r', '\n')
    if 'artist_name' not in body:
        return None

    # Extract submission date from body
    date_m = re.search(r'Submitted (.+)', body)
    sub_at = date_m.group(1).strip() if date_m else msg.get('Date', '')

    return {
        'subject':        msg.get('Subject', ''),
        'submission_at':  sub_at,
        'artist_name':    parse_field(body, 'artist_name'),
        'album_title':    parse_field(body, 'album_title'),
        'field':          parse_field(body, 'field') or 'description',
        'old_value':      parse_field(body, 'old_value'),
        'suggested_value': parse_field(body, 'suggested_value'),
        'confirmed':      parse_field(body, 'confirmed'),
    }

# ── Apply logic ───────────────────────────────────────────────────────

def apply_artist(rows, artist_name, field, new_value):
    for row in rows:
        if row['name'].lower() == artist_name.lower():
            old = row.get(field, '')
            row[field] = new_value
            return old, True
    return None, False

def apply_album(rows, artist_name, album_title, field, new_value):
    for row in rows:
        if (row['artist_name'].lower() == artist_name.lower() and
                row['album_title'].lower() == album_title.lower()):
            old = row.get(field, '')
            row[field] = new_value
            return old, True
    return None, False

# ── Main ──────────────────────────────────────────────────────────────

def main():
    print('Connecting to Gmail...')
    conn = get_imap()
    conn.select('INBOX')

    _, data = conn.search(None, f'(FROM "{FORMSPREE_SENDER}")')
    all_ids = data[0].split()
    print(f'  {len(all_ids)} Formspree emails total')

    state = load_state()
    processed = set(state['processed_uids'])
    new_ids = [eid for eid in all_ids if eid.decode() not in processed]
    print(f'  {len(new_ids)} new to process')

    if not new_ids:
        print('Nothing to do.')
        conn.logout()
        return

    # Parse all new emails first, filter to actual submissions
    submissions = []
    for eid in new_ids:
        _, msg_data = conn.fetch(eid, '(RFC822)')
        msg = email.message_from_bytes(msg_data[0][1])
        parsed = parse_submission_email(msg)
        if parsed and parsed['artist_name'] and parsed['suggested_value']:
            submissions.append((eid.decode(), parsed))
        else:
            # Not a submission (e.g. verification email) — mark processed, skip
            processed.add(eid.decode())

    conn.logout()

    if not submissions:
        print('No valid submissions found.')
        save_state({'processed_uids': list(processed)})
        return

    backup_csvs()

    artist_rows, artist_fields = read_csv_with_fields(ARTIST_CSV)
    album_rows,  album_fields  = read_csv_with_fields(ALBUM_CSV)
    applied = 0

    for uid, sub in submissions:
        artist_name  = sub['artist_name']
        album_title  = sub['album_title']
        field        = sub['field']
        suggested    = sub['suggested_value']
        old_value    = sub['old_value']

        confirmed = sub.get('confirmed', '')

        if album_title:
            old, ok = apply_album(album_rows, artist_name, album_title, field, suggested)
            target = f'{artist_name} / {album_title}'
        else:
            old, ok = apply_artist(artist_rows, artist_name, field, suggested)
            target = artist_name

        # Also apply confirmed toggle if present
        if confirmed in ('yes', 'no') and not album_title:
            for row in artist_rows:
                if row['name'].lower() == artist_name.lower():
                    row['confirmed'] = confirmed
                    break

        if ok:
            applied += 1
            print(f'  Applied — {target} [{field}]')
            append_log({
                'applied_at':    datetime.now(timezone.utc).isoformat(),
                'email_subject': sub['subject'],
                'submission_at': sub['submission_at'],
                'artist_name':   artist_name,
                'album_title':   album_title,
                'field':         field,
                'old_value':     old or old_value,
                'new_value':     suggested,
            })
        else:
            print(f'  No match — {target}')

        processed.add(uid)

    if applied:
        write_csv(ARTIST_CSV, artist_rows, artist_fields)
        write_csv(ALBUM_CSV,  album_rows,  album_fields)
        print(f'\nWrote {applied} change(s) to CSV files.')
        import subprocess
        subprocess.run(['git', 'add', 'public/data/artist-editorial.csv', 'public/data/album-editorial.csv'], check=True)
        subprocess.run(['git', 'commit', '-m', f'Apply {applied} editorial suggestion(s) from site'], check=True)
        # Pull first in case remote has diverged (e.g. daily pipeline pushed catalog update)
        subprocess.run(['git', 'pull', '--rebase', 'origin', 'main'], check=True)
        subprocess.run(['git', 'push'], check=True)
        print('Committed and pushed.')
        # Build notification summary
        lines = []
        for uid, sub in submissions:
            target = f"{sub['artist_name']}{' / ' + sub['album_title'] if sub['album_title'] else ''}"
            lines.append(f"- {target} [{sub['field']}]: {sub['suggested_value']}")
        body = f"{applied} editorial change(s) applied and pushed to guapa.space:\n\n" + '\n'.join(lines)
        send_email(
            subject=f"Guapa: {applied} editorial suggestion(s) applied",
            body=body,
            to='ewill22@gmail.com',
        )
        print('Notification sent to ewill22@gmail.com.')
    else:
        print('\nNo changes applied.')

    save_state({'processed_uids': list(processed)})

if __name__ == '__main__':
    main()
