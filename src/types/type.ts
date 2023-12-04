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
export enum CardType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
  JCB = "JCB",
  DINERS_CLUB = "DINERS_CLUB",
}
export enum CardStyle {
  GIFT = "gift",
  STORE = "store",
  BANK = "bank",
  CREDIT = "credit",
}
export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}
export enum LoginRecordType {
  SIGNIN = "SIGNIN",
  SIGNOUT = "SIGNOUT",
}
export enum CardStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
