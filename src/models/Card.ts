import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import UserModel from "./User";

export enum CardType {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
  JCB = "JCB",
  DINERS_CLUB = "DINERS_CLUB",
  // İhtiyaca göre diğer kart türlerini buraya ekleyiniz
}

class Card {
  @prop({ required: true })
  cardName!: string;

  @prop({ required: true })
  cardNumber!: string;

  @prop({ required: true })
  cardExpiration!: string;

  @prop({ required: true, enum: CardType })
  cardType!: CardType;

  @prop({ required: true })
  cardNickName!: string;

  @prop({ required: true, ref: () => UserModel })
  userId!: Ref<typeof UserModel>;

  async encryptSensitiveData() {
    // cardNumber ve cardExpiration gibi bilgileri bcrypt ile şifreleyin
    const saltRounds = 10;
    this.cardNumber = await bcrypt.hash(this.cardNumber, saltRounds);
    this.cardExpiration = await bcrypt.hash(this.cardExpiration, saltRounds);
  }
}

export const CardModel = getModelForClass(Card);
