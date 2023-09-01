import express from 'express';
import { signUp, signIn } from '../controllers/authController';

const authRoutes = express.Router();

// Kullanıcı kaydı rotası
authRoutes.post('/signup', signUp);

// Kullanıcı girişi rotası
authRoutes.post('/signin', signIn);

export default authRoutes;
