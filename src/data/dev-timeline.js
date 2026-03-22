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
  '2026-03-17': 31,
  '2026-03-18': 21,
  '2026-03-19': 30,
  '2026-03-20': 17,
  '2026-03-21': 84,
  '2026-03-22': 32,
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
    { type: 'news', text: '31 commits. Biggest day yet. Spotify enrichment completed (955 albums). Mobile UI overhaul: sticky search bar, decade nav, zoom fixes.' },
    { type: 'update', text: 'Rankings merged into Record Store welcome view. Artist discography gets sticky nav rail with Latest/First Album buttons. Arrow key behavior refined.' },
    { type: 'update', text: 'Data Solutions header matched to Merch page. Random year on music page load. Subgenre close button made more visible. Merch added to mobile hamburger menu across all pages.' },
    { type: 'metric', label: 'Spotify Links', value: '955', change: 'albums — enrichment complete' },
  ],
  '2026-03-18': [
    { type: 'news', text: 'Front page redesigned as a coffee shop counter. L-shaped layout with daily KPI tiles (Artist/Album/Song of the Day), welcome greeting, and Bean of the Moment rotating daily.' },
    { type: 'update', text: 'Album deep-linking wired up — clicking Album of the Day on the front page opens the music page, loads the discography, and scrolls to that specific album with a highlight.' },
    { type: 'update', text: 'Music page cleanup: 30 bootlegs/promos removed from catalog, Prince catalog fixed, Unicode normalization, mobile layout fixes, album sort order corrected.' },
    { type: 'metric', label: 'Commits', value: '21', change: 'coffee shop counter launch day' },
  ],
  '2026-03-19': [
    { type: 'news', text: 'Live Now Playing system launched. Daily artist discography plays from 8am EST, timed by real track durations. Progress bar ticks every 5 seconds. Aux Cord opens when the catalog finishes.' },
    { type: 'update', text: 'Modern/throwback artist rotation. Album art in KPI tile. Up Next tucked under timeline. Colored guapa logo for Aux Cord idle state.' },
    { type: 'news', text: 'Genre Explorer merged into main page. Full genre/subgenre/artist/discography journey lifted from static music page into React. Album tiles moved to counter as 4x2 grid next to Bean of the Moment.' },
    { type: 'update', text: 'Deep-linking from KPI tiles and album art to Genre Explorer with auto-scroll to specific albums and pink highlight. Floating Latest/First/Close nav rail alongside discography.' },
    { type: 'update', text: 'Subgenre status legend (Emerging/Rising/Peak/Fading). Escape closes everything and scrolls to top. Mobile polish: tracklist sizing, zoom support, responsive nav rail.' },
    { type: 'metric', label: 'Commits', value: '30', change: 'Now Playing + Genre Explorer day' },
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
    { type: 'metric', label: 'Commits', value: '84', change: 'All-time record — rotation + catalog tags + progress bars' },
  ],
  '2026-03-22': [
    { type: 'news', text: 'Rebrand: Guapa Inc → Guapa Data. Updated across all pages, nav, footer, title, README. Footer logo replaced with styled text lockup.' },
    { type: 'update', text: 'Nav redesigned — Data Solutions and Merch moved to pill buttons on desktop (yellow outlined + pink). FTC affiliate disclosure added to footer.' },
    { type: 'update', text: 'Genre Explorer polish: bigger tabs stretching full width, nav rail switched to arrow icons, subgenre flicker fix, SUBGENRE status label, "Explore any genre below" prompt.' },
    { type: 'update', text: 'Banner now randomly alternates between two quotes on page load. Locked to initial render so lens switching doesn\'t change it.' },
    { type: 'metric', label: 'Commits', value: '32', change: 'Rebrand + nav redesign + genre polish' },
  ],
};
