// models/Comment.ts (Jika menggunakan Mongoose)
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  _id: string;
  name: string;
  text: string;
  time: Date;
  likes: number;
  articleId: string;
  userId: string;
  replies: IReply[];
}

export interface IReply extends Document {
  _id: string;
  name: string;
  text: string;
  time: Date;
  likes: number;
  parentId: string;
  userId: string;
}

const ReplySchema = new Schema<IReply>({
  name: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  parentId: { type: String, required: true },
  userId: { type: String, required: true },
});

const CommentSchema = new Schema<IComment>({
  name: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  articleId: { type: String, required: true },
  userId: { type: String, required: true },
  replies: [ReplySchema],
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);