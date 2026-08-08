const mongoose = require('mongoose');

const uri = "mongodb://ajinkya8970:Ajay%40888@ac-kt6xium-shard-00-00.mr5fzto.mongodb.net:27017,ac-kt6xium-shard-00-01.mr5fzto.mongodb.net:27017,ac-kt6xium-shard-00-02.mr5fzto.mongodb.net:27017/veggieapp_multistore?ssl=true&authSource=admin&replicaSet=atlas-gvbbmb-shard-0&retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  // 1. Delete orphan category pointing to non-existent store
  const oid = new mongoose.Types.ObjectId('6a74e4bd40e2829f43bacac2');
  const delResult = await db.collection('categories').deleteMany({ store: oid });
  console.log('Deleted orphan categories:', delResult.deletedCount);
  
  // 2. Check subcategories
  const subs = await db.collection('subcategories').find({}).toArray();
  console.log('\nTotal subcategories:', subs.length);
  for (const s of subs) {
    console.log({
      _id: String(s._id),
      name: s.name,
      parentCategoryId: s.parentCategoryId,
      pidType: typeof s.parentCategoryId === 'object' ? 'ObjectId' : typeof s.parentCategoryId,
      store: s.store,
      storeType: typeof s.store === 'object' ? 'ObjectId' : typeof s.store,
    });
  }
  
  // 3. Check orders
  const orders = await db.collection('orders').find({}).toArray();
  console.log('\nTotal orders:', orders.length);
  for (const o of orders) {
    console.log({
      _id: String(o._id),
      storeType: typeof o.store === 'object' ? 'ObjectId' : typeof o.store,
      store: o.store,
    });
  }
  
  // 4. Check all products with store type
  const prods = await db.collection('products').find({}).toArray();
  console.log('\nTotal products:', prods.length);
  const storeTypeCounts = {};
  for (const p of prods) {
    const t = typeof p.store === 'object' ? 'ObjectId' : typeof p.store;
    storeTypeCounts[t] = (storeTypeCounts[t] || 0) + 1;
  }
  console.log('Product store type distribution:', storeTypeCounts);
  
  // 5. Check users  
  const users = await db.collection('users').find({}).toArray();
  console.log('\nTotal users:', users.length);
  for (const u of users) {
    console.log({
      _id: String(u._id),
      username: u.username,
      role: u.role,
      store: u.store,
      storeType: typeof u.store === 'object' ? 'ObjectId' : typeof u.store,
    });
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
