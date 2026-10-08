import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodie',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret_foodie_jwt_key_2026_dev',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@foodie.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
