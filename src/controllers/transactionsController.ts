import { Request, Response } from "express";
import { TransactionModel as Transaction } from "../models/Transaction";
import jwt from "jsonwebtoken";
import config from "../../config";
import { generateQRCode } from "../utils/qrCode";
import { TransactionStatus } from "../types/type";

// Transaction oluşturma
export async function createTransaction(req: Request, res: Response) {
  try {
    const qrCodeDataUrl = await generateQRCode(JSON.stringify(req.body));
    req.body.qrCode = qrCodeDataUrl;
    req.body.createDate = new Date().getTime();
    req.body.status = TransactionStatus.PENDING;
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "İşlem oluşturma hatası", error: error.message });
  }
}

// Tüm işlemleri listeleme
export async function getAllTransactions(req: Request, res: Response) {
  try {
    const authorizationHeader: any = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, config.secretKey);
    const userId = decodedToken.userId;
    const transactions = await Transaction.find({ user: userId })
      .populate("card")
      .populate("currency");
    res.status(200).json(transactions);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "İşlemleri alma hatası", error: error.message });
  }
}
// Belirli bir işlemi alma
export async function getTransactionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate("user")
      .populate("card")
      .populate("currency");
    if (!transaction) {
      res.status(404).json({ message: "İşlem bulunamadı" });
      return;
    }
    res.status(200).json(transaction);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "İşlem alma hatası", error: error.message });
  }
}

export async function getTransactionByUserId(req: Request, res: Response) {
  try {
    const { userId }: any = req.params;
    const transactions = await Transaction.find({ userId: userId })
      .populate("user")
      .populate("card")
      .populate("currency");
    if (!transactions || transactions.length === 0) {
      res.status(404).json({ message: "İşlem bulunamadı" });
      return;
    }
    res.status(200).json(transactions);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "İşlem alma hatası", error: error.message });
  }
}

// İşlem güncelleme
export async function updateTransaction(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedTransaction) {
      res.status(404).json({ message: "İşlem bulunamadı" });
      return;
    }
    res.status(200).json(updatedTransaction);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "İşlem güncelleme hatası", error: error.message });
  }
}

// İşlem silme
export async function deleteTransaction(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      res.status(404).json({ message: "İşlem bulunamadı" });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "İşlem silme hatası", error: error.message });
  }
}
