# Coffee roasters — data pipeline

This directory produces the multi-source roaster catalog that powers the
coffee lens's Roasters section. Same philosophy as `scripts/coffee-harvest/`:
every record carries a source attribution, and when sources cover the same
entity we merge them without silently picking one.

## Sources

| Source | License | Role | Output file |
|---|---|---|---|
| **Wikidata** | CC0 (public domain) | Named roasting companies with structured facts (founded, founders, HQ, website, Instagram) | `src/data/coffee-roasters-wikidata.js` |
| **OpenStreetMap** | ODbL (attribution required) | Geographic long tail — every mapped roastery with coordinates + website | `src/data/coffee-roasters-osm.js` |
| **Editorial** | Guapa | Hand-written voice for featured roasters. Takes, stances, regional personalities. | `src/data/coffee-roasters-editorial.js` |
| **Shopify offerings** | Roaster's own product page (attribution linked) | Current live bags per roaster — title, origin, process, tasting notes. Pulled from public `/products.json` on each Shopify storefront. | `src/data/coffee-offerings.js` |

The composed dataset lives in `src/data/coffee-roasters.js`, which imports
all three and merges them. Matching is by Wikidata QID where available,
then by normalised name as a fallback.

## Running

```powershell
# full refresh
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/coffee-roasters/refresh.ps1

# individual pulls
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/coffee-roasters/fetch-wikidata.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/coffee-roasters/fetch-osm.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/coffee-roasters/fetch-offerings.ps1
```

## Shopify offerings

`fetch-offerings.ps1` pulls `/products.json` from each known Shopify-hosted
specialty roaster (Panther, Onyx, Heart, La Cabra, The Coffee Collective,
Tim Wendelboe, Drop, Stumptown, George Howell, April). Public endpoint —
same data Shopify serves to the storefront. Each record links back to the
roaster's own product page so the source is always attributable.

Heuristic filtering drops merch/equipment and leaves coffee bags. Country
inference is a best-effort regex over title + body. Re-run whenever you
want fresher bags — refresh cadence is currently manual; the backend team
can put this on cron once we're happy with the shape.

Intermediate JSON lands in `scripts/coffee-roasters/.work/` (gitignored). The
`.js` outputs are committed and drive the build.

## Wikidata query

Entities with `P31 = Q2363097` (coffee roaster / roasting company). We
intentionally use direct instance-of instead of walking the subclass tree
(`P279*`) because the subclass walk times out on the public endpoint.

Side effect: we miss entities tagged only as `Q4830453` (business) or
`Q783794` (company). Those are candidates for the editorial layer.

Known roasters that are **not** in Wikidata as of the last refresh:
Panther, Onyx, Heart, Sey, Tim Wendelboe, April, La Cabra, Coffee
Collective, George Howell, Black & White, Luna, Cat & Cloud. All candidates
for editorial entries.

## OSM query

Overpass QL for all nodes/ways tagged `craft=coffee_roaster` with a `name`.
Only the tagged website and country (where present) are ingested; we do not
pull full addresses or opening hours to keep the bundle compact.

Attribution: `(c) OpenStreetMap contributors` — surfaced via the OSM source
pill in the UI.

## Open TODOs

- Reverse-geocode OSM coordinates to country names where `addr:country` is
  missing (only ~20 of ~180 records carry the tag).
- Backfill editorial entries for the known-missing roasters listed above.
- Consider pulling `craft=coffee_roaster` *ways* with bounding boxes so the
  UI can draw pin clusters on a world map view.
