import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { SubcategoriesService } from '../subcategories/subcategories.service';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly categoriesService: CategoriesService,
    private readonly subcategoriesService: SubcategoriesService,
  ) {}

  async onModuleInit() {
    try {
      // Find all distinct categories currently assigned to products
      const uniqueProductCategories = await this.productModel.distinct('category').exec();
      for (const catName of uniqueProductCategories) {
        if (catName && typeof catName === 'string') {
          await this.categoriesService.ensureCategoryExists(catName);
        }
      }
      console.log('🔄 Synced categories from products database successfully.');
    } catch (err) {
      console.error('❌ Failed to sync categories from products database:', err);
    }
  }

  async findAll(category?: string, subcategory?: string, search?: string, inStockOnly?: boolean): Promise<Product[]> {
    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }
    if (subcategory && subcategory !== 'All') {
      // if subcategory looks like an ObjectId, match directly
      if (/^[0-9a-fA-F]{24}$/.test(subcategory)) {
        filter.subcategory = subcategory;
      } else {
        // try to resolve name -> id using subcategories service within provided category
        const list = await this.subcategoriesService.findByCategory(category || '');
        const found = list.find(s => (s.name || '').toLowerCase() === subcategory.trim().toLowerCase());
        if (found) {
          filter.subcategory = String(found._id);
        } else {
          // unresolved subcategory name -> no results
          return [];
        }
      }
    }
    if (search) {
      filter.$or = [
        { 'name.en': new RegExp(search, 'i') },
        { 'name.mr': new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
      ];
    }
    if (inStockOnly) {
      filter.inStock = true;
    }
    return this.productModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    dto = this.normalizeProductInput(dto);
    if (dto.category) {
      const cat = await this.categoriesService.ensureCategoryExists(dto.category);
      if (cat) {
        dto.category = cat.name;
      }
    }
    // Resolve subcategory id if provided as name or id
    if (dto.subcategory) {
      const subVal = String(dto.subcategory).trim();
      if (Types.ObjectId.isValid(subVal)) {
        // store as ObjectId string
        dto.subcategory = subVal;
      } else {
        // try to resolve by name within category
        const found = await this.subcategoriesService.findByCategory(dto.category || '')
          .then(list => list.find(s => (s.name || '').toLowerCase() === subVal.toLowerCase()));
        if (found) dto.subcategory = String(found._id);
      }
    }
    const created = new this.productModel(dto);
    return created.save();
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    dto = this.normalizeProductInput(dto);
    if (dto.category) {
      const cat = await this.categoriesService.ensureCategoryExists(dto.category);
      if (cat) {
        dto.category = cat.name;
      }
    }
    if (dto.subcategory) {
      const subVal = String(dto.subcategory).trim();
      if (Types.ObjectId.isValid(subVal)) {
        dto.subcategory = subVal;
      } else {
        const found = await this.subcategoriesService.findByCategory(dto.category || '')
          .then(list => list.find(s => (s.name || '').toLowerCase() === subVal.toLowerCase()));
        if (found) dto.subcategory = String(found._id);
      }
    }
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  // Normalize incoming product payloads to match CreateProductDto shape
  private normalizeProductInput(input: any): any {
    if (!input || typeof input !== 'object') return input;
    const dto: any = { ...input };

    // Normalize name: accept string, {en,mr} or nameEn/nameMr
    if (typeof dto.name === 'string') {
      dto.name = { en: dto.name, mr: dto.name };
    } else if (!dto.name && (dto.nameEn || dto.nameMr)) {
      dto.name = { en: dto.nameEn || dto.nameMr || '', mr: dto.nameMr || dto.nameEn || '' };
      delete dto.nameEn;
      delete dto.nameMr;
    }

    // Coerce numeric fields
    if (dto.price != null) dto.price = Number(dto.price);
    if (dto.mrp != null) dto.mrp = Number(dto.mrp);
    if (dto.discount != null) dto.discount = Number(dto.discount);

    // Accept legacy stock/int fields
    if (dto.inStock == null && dto.stock != null) {
      dto.inStock = Number(dto.stock) > 0;
    }

    // Normalize image arrays
    if (Array.isArray(dto.image) && dto.image.length > 0) {
      dto.image = dto.image[0];
    }

    // Trim category strings
    if (typeof dto.category === 'string') dto.category = dto.category.trim();

    // Subcategory: leave as-is (string id or name) — service will resolve it.

    return dto;
  }

  async remove(id: string): Promise<void> {
    const res = await this.productModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Product not found');
  }

  async getStats(): Promise<{ total: number }> {
    const total = await this.productModel.countDocuments().exec();
    return { total };
  }
}
