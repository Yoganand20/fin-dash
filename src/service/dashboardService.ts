import mongoose from "mongoose";
import FinancialRecord, { RecordType } from "../models/Record";

// Shared aggregation stages for calculating totals
const calculateTotals = {
  income: {
    $sum: { $cond: [{ $eq: ["$type", RecordType.INCOME] }, "$amount", 0] },
  },
  expense: {
    $sum: { $cond: [{ $eq: ["$type", RecordType.EXPENSE] }, "$amount", 0] },
  },
};

const projectNetBal = {
  income: 1,
  expense: 1,
  balance: { $subtract: ["$income", "$expense"] },
};

const getRecentActivity = (userId: string, count: number = 5) => {
  return FinancialRecord.find({ createdBy: userId })
    .sort({ date: -1 })
    .limit(count);
};

// Core Aggregation Builder
const generateSummary = async (
  userId: string,
  groupId: string | Record<string, any>,
  idAlias: string,
  sortStage?: Record<string, 1 | -1>,
) => {
  const pipeline: any[] = [
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: groupId, ...calculateTotals } },
    { $project: { [idAlias]: "$_id", _id: 0, ...projectNetBal } },
  ];

  if (sortStage) pipeline.push({ $sort: sortStage });

  return FinancialRecord.aggregate(pipeline);
};

const getMiniSummary = async (userId: string) => {
  const result = await FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, ...calculateTotals } },
    { $project: { _id: 0, ...projectNetBal } },
  ]);
  return result[0] || { income: 0, expense: 0, netbal: 0 };
};

const getTypeWiseSummary = (userId: string) =>
  generateSummary(userId, "$type", "type");

const getCategoryWiseSummary = (userId: string) =>
  generateSummary(userId, "$category", "category", { netbal: -1 });

const getMonthlySummary = (userId: string) =>
  generateSummary(
    userId,
    { year: { $year: "$date" }, month: { $month: "$date" } },
    "period",
    { "period.year": -1, "period.month": -1 },
  );

const getQuarterlySummary = (userId: string) =>
  generateSummary(
    userId,
    {
      year: { $year: "$date" },
      quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
    },
    "period",
    { "period.year": -1, "period.quarter": -1 },
  );

const getBiannualSummary = (userId: string) =>
  generateSummary(
    userId,
    {
      year: { $year: "$date" },
      half: { $ceil: { $divide: [{ $month: "$date" }, 6] } },
    },
    "period",
    { "period.year": -1, "period.half": -1 },
  );

const getAnnualSummary = (userId: string) =>
  generateSummary(userId, { year: { $year: "$date" } }, "period", {
    "period.year": -1,
  });

const DashboardService = {
  getRecentActivity,
  getMiniSummary,
  getTypeWiseSummary,
  getCategoryWiseSummary,
  getMonthlySummary,
  getQuarterlySummary,
  getBiannualSummary,
  getAnnualSummary,
};

export default DashboardService;
