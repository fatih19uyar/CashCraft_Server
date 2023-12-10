import express from "express";
import {
  listUsers,
  findUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleWare";

const userRoutes = express.Router();

userRoutes.get("/listUser", verifyToken, listUsers);
userRoutes.get("/findUser", verifyToken, findUser);
userRoutes.put("/updateUser", verifyToken, updateUser);
userRoutes.delete("/deleteUser", verifyToken, deleteUser);

export default userRoutes;
