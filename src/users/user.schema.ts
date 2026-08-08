import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SUPERADMIN = 'superadmin',
  STORE_ADMIN = 'store_admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.STORE_ADMIN })
  role: UserRole;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Store', required: false })
  store?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
