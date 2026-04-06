import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
import config from "../utils/config.ts";
import z from "zod";
import UserService from "../service/userService.ts";

const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});


const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: z.treeifyError(parsedData.error),
      });
    }

    const usr = await UserService.createUser(parsedData.data);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: usr,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ success: false, message: "Email already in use", error });
    }
    res.status(400).json({ success: false, error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: z.treeifyError(parsedData.error),
      });
    }
    const { email, password } = parsedData.data;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      {
        expiresIn: "6h",
      },
    );

    res.json({ success: true, message: "Login successful", data: { token } });
  } catch (error: any) {
    res.status(400).json({ success: false, error });
  }
};
