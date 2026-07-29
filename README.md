# MegaHits Vibez — Super App

A single-page, installable (PWA) content hub: movies, cartoons/anime, music,
live sports, weather, crypto, recipes, news, gaming, AI tools, books and
travel/events — all in one clean interface, with a draggable audio player,
Kids Safe Mode, and zero page reloads.

```
megahits-vibez/
├── frontend/            static SPA — deploy to Vercel, Netlify, GitHub Pages...
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
└── backend/             Node/Express API proxy — deploy to Render, Railway, Heroku, a VPS, or Pterodactyl
    ├── server.js
    ├── routes/           one file per content category
    ├── middleware/        cache.js, errorHandler.js
    ├── package.json
    └── .env.example      copy to .env and fill in real keys
```

## Why a backend proxy at all?

The frontend never talks to TMDB, Spotify, etc. directly. Every request goes
through `backend/`, which:
- keeps all API keys server-side (never shipped to the browser)
- caches responses in memory so free-tier rate limits aren't burned
- normalizes errors into one consistent JSON shape

## 1. Run the backend locally

```bash
cd backend
npm install
cp .env.example .env       # then fill in the keys you have
npm run dev                 # http://localhost:5000
```

You don't need every key filled in — routes for APIs you haven't configured
yet will simply error, and the frontend will fall back to bundled sample data
so the UI stays fully explorable.

## 2. Run the frontend locally

The frontend is static — no build step. Serve it with any static server, e.g.:

```bash
cd frontend
npx serve .                 # or: python3 -m http.server 8080
```

Open the printed URL. By default it calls `/api/...` — either put the
frontend and backend behind the same domain (recommended, e.g. Nginx reverse
proxy or a platform that serves both), or set:

```html
<script>window.MEGAHITS_API_BASE = 'https://your-backend-domain.com/api';</script>
```

before `js/app.js` loads in `index.html`.

## 3. Deploying

**Backend** (Node.js): Render, Railway, Heroku, a VPS, or a Pterodactyl Panel
Node.js egg all work — this is a plain Express app with a `start` script and
respects `process.env.PORT`. Set every value from `.env.example` as an
environment variable in your host's dashboard; never commit `.env`.

**Frontend** (static files): Vercel, Netlify, GitHub Pages, or the same VPS
via Nginx. Point `MEGAHITS_API_BASE` at your deployed backend URL.

**Custom domain**: add a CNAME record at your DNS provider (Cloudflare,
Namecheap, …) pointing at your host, then enable HTTPS there.

## 4. Getting API keys

See the table inside the project's original spec for exact signup links —
in short: TMDB, Jikan (no key needed), Spotify Developer Dashboard,
API-Football, OpenWeatherMap, CoinGecko, Spoonacular, NewsAPI, RAWG, OpenAI,
Google Cloud Console (Books API), and Ticketmaster Developer Portal.

## 5. Social / community links

WhatsApp, Telegram, YouTube, Instagram and TikTok URLs are **never
hard-coded** in the frontend. They're read from `backend/.env` and served via
`GET /api/community/links`, exactly per the "Apis and social media link"
requirement.

## 6. Notes on the current build

- All UI copy defaults to English, per the "Language" requirement, with a
  Kiswahili option in Settings.
- Icons are real SVG icons (Lucide), not emoji, per the "Muonekano" requirement.
- Kids Safe Mode hides every category except Cartoons & Anime and persists
  the choice in `localStorage`.
- The draggable audio player supports mouse + touch drag, edge-snapping, and
  a minimized "bubble" state, matching the interaction spec.
- Sample data ships inline so the app is fully clickable before any API key
  is configured; swap it for live data by filling in `backend/.env`.
