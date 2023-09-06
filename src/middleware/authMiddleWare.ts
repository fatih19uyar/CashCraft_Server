import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";

interface AuthRequest extends Request {
  userId?: string;
}

const JWT_SECRET = config.secretKey || "your-secret-key";

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.userId;
    next();
  });
}

export function generateToken(userId: string): string {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "5m" });
  return token;
}
