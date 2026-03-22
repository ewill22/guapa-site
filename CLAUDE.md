# CLAUDE.md — Guapa Site (Frontend)

## Role

You are the frontend expert for Guapa Inc. You own the visual frontend, editorial details, and user experience across the entire guapa-site repo. The backend team (guapa-data) owns data pipelines, enrichment, and classification — they push data to you via auto-commits.

**Design guide**: `C:\Users\eewil\homebase\GUAPA_DESIGN_GUIDE.md` — the authoritative reference for colors, typography, spacing, cards, buttons, and interactive states. Read it before styling anything.

## Company Vision

Guapa Inc is a creative collective and data solutions company run by Eric, based in New Jersey. Two sides that reinforce each other:

**The Creative Side** — record store, coffee shop, timeline. Portfolio pieces that show what clean data pipelines and polished frontends can do.

**The Serious Side** — Guapa Data Solutions. Real estate analytics, marketing consulting. The creative projects serve as proof of quality.

The creative work sells the serious work. A potential client explores the record store, sees the quality, and clicks into Data Solutions.

## Tech Stack

- **Framework**: Vite + React
- **Styling**: CSS (no Tailwind, no CSS-in-JS)
- **Fonts**: Instrument Sans (UI) + Newsreader italic only (editorial headlines, about, newsletter)
- **Deployment**: GitHub Actions CI/CD → GitHub Pages (every push to main auto-deploys)
- **Live URL**: https://ewill22.github.io/guapa-site (custom domain pending)
- **Repo**: https://github.com/ewill22/guapa-site (username: ewill22)
- **Base path**: `vite.config.js` has `base: '/guapa-site/'` — remove when custom domain is added
- **Workflow**: `.github/workflows/deploy.yml` (uses `npm install`, not `npm ci`)
- **npm/node**: NOT available in bash shell — run npm commands in a separate terminal

## Frontend ↔ Backend Pipeline

**guapa-data** (backend, separate repo) auto-pushes to guapa-site:

```
5am daily:
  guapa-data runs dq_enrich.py
    → cleans/dedupes albums (2,401 albums, 144 artists)
    → pulls Spotify metadata + covers + links
    → classifies genres at album level (classify_genres.py)
    → exports slim music-catalog.json
    → git push to guapa-site/public/data/music-catalog.json

guapa-site receives push
    → GitHub Actions builds + deploys
    → Live on GitHub Pages within minutes
```

- Backend commits show as `[auto]` in git log — these are safe, just catalog updates
- Backend owns: data quality, enrichment, genre classification, album-level tagging
- Frontend owns: how that data is displayed, UX, editorial content, styling

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
- Logo text: "GUAPA" at 1.8rem bold + "inc" at 0.6rem weight 400
- Links: Music, Coffee, Data Solutions, Photography, About, Merch
- Static HTML pages use inline styles to match React nav exactly

### Main Page (React — `src/App.jsx`)

1. **Nav** (`src/components/Nav.jsx`)
2. **Yellow italic banner** ("yearning for something to keep him up at night")
3. **Coffee Shop Counter** (L-shaped layout):
   - **Top row (desktop)**: KPI tiles + Timeline
   - **Top row (mobile ≤900px)**: Timeline first (`order: -1`), then KPI tiles
   - **Bottom row**: Welcome greeting | Search bar w/ legend (music lens) or Bean of the Moment | Album tiles (4x2 grid)
4. **Below counter** — lens-specific content:
   - **Music lens** (default): Genre Explorer
   - **Guapa lens**: Weekly dev blurbs (Fri–Thu grouping)
   - **Other lenses**: Text blurbs for coffee/economics
5. **Newsletter** (pink background, email signup)
6. **Footer** (`src/components/Footer.jsx`)

### KPI Tiles (Now Playing System)
Three tiles stacked vertically, each with a color-matched progress bar:

