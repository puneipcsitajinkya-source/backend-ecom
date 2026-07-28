import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

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

  @Get()
  async findAll() {
    return this.feedbackService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.feedbackService.delete(id);
  }
}
