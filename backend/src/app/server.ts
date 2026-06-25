import app from './app.js';
import { connectDB } from '@/infrastructure/database/connection.js';
import { env } from '@/config/env.js';

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`API server running on http://localhost:${env.port}`);
  });
}

start();
