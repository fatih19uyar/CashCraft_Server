import express from "express";
import {
  createLoginRecord,
  getLastLogin,
  updateLoginRecord,
} from "../controllers/loginRecordController";
import { verifyToken } from "../middleware/authMiddleWare";

const loginRecordRouter = express.Router();

loginRecordRouter.post("/createLoginRecord", verifyToken, createLoginRecord);
loginRecordRouter.put("/:id", verifyToken, updateLoginRecord);
loginRecordRouter.get("/lastLogin/:userId/:type", verifyToken, getLastLogin);

export default loginRecordRouter;
