import { Request, Response } from "express";
import axios from "axios";

const BASE_URL = "https://wallet-bank-server.idvlabs.com/"; // API'nin taban URL'si

const PaymentController = {
  async creditCardPayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentResult = await axios.post(
        `${BASE_URL}/payments/creditCardPayment`,
        req.body
      );
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async debitCardPayment(req: Request, res: Response): Promise<void> {
    try {
      const paymentResult = await axios.post(
        `${BASE_URL}/payments/debitCardPayment`,
        req.body
      );
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async depositToAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const depositAmount = req.body.amount; // Örnek olarak isteği gönderen yerden amount alındı varsayalım.
      const depositResult = await axios.put(
        `${BASE_URL}/payments/deposit/${userId}`,
        { amount: depositAmount }
      );
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getAccountInfo(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const accountInfo = await axios.get(
        `${BASE_URL}/payments/getAccountInfo/${userId}`
      );
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async withdrawFromAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const withdrawAmount = req.body.amount; // Örnek olarak isteği gönderen yerden amount alındı varsayalım.
      const withdrawResult = await axios.put(
        `${BASE_URL}/payments/withdraw/${userId}`,
        { amount: withdrawAmount }
      );
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

export default PaymentController;
