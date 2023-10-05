import { prop, Typegoose } from "@typegoose/typegoose";

export class Currency extends Typegoose {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  symbol!: string;

  @prop({ required: true, unique: true })
  code!: string;
}

export const CurrencyModel = new Currency().getModelForClass(Currency);
