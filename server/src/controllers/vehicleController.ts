import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { updateRemindersStatusForVehicle } from '../services/reminderService';

const vehicleSchema = z.object({
  type: z.enum(['CAR', 'MOTORCYCLE']).default('CAR'),
  brand: z.string().min(1, 'Merk kendaraan wajib diisi (misal: Honda, Toyota)'),
  model: z.string().min(1, 'Model kendaraan wajib diisi (misal: Brio, Vario 160)'),
  licensePlate: z.string().min(3, 'Nomor plat kendaraan wajib diisi'),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  currentOdometer: z.coerce.number().int().nonnegative().default(0),
  notes: z.string().optional(),
});

export const getVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const vehicles = await prisma.vehicle.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            serviceLogs: true,
            reminders: true,
          },
        },
        serviceLogs: {
          orderBy: { serviceDate: 'desc' },
          take: 1,
          select: {
            id: true,
            serviceDate: true,
            odometer: true,
            totalCost: true,
            workshopName: true,
          },
        },
        reminders: {
          where: {
            status: { in: ['DUE_SOON', 'OVERDUE'] },
          },
          select: {
            id: true,
            title: true,
            status: true,
            nextDueOdometer: true,
            nextDueDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: vehicles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat data kendaraan: ' + error.message,
    });
  }
};

export const getVehicleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id, userId },
      include: {
        serviceLogs: {
          orderBy: { serviceDate: 'desc' },
          include: {
            items: true,
          },
        },
        reminders: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat detail kendaraan: ' + error.message,
    });
  }
};

export const createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userTier = req.user!.tier;

    if (userTier === 'FREE') {
      const vehicleCount = await prisma.vehicle.count({
        where: { userId },
      });

      if (vehicleCount >= 2) {
        res.status(403).json({
          success: false,
          code: 'TIER_LIMIT_REACHED',
          message: 'Batas kuota kendaraan akun Gratis telah tercapai (maksimal 2 kendaraan). Upgrade ke FixGarasi Pro untuk menambah kendaraan tanpa batas!',
        });
        return;
      }
    }

    const validatedData = vehicleSchema.parse(req.body);

    let photoUrl: string | undefined = req.body.photoUrl;
    if (req.file) {
      photoUrl = `/uploads/vehicles/${req.file.filename}`;
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        type: validatedData.type,
        brand: validatedData.brand,
        model: validatedData.model,
        licensePlate: validatedData.licensePlate.toUpperCase().trim(),
        year: validatedData.year,
        currentOdometer: validatedData.currentOdometer,
        notes: validatedData.notes,
        photoUrl,
      },
    });

    try {
      await prisma.serviceReminder.create({
        data: {
          vehicleId: vehicle.id,
          title: 'Ganti Oli Mesin Berkala',
          category: 'ENGINE_OIL',
          intervalKm: vehicle.type === 'MOTORCYCLE' ? 3000 : 5000,
          intervalMonths: 6,
          lastServiceOdometer: vehicle.currentOdometer,
          lastServiceDate: new Date(),
          nextDueOdometer: vehicle.currentOdometer + (vehicle.type === 'MOTORCYCLE' ? 3000 : 5000),
          nextDueDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
        },
      });
    } catch (e) {
      console.warn('Failed to seed default reminder:', e);
    }

    res.status(201).json({
      success: true,
      message: 'Kendaraan berhasil ditambahkan ke garasi!',
      data: vehicle,
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
      message: 'Gagal menambahkan kendaraan: ' + error.message,
    });
  }
};

export const updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existing = await prisma.vehicle.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan.',
      });
      return;
    }

    const validatedData = vehicleSchema.partial().parse(req.body);

    const updatePayload: any = { ...validatedData };
    if (validatedData.licensePlate) {
      updatePayload.licensePlate = validatedData.licensePlate.toUpperCase().trim();
    }
    if (req.file) {
      updatePayload.photoUrl = `/uploads/vehicles/${req.file.filename}`;
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: updatePayload,
    });

    if (validatedData.currentOdometer !== undefined) {
      await updateRemindersStatusForVehicle(id, updated.currentOdometer);
    }

    res.status(200).json({
      success: true,
      message: 'Informasi kendaraan berhasil diperbarui.',
      data: updated,
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
      message: 'Gagal memperbarui kendaraan: ' + error.message,
    });
  }
};

export const updateOdometer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const rawOdometer = req.body.odometer !== undefined ? req.body.odometer : req.body.currentOdometer;

    const parsedOdometer = Number(rawOdometer);
    if (rawOdometer === undefined || isNaN(parsedOdometer) || parsedOdometer < 0) {
      res.status(400).json({
        success: false,
        message: 'Nilai odometer harus berupa angka positif.',
      });
      return;
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: { id, userId },
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan.',
      });
      return;
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: { currentOdometer: parsedOdometer },
    });

    const reminders = await updateRemindersStatusForVehicle(id, parsedOdometer);

    res.status(200).json({
      success: true,
      message: 'Odometer berhasil diperbarui.',
      data: {
        vehicle: updated,
        reminders,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui odometer: ' + error.message,
    });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existing = await prisma.vehicle.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan.',
      });
      return;
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Kendaraan berhasil dihapus dari garasi.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus kendaraan: ' + error.message,
    });
  }
};
