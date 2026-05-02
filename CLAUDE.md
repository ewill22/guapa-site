# CLAUDE.md — Guapa Site (Frontend)

## Role

You are the frontend expert for Guapa Data. You own the visual frontend, editorial details, and user experience across the entire guapa-site repo. The backend team (guapa-data) owns data pipelines, enrichment, and classification — they push data to you via auto-commits.

**Design guide**: `C:\Users\eewil\homebase\GUAPA_DESIGN_GUIDE.md` — the authoritative reference for colors, typography, spacing, cards, buttons, and interactive states. Read it before styling anything.

## Teams

Three teams work in this repo:

| Team | Owns | Notes |
|------|------|-------|
| **Frontend** | React app, static pages, CSS, components, UX | Main development team |
| **Content / Editorial** | `public/data/artist-editorial.csv`, `public/data/album-editorial.csv`, artist & album descriptions, icons | Works in batches of 5 artists. Drafts content, Eric reviews and confirms. |
| **Backend** (guapa-data) | `music-catalog.json`, data pipelines, enrichment, genre classification | Separate repo, auto-pushes daily |

The Content team writes in the **Guapa voice**: punchy, opinionated, fragment-heavy. Short sentences. Lead with the iconic detail. No filler.

## Company Vision

Guapa Data is a data solutions company run by Eric, based in New Jersey. Two sides that reinforce each other:

**The Creative Side** — record store, coffee shop, timeline. Portfolio pieces that show what clean data pipelines and polished frontends can do.

**The Serious Side** — Guapa Data Solutions. Real estate analytics, marketing consulting. The creative projects serve as proof of quality.

The creative work sells the serious work. A potential client explores the record store, sees the quality, and clicks into Data Solutions.

## Core Principles (all lenses)

These apply everywhere — music, coffee, economics, sports, data solutions — not just one lens.

### 1. Guapa is never a source of truth
Guapa displays facts from the best sources we can find, with attribution. When two authoritative sources disagree on the same fact (USDA says Brazil 2021 = 58M bags, Conab says 46.9M), show **both** numbers with attribution and an editorial note explaining which source is sharper for that context. Never pick one and hide the other.

- Data schemas must support **multiple sources per fact** (per country × year, per album attribute, etc.) rather than a single flattened value.
- Every number rendered carries an **attribution pill + license**.
- When sources diverge, add an **editorial annotation** calling out which source is best for that specific event and why.
- Applies to every lens: coffee harvest, music catalog, real estate, economics.

### 2. Never fabricate specific-entity activity
Never imply a specific roaster/artist/team is currently doing something unless the claim is backed by real, attributable data. Example of what not to do: "Drop Coffee is roasting a Sidamo lot today" (fictional). Defensible rewording: "Drop Coffee typically sources from Ethiopia" (general, true).

- For specific-roaster-doing-specific-thing claims, pull from a real source (Shopify `/products.json`, Wikidata, OSM, editorial-with-citation).
- Roast dates, batch IDs, and similar bag-side details are not scrapeable — don't imply we know them.
- If real data isn't available, phrase neutrally or link out to the entity's own page so they are the source, not us.

### 3. No advertising-style "hero" UX patterns
The lenses should read like newspaper sections, not shop windows. No "Roaster of the Day", "Team in Focus", "Featured Artist" promoted slots. Drill-down UX (broad → specific) is the established pattern instead.

### 4. Source pills link to the page, not the file
When a source pill (FNC, USDA, Conab, etc.) links out, point it at the source's stats landing page — never at a direct file URL (.xlsx, .pdf, .zip). Triggering a file download from a click on guapa.space looks like we're hosting/distributing the file. Always link to the stats hub or the page that hosts the file, and let the user decide to download from there.

