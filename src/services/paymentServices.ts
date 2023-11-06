// paymentService.ts
interface CardData {
  cardName: string;
  cardNumber: string;
  cardExpiration: string;
  cardType: "master" | "visa";
  cardVerificationCode: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentSuccessfullTime: Date;
}

const PaymentService = {
  async processPayment(cardData: CardData): Promise<PaymentResponse> {
    // Burada ödeme simülasyonu yapıyoruz
    const paymentAmount = 100; // Ödeme tutarı
    // Ödeme yapılmış gibi davranıyoruz.
    const paymentResult: PaymentResponse = {
      success: true,
      message: `Payment of ${paymentAmount} processed successfully for card number ${cardData.cardNumber}`,
      paymentSuccessfullTime: new Date(),
    };

    return paymentResult;
  },
};

export default PaymentService;
