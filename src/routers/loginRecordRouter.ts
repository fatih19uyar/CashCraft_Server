import express from "express";
import {
  createLoginRecord,
  deleteLoginRecord,
  getAllLoginRecords,
  getLoginRecordById,
  updateLoginRecord,
} from "../controllers/loginRecordController";
import { verifyToken } from "../middleware/authMiddleWare";

const loginRecordRouter = express.Router();

loginRecordRouter.post("/createLoginRecord", verifyToken, createLoginRecord);
loginRecordRouter.get("/getAllLoginRecords", verifyToken, getAllLoginRecords);
loginRecordRouter.get("/:id", verifyToken, getLoginRecordById);
loginRecordRouter.put("/:id", verifyToken, updateLoginRecord);
loginRecordRouter.delete("/:id", verifyToken, deleteLoginRecord);

export default loginRecordRouter;
