> **Deploy on Heroku**
<p align="left">  
<a href='https://dashboard.heroku.com/new?template=https://github.com/ahmedwanguvu/MegaHits-/tree/main' target="_blank"><img alt='Deploy on Heroku' src='https://img.shields.io/badge/-Deploy%20on%20Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white'/></a>  
</p>
# Deploying the backend to Heroku (from this monorepo)

Your GitHub repo has `backend/` and `frontend/` in the same repo — Heroku's
Node buildpack normally only looks for `package.json` at the **repo root**,
so it needs one extra buildpack to know `backend/` is the real app. That's
already wired up for you via `app.json`. Two ways to deploy:

## Option A — One-click deploy (fastest)

1. Push this repo to GitHub (you've already done this).
2. Edit `app.json` at the repo root: replace `YOUR_USERNAME/YOUR_REPO` in
   the `"repository"` field with your actual GitHub URL.
3. Go to `https://heroku.com/deploy?template=https://github.com/YOUR_USERNAME/YOUR_REPO`
   (swap in your repo URL). Heroku reads `app.json` and sets everything up,
   including the two buildpacks and a config var form for your API keys.

## Option B — Manual, via Heroku CLI

```bash
heroku login
heroku create your-app-name

# Tell the monorepo buildpack which folder is the real Node app:
heroku buildpacks:add -a your-app-name https://github.com/lstoll/heroku-buildpack-monorepo
heroku buildpacks:add -a your-app-name heroku/nodejs
heroku config:set -a your-app-name APP_BASE=backend

# Add your real keys (repeat for whichever APIs you're using):
heroku config:set -a your-app-name NODE_ENV=production
heroku config:set -a your-app-name TMDB_API_KEY=xxxxx
heroku config:set -a your-app-name OPENWEATHER_API_KEY=xxxxx
heroku config:set -a your-app-name FRONTEND_ORIGIN=https://your-frontend-domain.com
# ...and so on for every key in backend/.env.example

git push heroku main
heroku open
```

## What each new file does

| File | Purpose |
|---|---|
| `app.json` (root) | Describes the app for one-click deploy: buildpacks + config vars |
| `backend/Procfile` | Tells the dyno how to start the app: `web: node server.js` |
| `.gitignore` (root) | Keeps `node_modules/` and `.env` out of git |

`APP_BASE=backend` tells `heroku-buildpack-monorepo` to copy the contents of
`backend/` to the app root **before** the Node buildpack runs — that's why
`backend/package.json` and `backend/Procfile` don't need to live at the repo
root themselves.

## After deploy

- Test it: `curl https://your-app-name.herokuapp.com/health` → should return `{"status":"ok", ...}`
- Point your frontend at it: in `frontend/index.html`, before `js/app.js` loads, add:
  ```html
  <script>window.MEGAHITS_API_BASE = 'https://your-app-name.herokuapp.com/api';</script>
  ```
- Set `FRONTEND_ORIGIN` on Heroku to your actual frontend URL so CORS allows it.

## Note on Heroku's free tier

Heroku no longer offers a free dyno tier — you'll need at least an Eco or
Basic dyno plan. If you want a genuinely free option instead, Render.com's
free web service tier works with the exact same buildpack setup (Render
lets you set "Root Directory" to `backend` directly in its dashboard — no
monorepo buildpack needed there).
