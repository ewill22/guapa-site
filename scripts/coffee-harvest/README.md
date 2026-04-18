# Coffee Harvest Data

Source of truth for `src/data/coffee-harvest.js` — country-by-year coffee production used by the coffee lens.

## Source

**USDA FAS PSD** (Production, Supply & Distribution database)
- URL: https://apps.fas.usda.gov/psdonline/
- Bulk download: https://apps.fas.usda.gov/psdonline/downloads/psd_coffee_csv.zip
- License: **U.S. Public Domain** (OPEN Government Data Act) — unrestricted commercial use, attribution courtesy
- Coverage: 1960 – present, ~29 significant producer countries (peak ≥ 1M 60kg bags)
- Refresh cadence: USDA revises monthly; marketing-year values finalize with each revision

## Usage

```powershell
powershell -ExecutionPolicy Bypass -File refresh.ps1
```

Run from anywhere — the script resolves its own directory. It downloads the ZIP, extracts, aggregates attribute 028 (Total Production), keeps the latest monthly revision per year, groups into four regions, and emits `src/data/coffee-harvest.js`.

Working files land in `scripts/coffee-harvest/.work/` (gitignored).

## Output shape

```js
COFFEE_DATA_SOURCE       // attribution metadata (name, url, license, fetchedOn)
COFFEE_PRODUCERS         // { [country]: { region, peak, latest, production: { [year]: bags_millions } } }
COFFEE_REGIONS           // ordered region tiles with display color
regionTotal(region, yr)  // sum for a region in a year
globalTotal(yr)          // global sum for a year
countriesInRegion(r, yr) // sorted producers in a region (optionally filtered to a year)
```

All production values are **millions of 60kg bags** (USDA's native unit).

## Backend handoff

This lives in the frontend repo for phase 1. Once the coffee lens UI is settled, this whole folder + the emitted JS is intended to migrate to the backend (guapa-data) pipeline, which will regenerate the JS on the same cadence as `music-catalog.json` and push to `guapa-site` via the auto-commit flow.
