import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import UserModel from "./User";
import { CurrencyModel } from "./Currency";
import { CardModel } from "./Card";

class Transaction {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  subtitle!: string;

  @prop({ required: true })
  createDate!: string;

  @prop({ required: true, type: () => Number }) // Burada type özelliği ile Number (float) olarak tanımlıyoruz
  price!: number;

  @prop({ required: true, ref: () => UserModel })
  userId!: Ref<typeof UserModel>;

  @prop({ required: true, ref: () => CurrencyModel })
  currencyId!: Ref<typeof CurrencyModel>;

  @prop({ required: true, ref: () => CardModel })
  cardId!: Ref<typeof CardModel>;
}

export const TransactionModel = getModelForClass(Transaction);
