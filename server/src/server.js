/**
 * Vynora Connect — Shared Express Server Bootstrap
 */

const express = require('express');
const cors = require('cors');
const networkRoutes = require('./modules/network/network.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Mount Network Module (Module 2: Ram)
app.use('/api/v1/network', networkRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', module: 'Module 2: Student Network & Profiles' });
});

// Central 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.originalUrl} not found on Vynora backend.`,
    },
  });
});

// Central error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected server error occurred.',
    },
  });
});

module.exports = app;

