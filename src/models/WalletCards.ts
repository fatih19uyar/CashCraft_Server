import { pre, prop, Ref, Typegoose } from "@typegoose/typegoose";
import { User } from "./User";
import { Currency } from "./Currency";
import { generateOneYearExpirationDate } from "../utils/randomGenerate";
import { CardStatus } from "../types/type";
import bcrypt from "bcrypt";

@pre<WalletCard>("save", async function (next) {
  if (this.isModified("cardNumber") || this.isModified("cardExpiration")) {
    // Kart numarası şifrelemeyi yap
    const saltRounds = 10;
    this.cardNumber = await bcrypt.hash(this.cardNumber, saltRounds);
  }
  next();
})
class WalletCard extends Typegoose {
  @prop({ required: true, unique: true })
  cardNumber!: string;

  @prop({ default: "idvlabs" })
  cardName?: string;

  @prop({ ref: User, required: true })
  user!: Ref<User>;

  @prop({ ref: Currency, required: true })
  currency!: Ref<Currency>;

  @prop({ default: 0 })
  balance!: number;

  @prop({ default: generateOneYearExpirationDate })
  expirationDate?: Date;

  @prop({ enum: CardStatus, default: CardStatus.ACTIVE })
  cardStatus?: CardStatus;
}

export const WalletCardModel = new WalletCard().getModelForClass(WalletCard);
