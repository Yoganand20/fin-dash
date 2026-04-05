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
  netbal: { $subtract: ["$income", "$expense"] },
};

export const getMiniSummary = async (userId: string) => {
  const result = await FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, ...calculateTotals } },
    { $project: { _id: 0, ...projectNetBal } },
  ]);
  return result[0] || { income: 0, expense: 0, netbal: 0 };
};

export const getTypeWiseSummary = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$type", ...calculateTotals } },
    { $project: { type: "$_id", _id: 0, ...projectNetBal } },
  ]);
};

export const getCategoryWiseSummary = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$category", ...calculateTotals } },
    { $project: { category: "$_id", _id: 0, ...projectNetBal } },
    { $sort: { netbal: -1 } },
  ]);
};

export const getMonthlySummary = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        ...calculateTotals,
      },
    },
    { $project: { period: "$_id", _id: 0, ...projectNetBal } },
    { $sort: { "period.year": -1, "period.month": -1 } },
  ]);
};

export const getQuarterlySummary = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } },
        },
        ...calculateTotals,
      },
    },
    { $project: { period: "$_id", _id: 0, ...projectNetBal } },
    { $sort: { "period.year": -1, "period.quarter": -1 } },
  ]);
};

export const getBiannuallySummary = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          half: { $ceil: { $divide: [{ $month: "$date" }, 6] } },
        },
        ...calculateTotals,
      },
    },
    { $project: { period: "$_id", _id: 0, ...projectNetBal } },
    { $sort: { "period.year": -1, "period.half": -1 } },
  ]);
};

export const getAnnualSummary = async (userId: string) => {
  return FinancialRecord.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { year: { $year: "$date" } },
        ...calculateTotals,
      },
    },
    { $project: { period: "$_id", _id: 0, ...projectNetBal } },
    { $sort: { "period.year": -1 } },
  ]);
};
// Export all functions as a single object
const DashboardService = {
  getMiniSummary,
  getTypeWiseSummary,
  getCategoryWiseSummary,
  getMonthlySummary,
  getQuarterlySummary,
  getBiannuallySummary,
  getAnnualSummary,
};

export default DashboardService;