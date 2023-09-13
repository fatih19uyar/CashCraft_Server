import { Request, Response } from "express";
import UserModel from "../models/User";
import config from "../../config";
import jwt from "jsonwebtoken";

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcılar listelenirken bir hata oluştu" });
  }
}
export async function findUser(req: Request, res: Response) {
  try {
    const authorizationHeader: any = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, config.secretKey);
    const userId = decodedToken.userId;
    const user = await UserModel.findById(userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı aranırken bir hata oluştu" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const authorizationHeader: any = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, config.secretKey);
    const userId = decodedToken.userId;
    const updateData = req.body;
    const user = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı güncellenirken bir hata oluştu" });
  }
}

// Belirli bir kullanıcıyı silme işlemi
export async function deleteUser(req: Request, res: Response) {
  try {
    const authorizationHeader: any = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(token, config.secretKey);
    const userId = decodedToken.userId;
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu" });
  }
}
