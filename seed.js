// Seed script — clears existing products, categories, settings, and orders,
// and adds fresh dummy grocery products/categories/settings to MongoDB.
// Run with: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const categories = [
  {
    name: 'Vegetables & Fruits',
    icon: '🥦',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
    sortOrder: 1,
    showOnApp: true,
  },
  {
    name: 'Dairy & Bread',
    icon: '🥛',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    sortOrder: 2,
    showOnApp: true,
  },
  {
    name: 'Snacks & Munchies',
    icon: '🍿',
    image: 'https://images.unsplash.com/photo-1599490659223-e1522b53fdc6?w=400&q=80',
    sortOrder: 3,
    showOnApp: true,
  },
  {
    name: 'Cold Drinks & Juices',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
    sortOrder: 4,
    showOnApp: true,
  },
  {
    name: 'Instant & Frozen Food',
    icon: '🍜',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&q=80',
    sortOrder: 5,
    showOnApp: true,
  },
  {
    name: 'Tea Coffee & Drinks',
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
    sortOrder: 6,
    showOnApp: true,
  },
  {
    name: 'Bakery & Biscuits',
    icon: '🍪',
    image: 'https://images.unsplash.com/photo-1558961317-632c1d2222ab?w=400&q=80',
    sortOrder: 7,
    showOnApp: true,
  },
  {
    name: 'Sweet Cravings',
    icon: '🍫',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80',
    sortOrder: 8,
    showOnApp: true,
  },
  {
    name: 'Atta Rice & Dal',
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    sortOrder: 9,
    showOnApp: true,
  },
  {
    name: 'Masala Oil & More',
    icon: '🌶️',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80',
    sortOrder: 10,
    showOnApp: true,
  },
  {
    name: 'Cleaning Essentials',
    icon: '🧼',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80',
    sortOrder: 11,
    showOnApp: true,
  },
];

