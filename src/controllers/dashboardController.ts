import type { Request, Response } from "express";
import DashboardService from "../service/dashboardService.ts";
import { AuthRequest } from "../middleware/auth.ts";

// Recent Activity (Last 5 transactions)
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const recentActivity = await DashboardService.getRecentActivity(userId, 5);
    res.status(200).json({ success: true, data: { recentActivity } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMiniSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getMiniSummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getTypeWiseSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getTypeWiseSummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getCategoryWiseSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getCategoryWiseSummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getMonthlySummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getQuarterlySummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getQuarterlySummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getBiannualSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getBiannualSummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getAnnualSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const data = await DashboardService.getAnnualSummary(userId);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getFullDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const [mini, typewise, categorywise, monthly, quarterly, biannual, annual] =
      await Promise.all([
        DashboardService.getMiniSummary(userId),
        DashboardService.getTypeWiseSummary(userId),
        DashboardService.getCategoryWiseSummary(userId),
        DashboardService.getMonthlySummary(userId),
        DashboardService.getQuarterlySummary(userId),
        DashboardService.getBiannualSummary(userId),
        DashboardService.getAnnualSummary(userId),
      ]);

    res.status(200).json({
      success: true,
      data: {
        mini,
        typewise,
        categorywise,
        monthly,
        quarterly,
        biannual,
        annual,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error });
  }
};
