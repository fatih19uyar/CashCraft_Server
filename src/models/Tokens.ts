import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import UserModel from "./User";

class TokensModel {
  @prop({ required: true, ref: () => UserModel })
  userId!: Ref<typeof UserModel>;

  @prop({ required: true })
  token!: string;

  @prop({ required: true })
  validateDate!: string;
}

export const Tokens = getModelForClass(TokensModel);
