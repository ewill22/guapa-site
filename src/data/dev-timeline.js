// Dev Timeline — commit activity and daily summaries across all Guapa repos
// First commit: 2026-02-19 (guapa-data), first site commit: 2026-02-28
// Update this file as development continues

export const DEV_FIRST_DATE = '2026-02-19';

// Combined commit counts per day (guapa-site + guapa-data)
export const DEV_COMMITS = {
  '2026-02-19': 1,
  '2026-02-21': 3,
  '2026-02-22': 8,
  '2026-02-28': 6,
  '2026-03-01': 19,
  '2026-03-10': 4,
  '2026-03-11': 10,
  '2026-03-12': 1,
  '2026-03-14': 8,
  '2026-03-15': 17,
  '2026-03-16': 4,
  '2026-03-17': 32,
  '2026-03-18': 33,
  '2026-03-19': 31,
  '2026-03-20': 17,
  '2026-03-21': 100,
  '2026-03-22': 39,
  '2026-03-23': 20,
  '2026-03-24': 9,
  '2026-03-25': 4,
  '2026-03-26': 11,
  '2026-03-27': 32,
  '2026-03-28': 56,
  '2026-03-29': 48,
  '2026-03-30': 2,
  '2026-03-31': 3,
  '2026-04-02': 22,
  '2026-04-03': 2,
  '2026-04-04': 22,
  '2026-04-05': 12,
  '2026-04-06': 16,
  '2026-04-07': 16,
  '2026-04-08': 2,
  '2026-04-09': 5,
  '2026-04-10': 15,
  '2026-04-11': 4,
  '2026-04-12': 19,
  '2026-04-13': 5,
  '2026-04-14': 3,
  '2026-04-15': 3,
  '2026-04-16': 5,
  '2026-04-17': 15,
  '2026-04-18': 14,
  '2026-04-19': 12,
};

