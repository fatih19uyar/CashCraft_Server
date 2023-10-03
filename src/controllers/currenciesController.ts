import { Request, Response } from "express";
import { CurrencyModel as Currency } from "../models/Currency";

// Yeni bir para birimi oluşturma
export async function createCurrency(req: Request, res: Response) {
  try {
    const newCurrency = await Currency.create(req.body);
    res.status(201).json(newCurrency);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Para birimi oluşturma hatası", error: error.message });
  }
}

// Tüm para birimlerini listeleme
export async function getAllCurrencies(req: Request, res: Response) {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Para birimlerini alma hatası", error: error.message });
  }
}

// Belirli bir para birimini alma
export async function getCurrencyById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id);
    if (!currency) {
      res.status(404).json({ message: "Para birimi bulunamadı" });
      return;
    }
    res.status(200).json(currency);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Para birimi alma hatası", error: error.message });
  }
}

// Para birimini güncelleme
export async function updateCurrency(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedCurrency = await Currency.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCurrency) {
      res.status(404).json({ message: "Para birimi bulunamadı" });
      return;
    }
    res.status(200).json(updatedCurrency);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Para birimi güncelleme hatası", error: error.message });
  }
}

// Para birimini silme
export async function deleteCurrency(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedCurrency = await Currency.findByIdAndDelete(id);
    if (!deletedCurrency) {
      res.status(404).json({ message: "Para birimi bulunamadı" });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Para birimi silme hatası", error: error.message });
  }
}
