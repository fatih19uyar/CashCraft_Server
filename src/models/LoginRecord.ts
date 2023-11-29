import { prop, Ref, Typegoose } from "@typegoose/typegoose";
import { User } from "./User";
import { LoginRecordType } from "../types/type";

class LoginRecord extends Typegoose {
  @prop({ required: true, ref: User })
  user?: Ref<User>;

  @prop({ required: true })
  loginTime!: Date;

  @prop({ required: true, enum: LoginRecordType })
  type!: LoginRecordType;

  @prop({ required: true })
  ipAddress!: string;

  @prop({ required: true })
  deviceInfo!: string;
}

export const LoginRecordModel = new LoginRecord().getModelForClass(LoginRecord);
