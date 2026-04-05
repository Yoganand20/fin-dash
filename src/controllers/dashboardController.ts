import type { Request, Response } from "express";
import FinancialRecord, { RecordType } from "../models/Record.ts";
import DashboardService from "../service/dashboardService.ts";
import { AuthRequest } from "../middleware/auth.ts";

// Recent Activity (Last 5 transactions)
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;

    const recentActivity = await FinancialRecord.find({ createdBy: userId })
      .sort({ date: -1 })
      .limit(5);

    res.status(200).json({ success: true, data: { recentActivity } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to handle standard responses
const handleRequest = async (
  req: AuthRequest,
  res: Response,
  serviceCall: Promise<any>,
) => {
  try {
    const data = await serviceCall;
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMiniSummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getMiniSummary(userId));
};

export const getTypeWiseSummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getTypeWiseSummary(userId));
};

export const getCategoryWiseSummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getCategoryWiseSummary(userId));
};

export const getMonthlySummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getMonthlySummary(userId));
};

export const getQuarterlySummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getQuarterlySummary(userId));
};

export const getBiannuallySummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getBiannuallySummary(userId));
};

export const getAnnualSummary = (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user_id;
  handleRequest(authReq, res, DashboardService.getAnnualSummary(userId));
};

export const getFullDashboard = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user_id;
    const [mini, typeWise, categoryWise, monthly, quarterly, biannual, annual] =
      await Promise.all([
        DashboardService.getMiniSummary(userId),
        DashboardService.getTypeWiseSummary(userId),
        DashboardService.getCategoryWiseSummary(userId),
        DashboardService.getMonthlySummary(userId),
        DashboardService.getQuarterlySummary(userId),
        DashboardService.getBiannuallySummary(userId),
        DashboardService.getAnnualSummary(userId),
      ]);

    res
      .status(200)
      .json({ success: true, data: { mini, typeWise, categoryWise, monthly } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
