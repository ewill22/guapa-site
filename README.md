# Guapa Data

Website for Guapa Data — a data solutions company based in New Jersey.

Built with **React** (a JavaScript framework that builds interactive, app-like pages in the browser — no full page reloads) and **Vite** (a build tool that bundles the code and serves it fast during development). The site auto-deploys to **GitHub Pages** (free static hosting from GitHub) every time code is pushed — no manual uploads or server management needed.

**Live:** https://ewill22.github.io/guapa-site *(custom domain coming)*

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

**Hybrid approach:** The homepage is a **React SPA** (Single Page Application — one page that dynamically updates content without reloading, making it feel fast and app-like). The sub-pages (Music, Coffee, Merch, Data Solutions) are **static HTML** — simpler, standalone pages that don't need React's interactivity. They live in the `public/` folder and are served as-is.

| Route | Type | Description |
|-------|------|-------------|
| `/` | React | Main page — daily artist rotation, genre explorer, coffee counter |
| `/music.html` | Static | Standalone genre explorer |
| `/coffee.html` | Static | Roaster timeline |
| `/shop.html` | Static | Merch (coming soon) |
| `/data-solutions.html` | Static | Product cards + lead form |

## Backend Pipeline

A separate repo (`guapa-data`) runs a daily enrichment pipeline at 5am:

1. Cleans and dedupes the music catalog
2. Pulls Spotify metadata, covers, and links
3. Classifies genres at the album level (9 genres, 35 subgenres)
4. Exports `music-catalog.json` and auto-pushes to this repo

The frontend picks it up on the next deploy — no manual steps.

## Deployment

Automatic via GitHub Actions on every push to `main`. `vite.config.js` has `base: '/guapa-site/'` for GitHub Pages — remove when custom domain is added.

## Design

Dark theme (`#0a0a0a` background), flat colors only, no gradients. See `CLAUDE.md` for full design tokens and component specs.
