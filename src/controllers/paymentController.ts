import { Request, Response } from "express";
import PaymentService from "../services/paymentServices";

const PaymentController = {
  async makePayment(req: Request, res: Response): Promise<void> {
    try {
      // Burada isteği al ve Payment Service'e yönlendir.
      const paymentResult = await PaymentService.processPayment(req.body);
      res.status(200).json({ success: true, paymentResult });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

export default PaymentController;
