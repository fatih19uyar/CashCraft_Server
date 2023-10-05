import { prop, Ref, Typegoose } from "@typegoose/typegoose";
import { Currency } from "./Currency";
import { Card } from "./Card";
import { User } from "./User";

class Transaction extends Typegoose {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  subtitle!: string;

  @prop({ required: true })
  createDate!: string;

  @prop({ required: true }) // Burada type özelliği ile Number (float) olarak tanımlıyoruz
  price!: number;

  @prop({ required: true, ref: User })
  user?: Ref<User>;

  @prop({ required: true, ref: Currency })
  currency?: Ref<Currency>;

  @prop({ required: true, ref: Card })
  card?: Ref<Card>;
}

export const TransactionModel = new Transaction().getModelForClass(Transaction);
// "KittenModel" is now a valid Typegoose model
