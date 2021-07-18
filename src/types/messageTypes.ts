import { Model } from "mongoose";

export interface MessageDocument {
  text: string;
  url?: string; // to remove ? later
  createdAt: Date;
}

export interface MessageModel extends Model<MessageDocument> {}
