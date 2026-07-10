import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get()
  async findAll(@Query('categoryId') categoryId?: string, @Query('showOnApp') showOnApp?: string) {
    if (categoryId) return this.subcategoriesService.findByCategory(categoryId);
    return this.subcategoriesService.findAll(showOnApp === 'true' ? true : undefined);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.subcategoriesService.findById(id);
  }

  @Post()
  async create(@Body() dto: { parentCategoryId: string; name: string; icon?: string; image?: string; sortOrder?: number; showOnApp?: boolean }) {
    return this.subcategoriesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: { name?: string; icon?: string; image?: string; sortOrder?: number; showOnApp?: boolean }) {
    return this.subcategoriesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.subcategoriesService.delete(id);
  }
}
