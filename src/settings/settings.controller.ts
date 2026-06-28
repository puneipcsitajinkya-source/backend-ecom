import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './settings.schema';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(): Promise<Settings> {
    return this.settingsService.getSettings();
  }

  @Put()
  async updateSettings(@Body() data: Partial<Settings>): Promise<Settings> {
    return this.settingsService.updateSettings(data);
  }
}
