import { prop, Typegoose, Ref } from "@typegoose/typegoose";
import { User } from "./User";

class TokensModel extends Typegoose {
  @prop({ required: true, ref: User })
  userId!: Ref<User>;

  @prop({ required: true })
  token!: string;

  @prop({ required: true })
  validateDate!: string;
}

export const Tokens = new TokensModel().getModelForClass(TokensModel);
