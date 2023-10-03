import express from "express";
import {
  createCard,
  deleteCard,
  getAllCards,
  getCardsByUserId,
  getCardsByUserIdAndCardType,
  updateCard,
} from "../controllers/cardsController";
import { verifyToken } from "../middleware/authMiddleWare";

const cardRouter = express.Router();

cardRouter.post("/createCard", verifyToken, createCard); // Yeni kart oluşturma
cardRouter.put("/:id", verifyToken, updateCard); // Kart güncelleme
cardRouter.delete("/:id", verifyToken, deleteCard); // Kart silme
cardRouter.get("/getAllCards", verifyToken, getAllCards); // Tüm kartları getirme
cardRouter.get("/getCardsByUserId/:userId", verifyToken, getCardsByUserId); // Belirli bir kullanıcının tüm kartlarını getirme
cardRouter.get(
  "/getCardsByUserIdAndCardType/:userId/:cardType",
  verifyToken,
  getCardsByUserIdAndCardType
); // Belirli bir kullanıcının belirli bir kart türündeki kartlarını getirme

export default cardRouter;
