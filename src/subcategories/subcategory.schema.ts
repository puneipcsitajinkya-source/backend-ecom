import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type SubcategoryDocument = Subcategory & Document;

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  parentCategoryId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '🏷️' })
  icon: string;

  @Prop()
  image?: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  showOnApp: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Store', required: false })
  store?: Types.ObjectId;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
