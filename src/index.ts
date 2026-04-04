import express from "express";
import type { Application, Request, Response } from "express";
import authRouter from "./routes/authRouter.ts";
import connectDB from "./utils/db.ts";
import config from "./utils/config.ts";

import cors from "cors";

const app: Application = express();

connectDB();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is online");
});

app.use("/auth", authRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send("404 - Not Found");
});

app.listen(config.port, () => {
  console.log(`App is running and Listening on port ${config.port}`);
});

export default app;
