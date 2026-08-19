import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  phoneNumber: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'servisin_super_secret_jwt_key_2026';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan login atau gunakan email lain.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email.toLowerCase(),
        passwordHash,
        phoneNumber: validatedData.phoneNumber,
        tier: 'FREE',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        tier: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registrasi akun Servisin berhasil!',
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: error.errors[0].message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Gagal melakukan registrasi: ' + error.message,
    });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak cocok.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak cocok.',
      });
      return;
    }

    const token = generateToken(user.id);

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      tier: user.tier,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Login berhasil! Selamat datang kembali.',
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: error.errors[0].message,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Gagal login: ' + error.message,
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        tier: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            vehicles: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data profil: ' + error.message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { fullName, phoneNumber, password } = req.body;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updateData.avatarUrl = `/uploads/vehicles/${req.file.filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        tier: true,
        avatarUrl: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui profil: ' + error.message,
    });
  }
};

export const toggleTier = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'production') {
      res.status(403).json({
        success: false,
        message: 'Pengubahan paket langsung tidak diizinkan pada lingkungan produksi. Harap selesaikan pembayaran.',
      });
      return;
    }

    const userId = req.user!.id;
    const { tier } = req.body; // 'FREE' or 'PRO'

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { tier: tier === 'PRO' ? 'PRO' : 'FREE' },
      select: {
        id: true,
        email: true,
        fullName: true,
        tier: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Paket berhasil diubah menjadi ${updatedUser.tier}.`,
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah paket: ' + error.message,
    });
  }
};
