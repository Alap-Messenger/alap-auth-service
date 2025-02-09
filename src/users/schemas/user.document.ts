import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type UserDocument = User &
  Document<Types.ObjectId> & {
    getUserName(fullName: string): string;
    comparePassword(userPassword: string): Promise<boolean>;
  };
