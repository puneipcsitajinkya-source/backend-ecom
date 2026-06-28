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
    return this.categoryModel.find(filter).sort({ name: 1 }).exec();
  }

  async create(dto: { name: string; icon?: string; showOnApp?: boolean }): Promise<Category> {
    const created = new this.categoryModel(dto);
    return created.save();
  }

  async update(id: string, dto: { name?: string; icon?: string; showOnApp?: boolean }): Promise<Category> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
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
