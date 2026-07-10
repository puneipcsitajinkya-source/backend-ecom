import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../categories/category.schema';
import { Subcategory, SubcategoryDocument } from './subcategory.schema';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

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

  async create(dto: { parentCategoryId: string; name: string; icon?: string; image?: string; sortOrder?: number; showOnApp?: boolean }) {
    const created = new this.subcategoryModel({
      parentCategoryId: new Types.ObjectId(dto.parentCategoryId),
      name: dto.name.trim(),
      icon: dto.icon || '🏷️',
      image: dto.image?.trim() || undefined,
      sortOrder: dto.sortOrder || 0,
      showOnApp: dto.showOnApp !== false,
    });
    return created.save();
  }

  async update(id: string, dto: { name?: string; icon?: string; image?: string; sortOrder?: number; showOnApp?: boolean }) {
    const updated = await this.subcategoryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Subcategory not found');
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.subcategoryModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Subcategory not found');
    return deleted;
  }
}
