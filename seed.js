// Seed script — clears existing products and adds fresh dummy vegetable products to MongoDB
// Run with: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const products = [
  {
    name: { en: 'Fresh Tomatoes', mr: 'ताजे टोमॅटो' },
    description: 'Juicy, ripe red tomatoes. Perfect for salads, curries, and sauces.',
    price: 40,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-e5380a01d3b0?w=400&q=80',
  },
  {
    name: { en: 'Baby Spinach', mr: 'बेबी पालक' },
    description: 'Fresh, tender spinach leaves. Rich in iron and vitamins.',
    price: 30,
    category: 'Leafy Greens',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80',
  },
  {
    name: { en: 'Carrots', mr: 'गाजर' },
    description: 'Crunchy orange carrots. Great for snacking, soups, and juicing.',
    price: 35,
    category: 'Roots & Tubers',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
  },
  {
    name: { en: 'Potatoes', mr: 'बटाटे' },
    description: 'Fresh farm potatoes. Versatile for frying, boiling, and baking.',
    price: 25,
    category: 'Roots & Tubers',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
  },
  {
    name: { en: 'Broccoli', mr: 'ब्रोकोली' },
    description: 'Crisp green broccoli florets. Packed with nutrients and fibre.',
    price: 60,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80',
  },
  {
    name: { en: 'Red Capsicum', mr: 'लाल सिमला मिरची' },
    description: 'Sweet and crunchy red bell peppers. Great for stir-fry and salads.',
    price: 80,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
  },
  {
    name: { en: 'Cucumber', mr: 'काकडी' },
    description: 'Cool, refreshing cucumbers. Perfect for salads and raita.',
    price: 20,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?w=400&q=80',
  },
  {
    name: { en: 'Onions', mr: 'कांदे' },
    description: 'Fresh red onions. Essential for every Indian kitchen.',
    price: 30,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1518977826543-5e3c64e80ffd?w=400&q=80',
  },
  {
    name: { en: 'Garlic', mr: 'लसूण' },
    description: 'Aromatic garlic bulbs. Adds flavour to every dish.',
    price: 50,
    category: 'Herbs',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=400&q=80',
  },
  {
    name: { en: 'Ginger', mr: 'आले' },
    description: 'Fresh ginger root. Perfect for cooking and ginger tea.',
    price: 45,
    category: 'Roots & Tubers',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80',
  },
  {
    name: { en: 'Cauliflower', mr: 'फ्लॉवर' },
    description: 'Fresh white cauliflower. Great for gobi dishes and soups.',
    price: 45,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&q=80',
  },
  {
    name: { en: 'Green Peas', mr: 'हिरवे मटार' },
    description: 'Sweet green peas. Perfect for pulao, curries and snacks.',
    price: 55,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1587735243475-37aca0b73e81?w=400&q=80',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment variables!');
    process.exit(1);
  }

  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(uri);
    console.log('✅ Connected successfully!');

    console.log('🧹 Clearing existing products...');
    await mongoose.connection.collection('products').deleteMany({});
    console.log('✅ Existing products deleted.');

    console.log('🚀 Seeding products...');
    const now = new Date();
    const productsWithTimestamps = products.map((p) => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));

    await mongoose.connection.collection('products').insertMany(productsWithTimestamps);
    console.log(`🎉 Done! Seeded ${products.length} products successfully.`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  }
}

seed();
