import { db } from '../utils/connectDB.ts';
import { ObjectId } from '../deps.ts';

export interface TodoSchema {
  _id?: ObjectId;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Todo = db.collection<TodoSchema>('todos');
