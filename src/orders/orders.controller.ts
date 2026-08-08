import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order.schema';
import { AuthGuard, OptionalAuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req: any, @Query('store') store?: string) {
    const user = req.user;
    if (user.role === 'store_admin') {
      return this.ordersService.findAll(user.store);
    }
    return this.ordersService.findAll(store);
  }

  @Get('customer/:mobile')
  findByCustomer(@Param('mobile') mobile: string) {
    return this.ordersService.findByCustomer(mobile);
  }

  @UseGuards(AuthGuard)
  @Get('stats')
  getStats(@Request() req: any, @Query('store') store?: string) {
    const user = req.user;
    if (user.role === 'store_admin') {
      return this.ordersService.getStats(user.store);
    }
    return this.ordersService.getStats(store);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    if (user && user.role === 'store_admin') {
      return this.ordersService.findOne(id, user.store);
    }
    return this.ordersService.findOne(id);
  }

  @UseGuards(OptionalAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Request() req: any,
  ) {
    const user = req.user;
    if (user && user.role === 'store_admin') {
      return this.ordersService.updateStatus(id, status, user.store);
    }
    return this.ordersService.updateStatus(id, status);
  }
}
