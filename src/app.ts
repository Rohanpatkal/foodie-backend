import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or localhost
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
          callback(null, true);
        } else {
          callback(null, origin === ENV.CLIENT_ORIGIN);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  // Simple request logging in dev
  app.use((req, _res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'Foodie Backend API', timestamp: new Date() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/foods', foodRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);

  // 404 handler for undefined API routes
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
