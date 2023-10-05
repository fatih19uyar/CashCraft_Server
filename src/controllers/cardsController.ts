import { Request, Response } from "express";
import { CardModel, CardType } from "../models/Card";

// Yeni bir kart oluşturma
export async function createCard(req: Request, res: Response) {
  try {
    const {
      cardName,
      cardNumber,
      cardExpiration,
      cardType,
      cardNickName,
      user,
    } = req.body;

    const card = new CardModel({
      cardName,
      cardNumber,
      cardExpiration,
      cardType,
      cardNickName,
      user,
    });

    await card.save();

    res.status(201).json(card);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Kart oluşturma hatası", error: error.message });
  }
}

// Kart güncelleme
export async function updateCard(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedCard = await CardModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCard) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    res.status(200).json(updatedCard);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Kart güncelleme hatası", error: error.message });
  }
}

// Kart silme
export async function deleteCard(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedCard = await CardModel.findByIdAndRemove(id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Kart silme hatası", error: error.message });
  }
}

// Tüm kartları getirme
export async function getAllCards(req: Request, res: Response) {
  try {
    const { idvl } = req.body;
    if (idvl == "test") {
      const cards = await CardModel.find().populate("user");
      res.status(200).json(cards);
    } else {
      res.status(500).json({ message: "Kartları alma hatası" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Kartları alma hatası", error: error.message });
  }
}

// Belirli bir kullanıcının tüm kartlarını getirme
export async function getCardsByUserId(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const cards = await CardModel.find({ userId }).populate("user");

    if (!cards) {
      return res.status(404).json({ message: "Kullanıcının kartı bulunamadı" });
    }

    res.status(200).json(cards);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Kartları alma hatası", error: error.message });
  }
}

// Belirli bir kullanıcının belirli bir kart türündeki kartlarını getirme
export async function getCardsByUserIdAndCardType(req: Request, res: Response) {
  try {
    const { userId, cardType } = req.params;
    const cardTypeEnum: CardType = cardType as CardType;
    const cards = await CardModel.find({
      userId,
      cardType: cardTypeEnum,
    }).populate("user");

    if (!cards) {
      return res.status(404).json({
        message: "Kullanıcının belirli kart türündeki kartı bulunamadı",
      });
    }

    res.status(200).json(cards);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Kartları alma hatası", error: error.message });
  }
}
