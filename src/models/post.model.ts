import { db } from '../utils/connectDB.ts';
import { ObjectId } from '../deps.ts';

export interface PostSchema {
  _id?: ObjectId;
  title: string;
  content: string;
  category: string;
  user: ObjectId;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Post = db.collection<PostSchema>('posts');
