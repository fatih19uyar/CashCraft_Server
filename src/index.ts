import mongoose from "mongoose";
import config from "../config";
import UserModel from "./models/User";
import express from "express";
import authRoutes from "./routers/authRoutes";
import { Request, Response, NextFunction } from "express";

const app = express();

// Middleware
app.use(express.json());

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.once("connected", async () => {
  console.log("Connected to MongoDB successfully.");
  const collectionsToCheck = ["users", "campaigns", "transactiondata"];
  for (const collectionName of collectionsToCheck) {
    const collInfo = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .next();
    if (!collInfo) {
      await mongoose.connection.db.createCollection(collectionName);
      console.log(`${collectionName} collection created.`);
    } else {
      console.log(`${collectionName} collection already exists.`);
    }
  }
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
//app.use("/campaing", campaingRouter);

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
