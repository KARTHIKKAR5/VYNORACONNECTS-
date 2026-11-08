import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import pulseRoutes from './modules/pulse/pulse.routes.js';
import { modulesAdapter } from './modules/integrations/modules.adapter.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { isDbConnected } from './config/db.js';

export const app = express();

// Base middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health & Diagnostics
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'operational',
      service: 'Vynora Connect Backend API',
      version: '1.0.0',
      database: isDbConnected() ? 'connected' : 'offline_memory_mode',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Auth Module
app.use('/api/v1/auth', authRoutes);

// Primary Modules
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/pulse', pulseRoutes);

// Cross-Module Partner Compatibility Endpoints (Resources & Opportunities)
app.get('/api/v1/opportunities', async (req, res, next) => {
  try {
    const data = await modulesAdapter.getRecentOpportunities(20);
    res.status(200).json({
      success: true,
      data,
      meta: { total: data.length },
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/resources', async (req, res, next) => {
  try {
    const data = await modulesAdapter.getRecentResources(20);
    res.status(200).json({
      success: true,
      data,
      meta: { total: data.length },
    });
  } catch (err) {
    next(err);
  }
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);
