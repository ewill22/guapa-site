# Coffee Harvest Data

Source of truth for the coffee lens's harvest numbers. Guapa principle: **never be a source of truth — display facts from the best sources we can find, show disagreements transparently.**

## File layout

| File | Role | Who edits |
|---|---|---|
| `src/data/coffee-usda.js` | USDA FAS PSD data - auto-generated | `refresh.ps1` (never by hand) |
| `src/data/coffee-harvest.js` | Composed multi-source view: sources catalog, overlays (Conab, FNC, etc.), editorial events, helpers | Hand-maintained |

`coffee-harvest.js` imports from `coffee-usda.js` and merges overlays in. Only `coffee-usda.js` gets regenerated on refresh.

## Sources

| Source | Type | Coverage | License | Status |
|---|---|---|---|---|
| **USDA FAS PSD** | US foreign ag service | Global, 1960-present, ~29 producers | U.S. Public Domain | ✅ Ingested (auto-refreshable) |
| **Conab** | Brazilian federal agency | Brazil, 2001-present | BR Lei 12.527/2011 + Decree 8.777/2016 (open, attribution) | 🌱 Seed only (4 years) |
| **FNC** | Colombian producer federation | Colombia | Publicly published, attribution | 🔜 Pending |
| **Cecafé** | Brazilian exporters council | Brazil (exports, not production) | Publicly published, attribution | 🔜 Pending |
| **VICOFA** | Vietnamese industry association | Vietnam | Publicly published, attribution | 🔜 Pending |
| **UCDA** | Ugandan statutory authority | Uganda | Publicly published, attribution | 🔜 Pending |
| **ECTA** | Ethiopian regulatory authority | Ethiopia | Publicly published, attribution | 🔜 Pending |
| **ICO** | Intergovernmental | Global reference | Member-gated for full DB | 📎 Reference only |

Full metadata for each source lives in `COFFEE_SOURCES` in `coffee-harvest.js`.

## Usage

```powershell
powershell -ExecutionPolicy Bypass -File refresh.ps1
```

Downloads `psd_coffee_csv.zip`, aggregates attribute 028 (Total Production), keeps the latest monthly revision per year, groups into four regions, and emits `src/data/coffee-usda.js`.

Working files land in `.work/` (gitignored). The hand-maintained composed file (`coffee-harvest.js`) is never touched by this script.

## Output shape (composed, from `coffee-harvest.js`)

```js
COFFEE_SOURCES               // catalog of every agency/board with metadata
COFFEE_PRODUCERS             // { [country]: { region, defaultSource, sources: { [key]: { peak, latest, production } } } }
OVERLAY_PRODUCERS            // hand-curated non-USDA series (Conab, FNC, ...)
COFFEE_EVENTS                // editorial annotations for source divergences (e.g. 2021 Brazil frost)
COFFEE_REGIONS               // ordered region tiles with display color

producerSeries(country, source?)
regionTotal(region, year, source?)
globalTotal(year, source?)
countriesInRegion(region, year?, source?)
eventsFor(country, year?)
sourcesForProducer(country)
```

All production values: **millions of 60kg bags** (industry standard).

## Adding a new source

1. Add a full entry to `COFFEE_SOURCES` in `coffee-harvest.js` (name, fullName, country, url, license, methodology, cadence, attribution, notes, status).
2. Add the country series to `OVERLAY_PRODUCERS[sourceKey][Country]` with the `production: { year: bags }` shape.
3. If values diverge meaningfully from USDA on a notable year, add a `COFFEE_EVENTS` entry so the UI can surface the editorial note.
4. Commit - no script to run unless USDA also needs refresh.

## Backend handoff

This folder migrates to guapa-data once the coffee lens UI is settled. Backend will own the USDA refresh cadence, and eventually the overlay ingestions (Conab Pentaho, FNC, etc.) as their own auto-commit flows.

## Open TODOs

- Full Conab Brazil series - options:
  - Email `conab.geasa@conab.gov.br` for CSV feed
  - Parse Conab quarterly PDF bulletins (historical archive on their site)
  - Reverse-engineer the Pentaho CDA endpoint with proper session handling
- FNC Colombia monthly production/export series
- Cecafé Brazil weekly export bulletins (different axis from production, but complementary)
- VICOFA / Vietnam Customs for Vietnam
- Add 1975 Brazil "Black Frost" and 1989 ICA collapse to `COFFEE_EVENTS`
