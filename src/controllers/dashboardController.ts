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
    const data = await DashboardService.getMiniSummary();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getTypeWiseSummary = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getTypeWiseSummary();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getCategoryWiseSummary = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getCategoryWiseSummary();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getMonthlySummary = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getMonthlySummary();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getQuarterlySummary = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getQuarterlySummary();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getBiannualSummary = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getBiannualSummary();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getAnnualSummary = async (req: Request, res: Response) => {
  try {
    const data = await DashboardService.getAnnualSummary();
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
        DashboardService.getMiniSummary(),
        DashboardService.getTypeWiseSummary(),
        DashboardService.getCategoryWiseSummary(),
        DashboardService.getMonthlySummary(),
        DashboardService.getQuarterlySummary(),
        DashboardService.getBiannualSummary(),
        DashboardService.getAnnualSummary(),
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
