const mongoose = require('mongoose');

const uri = "mongodb://ajinkya8970:Ajay%40888@ac-kt6xium-shard-00-00.mr5fzto.mongodb.net:27017,ac-kt6xium-shard-00-01.mr5fzto.mongodb.net:27017,ac-kt6xium-shard-00-02.mr5fzto.mongodb.net:27017/veggieapp_multistore?ssl=true&authSource=admin&replicaSet=atlas-gvbbmb-shard-0&retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB!");
    
    const db = mongoose.connection.db;
    
    // Helper to safely convert string to ObjectId if valid
    const toObjectId = (val) => {
      if (val && typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val)) {
        return new mongoose.Types.ObjectId(val);
      }
      return val;
    };
    
    // 1. Products
    console.log("Migrating 'products' collection...");
    const products = await db.collection('products').find({}).toArray();
    let productUpdates = 0;
    for (const p of products) {
      const update = {};
      if (p.store && typeof p.store === 'string') {
        update.store = toObjectId(p.store);
      }
      if (p.subcategory && typeof p.subcategory === 'string') {
        update.subcategory = toObjectId(p.subcategory);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('products').updateOne({ _id: p._id }, { $set: update });
        productUpdates++;
      }
    }
    console.log(`Updated ${productUpdates} products.`);
    
    // 2. Users
    console.log("Migrating 'users' collection...");
    const users = await db.collection('users').find({}).toArray();
    let userUpdates = 0;
    for (const u of users) {
      const update = {};
      if (u.store && typeof u.store === 'string') {
        update.store = toObjectId(u.store);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('users').updateOne({ _id: u._id }, { $set: update });
        userUpdates++;
      }
    }
    console.log(`Updated ${userUpdates} users.`);
    
    // 3. Subcategories
    console.log("Migrating 'subcategories' collection...");
    const subcategories = await db.collection('subcategories').find({}).toArray();
    let subcategoryUpdates = 0;
    for (const s of subcategories) {
      const update = {};
      if (s.store && typeof s.store === 'string') {
        update.store = toObjectId(s.store);
      }
      if (s.parentCategoryId && typeof s.parentCategoryId === 'string') {
        update.parentCategoryId = toObjectId(s.parentCategoryId);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('subcategories').updateOne({ _id: s._id }, { $set: update });
        subcategoryUpdates++;
      }
    }
    console.log(`Updated ${subcategoryUpdates} subcategories.`);
    
    // 4. Settings
    console.log("Migrating 'settings' collection...");
    const settings = await db.collection('settings').find({}).toArray();
    let settingsUpdates = 0;
    for (const st of settings) {
      const update = {};
      if (st.store && typeof st.store === 'string') {
        update.store = toObjectId(st.store);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('settings').updateOne({ _id: st._id }, { $set: update });
        settingsUpdates++;
      }
    }
    console.log(`Updated ${settingsUpdates} settings.`);
    
    // 5. Orders
    console.log("Migrating 'orders' collection...");
    const orders = await db.collection('orders').find({}).toArray();
    let orderUpdates = 0;
    for (const o of orders) {
      const update = {};
      if (o.store && typeof o.store === 'string') {
        update.store = toObjectId(o.store);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('orders').updateOne({ _id: o._id }, { $set: update });
        orderUpdates++;
      }
    }
    console.log(`Updated ${orderUpdates} orders.`);
    
    // 6. Categories
    console.log("Migrating 'categories' collection...");
    const categories = await db.collection('categories').find({}).toArray();
    let categoryUpdates = 0;
    for (const c of categories) {
      const update = {};
      if (c.store && typeof c.store === 'string') {
        update.store = toObjectId(c.store);
      }
      if (Object.keys(update).length > 0) {
        await db.collection('categories').updateOne({ _id: c._id }, { $set: update });
        categoryUpdates++;
      }
    }
    console.log(`Updated ${categoryUpdates} categories.`);
    
    console.log("Migration complete!");
    
  } catch (err) {
    console.error("Error executing script:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
