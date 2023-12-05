import { prop, Ref, Typegoose, post, pre } from "@typegoose/typegoose";
import { UserRole } from "./UserRole";

export class User extends Typegoose {
  @prop()
  name!: string;

  @prop()
  phoneNumber!: string;

  @prop()
  photo!: string;

  @prop()
  email!: string;

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

  @prop({ required: true, ref: UserRole })
  userRole?: Ref<UserRole>;
}

const UserModel = new User().getModelForClass(User);

export default UserModel;
