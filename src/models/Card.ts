import { pre, prop, Ref, Typegoose } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import { User } from "./User";

export enum CardType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
  JCB = "JCB",
  DINERS_CLUB = "DINERS_CLUB",
  // İhtiyaca göre diğer kart türlerini buraya ekleyiniz
}
export enum CardStyle {
  GIFT = "gift",
  STORE = "store",
  BANK = "bank",
  CREDIT = "credit",
  // İhtiyaca göre diğer kart style buraya ekleyiniz
}
@pre<Card>("save", async function (next) {
  if (this.isModified("cardNumber") || this.isModified("cardExpiration")) {
    // Kart numarası veya son kullanma tarihi değiştiyse şifrelemeyi yap
    const saltRounds = 10;
    this.cardNumber = await bcrypt.hash(this.cardNumber, saltRounds);
    this.cardExpiration = await bcrypt.hash(this.cardExpiration, saltRounds);
  }
  next();
})
export class Card extends Typegoose {
  @prop({ required: true })
  cardName!: string;

  @prop({ required: true })
  cardNumber!: string;

  @prop({ required: true })
  cardExpiration!: string;

  @prop({ required: true, enum: CardType })
  cardType?: CardType;

  @prop({ required: true, enum: CardType })
  cardStyle?: CardStyle;

  @prop({ required: true })
  cardNickName!: string;

  @prop({ required: true, ref: User })
  user?: Ref<User>;
}

export const CardModel = new Card().getModelForClass(Card);
