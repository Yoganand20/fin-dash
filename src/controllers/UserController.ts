import type { Request, Response } from "express";
import UserService from "../service/userService.ts";
import z from "zod";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.ts";

const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.email("Invalid email format").optional(),
});

const updateRoleSchema = z.object({
  role: z.string().min(1, "Role is required"),
});

const updateStatusSchema = z.object({
  isActive: z.boolean({
    error: "isActive is required",
  }),
});

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Get list of all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json({ data: users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const parsedBody = createUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: z.treeifyError(parsedBody.error),
      });
    }

    const usr = await UserService.createUser(parsedBody.data);
    res.status(201).json({ data: usr, message: "User created successfully" });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(400).json({ error: error.message });
  }
};

// Get user details
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    if (!isValidId(userId))
      return res.status(400).json({ message: "Invalid ID format" });

    const user = await UserService.getUserById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ data: user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Edit user details (e.g., email)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    if (!isValidId(userId))
      return res.status(400).json({ message: "Invalid ID format" });

    const parsedBody = updateUserSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsedBody.error.flatten().fieldErrors,
      });
    }

    const updatedUser = await UserService.updateUser(userId, parsedBody.data);

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res
      .status(200)
      .json({ data: updatedUser, message: "User updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSelf = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;

    const parsedBody = updateUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsedBody.error.flatten().fieldErrors,
      });
    }

    const updatedUser = await UserService.updateUser(userId, parsedBody.data);

    if (!updatedUser) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getSelf = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;

    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deactivateSelf = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;

    const deactivatedUser = await UserService.updateUserStatus(userId, false);

    if (!deactivatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully. You have been logged out.",
      data: {
        email: deactivatedUser.email,
        isActive: deactivatedUser.isActive,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    if (!isValidId(userId))
      return res.status(400).json({ message: "Invalid ID format" });

    const deletedUser = await UserService.deleteUser(userId);

    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Assign new role to user
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    if (!isValidId(userId))
      return res.status(400).json({ message: "Invalid ID format" });

    const parsedBody = updateRoleSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsedBody.error.flatten().fieldErrors,
      });
    }

    const updatedUser = await UserService.updateUserRole(
      userId,
      parsedBody.data.role,
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res
      .status(200)
      .json({ data: updatedUser, message: "User role updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Set user account active/inactive status
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    if (!isValidId(userId))
      return res.status(400).json({ message: "Invalid ID format" });

    const parsedBody = updateStatusSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: parsedBody.error.flatten().fieldErrors,
      });
    }

    const updatedUser = await UserService.updateUserStatus(
      userId,
      parsedBody.data.isActive,
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res
      .status(200)
      .json({ data: updatedUser, message: "User status updated successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
