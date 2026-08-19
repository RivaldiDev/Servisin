import bcrypt from 'bcryptjs';
import prisma from './prisma';

async function main() {
  console.log('🌱 Seeding demo data for FixGarasi SaaS...');

  // 1. Clean existing test data (optional)
  await prisma.serviceItem.deleteMany();
  await prisma.serviceReminder.deleteMany();
  await prisma.serviceLog.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const user = await prisma.user.create({
    data: {
      email: 'demo@fixgarasi.id',
      fullName: 'Rivaldi Pratama',
      phoneNumber: '081234567890',
      passwordHash,
      tier: 'FREE', // Can be toggled to 'PRO' in the Profile page
    },
  });

  console.log(`👤 Demo User created: ${user.email} (Password: password123)`);

  // 3. Create Vehicles
  // Vehicle 1: Honda HR-V 2022
  const car = await prisma.vehicle.create({
    data: {
      userId: user.id,
      type: 'CAR',
      brand: 'Honda',
      model: 'HR-V 1.5 SE',
      licensePlate: 'B 1984 RVD',
      year: 2022,
      currentOdometer: 24500,
      photoUrl: '/presets/hrv.jpg',
      notes: 'Warna Putih Mutiara • Bensin Pertamax / Shell V-Power',
    },
  });

  // Vehicle 2: Yamaha NMAX 155 Connected 2023
  const motor = await prisma.vehicle.create({
    data: {
      userId: user.id,
      type: 'MOTORCYCLE',
      brand: 'Yamaha',
      model: 'NMAX 155 Connected',
      licensePlate: 'B 4521 SXZ',
      year: 2023,
      currentOdometer: 11200,
      photoUrl: '/presets/nmax.jpg',
      notes: 'Warna Matte Black • Oli Yamalube Super Matic',
    },
  });

  console.log(`🚗 Vehicles created: ${car.model} & ${motor.model}`);

  // 4. Create Service Logs for Honda HR-V
  // Log 1: Servis 10.000 KM
  const serviceDate1 = new Date();
  serviceDate1.setMonth(serviceDate1.getMonth() - 8);

  await prisma.serviceLog.create({
    data: {
      vehicleId: car.id,
      serviceDate: serviceDate1,
      odometer: 10200,
      workshopName: 'Honda Megatama Kalimalang',
      workshopAddress: 'Jl. Raya Kalimalang No. 18, Jakarta Timur',
      totalCost: 1150000,
      notes: 'Servis berkala 10.000 km, kondisi mesin dan rem prima.',
      items: {
        create: [
          { category: 'ENGINE_OIL', description: 'Oli Honda E-Pro Gold 0W-20 (4L)', cost: 580000 },
          { category: 'AIR_FILTER', description: 'Filter Oli Original Honda', cost: 65000 },
          { category: 'GENERAL_CHECKUP', description: 'Jasa Servis Berkala & Rotasi Ban', cost: 505000 },
        ],
      },
    },
  });

  // Log 2: Servis 20.000 KM
  const serviceDate2 = new Date();
  serviceDate2.setMonth(serviceDate2.getMonth() - 2);

  await prisma.serviceLog.create({
    data: {
      vehicleId: car.id,
      serviceDate: serviceDate2,
      odometer: 20400,
      workshopName: 'Honda Megatama Kalimalang',
      workshopAddress: 'Jl. Raya Kalimalang No. 18, Jakarta Timur',
      totalCost: 1780000,
      notes: 'Ganti oli mesin, filter kabin AC, dan pembersihan kampas rem.',
      items: {
        create: [
          { category: 'ENGINE_OIL', description: 'Oli Mesin Honda E-Pro Gold 0W-20', cost: 590000 },
          { category: 'AIR_FILTER', description: 'Filter AC Kabin PM2.5', cost: 230000 },
          { category: 'BRAKE', description: 'Pembersihan & Brake Cleaner 4 Roda', cost: 260000 },
          { category: 'GENERAL_CHECKUP', description: 'Jasa Perawatan Berkala 20.000 KM', cost: 700000 },
        ],
      },
    },
  });

  // Log 3: Servis NMAX 10.000 KM
  const motorDate = new Date();
  motorDate.setMonth(motorDate.getMonth() - 1);

  await prisma.serviceLog.create({
    data: {
      vehicleId: motor.id,
      serviceDate: motorDate,
      odometer: 9800,
      workshopName: 'Yamaha Surya Motor',
      workshopAddress: 'Jl. Duren Sawit, Jakarta Timur',
      totalCost: 285000,
      notes: 'Ganti oli mesin & oli gardan matic, busi baru.',
      items: {
        create: [
          { category: 'ENGINE_OIL', description: 'Oli Yamalube Super Matic 1L', cost: 85000 },
          { category: 'TRANSMISSION_OIL', description: 'Oli Gear / Gardan Matic', cost: 25000 },
          { category: 'SPARK_PLUG', description: 'Busi NGK CR8E', cost: 45000 },
          { category: 'TUNE_UP', description: 'Pembersihan Injektor & Throttle Body', cost: 130000 },
        ],
      },
    },
  });

  console.log(`🛠️ Service logs and items created.`);

  // 5. Create Service Reminders
  // Car Reminder 1: Ganti Oli 25.000 KM (Mendekati / Due Soon)
  await prisma.serviceReminder.create({
    data: {
      vehicleId: car.id,
      title: 'Ganti Oli Mesin 25.000 KM',
      category: 'ENGINE_OIL',
      intervalKm: 5000,
      intervalMonths: 6,
      lastServiceOdometer: 20400,
      lastServiceDate: serviceDate2,
      nextDueOdometer: 25400, // Current is 24500 -> diff 900 km -> ACTIVE / DUE_SOON
      nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      notes: 'Gunakan oli sintetis 0W-20 rekomendasi Honda',
    },
  });

  // Car Reminder 2: Rotasi Ban & Spooring (Overdue demo)
  await prisma.serviceReminder.create({
    data: {
      vehicleId: car.id,
      title: 'Rotasi Ban & Spooring Balancing',
      category: 'TIRES',
      intervalKm: 10000,
      intervalMonths: 6,
      lastServiceOdometer: 10200,
      lastServiceDate: serviceDate1,
      nextDueOdometer: 20200, // Current is 24500 -> OVERDUE!
      nextDueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'OVERDUE',
      notes: 'Periksa keausan tapak ban depan dan belakang',
    },
  });

  // Motor Reminder: Ganti Oli Mesin NMAX (Due Soon demo)
  await prisma.serviceReminder.create({
    data: {
      vehicleId: motor.id,
      title: 'Ganti Oli Mesin NMAX 155',
      category: 'ENGINE_OIL',
      intervalKm: 2000,
      intervalMonths: 2,
      lastServiceOdometer: 9800,
      lastServiceDate: motorDate,
      nextDueOdometer: 11500, // Current is 11200 -> diff 300 km -> DUE_SOON!
      nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'DUE_SOON',
      notes: 'Kapasitas oli 0.9 liter',
    },
  });

  console.log(`⏰ Service Reminders created.`);
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
