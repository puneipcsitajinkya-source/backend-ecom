import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('search') search?: string,
    @Query('inStock') inStock?: string,
    @Query('store') store?: string,
  ) {
    return this.productsService.findAll(category, subcategory, search, inStock === 'true', store);
  }

  @Get('stats')
  getStats(@Query('store') store?: string) {
    return this.productsService.getStats(store);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: any, @Request() req: any) {
    const user = req.user;
    if (user.role === 'store_admin') {
      dto.store = user.store;
    }
    return this.productsService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: any, @Request() req: any) {
    const user = req.user;
    if (user.role === 'store_admin') {
      const product = await this.productsService.findOne(id);
      if (!product.store || String(product.store) !== String(user.store)) {
        throw new ForbiddenException('You do not have access to this product');
      }
      dto.store = user.store;
    }
    return this.productsService.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    if (user.role === 'store_admin') {
      const product = await this.productsService.findOne(id);
      if (!product.store || String(product.store) !== String(user.store)) {
        throw new ForbiddenException('You do not have access to this product');
      }
    }
    return this.productsService.remove(id);
  }
}
