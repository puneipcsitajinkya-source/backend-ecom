import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: {
      en: { type: String, required: true },
      mr: { type: String, required: true },
    },
    required: true,
  })
  name: {
    en: string;
    mr: string;
  };

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  mrp: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ default: '1 pc' })
  unit: string;

  @Prop({ default: true })
  inStock: boolean;

  @Prop()
  brand: string;

  @Prop()
  image: string;

  @Prop({ default: 'Vegetables' })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
