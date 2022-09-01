import { db } from '../utils/connectDB.ts';
import { ObjectId } from '../deps.ts';

interface UserSchema {
  _id?: ObjectId;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const User = db.collection<UserSchema>('users');
