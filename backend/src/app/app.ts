import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@/config/env.js';
import taskRoutes from '@/features/tasks/routes/task.routes.js';
import authRoutes from '@/features/auth/routes/auth.routes.js';
import { errorHandler } from '@/infrastructure/middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;
