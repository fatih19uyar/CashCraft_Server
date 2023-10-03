import express from "express";
import {
  createCurrency,
  deleteCurrency,
  getAllCurrencies,
  getCurrencyById,
  updateCurrency,
} from "../controllers/currenciesController";
import { verifyToken } from "../middleware/authMiddleWare";

const currencyRouter = express.Router();

currencyRouter.post("/createCurrency", verifyToken, createCurrency);
currencyRouter.get("/getAllCurrencies", verifyToken, getAllCurrencies);
currencyRouter.get("/:id", verifyToken, getCurrencyById);
currencyRouter.put("/:id", verifyToken, updateCurrency);
currencyRouter.delete("/:id", verifyToken, deleteCurrency);

export default currencyRouter;
