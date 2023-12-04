import { Request, Response } from "express";
import { WalletCardModel } from "../models/WalletCards";
import { CardStatus, TransactionStatus } from "../types/type";
import UserModel from "../models/User";
import { TransactionModel } from "../models/Transaction";

export const getWalletCardByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const walletCard = await WalletCardModel.findOne({
      user: user._id,
      cardStatus: CardStatus.ACTIVE,
    });

    if (!walletCard) {
      return res.status(404).json({ message: "Wallet card not found" });
    }

    const {
      user: userField,
      _id,
      ...walletCardWithoutUser
    } = walletCard.toObject();

    res.status(200).json(walletCardWithoutUser);
  } catch (error) {
    console.error("Error while getting wallet card:", error);
    res
      .status(500)
      .json({ message: "Error while getting wallet card", error: error });
  }
};

export const updateWalletCardBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { amount, operation } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const walletCard = await WalletCardModel.findOne({
      user: user._id,
      cardStatus: CardStatus.ACTIVE,
    });

    if (!walletCard) {
      return res.status(404).json({ message: "Wallet card not found" });
    }

    if (operation === "+") {
      walletCard.balance += amount;
    } else if (operation === "-") {
      if (walletCard.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      walletCard.balance -= amount;
    } else {
      return res.status(400).json({ message: "Invalid operation" });
    }

    await walletCard.save();

    // Transaction tablosuna kayıt ekleyelim
    const transaction = new TransactionModel({
      title: "Wallet Operation",
      subtitle: operation === "+" ? "Deposit" : "Withdrawal",
      createDate: new Date().toISOString(),
      price: amount,
      user: user,
      card: walletCard,
      status: TransactionStatus.COMPLETED,
      qrCode: "walletCardProcess",
    });

    await transaction.save();

    res.status(200).json({
      message: "Wallet card balance updated successfully",
      newBalance: walletCard.balance,
    });
  } catch (error) {
    console.error("Error while updating wallet card balance:", error);
    res.status(500).json({
      message: "Error while updating wallet card balance",
      error: error,
    });
  }
};
export const getBalance = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const walletCard = await WalletCardModel.findOne({
      user: user._id,
      cardStatus: CardStatus.ACTIVE,
    });

    if (!walletCard || walletCard.cardStatus !== CardStatus.ACTIVE) {
      return res.status(400).json({ message: "Kart aktif değil" });
    }
    const balance = walletCard.balance || 0;

    res.status(200).json({ balance });
  } catch (error) {
    console.error("Bakiye getirilirken bir hata oluştu:", error);
    res.status(500).json({ message: "Bakiye getirme hatası", error: error });
  }
};
export const deleteWalletCard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const walletCard = await WalletCardModel.findOne({
      user: user._id,
      cardStatus: CardStatus.ACTIVE,
    });
    if (!walletCard) {
      return res.status(404).json({ message: "Active wallet card not found" });
    }

    walletCard.cardStatus = CardStatus.INACTIVE;
    await walletCard.save();

    res.status(200).json({ message: "Wallet card successfully deactivated" });
  } catch (error) {
    console.error("Error deactivating wallet card:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
