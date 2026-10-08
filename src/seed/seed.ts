import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Food } from '../models/Food.js';
import { hashPassword } from '../utils/password.js';
import { ENV } from '../config/env.js';

export const INITIAL_FOODS = [
  {
    name: 'Pizza',
    category: 'Pizza',
    price: 199,
    image: '🍕',
    description: 'Freshly baked cheese burst pizza topped with authentic Italian herbs and spices',
  },
  {
    name: 'Veg Burger',
    category: 'Burger',
    price: 99,
    image: '🍔',
    description: 'Crispy veggie patty with lettuce, tomatoes, and secret creamy sauce in sesame bun',
  },
  {
    name: 'French Fries',
    category: 'Snacks',
    price: 79,
    image: '🍟',
    description: 'Golden crispy potato fries seasoned with peri peri salt and herbs',
  },
  {
    name: 'Pasta',
    category: 'Pasta',
    price: 149,
    image: '🍝',
    description: 'Creamy white sauce penne pasta loaded with sautéed vegetables and parmesan',
  },
  {
    name: 'Sandwich',
    category: 'Snacks',
    price: 89,
    image: '🥪',
    description: 'Grilled vegetable sandwich stuffed with fresh veggies, herbs and mint chutney',
  },
  {
    name: 'Biryani',
    category: 'Indian',
    price: 179,
    image: '🍛',
    description: 'Aromatic basmati rice cooked with authentic spices, saffron, and fresh veggies',
  },
  {
    name: 'Momos',
    category: 'Snacks',
    price: 99,
    image: '🥟',
    description: 'Steamed Himalayan vegetable dumplings served with spicy red chili sauce',
  },
  {
    name: 'Cold Coffee',
    category: 'Drinks',
    price: 69,
    image: '🥤',
    description: 'Chilled rich blended coffee crowned with thick chocolate syrup drizzle',
  },
];

export const seedDatabase = async () => {
  console.log('[Seed] Starting database seed...');
  await connectDB();

  // 1. Seed or update Admin
  const adminEmail = ENV.ADMIN_EMAIL.toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  const adminHash = await hashPassword(ENV.ADMIN_PASSWORD);

  if (!admin) {
    admin = await User.create({
      name: 'Foodie Admin',
      email: adminEmail,
      passwordHash: adminHash,
      role: 'admin',
    });
    console.log(`[Seed] Created admin account: ${adminEmail}`);
  } else {
    admin.role = 'admin';
    admin.passwordHash = adminHash;
    await admin.save();
    console.log(`[Seed] Updated admin account: ${adminEmail}`);
  }

  // 2. Seed Demo Customer
  const demoEmail = 'customer@foodie.com';
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    const demoHash = await hashPassword('customer123');
    demoUser = await User.create({
      name: 'Rohan Sharma',
      email: demoEmail,
      passwordHash: demoHash,
      role: 'customer',
    });
    console.log(`[Seed] Created demo customer: ${demoEmail}`);
  }

  // 3. Seed Foods
  for (const foodItem of INITIAL_FOODS) {
    const exists = await Food.findOne({ name: foodItem.name });
    if (!exists) {
      await Food.create(foodItem);
      console.log(`[Seed] Added food: ${foodItem.name} (${foodItem.image}) - ₹${foodItem.price}`);
    }
  }

  console.log('[Seed] Database seed completed successfully!');
};

// If run directly via CLI
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed Error]:', err);
      await disconnectDB();
      process.exit(1);
    });
}
