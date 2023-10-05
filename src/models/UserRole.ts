import { Typegoose, prop } from "@typegoose/typegoose";

export class UserRole extends Typegoose {
  @prop({ required: true, unique: true })
  name!: string;

  @prop({ required: true })
  description!: string;
}

export const UserRoleModel = new UserRole().getModelForClass(UserRole);
