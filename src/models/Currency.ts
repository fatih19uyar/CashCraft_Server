import { prop, getModelForClass } from "@typegoose/typegoose";

class Currency {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  symbol!: string;

  @prop({ required: true, unique: true })
  code!: string;
}

export const CurrencyModel = getModelForClass(Currency);
