const express = require('express');
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// GET /api/weather?lat=-6.79&lon=39.20
router.get('/', cacheMiddleware(1800), async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: true, message: 'Missing "lat" and/or "lon" query params' });
    }
    const [current, forecast] = await Promise.all([
      axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: { lat, lon, units: 'metric', appid: process.env.OPENWEATHER_API_KEY },
      }),
      axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: { lat, lon, units: 'metric', appid: process.env.OPENWEATHER_API_KEY },
      }),
    ]);
    res.json({ current: current.data, forecast: forecast.data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
