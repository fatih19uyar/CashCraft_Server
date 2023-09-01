import mongoose from "mongoose";
import config from "../config";
import UserModel from "./models/User";
import express from "express";
import authRoutes from "./routers/authRoutes";

const mongoURL = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`;
const app = express();

// Middleware
app.use(express.json());

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("connected", () => {
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
app.use("/auth", authRoutes);

app.listen(config.httpPort, () => {
  console.log(`Server running on ${config.httpPort} port.`);
});
