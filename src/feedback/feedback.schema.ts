import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop()
  name?: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  type: string; // 'feedback' | 'report'

  @Prop()
  rating?: number;

  @Prop({ required: true })
  message: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
