const express = require('express');
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();
const JIKAN_BASE = 'https://api.jikan.moe/v4';

// GET /api/anime/top
router.get('/top', cacheMiddleware(3600), async (req, res, next) => {
  try {
    const { data } = await axios.get(`${JIKAN_BASE}/top/anime`, {
      params: { filter: 'bypopularity', limit: 20 },
    });
    res.json(data.data);
  } catch (err) {
    next(err);
  }
});

// GET /api/anime/:id
router.get('/:id', cacheMiddleware(3600), async (req, res, next) => {
  try {
    const { data } = await axios.get(`${JIKAN_BASE}/anime/${req.params.id}/full`);
    res.json(data.data);
  } catch (err) {
    next(err);
  }
});

// GET /api/anime?q=naruto -- kids-safe search
router.get('/', cacheMiddleware(1800), async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: true, message: 'Missing query param "q"' });
    const { data } = await axios.get(`${JIKAN_BASE}/anime`, {
      params: { q, rating: 'g,pg', limit: 20 },
    });
    res.json(data.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
