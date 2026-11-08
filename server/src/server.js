import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  // Connect to MongoDB Atlas or fallback gracefully
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Vynora Backend] Server listening at http://localhost:${PORT}`);
    console.log(`[Vynora Backend] Ready for Dashboard & Pulse module demonstration.`);
  });

  const shutdown = async () => {
    console.log('\n[Vynora Backend] Gracefully shutting down...');
    server.close(() => {
      console.log('[Vynora Backend] Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('[Vynora Backend] Bootstrap failure:', err);
  process.exit(1);
});

