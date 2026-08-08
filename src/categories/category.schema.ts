import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '🥦' })
  icon: string;

  @Prop()
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  showOnApp: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Store', required: false })
  store?: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ name: 1, store: 1 }, { unique: true });

