import type { Request, Response } from "express";
import FinancialRecord from "../models/Record.ts";
import type { AuthRequest } from "../middleware/auth.ts";

export const createRecord = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const record = new FinancialRecord({
    ...authReq.body,
    createdBy: authReq.user_id,
  });
  await record.save();
  res.status(201).json({ data: record });
};

export const getRecordById = async (req: Request, res: Response) => {
  const record = await FinancialRecord.findById(req.params.id);
  
  if (!record) {
    return res.status(404).json({ message: "Record not found" });
  }

  res.json({ data: record });
};

export const getRecords = async (req: Request, res: Response) => {
  const { startDate, endDate, type, category } = req.query;
  const filter: any = {};

  // Build filter object based on query params
  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }
  if (type) filter.type = type;
  if (category) filter.category = category;

  const records = await FinancialRecord.find(filter).sort({ date: -1 });
  res.json({ data: records });
};

export const updateRecord = async (req: Request, res: Response) => {
  const record = await FinancialRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!record) return res.status(404).json({ message: "Record not found" });
  res.json({ data: record });
};

export const deleteRecord = async (req: Request, res: Response) => {
  const record = await FinancialRecord.findByIdAndDelete(req.params.id);
  if (!record) return res.status(404).json({ message: "Record not found" });
  res.json({ message: "Record deleted successfully" });
};
