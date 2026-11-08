import mongoose from 'mongoose';

/**
 * MongoDB Atlas Connection Configuration
 * Connects to MongoDB Atlas using Mongoose if MONGODB_URI is provided.
 * Gracefully reports connection status.
 */
let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('ℹ️  [Database] MONGODB_URI not provided in .env.');
    console.log('⚡ [Database] Running with in-memory store so APIs & Socket.IO work immediately for development.');
    console.log('💡 [Database] When you have your MongoDB Atlas URI, add it to backend/.env and restart.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️  [MongoDB Atlas] Connection failed: ${error.message}`);
    console.log('⚡ [Database] Falling back to development in-memory store.');
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
});
