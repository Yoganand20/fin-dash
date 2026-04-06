import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";

import connectDB from "./utils/db.ts";
import config from "./utils/config.ts";

import authRouter from "./routes/authRouter.ts";
import recordRouter from "./routes/recordRoutes.ts";
import dashboardRouter from "./routes/dashboardRouter.ts";
import userRouter from "./routes/userRouter.ts";

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
  res.set("Content-Type", "text/html");

  const htmlContent = `
  <html>
    <head>
      <style>
        body { font-family: sans-serif; line-height: 1.6; padding: 20px; color: #333; }

        table { border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f4f4f9; font-weight: bold; }
        tr:nth-child(even) { background-color: #fafafa; }

        .repo-link { color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>Finance Data Processing & Access Control Backend</h1>
      <p><strong>Github Repo:</strong> 
        <a class="repo-link" href="https://github.com/Yoganand20/fin-dash" target="_blank">
          https://github.com/Yoganand20/fin-dash
        </a>
      </p>

      <h3>Demo Credentials for Testing</h3>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Viewer</strong></td>
            <td>viewer@findash.com</td>
            <td><code>12345678</code></td>
          </tr>
          <tr>
            <td><strong>Analyst</strong></td>
            <td>analyst@findash.com</td>
            <td><code>12345678</code></td>
          </tr>
          <tr>
            <td><strong>Admin</strong></td>
            <td>admin@findash.com</td>
            <td><code>12345678</code></td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
`;

  res.send(Buffer.from(htmlContent));
});

app.use("/auth", authRouter);
app.use("/record", recordRouter);
app.use("/dashboard", dashboardRouter);
app.use("/user", userRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send("404 - Not Found");
});

app.listen(config.port, () => {
  console.log(`App is running and Listening on port ${config.port}`);
});

export default app;
