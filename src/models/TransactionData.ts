import { prop, getModelForClass } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";

class TransactionDataModel {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  subtitle!: string;

  @prop({ required: true })
  time!: string;

  @prop({ required: true })
  rightTitle!: string;

  @prop({ required: true, default: uuidv4, unique: true })
  uuid!: string;
}

export const TransactionData = getModelForClass(TransactionDataModel);
