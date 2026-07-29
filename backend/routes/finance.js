const express = require('express');
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// GET /api/finance/crypto
router.get('/crypto', cacheMiddleware(300), async (req, res, next) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/finance/convert?from=USD&to=TZS&amount=100
router.get('/convert', cacheMiddleware(3600), async (req, res, next) => {
  try {
    const { from = 'USD', to = 'TZS', amount = 1 } = req.query;
    const { data } = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/pair/${from}/${to}/${amount}`
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
