import express from "express";
import {
  deleteWalletCard,
  getBalance,
  getWalletCardByUserId,
  updateWalletCardBalance,
} from "../controllers/walletCardController";
import { decodeUserId } from "../utils/authMiddleWare";
import { verifyToken } from "../middleware/authMiddleWare";

const walletCardRouter = express.Router();

walletCardRouter.use(decodeUserId); // decodeUserId middleware'i her endpoint öncesi kullanılacak
walletCardRouter.get(
  "/getWalletCardByUserId",
  verifyToken,
  getWalletCardByUserId
);
walletCardRouter.get("/getBalance", verifyToken, getBalance);
walletCardRouter.post(
  "/updateWalletCardBalance",
  verifyToken,
  updateWalletCardBalance
);
walletCardRouter.delete("/deleteWalletCard", verifyToken, deleteWalletCard);

export default walletCardRouter;
