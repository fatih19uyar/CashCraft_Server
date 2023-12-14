import { pre, prop, Ref, Typegoose } from "@typegoose/typegoose";
import { User } from "./User";
import { CardStyle, CardType } from "../types/type";
import { encryptCardData } from "../utils/encryptionUtils";

@pre<Card>("save", async function (next) {
  if (this.isModified("cardNumber") || this.isModified("cardExpiration")) {
    // Kart numarası veya son kullanma tarihi değiştiyse şifrelemeyi yap
    this.cardNumber = await encryptCardData(this.cardNumber);
    this.cardExpiration = await encryptCardData(this.cardExpiration);
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

  @prop({ required: true, enum: CardStyle })
  cardStyle?: CardStyle;

  @prop({ required: true })
  cardNickName!: string;

  @prop({ required: true, ref: User })
  user?: Ref<User>;
}

export const CardModel = new Card().getModelForClass(Card);
