// Migration script: migrate legacy product documents to a normalized products_migrated collection.
// Run with: node scripts/migrate-products.js

require('dotenv').config();
const mongoose = require('mongoose');
const { Types } = mongoose;

const CANDIDATE_SOURCES = ['products_legacy', 'products_old', 'products_raw', 'products'];
const TARGET_COLLECTION = 'products_migrated';

function isObjectIdLike(val) {
  return typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);
}

function normalizeNameField(src) {
  if (!src) return { en: '', mr: '' };
  if (typeof src === 'string') return { en: src, mr: src };
  if (typeof src === 'object') {
    return {
      en: src.en || src.en === 0 ? String(src.en) : (src.name || ''),
      mr: src.mr || src.mr === 0 ? String(src.mr) : (src.name || ''),
    };
  }
  return { en: String(src), mr: String(src) };
}

async function findOrCreateCategory(categoriesCol, name) {
  const normalized = (name || 'General').trim();
  if (!normalized) return { name: 'General', _id: null };
  // try by exact name (case-insensitive)
  const found = await categoriesCol.findOne({ name: { $regex: `^${normalized}$`, $options: 'i' } });
  if (found) return found;
  const now = new Date();
  const doc = { name: normalized, icon: '🏷️', image: undefined, sortOrder: 0, showOnApp: true, createdAt: now, updatedAt: now };
  const res = await categoriesCol.insertOne(doc);
  doc._id = res.insertedId;
  return doc;
}

async function findOrCreateSubcategory(subcategoriesCol, categoriesCol, parentCategoryDoc, subName) {
  if (!subName) return null;
  // If subName looks like ObjectId, verify existence
  if (isObjectIdLike(subName)) {
    const foundById = await subcategoriesCol.findOne({ _id: new Types.ObjectId(subName) });
    if (foundById) return foundById;
  }
  const parentId = parentCategoryDoc?._id;
  const normalized = String(subName).trim();
  if (!parentId) return null;
  const found = await subcategoriesCol.findOne({ parentCategoryId: parentId, name: { $regex: `^${normalized}$`, $options: 'i' } });
  if (found) return found;
  const now = new Date();
  const doc = { parentCategoryId: parentId, name: normalized, icon: '🏷️', image: undefined, sortOrder: 0, showOnApp: true, createdAt: now, updatedAt: now };
  const res = await subcategoriesCol.insertOne(doc);
  doc._id = res.insertedId;
  return doc;
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const existing = await db.listCollections().toArray();
  const names = existing.map(c => c.name);
  let sourceName = null;
  for (const cand of CANDIDATE_SOURCES) {
    if (names.includes(cand)) { sourceName = cand; break; }
  }
  if (!sourceName) {
    console.error('No source product collection found. Checked:', CANDIDATE_SOURCES.join(', '));
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('Using source collection:', sourceName);
  const srcCol = db.collection(sourceName);
  const tgtCol = db.collection(TARGET_COLLECTION);
  const categoriesCol = db.collection('categories');
  const subcategoriesCol = db.collection('subcategories');

  // Clear target (idempotent for re-run)
  console.log('Clearing target collection:', TARGET_COLLECTION);
  await tgtCol.deleteMany({});

  const cursor = srcCol.find({});
  let processed = 0;
  const batch = [];
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const now = new Date();

    const name = normalizeNameField(doc.name || { en: doc.nameEn, mr: doc.nameMr } );
    const price = doc.price != null ? Number(doc.price) : 0;
    const mrp = doc.mrp != null ? Number(doc.mrp) : (doc.mrpPrice != null ? Number(doc.mrpPrice) : 0);
    let discount = doc.discount != null ? Number(doc.discount) : 0;
    if ((!discount || discount === 0) && mrp > price) {
      discount = Math.round(((mrp - price) / mrp) * 100);
    }

    const image = Array.isArray(doc.image) ? (doc.image[0] || null) : (doc.image || doc.imageUrl || null);

    // Resolve category
    let categoryDoc = null;
    if (doc.category) {
      if (isObjectIdLike(doc.category)) {
        categoryDoc = await categoriesCol.findOne({ _id: new Types.ObjectId(doc.category) });
      }
      if (!categoryDoc && typeof doc.category === 'string') {
        categoryDoc = await categoriesCol.findOne({ name: { $regex: `^${doc.category.trim()}$`, $options: 'i' } });
      }
    }
    if (!categoryDoc) {
      categoryDoc = await findOrCreateCategory(categoriesCol, doc.category || doc.categoryName || 'General');
    }

    // Resolve or create subcategory
    let subcategoryId = undefined;
    if (doc.subcategory) {
      const subFound = await findOrCreateSubcategory(subcategoriesCol, categoriesCol, categoryDoc, doc.subcategory);
      if (subFound) subcategoryId = subFound._id;
    } else if (doc.subcategoryName) {
      const subFound = await findOrCreateSubcategory(subcategoriesCol, categoriesCol, categoryDoc, doc.subcategoryName);
      if (subFound) subcategoryId = subFound._id;
    }

    const out = {
      _id: doc._id, // preserve original id
      name,
      description: doc.description || doc.desc || '',
      price,
      mrp,
      discount,
      unit: doc.unit || '1 pc',
      inStock: typeof doc.inStock === 'boolean' ? doc.inStock : (doc.stock != null ? Number(doc.stock) > 0 : !!doc.inStock),
      brand: doc.brand || '',
      image: image || undefined,
      category: categoryDoc?.name || 'General',
      subcategory: subcategoryId ? subcategoryId : undefined,
      createdAt: doc.createdAt || now,
      updatedAt: doc.updatedAt || now,
    };

    batch.push(out);
    processed++;

    if (batch.length >= 200) {
      await tgtCol.insertMany(batch, { ordered: false }).catch(e => console.error('Insert batch error', e));
      batch.length = 0;
      console.log(`Processed ${processed} documents...`);
    }
  }

  if (batch.length > 0) {
    await tgtCol.insertMany(batch, { ordered: false }).catch(e => console.error('Insert final batch error', e));
  }

  console.log(`Migration complete. Processed ${processed} documents. Target: ${TARGET_COLLECTION}`);
  console.log('You can review migrated docs and replace original collection if desired.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
