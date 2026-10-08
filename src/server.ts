import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { Food } from './models/Food.js';
import { seedDatabase } from './seed/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed initial data if food collection is empty
    const count = await Food.countDocuments();
    if (count === 0) {
      console.log('[Server] No foods found in database. Auto-seeding initial menu and accounts...');
      await seedDatabase();
    }

    const app = createApp();

    app.listen(ENV.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Foodie Backend Server running on port ${ENV.PORT}`);
      console.log(`🌐 Base URL: http://localhost:${ENV.PORT}`);
      console.log(`🥗 Health Check: http://localhost:${ENV.PORT}/api/health`);
      console.log(`🔑 Admin Email: ${ENV.ADMIN_EMAIL} / ${ENV.ADMIN_PASSWORD}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
};

startServer();
