import { prop, getModelForClass } from "@typegoose/typegoose";
import { v4 as uuidv4 } from "uuid";

class CampaignModel {
  @prop({ required: true })
  campName!: string;

  @prop({ required: true })
  campImg!: string;

  @prop({ required: true })
  campDetails!: string;

  @prop({ required: true })
  campTitle!: string;

  @prop({ required: true, default: uuidv4, unique: true })
  uuid!: string;
}

export const Campaign = getModelForClass(CampaignModel);
