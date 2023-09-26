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
} from "../controllers/authController";

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

export default authRoutes;
