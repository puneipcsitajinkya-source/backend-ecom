import { Controller, Get, Post, Delete, Patch, Body, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Query('hasProducts') hasProducts?: string,
    @Query('showOnApp') showOnApp?: string,
  ) {
    return this.categoriesService.findAll(
      hasProducts === 'true',
      showOnApp === 'true' ? true : undefined,
    );
  }

  @Post()
  create(@Body() dto: { name: string; icon?: string; showOnApp?: boolean }) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: { name?: string; icon?: string; showOnApp?: boolean },
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
