const express = require('express');
const axios = require('axios');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// GET /api/travel?lat=-6.79&lon=39.20
router.get('/', cacheMiddleware(3600), async (req, res, next) => {
  try {
    const { lat, lon, radius = 50 } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: true, message: 'Missing "lat" and/or "lon" query params' });
    }
    const { data } = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: { latlong: `${lat},${lon}`, radius, unit: 'km', apikey: process.env.TICKETMASTER_API_KEY },
    });
    res.json(data._embedded?.events || []);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
