# Guapa — Creative Collective

React + Vite site with coffeeshop social layer, multi-lens timeline, and taxonomy explorer.

## Quick Start

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Output in `dist/` — deploy anywhere (Vercel, Netlify, Cloudflare Pages, etc).

## Project Structure

```
guapa-site/
├── public/                    # Static files served as-is
│   ├── favicon.ico            # Guapa G favicon
│   ├── music.html             # Music page (original, standalone)
│   ├── music.css
│   ├── coffee.html            # Coffee page (original, standalone)
│   ├── shop.html              # Shop page (Shopify-ready placeholder)
│   ├── shop.css
│   ├── styles.css             # Shared base styles for static pages
│   └── assets/                # PUT YOUR IMAGES HERE
│       ├── guapa_logo_dark.png    ← needed for about section + static pages
│       ├── lockup_light.png       ← needed for footer
│       ├── tshirt-pink.webp       ← shop product images
│       └── tshirt-grey.webp
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Home page — timeline + coffeeshop + about
│   ├── App.css                # Home page styles
│   ├── styles/
│   │   └── global.css         # Design system (colors, fonts, reset)
│   ├── components/
│   │   ├── Nav.jsx/css        # Site navigation (matches original)
│   │   ├── Banner.jsx/css     # Yellow italic banner
│   │   ├── Footer.jsx/css     # Site footer (matches original)
│   │   ├── Ticker.jsx/css     # Coffeeshop scrolling presence bar
│   │   ├── ProfileModal.jsx/css  # User profile popup
│   │   └── GuapaAvatar.jsx    # G logo in user-specific colors
│   └── data/
│       ├── guapaLogo.js       # Base64 encoded Guapa G for avatars
│       ├── timeline.js        # All lens/year event data
│       ├── taxonomy.js        # Expandable taxonomy branches
│       └── users.js           # Mock coffeeshop users
├── index.html                 # Vite HTML entry
├── vite.config.js
└── package.json
```

## What's New vs. Original Site

| Feature | Before | After |
|---------|--------|-------|
| Homepage | Static HTML | React with multi-lens timeline |
| Timeline | World only | 5 lenses: World, Music, Tech, Coffee, Economics |
| Coffeeshop | N/A | Live scrolling ticker with user avatars |
| Avatars | N/A | Guapa G logo in per-user colors |
| Taxonomy | N/A | Expandable data branches per lens/year |
| Music page | Standalone | Standalone (unchanged, in /public) |
| Coffee page | Standalone | Standalone (unchanged, in /public) |
| Shop page | Standalone | Standalone (Shopify-ready, in /public) |
| Steconomics | Standalone | Removed per request |

## Required Assets

You need to add these image files to `public/assets/`:
- `guapa_logo_dark.png` — used in About section and static pages
- `lockup_light.png` — used in Footer
- `tshirt-pink.webp` / `tshirt-grey.webp` — shop product images

## Architecture Notes

**Hybrid approach**: The homepage is React (SPA), while Music, Coffee, and Shop
are served as static HTML from `/public`. This means:

- `/` → React app (timeline + coffeeshop)
- `/music.html` → Static HTML (your existing music page)
- `/coffee.html` → Static HTML (your existing coffee page)
- `/shop.html` → Static HTML (Shopify-ready)

When you're ready, these can be migrated to React components one at a time.

**Shopify integration**: The shop page is a static placeholder. When you're ready
to connect Shopify, you can either:
1. Embed Shopify Buy Button JS on the existing `shop.html`
2. Use Shopify's Storefront API with a React component
3. Redirect `/shop` to your Shopify store

**Coffeeshop backend**: Currently uses mock data. To make it real:
1. Add Supabase Realtime or WebSockets for presence
2. Add authentication (Supabase Auth, Clerk, etc.)
3. Store user profiles and preferences

## Deployment

Recommended: **Vercel** or **Netlify** (free tier works)

```bash
# Vercel
npx vercel

# Netlify
npx netlify deploy --prod --dir=dist
```

The static HTML pages in `/public` are served alongside the React app automatically.
