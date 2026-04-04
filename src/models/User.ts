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

// Hash password before saving
userSchema.pre("save", async function () {
  // Check if passwordHash is modified, not password
  if (!this.isModified("passwordHash")) return;

  // Hash the plain text password currently stored in passwordHash
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

export default model<IUser>("User", userSchema);
