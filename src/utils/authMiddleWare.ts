import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const decodeUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, config.secretKey);
    (req as any).userId = decoded.userId; // req üzerinden doğrudan userId'yi ekleyelim
    next();
  } catch (error) {
    console.error("Error decoding user ID from token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
