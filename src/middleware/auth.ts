import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole, type IUser } from "../models/User.ts";

export interface AuthRequest extends Request {
  user_id: string;
  user: IUser;
}
// JWT Authentication
export const requireAuth = async (
  req: Request,
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

    (req as AuthRequest).user_id = decoded.id;
    (req as AuthRequest).user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Role-Based Access Control (RBAC) Guard
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !allowedRoles.includes(authReq.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

export enum AppAction {
  VIEW_DASHBOARD = "VIEW_DASHBOARD",
  VIEW_INSIGHT = "VIEW_INSIGHT",

  VIEW_RECORD = "VIEW_RECORD",
  CREATE_RECORD = "CREATE_RECORD",
  UPDATE_RECORD = "UPDATE_RECORD",
  DELETE_RECORD = "DELETE_RECORD",

  VIEW_USER = "VIEW_USER",
  CREATE_USER = "CREATE_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
}

export const RolePermissions: Record<UserRole, AppAction[]> = {
  [UserRole.VIEWER]: [AppAction.VIEW_DASHBOARD],
  [UserRole.ANALYST]: [AppAction.VIEW_RECORD, AppAction.VIEW_INSIGHT],
  [UserRole.ADMIN]: [
    AppAction.VIEW_DASHBOARD,
    AppAction.VIEW_INSIGHT,
    AppAction.VIEW_RECORD,
    AppAction.CREATE_RECORD,
    AppAction.UPDATE_RECORD,
    AppAction.DELETE_RECORD,

    AppAction.VIEW_USER,
    AppAction.CREATE_USER,
    AppAction.UPDATE_USER,
    AppAction.DELETE_USER,
  ],
};

export const hasPermission = (
  userRole: UserRole,
  action: AppAction,
): boolean => {
  const permissions = RolePermissions[userRole];
  return permissions ? permissions.includes(action) : false;
};

// Permission-Based Access Control (PBAC) Guard
export const requirePermission = (requiredAction: AppAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as IUser;
    if (user.isActive !== true) {
      return res.status(403).json({ error: "User account is inactive." });
    }

    const userRole = user.role as UserRole;

    if (!userRole) {
      return res.status(401).json({ error: "Unauthorized: No role found" });
    }

    if (!hasPermission(userRole, requiredAction)) {
      return res
        .status(403)
        .json({ error: `Forbidden: Requires ${requiredAction} permission` });
    }

    next();
  };
};
