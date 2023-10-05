import { Typegoose, prop } from "@typegoose/typegoose";

class Campaign extends Typegoose {
  @prop({ required: true })
  campName!: string;

  @prop({ required: true })
  campImg!: string;

  @prop({ required: true })
  campDetails!: string;

  @prop({ required: true })
  campTitle!: string;
}

export const CampaignModel = new Campaign().getModelForClass(Campaign);
