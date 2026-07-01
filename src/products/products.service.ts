import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly categoriesService: CategoriesService,
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

  async findAll(category?: string, search?: string, inStockOnly?: boolean): Promise<Product[]> {
    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
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
    if (dto.category) {
      const cat = await this.categoriesService.ensureCategoryExists(dto.category);
      if (cat) {
        dto.category = cat.name;
      }
    }
    const created = new this.productModel(dto);
    return created.save();
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    if (dto.category) {
      const cat = await this.categoriesService.ensureCategoryExists(dto.category);
      if (cat) {
        dto.category = cat.name;
      }
    }
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
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
