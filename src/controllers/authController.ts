import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
import config from "../utils/config.ts";
import z from "zod";

const authSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signup = async (req: Request, res: Response) => {
  try {
    const parsedData = authSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: z.treeifyError(parsedData.error),
      });
    }
    const { email, password } = parsedData.data;

    const rounds = 10;
    const passwordHash = await bcrypt.hash(password, rounds);

    const user = new User({ email, passwordHash: passwordHash });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = authSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: z.treeifyError(parsedData.error),
      });
    }
    const { email, password } = parsedData.data;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      {
        expiresIn: "6h",
      },
    );

    res.json({ token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
