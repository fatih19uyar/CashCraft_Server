import { Request, Response } from "express";
import { WalletCardModel } from "../models/WalletCards";
import { CardStatus, TransactionStatus } from "../types/type";
import UserModel from "../models/User";
import { TransactionModel } from "../models/Transaction";
import { generateRandomNumericCardNumber } from "../utils/randomGenerate";
import { CurrencyModel } from "../models/Currency";

export const createWalletCard = async (
  userId: string
): Promise<{
  success: boolean;
  message?: string;
  walletCard?: any;
}> => {
  try {
    const user: any = await UserModel.findById(userId);
    const existingCard = await WalletCardModel.findOne({ user: user });
    if (existingCard) {
      return {
        success: false,
        message: "Kullanıcı zaten bir cüzdan kartına sahip",
      };
    }
    const currency = await CurrencyModel.findOne({ symbol: "₺" });
    if (!currency) {
      return {
        success: false,
        message: "TL para birimi bulunamadı",
      };
    }
    const cardNumber = generateRandomNumericCardNumber(16);
    const newWalletCard = new WalletCardModel({
      cardNumber,
      user: userId,
      currency: currency._id,
    });
    await newWalletCard.save();

    return {
      success: true,
      message: "Yeni cüzdan kartı başarıyla oluşturuldu",
      walletCard: newWalletCard,
    };
  } catch (error) {
    console.error("Cüzdan kartı oluşturulurken bir hata oluştu:", error);
    return {
      success: false,
      message: "Cüzdan kartı oluşturma hatası",
    };
  }
};

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
    }).populate("currency");

    if (!walletCard) {
      return res.status(404).json({ message: "Wallet card not found" });
    }

    // currency bilgisini ayrı bir sorgu ile çek
    const currency = await CurrencyModel.findById(walletCard.currency);

    // currency bilgisini sadece code olarak al
    const {
      user: userField,
      _id,
      ...walletCardWithoutUser
    } = walletCard.toObject();

    res.status(200).json({
      ...walletCardWithoutUser,
      currency: currency?.code || "",
    });
  } catch (error) {
    console.error("Error while getting wallet card:", error);
    res.status(500).json({ message: "Error while getting wallet card", error });
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
      currency: walletCard.currency,
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
