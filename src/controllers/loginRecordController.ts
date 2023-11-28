import { Request, Response } from "express";
import { LoginRecordModel } from "../models/LoginRecord";

export const createLoginRecord = async (req: Request, res: Response) => {
  try {
    const { userId, loginTime, ipAddress, deviceInfo } = req.body;

    const newLoginRecord = new LoginRecordModel({
      user: userId,
      loginTime,
      ipAddress,
      deviceInfo,
    });

    await newLoginRecord.save();

    res.status(201).json(newLoginRecord);
  } catch (error: any) {
    console.error("Login kaydı oluşturulurken bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Login kaydı oluşturma hatası", error: error.message });
  }
};

export const getAllLoginRecords = async (req: Request, res: Response) => {
  try {
    const loginRecords = await LoginRecordModel.find().populate("user");
    res.status(200).json(loginRecords);
  } catch (error: any) {
    console.error("Login kayıtları getirilirken bir hata oluştu:", error);
    res.status(500).json({
      message: "Login kayıtları getirme hatası",
      error: error.message,
    });
  }
};

export const getLoginRecordById = async (req: Request, res: Response) => {
  const loginRecordId = req.params.id;

  try {
    const loginRecord = await LoginRecordModel.findById(loginRecordId).populate(
      "user"
    );

    if (!loginRecord) {
      return res.status(404).json({ message: "Login kaydı bulunamadı" });
    }

    res.status(200).json(loginRecord);
  } catch (error: any) {
    console.error("Login kaydı getirilirken bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Login kaydı getirme hatası", error: error.message });
  }
};

export const updateLoginRecord = async (req: Request, res: Response) => {
  const loginRecordId = req.params.id;
  const { userId, loginTime, ipAddress, deviceInfo } = req.body;

  try {
    const updatedLoginRecord = await LoginRecordModel.findByIdAndUpdate(
      loginRecordId,
      {
        user: userId,
        loginTime,
        ipAddress,
        deviceInfo,
      },
      { new: true }
    );

    if (!updatedLoginRecord) {
      return res.status(404).json({ message: "Login kaydı bulunamadı" });
    }

    res.status(200).json(updatedLoginRecord);
  } catch (error: any) {
    console.error("Login kaydı güncellenirken bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Login kaydı güncelleme hatası", error: error.message });
  }
};

export const deleteLoginRecord = async (req: Request, res: Response) => {
  const loginRecordId = req.params.id;

  try {
    const deletedLoginRecord = await LoginRecordModel.findByIdAndDelete(
      loginRecordId
    );

    if (!deletedLoginRecord) {
      return res.status(404).json({ message: "Login kaydı bulunamadı" });
    }

    res.status(200).json({ message: "Login kaydı başarıyla silindi" });
  } catch (error: any) {
    console.error("Login kaydı silinirken bir hata oluştu:", error);
    res
      .status(500)
      .json({ message: "Login kaydı silme hatası", error: error.message });
  }
};
