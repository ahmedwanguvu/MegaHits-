const express = require('express');
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// GET /api/books?q=title+or+author
router.get('/', cacheMiddleware(3600), async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: true, message: 'Missing query param "q"' });
    const { data } = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: { q, maxResults: 20, key: process.env.GOOGLE_BOOKS_API_KEY },
    });
    res.json(data.items || []);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
