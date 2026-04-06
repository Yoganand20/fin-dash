import express from "express";
import {
  AppAction,
  requireAuth,
  requirePermission,
} from "../middleware/auth.ts";
import {
  createUser,
  deactivateSelf,
  deleteUser,
  getSelf,
  getUserById,
  getUsers,
  updateSelf,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/UserController.ts";

const userRouter = express.Router();

userRouter.use(requireAuth);

userRouter.get("/", requirePermission(AppAction.VIEW_USER), getUsers);
userRouter.post("/", requirePermission(AppAction.CREATE_USER), createUser);

userRouter.get("/me", getSelf);
userRouter.patch("/me", updateSelf); //all users can update detail of them self
userRouter.delete("/me", deactivateSelf); //all users can deactivate their account

userRouter.get("/:id", requirePermission(AppAction.VIEW_USER), getUserById);

userRouter.patch("/:id", requirePermission(AppAction.UPDATE_USER), updateUser);
userRouter.delete("/:id", requirePermission(AppAction.DELETE_USER), deleteUser);

userRouter.patch(
  "/:id/role",
  requirePermission(AppAction.UPDATE_USER),
  updateUserRole,
);

userRouter.patch(
  "/:id/status",
  requireAuth,
  requirePermission(AppAction.UPDATE_USER),
  updateUserStatus,
);

export default userRouter;