// Daily summaries — what got done each active day
export const DEV_BLURBS = {
  '2026-02-19': [
    { type: 'update', text: 'Day 0. Initial repo setup for guapa-data. The backend begins.' },
  ],
  '2026-02-21': [
    { type: 'update', text: 'Built the Atlantic County GDB ingestion pipeline. FastAPI parcel map API and Leaflet frontend stood up.' },
  ],
  '2026-02-22': [
    { type: 'update', text: 'Big data day. SR1A sales records pipeline built. Address search with FULLTEXT index, address/lot view toggle, abbreviation expansion. 8 commits.' },
    { type: 'metric', label: 'Parcels Loaded', value: '173K+', change: 'Atlantic County polygons' },
  ],
  '2026-02-28': [
    { type: 'news', text: 'Guapa site goes live. Vite + React migration, GitHub Pages deployment, coffeeshop page. The front door opens.' },
    { type: 'metric', label: 'Commits', value: '6', change: 'First day of the site' },
  ],
  '2026-03-01': [
    { type: 'update', text: '19 commits. Added Data Solutions page, Formspree lead form, newspaper-style front page. Stripped the ticker bar. Unified branding across all pages.' },
    { type: 'news', text: 'Merch page launched. Footer logo standardized. Nav consistency achieved across all pages.' },
  ],
  '2026-03-10': [
    { type: 'update', text: 'Shared design tokens published as guapa-base.css. Data Solutions card polish. Guapa RE link added.' },
    { type: 'update', text: 'Real estate: added 5-mile comp radius with map circle visualization.' },
  ],
  '2026-03-11': [
    { type: 'news', text: 'The Music page gets its soul. Timeline simplified to lens selector + blurbs. Artist discography section replaces blog posts. Deep linking from main page wired up.' },
    { type: 'metric', label: 'Commits', value: '10', change: 'Biggest music page day yet' },
  ],
  '2026-03-12': [
    { type: 'update', text: 'CLAUDE.md updated to reflect the full project state. Documentation day.' },
  ],
  '2026-03-14': [
    { type: 'update', text: 'Music API integration with static catalog fallback for GitHub Pages. Real album art in rankings popup. Amazon affiliate links wired up.' },
    { type: 'news', text: 'Genre layout pivoted from sidebar to horizontal tabs with subgenres flowing downward. Dynamic rankings built from musicData.' },
    { type: 'metric', label: 'Catalog', value: '66', change: 'artists with real discography data' },
  ],
  '2026-03-15': [
    { type: 'news', text: 'The catalog explodes. Song search added. MusicBrainz Wikipedia URLs and Spotify links enriched at build time. Welcome view added as default landing.' },
    { type: 'metric', label: 'Artists', value: '144', change: 'Complete editorial catalog' },
    { type: 'metric', label: 'Wiki URLs', value: '297', change: 'albums with verified Wikipedia links' },
  ],
  '2026-03-16': [
    { type: 'update', text: 'Spotify enrichment scaled up with batch processing and rate limit detection. 367 album Spotify URLs added via build-time enrichment.' },
    { type: 'metric', label: 'Spotify Links', value: '367', change: 'albums enriched' },
  ],
  '2026-03-17': [
    { type: 'news', text: 'Biggest day yet. Spotify enrichment completed (955 albums). Mobile UI overhaul: sticky search bar, decade nav, zoom fixes.' },
    { type: 'update', text: 'Rankings merged into Record Store welcome view. Artist discography gets sticky nav rail with Latest/First Album buttons. Arrow key behavior refined.' },
    { type: 'update', text: 'Data Solutions header matched to Merch page. Random year on music page load. Subgenre close button made more visible. Merch added to mobile hamburger menu across all pages.' },
    { type: 'metric', label: 'Spotify Links', value: '955', change: 'albums — enrichment complete' },
  ],
  '2026-03-18': [
    { type: 'news', text: 'Front page redesigned as a coffee shop counter. L-shaped layout with daily KPI tiles (Artist/Album/Song of the Day), welcome greeting, and Bean of the Moment rotating daily.' },
    { type: 'update', text: 'Album deep-linking wired up — clicking Album of the Day on the front page opens the music page, loads the discography, and scrolls to that specific album with a highlight.' },
    { type: 'update', text: 'Music page cleanup: 30 bootlegs/promos removed from catalog, Prince catalog fixed, Unicode normalization, mobile layout fixes, album sort order corrected.' },
    { type: 'metric', label: 'Commits', value: '33', change: 'coffee shop counter launch day' },
  ],
  '2026-03-19': [
    { type: 'news', text: 'Live Now Playing system launched. Daily artist discography plays from 8am EST, timed by real track durations. Progress bar ticks every 5 seconds. Aux Cord opens when the catalog finishes.' },
    { type: 'update', text: 'Modern/throwback artist rotation. Album art in KPI tile. Up Next tucked under timeline. Colored guapa logo for Aux Cord idle state.' },
    { type: 'news', text: 'Genre Explorer merged into main page. Full genre/subgenre/artist/discography journey lifted from static music page into React. Album tiles moved to counter as 4x2 grid next to Bean of the Moment.' },
    { type: 'update', text: 'Deep-linking from KPI tiles and album art to Genre Explorer with auto-scroll to specific albums and pink highlight. Floating Latest/First/Close nav rail alongside discography.' },
    { type: 'update', text: 'Subgenre status legend (Emerging/Rising/Peak/Fading). Escape closes everything and scrolls to top. Mobile polish: tracklist sizing, zoom support, responsive nav rail.' },
    { type: 'metric', label: 'Commits', value: '31', change: 'Now Playing + Genre Explorer day' },
  ],
  '2026-03-20': [
    { type: 'update', text: 'Mobile deep dive. Fixed iOS Safari auto-zoom, horizontal overflow, and genre tab wrapping. Replaced all scrollIntoView with custom safeScrollTo helper.' },
    { type: 'update', text: 'Search bar moved into counter. Search results now deep-link to albums with icons. Subgenre status colors reworked — emerging green, fading muted red dashed.' },
    { type: 'metric', label: 'Commits', value: '17', change: 'Mobile polish day' },
  ],
  '2026-03-21': [
    { type: 'news', text: 'Album-level genre tags wired up from backend catalog. Subgenres now visible based on real album data, not just editorial ranges. Hybrid visibility system live.' },
    { type: 'update', text: 'Daily artist rotation rewritten — no-repeat cycle system with throwback/modern pools. Epoch set to March 21. Stable against catalog changes.' },
    { type: 'update', text: 'Progress bars added at three levels: artist (pink), album (yellow), song (blue). Up-next moved below song tile on mobile. CLAUDE.md fully rewritten.' },
    { type: 'metric', label: 'Commits', value: '100', change: 'All-time record — rotation + catalog tags + progress bars' },
  ],
  '2026-03-22': [
    { type: 'news', text: 'Rebrand: Guapa Inc → Guapa Data. Updated across all pages, nav, footer, title, README. Footer logo replaced with styled text lockup.' },
    { type: 'update', text: 'Nav redesigned — Data Solutions and Merch moved to pill buttons on desktop (yellow outlined + pink). FTC affiliate disclosure added to footer.' },
    { type: 'update', text: 'Genre Explorer polish: bigger tabs stretching full width, nav rail switched to arrow icons, subgenre flicker fix, SUBGENRE status label, "Explore any genre below" prompt.' },
    { type: 'update', text: 'Banner now randomly alternates between two quotes on page load. Locked to initial render so lens switching doesn\'t change it.' },
    { type: 'metric', label: 'Commits', value: '39', change: 'Rebrand + nav redesign + genre polish' },
  ],
  '2026-03-23': [
    { type: 'news', text: 'LATIN genre launched — Bad Bunny confirmed, 8 subgenres auto-created from catalog tags. Search filtered to editorial-confirmed artists only.' },
    { type: 'update', text: 'Deep link now jumps timeline to artist\'s first album year when subgenre isn\'t visible. Discography auto-closes when year changes out of range.' },
    { type: 'update', text: 'Aux Cord polish — green pulsing badge when available, opens first album Spotify URL. Fading subgenres drop dashed border for cleaner look.' },
    { type: 'metric', label: 'Commits', value: '20', change: 'LATIN genre + search gating + aux polish' },
  ],
  '2026-03-24': [
    { type: 'update', text: 'Terms of Service and Privacy Policy pages added. Footer standardized to 4-column grid across all pages. Tyler Childers catalog fixed.' },
    { type: 'metric', label: 'Commits', value: '9', change: 'Legal pages + footer cleanup' },
  ],
  '2026-03-25': [
    { type: 'news', text: 'Editorial infrastructure launched — artist-editorial.csv gets original/drafted columns, album-editorial.csv created. First batch of 5 artists confirmed.' },
    { type: 'metric', label: 'Commits', value: '4', change: 'Editorial pipeline day' },
  ],
  '2026-03-26': [
    { type: 'news', text: 'Custom domain guapa.space goes live. Base path switched from /guapa-site/ to /. CNAME added.' },
    { type: 'update', text: 'New releases view added for Fri-Sun — shows weekly drops with cover art and track listings. Music renamed to Record Store in nav.' },
    { type: 'metric', label: 'Commits', value: '11', change: 'Custom domain + new releases view' },
  ],
  '2026-03-27': [
    { type: 'news', text: 'KPI tiles redesigned as sticky left sidebar. Search/legend/albums nested in counter-right. Album editorial descriptions show in discography view.' },
    { type: 'update', text: 'Record Store rebuilt as year-based releases browser with A-Z alphabet nav, close button, and back-to-top. Catalog grows to 919 artists.' },
    { type: 'update', text: 'Editorial batches 2-4 confirmed — 89 artists total with 196 album descriptions. Tweet-sourced voice column added.' },
    { type: 'metric', label: 'Artists', value: '919', change: '+94 new catalog artists' },
    { type: 'metric', label: 'Commits', value: '32', change: 'Sidebar redesign + record store rebuild' },
  ],
  '2026-03-28': [
    { type: 'news', text: 'Coffee lens built out — Panther Coffee as featured roaster with offerings grid, region tiles, and year-based coffee blurbs.' },
    { type: 'update', text: 'Genre Explorer artists filtered by selected year. Genre tabs resized to 6+5 layout. Artist bio and links moved into discography header.' },
    { type: 'update', text: 'Year persistence switched from localStorage to sessionStorage. Manual timeline changes pin the year, stop auto-sync. Aux Spotify link fixed.' },
    { type: 'update', text: 'Mobile layout fixed — overflow-x hidden removed from intermediate containers, display:contents ordering corrected, scroll timing moved to React effects.' },
    { type: 'metric', label: 'Commits', value: '56', change: 'All-time record — coffee lens + mobile fixes + year persistence' },
  ],
  '2026-03-29': [
    { type: 'news', text: 'Genre tiles restyled as cards — dark background, vertical layout, matching coffee region tile design. Random genre tile fills the 12th grid spot with dashed border.' },
    { type: 'update', text: 'Nav simplified — Coffee link and standalone coffee page removed (coffee lens is the single source). Data Solutions moved from yellow pill to regular nav link.' },
    { type: 'update', text: 'Timeline year locked to currently playing album during daily artist playback. Progress bars snap to start on song change instead of rewinding. Up-next display removed.' },
    { type: 'update', text: 'Mobile layout reordered — KPI tiles moved to top (flush against banner), search bar full-width centered, Escape/close scrolls to just below yellow banner.' },
    { type: 'update', text: 'Buy CD button added alongside Buy Vinyl in album actions. Subgenre count hidden until catalog fully loads to prevent flicker.' },
    { type: 'metric', label: 'Commits', value: '48', change: 'Nav + genre tiles + mobile layout + timeline lock' },
  ],
  '2026-04-02': [
    { type: 'news', text: 'Contribute page launched at guapa.space/contribute. Visitors can submit description edits and icon suggestions; Formspree pipes submissions to email.' },
    { type: 'update', text: 'apply-suggestions.py ships — reads Formspree emails via IMAP (homebase gmail connection), patches CSVs, backs up originals, logs every change.' },
    { type: 'update', text: 'Editorial batch 5: 2Pac, Aaliyah, ABBA, Aerosmith, Al Green. Contribute filter defaults to All with missing/has description toggle.' },
    { type: 'metric', label: 'Commits', value: '22', change: 'Community contributions go live' },
  ],
  '2026-04-04': [
    { type: 'news', text: 'Timeline extended back to 1930 (was 1960). Aux cord behavior, member/member_of chips in Genre Explorer disco header, v1.0 README.' },
    { type: 'update', text: 'Contribute page gets Included/confirmed toggle. Flea + Frusciante member relationships added. Guapa RE fallback for external visitors.' },
    { type: 'metric', label: 'Commits', value: '22', change: 'Timeline deepens + member chips' },
  ],
  '2026-04-05': [
    { type: 'update', text: 'Editorial suggestions pipeline matured — confirmed field parsed, 9 suggestions applied. RHCP toggle chaos fixed. Spotify links for RHCP, Flea, Frusciante.' },
    { type: 'metric', label: 'Commits', value: '12', change: 'Suggestions flowing in live' },
  ],
  '2026-04-06': [
    { type: 'news', text: 'Track-level enrichment lands. Genius links (yellow pills), cover badges (blue), writer credits — first pass rendered in tracklists. Track enrichment spec doc published.' },
    { type: 'update', text: 'Editorial batches: Gary Moore, Hank Mobley, Snoop Dogg, Sarah Vaughan, Tool; James Blake, Robbie Williams, Talk Talk, Thievery Corp, DIR EN GREY. Writer link color settled on blue to match covers.' },
    { type: 'metric', label: 'Commits', value: '16', change: 'Track-level enrichment day' },
  ],
  '2026-04-07': [
    { type: 'update', text: 'Buy CD links on Record Store page. Arctic Monkeys + Taylor Swift track enrichment. Editorial batch: Suzi Quatro, Supergrass, The Drifters, Dream Theater, Faithless.' },
    { type: 'update', text: 'Genius URLs now on all tracks site-wide. Member role fields removed from catalog (chips-only).' },
    { type: 'metric', label: 'Commits', value: '16', change: 'CD links + catalog enrichment' },
  ],
  '2026-04-09': [
    { type: 'news', text: 'Auto-confirm rule added to sync-editorial-csv.py — any artist with track-level cover flags or writer credits gets flipped to confirmed=yes. Backend enrichment → live with zero manual work.' },
    { type: 'metric', label: 'Commits', value: '5', change: 'Enrichment drives editorial state' },
  ],
  '2026-04-10': [
    { type: 'news', text: 'Interpolation badge joins cover/writer enrichment. Backend ships recording-credits-based interpolation detection with in_catalog source links.' },
    { type: 'update', text: 'Editorial audit: 17 album descriptions referencing wrong-album tracks corrected. 11 new confirmed artists (Britney, Christina, Hendrix Experience, Bobby Darin, Frusciante, …) with 20 album descriptions.' },
    { type: 'update', text: 'CLAUDE.md gets editorial priority rules: confirmed-gaps first, always cross-reference track listings before writing blurbs.' },
    { type: 'metric', label: 'Commits', value: '15', change: 'Interpolation + editorial audit' },
  ],
  '2026-04-12': [
    { type: 'news', text: 'Record Store tracklists catch up with main site — Genius links, writer credits, cover + interpolation badges on every track.' },
    { type: 'update', text: 'Album descriptions show in Record Store view. New releases section: Thursday preview, collab dedup, Genius/writer/cover cross-reference from catalog.' },
    { type: 'update', text: 'Ella Langley added (catalog + editorial + track enrichment). Wiki links fall back to album Wikipedia pages instead of artist pages.' },
    { type: 'update', text: 'apply-suggestions.py learns to pull --rebase before push to survive backend auto-commits diverging main.' },
    { type: 'metric', label: 'Commits', value: '19', change: 'Record Store parity + new releases polish' },
  ],
  '2026-04-17': [
    { type: 'update', text: 'Editorial for Def Leppard, Paul McCartney, Simple Minds, ZAYN. Melanie Martinez HADES + Spotify URLs. Pink favicon and inc logo.' },
    { type: 'update', text: 'Artist _endYear extended by 3 years to match subgenre fading logic — catalog artists no longer vanish the moment their last release lands.' },
    { type: 'metric', label: 'Commits', value: '15', change: 'Editorial + catalog corrections' },
  ],
  '2026-04-18': [
    { type: 'news', text: 'Coffee lens phase 1 ships. Multi-source harvest data foundation: USDA FAS PSD fully ingested (29 producers, 1960–present), Conab Brazil seeded (4 verified years), 2021 frost event as the "sources disagree" exemplar.' },
    { type: 'update', text: 'coffee-harvest.js refactored to multi-source schema with COFFEE_SOURCES catalog, OVERLAY_PRODUCERS, COFFEE_EVENTS, and helpers that accept an optional source arg. Backend handoff docs written.' },
    { type: 'update', text: 'Editorial: My Chemical Romance added. Catalog: 6 posthumous/bootleg albums pulled. MCR Spotify URLs (4 albums).' },
    { type: 'metric', label: 'Commits', value: '14', change: 'Coffee data foundation + editorial' },
  ],
  '2026-04-19': [
    { type: 'news', text: 'Coffee lens phase 2 ships. Four region tiles swap in for the Highlighted Roaster section; selecting a region filters a full-width country grid below. Every country gets a 12-month grow calendar with flowering/harvest/resting phases.' },
    { type: 'update', text: 'Grow calendar labeled editorial — every country has per-country refs (ICO + USDA + national boards where applicable). Methodology and source links clickable from the Editorial pill.' },
    { type: 'update', text: 'Intro greeting: "Listen to the world through music. Explore it through coffee." Region tiles stretch full width of the counter-bottom.' },
    { type: 'metric', label: 'Commits', value: '12', change: 'Coffee lens phase 2 live' },
  ],
};
