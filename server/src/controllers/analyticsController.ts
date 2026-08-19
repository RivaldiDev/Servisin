import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAnalyticsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { vehicleId } = req.query;

    const vehicleWhere: any = { userId };
    if (vehicleId && vehicleId !== 'all') {
      vehicleWhere.id = String(vehicleId);
    }

    const userVehicles = await prisma.vehicle.findMany({
      where: vehicleWhere,
      select: {
        id: true,
        brand: true,
        model: true,
        licensePlate: true,
        currentOdometer: true,
        type: true,
      },
    });

    const vehicleIds = userVehicles.map((v) => v.id);

    // Fetch all service logs for these vehicles
    const serviceLogs = await prisma.serviceLog.findMany({
      where: {
        vehicleId: { in: vehicleIds },
      },
      include: {
        items: true,
        vehicle: {
          select: {
            brand: true,
            model: true,
            licensePlate: true,
          },
        },
      },
      orderBy: { serviceDate: 'asc' },
    });

    // Total Cost & Count
    const totalSpent = serviceLogs.reduce((sum, log) => sum + log.totalCost, 0);
    const totalServices = serviceLogs.length;

    // Monthly breakdown (last 12 months)
    const monthlyMap: Record<string, { month: string; year: number; amount: number; count: number }> = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('id-ID', { month: 'short' });
      monthlyMap[key] = {
        month: `${monthName} '${String(d.getFullYear()).slice(-2)}`,
        year: d.getFullYear(),
        amount: 0,
        count: 0,
      };
    }

    serviceLogs.forEach((log) => {
      const d = new Date(log.serviceDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key]) {
        monthlyMap[key].amount += log.totalCost;
        monthlyMap[key].count += 1;
      }
    });

    const monthlyBreakdown = Object.values(monthlyMap);

    // Category breakdown
    const categoryMap: Record<string, { category: string; label: string; totalCost: number; count: number }> = {};
    
    const categoryLabels = {
      ENGINE_OIL: 'Oli Mesin',
      TRANSMISSION_OIL: 'Oli Transmisi / Gardan',
      BRAKE: 'Sistem Rem',
      TIRES: 'Ban & Velg',
      TUNE_UP: 'Tune Up & Mesin',
      BATTERY: 'Aki / Kelistrikan',
      SPARK_PLUG: 'Busi',
      SUSPENSION: 'Kaki-kaki & Suspensi',
      AIR_FILTER: 'Filter Udara / AC',
      COOLANT: 'Air Radiator / Coolant',
      GENERAL_CHECKUP: 'Pemeriksaan Rutin',
      OTHER: 'Lain-lain',
    } as const;

    serviceLogs.forEach((log) => {
      log.items.forEach((item) => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = {
            category: item.category,
            label: (categoryLabels as any)[item.category] || item.category,
            totalCost: 0,
            count: 0,
          };
        }
        categoryMap[item.category].totalCost += item.cost;
        categoryMap[item.category].count += 1;
      });
    });

    const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.totalCost - a.totalCost);

    // Vehicle breakdown
    const vehicleCostMap: Record<string, { id: string; name: string; plate: string; totalCost: number; serviceCount: number }> = {};
    userVehicles.forEach((v) => {
      vehicleCostMap[v.id] = {
        id: v.id,
        name: `${v.brand} ${v.model}`,
        plate: v.licensePlate,
        totalCost: 0,
        serviceCount: 0,
      };
    });

    serviceLogs.forEach((log) => {
      if (vehicleCostMap[log.vehicleId]) {
        vehicleCostMap[log.vehicleId].totalCost += log.totalCost;
        vehicleCostMap[log.vehicleId].serviceCount += 1;
      }
    });

    // Reminders count summary
    const reminders = await prisma.serviceReminder.findMany({
      where: {
        vehicleId: { in: vehicleIds },
        status: { not: 'COMPLETED' },
      },
    });

    const overdueCount = reminders.filter((r) => r.status === 'OVERDUE').length;
    const dueSoonCount = reminders.filter((r) => r.status === 'DUE_SOON').length;
    const activeCount = reminders.filter((r) => r.status === 'ACTIVE').length;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSpent,
          totalServices,
          vehiclesCount: userVehicles.length,
          overdueCount,
          dueSoonCount,
          activeCount,
        },
        monthlyBreakdown,
        categoryBreakdown,
        vehicleBreakdown: Object.values(vehicleCostMap),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal memuat ringkasan analitik: ' + error.message,
    });
  }
};
