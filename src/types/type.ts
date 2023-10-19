export type ErrorType = {
  message: string;
  code: number | null;
};
export interface CardState {
  bankCards: CardData[] | null;
  creditCards: CardData[] | null;
  storeCards: CardData[] | null;
  giftCard: CardData[] | null;
}
export interface CardData {
  cardName: string;
  cardNumber: string;
  cardExpiration: string;
  cardType: "master" | "visa";
  cardNickName: string;
  cardStyle: "gift" | "store" | "bank" | "credit";
}
