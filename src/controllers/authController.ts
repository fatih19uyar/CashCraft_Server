import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // JWT gizli anahtarınız

export async function signUp(req: Request, res: Response) {
    try {
        const { name, phoneNumber, photo, email, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta zaten kullanılıyor.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name,
            phoneNumber,
            photo,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
}

export async function signIn(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user:any = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz parola.' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
}
