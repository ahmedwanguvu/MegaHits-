const NodeCache = require('node-cache');

// Default: cache each response for 1 hour to stay under free API rate limits
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

/**
 * Returns a caching middleware. Optionally override the TTL (seconds)
 * per-route, e.g. cacheMiddleware(60) for live sports scores.
 */
function cacheMiddleware(ttlSeconds) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    res.set('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful payloads
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, ttlSeconds ?? undefined);
      }
      return originalJson(body);
    };
    next();
  };
}

module.exports = { cache, cacheMiddleware };
