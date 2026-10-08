import mongoose from 'mongoose';
import { ENV } from './env.js';

let memServer: any = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }

  try {
    // First, attempt connecting to MONGO_URI
    console.log(`[DB] Attempting connection to MongoDB at: ${ENV.MONGO_URI}`);
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] Successfully connected to MongoDB at: ${ENV.MONGO_URI}`);
  } catch (err: any) {
    console.warn(`[DB] Could not connect to local/specified MongoDB (${err.message}).`);
    console.log(`[DB] Launching fallback MongoMemoryServer for instant zero-dependency execution...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memServer = await MongoMemoryServer.create();
      const uri = memServer.getUri();
      await mongoose.connect(uri);
      console.log(`[DB] Successfully connected to In-Memory MongoDB at: ${uri}`);
    } catch (memErr: any) {
      console.error(`[DB] Failed to start fallback MongoDB:`, memErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
};
