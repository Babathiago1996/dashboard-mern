export const notFound = (req, res, next) => {
  res.status(404).json({ code: 'NOT_FOUND', message: `Route ${req.originalUrl} not found` });
};

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  const payload = { code: err.code || 'SERVER_ERROR', message: err.expose ? err.message : 'Internal server error' };
  res.status(status).json(payload);
};