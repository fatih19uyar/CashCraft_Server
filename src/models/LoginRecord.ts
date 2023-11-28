import { Typegoose, prop, Ref } from "@typegoose/typegoose";
import { User } from "./User";

class LoginRecord extends Typegoose {
  @prop({ required: true, ref: User })
  user?: Ref<User>;

  @prop({ required: true })
  loginTime!: Date;

  @prop({ required: true })
  ipAddress!: string;

  @prop({ required: true })
  deviceInfo!: string;
}

export const LoginRecordModel = new LoginRecord().getModelForClass(LoginRecord);