- For FNC: use `FNC_SOURCE_URL` (https://federaciondecafeteros.org/wp/estadisticas-cafeteras/), not `FNC_DATA_FILE_URL`.
- Same rule for any future producer source (Conab, USDA FAS PSD, VICOFA, etc.) — pill goes to the landing page.
- The `*_DATA_FILE_URL` exports are kept for the backend pipeline (which fetches the file directly) and for citation in commit messages, but should not be rendered as user-clickable links.

### 5. The music KPI sidebar is constant across every lens
Artist of the Day / Current Album / Now Playing tiles stay identical on coffee, economics, sports, guapa lens. It's the persistent "what's playing" soundtrack while the main content changes. Never swap, hide, or replace the three tiles with lens-specific content. Lens-specific content goes **below or alongside** the main area, never inside the sidebar.

## Tech Stack

- **Framework**: Vite + React
- **Styling**: CSS (no Tailwind, no CSS-in-JS)
- **Fonts**: Instrument Sans (UI) + Newsreader italic only (editorial headlines, about)
- **Deployment**: GitHub Actions CI/CD → GitHub Pages (every push to main auto-deploys)
- **Live URL**: https://guapa.space (custom domain active, CNAME in `public/CNAME`)
- **Repo**: https://github.com/ewill22/guapa-site (username: ewill22)
- **Base path**: `vite.config.js` has `base: '/'`
- **Workflow**: `.github/workflows/deploy.yml` (uses `npm install`, not `npm ci`)
- **npm/node**: NOT available in bash shell — run npm commands in a separate terminal

## Frontend ↔ Backend Pipeline

**guapa-data** (backend, separate repo) auto-pushes to guapa-site:

```
5am daily:
  guapa-data runs dq_enrich.py
    → cleans/dedupes albums (~15,000 albums, 824 artists)
    → pulls Spotify metadata + covers + links
    → enriches release_date from MusicBrainz CC0 (YYYY-MM-DD, 50/day backfill)
    → classifies genres at album level (classify_genres.py)
    → enriches track-level data: Genius URLs, cover flags, writer credits, in_catalog links
    → sorts albums chronologically per artist (by release_date)
    → exports slim music-catalog.json
    → git push to guapa-site/public/data/music-catalog.json

guapa-site receives push
    → GitHub Actions builds + deploys
    → Live on GitHub Pages within minutes
```

- Backend commits show as `[auto]` in git log — these are safe, just catalog updates
- Backend owns: data quality, enrichment, genre classification, album-level tagging, release_date enrichment, track-level enrichment (Genius, covers, writers)
- Frontend owns: how that data is displayed, UX, editorial content, styling
- Catalog: 824 artists, ~16K albums, 10 genres, 56 subgenres
- `release_date` backfill: 2,989 albums done (17%), all editorial artists covered, 50/day until complete (source: MusicBrainz CC0)
- Spotify enrichment ongoing for ~10,900 catalog albums without `url_spotify`. Frontend fallback when an album URL is missing: open `https://open.spotify.com/search/<artist>+<album>` (Spotify's search results), not the artist page. Same fallback used by the ▶ Aux Cord button on artist pages.

## Editorial / Content Pipeline

The Content team maintains two CSV files in `public/data/`:

### `artist-editorial.csv`
| Column | Purpose |
|--------|---------|
| `name` | Artist display name (matches catalog) |
| `confirmed` | `yes` = live on site. Eric flips this after review. |
| `icon` | Single emoji for the artist |
| `description` | 1-2 sentence artist blurb in the Guapa voice |
| `original` | `yes` = one of the founding 145 editorial artists. Permanent flag, never changes. |
| `drafted` | `yes` = content written, awaiting Eric's review |
| `eric_take` | Eric's personal take/note on the artist (optional, loaded by `load-editorial.js`) |

### `album-editorial.csv`
| Column | Purpose |
|--------|---------|
| `artist_name` | Must match artist name in catalog |
| `album_title` | Must match album title in catalog |
| `year` | Release year |
| `description` | 1-2 sentence album blurb — highlight standout tracks, in the Guapa voice |

### Workflow
1. **Priority 1**: Fill confirmed artists missing icons or descriptions (these are live on the site — gaps are visible to visitors)
2. **Priority 2**: Pick 5 unconfirmed artists per batch
3. Write artist description + icon, set `confirmed=yes`, `drafted=yes`
4. Write album descriptions for 4-5 key albums per artist
5. **CRITICAL: Verify all track/song names against `music-catalog.json` before committing.** Never write song names from memory — always cross-reference the actual track listing for that specific album. An audit on 2026-04-10 found 17 descriptions referencing songs from the wrong album by the same artist (e.g., "Oye Como Va" on Dance Mania but actually on El Rey Bravo).
6. Eric reviews via the contribute page — can submit corrections same-day if anything is off
7. `sync-editorial-csv.py` (runs in CI) auto-adds new catalog artists as `confirmed=no`

### Community Suggestions (guapa.space/contribute)
Visitors can suggest description edits via the contribute page. Submissions go to Formspree (form ID: `mykbdnak`) → emailed to `eewilliamsremote@gmail.com`.

**Automated pipeline** — runs every 5 minutes via Windows Task Scheduler ("Guapa Apply Editorial Suggestions"):
- Reads Formspree submission emails via IMAP (uses `C:\Users\eewil\homebase\gmail.py`)
- Applies changes to `artist-editorial.csv` and `album-editorial.csv`
- Backs up CSVs to `data/backups/YYYY-MM-DD_HHMMSS/` before each run
- Logs every change (timestamp, IP, old/new value) to `data/editorial-suggestions-log.csv`
- Tracks processed emails in `data/apply-suggestions-state.json`
- Originals (Eric's canonical) saved in `data/editorial-originals/` — never touched

**To run manually:**
```bash
python scripts/apply-suggestions.py
```

**After applying:**
```bash
git diff public/data/          # review changes
git add public/data/ && git commit -m "Apply editorial suggestions from site" && git push
```

**Backups live in** `data/` (gitignored — local only).

### Guapa Voice
Short. Opinionated. Fragment-heavy. Lead with the iconic song or moment. No filler, no hedging. Examples:
- "That tritone. The Devil's interval. Tony Iommi played it and invented a genre on a rainy day in Birmingham."
- "Sinnerman is ten minutes of relentless piano and percussion. Strange Fruit from a Black woman's mouth hits different."

### Frontend Integration
- `src/data/load-editorial.js` — fetches and parses `artist-editorial.csv` at runtime
- Album editorial loader TBD — will follow same pattern when frontend is ready to display album blurbs

## Design System

**Full reference**: `C:\Users\eewil\homebase\GUAPA_DESIGN_GUIDE.md`

### Quick Reference
| Token | Value | Usage |
|-------|-------|-------|
| --black | #0a0a0a | Page background |
| --gray-900 | #1a1a1a | Card backgrounds |
| --gray-800 | #2a2a2a | Borders, dividers |
| --gray-600 | #666666 | Muted text, metadata |
| --gray-400 | #999999 | Body text, nav links |
| --white | #ffffff | Headings, primary text |
| --pink | #e8a0b0 | Primary accent — links, hover, active states |
| --yellow | #f0c014 | CTA — buttons, "view all", focus rings, selection |
| --blue | #88a8d4 | Data accent — charts, metrics |
| --green | #7ec89b | Status — emerging, active, live |

### Rules
- NEVER use gradients (flat colors only)
- NEVER use emoji in professional outputs
- Newsreader is ONLY italic — never upright, never bold
- All borders 1px solid var(--gray-800)
- No bright/white backgrounds — darkest is #0a0a0a, lightest card bg is #1a1a1a
- Hover states: wrap in `@media (hover: hover)` and add `:active` for touch (prevents mobile double-tap)

### Shared Design File
- `public/guapa-base.css` — source of truth for tokens, reset, scrollbar, container
- Linked in `<head>` before page-specific styles
- Backend team copies this file when needed; eventually will link from GitHub Pages URL

## Site Structure

### Navigation (must match across ALL pages)
- Logo image: `assets/guapa_logo_dark.png`, height 36px
- Logo text: "GUAPA" at 1.8rem bold + "data" at 0.6rem weight 400
- Desktop nav links (left): Record Store, Data Solutions, Contribute
- Desktop nav actions (right): Merch → (pink pill), Instagram icon
- Mobile hamburger: Record Store, Data Solutions, Contribute, Merch
- **Contribute link is intentionally React-only** — only appears on the main page (Nav.jsx) and `data-solutions.html` / `contribute.html`. The other static pages (`shop.html`, `music.html`, `terms.html`, `privacy.html`) omit it by design.
- Static HTML pages use inline styles to match React nav exactly

### Main Page (React — `src/App.jsx`)

1. **Nav** (`src/components/Nav.jsx`)
2. **Yellow italic banner** (randomly picks from 3 quotes on page load, locked via useState initializer)
3. **Coffee Shop Counter** (two-column desktop layout):
   - **Left sidebar (desktop)**: KPI tiles (sticky, scrolls with you)
   - **Right main**: Welcome greeting, timeline, lens-specific counter-bottom section
   - **Counter-bottom by lens**: Search bar + legend (music), intro greeting (coffee), Issue of the Moment (economics), "Seasons, dynasties, upsets" intro (sports)
   - **Mobile (≤900px)**: Everything flattens via `display: contents`, reordered: KPI tiles(1) → greeting(2) → search(3) → albums(4) → timeline(5) → legend(6) → genre explorer(7)
4. **Below counter** — lens-specific content:
   - **Music lens** (default): Genre Explorer (auto-opens artist of the day on load, no scroll)
   - **Guapa lens**: Weekly dev blurbs (Fri–Thu grouping) + Commit history-by-week panel
   - **Coffee lens**: Four region tiles → country grid (one country per row, full-width) with 12-month grow calendars → year-based coffee blurbs
   - **Economics lens**: Year-based economics blurbs
   - **Sports lens**: Placeholder "coming soon" card (blue accent)
5. **Footer** (`src/components/Footer.jsx`) — logo lockup + links + FTC affiliate disclosure

### KPI Tiles (Now Playing System)
Three tiles stacked vertically, each with a color-matched progress bar:

| Tile | Border | Progress Bar | Content |
|------|--------|-------------|---------|
| Artist of the Day | pink | pink — full discography progress | Artist name, album/track counts |
| Current Album | yellow | yellow — album progress + track X/Y | Album art, title, year |
| Now Playing | blue | blue — track progress | Song title |

- Tiles are clickable — deep-link into Genre Explorer
- Progress bars snap to start on song change (no rewind animation)

### Daily Artist Rotation (`getDailyArtist` in App.jsx)
- **Hash-based scoring**: each artist scored by `hashStr(today + artistName)`, highest score wins
- **Two pools**: throwback (`begin_year < 1991`) ~679 artists, modern (`begin_year >= 1991`) ~145 artists
- **Alternation**: day-of-year parity (even = throwback, odd = modern)
- **Permanently stable**: adding/removing artists never shifts other days' picks (no epoch, no rotation index)
- **Schedule**: plays discography chronologically starting 8am EST, tracks advance by `duration_ms`
- **Aux Cord**: when discography finishes, deep link clears (artist panel closes) and random year is set

### On-Load Behavior
- Year starts as `null` (or from `sessionStorage` if user previously moved the timeline)
- **During daily artist playback**: year always follows the currently playing album — user can move the slider but it snaps back on album change. Timeline is locked to the music.
- **During aux cord**: year follows unless user has pinned via manual interaction. Deep link is cleared so the artist panel doesn't persist into a random year's subgenre view.
- Year persists via `sessionStorage` — sticks across page navigation (main ↔ record store) but resets on new tab
- Artist of the day auto-opens in Genre Explorer on load (via `deepLink` with `noScroll: true`) — no scroll, just opens the discography
- KPI tile clicks still scroll to the artist as before

### Genre Explorer (`src/components/GenreExplorer.jsx`)

**Data sources** (merged via `buildMergedData()` at runtime):
- `src/data/music-data.js` — editorial data: 144 artists with icons/descriptions, curated albums, hand-crafted status ranges (`S()` function)
- `public/data/music-catalog.json` — full catalog: 824 artists, ~15K albums with tracks, cover art, Spotify/Wiki/Amazon links, **album-level genre/subgenre tags**
- `buildMergedData(catalog, MUSIC_DATA)` merges both: editorial takes priority, catalog-only artists (680) auto-generated into correct genre/subgenre slots
- New genres (METAL) and subgenres auto-created from catalog tags
- `buildStatus(minYr, maxYr)` computes status ranges for auto-generated subgenres
- `GENRE_KEY_MAP` maps catalog genre strings (e.g. 'POP') to editorial keys (e.g. 'pop')

**Subgenre visibility** (hybrid editorial + catalog):
- Editorial `S()` status ranges provide cultural labels (emerging/rising/peak/fading/hidden)
- `catalogSubRanges` index built from album-level genre tags: `{ subgenreName: { min, max } }`
- `isSubVisible(sub, year)`: visible if editorial status isn't 'hidden' OR catalog albums span that year
- When visible via catalog but outside editorial range → shows as 'fading' (dashed border)
- Example: Radiohead early albums tagged BRITPOP, OK Computer+ tagged INDIE ROCK — album-level precision

**Discography view behavior**:
- When artist discography is open: other subgenres hidden, only selected subgenre shown
- Description removed from disco header (stays in artist cards only)
- Album count shown next to artist name in disco header
- Floating nav rail: Latest Album / First Album / Close (sticky desktop, fixed mobile)

**Status tag colors** (inline style in artist panel header):
- Emerging: `var(--green, #7ec89b)`
- Rising: `var(--blue, #88a8d4)`
- Peak: `var(--pink)`
- Fading: `#a05050`

**Genre tiles** (card style, matches coffee region tiles):
- 6-column grid on desktop (two rows: 11 genres + 1 Random tile)
- Card background `--gray-900`, border `--gray-800`, rounded corners
- Vertical layout: icon → name → subgenre count (count hidden until year + catalog loaded)
- Active state: white text, `--gray-400` border (neutral — legend colors have priority)
- Random tile: dashed border, centered text, picks random genre with visible subgenres
- Album actions: Spotify, Buy Vinyl, Buy CD (Amazon affiliate), Wiki

**Track-level enrichment** (rendered in tracklist rows):
- `url_genius` → yellow "GENIUS" pill link, right-aligned next to duration column
- `cover: true` → blue "COVER" badge (--blue) next to track title
- `interpolates: { name, mbid, in_catalog }` → green "INTERPOLATION" badge (--green) next to track title. Object contains source artist info; `in_catalog: true` means the source artist has their own page. Field only present when detected (same pattern as cover, writers, featured).
- `writers` → "Written by ..." line below track title, gray-600 text
- Writers with `in_catalog: true` → clickable blue links that deep-link to that artist's discography in Genre Explorer (uses `navigateToArtist()` helper, same pattern as member_of/members chips)
- Genius + cover + interpolation badges hidden on mobile (≤768px) to prevent overflow
- Currently enriched: 16 artists and expanding (Flea, RHCP, Jimi Hendrix Experience, John Frusciante, Mandy Moore, Britney Spears, Christina Aguilera, Debbie Gibson, Bobby Darin, Rick Nelson, A★Teens, RBD, Vanessa Hudgens, etc.)
- **Auto-confirm rule**: `sync-editorial-csv.py` (runs in CI on every push) scans the catalog for any artist with track-level `cover` flags or `writers` arrays and flips their editorial row to `confirmed=yes`. Means new backend enrichment → artist goes live on the next build, zero manual work.
- Backend spec: `docs/track-enrichment-spec.md`

**Escape / Close behavior**:
- Closes all selections and scrolls to just below yellow banner
- Accounts for sticky nav height in scroll calculation

**Mobile (≤768px)**:
- Genre tiles: 3-column grid
- `.ge-disco-body`: `align-items: stretch` (critical — `flex-start` caused 697px overflow on 342px screens)
- `.ge`: `width: 100%; min-width: 0`
- Nav rail: fixed bottom-right, circular icon buttons
- All scroll uses `safeScrollTo()` helper (prevents iOS auto-zoom from `scrollIntoView`)

### Search
- Search bar in counter-bottom (music lens only)
- Searches artists, albums, songs from catalog
- Results click → deep-link to Genre Explorer
- Input font: 0.78rem desktop, 16px mobile (prevents iOS auto-zoom)
- Legend below: Emerging (green dashed) / Rising (blue) / Peak (pink) / Fading (red dashed)

### Coffee Lens
The lens is **cascade-only** — nothing pre-filters or auto-selects. The user picks a region tile to surface countries, picks a country to open the detail panel and filter roasters, picks a roaster pill to load the roaster card. No alphabetical fallback, no daily auto-pick beyond Today's Journey card.

- **Timeline**: Year-based (1930–2026), bars driven by `globalTotal(year)` from `coffee-harvest.js` (composed multi-source production totals). `TIMELINE.coffee` is an empty stub — no hand-maintained coffee series.
- **Counter-bottom**: Two-column row — left: intro greeting "Listen to the world through music. _Explore it through coffee._" with a short sub-line. Right: Today's Journey card (sits inside the counter row, not below). `.counter-bottom` is pinned to `height: 100px` so the music and coffee main containers match exactly.
- **Today's Journey card** (in counter-bottom, right column) — `hash(today)` picks one offering from the ~1,090-record pool in `coffee-offerings.js`. Renders as: clickable roaster name (scrolls to roaster card), external link to the Shopify product page, clickable country chip (filters the grid + scrolls to detail panel), optional process chip (scrolls to Processing primer). Header shows "On the bar today" label + "updated YYYY-MM-DD" attribution. Card chrome stripped in counter variant; body line clamped to 2 lines so the row matches music-lens height.
- **Below counter**:
  - **Timeline wave tint** — bars colored by coffee wave era (first/second/third/fourth); the labeled legend strip is currently hidden via CSS (`.coffee-wave-legend { display: none }`) to keep music/coffee container heights identical.
  - **Region tiles row** — four big tiles (South America, Central America, Africa, Blend) stretched full-width of the container; each shows that region's total harvest for the selected year. Clicking a tile cascades the country grid open; clicking again clears.
  - **Country grid** — **hidden until a region is selected**. When a region is picked, the grid shows that region's countries (one per row, full-width). Each row: country name (region-colored), phase badge (harvest / flowering / resting), harvest bags + global share, share bar, 12-month calendar strip highlighting the current month, Editorial pill (methodology tooltip + clickable per-country source refs), event note if any, source attribution pill. Each tile carries `data-coffee-country={name}` so journey-card + roaster-card chips can scroll-target precisely. Empty-state copy when no region selected: "Pick a region above to see its producers."
  - **Country detail panel** — opens when a country is clicked (`<CountryDetailPanel>`). Pressing Escape clears the country and scrolls to top.
  - **Roasters section** — `coffeeRoastersRef` target, editorial + Wikidata + OSM + Shopify offerings merged per roaster. Roaster card **only renders once the user picks a pill** (no alphabetical fallback — previously `featured[0]` made April Coffee auto-appear for any country). When a country is selected, the pill list filters to roasters carrying that origin. Selecting a roaster whose origins don't include the next-clicked country auto-clears the roaster.
  - **Beans section** — Processing primer is the head. Seven cards (Washed, Natural, Honey, Wet-Hulled, Anaerobic, Carbonic, Thermal Shock) stacked vertically from `COFFEE_PROCESSES`, each with the matching live offerings to its right (filtered by `selectedRoasterSlug` AND `selectedCoffeeCountry`). Each card shows aka / tagline / body / flavors + a "XX live" count. Process chip in Today's Journey deep-links here.
- **Removed (2026-05-02)**: "Beans worth knowing" famous-varieties row and the year-based coffee blurbs (news/trending). The lens reads as a single producer-to-roaster-to-bean drill-down, no editorial filler. `FAMOUS_BEANS` and `BLURBS.coffee` exports remain in their data files for now but aren't rendered.

#### Data files
| File | Role | Who edits |
|---|---|---|
| `src/data/coffee-editorial.js` | `COFFEE_WAVES` + `waveForYear()`, legacy `COFFEE_JOURNEYS` templates (unused — kept as fallback), `COFFEE_PROCESSES` (7 processing methods — keys match `fetch-offerings.ps1` inference), `COUNTRY_STORIES` (per-country editorial paragraph) | Hand-maintained |
| `src/data/coffee-offerings.js` | Flat list of ~1,090 live Shopify offerings across 25 roasters: `{ roasterSlug, roasterName, title, handle, url, country, process, summary }`. Country/process inferred via regex; ~64% / ~48% hit rate. | **Auto-generated** by the **backend team** (pipeline lives in `guapa-data/coffee/scripts/`, not in this repo) — do not hand-edit. Auto-pushed daily via their Task Scheduler job. |
| `src/data/coffee-timeline.js` | Panther roaster POC — `FEATURED_ROASTER`, `PANTHER_OFFERINGS`, `PANTHER_REGIONS`, `COFFEE_BLURBS` (daily roast seed). Currently unused in `App.jsx` but kept for phase 3 (roasters as artists). | Hand-maintained |
| `src/data/coffee-usda.js` | USDA FAS PSD global production (29 producers, 1960–present, public domain) | **Auto-generated** by backend team (pipeline in `guapa-data`) — do not hand-edit |
| `src/data/coffee-harvest.js` | Multi-source composer: `COFFEE_SOURCES` catalog, `OVERLAY_PRODUCERS` (Conab seed + stubs), `COFFEE_EVENTS`, `COFFEE_GROW_CALENDAR` (29 countries, flowering/harvest/resting months), `GROW_CALENDAR_REFS` (editorial methodology + per-country source refs), helpers (`regionTotal`, `globalTotal`, `countriesInRegion`, `producerSeries`, `eventsFor`, `growCalendarFor`, `growPhaseIn`) | Hand-maintained |

#### Coffee data pipelines — backend-owned
All coffee refresh scripts (USDA production pull, Wikidata/OSM roaster pulls, Shopify offerings fetch) live in the `guapa-data` repo at `guapa-data/coffee/scripts/`. Not in this repo. They write their outputs to `src/data/coffee-*.js` in guapa-site via auto-commits (`[auto]` in the commit message). Do not recreate them here.

The Shopify offerings refresh ("Guapa Refresh Coffee Offerings" in Task Scheduler) runs daily at 5:15am, launched hidden via `run-hidden.vbs` + `coffee_refresh.bat` → `scheduled-refresh.ps1`. Output: `src/data/coffee-offerings.js`. Only commits when Shopify returned changed data.

#### Source principle (see feedback memory "guapa-not-source-of-truth")
Every number on the coffee lens must carry an attribution to a named source (USDA, Conab, FNC, Cecafé, VICOFA, UCDA, ECTA, ICO, …). When sources disagree on the same country × year, show both with an editorial note rather than picking one silently. The 2021 Brazil frost entry in `COFFEE_EVENTS` is the exemplar: USDA 58.1M vs Conab 47.72M, with a `preferredSource: 'conab'` pointer and a note explaining why Conab is the sharper read for that event.

**Grow calendar** follows the same principle — labeled as **Editorial** in the UI (yellow-tinted pill). Each country carries a `refs` array (base `[ico, usdaFas]`, plus national boards where applicable: Brazil→conab, Colombia→fnc, Vietnam→vicofa, Ethiopia→ecta, Uganda→ucda). The Editorial pill tooltip shows the full methodology statement; source refs underneath are clickable links.

#### Phase status (as of 2026-05-02)
- ✅ **Phase 1 (data foundation)** shipped 2026-04-18. USDA ingested; Conab Brazil seeded (4 verified years); rich sources catalog stubbed for FNC, Cecafé, VICOFA, UCDA, ECTA, ICO.
- ✅ **Phase 2 (UI redesign)** shipped 2026-04-19. Four region tiles + full-width country grid with grow calendars.
- ✅ **Phase 3 (newspaper editorial)** shipped 2026-04-23. Today's Journey card, Beans Worth Knowing, timeline wave tint, country stories, editorial cross-linking.
- ✅ **Phase 4 (real offerings + automation)** shipped 2026-04-24. Shopify offerings pipeline (25 roasters, ~1,090 offerings), Processing primer with live counts, scheduled daily refresh via Task Scheduler.
- ✅ **Phase 5 (country detail panel + Colombia drill-down)** shipped 2026-04-24, refactored 2026-04-28. Selecting any producer country opens `<CountryDetailPanel>` (yellow left-border, "On {country}" header). For Colombia: SVG map left, department pills + country story stacked on the right. For every other country: Guapa-logo placeholder fills the map slot, country story renders on the right. Files: `src/components/CountryDetailPanel.{jsx,css}`, `src/data/coffee-regions-colombia.js`, `src/data/coffee-production-colombia.js` (backend-owned: `FNC_AREA_BY_DEPARTMENT`, `FNC_NATIONAL_PRODUCTION_MONTHLY`), `public/assets/colombia-departments.svg` (CC BY 4.0, Victor Cazanave). Backend handoff for region inference: `docs/colombia-regions-handoff.md`.
- ✅ **Phase 6 (cascade-only flow)** shipped 2026-05-02. Country grid hidden until a region is picked; roaster card no longer has an alphabetical fallback; Beans Worth Knowing and year-based coffee blurbs removed. Today's Journey card consolidated into the counter-bottom alongside the greeting (was a standalone card below the timeline). `counter-bottom` pinned to `height: 100px` so music + coffee main containers match.

  **Adding a new country drill-down (Brazil by state, Ethiopia by zone, Vietnam by province):**
  1. Drop a labeled SVG into `public/assets/{country}-{subdivision}.svg`. Each `<path>` must carry an `aria-label` matching the subdivision name. Source from a CC-licensed map (svg-maps, Wikimedia Commons) and capture the attribution metadata.
  2. Add an editorial table at `src/data/coffee-regions-{country}.js` keyed by subdivision name. Match the Colombia shape: `{ name, capital, altitude, harvest, character, fncRef }` (rename `fncRef` to whatever per-country authority applies — Conab for Brazil, ECTA for Ethiopia, VICOFA for Vietnam). Export the labels array and an attribution object.
  3. Add a branch in `CountryDetailPanel.jsx` next to the existing `isColombia` block — pull in the new SVG fetch, the new editorial table, and the new attribution. The `<MapPlaceholder>` fallback handles every country without a branch.
  4. Coordinate with backend on the equivalent of `coffee-production-colombia.js` if per-subdivision production data is available — same source-attribution rules.

#### Known TODOs (see `scripts/coffee-harvest/README.md` for full list)
- Full Conab Brazil historical series (email `conab.geasa@conab.gov.br` or parse Pentaho CDA)
- FNC Colombia monthly production/export series
- Cecafé Brazil weekly export bulletins (different axis from production)
- VICOFA Vietnam, UCDA Uganda, ECTA Ethiopia
- Add 1975 Brazil "Black Frost" and 1989 ICA collapse entries to `COFFEE_EVENTS`
- Backend (guapa-data) to eventually own the refresh cadence + overlay ingestions + coffee batch/roast tracking pipeline

### Economics Lens
- **Timeline**: Year-based (1930–2026), same bar style as music
- **Counter-bottom**: "Issue of the Moment" — Oil (green accent, Brent Crude benchmark)
- **Below counter**: Year-based economics blurbs from `blurbs.js`

### Sports Lens (placeholder)
- **Status**: Placeholder only — no data, no timeline content. Shipped 2026-04-19 as a 4th lens option to anchor future work.
- **Accent**: Blue (`#88a8d4`), trophy icon (`🏆`).
- **Counter-bottom**: "Seasons, dynasties, _upsets_." intro with a "coming soon" sub-line.
- **Below counter**: Centered `sports-coming-soon` card with lens icon, headline, and a short body. No timeline bars (empty `TIMELINE.sports` falls through to flat hash-based heights).
- **When resuming**: add TIMELINE events, a real counter-bottom section (Team / League / Moment of the Year?), and year-based blurbs in `BLURBS.sports`.

### Guapa Lens (Dev)
The default lens — shown when no other lens is active (`lens === null`). This is the "how we built it" view.
- **Timeline**: Day-based, not year-based. One bar per day from `DEV_FIRST_DATE` (2026-02-19) to today. Bar heights scale by commit count. Uses `DEV_DAYS` built in `App.jsx` from `DEV_COMMITS` in `src/data/dev-timeline.js`.
- **Counter-bottom**: "Today's Build" card showing commits-this-week + the top news blurb from the current week.
- **Below counter**:
  - **Weekly blurbs panel** — Fri→Thu grouping (Friday = week start, matches music release day). Shows the current week's dev-timeline entries by day.
  - **Dev stats strip** (under the slider) — three tiles: total commits, active days / total days, peak day (commits + date).
  - **Commit history by week** — scrollable list of every week with a horizontal bar, commit count, and active-days count. Click any row to jump the timeline to the last active day of that week.
- **Data file**: `src/data/dev-timeline.js` — hand-maintained.
  - `DEV_FIRST_DATE` — first commit across guapa-site + guapa-data combined.
  - `DEV_COMMITS` — `{ 'YYYY-MM-DD': count }` of combined commits per day. Not every date needs an entry (missing = 0).
  - `DEV_BLURBS` — `{ 'YYYY-MM-DD': [{ type, text | label/value/change }] }`. Types: `news` (big moments), `update` (normal work), `metric` (number + change). Only populate days worth commenting on.
- **Refresh recipe** — run `git log --all --pretty=format:"%ad" --date=short` in each repo, combine counts per date, update `DEV_COMMITS`. Add `DEV_BLURBS` entries for any new high-activity or milestone days.

### Sub-Pages (Static HTML in `public/`)
- `music.html` — Record Store: year-based releases browser with search, discography, and timeline. Uses catalog + editorial CSV to show confirmed artists' albums grouped alphabetically by artist for the selected year.
- `shop.html` — product grid, coming soon
- `data-solutions.html` — three product cards + lead form (details below)

### Data Solutions Page (`public/data-solutions.html`)
- Three products: Real Estate Analytics (In Development), Natural Wine Assistant (Concept), Marketing Analytics Consulting (Available Now)
- Lead form: Formspree `action="https://formspree.io/f/mojnzoqn"`
- "Interested In" dropdown prepended to description via JS
- Thank you state on `?submitted=1` redirect
- `lead_source` hidden field: `"Web - Data Solutions"`
- Salesforce migration ready: swap form action, add `oid` + `retURL` (structure in comments)

## Path Rules

- React assets/links: use `import.meta.env.BASE_URL` prefix
- Static HTML sub-pages: relative paths (no leading slash)
- Home link on sub-pages: `href="index.html"`
- Favicon: `href="./favicon.ico"` (relative, Vite rewrites)

## Assets

- Nav logo: `assets/guapa_logo_dark.png`
- Footer logo: same `guapa_logo_dark.png` + styled "GUAPA data" text (matches nav lockup)
- Never use `lockup_light.png` (file still exists in `public/assets/` but is unused — safe to delete)
- "collective" or "inc" → always "Guapa Data"
- "Shop" → always "Merch"

## Backend Context (guapa-data, separate repo)

- Python 3.14, MySQL 8.0 local (port 3306, DB: `guapa`, user: `guapa_user`)
- FastAPI + uvicorn for API
- Real estate analytics: Atlantic County NJ, 388k+ parcel records, MLS pending via SJSRMLS
- Guapa RE API: FastAPI parcel map server, auto-starts on login via Task Scheduler
  - Local: http://localhost:8000 | LAN: http://192.168.1.99:8000
  - Endpoints: map (`/`), parcels (`/parcels`), address search (`/search`), comps (`/comps`)
  - Not integrated into React yet — standalone HTML served by the API
- `dq_enrich.py`: daily enrichment pipeline (clean, dedup, spotify, wiki, covers, genre classify, release_date)
- `classify_genres.py`: album-level genre/subgenre classification (10 genres, 56 subgenres)
- Coffee refresh pipeline (fetch-offerings / fetch-wikidata / fetch-osm / USDA refresh) lives in `guapa-data/coffee/scripts/` — writes outputs to `src/data/coffee-*.js` in this repo via auto-commits (`[auto]` in commit message).

## External services (route through homebase, not direct)

- **Weather**: `C:\Users\eewil\homebase\` already has a weather API connection. When coffee/real-estate/anything needs weather (origin coordinates, current conditions, historical climate), source it through homebase rather than hitting a public weather API directly. Open-Meteo free tier is non-commercial only — don't reach for it. Treat weather as a server-side lookup the backend (guapa-data) proxies.
- **Email (IMAP)**: `C:\Users\eewil\homebase\gmail.py` is the shared Gmail client (used by `scripts/apply-suggestions.py` to read Formspree submissions). Any other inbox-reading work goes through it.

## Product Design Principles (Data Solutions)

1. **One tool, not three.** Reduce tool-switching.
2. **Smart pricing, not dumb defaults.** Defensible, transparent.
3. **Accuracy over polish.** Data quality first.
4. **Available to individual agents.** Solo agents and small teams, ~$40/month.
5. **AI should do the grunt work.** Smart analyst, not chatbot.
6. **Historical depth is the differentiator.** 30+ years public records.

## What Was Removed

- User ticker/scrollbar (scrolling logged-in users bar)
- Coffeeshop / Plug In login system
- Full-width yellow "Music. Coffee. Culture. New Jersey." banner
- Nav plug-in button and user state
- "Throwback" label from Artist of the Day tile
- Up-next display (was under timeline on desktop, under song tile on mobile)
- Standalone coffee page (`coffee.html`) — coffee lens on main page is the single source
- Coffee link in nav and footer
- Data Solutions yellow pill button in nav (moved to regular nav link)
- Progress bar rewind animation (bars now snap to start on song change)
- Coffee lens Highlighted Roaster card and Panther offerings grid (replaced by intro greeting + region tiles + country grid in phase 2, 2026-04-19)

## Inactive Code (kept for future user system)

These files are remnants of the removed login/ticker system. Nothing in App.jsx imports them currently, but they are **intentionally kept** for a possible future user system:
- `src/components/Ticker.jsx` + `Ticker.css` — scrolling logged-in users bar
- `src/components/ProfileModal.jsx` + `ProfileModal.css` — user profile card
- `src/components/GuapaAvatar.jsx` — avatar generator
- `src/data/guapaLogo.js` — logo SVG data for avatars
- `src/data/users.js` — mock user data

**Unrelated dead files** (safe to delete):
- `src/data/taxonomy.js` — exported but never imported anywhere
- `public/assets/lockup_light.png` — referenced in PUT_IMAGES_HERE.txt but never used

## Known Issues (as of 2026-04-04)

- **Guapa RE local link**: `data-solutions.html:65` links to `http://192.168.1.99:8000` (the Guapa RE API auto-starts on login via Task Scheduler in guapa-data). External visitors get a graceful fallback: JS checks reachability, and if the link fails, scrolls to the contact form with "Guapa RE (Early Access)" pre-selected.
- **Newsreader upright loaded**: Google Fonts import includes `Newsreader:ital,wght@0,400;1,400` — the upright weight (`0,400`) is loaded but should never be used per design rules (italic only)
- **Duplicate CNAME**: `CNAME` exists at both repo root and `public/CNAME` — only `public/CNAME` matters (Vite copies it to dist). Root CNAME is harmless but redundant.

## Social Links

- Instagram: @guapa_skate (collective), @erycwill (Eric), @0bee.media (photography)
- GitHub: ewill22

## Data Patterns to Remember

### Album sort: use shared utilities in `src/data/album-sort.js`
All album sorts MUST use the shared sort functions — never write inline `.sort()` by release_year.

**Sort priority:** `release_year` → `release_date` (YYYY-MM-DD string comparison) → catalog array index (`_idx`)

**Functions:**
- `sortAlbumsAsc(albums)` — oldest first (playback order, aux schedule, daily artist)
- `sortAlbumsDesc(albums)` — newest first (disco list, genre explorer)
- Both handle `.map((a, i) => ({ ...a, _idx: i }))` internally
- When reusing an already-sorted list, use `.reverse()` instead of re-sorting

**`release_date` field** (backfilling as of 2026-03-29):
- Backend adding `release_date` (YYYY-MM-DD) from MusicBrainz CC0 to all ~16K albums
- 2,989 albums have it now (17%), all editorial artists covered, pipeline adds 50/day until complete
- Albums are pre-sorted chronologically in catalog array, so index fallback is correct
- Frontend sort already uses `release_date` when present — no changes needed as data fills in

**For static HTML pages** (music.html) that can't import modules: replicate the full sort inline with all three tiers.

**Broken by this in the past:** Rolling Stones (12 x 5 before England's Newest Hit Makers), The Doors (Strange Days order), aux Spotify link, daily playback schedule.

## CSS Patterns to Remember

### Mobile hover double-tap fix
```css
@media (hover: hover) {
  .btn:hover { /* hover styles */ }
}
.btn:active { /* same styles for touch feedback */ }
```

### NEVER use `overflow-x: hidden` on intermediate containers
`overflow-x: hidden` (or any `overflow` besides `visible`) on an intermediate ancestor breaks `position: sticky` and clips `position: absolute` dropdowns. It creates a new scroll context — sticky elements stick to *that container* instead of the viewport, and absolute elements get clipped at its boundary.

**Broken by this in the past:** KPI sidebar (`position: sticky`), search results dropdown (`position: absolute`), disco nav rail (`position: sticky`).

**Rules:**
- NEVER put `overflow-x: hidden` on `.dashboard-hero`, `.page-layout`, `.ge`, `.blurbs-section`, or `.counter-top`
- If you need to prevent horizontal scrollbar, put `overflow-x: hidden` on `html` (the root scroll container — doesn't break sticky)
- For mobile overflow, fix the actual overflowing element (use `max-width: 100%` not `100vw`) instead of hiding overflow on parents
- `max-width: 100vw` ignores parent padding — always use `max-width: 100%` instead

### `display: contents` mobile reordering
On mobile (≤900px), `.page-main`, `.counter`, `.counter-top`, `.counter-left`, `.counter-right`, `.counter-bottom` all use `display: contents` to dissolve into `.page-layout`'s flex context. This lets `order` values interleave KPI tiles with counter children. **Every visible child needs an explicit `order`** — elements without one default to 0 and jump to the top. Current order: KPI tiles(1), greeting(2), search(3), albums(4), timeline(5), legend(6), genre explorer(7). Mobile `.page-layout` uses `align-items: stretch` so children fill full width.

### Scroll timing — use React effects, not inline timeouts
Never scroll to a newly-rendered element using `setTimeout` inside the same function that sets state. The DOM may not exist yet. Instead, use a `useEffect` that watches the state change (e.g., `[discoAlbums]`) — React guarantees the effect runs after the DOM commits. Use a short `setTimeout` inside the effect (300ms) only for paint settling, not for waiting on React.

### Visual debugging (measure first, don't guess)
When a layout issue is unclear, inject a JS debug bar that shows `getBoundingClientRect()` widths of suspect elements. Identify the actual overflowing element before writing CSS fixes.

### Key mobile breakpoints
- `900px`: counter layout reorder (timeline first on mobile)
- `768px`: genre explorer mobile styles, nav hamburger
- `600px`: search input 16px (iOS zoom prevention)
