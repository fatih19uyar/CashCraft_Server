import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { UserRoleModel } from "./UserRole";

class User {
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

  @prop({ required: true, ref: () => UserRoleModel })
  roleId!: Ref<typeof UserRoleModel>;
}

const UserModel = getModelForClass(User);

export default UserModel;
