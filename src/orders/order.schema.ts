import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CLOSED = 'closed',
}

export class OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  mobile: string;

  @Prop()
  customerName?: string;

  @Prop()
  instructions?: string;

  @Prop({ default: 0 })
  latitude: number;

  @Prop({ default: 0 })
  longitude: number;

  @Prop({ type: Array, required: true })
  items: OrderItem[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  deliveryFee: number;

  @Prop({ default: 0 })
  gstAmount: number;

  @Prop({ default: 0 })
  handlingFee: number;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop()
  address?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