| Tile | Border | Progress Bar | Content |
|------|--------|-------------|---------|
| Artist of the Day | pink | pink — full discography progress | Artist name, album/track counts |
| Current Album | yellow | yellow — album progress + track X/Y | Album art, title, year |
| Now Playing | blue | blue — track progress | Song title |

- **Up-next**: shown under timeline on desktop, under song tile on mobile (CSS show/hide at 900px)
- Tiles are clickable — deep-link into Genre Explorer

### Daily Artist Rotation (`getDailyArtist` in App.jsx)
- **Rotation-based**: no repeats until entire pool is exhausted
- **Two pools**: throwback (`begin_year < 1991`) and modern (`begin_year >= 1991`), alternating days
- **Pool sizes**: ~123 throwback (246 days no repeat), ~21 modern (42 days no repeat)
- **Deterministic**: `shufflePool(pool, cycleId)` sorts by `hashStr(cycleId + artistName)`, steps through one per day
- **Stable**: catalog changes don't shift picks (sorted by name hash, not array index)
- **Epoch**: 2026-03-21 (rotation start date)
- **Schedule**: plays discography chronologically starting 8am EST, tracks advance by `duration_ms`
- **Aux Cord**: when discography finishes, random year, deep link cleared

### On-Load Behavior
- Year starts as `null` (no flash of random year)
- Once `nowPlaying` resolves: year syncs to playing album's `release_year`
- Genre Explorer auto-deep-links to playing artist's genre tab + subgenre + discography
- `initialDeepLinked` ref prevents re-triggering on album changes
- Year-change effect skips when `discoArtist` is showing (prevents race condition)

### Genre Explorer (`src/components/GenreExplorer.jsx`)

**Data sources**:
- `src/data/music-data.js` — editorial data: genre hierarchy, artist icons/descriptions, curated albums, status ranges per year (`S()` function)
- `public/data/music-catalog.json` — full catalog: 144 artists, 2,218+ albums with tracks, cover art, Spotify/Wiki/Amazon links, **album-level genre/subgenre tags**

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

**Mobile (≤768px)**:
- Genre tabs wrap (no horizontal scroll)
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

### Sub-Pages (Static HTML in `public/`)
- `music.html` — original genre explorer (still works standalone)
- `coffee.html` — roaster timeline
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
- Footer logo: `assets/guapa_inc_logo.png` (height 60px)
- Never use `lockup_light.png` (removed)
- "collective" → always "Guapa Inc"
- "Shop" → always "Merch"

## Backend Context (guapa-data, separate repo)

- Python 3.14, MySQL 8.0 local (port 3306, DB: `guapa`, user: `guapa_user`)
- FastAPI + uvicorn for API
- Real estate analytics: Atlantic County NJ, 388k+ parcel records, MLS via SJSRMLS
- Parcel map: standalone HTML at localhost:8000 (not integrated into React yet)
- `dq_enrich.py`: daily enrichment pipeline (clean, dedup, spotify, wiki, covers, genre classify)
- `classify_genres.py`: album-level genre/subgenre classification (9 genres, 35 subgenres)
- 31 new artist candidates pre-classified, ready to add to editorial data

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

## Social Links

- Instagram: @guapa_skate (collective), @erycwill (Eric), @0bee.media (photography)
- GitHub: ewill22

## CSS Patterns to Remember

### Mobile hover double-tap fix
```css
@media (hover: hover) {
  .btn:hover { /* hover styles */ }
}
.btn:active { /* same styles for touch feedback */ }
```

### Visual debugging (measure first, don't guess)
When a layout issue is unclear, inject a JS debug bar that shows `getBoundingClientRect()` widths of suspect elements. Identify the actual overflowing element before writing CSS fixes.

### Key mobile breakpoints
- `900px`: counter layout reorder (timeline first on mobile)
- `768px`: genre explorer mobile styles, nav hamburger
- `600px`: search input 16px (iOS zoom prevention)
