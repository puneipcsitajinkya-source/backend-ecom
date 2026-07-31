import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.settingsModel.countDocuments().exec();
    if (count === 0) {
      const defaultSettings = new this.settingsModel({
        deliveryFeeEnabled: false,
        deliveryFee: 0,
        gstEnabled: false,
        gstPercentage: 0,
        handlingFeeEnabled: false,
        handlingFee: 0,
        freeDeliveryThresholdEnabled: false,
        freeDeliveryThreshold: 0,
        contactNumber: '9239321112',
        defaultLanguage: 'en',
      });
      await defaultSettings.save();
      console.log('🌱 Default settings initialized successfully!');
    } else {
      // Run migrations on startup
      await this.getSettings();
      console.log('🔄 Settings migrations checked and run successfully!');
    }
  }

  async getSettings(): Promise<Settings> {
    let settings = await this.settingsModel.findOne().exec();
    if (!settings) {
      settings = new this.settingsModel({
        deliveryFeeEnabled: false,
        deliveryFee: 0,
        gstEnabled: false,
        gstPercentage: 0,
        handlingFeeEnabled: false,
        handlingFee: 0,
        freeDeliveryThresholdEnabled: false,
        freeDeliveryThreshold: 0,
        contactNumber: '9239321112',
        defaultLanguage: 'en',
        checkoutDisabled: false,
      });
      await settings.save();
    } else {
      // Migrate existing document if fields are missing
      let modified = false;
      if (!settings.banners || settings.banners.length === 0) {
        settings.banners = [
          {
            title: (settings as any).sliderTitle1 || 'Upto 50% Off Today',
            subtitle: (settings as any).sliderSubtitle1 || 'Get amazing discounts on all premium groceries & daily essentials',
            badge: (settings as any).sliderBadge1 || 'BEST OFFER',
            image: (settings as any).sliderImage1 || 'https://images.unsplash.com/photo-1506617498300-38435a0950e8?w=800&q=80',
            link: '',
            backgroundColor: '#a21caf',
          },
          {
            title: (settings as any).sliderTitle2 || 'Low Price Guaranteed',
            subtitle: (settings as any).sliderSubtitle2 || 'Unbeatable prices on fresh vegetables, milk, bread & eggs',
            badge: (settings as any).sliderBadge2 || 'LOWEST PRICE',
            image: (settings as any).sliderImage2 || 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&q=80',
            link: '',
            backgroundColor: '#15803d',
          },
          {
            title: (settings as any).sliderTitle3 || 'Mega Savings Week',
            subtitle: (settings as any).sliderSubtitle3 || 'Save big on your monthly grocery list with super saver packs',
            badge: (settings as any).sliderBadge3 || 'SUPER VALUE',
            image: (settings as any).sliderImage3 || 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&q=80',
            link: '',
            backgroundColor: '#ea580c',
          },
        ];
        modified = true;
      }
      if (settings.freeDeliveryThresholdEnabled === undefined) {
        settings.freeDeliveryThresholdEnabled = false;
        modified = true;
      }
      if (settings.freeDeliveryThreshold === undefined) {
        settings.freeDeliveryThreshold = 0;
        modified = true;
      }
      if (settings.contactNumber === undefined) {
        settings.contactNumber = '9239321112';
        modified = true;
      }
      if (settings.defaultLanguage === undefined) {
        settings.defaultLanguage = 'en';
        modified = true;
      }
      if (settings.checkoutDisabled === undefined) {
        settings.checkoutDisabled = false;
        modified = true;
      }
      if ((settings as any).sliderImage1 === undefined || (settings as any).sliderImage1 === 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80') {
        (settings as any).sliderImage1 = 'https://images.unsplash.com/photo-1506617498300-38435a0950e8?w=800&q=80';
        modified = true;
      }
      if ((settings as any).sliderImage2 === undefined || (settings as any).sliderImage2 === 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80') {
        (settings as any).sliderImage2 = 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&q=80';
        modified = true;
      }
      if ((settings as any).sliderImage3 === undefined || (settings as any).sliderImage3 === 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&q=80') {
        (settings as any).sliderImage3 = 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&q=80';
        modified = true;
      }
      if ((settings as any).sliderTitle1 === undefined) {
        (settings as any).sliderTitle1 = 'Upto 50% Off Today';
        modified = true;
      }
      if ((settings as any).sliderSubtitle1 === undefined) {
        (settings as any).sliderSubtitle1 = 'Get amazing discounts on all premium groceries & daily essentials';
        modified = true;
      }
      if ((settings as any).sliderBadge1 === undefined) {
        (settings as any).sliderBadge1 = 'BEST OFFER';
        modified = true;
      }
      if ((settings as any).sliderTitle2 === undefined) {
        (settings as any).sliderTitle2 = 'Low Price Guaranteed';
        modified = true;
      }
      if ((settings as any).sliderSubtitle2 === undefined) {
        (settings as any).sliderSubtitle2 = 'Unbeatable prices on fresh vegetables, milk, bread & eggs';
        modified = true;
      }
      if ((settings as any).sliderBadge2 === undefined) {
        (settings as any).sliderBadge2 = 'LOWEST PRICE';
        modified = true;
      }
      if ((settings as any).sliderTitle3 === undefined) {
        (settings as any).sliderTitle3 = 'Mega Savings Week';
        modified = true;
      }
      if ((settings as any).sliderSubtitle3 === undefined) {
        (settings as any).sliderSubtitle3 = 'Save big on your monthly grocery list with super saver packs';
        modified = true;
      }
      if ((settings as any).sliderBadge3 === undefined) {
        (settings as any).sliderBadge3 = 'SUPER VALUE';
        modified = true;
      }
      if (modified) {
        await settings.save();
      }
    }
    return settings;
  }

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    let settings = await this.settingsModel.findOne().exec();
    if (!settings) {
      settings = new this.settingsModel(data);
      return settings.save();
    }
    
    // Explicitly update all fields
    if (data.storeName !== undefined) settings.storeName = data.storeName;
    if (data.deliveryTime !== undefined) settings.deliveryTime = data.deliveryTime;
    if (data.minOrderAmount !== undefined) settings.minOrderAmount = Number(data.minOrderAmount);
    if (data.deliveryFeeEnabled !== undefined) settings.deliveryFeeEnabled = data.deliveryFeeEnabled;
    if (data.deliveryFee !== undefined) settings.deliveryFee = Number(data.deliveryFee);
    if (data.gstEnabled !== undefined) settings.gstEnabled = data.gstEnabled;
    if (data.gstPercentage !== undefined) settings.gstPercentage = Number(data.gstPercentage);
    if (data.handlingFeeEnabled !== undefined) settings.handlingFeeEnabled = data.handlingFeeEnabled;
    if (data.handlingFee !== undefined) settings.handlingFee = Number(data.handlingFee);
    if (data.freeDeliveryThresholdEnabled !== undefined) settings.freeDeliveryThresholdEnabled = data.freeDeliveryThresholdEnabled;
    if (data.freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = Number(data.freeDeliveryThreshold);
    if (data.contactNumber !== undefined) settings.contactNumber = data.contactNumber;
    if (data.defaultLanguage !== undefined) settings.defaultLanguage = data.defaultLanguage;
    if (data.checkoutDisabled !== undefined) settings.checkoutDisabled = data.checkoutDisabled;
    if (data.banners !== undefined) {
      settings.banners = data.banners;

      // Sync first 3 banners back to legacy columns to prevent breaking older clients
      if (data.banners[0]) {
        (settings as any).sliderTitle1 = data.banners[0].title || '';
        (settings as any).sliderSubtitle1 = data.banners[0].subtitle || '';
        (settings as any).sliderBadge1 = data.banners[0].badge || '';
        (settings as any).sliderImage1 = data.banners[0].image || '';
      }
      if (data.banners[1]) {
        (settings as any).sliderTitle2 = data.banners[1].title || '';
        (settings as any).sliderSubtitle2 = data.banners[1].subtitle || '';
        (settings as any).sliderBadge2 = data.banners[1].badge || '';
        (settings as any).sliderImage2 = data.banners[1].image || '';
      }
      if (data.banners[2]) {
        (settings as any).sliderTitle3 = data.banners[2].title || '';
        (settings as any).sliderSubtitle3 = data.banners[2].subtitle || '';
        (settings as any).sliderBadge3 = data.banners[2].badge || '';
        (settings as any).sliderImage3 = data.banners[2].image || '';
      }
    }
    if ((data as any).sliderImage1 !== undefined) (settings as any).sliderImage1 = (data as any).sliderImage1;
    if ((data as any).sliderImage2 !== undefined) (settings as any).sliderImage2 = (data as any).sliderImage2;
    if ((data as any).sliderImage3 !== undefined) (settings as any).sliderImage3 = (data as any).sliderImage3;
    if ((data as any).sliderTitle1 !== undefined) (settings as any).sliderTitle1 = (data as any).sliderTitle1;
    if ((data as any).sliderSubtitle1 !== undefined) (settings as any).sliderSubtitle1 = (data as any).sliderSubtitle1;
    if ((data as any).sliderBadge1 !== undefined) (settings as any).sliderBadge1 = (data as any).sliderBadge1;
    if ((data as any).sliderTitle2 !== undefined) (settings as any).sliderTitle2 = (data as any).sliderTitle2;
    if ((data as any).sliderSubtitle2 !== undefined) (settings as any).sliderSubtitle2 = (data as any).sliderSubtitle2;
    if ((data as any).sliderBadge2 !== undefined) (settings as any).sliderBadge2 = (data as any).sliderBadge2;
    if ((data as any).sliderTitle3 !== undefined) (settings as any).sliderTitle3 = (data as any).sliderTitle3;
    if ((data as any).sliderSubtitle3 !== undefined) (settings as any).sliderSubtitle3 = (data as any).sliderSubtitle3;
    if ((data as any).sliderBadge3 !== undefined) (settings as any).sliderBadge3 = (data as any).sliderBadge3;

    return settings.save();
  }
}
