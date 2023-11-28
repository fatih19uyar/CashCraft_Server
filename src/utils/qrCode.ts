import qrCode from "qrcode";

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await qrCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error("QR kodu oluşturulurken bir hata oluştu");
  }
}
