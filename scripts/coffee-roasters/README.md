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

`fetch-offerings.ps1` pulls `/products.json` from 25 known Shopify-hosted
specialty roasters across the US, Denmark, Norway, Canada, Australia, and
the UK (Panther, Onyx, Heart, La Cabra, The Coffee Collective, Tim
Wendelboe, Drop, Stumptown, George Howell, April, Passenger, Sey, Proud
Mary, Black & White, Prolog, Verve, Ruby, Sweet Bloom, Corvus, Parlor,
Pilot, 49th Parallel, Cat & Cloud, Roseline, Methodical). Public endpoint —
same data Shopify serves to the storefront. Each record links back to the
roaster's own product page so the source is always attributable.

Heuristic filtering drops merch/equipment and leaves coffee bags. Country
and process (washed / natural / honey / wet-hulled / anaerobic / carbonic /
thermal-shock) are inferred via regex over title + body. Re-run whenever
you want fresher bags — refresh cadence is currently manual; the backend
team can put this on cron once we're happy with the shape.

As of the last refresh: ~1,090 offerings, ~64% with country inferred, ~48%
with process inferred.

## Scheduled refresh

`scheduled-refresh.ps1` is the cron wrapper. It runs `fetch-offerings.ps1`,
checks whether `src/data/coffee-offerings.js` actually changed, and
auto-commits + pushes only if it did. Idempotent: re-running produces no
commit when Shopify returned identical output. Logs land in
`scripts/coffee-roasters/.logs/refresh-YYYY-MM.log` (gitignored).

To wire it into Windows Task Scheduler on a workstation:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/coffee-roasters/install-scheduler-task.ps1
```

Defaults to 5:15am daily (offset from backend's 5am `dq_enrich` run).
Re-run the installer to update the schedule. Task runs as the current user
with `LogonType Interactive` so `git push` uses the credential helper
already configured for day-to-day dev.

## Handing off to backend

When guapa-data is ready to own the refresh:

1. Pull this repo on the backend machine (or git-clone just this scripts dir).
2. Install `pwsh` (PowerShell 7+) — the `fetch-offerings.ps1` heuristics and
   the wrapper are both pwsh-compatible with no edits.
3. Drop `scheduled-refresh.ps1` into cron:
   ```
   15 5 * * *  pwsh /path/to/guapa-site/scripts/coffee-roasters/scheduled-refresh.ps1
   ```
4. Unregister the Task Scheduler entry on the workstation:
   ```powershell
   Unregister-ScheduledTask -TaskName 'Guapa Refresh Coffee Offerings' -Confirm:$false
   ```

Same commit message style (`[auto]`) as the existing music-catalog
auto-commits so nothing in CI needs to change.

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
