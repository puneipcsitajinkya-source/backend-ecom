import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from './email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(dto);
    const savedOrder = await order.save();
    
    // Trigger email notification asynchronously to avoid blocking the client response
    this.emailService.sendNewOrderNotification(savedOrder).catch((err) => {
      console.error('Failed to trigger email notification:', err.message);
    });
    
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByCustomer(mobile: string): Promise<Order[]> {
    return this.orderModel.find({ mobile }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    delivered: number;
    confirmed: number;
    outForDelivery: number;
  }> {
    const [total, pending, delivered, confirmed, outForDelivery] =
      await Promise.all([
        this.orderModel.countDocuments().exec(),
        this.orderModel.countDocuments({ status: OrderStatus.PENDING }).exec(),
        this.orderModel.countDocuments({ status: OrderStatus.DELIVERED }).exec(),
        this.orderModel.countDocuments({ status: OrderStatus.CONFIRMED }).exec(),
        this.orderModel
          .countDocuments({ status: OrderStatus.OUT_FOR_DELIVERY })
          .exec(),
      ]);
    return { total, pending, delivered, confirmed, outForDelivery };
  }
}
