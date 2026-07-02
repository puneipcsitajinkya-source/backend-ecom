import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ default: 'FirstMart' })
  storeName: string;

  @Prop({ default: '10-15 mins' })
  deliveryTime: string;

  @Prop({ default: 0 })
  minOrderAmount: number;

  @Prop({ default: false })
  deliveryFeeEnabled: boolean;

  @Prop({ default: 0 })
  deliveryFee: number;

  @Prop({ default: false })
  gstEnabled: boolean;

  @Prop({ default: 0 })
  gstPercentage: number;

  @Prop({ default: false })
  handlingFeeEnabled: boolean;

  @Prop({ default: 0 })
  handlingFee: number;

  @Prop({ default: false })
  freeDeliveryThresholdEnabled: boolean;

  @Prop({ default: 0 })
  freeDeliveryThreshold: number;

  @Prop({ default: '9239321112' })
  contactNumber: string;

  @Prop({ default: 'en' })
  defaultLanguage: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
