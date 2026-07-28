import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(createFeedbackDto: any): Promise<Feedback> {
    const createdFeedback = new this.feedbackModel(createFeedbackDto);
    return createdFeedback.save();
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
  }

  async delete(id: string): Promise<Feedback | null> {
    return this.feedbackModel.findByIdAndDelete(id).exec();
  }
}
