import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000), // Converts string to number, defaults to 3000
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error("Invalid environment variables:");
  console.error(z.treeifyError(envVars.error));
  process.exit(1); // Stop the app from starting with bad config
}

const config = {
  port: envVars.data.PORT,
  dbUri: envVars.data.MONGO_URI,
  jwtSecret: envVars.data.JWT_SECRET,
  env: envVars.data.NODE_ENV,
};

export default config;
