import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ default: '🥦' })
  icon: string;

  @Prop({ default: true })
  showOnApp: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
