export type VehicleType = 'CAR' | 'MOTORCYCLE';

export type ServiceCategory =
  | 'ENGINE_OIL'
  | 'TRANSMISSION_OIL'
  | 'BRAKE'
  | 'TIRES'
  | 'TUNE_UP'
  | 'BATTERY'
  | 'SPARK_PLUG'
  | 'SUSPENSION'
  | 'AIR_FILTER'
  | 'COOLANT'
  | 'GENERAL_CHECKUP'
  | 'OTHER';

export type ReminderStatus = 'ACTIVE' | 'DUE_SOON' | 'OVERDUE' | 'COMPLETED';

export type UserTier = 'FREE' | 'PRO';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  tier: UserTier;
  createdAt: string;
  _count?: {
    vehicles: number;
  };
}

export interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  currentOdometer: number;
  photoUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    serviceLogs: number;
    reminders: number;
  };
  serviceLogs?: ServiceLog[];
  reminders?: ServiceReminder[];
}

export interface ServiceItem {
  id?: string;
  serviceLogId?: string;
  category: ServiceCategory;
  description: string;
  cost: number;
}

export interface ServiceLog {
  id: string;
  vehicleId: string;
  serviceDate: string;
  odometer: number;
  workshopName?: string | null;
  workshopAddress?: string | null;
  totalCost: number;
  invoicePhotoUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  items: ServiceItem[];
}

export interface ServiceReminder {
  id: string;
  vehicleId: string;
  title: string;
  category: ServiceCategory;
  intervalKm?: number | null;
  intervalMonths?: number | null;
  lastServiceOdometer?: number | null;
  lastServiceDate?: string | null;
  nextDueOdometer?: number | null;
  nextDueDate?: string | null;
  status: ReminderStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    currentOdometer: number;
    type: VehicleType;
  };
}

export interface AnalyticsSummary {
  summary: {
    totalSpent: number;
    totalServices: number;
    vehiclesCount: number;
    overdueCount: number;
    dueSoonCount: number;
    activeCount: number;
  };
  monthlyBreakdown: Array<{
    month: string;
    year: number;
    amount: number;
    count: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    label: string;
    totalCost: number;
    count: number;
  }>;
  vehicleBreakdown: Array<{
    id: string;
    name: string;
    plate: string;
    totalCost: number;
    serviceCount: number;
  }>;
}

export const CATEGORY_LABELS = {
  ENGINE_OIL: 'Oli Mesin',
  TRANSMISSION_OIL: 'Oli Transmisi / Gardan',
  BRAKE: 'Sistem Rem & Kampas',
  TIRES: 'Ban & Velg',
  TUNE_UP: 'Tune Up & Mesin',
  BATTERY: 'Aki & Kelistrikan',
  SPARK_PLUG: 'Busi',
  SUSPENSION: 'Kaki-kaki & Suspensi',
  AIR_FILTER: 'Filter Udara & AC',
  COOLANT: 'Air Radiator / Coolant',
  GENERAL_CHECKUP: 'Pemeriksaan Rutin',
  OTHER: 'Lain-lain',
} as const satisfies Record<ServiceCategory, string>;
