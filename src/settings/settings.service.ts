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
      });
      await settings.save();
    } else {
      // Migrate existing document if fields are missing
      let modified = false;
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

    return settings.save();
  }
}
