import { Controller, Post, Body, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.schema';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() createFeedbackDto: {
    name?: string;
    email?: string;
    type: string;
    rating?: number;
    message: string;
  }) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Get()
  async findAll() {
    return this.feedbackService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.feedbackService.delete(id);
  }
}
