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

import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

import { connectDB, getDbStatus } from './config/db.js';
import { userMiddleware } from './middleware/userMiddleware.js';
import { errorHandler } from './middleware/errorHandler.js';
import conversationRoutes from './routes/conversationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { setupChatSocket } from './sockets/chatSocket.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// 1. CORS Configuration for REST & WebSockets
app.use(
  cors({
    origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// 2. Body Parser Middleware
app.use(express.json());

// 3. User Identification Middleware
app.use(userMiddleware);

// 4. API Routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    module: 'Communication and Notifications Module',
    service: 'Vynora Connect Backend',
    database: getDbStatus(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mock current user profile endpoint (matches frontend expectation)
app.get('/api/users/me', (req, res) => {
  res.json({
    id: req.userId || 'usr-current',
    name: 'Alex Chen',
    role: 'Senior • Computer Science',
    university: 'Vynora Tech Institute',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    statusMessage: 'Final year capstone & mentoring 🚀',
  });
});

// 5. Global Error Handler
app.use(errorHandler);

// 6. Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: [CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupChatSocket(io);

// 7. Start Server & Connect to DB
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 [Vynora Connect] Backend Server running on port ${PORT}`);
    console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
    console.log(`⚡ Real-time Socket.IO: http://localhost:${PORT}`);
    console.log(`💻 Client Origin: ${CLIENT_ORIGIN}`);
    console.log(`=======================================================`);
  });
};

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
