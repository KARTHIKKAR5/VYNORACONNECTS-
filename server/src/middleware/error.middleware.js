/**
 * Standardized error handling middleware
 */
export function errorHandler(err, req, res, _next) {
  console.error('[Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred.';
  const details = err.details || [];

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details.length > 0 ? { details } : {}),
    },
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} was not found on this server.`,
    },
  });
}

