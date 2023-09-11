import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import {
  generateResetCode,
  generateVerificationCode,
  sendActivationCodeByEmail,
  sendResetCodeByEmail,
} from "../utils/email/mailService";
import config from "../../config";

const JWT_SECRET = config.secretKey; // JWT gizli anahtarınız

export async function signUp(req: Request, res: Response) {
  try {
    const { name, phoneNumber, photo, email, password } = req.body;
    // Şifreyi şifreleyin
    const hashedPassword = await bcrypt.hash(password, 6);
    const existingUser: any = await UserModel.findOne({ email });
    if (existingUser.name) {
      return res
        .status(400)
        .json({ message: "Bu e-posta zaten kullanılıyor." });
    }
    await UserModel.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          name: name,
          phoneNumber: phoneNumber,
          photo: photo,
          password: hashedPassword,
          createDate: new Date(),
        },
      }
    );

    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ existingUser, token });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Bir hata oluştu. Lütfen tekrar deneyin." });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user: any = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    if (!user.isEmailVerified) {
      return res.status(401).json({ message: "E-posta doğrulanmamış." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Geçersiz parola." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Bir hata oluştu. Lütfen tekrar deneyin." });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const resetCode = generateResetCode();

    //await sendResetCodeByEmail(user.email, resetCode); // E-posta sunucu durumu halledilince açılacak

    user.resetCode = resetCode;
    await user.save();

    return res.status(200).json({ message: "Reset kodu gönderildi." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bir hata oluştu. Lütfen tekrar deneyin." });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, resetCode, newPassword } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (user.resetCode !== resetCode) {
      return res.status(401).json({ message: "Geçersiz reset kodu." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    await user.save();

    return res.status(200).json({ message: "Şifre sıfırlandı." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bir hata oluştu. Lütfen tekrar deneyin." });
  }
}
export async function sendVerificationCodeByEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;
    // Kullanıcıyı bulun veya oluşturun
    let user: any = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({ email });
    }

    // E-posta aktivasyon kodunu oluşturun ve kaydedin
    const verificationCode: any = generateVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();

    // E-posta aktivasyon kodunu kullanıcıya gönderin
    //  await sendActivationCodeByEmail(user.email, verificationCode);

    return res.status(200).json({ message: "Aktivasyon kodu gönderildi." });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Bir hata oluştu. Lütfen tekrar deneyin.",
      error: error.message,
    });
  }
}

export async function verifyEmailActivationCode(req: Request, res: Response) {
  try {
    const { email, verificationCode } = req.body;

    // Kullanıcıyı bulun
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    // E-posta zaten doğrulandıysa
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "E-posta zaten doğrulandı." });
    }
    // E-posta aktivasyon kodunu kontrol edin
    if (user.verificationCode !== verificationCode) {
      return res.status(401).json({ message: "Geçersiz aktivasyon kodu." });
    }
    // E-posta doğrulama başarılı, isEmailVerified'i true olarak güncelleyin
    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({ message: "E-posta doğrulandı." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bir hata oluştu. Lütfen tekrar deneyin." });
  }
}
