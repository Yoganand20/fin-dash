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
recordRouter.use(requireAuth);
// Create
recordRouter.post(
  "/",
  requirePermission(AppAction.CREATE_RECORD),
  createRecord,
);

//View one record
recordRouter.get(
  "/:id",
  requirePermission(AppAction.VIEW_RECORD),
  getRecordById,
);

// View & Filter
recordRouter.get("/", requirePermission(AppAction.VIEW_RECORD), getRecords);

// Update
recordRouter.patch(
  "/:id",
  requirePermission(AppAction.UPDATE_RECORD),
  updateRecord,
);

// Delete
recordRouter.delete(
  "/:id",
  requirePermission(AppAction.DELETE_RECORD),
  deleteRecord,
);

export default recordRouter;
