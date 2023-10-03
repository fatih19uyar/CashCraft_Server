import express from "express";

import { verifyToken } from "../middleware/authMiddleWare";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionByUserId,
  updateTransaction,
} from "../controllers/transactionsController";

const transactionRouter = express.Router();

transactionRouter.post("/createTransaction", verifyToken, createTransaction);
transactionRouter.get("/getAllTransactions", verifyToken, getAllTransactions);
transactionRouter.get("/:id", verifyToken, getTransactionById);
transactionRouter.get(
  "/getTransactionByUserId/:userId",
  verifyToken,
  getTransactionByUserId
);
transactionRouter.put("/:id", verifyToken, updateTransaction);
transactionRouter.delete("/:id", verifyToken, deleteTransaction);

export default transactionRouter;