const products = [
  // Vegetables & Fruits
  {
    name: { en: 'Fresh Hybrid Tomatoes', mr: 'ताजे संकरित टोमॅटो' },
    description: 'Fresh, juicy hybrid tomatoes, handpicked from farms.',
    mrp: 60,
    price: 39,
    discount: 35,
    unit: '1 kg',
    brand: 'Fresh Farm',
    category: 'Vegetables & Fruits',
    image: 'https://images.unsplash.com/photo-1546470427-e5380a01d3b0?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Fresh Potato (Batata)', mr: 'ताजे बटाटे' },
    description: 'Versatile, high quality potatoes, ideal for daily cooking.',
    mrp: 40,
    price: 28,
    discount: 30,
    unit: '1 kg',
    brand: 'Fresh Farm',
    category: 'Vegetables & Fruits',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Fresh Onion (Kanda)', mr: 'ताजे कांदे' },
    description: 'Essential kitchen staple, sharp flavour and crisp texture.',
    mrp: 50,
    price: 35,
    discount: 30,
    unit: '1 kg',
    brand: 'Fresh Farm',
    category: 'Vegetables & Fruits',
    image: 'https://images.unsplash.com/photo-1518977826543-5e3c64e80ffd?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Shimla Mirchi (Green Capsicum)', mr: 'हिरवी सिमला मिरची' },
    description: 'Crispy green bell peppers, rich in vitamins.',
    mrp: 80,
    price: 59,
    discount: 26,
    unit: '250 g',
    brand: 'Fresh Farm',
    category: 'Vegetables & Fruits',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Fresh Bananas (Keli)', mr: 'ताजी केळी' },
    description: 'Sweet and nutritious, rich in potassium.',
    mrp: 60,
    price: 48,
    discount: 20,
    unit: '6 pcs',
    brand: 'Orchard Fresh',
    category: 'Vegetables & Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80',
    inStock: true,
  },

  // Dairy & Bread
  {
    name: { en: 'Amul Taaza Homogenised Milk', mr: 'अमुल ताझा दूध' },
    description: 'Fresh toned milk, homogenised and pasteurised.',
    mrp: 30,
    price: 27,
    discount: 10,
    unit: '500 ml',
    brand: 'Amul',
    category: 'Dairy & Bread',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Amul Butter', mr: 'अमुल बटर' },
    description: 'Utterly butterly delicious salted butter.',
    mrp: 60,
    price: 56,
    discount: 6,
    unit: '100 g',
    brand: 'Amul',
    category: 'Dairy & Bread',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Mother Dairy Paneer', mr: 'मदर डेअरी पनीर' },
    description: 'Fresh and soft paneer block for curries and snacks.',
    mrp: 95,
    price: 88,
    discount: 7,
    unit: '200 g',
    brand: 'Mother Dairy',
    category: 'Dairy & Bread',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Harvest Gold Brown Bread', mr: 'हार्वेस्ट गोल्ड ब्राऊन ब्रेड' },
    description: 'High fibre, whole wheat brown bread for health.',
    mrp: 50,
    price: 45,
    discount: 10,
    unit: '400 g',
    brand: 'Harvest Gold',
    category: 'Dairy & Bread',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    inStock: true,
  },

  // Snacks & Munchies
  {
    name: { en: 'Lay\'s Classic Salted Chips', mr: 'लेज क्लासिक सॉल्टेड चिप्स' },
    description: 'Crispy, classic potato chips seasoned with salt.',
    mrp: 20,
    price: 20,
    discount: 0,
    unit: '50 g',
    brand: 'Lay\'s',
    category: 'Snacks & Munchies',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Kurkure Masala Munch', mr: 'कुरकुरे मसाला मंच' },
    description: 'Spicy, crunchy corn puffs with signature Indian masalas.',
    mrp: 20,
    price: 19,
    discount: 5,
    unit: '80 g',
    brand: 'Kurkure',
    category: 'Snacks & Munchies',
    image: 'https://images.unsplash.com/photo-1600952841320-dbf439d73a66?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Act II Golden Sizzle Popcorn', mr: 'ॲक्ट २ पॉपकॉर्न' },
    description: 'Easy to make hot instant popcorn at home.',
    mrp: 45,
    price: 39,
    discount: 13,
    unit: '150 g',
    brand: 'Act II',
    category: 'Snacks & Munchies',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80',
    inStock: true,
  },

  // Cold Drinks & Juices
  {
    name: { en: 'Coca-Cola Soft Drink Can', mr: 'कोका-कोला कॅन' },
    description: 'Refreshing carbonated cold drink.',
    mrp: 40,
    price: 35,
    discount: 12,
    unit: '300 ml',
    brand: 'Coca-Cola',
    category: 'Cold Drinks & Juices',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Pepsi Soft Drink Bottle', mr: 'पेप्सी बॉटल' },
    description: 'Chilled soft drink bottle.',
    mrp: 90,
    price: 79,
    discount: 12,
    unit: '1.25 L',
    brand: 'Pepsi',
    category: 'Cold Drinks & Juices',
    image: 'https://images.unsplash.com/photo-1527960472437-9650958b975d?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Real Fruit Power Mixed Fruit Juice', mr: 'रियल मिक्स फ्रुट ज्यूस' },
    description: 'Packed with the goodness of 9 delicious fruits.',
    mrp: 130,
    price: 115,
    discount: 11,
    unit: '1 L',
    brand: 'Real',
    category: 'Cold Drinks & Juices',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80',
    inStock: true,
  },

  // Instant & Frozen Food
  {
    name: { en: 'Maggi 2-Minute Masala Noodles', mr: 'मॅगी मसाला नूडल्स' },
    description: 'India\'s favourite instant masala noodles.',
    mrp: 96,
    price: 88,
    discount: 8,
    unit: '560 g (Pack of 8)',
    brand: 'Maggi',
    category: 'Instant & Frozen Food',
    image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Knorr Classic Tomato Soup', mr: 'नॉर टोमॅटो सूप' },
    description: 'Rich, red tangy tomato instant soup.',
    mrp: 60,
    price: 54,
    discount: 10,
    unit: '4 packs x 15g',
    brand: 'Knorr',
    category: 'Instant & Frozen Food',
    image: 'https://images.unsplash.com/photo-1547592165-e1d17f1a0655?w=400&q=80',
    inStock: true,
  },

  // Tea Coffee & Drinks
  {
    name: { en: 'Tata Tea Premium', mr: 'टाटा चहा प्रीमियम' },
    description: 'Unique blend of big tea grains and active CTC leaves.',
    mrp: 200,
    price: 175,
    discount: 12,
    unit: '500 g',
    brand: 'Tata Tea',
    category: 'Tea Coffee & Drinks',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Nescafe Classic Instant Coffee', mr: 'नेस्कॅफे इन्स्टंट कॉफी' },
    description: '100% pure instant coffee powder, rich aroma.',
    mrp: 170,
    price: 155,
    discount: 8,
    unit: '100 g',
    brand: 'Nescafe',
    category: 'Tea Coffee & Drinks',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
    inStock: true,
  },

  // Bakery & Biscuits
  {
    name: { en: 'Britannia Marie Gold Biscuits', mr: 'ब्रिटानिया मारी गोल्ड' },
    description: 'Crisp and light teatime biscuits.',
    mrp: 40,
    price: 36,
    discount: 10,
    unit: '250 g',
    brand: 'Britannia',
    category: 'Bakery & Biscuits',
    image: 'https://images.unsplash.com/photo-1558961317-632c1d2222ab?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Oreo Chocolate Sandwich Cookies', mr: 'ओरियो बिस्किट' },
    description: 'Delicious chocolate biscuits filled with vanilla cream.',
    mrp: 35,
    price: 32,
    discount: 8,
    unit: '120 g',
    brand: 'Oreo',
    category: 'Bakery & Biscuits',
    image: 'https://images.unsplash.com/photo-1558961317-632c1d2222ab?w=400&q=80',
    inStock: true,
  },

  // Sweet Cravings
  {
    name: { en: 'Cadbury Dairy Milk Silk', mr: 'डेअरी मिल्क सिल्क' },
    description: 'Smooth, creamy milk chocolate bar.',
    mrp: 80,
    price: 75,
    discount: 6,
    unit: '60 g',
    brand: 'Cadbury',
    category: 'Sweet Cravings',
    image: 'https://images.unsplash.com/photo-1549007994-cb92ca8b4bc7?w=400&q=80',
    inStock: true,
  },

  // Atta Rice & Dal
  {
    name: { en: 'Fortune Chakki Fresh Atta', mr: 'फॉर्च्युन चक्की फ्रेश आटा' },
    description: '100% whole wheat flour, makes soft rotis.',
    mrp: 260,
    price: 199,
    discount: 23,
    unit: '5 kg',
    brand: 'Fortune',
    category: 'Atta Rice & Dal',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Daawat Rozana Super Basmati Rice', mr: 'दावत रोझाना बासमती तांदूळ' },
    description: 'Aromatic, fine-grain premium basmati rice.',
    mrp: 110,
    price: 89,
    discount: 19,
    unit: '1 kg',
    brand: 'Daawat',
    category: 'Atta Rice & Dal',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Tata Sampann Unpolished Toor Dal', mr: 'टाटा संपन्न तूर डाळ' },
    description: 'High protein, unpolished natural yellow split peas.',
    mrp: 180,
    price: 158,
    discount: 12,
    unit: '1 kg',
    brand: 'Tata Sampann',
    category: 'Atta Rice & Dal',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    inStock: true,
  },

  // Masala Oil & More
  {
    name: { en: 'Fortune Mustard Oil (Sarso Tel)', mr: 'फॉर्च्युन मोहरीचे तेल' },
    description: 'Pure cold-pressed mustard oil for authentic cooking.',
    mrp: 190,
    price: 169,
    discount: 11,
    unit: '1 L',
    brand: 'Fortune',
    category: 'Masala Oil & More',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Everest Garam Masala Powder', mr: 'एव्हरेस्ट गरम मसाला' },
    description: 'Blend of aromatic ground spices for rich flavour.',
    mrp: 92,
    price: 85,
    discount: 7,
    unit: '100 g',
    brand: 'Everest',
    category: 'Masala Oil & More',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80',
    inStock: true,
  },

  // Cleaning Essentials
  {
    name: { en: 'Vim Dishwash Liquid Gel Lemon', mr: 'विम लिक्विड जेल लिंबू' },
    description: 'Cuts through grease instantly, leaves fresh lemon scent.',
    mrp: 110,
    price: 99,
    discount: 10,
    unit: '500 ml',
    brand: 'Vim',
    category: 'Cleaning Essentials',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80',
    inStock: true,
  },
  {
    name: { en: 'Surf Excel Easy Wash Detergent', mr: 'सर्फ एक्सेल वॉशिंग पावडर' },
    description: 'Removes tough stains easily like mud, ink and oil.',
    mrp: 150,
    price: 139,
    discount: 7,
    unit: '1 kg',
    brand: 'Surf Excel',
    category: 'Cleaning Essentials',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80',
    inStock: true,
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

    // 1. Clear Collections
    console.log('🧹 Clearing collections...');
    await mongoose.connection.collection('products').deleteMany({});
    await mongoose.connection.collection('categories').deleteMany({});
    await mongoose.connection.collection('settings').deleteMany({});
    await mongoose.connection.collection('orders').deleteMany({});
    console.log('✅ Collections cleared.');

    // 2. Insert Categories
    console.log('🚀 Seeding categories...');
    const now = new Date();
    const categoriesWithTimestamps = categories.map((c) => ({
      ...c,
      createdAt: now,
      updatedAt: now,
    }));
    await mongoose.connection.collection('categories').insertMany(categoriesWithTimestamps);
    console.log(`🎉 Seeded ${categories.length} categories.`);

    // 3. Insert Products
    console.log('🚀 Seeding products...');
    const productsWithTimestamps = products.map((p) => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));
    await mongoose.connection.collection('products').insertMany(productsWithTimestamps);
    console.log(`🎉 Seeded ${products.length} products.`);

    // 4. Insert Settings
    console.log('🚀 Seeding default settings...');
    const defaultSettings = {
      storeName: 'FirstMart',
      deliveryTime: '10-15 mins',
      minOrderAmount: 0,
      deliveryFeeEnabled: true,
      deliveryFee: 30,
      gstEnabled: false,
      gstPercentage: 0,
      handlingFeeEnabled: true,
      handlingFee: 5,
      freeDeliveryThresholdEnabled: true,
      freeDeliveryThreshold: 200,
      contactNumber: '9239321112',
      createdAt: now,
      updatedAt: now,
    };
    await mongoose.connection.collection('settings').insertOne(defaultSettings);
    console.log('🎉 Seeded settings.');

    console.log('🎉 Seeding successfully completed!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  }
}

seed();
