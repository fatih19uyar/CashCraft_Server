// paymentRouter.ts
import express from "express";
import PaymentController from "../controllers/paymentController";
import { verifyToken } from "../middleware/authMiddleWare";

const paymentRouter = express.Router();

paymentRouter.post("/makePayment", verifyToken, PaymentController.makePayment);

export default paymentRouter;
