import express from "express";
import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  verifyEmailActivationCode,
  sendVerificationCodeByEmail,
  checkEmailExists,
  verifyPhoneActivationCode,
  verifyResetCode,
  checkPhoneNumberExists,
  confirmationCode,
  verifyConfirmationCode,
} from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleWare";

const authRoutes = express.Router();

// Kullanıcı kaydı
authRoutes.post("/signup", signUp);
// Kullanıcı girişi
authRoutes.post("/signin", signIn);
authRoutes.post("/forgotPassword", forgotPassword);
authRoutes.post("/resetPassword", resetPassword);
authRoutes.post("/verifyEmailActivationCode", verifyEmailActivationCode); //
authRoutes.post("/sendEmailActivationCode", sendVerificationCodeByEmail); //
authRoutes.post("/checkEmailExists", checkEmailExists);
authRoutes.post("/verifyPhoneActivationCode", verifyPhoneActivationCode);
authRoutes.post("/verifyResetCode", verifyResetCode);
authRoutes.post("/checkPhoneNumberExists", checkPhoneNumberExists);
authRoutes.post("/confirmationCode", verifyToken, confirmationCode);
authRoutes.post("/verifyConfirmationCode", verifyToken, verifyConfirmationCode);

export default authRoutes;
