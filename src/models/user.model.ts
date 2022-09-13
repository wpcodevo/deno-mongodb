import { db } from "../utils/connectDB.ts";
import { ObjectId } from "../deps.ts";

interface UserSchema {
  _id?: ObjectId;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export const User = db.collection<UserSchema>("users");
User.createIndexes({indexes:[{name: "unique_email", key: {"email": 1}, unique: true}]})
