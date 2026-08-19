import { Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { updateRemindersStatusForVehicle } from '../services/reminderService';

const serviceItemSchema = z.object({
  category: z.string().default('GENERAL_CHECKUP'),
  description: z.string().min(1, 'Keterangan item/pekerjaan wajib diisi'),
  cost: z.coerce.number().int().nonnegative().default(0),
});

const serviceLogSchema = z.object({
  vehicleId: z.string().uuid('ID Kendaraan tidak valid'),
  serviceDate: z.string().or(z.date()),
  odometer: z.coerce.number().int().nonnegative('Odometer harus angka positif'),
  workshopName: z.string().optional(),
  workshopAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .string()
    .transform((str) => {
      try {
        return JSON.parse(str);
      } catch {
        return [];
      }
    })
    .pipe(z.array(serviceItemSchema))
    .or(z.array(serviceItemSchema))
    .optional(),
  totalCost: z.coerce.number().int().optional(),
});

export const getServiceLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const vehicleId = req.query.vehicleId as string | undefined;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit as string | undefined;
    const page = req.query.page as string | undefined;

    const take = parseInt(limit || '50', 10) || 50;
    const skip = ((parseInt(page || '1', 10) || 1) - 1) * take;

    const whereClause: any = {
      vehicle: {
        userId,
      },
    };

    if (vehicleId && vehicleId !== 'all') {
      whereClause.vehicleId = vehicleId;
    }

    if (category && category !== 'all') {
      whereClause.items = {
        some: {
          category: category,
        },
      };
    }

    if (search && search.trim().length > 0) {
      whereClause.OR = [
        { workshopName: { contains: search } },
        { notes: { contains: search } },
        {
          items: {
            some: {
              description: { contains: search },
            },
          },
        },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.serviceLog.count({ where: whereClause }),
      prisma.serviceLog.findMany({
        where: whereClause,
        include: {
          vehicle: {
            select: {
              id: true,
              brand: true,
              model: true,
              licensePlate: true,
              type: true,
              photoUrl: true,
            },
          },
          items: true,
        },
        orderBy: { serviceDate: 'desc' },
        take,
        skip,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page || '1', 10) || 1,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat riwayat servis: ' + error.message,
    });
  }
};

export const getServiceLogById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const log = await prisma.serviceLog.findFirst({
      where: {
        id,
        vehicle: { userId },
      },
      include: {
        vehicle: true,
        items: true,
      },
    });

    if (!log) {
      res.status(404).json({
        success: false,
        message: 'Catatan servis tidak ditemukan.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat detail servis: ' + error.message,
    });
  }
};

export const createServiceLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validatedData = serviceLogSchema.parse(req.body);

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

    const parsedItems = validatedData.items || [];
    let calculatedTotal = validatedData.totalCost || 0;
    if (parsedItems.length > 0) {
      calculatedTotal = parsedItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    }

    let invoicePhotoUrl: string | undefined;
    if (req.file) {
      invoicePhotoUrl = `/uploads/invoices/${req.file.filename}`;
    }

    const serviceDate = new Date(validatedData.serviceDate);

    const serviceLog = await prisma.serviceLog.create({
      data: {
        vehicleId: vehicle.id,
        serviceDate,
        odometer: validatedData.odometer,
        workshopName: validatedData.workshopName,
        workshopAddress: validatedData.workshopAddress,
        totalCost: calculatedTotal,
        invoicePhotoUrl,
        notes: validatedData.notes,
        items: {
          create: parsedItems.map((item) => ({
            category: item.category,
            description: item.description,
            cost: item.cost,
          })),
        },
      },
      include: {
        items: true,
        vehicle: true,
      },
    });

    let updatedOdometer = vehicle.currentOdometer;
    if (validatedData.odometer > vehicle.currentOdometer) {
      updatedOdometer = validatedData.odometer;
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { currentOdometer: updatedOdometer },
      });
    }

    for (const item of parsedItems) {
      const matchedReminder = await prisma.serviceReminder.findFirst({
        where: {
          vehicleId: vehicle.id,
          category: item.category,
        },
      });

      if (matchedReminder) {
        const nextOdo = matchedReminder.intervalKm ? validatedData.odometer + matchedReminder.intervalKm : null;
        const nextDate = matchedReminder.intervalMonths
          ? new Date(serviceDate.getTime() + matchedReminder.intervalMonths * 30 * 24 * 60 * 60 * 1000)
          : null;

        await prisma.serviceReminder.update({
          where: { id: matchedReminder.id },
          data: {
            lastServiceOdometer: validatedData.odometer,
            lastServiceDate: serviceDate,
            nextDueOdometer: nextOdo,
            nextDueDate: nextDate,
            status: 'ACTIVE',
          },
        });
      }
    }

    await updateRemindersStatusForVehicle(vehicle.id, updatedOdometer);

    res.status(201).json({
      success: true,
      message: 'Catatan servis berhasil disimpan!',
      data: serviceLog,
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
      message: 'Gagal mencatat servis: ' + error.message,
    });
  }
};

export const updateServiceLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existingLog = await prisma.serviceLog.findFirst({
      where: {
        id,
        vehicle: { userId },
      },
      include: {
        vehicle: true,
      },
    });

    if (!existingLog) {
      res.status(404).json({
        success: false,
        message: 'Catatan servis tidak ditemukan.',
      });
      return;
    }

    const validatedData = serviceLogSchema.partial().parse(req.body);

    const parsedItems = validatedData.items;
    let calculatedTotal = validatedData.totalCost;
    if (parsedItems && parsedItems.length > 0) {
      calculatedTotal = parsedItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    }

    const updatePayload: any = {};
    if (validatedData.serviceDate) updatePayload.serviceDate = new Date(validatedData.serviceDate);
    if (validatedData.odometer !== undefined) updatePayload.odometer = validatedData.odometer;
    if (validatedData.workshopName !== undefined) updatePayload.workshopName = validatedData.workshopName;
    if (validatedData.workshopAddress !== undefined) updatePayload.workshopAddress = validatedData.workshopAddress;
    if (validatedData.notes !== undefined) updatePayload.notes = validatedData.notes;
    if (calculatedTotal !== undefined) updatePayload.totalCost = calculatedTotal;

    if (req.file) {
      updatePayload.invoicePhotoUrl = `/uploads/invoices/${req.file.filename}`;
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (parsedItems) {
        await tx.serviceItem.deleteMany({
          where: { serviceLogId: id },
        });

        await tx.serviceItem.createMany({
          data: parsedItems.map((item) => ({
            serviceLogId: id,
            category: item.category,
            description: item.description,
            cost: item.cost,
          })),
        });
      }

      return tx.serviceLog.update({
        where: { id },
        data: updatePayload,
        include: {
          items: true,
          vehicle: true,
        },
      });
    });

    if (validatedData.odometer && validatedData.odometer > existingLog.vehicle.currentOdometer) {
      await prisma.vehicle.update({
        where: { id: existingLog.vehicleId },
        data: { currentOdometer: validatedData.odometer },
      });
      await updateRemindersStatusForVehicle(existingLog.vehicleId, validatedData.odometer);
    }

    res.status(200).json({
      success: true,
      message: 'Catatan servis berhasil diperbarui!',
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
      message: 'Gagal memperbarui catatan servis: ' + error.message,
    });
  }
};

export const deleteServiceLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const existing = await prisma.serviceLog.findFirst({
      where: {
        id,
        vehicle: { userId },
      },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Catatan servis tidak ditemukan.',
      });
      return;
    }

    await prisma.serviceLog.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Catatan servis berhasil dihapus.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus catatan servis: ' + error.message,
    });
  }
};
