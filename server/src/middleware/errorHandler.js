/**
 * Global Error Handler Middleware
 * Returns consistent structured JSON error responses.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [Server Error] ${req.method} ${req.url}:`, err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
