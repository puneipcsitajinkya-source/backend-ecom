import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../categories/category.schema';
import { Subcategory, SubcategoryDocument } from './subcategory.schema';

@Injectable()
export class SubcategoriesService implements OnModuleInit {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    // Migration: ensure all existing subcategories have the images array initialized
    const legacySubcategories = await this.subcategoryModel.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ],
      image: { $exists: true, $ne: '' }
    }).exec();
    if (legacySubcategories.length > 0) {
      console.log(`🧹 Found ${legacySubcategories.length} legacy subcategories without images array. Migrating...`);
      for (const sub of legacySubcategories) {
        sub.images = [sub.image!];
        await sub.save();
      }
    }
  }

  async findByCategory(parentCategoryId: string) {
    const resolvedParentId = await this.resolveCategoryId(parentCategoryId);
    if (!resolvedParentId) return [];

    return this.subcategoryModel
      .find({ parentCategoryId: resolvedParentId })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  private async resolveCategoryId(input: string): Promise<Types.ObjectId | null> {
    const value = input?.trim();
    if (!value) return null;

    if (Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    }

    const category = await this.categoryModel
      .findOne({
        name: { $regex: `^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
      })
      .exec();

    return category?._id ? new Types.ObjectId(category._id) : null;
  }

  async findAll(showOnApp?: boolean) {
    const filter: any = {};
    if (showOnApp !== undefined) filter.showOnApp = showOnApp;
    return this.subcategoryModel.find(filter).sort({ sortOrder: 1, name: 1 }).exec();
  }

  async findById(id: string) {
    const s = await this.subcategoryModel.findById(id).exec();
    if (!s) throw new NotFoundException('Subcategory not found');
    return s;
  }

  async create(dto: { parentCategoryId: string; name: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean }) {
    const data = { ...dto } as any;
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
      if (!data.image && data.images.length > 0) {
        data.image = data.images[0];
      }
    } else if (data.image && typeof data.image === 'string') {
      data.images = [data.image];
    } else if (Array.isArray(data.image) && data.image.length > 0) {
      data.images = data.image.filter((img: any) => typeof img === 'string' && img.trim() !== '');
      data.image = data.images[0] || '';
    } else {
      data.images = [];
    }

    const created = new this.subcategoryModel({
      parentCategoryId: new Types.ObjectId(data.parentCategoryId),
      name: data.name.trim(),
      icon: data.icon || '🏷️',
      image: data.image?.trim() || undefined,
      images: data.images,
      sortOrder: data.sortOrder || 0,
      showOnApp: data.showOnApp !== false,
    });
    return created.save();
  }

  async update(id: string, dto: { name?: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean }) {
    const data = { ...dto } as any;
    if (data.images !== undefined || data.image !== undefined) {
      if (data.images && Array.isArray(data.images)) {
        data.images = data.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
        if (!data.image && data.images.length > 0) {
          data.image = data.images[0];
        }
      } else if (data.image && typeof data.image === 'string') {
        data.images = [data.image];
      } else if (Array.isArray(data.image) && data.image.length > 0) {
        data.images = data.image.filter((img: any) => typeof img === 'string' && img.trim() !== '');
        data.image = data.images[0] || '';
      } else {
        data.images = [];
      }
    }

    const updated = await this.subcategoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Subcategory not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.subcategoryModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Subcategory not found');
    return deleted;
  }
}
