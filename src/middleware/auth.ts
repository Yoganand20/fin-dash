import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../models/User.ts";

export interface AuthRequest extends Request {
  user_id?: string;
  user?: IUser;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
    ) as any;
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User no longer exists" });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ error: "Forbidden: Account has been deactivated" });
    }

    req.user_id = decoded.id;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
