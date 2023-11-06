// paymentRouter.ts
import express from "express";
import PaymentController from "../controllers/paymentController";
import { verifyToken } from "../middleware/authMiddleWare";

const paymentRouter = express.Router();

paymentRouter.post(
  "/creditCardPayment",
  verifyToken,
  PaymentController.creditCardPayment
);
paymentRouter.post(
  "/debitCardPayment",
  verifyToken,
  PaymentController.debitCardPayment
);
paymentRouter.put(
  "/deposit/:userId",
  verifyToken,
  PaymentController.depositToAccount
);
paymentRouter.get(
  "/getAccountInfo/:userId",
  verifyToken,
  PaymentController.getAccountInfo
);
paymentRouter.put(
  "/withdraw/:userId",
  verifyToken,
  PaymentController.withdrawFromAccount
);

export default paymentRouter;
