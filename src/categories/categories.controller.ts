import { Controller, Get, Post, Delete, Patch, Body, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Query('hasProducts') hasProducts?: string,
    @Query('showOnApp') showOnApp?: string,
    @Query('store') store?: string,
  ) {
    return this.categoriesService.findAll(
      hasProducts === 'true',
      showOnApp === 'true' ? true : undefined,
      store,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body() dto: { name: string; icon?: string; image?: string; images?: string[]; sortOrder?: number; showOnApp?: boolean; store?: string },
    @Request() req: any,
  ) {
    const user = req.user;
    if (user.role === 'store_admin') {
      dto.store = user.store;
    }
    return this.categoriesService.create(dto);
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
      const category = await this.categoriesService.findOne(id);
      if (!category.store || String(category.store) !== String(user.store)) {
        throw new ForbiddenException('You do not have access to this category');
      }
      dto.store = user.store;
    }
    return this.categoriesService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    if (user.role === 'store_admin') {
      const category = await this.categoriesService.findOne(id);
      if (!category.store || String(category.store) !== String(user.store)) {
        throw new ForbiddenException('You do not have access to this category');
      }
    }
    return this.categoriesService.remove(id);
  }
}

