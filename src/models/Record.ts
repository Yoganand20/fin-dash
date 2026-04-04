import mongoose, { Schema, model, Document } from "mongoose";

export enum RecordType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface IFinancialRecord extends Document {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
}

const recordSchema = new Schema<IFinancialRecord>(
  {
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(RecordType), required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Index for faster filtering by date and type
recordSchema.index({ date: -1, type: 1 });

export default model<IFinancialRecord>("FinancialRecord", recordSchema);
