import express from "express";
import {
  listUsers,
  findUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleWare";

const userRoutes = express.Router();

userRoutes.use(verifyToken);

userRoutes.get("/listUser", listUsers);
userRoutes.get("/findUser", findUser);
userRoutes.put("/updateUser", updateUser);
userRoutes.delete("/deleteUser", deleteUser);

export default userRoutes;
