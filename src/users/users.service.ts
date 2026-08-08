import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: any): Promise<User> {
    const existing = await this.userModel.findOne({ username: dto.username.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const created = new this.userModel({
      ...dto,
      username: dto.username.toLowerCase(),
      password: hashedPassword,
    });
    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('store').sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate('store').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username: username.toLowerCase() }).populate('store').exec();
  }

  async update(id: string, dto: any): Promise<User> {
    const updateData = { ...dto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    if (updateData.username) {
      updateData.username = updateData.username.toLowerCase();
      const existing = await this.userModel.findOne({
        username: updateData.username,
        _id: { $ne: id },
      }).exec();
      if (existing) {
        throw new ConflictException('Username already taken');
      }
    }

    const updated = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true, returnDocument: 'after' })
      .populate('store')
      .exec();

    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('User not found');
    }
  }
}
