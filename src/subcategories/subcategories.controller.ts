import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Get()
  async findAll(@Query('categoryId') categoryId?: string, @Query('showOnApp') showOnApp?: string, @Query('store') store?: string) {
    if (categoryId) return this.subcategoriesService.findByCategory(categoryId, store);
    return this.subcategoriesService.findAll(showOnApp === 'true' ? true : undefined, store);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.subcategoriesService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() dto: { parentCategoryId: string; name: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean; store?: string },
    @Request() req: any,
  ) {
    const user = req.user;
    if (user.role === 'store_admin') {
      dto.store = user.store;
    }
    return this.subcategoriesService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: { name?: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean; store?: string },
    @Request() req: any,
  ) {
    const user = req.user;
    if (user.role === 'store_admin') {
      const subcategory = await this.subcategoriesService.findById(id);
      if (!subcategory.store || String(subcategory.store) !== String(user.store)) {
        throw new ForbiddenException('You do not have access to this subcategory');
      }
      dto.store = user.store;
    }
    return this.subcategoriesService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    if (user.role === 'store_admin') {
      const subcategory = await this.subcategoriesService.findById(id);
      if (!subcategory.store || String(subcategory.store) !== String(user.store)) {
        throw new ForbiddenException('You do not have access to this subcategory');
      }
    }
    return this.subcategoriesService.delete(id);
  }
}
