# Guapa — Creative Collective

React + Vite site for the Guapa creative collective. Deployed automatically to GitHub Pages on every push to `main`.

**Live:** https://ewill22.github.io/guapa-site *(custom domain coming)*

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

## Project Structure

```
guapa-site/
├── public/                    # Static files served as-is
│   ├── favicon.ico
│   ├── music.html             # Music page (standalone)
│   ├── music.css
│   ├── coffee.html            # Coffee page (standalone)
│   ├── shop.html              # Shop page (standalone)
│   ├── shop.css
│   ├── styles.css             # Shared base styles for static pages
│   └── assets/
│       ├── guapa_logo_dark.png
│       ├── lockup_light.png
│       ├── tshirt-pink.webp
│       └── tshirt-grey.webp
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Home page
│   ├── App.css                # Home page styles
│   ├── styles/
│   │   └── global.css         # Design system (colors, fonts, reset)
│   ├── components/
│   │   ├── Nav.jsx/css        # Site navigation
│   │   ├── Banner.jsx/css     # Yellow italic top banner
│   │   └── Footer.jsx/css     # Site footer
│   └── data/
│       ├── timeline.js        # Lens/year event data
│       └── taxonomy.js        # Taxonomy branch data
├── .github/workflows/
│   └── deploy.yml             # GitHub Actions — build + deploy to Pages
├── index.html
├── vite.config.js
└── package.json
```

## Architecture

**Hybrid:** The homepage is a React SPA, while Music, Coffee, and Shop are static HTML pages served from `/public`.

- `/` → React app (timeline + taxonomy + newspaper front page)
- `/music.html` → Static HTML
- `/coffee.html` → Static HTML
- `/shop.html` → Static HTML

All asset paths in React use `import.meta.env.BASE_URL`. Static pages use relative paths (no leading slash). Home links on static pages use `href="index.html"`.

## Deployment

Handled automatically via GitHub Actions on push to `main`. No manual steps needed.

To deploy manually, trigger the workflow from the **Actions** tab in GitHub.

**Note:** `vite.config.js` has `base: '/guapa-site/'` for GitHub Pages subdirectory hosting. Remove this line when a custom domain is connected.

## Design System

- Background: `#0a0a0a`, light text
- Fonts: Instrument Sans (main), Newsreader (serif/italic)
- Accents: pink `#e8a0b0`, yellow `#f0c014`, blue `#6ab0e8`, green `#7ec89b`, amber `#c89b6a`
