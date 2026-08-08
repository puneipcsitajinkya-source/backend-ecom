import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Settings, SettingsDocument } from './settings.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  async onModuleInit() {
    const count = await this.settingsModel.countDocuments({
      $or: [{ store: null }, { store: { $exists: false } }]
    }).exec();

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
    }
  }

  async getSettings(store?: string): Promise<Settings> {
    const filter: any = store
      ? { store: new Types.ObjectId(store) }
      : { $or: [{ store: null }, { store: { $exists: false } }] };

    let settings = await this.settingsModel.findOne(filter).exec();

    if (!settings) {
      // If store settings do not exist, fetch global settings to copy from
      const globalSettings = await this.settingsModel.findOne({
        $or: [{ store: null }, { store: { $exists: false } }]
      }).exec();

      const defaultData = {
        deliveryFeeEnabled: globalSettings?.deliveryFeeEnabled ?? false,
        deliveryFee: globalSettings?.deliveryFee ?? 0,
        gstEnabled: globalSettings?.gstEnabled ?? false,
        gstPercentage: globalSettings?.gstPercentage ?? 0,
        handlingFeeEnabled: globalSettings?.handlingFeeEnabled ?? false,
        handlingFee: globalSettings?.handlingFee ?? 0,
        freeDeliveryThresholdEnabled: globalSettings?.freeDeliveryThresholdEnabled ?? false,
        freeDeliveryThreshold: globalSettings?.freeDeliveryThreshold ?? 0,
        contactNumber: globalSettings?.contactNumber ?? '9239321112',
        defaultLanguage: globalSettings?.defaultLanguage ?? 'en',
        checkoutDisabled: globalSettings?.checkoutDisabled ?? false,
        banners: globalSettings?.banners ?? [],
        storeName: globalSettings?.storeName ?? 'FirstMart',
        deliveryTime: globalSettings?.deliveryTime ?? '10-15 mins',
      };

      settings = new this.settingsModel({
        ...defaultData,
        store: store ? new Types.ObjectId(store) : undefined,
      });
      await settings.save();
    } else {
      // Self-healing migration for missing fields
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
      if (modified) {
        await settings.save();
      }
    }
    return settings;
  }

  async updateSettings(data: Partial<Settings>, store?: string): Promise<Settings> {
    const filter: any = store
      ? { store: new Types.ObjectId(store) }
      : { $or: [{ store: null }, { store: { $exists: false } }] };

    let settings = await this.settingsModel.findOne(filter).exec();
    if (!settings) {
      settings = new this.settingsModel({
        ...data,
        store: store ? new Types.ObjectId(store) : undefined,
      });
      return settings.save();
    }

    // Explicitly update fields
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
    if (data.banners !== undefined) settings.banners = data.banners;

    return settings.save();
  }
}
