import { prop, getModelForClass } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";

class User {
  @prop()
  name!: string;

  @prop()
  phoneNumber!: string;

  @prop()
  photo!: string;

  @prop()
  email!: string;

  @prop({ required: true, default: uuidv4, unique: true })
  uuid!: string;

  @prop()
  isEmailVerified?: boolean; // E-posta doğrulama durumu

  @prop()
  phoneVerificationCode?: string; //  Telefon doğrulama kodu

  @prop()
  verificationCode?: string; // E-posta doğrulama kodu

  @prop()
  resetCode?: string; // Şifre sıfırlama kodu

  @prop()
  password!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
