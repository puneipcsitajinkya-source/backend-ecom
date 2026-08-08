import { Controller, Get, Put, Body, Query, UseGuards, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Settings } from './settings.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Query('store') store?: string): Promise<Settings> {
    return this.settingsService.getSettings(store);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateSettings(
    @Body() data: Partial<Settings>,
    @Request() req: any,
    @Query('store') storeOverride?: string,
  ): Promise<Settings> {
    const user = req.user;
    if (user.role === 'store_admin') {
      return this.settingsService.updateSettings(data, user.store);
    }
    return this.settingsService.updateSettings(data, storeOverride);
  }
}
