import express from "express";
import {
  AppAction,
  requireAuth,
  requirePermission,
} from "../middleware/auth.ts";
import {
  getAnnualSummary,
  getBiannualSummary,
  getCategoryWiseSummary,
  getFullDashboard,
  getMiniSummary,
  getMonthlySummary,
  getQuarterlySummary,
  getTypeWiseSummary,
} from "../controllers/dashboardController.ts";

const dashboardRouter = express.Router();

dashboardRouter.use(requireAuth);
dashboardRouter.use(requirePermission(AppAction.VIEW_DASHBOARD));

dashboardRouter.get("/summary", getFullDashboard);

dashboardRouter.get("/summary/mini", getMiniSummary);
dashboardRouter.get("/summary/type", getTypeWiseSummary);
dashboardRouter.get("/summary/category", getCategoryWiseSummary);
dashboardRouter.get("/summary/monthly", getMonthlySummary);
dashboardRouter.get("/summary/quarterly", getQuarterlySummary);
dashboardRouter.get("/summary/biannual", getBiannualSummary);
dashboardRouter.get("/summary/annual", getAnnualSummary);

export default dashboardRouter;
