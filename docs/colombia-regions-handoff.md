# Colombia regions — backend handoff

## What frontend ships (this commit)

- `public/assets/colombia-departments.svg` — labeled SVG (CC BY 4.0, Victor Cazanave). Each `<path>` carries `aria-label="<DepartmentName>"`. We highlight only the six FNC coffee-axis departments (Cauca, Huila, Nariño, Antioquia, Caldas, Tolima); the other 26 render as inert outlines.
- `src/data/coffee-regions-colombia.js` — editorial table per department (capital, altitude, harvest window, character note, FNC reference URL). Hand-maintained, Guapa voice.
- `src/components/ColombiaRegionMap.jsx` + `.css` — drill-down panel rendered when `selectedCoffeeCountry === 'Colombia'` on the coffee lens.

The map is descriptive only — there are no production numbers tied to it yet. That's the backend's job.

## What backend should pick up

### 1. Region inference in the offerings refresh

`coffee/scripts/fetch-offerings.ps1` (or wherever the refresh now lives in `guapa-data`) currently infers `country` and `process` from Shopify product text. Extend it to also infer Colombian **region** (department) when the country is Colombia.

Match priority (case-insensitive, word-boundary):

```
Cauca | Huila | Nariño | Narino | Antioquia | Caldas | Tolima | Eje Cafetero | Coffee Axis
```

Add a `region` field to each entry in `src/data/coffee-offerings.js`. Frontend can then filter the country grid roaster list by region when one is selected on the map.

### 2. FNC per-department production data

The Federación Nacional de Cafeteros publishes monthly production / area / price data per department. Long-term goal: ingest this into a new file like `src/data/coffee-production-colombia.js` keyed by `{ department: { year: { volume_60kg, area_ha, ... } } }`.

Sources to evaluate:
- FNC Estadísticas: https://federaciondecafeteros.org/wp/estadisticas-cafeteras/
- DANE agricultural censuses (national statistics agency)
- Cafe de Colombia regional briefs (already linked from the editorial table)

Same source-attribution principle as the rest of the coffee lens: every number carries a labeled source pill. Never source of truth.

### 3. Future: other producing countries

The Colombia map is a v1 template. If it works, the natural next steps are:
- **Brazil** by state (Minas Gerais, Espírito Santo, São Paulo, Bahia, Paraná, Rondônia) — Conab publishes per-state.
- **Ethiopia** by woreda or zone (Sidama, Yirgacheffe, Guji, Limu, Harrar, Jimma) — ECTA / ICO data.
- **Vietnam** by province (Đắk Lắk, Lâm Đồng, Đắk Nông, Gia Lai) — VICOFA.

Each gets its own SVG + editorial table + (eventually) production file. The component pattern in `ColombiaRegionMap.jsx` is the template — copy and adapt.

## Out of scope for backend

- The SVG asset itself (frontend owns CC BY attribution and visual styling).
- Editorial copy in `coffee-regions-colombia.js` (Content team / Eric).
