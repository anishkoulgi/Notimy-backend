import { model, Schema } from 'mongoose';
import { UserDocument, UserModel } from '../types/userTypes';

const userSchema = new Schema<UserDocument, UserModel>({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  expoToken: {
    type: String,
  },
});

const User = model('User', userSchema);

export default User;
