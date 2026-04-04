import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  dbUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET||"",
  env: process.env.NODE_ENV,
};

export default config;
