import { Request, Response } from "express";
import { LoginRecordModel } from "../models/LoginRecord";
import { Ref } from "@typegoose/typegoose";
import UserModel, { User } from "../models/User";
import { Types } from "mongoose";

export const createLoginRecord = async (req: Request, res: Response) => {
  try {
    const { userId, loginTime, ipAddress, deviceInfo, type } = req.body;

    const newLoginRecord = new LoginRecordModel({
      user: userId,
      loginTime,
      ipAddress,
      deviceInfo,
      type,
    });

    await newLoginRecord.save();

    res.status(201).json({ message: "Login kaydı başarıyla oluşturuldu" });
  } catch (error: any) {
    console.error("Login kaydı oluşturulurken bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Login kaydı oluşturma hatası", error: error.message });
  }
};

export const updateLoginRecord = async (req: Request, res: Response) => {
  const loginRecordId = req.params.id;
  const { userId, loginTime, ipAddress, deviceInfo, type } = req.body;

  try {
    await LoginRecordModel.findByIdAndUpdate(
      loginRecordId,
      {
        user: userId,
        loginTime,
        ipAddress,
        deviceInfo,
        type,
      },
      { new: true }
    );

    res.status(200).json({ message: "Login kaydı başarıyla güncellendi" });
  } catch (error: any) {
    console.error("Login kaydı güncellenirken bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Login kaydı güncelleme hatası", error: error.message });
  }
};
export const getLastLogin = async (req: Request, res: Response) => {
  try {
    const { userId, type } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const lastLoginRecord = await LoginRecordModel.findOne({ user: user })
      .sort({ loginTime: -1 })
      .limit(1);

    if (!lastLoginRecord) {
      return res.status(404).json({ message: "Son oturum açma bulunamadı" });
    }
    res.status(200).json(lastLoginRecord);
  } catch (error: any) {
    console.error("Son oturum açma getirilirken bir hata oluştu:", error);
    res.status(500).json({
      message: "Son oturum açma getirme hatası",
      error: error.message,
    });
  }
};
