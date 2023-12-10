export const generateOneYearExpirationDate = (): Date => {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate);
  expirationDate.setFullYear(currentDate.getFullYear() + 1);

  return expirationDate;
};
export function generateRandomNumericCardNumber(length: number): string {
  const result = [];
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result.push(characters.charAt(randomIndex));
  }

  return result.join("");
}
export function generateVerificationCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}
export function generateResetCode(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}
