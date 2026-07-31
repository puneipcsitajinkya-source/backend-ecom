import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.categoryModel.countDocuments().exec();
    if (count === 0) {
      const defaults = [
        { name: 'Grocery', icon: '🛒' },
        { name: 'Clothing', icon: '👕' },
        { name: 'Vegetables', icon: '🥦' },
        { name: 'Fruits', icon: '🍎' },
        { name: 'Leafy Greens', icon: '🥬' },
        { name: 'Roots & Tubers', icon: '🥔' },
        { name: 'Herbs', icon: '🌿' },
        { name: 'General', icon: '📦' },
      ];
      await this.categoryModel.insertMany(defaults);
      console.log('🌱 Default categories seeded successfully!');
    }
    // Migration: ensure all existing categories have showOnApp field initialized to true
    await this.categoryModel.updateMany({ showOnApp: { $exists: false } }, { $set: { showOnApp: true } }).exec();

    // Migration: ensure all existing categories have the images array initialized
    const legacyCategories = await this.categoryModel.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ],
      image: { $exists: true, $ne: '' }
    }).exec();
    if (legacyCategories.length > 0) {
      console.log(`🧹 Found ${legacyCategories.length} legacy categories without images array. Migrating...`);
      for (const cat of legacyCategories) {
        cat.images = [cat.image];
        await cat.save();
      }
    }
  }

  async findAll(hasProducts?: boolean, showOnApp?: boolean): Promise<Category[]> {
    const filter: any = {};
    if (showOnApp !== undefined) {
      filter.showOnApp = showOnApp;
    }
    if (hasProducts) {
      const activeCategories = await this.productModel.distinct('category').exec();
      filter.name = { $in: activeCategories };
    }
    return this.categoryModel.find(filter).sort({ sortOrder: 1, name: 1 }).exec();
  }

  async create(dto: { name: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean }): Promise<Category> {
    const normalized = { ...dto } as any;
    if (normalized.images && Array.isArray(normalized.images)) {
      normalized.images = normalized.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
      if (!normalized.image && normalized.images.length > 0) {
        normalized.image = normalized.images[0];
      }
    } else if (normalized.image && typeof normalized.image === 'string') {
      normalized.images = [normalized.image];
    } else if (Array.isArray(normalized.image) && normalized.image.length > 0) {
      normalized.images = normalized.image.filter((img: any) => typeof img === 'string' && img.trim() !== '');
      normalized.image = normalized.images[0] || '';
    } else {
      normalized.images = [];
    }
    const created = new this.categoryModel(normalized);
    return created.save();
  }

  async update(id: string, dto: { name?: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean }): Promise<Category> {
    const normalized = { ...dto } as any;
    if (normalized.images !== undefined || normalized.image !== undefined) {
      if (normalized.images && Array.isArray(normalized.images)) {
        normalized.images = normalized.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
        if (!normalized.image && normalized.images.length > 0) {
          normalized.image = normalized.images[0];
        }
      } else if (normalized.image && typeof normalized.image === 'string') {
        normalized.images = [normalized.image];
      } else if (Array.isArray(normalized.image) && normalized.image.length > 0) {
        normalized.images = normalized.image.filter((img: any) => typeof img === 'string' && img.trim() !== '');
        normalized.image = normalized.images[0] || '';
      } else {
        normalized.images = [];
      }
    }
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, normalized, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Category not found');
  }

  async ensureCategoryExists(name: string): Promise<Category | null> {
    const trimmedName = name.trim();
    if (!trimmedName) return null;
    let category = await this.categoryModel
      .findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } })
      .exec();
    if (!category) {
      category = new this.categoryModel({ name: trimmedName, icon: '🏷️' });
      await category.save();
    }
    return category;
  }
}
