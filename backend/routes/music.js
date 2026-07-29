const express = require('express');
const axios = require('axios');
const { cache, cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

async function getSpotifyToken() {
  const cached = cache.get('spotify_token');
  if (cached) return cached;

  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const { data } = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    { headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  // Tokens last 3600s; refresh slightly early
  cache.set('spotify_token', data.access_token, data.expires_in - 60);
  return data.access_token;
}

// GET /api/music/top50
router.get('/top50', cacheMiddleware(3600), async (req, res, next) => {
  try {
    const token = await getSpotifyToken();
    const { data } = await axios.get(
      'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
      { headers: { Authorization: `Bearer ${token}` }, params: { limit: 50 } }
    );
    res.json(data.items);
  } catch (err) {
    next(err);
  }
});

// GET /api/music?q=track+name
router.get('/', cacheMiddleware(1800), async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: true, message: 'Missing query param "q"' });
    const token = await getSpotifyToken();
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q, type: 'track', limit: 20 },
    });
    res.json(data.tracks.items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
