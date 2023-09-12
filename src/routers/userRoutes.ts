// userRoutes.ts

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
userRoutes.get("/findUser/:id", findUser);
userRoutes.put("/updateUser/:id", updateUser);
userRoutes.delete("/deleteUser/:id", deleteUser);

export default userRoutes;
