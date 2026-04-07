# Track-Level Enrichment — Frontend Spec

## What's live and working

The frontend (Genre Explorer tracklist) now renders three new track-level fields:

| Field | Type | Example | How it displays |
|-------|------|---------|-----------------|
| `url_genius` | string | `"https://genius.com/flea-a-plea-lyrics"` | Yellow "GENIUS" pill link, right side next to duration |
| `cover` | boolean | `true` | Blue "COVER" badge next to track title |
| `writers` | array of objects | `[{"name": "George Clinton", "mbid": "..."}]` | "Written by George Clinton, Eddie Hazel" line under track title |

## What the frontend reads from each writer object

- `name` — displayed in the credit line. If `in_catalog` is true, the name is a clickable link that deep-links to that artist in Genre Explorer.
- `mbid` — not rendered yet, passed through.
- `in_catalog` — boolean. When true, clicking the writer name navigates to their artist page within Guapa.

## What's enriched so far (as of 2026-04-06)

4 artists: Flea, John Frusciante, Red Hot Chili Peppers, The Jimi Hendrix Experience.

## What would be ideal going forward

### Priority 1 — expand to all catalog artists
- `url_genius` on every track possible — most visible new feature
- `cover` + `writers` on any track that's a cover — blue badge + credits look great together
- `in_catalog: true` on any writer who exists in the catalog — enables cross-linking between artists

### Priority 2 — fields the frontend could use next (not built yet)
- `featured` — array of featured artists per track (referenced in commit d6cfb62 but not seen on enriched artists yet)
- `url_spotify` at track level (currently using `spotify_id` — either works, just be consistent)

## JSON structure

No changes needed. Fields nest under each track object. Frontend handles missing fields gracefully — no field means no UI element. Enrichment can roll out incrementally.

## Example track object

```json
{
  "title": "Higher Ground",
  "track_number": 1,
  "duration_ms": 231000,
  "cover": true,
  "writers": [
    {"name": "Stevie Wonder", "mbid": "...", "in_catalog": true}
  ],
  "url_genius": "https://genius.com/red-hot-chili-peppers-higher-ground-lyrics"
}
```
