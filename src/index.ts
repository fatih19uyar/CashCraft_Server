import mongoose from "mongoose";
import config from "../config";
import express from "express";
import authRoutes from "./routers/authRoutes";
import { Request, Response, NextFunction } from "express";
import logger from "morgan";
import userRoutes from "./routers/userRoutes";
import campaingRouter from "./routers/campaingRouter";
import transactionRouter from "./routers/transactionsRouter";
import currencyRouter from "./routers/currencyRouter";
import cardRouter from "./routers/cardRouters";
import userRoleRouter from "./routers/userRoleRouters";
import paymentRouter from "./routers/paymentRouter";
import loginRecordRouter from "./routers/loginRecordRouter";

const app = express();

// Middleware
app.use(express.json());
app.use(logger("dev"));

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.once("connected", async () => {
  console.log("Connected to MongoDB successfully.");
});
db.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});
db.on("disconnected", () => {
  console.log("MongoDB connection is disconnected. Attempting to reconnect...");
});

// When the application is closed, close the MongoDB connection
process.on("SIGINT", () => {
  db.close(() => {
    console.log("Application terminated. MongoDB connection closed.");
    process.exit(0);
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaingRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/currencies", currencyRouter);
app.use("/api/cards", cardRouter);
app.use("/api/userRoles", userRoleRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/loginRecords", loginRecordRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status((error as any).status || 500).json({
    message: error.message || "Internal Server Error",
    error: {
      status: (error as any).status || 500,
    },
  });
});

app.listen(config.httpPort, () => {
  console.log(`Server running on ${config.httpPort} port.`);
});

export default app;
