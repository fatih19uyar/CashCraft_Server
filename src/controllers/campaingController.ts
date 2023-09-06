import { Request, Response } from "express";
import { Campaign } from "../models/Campaign";

export async function createCampaign(req: Request, res: Response) {
  try {
    const newCampaign = await Campaign.create(req.body);
    res.status(201).json(newCampaign);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating campaign", error: error.message });
  }
}

export async function getAllCampaigns(req: Request, res: Response) {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching campaigns", error: error.message });
  }
}

export async function getCampaignById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching campaign", error: error.message });
  }
}

export async function updateCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedCampaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(updatedCampaign);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating campaign", error: error.message });
  }
}

export async function deleteCampaign(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedCampaign = await Campaign.findByIdAndDelete(id);
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting campaign", error: error.message });
  }
}
