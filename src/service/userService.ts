import User from "../models/User.ts";
import bcrypt from "bcrypt";

export const getUsers = async () => {
  return await User.find().select("-passwordHash").sort({ createdAt: -1 });
};

export const createUser = async (userData: any) => {
  const rounds = 10;
  const Hashedpassword = await bcrypt.hash(userData.password, rounds);
  const user = new User({
    firstName:userData.firstName,
    lastName:userData.lastName,
    email: userData.email,
    passwordHash: Hashedpassword,
    role: userData.role,
    isActive: userData.isActive,
  });

  await user.save();

  const userObj = user.toObject();
  const { passwordHash, ...usr } = userObj;
  return usr;
};

export const getUserById = async (id: string) => {
  return await User.findById(id).select("-passwordHash");
};

export const updateUser = async (id: string, updateData: Record<string, any>) => {
  return await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-passwordHash");
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const updateUserRole = async (id: string, role: string) => {
  return await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true },
  ).select("-passwordHash");
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  return await User.findByIdAndUpdate(
    id,
    { isActive },
    { new: true, runValidators: true },
  ).select("-passwordHash");
};

const UserService = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus,
};

export default UserService;
