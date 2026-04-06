import type { Request, Response } from "express";
import FinancialRecord, { RecordType } from "../models/Record.ts";
import type { AuthRequest } from "../middleware/auth.ts";
import z from "zod";
import mongoose from "mongoose";
import RecordService from "../service/recordService.ts";

const createRecordSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(RecordType, {
    error: "Type must be either 'income' or 'expense'",
  }),
  category: z.string().min(1, "Category is required"),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});

const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z
    .enum(RecordType, {
      error: "Type must be either 'income' or 'expense'",
    })
    .optional(),
  category: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  description: z.string().optional(),
});

const querySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  type: z.enum(RecordType).optional(),
  category: z.string().optional(),
});

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const createRecord = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;

    const parsedData = createRecordSchema.safeParse(authReq.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: z.treeifyError(parsedData.error),
      });
    }

    const record = await RecordService.createRecord(
      authReq.user_id,
      parsedData.data,
    );
    res.status(201).json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const recordId = req.params.id as string;

    if (!isValidId(recordId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });

    const record = await RecordService.getRecordById(userId, recordId);

    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const parsedQuery = querySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: z.treeifyError(parsedQuery.error),
      });
    }

    const records = await RecordService.getRecords(parsedQuery.data);
    res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user_id;
    const recordId = req.params.id as string;

    if (!isValidId(recordId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });

    const parsedData = updateRecordSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: z.treeifyError(parsedData.error),
      });
    }

    const record = await RecordService.updateRecord(
      userId,
      recordId,
      parsedData.data,
    );

    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found or unauthorized" });

    res.status(200).json({ success: true, data: record });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id as string;

    if (!isValidId(recordId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });

    const record = await RecordService.deleteRecord(recordId);

    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Record not found or unauthorized" });

    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error });
  }
};
