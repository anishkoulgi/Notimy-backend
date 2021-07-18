import Message from '../model/Message';
import User from '../model/User';
import { MessageDocument } from '../types/messageTypes';

export const createMessage = async (attrs: MessageDocument, userId) => {
  try {
    const res = await Message.create(attrs);
    const message = (res as any)._doc;
    const resp = await User.findByIdAndUpdate(userId, {
      $push: { messages: message._id },
    });
    return res;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getMessages = async () => {
  try {
    const messages = await Message.find();
    return messages;
  } catch (error) {
    console.log('Error in getting messages');
    throw new Error(error);
  }
};
