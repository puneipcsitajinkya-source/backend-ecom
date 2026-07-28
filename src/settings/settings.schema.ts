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

  @Prop({ default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80' })
  sliderImage1: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80' })
  sliderImage2: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&q=80' })
  sliderImage3: string;

  @Prop({ default: 'Upto 50% Off Today' })
  sliderTitle1: string;

  @Prop({ default: 'Get amazing discounts on all premium groceries & daily essentials' })
  sliderSubtitle1: string;

  @Prop({ default: 'BEST OFFER' })
  sliderBadge1: string;

  @Prop({ default: 'Low Price Guaranteed' })
  sliderTitle2: string;

  @Prop({ default: 'Unbeatable prices on fresh vegetables, milk, bread & eggs' })
  sliderSubtitle2: string;

  @Prop({ default: 'LOWEST PRICE' })
  sliderBadge2: string;

  @Prop({ default: 'Mega Savings Week' })
  sliderTitle3: string;

  @Prop({ default: 'Save big on your monthly grocery list with super saver packs' })
  sliderSubtitle3: string;

  @Prop({ default: 'SUPER VALUE' })
  sliderBadge3: string;

  @Prop({ default: false })
  checkoutDisabled: boolean;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
