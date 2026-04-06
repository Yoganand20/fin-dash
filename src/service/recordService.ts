import FinancialRecord from "../models/Record.ts";

export const createRecord = async (userId: string, data: any) => {
  const record = new FinancialRecord({
    ...data,
    createdBy: userId,
  });
  return await record.save();
};

export const getRecordById = async (userId: string, recordId: string) => {
  return await FinancialRecord.findOne({
    _id: recordId,
    createdBy: userId,
  });
};

export const getRecords = async (filters: any) => {
  const filter: any = { };

  if (filters.startDate || filters.endDate) {
    filter.date = {};
    if (filters.startDate) filter.date.$gte = filters.startDate;
    if (filters.endDate) filter.date.$lte = filters.endDate;
  }
  if (filters.type) filter.type = filters.type;
  if (filters.category) filter.category = filters.category;

  return await FinancialRecord.find(filter).sort({ date: -1 });
};

export const updateRecord = async (
  userId: string,
  recordId: string,
  data: any,
) => {
  return await FinancialRecord.findOneAndUpdate(
    { _id: recordId, createdBy: userId },
    { $set: data },
    { new: true, runValidators: true },
  );
};

export const deleteRecord = async (recordId: string) => {
  return await FinancialRecord.findOneAndDelete({
    _id: recordId,
  });
};

const RecordService = {
  createRecord,
  getRecordById,
  getRecords,
  updateRecord,
  deleteRecord,
};

export default RecordService;
