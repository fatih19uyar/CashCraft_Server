import nodemailer from "nodemailer";
import config from "../../../config";

// E-posta gönderme işlevi
export async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  console.log("to", to);
  const transporter = nodemailer.createTransport({
    host: config.email.HOST,
    port: config.email.PORT,
    secure: true,
    auth: {
      user: config.email.USERNAME,
      pass: config.email.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: config.email.USERNAME,
    to,
    subject,
    text,
  });
}

export async function sendActivationCodeByEmail(
  email: string,
  activationCode: string
): Promise<void> {
  const subject = "E-posta Aktivasyon Kodu";
  const text = `Hesabınızı etkinleştirmek için kullanabileceğiniz aktivasyon kodunuz: ${activationCode}`;

  await sendEmail(email, subject, text);
}

export async function sendResetCodeByEmail(
  email: string,
  resetCode: string
): Promise<void> {
  const subject = "Şifre Sıfırlama Kodu";
  const text = `Şifre sıfırlama kodunuz: ${resetCode}`;

  await sendEmail(email, subject, text);
}

export function generateResetCode(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}
export function generateVerificationCode(): number {
  return parseInt(
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("")
  );
}
