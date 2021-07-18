import { model, Schema } from "mongoose";
import { MessageDocument, MessageModel } from "../types/messageTypes";

const messageSchema = new Schema<MessageDocument, MessageModel>({
  text: {
    type: String,
  },
  url: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const Message = model("Message", messageSchema);

export default Message;
