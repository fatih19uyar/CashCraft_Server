import { prop, getModelForClass } from "@typegoose/typegoose";

class Campaign {
  @prop({ required: true })
  campName!: string;

  @prop({ required: true })
  campImg!: string;

  @prop({ required: true })
  campDetails!: string;

  @prop({ required: true })
  campTitle!: string;
}

export const CampaignModel = getModelForClass(Campaign);
