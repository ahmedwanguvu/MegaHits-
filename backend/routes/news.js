const express = require('express');
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// GET /api/news?category=technology
router.get('/', cacheMiddleware(1800), async (req, res, next) => {
  try {
    const { category = 'general', country = 'us' } = req.query;
    const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { category, country, pageSize: 20, apiKey: process.env.NEWS_API_KEY },
    });
    res.json(data.articles);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
