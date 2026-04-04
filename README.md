# Guapa Data — v1.0

Website for Guapa Data — a data solutions company based in New Jersey.

Built with **React** and **Vite**. Auto-deploys to **GitHub Pages** on every push to `main`.

**Live:** https://guapa.space

## What It Is

Two sides that reinforce each other:

- **Creative Side** — record store, coffee shop, timeline. Portfolio pieces showing what clean data and polished frontends can do.
- **Serious Side** — Guapa Data Solutions. Real estate analytics, marketing consulting. The creative work serves as proof of quality.

## Tech Stack

- **Framework:** Vite + React
- **Styling:** CSS (no Tailwind, no CSS-in-JS)
- **Fonts:** Instrument Sans (UI) + Newsreader italic (editorial)
- **Deployment:** GitHub Actions CI/CD to GitHub Pages (auto-deploys on push to `main`)

## Quick Start

```bash
npm install
npm run dev
```

## Site Structure

**Hybrid approach:** The homepage is a React SPA with lens-based views (music, coffee, economics). Sub-pages are static HTML in `public/`.

| Route | Type | Description |
|-------|------|-------------|
| `/` | React | Main page — daily artist rotation, genre explorer, coffee/economics lenses |
| `/music.html` | Static | Record Store — year-based releases browser with search and discography |
| `/data-solutions.html` | Static | Three product cards + lead form |
| `/contribute.html` | Static | Community suggestion form for editorial descriptions |
| `/shop.html` | Static | Merch (coming soon) |
| `/privacy.html` | Static | Privacy policy |
| `/terms.html` | Static | Terms of service |

## Teams

| Team | Owns |
|------|------|
| **Frontend** | React app, static pages, CSS, components, UX |
| **Content / Editorial** | Artist & album descriptions, icons (`public/data/artist-editorial.csv`, `public/data/album-editorial.csv`) |
| **Backend** (guapa-data) | Data pipelines, enrichment, genre classification (separate repo) |

## Backend Pipeline

A separate repo (`guapa-data`) runs a daily enrichment pipeline at 5am:

1. Cleans and dedupes the music catalog (~824 artists, ~16K albums)
2. Pulls Spotify metadata, covers, and links
3. Enriches `release_date` from MusicBrainz (CC0, 50/day backfill)
4. Classifies genres at the album level (10 genres, 56 subgenres)
5. Exports `music-catalog.json` and auto-pushes to this repo

The frontend picks it up on the next deploy — no manual steps.

## Editorial Pipeline

The Content team writes artist and album descriptions in batches of 5. Editorial lives in two CSVs in `public/data/`:

- **`artist-editorial.csv`** — artist name, icon, description, confirmed/drafted status, eric_take
- **`album-editorial.csv`** — per-album blurbs highlighting standout tracks

New catalog artists are auto-added to the editorial CSV by `scripts/sync-editorial-csv.py` during CI. The Content team drafts descriptions, Eric reviews and confirms.

**Community suggestions** — visitors can propose description edits via `/contribute.html`. Submissions go to Formspree, and an automated pipeline applies them hourly (with backups and logging).

## Deployment

Automatic via GitHub Actions on every push to `main`. Custom domain `guapa.space` is active (`public/CNAME`). Base path is `/`.

## Versioning

- **v1.0** — tagged and branched as `v1-stable` on 2026-04-04. Full launch: record store, genre explorer, coffee/economics lenses, data solutions, editorial pipeline, community suggestions.

## Design

Dark theme (`#0a0a0a` background), flat colors only, no gradients. See `CLAUDE.md` for full design tokens and component specs.
