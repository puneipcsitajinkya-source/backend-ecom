import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from './email.service';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly emailService: EmailService,
    private readonly storesService: StoresService,
  ) {}

  async create(dto: any): Promise<Order> {
    const orderData = { ...dto };
    if (!orderData.store && orderData.latitude && orderData.longitude) {
      const nearest = await this.storesService.findNearest(orderData.latitude, orderData.longitude);
      if (nearest.store) {
        orderData.store = (nearest.store as any)._id;
      }
    }
    const order = new this.orderModel(orderData);
    const savedOrder = await order.save();
    
    // Trigger email notification asynchronously to avoid blocking the client response
    this.emailService.sendNewOrderNotification(savedOrder).catch((err) => {
      console.error('Failed to trigger email notification:', err.message);
    });
    
    return savedOrder;
  }

  async findAll(store?: string): Promise<Order[]> {
    const filter = store ? { store: new Types.ObjectId(store) } : {};
    return this.orderModel.find(filter).populate('store').sort({ createdAt: -1 }).exec();
  }

  async findByCustomer(mobile: string): Promise<Order[]> {
    return this.orderModel.find({ mobile }).populate('store').sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, store?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (store) {
      filter.store = new Types.ObjectId(store);
    }
    const order = await this.orderModel.findOne(filter).populate('store').exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, store?: string): Promise<Order> {
    const filter: any = { _id: id };
    if (store) {
      filter.store = new Types.ObjectId(store);
    }
    const order = await this.orderModel
      .findOneAndUpdate(filter, { status }, { new: true, returnDocument: 'after' })
      .populate('store')
      .exec();
    if (!order) throw new NotFoundException('Order not found or access denied');
    return order;
  }

  async getStats(store?: string): Promise<{
    total: number;
    pending: number;
    delivered: number;
    confirmed: number;
    outForDelivery: number;
    totalRevenue: number;
    deliveredRevenue: number;
  }> {
    const countFilter = (status?: OrderStatus) => {
      const f: any = {};
      if (store) f.store = new Types.ObjectId(store);
      if (status) f.status = status;
      return f;
    };

    const revMatch: any = {};
    if (store) revMatch.store = new Types.ObjectId(store);

    const delRevMatch: any = { status: OrderStatus.DELIVERED };
    if (store) delRevMatch.store = new Types.ObjectId(store);

    const [total, pending, delivered, confirmed, outForDelivery, revenueRes, deliveredRevenueRes] =
      await Promise.all([
        this.orderModel.countDocuments(countFilter()).exec(),
        this.orderModel.countDocuments(countFilter(OrderStatus.PENDING)).exec(),
        this.orderModel.countDocuments(countFilter(OrderStatus.DELIVERED)).exec(),
        this.orderModel.countDocuments(countFilter(OrderStatus.CONFIRMED)).exec(),
        this.orderModel.countDocuments(countFilter(OrderStatus.OUT_FOR_DELIVERY)).exec(),
        this.orderModel.aggregate([
          { $match: revMatch },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]).exec(),
        this.orderModel.aggregate([
          { $match: delRevMatch },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]).exec(),
      ]);

    const totalRevenue = revenueRes[0]?.total || 0;
    const deliveredRevenue = deliveredRevenueRes[0]?.total || 0;

    return {
      total,
      pending,
      delivered,
      confirmed,
      outForDelivery,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      deliveredRevenue: Number(deliveredRevenue.toFixed(2)),
    };
  }
}
