import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[MongoDB] No MONGODB_URI provided in environment. Running in offline memory store mode.');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection failed: ${error.message}. Running in memory fallback mode.`);
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

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
