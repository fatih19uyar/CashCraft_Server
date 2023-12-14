import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import config from "../../config";

// Kredi kartı bilgilerini şifrele
export async function encryptCardData(data: string): Promise<string> {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(config.cryptoKey, "hex"),
    iv
  );
  let encryptedText = cipher.update(data, "utf-8", "hex");
  encryptedText += cipher.final("hex");

  const hmac = crypto.createHmac(
    "sha256",
    Buffer.from(config.cryptoKey, "hex")
  );
  const hash = hmac.update(encryptedText).digest("hex");

  return `${iv.toString("hex")}:${encryptedText}:${hash}`;
}
// Kaydedilmiş şifreli kredi kartı bilgilerini çöz
export async function decryptCardData(encryptedData: string): Promise<string> {
  const [ivHex, encryptedText, hash] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(config.cryptoKey, "hex"),
    iv
  );
  let decryptedText = decipher.update(encryptedText, "hex", "utf-8");
  decryptedText += decipher.final("utf-8");

  const hmac = crypto.createHmac(
    "sha256",
    Buffer.from(config.cryptoKey, "hex")
  );
  const calculatedHash = hmac.update(encryptedText).digest("hex");

  if (hash !== calculatedHash) {
    console.error("Invalid hash");
    return "";
  }

  return decryptedText;
}
