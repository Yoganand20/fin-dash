import mongoose from "mongoose";
import config from "./config";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.dbUri || "");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
