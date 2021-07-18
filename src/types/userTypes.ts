import { Model } from 'mongoose';

export interface UserDocument {
  email: string;
  password: string;
  expoToken: string;
}

export interface UserModel extends Model<UserDocument> {}
