/**
 * Normalizes errors from upstream APIs (TMDB, Spotify, etc.) into a
 * consistent JSON shape so the front-end never has to guess the format.
 */
function errorHandler(err, req, res, next) {
  const status = err.response?.status || err.status || 500;
  const message =
    err.response?.data?.status_message ||
    err.response?.data?.message ||
    err.message ||
    'Something went wrong upstream.';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${req.method} ${req.originalUrl}]`, err.stack || err);
  }

  res.status(status).json({
    error: true,
    status,
    message,
    path: req.originalUrl,
  });
}

module.exports = errorHandler;
