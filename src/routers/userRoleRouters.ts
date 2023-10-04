import express from "express";
import {
  updateUserRole,
  deleteUserRole,
  getUserRoleByName,
  createUserRole,
} from "../controllers/userRoleController";
import { verifyToken } from "../middleware/authMiddleWare";

const userRoleRouter = express.Router();

userRoleRouter.post("/createUserRole", verifyToken, createUserRole);
userRoleRouter.put("/:id", verifyToken, updateUserRole);
userRoleRouter.delete("/:id", verifyToken, deleteUserRole);
userRoleRouter.get("/:name", verifyToken, getUserRoleByName);

export default userRoleRouter;
