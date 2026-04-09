"""
Sync artist-editorial.csv with music-catalog.json.
- Adds new catalog artists as confirmed=no.
- Auto-flips any artist with track-level cover/writer enrichment to confirmed=yes.
Runs in GitHub Actions before build.
"""
import csv
import json
import sys
from pathlib import Path

CATALOG_PATH = Path("public/data/music-catalog.json")
CSV_PATH = Path("public/data/artist-editorial.csv")

def normalize(name):
    """Normalize unicode quotes/hyphens for matching."""
    return (name
        .replace('\u2018', "'").replace('\u2019', "'").replace('\u2032', "'")
        .replace('\u2010', '-').replace('\u2013', '-').replace('\u2014', '-')
        .lower())

def main():
    if not CATALOG_PATH.exists() or not CSV_PATH.exists():
        print("Missing catalog or CSV file, skipping sync.")
        return

    # Load catalog artist names
    with open(CATALOG_PATH, encoding="utf-8") as f:
        catalog = json.load(f)

    catalog_names = {}
    enriched = set()  # normalized names of artists with track-level cover/writer data
    for artist in catalog.values():
        name = artist.get("name", "")
        if not name:
            continue
        catalog_names[normalize(name)] = name
        for album in artist.get("albums", []):
            for track in album.get("tracks", []):
                if track.get("cover") or track.get("writers"):
                    enriched.add(normalize(name))
                    break
            if normalize(name) in enriched:
                break

    # Load existing CSV names
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    existing = set()
    for row in rows:
        norm = normalize(row["name"])
        existing.add(norm)
        # Also match "the " variants
        if norm.startswith("the "):
            existing.add(norm[4:])
        else:
            existing.add("the " + norm)

    # Find new artists
    new_rows = []
    for norm_name, display_name in sorted(catalog_names.items()):
        if norm_name not in existing:
            new_rows.append({
                "name": display_name,
                "confirmed": "no",
                "icon": "",
                "description": "",
                "original": "",
                "drafted": "",
                "eric_take": "",
            })

    # Auto-flip enriched artists to confirmed=yes
    flipped = []
    for row in rows:
        if normalize(row["name"]) in enriched and (row.get("confirmed") or "").strip().lower() != "yes":
            row["confirmed"] = "yes"
            flipped.append(row["name"])

    if not new_rows and not flipped:
        print(f"Editorial CSV is up to date ({len(rows)} artists).")
        return

    rows.extend(new_rows)
    with open(CSV_PATH, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["name", "confirmed", "icon", "description", "original", "drafted", "eric_take"])
        w.writeheader()
        w.writerows(rows)

    if new_rows:
        print(f"Added {len(new_rows)} new artists to editorial CSV ({len(rows)} total).")
        for r in new_rows[:10]:
            print(f"  + {r['name']}")
        if len(new_rows) > 10:
            print(f"  ... and {len(new_rows) - 10} more")
    if flipped:
        print(f"Auto-confirmed {len(flipped)} enriched artists:")
        for n in flipped[:10]:
            print(f"  ~ {n}")
        if len(flipped) > 10:
            print(f"  ... and {len(flipped) - 10} more")

if __name__ == "__main__":
    main()
