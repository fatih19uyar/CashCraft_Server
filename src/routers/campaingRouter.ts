import express from "express";

import { verifyToken } from "../middleware/authMiddleWare";
import {
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
} from "../controllers/campaingController";

const campaingRouter = express.Router();

campaingRouter.post("/createCampaign", verifyToken, createCampaign);
campaingRouter.get("/getAllCampaigns", verifyToken, getAllCampaigns);
campaingRouter.get("/:id", verifyToken, getCampaignById);
campaingRouter.put("/:id", verifyToken, updateCampaign);
campaingRouter.delete("/:id", verifyToken, deleteCampaign);

export default campaingRouter;
