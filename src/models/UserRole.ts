import { prop, getModelForClass } from "@typegoose/typegoose";

class UserRole {
  @prop({ required: true, unique: true })
  name!: string;

  @prop({ required: true })
  description!: string;
}

export const UserRoleModel = getModelForClass(UserRole);
