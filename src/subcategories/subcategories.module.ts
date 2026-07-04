import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/category.schema';
import { Subcategory, SubcategorySchema } from './subcategory.schema';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [SubcategoriesService],
  controllers: [SubcategoriesController],
  exports: [SubcategoriesService],
})
export class SubcategoriesModule {}
