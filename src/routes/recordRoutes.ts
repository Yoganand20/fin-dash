import { Router } from "express";
import {
  AppAction,
  requireAuth,
  requirePermission,
} from "../middleware/auth.ts";
import {
  createRecord,
  deleteRecord,
  getRecordById,
  getRecords,
  updateRecord,
} from "../controllers/RecordController.ts";

const recordRouter = Router();

// Create
recordRouter.post(
  "/",
  requireAuth,
  requirePermission(AppAction.CREATE_RECORD),
  createRecord,
);

//View one record
recordRouter.get(
  "/:id",
  requireAuth,
  requirePermission(AppAction.VIEW_RECORD),
  getRecordById,
);

// View & Filter
recordRouter.get(
  "/",
  requireAuth,
  requirePermission(AppAction.VIEW_RECORD),
  getRecords,
);

// Update
recordRouter.patch(
  "/:id",
  requireAuth,
  requirePermission(AppAction.UPDATE_RECORD),
  updateRecord,
);

// Delete
recordRouter.delete(
  "/:id",
  requireAuth,
  requirePermission(AppAction.DELETE_RECORD),
  deleteRecord,
);

export default recordRouter;
