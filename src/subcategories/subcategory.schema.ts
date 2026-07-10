import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubcategoryDocument = Subcategory & Document;

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  parentCategoryId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '🏷️' })
  icon: string;

  @Prop()
  image?: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: true })
  showOnApp: boolean;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
