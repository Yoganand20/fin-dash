import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export enum UserRole {
  VIEWER = "viewer",
  ANALYST = "analyst",
  ADMIN = "admin",
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.VIEWER,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model<IUser>("User", userSchema);
