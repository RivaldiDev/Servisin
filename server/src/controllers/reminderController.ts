import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { updateRemindersStatusForVehicle } from '../services/reminderService';

const reminderSchema = z.object({
  vehicleId: z.string().uuid('ID Kendaraan tidak valid'),
  title: z.string().min(2, 'Judul pengingat wajib diisi (misal: Ganti Oli Mesin)'),
  category: z.string().default('ENGINE_OIL'),
  intervalKm: z.coerce.number().int().positive().optional().nullable(),
  intervalMonths: z.coerce.number().int().positive().optional().nullable(),
  lastServiceOdometer: z.coerce.number().int().nonnegative().optional().nullable(),
  lastServiceDate: z.string().or(z.date()).optional().nullable(),
  notes: z.string().optional(),
});

export const getReminders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const vehicleId = req.query.vehicleId as string | undefined;
    const status = req.query.status as string | undefined;

    const vehicles = await prisma.vehicle.findMany({
      where: { userId },
      select: { id: true, currentOdometer: true },
    });

    for (const v of vehicles) {
      await updateRemindersStatusForVehicle(v.id, v.currentOdometer);
    }

    const whereClause: any = {
      vehicle: {
        userId,
      },
    };

    if (vehicleId && vehicleId !== 'all') {
      whereClause.vehicleId = vehicleId;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const reminders = await prisma.serviceReminder.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            licensePlate: true,
            currentOdometer: true,
            type: true,
          },
        },
      },
      orderBy: [
        { nextDueDate: 'asc' },
      ],
    });

    const statusPriority = {
      OVERDUE: 1,
      DUE_SOON: 2,
      ACTIVE: 3,
      COMPLETED: 4,
    } as const;

    reminders.sort((a, b) => ((statusPriority as any)[a.status] || 99) - ((statusPriority as any)[b.status] || 99));

    res.status(200).json({
      success: true,
      data: reminders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat daftar pengingat: ' + error.message,
    });
  }
};

export const createReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validatedData = reminderSchema.parse(req.body);

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: validatedData.vehicleId, userId },
    });

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan atau bukan milik Anda.',
      });
      return;
    }

    const lastOdo = validatedData.lastServiceOdometer ?? vehicle.currentOdometer;
    const lastDate = validatedData.lastServiceDate ? new Date(validatedData.lastServiceDate) : new Date();

    const nextDueOdometer = validatedData.intervalKm ? lastOdo + validatedData.intervalKm : null;
    const nextDueDate = validatedData.intervalMonths
      ? new Date(lastDate.getTime() + validatedData.intervalMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

    const reminder = await prisma.serviceReminder.create({
      data: {
        vehicleId: vehicle.id,
        title: validatedData.title,
        category: validatedData.category,
        intervalKm: validatedData.intervalKm || null,
        intervalMonths: validatedData.intervalMonths || null,
        lastServiceOdometer: lastOdo,
        lastServiceDate: lastDate,
        nextDueOdometer,
        nextDueDate,
        notes: validatedData.notes,
        status: 'ACTIVE',
      },
      include: {
        vehicle: true,
      },
    });

    await updateRemindersStatusForVehicle(vehicle.id, vehicle.currentOdometer);

    res.status(201).json({
      success: true,
      message: 'Pengingat servis berhasil dibuat!',
      data: reminder,
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
      message: 'Gagal membuat pengingat: ' + error.message,
    });
  }
};

export const completeReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const { currentOdometer } = req.body;

    const reminder = await prisma.serviceReminder.findFirst({
      where: {
        id,
        vehicle: { userId },
      },
      include: {
        vehicle: true,
      },
    });

    if (!reminder) {
      res.status(404).json({
        success: false,
        message: 'Pengingat tidak ditemukan.',
      });
      return;
    }

    const odo = currentOdometer !== undefined ? Number(currentOdometer) : reminder.vehicle.currentOdometer;
    const now = new Date();

    const nextDueOdometer = reminder.intervalKm ? odo + reminder.intervalKm : null;
    const nextDueDate = reminder.intervalMonths
      ? new Date(now.getTime() + reminder.intervalMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

    const updated = await prisma.serviceReminder.update({
      where: { id },
      data: {
        lastServiceOdometer: odo,
        lastServiceDate: now,
        nextDueOdometer,
        nextDueDate,
        status: 'ACTIVE',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Pengingat telah diperbarui dengan jadwal interval baru.',
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pengingat: ' + error.message,
    });
  }
};

export const updateReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existing = await prisma.serviceReminder.findFirst({
      where: {
        id,
        vehicle: { userId },
      },
      include: {
        vehicle: true,
      },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Pengingat tidak ditemukan.',
      });
      return;
    }

    const validatedData = reminderSchema.partial().parse(req.body);

    const updatePayload: any = {};
    if (validatedData.title) updatePayload.title = validatedData.title;
    if (validatedData.category) updatePayload.category = validatedData.category;
    if (validatedData.intervalKm !== undefined) updatePayload.intervalKm = validatedData.intervalKm;
    if (validatedData.intervalMonths !== undefined) updatePayload.intervalMonths = validatedData.intervalMonths;
    if (validatedData.lastServiceOdometer !== undefined) updatePayload.lastServiceOdometer = validatedData.lastServiceOdometer;
    if (validatedData.notes !== undefined) updatePayload.notes = validatedData.notes;

    const lastOdo = validatedData.lastServiceOdometer ?? existing.lastServiceOdometer ?? existing.vehicle.currentOdometer;
    const lastDate = validatedData.lastServiceDate ? new Date(validatedData.lastServiceDate) : (existing.lastServiceDate || new Date());

    const intKm = validatedData.intervalKm !== undefined ? validatedData.intervalKm : existing.intervalKm;
    const intMo = validatedData.intervalMonths !== undefined ? validatedData.intervalMonths : existing.intervalMonths;

    if (intKm) {
      updatePayload.nextDueOdometer = lastOdo + intKm;
    }
    if (intMo) {
      updatePayload.nextDueDate = new Date(lastDate.getTime() + intMo * 30 * 24 * 60 * 60 * 1000);
    }

    const updated = await prisma.serviceReminder.update({
      where: { id },
      data: updatePayload,
      include: { vehicle: true },
    });

    await updateRemindersStatusForVehicle(existing.vehicleId, existing.vehicle.currentOdometer);

    res.status(200).json({
      success: true,
      message: 'Pengingat berhasil diperbarui!',
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
      message: 'Gagal memperbarui pengingat: ' + error.message,
    });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const reminder = await prisma.serviceReminder.findFirst({
      where: {
        id,
        vehicle: { userId },
      },
    });

    if (!reminder) {
      res.status(404).json({
        success: false,
        message: 'Pengingat tidak ditemukan.',
      });
      return;
    }

    await prisma.serviceReminder.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Pengingat berhasil dihapus.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pengingat: ' + error.message,
    });
  }
};
