const fs = require('fs');
const path = require('path');

const VEHICLES = [
  // ==================== TOYOTA (CARS) ====================
  {
    id: 'toyota-avanza-gen1',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Avanza Gen 1 (1.3 E/G & 1.5 S)',
    generation: 'Gen 1 (2006–2011)',
    startYear: 2006,
    endYear: 2011,
    engineCc: '1.300 / 1.500 cc',
    categoryName: 'LMPV Sejuta Umat',
    fuelType: 'Bensin (K3-VE / 3SZ-VE)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
    bodyStyle: 'mpv',
    description: 'Generasi pertama Avanza VVT-i penggerak roda belakang (RWD) tangguh & mudah dirawat',
  },
  {
    id: 'toyota-avanza-gen2',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Avanza / Grand New Veloz Gen 2',
    generation: 'Gen 2 (2011–2021)',
    startYear: 2011,
    endYear: 2021,
    engineCc: '1.300 / 1.500 cc Dual VVT-i',
    categoryName: 'LMPV',
    fuelType: 'Bensin (1NR-VE / 2NR-VE)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0f172a',
    secondaryColor: '#2563eb',
    bodyStyle: 'mpv',
    description: 'Avanza generasi kedua dengan mesin Dual VVT-i irit bbm dan varian Veloz sporty',
  },
  {
    id: 'toyota-avanza-gen3',
    type: 'CAR',
    brand: 'Toyota',
    model: 'All New Avanza & All New Veloz',
    generation: 'Gen 3 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.300 / 1.500 cc Dual VVT-i',
    categoryName: 'LMPV Modern FWD',
    fuelType: 'Bensin (CVT / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#b91c1c',
    secondaryColor: '#ef4444',
    bodyStyle: 'mpv',
    description: 'Transformasi total platform DNGA penggerak roda depan (FWD), CVT & Toyota Safety Sense',
  },
  {
    id: 'toyota-innova-gen1',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Kijang Innova Gen 1',
    generation: 'Gen 1 (2006–2015)',
    startYear: 2006,
    endYear: 2015,
    engineCc: '2.000 cc Bensin / 2.500 cc D-4D',
    categoryName: 'Medium MPV Ladder Frame',
    fuelType: 'Bensin (1TR-FE) / Diesel (2KD-FTV)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#334155',
    secondaryColor: '#64748b',
    bodyStyle: 'mpv',
    description: 'Kijang Innova legendaris sasis ladder frame tangguh dengan mesin 2.0 bensin & 2.5 D-4D diesel',
  },
  {
    id: 'toyota-innova-reborn',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Innova Reborn (2.0 G/V & 2.4 Venturer)',
    generation: 'Gen 2 (2015–2022)',
    startYear: 2015,
    endYear: 2022,
    engineCc: '2.000 cc Dual VVT-i / 2.400 cc 2GD',
    categoryName: 'Medium MPV Premium',
    fuelType: 'Bensin (1TR-FE) / Diesel (2GD-FTV)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e293b',
    secondaryColor: '#475569',
    bodyStyle: 'mpv',
    description: 'Innova Reborn bermesin 2.4L 2GD-FTV diesel bertenaga badak dan kabin mewah',
  },
  {
    id: 'toyota-innova-zenix',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Kijang Innova Zenix (2.0 V / Q Hybrid)',
    generation: 'Gen 3 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: '2.000 cc Dynamic Force Hybrid',
    categoryName: 'Medium Crossover MPV',
    fuelType: 'Hybrid (M20A-FXS) / Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0284c7',
    secondaryColor: '#38bdf8',
    bodyStyle: 'mpv',
    description: 'Platform TNGA GA-C monokok dengan teknologi Hybrid EV generasi kelima & Panoramic Sunroof',
  },
  {
    id: 'toyota-fortuner-gen1',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Fortuner Gen 1 (2.7 VVT-i & 2.5 D-4D/VNT)',
    generation: 'Gen 1 (2006–2015)',
    startYear: 2006,
    endYear: 2015,
    engineCc: '2.500 cc VNT / 2.700 cc Bensin',
    categoryName: 'Ladder Frame SUV',
    fuelType: 'Diesel (2KD-FTV) / Bensin (2TR-FE)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#374151',
    secondaryColor: '#4b5563',
    bodyStyle: 'suv',
    description: 'SUV 7-penumpang tangguh ground clearance tinggi dengan mesin diesel 2KD VNT turbo',
  },
  {
    id: 'toyota-fortuner-gen2',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Fortuner VRZ & GR Sport 2.8',
    generation: 'Gen 2 (2016–2026)',
    startYear: 2016,
    endYear: 2026,
    engineCc: '2.400 cc 2GD / 2.800 cc 1GD',
    categoryName: 'High SUV 4x2 / 4x4',
    fuelType: 'Diesel (1GD-FTV / 2GD-FTV)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#111827',
    secondaryColor: '#dc2626',
    bodyStyle: 'suv',
    description: 'Fortuner generasi kedua bodi gagah bermesin 2.8L 1GD-FTV torsi 500 Nm & paket GR Sport',
  },
  {
    id: 'toyota-rush-gen1',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Rush Gen 1 (S / G Konde)',
    generation: 'Gen 1 (2006–2017)',
    startYear: 2006,
    endYear: 2017,
    engineCc: '1.500 cc 3SZ-VE',
    categoryName: 'Compact SUV RWD',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e3a5f',
    secondaryColor: '#3b82f6',
    bodyStyle: 'suv',
    description: 'Compact SUV tangguh dengan ban cadangan di pintu belakang (konde) & penggerak RWD',
  },
  {
    id: 'toyota-rush-gen2',
    type: 'CAR',
    brand: 'Toyota',
    model: 'All New Rush GR Sport',
    generation: 'Gen 2 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '1.500 cc Dual VVT-i',
    categoryName: 'Compact 7-Seater SUV',
    fuelType: 'Bensin (2NR-VE)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#991b1b',
    secondaryColor: '#ef4444',
    bodyStyle: 'suv',
    description: 'Desain SUV modern tanpa ban konde, 7 tempat duduk dengan ground clearance 220 mm',
  },
  {
    id: 'toyota-yaris-bakpao',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Yaris Bakpao (E / G / S Limited)',
    generation: 'Gen 1 (2006–2013)',
    startYear: 2006,
    endYear: 2013,
    engineCc: '1.500 cc 1NZ-FE',
    categoryName: 'Compact Hatchback',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#dc2626',
    secondaryColor: '#f87171',
    bodyStyle: 'hatchback',
    description: 'Yaris bodi membulat ikonik bermesin 1NZ-FE 1.5L responsif, speedometer tengah digital',
  },
  {
    id: 'toyota-yaris-gr',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Yaris Lele / Joker & GR Sport',
    generation: 'Gen 2 (2014–2024)',
    startYear: 2014,
    endYear: 2024,
    engineCc: '1.500 cc Dual VVT-i 2NR-FE',
    categoryName: 'Sporty Hatchback',
    fuelType: 'Bensin (CVT 7-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#991b1b',
    secondaryColor: '#f59e0b',
    bodyStyle: 'hatchback',
    description: 'Hatchback sporty dengan 7 Airbags, paddle shift, body kit GR Sport & mesin Dual VVT-i',
  },
  {
    id: 'toyota-agya-gen1',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Agya Gen 1 (1.0 E/G & 1.2 TRD/GR)',
    generation: 'Gen 1 (2013–2023)',
    startYear: 2013,
    endYear: 2023,
    engineCc: '1.000 cc 1KR / 1.200 cc 3NR',
    categoryName: 'LCGC City Car',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#d97706',
    secondaryColor: '#f59e0b',
    bodyStyle: 'hatchback',
    description: 'City car LCGC compact lincah, biaya perawatan sangat ekonomis untuk mobilitas perkotaan',
  },
  {
    id: 'toyota-agya-gen2',
    type: 'CAR',
    brand: 'Toyota',
    model: 'All New Agya & Agya GR Sport',
    generation: 'Gen 2 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: '1.200 cc WA-VE 3-Cylinder',
    categoryName: 'Compact City Car Sporty',
    fuelType: 'Bensin (D-CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#b91c1c',
    secondaryColor: '#1e293b',
    bodyStyle: 'hatchback',
    description: 'Platform DNGA All New Agya dengan handling rigid, transmisi D-CVT & opsi suspensi khusus GR',
  },
  {
    id: 'toyota-calya',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Calya (1.2 E / 1.2 G)',
    generation: 'Facelift (2016–2026)',
    startYear: 2016,
    endYear: 2026,
    engineCc: '1.200 cc 3NR-VE Dual VVT-i',
    categoryName: 'LCGC 7-Seater MPV',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#4f46e5',
    secondaryColor: '#818cf8',
    bodyStyle: 'mpv',
    description: 'Mobil keluarga 7-seater LCGC irit bahan bakar dengan kabin fungsional & AC rear circulator',
  },
  {
    id: 'toyota-raize',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Raize (1.0 Turbo GR Sport & 1.2 G)',
    generation: 'Gen 1 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.000 cc Turbo (1KR-VET) / 1.2 WA-VE',
    categoryName: 'Compact Turbo SUV',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#047857',
    secondaryColor: '#10b981',
    bodyStyle: 'suv',
    description: 'Compact SUV modern bertenaga turbo dengan TSS, paddle shift & ground clearance 200 mm',
  },
  {
    id: 'toyota-corolla-cross',
    type: 'CAR',
    brand: 'Toyota',
    model: 'Corolla Cross Hybrid GR Sport',
    generation: 'Gen 1 (2020–2026)',
    startYear: 2020,
    endYear: 2026,
    engineCc: '1.800 cc 2ZR-FXE Hybrid',
    categoryName: 'Crossover Hybrid SUV',
    fuelType: 'Hybrid EV',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0369a1',
    secondaryColor: '#0ea5e9',
    bodyStyle: 'suv',
    description: 'Crossover SUV berbasis platform TNGA-C dengan efisiensi bahan bakar tinggi & kenyamanan premium',
  },

  // ==================== HONDA (CARS) ====================
  {
    id: 'honda-jazz-gd3',
    type: 'CAR',
    brand: 'Honda',
    model: 'Jazz GD3 (i-DSI / VTEC)',
    generation: 'Gen 1 (2006–2008)',
    startYear: 2006,
    endYear: 2008,
    engineCc: '1.500 cc L15A i-DSI / VTEC',
    categoryName: 'Compact Hatchback',
    fuelType: 'Bensin (CVT 7-Speed Mode / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#b91c1c',
    secondaryColor: '#f87171',
    bodyStyle: 'hatchback',
    description: 'Hatchback legendaris pelopor Ultra Seat dengan efisiensi mesin i-DSI & performa VTEC',
  },
  {
    id: 'honda-jazz-ge8',
    type: 'CAR',
    brand: 'Honda',
    model: 'Jazz GE8 (S / RS i-VTEC)',
    generation: 'Gen 2 (2008–2014)',
    startYear: 2008,
    endYear: 2014,
    engineCc: '1.500 cc L15A i-VTEC 120 PS',
    categoryName: 'Sporty Hatchback',
    fuelType: 'Bensin (AT 5-Speed Paddle Shift)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#dc2626',
    secondaryColor: '#ef4444',
    bodyStyle: 'hatchback',
    description: 'Generasi Jazz terpopuler bertenaga 120 PS dengan transmisi otomatis 5-speed konvensional responsif',
  },
  {
    id: 'honda-jazz-gk5',
    type: 'CAR',
    brand: 'Honda',
    model: 'Jazz GK5 (S / RS Facelift)',
    generation: 'Gen 3 (2014–2021)',
    startYear: 2014,
    endYear: 2021,
    engineCc: '1.500 cc L15Z i-VTEC Earth Dreams',
    categoryName: 'Sporty Modern Hatchback',
    fuelType: 'Bensin (CVT Earth Dreams)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#e11d48',
    secondaryColor: '#f43f5e',
    bodyStyle: 'hatchback',
    description: 'Jazz generasi terakhir di Indonesia dengan desain aerodinamis tajam, LED headlamp & CVT halus',
  },
  {
    id: 'honda-city-hatchback',
    type: 'CAR',
    brand: 'Honda',
    model: 'City Hatchback RS (Honda SENSING)',
    generation: 'Gen 1 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.500 cc DOHC i-VTEC 121 PS',
    categoryName: 'Sporty Hatchback RS',
    fuelType: 'Bensin (CVT / MT 6-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#9f1239',
    secondaryColor: '#e11d48',
    bodyStyle: 'hatchback',
    description: 'Penerus resmi Jazz dengan mesin DOHC 1.5L 121 PS, Ultra Seat serbaguna & Honda SENSING',
  },
  {
    id: 'honda-brio-gen1',
    type: 'CAR',
    brand: 'Honda',
    model: 'Brio Gen 1 (1.2 Satya & 1.3 CBU)',
    generation: 'Gen 1 (2012–2018)',
    startYear: 2012,
    endYear: 2018,
    engineCc: '1.200 & 1.300 cc i-VTEC',
    categoryName: 'City Car Glass Hatchback',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#ea580c',
    secondaryColor: '#f97316',
    bodyStyle: 'hatchback',
    description: 'City car kompak berpintu bagasi full kaca, handling lincah khas Honda dan mesin bertenaga',
  },
  {
    id: 'honda-brio-gen2',
    type: 'CAR',
    brand: 'Honda',
    model: 'All New Brio (RS / Satya Facelift)',
    generation: 'Gen 2 (2018–2026)',
    startYear: 2018,
    endYear: 2026,
    engineCc: '1.200 cc i-VTEC 90 PS',
    categoryName: 'City Car Terlaris',
    fuelType: 'Bensin (CVT / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#c2410c',
    secondaryColor: '#fb923c',
    bodyStyle: 'hatchback',
    description: 'Mobil terlaris di Indonesia dengan bagasi luas, desain sporty dan efisiensi konsumsi BBM tinggi',
  },
  {
    id: 'honda-hrv-gen2',
    type: 'CAR',
    brand: 'Honda',
    model: 'HR-V Gen 2 RU (1.5 E/S & 1.8 Prestige)',
    generation: 'Gen 2 (2014–2021)',
    startYear: 2014,
    endYear: 2021,
    engineCc: '1.500 cc & 1.800 cc i-VTEC',
    categoryName: 'Compact Crossover SUV',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#4338ca',
    secondaryColor: '#6366f1',
    bodyStyle: 'suv',
    description: 'Pelopor crossover coupe di Indonesia dengan Panoramic Sunroof, rem parkir elektrik & Brake Hold',
  },
  {
    id: 'honda-hrv-gen3',
    type: 'CAR',
    brand: 'Honda',
    model: 'All New HR-V (1.5 SE & RS Turbo)',
    generation: 'Gen 3 RV (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: '1.500 cc DOHC / 1.500 cc VTEC Turbo 177 PS',
    categoryName: 'Premium Compact SUV',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e1b4b',
    secondaryColor: '#ef4444',
    bodyStyle: 'suv',
    description: 'Desain fastback coupe modern bertenaga 1.5L Turbo 177 PS dengan fitur Honda SENSING standar',
  },
  {
    id: 'honda-crv-gen3',
    type: 'CAR',
    brand: 'Honda',
    model: 'CR-V Gen 3 Kura-Kura (2.0 & 2.4)',
    generation: 'Gen 3 (2007–2012)',
    startYear: 2007,
    endYear: 2012,
    engineCc: '2.000 cc R20A / 2.400 cc K24Z',
    categoryName: 'Medium SUV Monokok',
    fuelType: 'Bensin (AT 5-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#334155',
    secondaryColor: '#475569',
    bodyStyle: 'suv',
    description: 'SUV monokok berjuluk CR-V Kura-kura dengan kenyamanan berkendikasi layaknya sedan',
  },
  {
    id: 'honda-crv-gen4',
    type: 'CAR',
    brand: 'Honda',
    model: 'CR-V Gen 4 RM (2.0 i-VTEC & 2.4 Prestige)',
    generation: 'Gen 4 (2012–2017)',
    startYear: 2012,
    endYear: 2017,
    engineCc: '2.000 & 2.400 cc DOHC i-VTEC 190 PS',
    categoryName: 'Medium SUV',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e293b',
    secondaryColor: '#38bdf8',
    bodyStyle: 'suv',
    description: 'CR-V bertenaga 190 PS bermesin legendaris K24Z dengan kabin luas dan fitur ECON Mode',
  },
  {
    id: 'honda-crv-gen5',
    type: 'CAR',
    brand: 'Honda',
    model: 'CR-V Gen 5 Turbo RW (1.5 Turbo 7-Seater)',
    generation: 'Gen 5 (2017–2023)',
    startYear: 2017,
    endYear: 2023,
    engineCc: '1.500 cc VTEC Turbo 190 PS',
    categoryName: 'Medium 7-Seater SUV',
    fuelType: 'Bensin (CVT Earth Dreams)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0f172a',
    secondaryColor: '#dc2626',
    bodyStyle: 'suv',
    description: 'SUV 7 tempat duduk dengan mesin 1.5 Turbocharged, Panoramic Sunroof & Hands-free Power Tailgate',
  },
  {
    id: 'honda-crv-gen6',
    type: 'CAR',
    brand: 'Honda',
    model: 'All New CR-V RS e:HEV & 1.5 Turbo',
    generation: 'Gen 6 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: '2.000 cc e:HEV Hybrid / 1.5 Turbo',
    categoryName: 'Flagship SUV Hybrid',
    fuelType: 'Hybrid (e:HEV) / Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#881337',
    secondaryColor: '#e11d48',
    bodyStyle: 'suv',
    description: 'Flagship SUV canggih dengan motor listrik ganda e:HEV, Honda CONNECT & Bose 12-Speaker System',
  },
  {
    id: 'honda-civic-fd',
    type: 'CAR',
    brand: 'Honda',
    model: 'Civic FD Batman (1.8 & 2.0 i-VTEC)',
    generation: 'Gen 8 (2006–2011)',
    startYear: 2006,
    endYear: 2011,
    engineCc: '1.800 cc R18A / 2.000 cc K20Z',
    categoryName: 'Sport Sedan',
    fuelType: 'Bensin (AT 5-Speed Paddle Shift / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#991b1b',
    secondaryColor: '#ef4444',
    bodyStyle: 'sedan',
    description: 'Sedan sport legendaris dengan kokpit bertingkat Multiplex Meter & mesin K20Z DOHC bertenaga',
  },
  {
    id: 'honda-civic-turbo-fc',
    type: 'CAR',
    brand: 'Honda',
    model: 'Civic Turbo FC Sedan & Hatchback FK',
    generation: 'Gen 10 (2016–2021)',
    startYear: 2016,
    endYear: 2021,
    engineCc: '1.500 cc VTEC Turbo 173 PS',
    categoryName: 'Fastback Sport Sedan',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#18181b',
    secondaryColor: '#dc2626',
    bodyStyle: 'sedan',
    description: 'Desain fastback agresif bermesin 1.5L VTEC Turbo dengan dual exhaust dan center display digital',
  },
  {
    id: 'honda-civic-fe-rs',
    type: 'CAR',
    brand: 'Honda',
    model: 'Civic FE RS (1.5 VTEC Turbo SENSING)',
    generation: 'Gen 11 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.500 cc VTEC Turbo 178 PS',
    categoryName: 'Luxury Sport Sedan RS',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#7f1d1d',
    secondaryColor: '#dc2626',
    bodyStyle: 'sedan',
    description: 'Sedan premium berdesain minimalis mewah bertenaga 178 PS dengan instrumen 10.2 inci & Honda SENSING',
  },
  {
    id: 'honda-mobilio',
    type: 'CAR',
    brand: 'Honda',
    model: 'Mobilio (E / RS Facelift)',
    generation: 'Gen 1 (2014–2024)',
    startYear: 2014,
    endYear: 2024,
    engineCc: '1.500 cc i-VTEC L15Z 118 PS',
    categoryName: 'LMPV 7-Seater',
    fuelType: 'Bensin (CVT / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#c2410c',
    secondaryColor: '#ea580c',
    bodyStyle: 'mpv',
    description: 'LMPV dengan tenaga terbesar di kelasnya (118 PS), kabin lega 7-seater dan konsumsi BBM hemat',
  },
  {
    id: 'honda-brv-gen1',
    type: 'CAR',
    brand: 'Honda',
    model: 'BR-V Gen 1 (E / Prestige)',
    generation: 'Gen 1 (2015–2021)',
    startYear: 2015,
    endYear: 2021,
    engineCc: '1.500 cc i-VTEC 120 PS',
    categoryName: 'Crossover 7-Seater SUV',
    fuelType: 'Bensin (CVT / MT 6-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
    bodyStyle: 'suv',
    description: 'Crossover 7-penumpang dengan ground clearance 201 mm, roof rail & transmisi 6-percepatan',
  },
  {
    id: 'honda-brv-gen2',
    type: 'CAR',
    brand: 'Honda',
    model: 'All New BR-V N7X Edition',
    generation: 'Gen 2 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.500 cc DOHC i-VTEC 121 PS',
    categoryName: 'Crossover MPV SUV',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#312e81',
    secondaryColor: '#6366f1',
    bodyStyle: 'suv',
    description: 'Generasi baru berkonsep N7X dengan mesin DOHC 1.5L, Honda SENSING, Remote Engine Start & LaneWatch',
  },
  {
    id: 'honda-wrv',
    type: 'CAR',
    brand: 'Honda',
    model: 'WR-V (1.5 E & RS with SENSING)',
    generation: 'Gen 1 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: '1.500 cc DOHC i-VTEC 121 PS',
    categoryName: 'Small Crossover SUV',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#be123c',
    secondaryColor: '#f43f5e',
    bodyStyle: 'suv',
    description: 'Small SUV tangguh bertenaga 121 PS terbesar di kelasnya dengan ground clearance 220 mm & Honda SENSING',
  },

  // ==================== MITSUBISHI (CARS) ====================
  {
    id: 'mitsubishi-pajero-gen2',
    type: 'CAR',
    brand: 'Mitsubishi',
    model: 'Pajero Sport Gen 2 (Exceed & Dakar VGT)',
    generation: 'Gen 2 (2009–2015)',
    startYear: 2009,
    endYear: 2015,
    engineCc: '2.500 cc 4D56 DI-D Commonrail Turbo',
    categoryName: 'Ladder Frame SUV',
    fuelType: 'Diesel (4D56 VGT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#334155',
    secondaryColor: '#dc2626',
    bodyStyle: 'suv',
    description: 'SUV ladder frame tangguh bermesin 4D56 VGT 178 PS dengan transmisi INVECS-II',
  },
  {
    id: 'mitsubishi-pajero-gen3',
    type: 'CAR',
    brand: 'Mitsubishi',
    model: 'All New Pajero Sport (Dakar Ultimate 4x2/4x4)',
    generation: 'Gen 3 (2016–2026)',
    startYear: 2016,
    endYear: 2026,
    engineCc: '2.400 cc 4N15 MIVEC VGT 181 PS',
    categoryName: 'Premium High SUV',
    fuelType: 'Diesel (AT 8-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0f172a',
    secondaryColor: '#ef4444',
    bodyStyle: 'suv',
    description: 'SUV bermesin aluminium 4N15 MIVEC 181 PS dengan transmisi 8-percepatan & Dynamic Shield gagah',
  },
  {
    id: 'mitsubishi-xpander-gen1',
    type: 'CAR',
    brand: 'Mitsubishi',
    model: 'Xpander (GLX / Exceed / Sport / Ultimate)',
    generation: 'Gen 1 Facelift (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '1.500 cc 4A91 MIVEC DOHC',
    categoryName: 'LMPV Modern',
    fuelType: 'Bensin (CVT / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#475569',
    secondaryColor: '#f1f5f9',
    bodyStyle: 'mpv',
    description: 'LMPV dengan suspensi paling nyaman di kelasnya, kabin senyap, transmisi CVT & Electric Parking Brake',
  },
  {
    id: 'mitsubishi-xpander-cross',
    type: 'CAR',
    brand: 'Mitsubishi',
    model: 'Xpander Cross (Premium CVT)',
    generation: 'Facelift (2019–2026)',
    startYear: 2019,
    endYear: 2026,
    engineCc: '1.500 cc MIVEC DOHC',
    categoryName: 'Crossover MPV',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#b45309',
    secondaryColor: '#f59e0b',
    bodyStyle: 'suv',
    description: 'Crossover MPV berfitur Active Yaw Control (AYC), setir palang 4 mirip Pajero Sport & roof rail',
  },
  {
    id: 'mitsubishi-xforce',
    type: 'CAR',
    brand: 'Mitsubishi',
    model: 'Xforce (Exceed & Ultimate)',
    generation: 'Gen 1 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: '1.500 cc 4A91 MIVEC',
    categoryName: 'Compact SUV Modern',
    fuelType: 'Bensin (CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e3a5f',
    secondaryColor: '#0ea5e9',
    bodyStyle: 'suv',
    description: 'Compact SUV dengan 4 mode berkendara (Wet, Gravel, Mud, Normal) & Dynamic Sound Yamaha Premium',
  },

  // ==================== SUZUKI (CARS) ====================
  {
    id: 'suzuki-swift',
    type: 'CAR',
    brand: 'Suzuki',
    model: 'Swift (GL / GT / GT2 / GX)',
    generation: 'Gen 1-2 (2006–2017)',
    startYear: 2006,
    endYear: 2017,
    engineCc: '1.500 cc M15A / 1.400 cc K14B',
    categoryName: 'Sporty Compact Hatchback',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0284c7',
    secondaryColor: '#38bdf8',
    bodyStyle: 'hatchback',
    description: 'Hatchback kompak dengan sasis rigid bergaya Eropa dan handling presisi tajam',
  },
  {
    id: 'suzuki-ertiga-gen1',
    type: 'CAR',
    brand: 'Suzuki',
    model: 'Ertiga Gen 1 (GL / GX / Dreza)',
    generation: 'Gen 1 (2012–2018)',
    startYear: 2012,
    endYear: 2018,
    engineCc: '1.400 cc K14B DOHC VVT',
    categoryName: 'LMPV Monokok',
    fuelType: 'Bensin (FWD)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#334155',
    secondaryColor: '#64748b',
    bodyStyle: 'mpv',
    description: 'Pelopor LMPV monokok penggerak roda depan (FWD) yang terkenal sangat empuk dan hemat bensin',
  },
  {
    id: 'suzuki-ertiga-hybrid',
    type: 'CAR',
    brand: 'Suzuki',
    model: 'All New Ertiga Cruise Hybrid',
    generation: 'Gen 2 (2018–2026)',
    startYear: 2018,
    endYear: 2026,
    engineCc: '1.500 cc K15B Smart Hybrid (SHVS)',
    categoryName: 'LMPV Smart Hybrid',
    fuelType: 'Mild Hybrid (ISG + Lithium-ion)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#065f46',
    secondaryColor: '#10b981',
    bodyStyle: 'mpv',
    description: 'LMPV dengan teknologi Suzuki Smart Hybrid berfitur Auto Stop dan efisiensi konsumsi BBM optimal',
  },
  {
    id: 'suzuki-xl7-hybrid',
    type: 'CAR',
    brand: 'Suzuki',
    model: 'XL7 Hybrid (Zeta / Beta / Alpha)',
    generation: 'Gen 1 (2020–2026)',
    startYear: 2020,
    endYear: 2026,
    engineCc: '1.500 cc K15B Smart Hybrid',
    categoryName: 'Crossover 7-Seater SUV',
    fuelType: 'Mild Hybrid / Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#92400e',
    secondaryColor: '#d97706',
    bodyStyle: 'suv',
    description: 'SUV 7-penumpang dengan Smart E-Mirror, teknologi SHVS ramah lingkungan & bodi maskulin',
  },
  {
    id: 'suzuki-jimny-jb74',
    type: 'CAR',
    brand: 'Suzuki',
    model: 'Jimny JB74 (3-Door & 5-Door AllGrip Pro)',
    generation: 'Gen 4 (2019–2026)',
    startYear: 2019,
    endYear: 2026,
    engineCc: '1.500 cc K15B 4x4',
    categoryName: 'Authentic Off-Road 4x4',
    fuelType: 'Bensin (AllGrip Pro 4WD)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#3f6212',
    secondaryColor: '#84cc16',
    bodyStyle: 'suv',
    description: 'SUV 4x4 sejati dengan ladder frame, 3-link rigid axle, transfer case low-range & desain retro boxy',
  },
  {
    id: 'suzuki-ignis',
    type: 'CAR',
    brand: 'Suzuki',
    model: 'Ignis Urban SUV (GL / GX AGS)',
    generation: 'Gen 1 (2017–2024)',
    startYear: 2017,
    endYear: 2024,
    engineCc: '1.200 cc K12M DOHC VVT',
    categoryName: 'Urban Mini SUV',
    fuelType: 'Bensin (AGS / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0369a1',
    secondaryColor: '#38bdf8',
    bodyStyle: 'hatchback',
    description: 'Mini crossover berkarakter unik dengan ground clearance 180 mm dan konsumsi bensin sangat irit',
  },

  // ==================== DAIHATSU (CARS) ====================
  {
    id: 'daihatsu-xenia-gen1',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'Xenia Gen 1 (Mi / Li 1.0 & Xi 1.3)',
    generation: 'Gen 1 (2006–2011)',
    startYear: 2006,
    endYear: 2011,
    engineCc: '1.000 cc EJ-VE / 1.300 cc K3-VE',
    categoryName: 'LMPV',
    fuelType: 'Bensin (RWD)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1e3a5f',
    secondaryColor: '#60a5fa',
    bodyStyle: 'mpv',
    description: 'Mobil keluarga RWD ekonomis dengan pilihan mesin 1.0L 3-silinder hemat dan 1.3L VVT-i',
  },
  {
    id: 'daihatsu-xenia-gen2',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'All New Xenia & Great New Xenia',
    generation: 'Gen 2 (2011–2021)',
    startYear: 2011,
    endYear: 2021,
    engineCc: '1.300 cc 1NR / 1.500 cc 2NR Dual VVT-i',
    categoryName: 'LMPV',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0f172a',
    secondaryColor: '#3b82f6',
    bodyStyle: 'mpv',
    description: 'Xenia generasi kedua dengan kabin lebih kedap, mesin Dual VVT-i dan varian sporty Custom',
  },
  {
    id: 'daihatsu-xenia-gen3',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'All New Xenia (1.3 M/X/R & 1.5 R ADS)',
    generation: 'Gen 3 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.300 cc 1NR-VE / 1.500 cc 2NR-VE',
    categoryName: 'LMPV Modern DNGA',
    fuelType: 'Bensin (CVT / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#991b1b',
    secondaryColor: '#ef4444',
    bodyStyle: 'mpv',
    description: 'Platform DNGA FWD dengan transmisi D-CVT, kabin Sofa Mode serbaguna & paket keselamatan A.S.A',
  },
  {
    id: 'daihatsu-terios-gen1',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'Terios Gen 1 (TS / TX Konde)',
    generation: 'Gen 1 (2006–2017)',
    startYear: 2006,
    endYear: 2017,
    engineCc: '1.500 cc 3SZ-VE VVT-i',
    categoryName: 'Compact 7-Seater SUV',
    fuelType: 'Bensin (RWD)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#334155',
    secondaryColor: '#64748b',
    bodyStyle: 'suv',
    description: 'SUV keluarga 7-seater dengan ban serep konde pintu belakang & gardan belakang tangguh',
  },
  {
    id: 'daihatsu-terios-gen2',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'All New Terios (X / R Custom Facelift)',
    generation: 'Gen 2 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '1.500 cc 2NR-VE Dual VVT-i',
    categoryName: 'Compact SUV 7-Seater',
    fuelType: 'Bensin (RWD)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#b45309',
    secondaryColor: '#f59e0b',
    bodyStyle: 'suv',
    description: 'SUV RWD 7-seater ground clearance 220 mm dengan kamera 360, VSC, HSA & Eco Idle hemat bbm',
  },
  {
    id: 'daihatsu-sigra',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'Sigra (1.0 D/M & 1.2 X/R Deluxe)',
    generation: 'Facelift (2016–2026)',
    startYear: 2016,
    endYear: 2026,
    engineCc: '1.000 cc 1KR-VE / 1.200 cc 3NR-VE',
    categoryName: 'LCGC 7-Seater MPV',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#1d4ed8',
    secondaryColor: '#60a5fa',
    bodyStyle: 'mpv',
    description: 'Mobil LCGC 7-seater paling laris di Indonesia dengan biaya kepemilikan sangat terjangkau',
  },
  {
    id: 'daihatsu-ayla-gen1',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'Ayla Gen 1 (1.0 D/M/X & 1.2 R)',
    generation: 'Gen 1 (2013–2023)',
    startYear: 2013,
    endYear: 2023,
    engineCc: '1.000 cc 1KR / 1.200 cc 3NR',
    categoryName: 'LCGC Hatchback',
    fuelType: 'Bensin',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#c2410c',
    secondaryColor: '#fb923c',
    bodyStyle: 'hatchback',
    description: 'Hatchback mungil lincah dengan konsumsi bensin tembus 20 km/liter untuk rute harian',
  },
  {
    id: 'daihatsu-ayla-gen2',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'All New Ayla (1.0 M/X & 1.2 R ADS)',
    generation: 'Gen 2 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: '1.000 cc 1KR-VE / 1.200 cc WA-VE',
    categoryName: 'City Car Hatchback DNGA',
    fuelType: 'Bensin (D-CVT / MT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#991b1b',
    secondaryColor: '#ef4444',
    bodyStyle: 'hatchback',
    description: 'All New Ayla sasis DNGA dengan transmisi D-CVT halus, bagasi 265L & desain sporty ADS',
  },
  {
    id: 'daihatsu-rocky',
    type: 'CAR',
    brand: 'Daihatsu',
    model: 'Rocky (1.0 R Turbo ADS & 1.2 X/M)',
    generation: 'Gen 1 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '1.000 cc Turbo (1KR-VET) / 1.2 WA-VE',
    categoryName: 'Compact Turbo SUV',
    fuelType: 'Bensin (D-CVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0f766e',
    secondaryColor: '#14b8a6',
    bodyStyle: 'suv',
    description: 'SUV kompak turbo modern dengan paket active safety A.S.A & subwoofer aktif bawaan',
  },

  // ==================== HYUNDAI & WULING & MAZDA & NISSAN & EV ====================
  {
    id: 'hyundai-creta',
    type: 'CAR',
    brand: 'Hyundai',
    model: 'Creta (Active / Trend / Style / Prime)',
    generation: 'Gen 1 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: '1.500 cc Smartstream G1.5 115 PS',
    categoryName: 'Compact Crossover SUV',
    fuelType: 'Bensin (IVT / MT 6-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#0369a1',
    secondaryColor: '#0ea5e9',
    bodyStyle: 'suv',
    description: 'SUV modern rakitan Cikarang dengan Hyundai Bluelink, BOSE Audio, Panoramic Sunroof & SmartSense',
  },
  {
    id: 'hyundai-stargazer',
    type: 'CAR',
    brand: 'Hyundai',
    model: 'Stargazer & Stargazer X (Prime IVT)',
    generation: 'Gen 1 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: '1.500 cc Smartstream G1.5 115 PS',
    categoryName: 'LMPV Futuristik & Crossover',
    fuelType: 'Bensin (IVT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#4338ca',
    secondaryColor: '#818cf8',
    bodyStyle: 'mpv',
    description: 'LMPV berdesain one-curve futuristik dengan opsi Captain Seat, meja lipat & Hyundai SmartSense',
  },
  {
    id: 'hyundai-ioniq5',
    type: 'CAR',
    brand: 'Hyundai',
    model: 'Ioniq 5 (Prime & Signature Long Range)',
    generation: 'Gen 1 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: 'Electric EV (58 kWh / 72.6 kWh)',
    categoryName: 'Electric Crossover EV',
    fuelType: 'Full Electric (Baterai Lithium-ion)',
    defaultIntervalKm: 7500,
    defaultIntervalMonths: 6,
    accentColor: '#0891b2',
    secondaryColor: '#22d3ee',
    bodyStyle: 'ev',
    description: 'Pelopor mobil listrik rakitan lokal platform E-GMP, fitur V2L daya 3.6 kW & jarak tempuh hingga 481 km',
  },
  {
    id: 'wuling-confero',
    type: 'CAR',
    brand: 'Wuling',
    model: 'Confero S (1.5 C / L ACT)',
    generation: 'Facelift (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '1.500 cc DOHC DVVT RWD',
    categoryName: 'LMPV RWD',
    fuelType: 'Bensin (MT / E-Clutch ACT)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#991b1b',
    secondaryColor: '#ef4444',
    bodyStyle: 'mpv',
    description: 'LMPV berkapasitas 8-seater lega dengan penggerak roda belakang (RWD) dan rem cakram 4 roda',
  },
  {
    id: 'wuling-almaz',
    type: 'CAR',
    brand: 'Wuling',
    model: 'Almaz RS Pro & Almaz Hybrid',
    generation: 'Facelift (2019–2026)',
    startYear: 2019,
    endYear: 2026,
    engineCc: '1.500 cc Turbo / 2.000 cc Hybrid',
    categoryName: 'Medium SUV Berfitur Lengkap',
    fuelType: 'Bensin Turbo / Hybrid',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#18181b',
    secondaryColor: '#dc2626',
    bodyStyle: 'suv',
    description: 'SUV pintar dengan perintah suara bahasa Indonesia (WIND), fitur otonom ADAS & layar sentuh 10.4 inci',
  },
  {
    id: 'wuling-airev',
    type: 'CAR',
    brand: 'Wuling',
    model: 'Air ev (Standard & Long Range)',
    generation: 'Gen 1 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: 'Electric EV (17.3 kWh / 26.7 kWh)',
    categoryName: 'Compact City EV',
    fuelType: 'Full Electric (Baterai LFP)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#059669',
    secondaryColor: '#34d399',
    bodyStyle: 'ev',
    description: 'Mobil listrik kompak perkotaan terlaris, mudah parkir di gang sempit dengan jarak tempuh 300 km',
  },
  {
    id: 'wuling-bingo',
    type: 'CAR',
    brand: 'Wuling',
    model: 'BinguoEV (Long Range 333km & Premium 410km)',
    generation: 'Gen 1 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: 'Electric EV (31.9 kWh / 37.9 kWh)',
    categoryName: 'Classy Retro EV Hatchback',
    fuelType: 'Full Electric (Baterai LFP)',
    defaultIntervalKm: 7500,
    defaultIntervalMonths: 6,
    accentColor: '#4f46e5',
    secondaryColor: '#a78bfa',
    bodyStyle: 'ev',
    description: 'Hatchback listrik bergaya retro klasik elegan dengan kabin mewah, dual screen & garansi baterai seumur hidup',
  },
  {
    id: 'nissan-grand-livina',
    type: 'CAR',
    brand: 'Nissan',
    model: 'Grand Livina L10 & L11 (1.5 SV/XV/HWS)',
    generation: 'L10 / L11 (2007–2018)',
    startYear: 2007,
    endYear: 2018,
    engineCc: '1.500 cc HR15DE Dual Injector',
    categoryName: 'Comfortable Low MPV',
    fuelType: 'Bensin (CVT / AT 4-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#334155',
    secondaryColor: '#94a3b8',
    bodyStyle: 'mpv',
    description: 'MPV 7-penumpang dengan kenyamanan bantingan suspensi empuk ala sedan dan mesin HR15DE irit',
  },
  {
    id: 'mazda-cx5',
    type: 'CAR',
    brand: 'Mazda',
    model: 'Mazda CX-5 (Elite / Kuro Edition)',
    generation: 'KF Series (2012–2026)',
    startYear: 2012,
    endYear: 2026,
    engineCc: '2.500 cc SkyActiv-G 190 PS',
    categoryName: 'Premium Medium SUV',
    fuelType: 'Bensin (SkyActiv-Drive 6-Speed)',
    defaultIntervalKm: 5000,
    defaultIntervalMonths: 6,
    accentColor: '#881337',
    secondaryColor: '#e11d48',
    bodyStyle: 'suv',
    description: 'SUV premium dengan bahasa desain KODO Soul of Motion, handling G-Vectoring Control & audio BOSE 10-Speaker',
  },

  // ==================== HONDA (MOTORCYCLES) ====================
  {
    id: 'honda-beat-karbu',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'BeAT Karbu Gen 1',
    generation: 'Gen 1 (2008–2012)',
    startYear: 2008,
    endYear: 2012,
    engineCc: '110 cc SOHC Karburator',
    categoryName: 'Skutik Entry Karbu',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#dc2626',
    secondaryColor: '#f87171',
    bodyStyle: 'skutik',
    description: 'Skutik pelopor BeAT di Indonesia, bodi mungil ramping, sangat lincah dan mudah dimodifikasi',
  },
  {
    id: 'honda-beat-fi',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'BeAT FI & BeAT eSP (Sporty / Pop)',
    generation: 'Gen 2-3 (2012–2020)',
    startYear: 2012,
    endYear: 2020,
    engineCc: '110 cc PGM-FI eSP ISS',
    categoryName: 'Skutik Harian Sejuta Umat',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#b91c1c',
    secondaryColor: '#ef4444',
    bodyStyle: 'skutik',
    description: 'Motor sejuta umat dengan teknologi injeksi PGM-FI, Idling Stop System (ISS) & ACG Starter senyap',
  },
  {
    id: 'honda-beat-deluxe',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'All New BeAT Deluxe & BeAT Street',
    generation: 'Gen 4 (2020–2026)',
    startYear: 2020,
    endYear: 2026,
    engineCc: '110 cc eSP Long Stroke',
    categoryName: 'Skutik Modern Terlaris',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#18181b',
    secondaryColor: '#ef4444',
    bodyStyle: 'skutik',
    description: 'All New BeAT bermesin eSP generasi baru super irit (60.6 km/l), lampu LED, power charger & secure key',
  },
  {
    id: 'honda-vario-110',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Vario 110 Karbu & Techno 110',
    generation: 'Gen 1-2 (2006–2014)',
    startYear: 2006,
    endYear: 2014,
    engineCc: '110 cc Liquid Cooled Radiator',
    categoryName: 'Skutik Sporty Radiator',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#1e3a5f',
    secondaryColor: '#3b82f6',
    bodyStyle: 'skutik',
    description: 'Skutik pertama Honda berpendingin cairan (radiator) di Indonesia dengan fitur Combi Brake System',
  },
  {
    id: 'honda-vario-125',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Vario 125 (Bohlam / LED Old / New eSP)',
    generation: 'Gen 1-3 (2012–2026)',
    startYear: 2012,
    endYear: 2026,
    engineCc: '125 cc Liquid Cooled eSP',
    categoryName: 'Skutik Komuter Serbaguna',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#0f172a',
    secondaryColor: '#38bdf8',
    bodyStyle: 'skutik',
    description: 'Skutik komuter terfavorit dengan bagasi helm-in 18 liter, mesin 125 cc eSP bertenaga & konsumsi bensin hemat',
  },
  {
    id: 'honda-vario-160',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Vario 150 & All New Vario 160 ABS',
    generation: 'Gen 1-2 (2015–2026)',
    startYear: 2015,
    endYear: 2026,
    engineCc: '160 cc 4-Katup eSP+ 15.4 PS',
    categoryName: 'Skutik Sporty Bertenaga',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#7f1d1d',
    secondaryColor: '#ef4444',
    bodyStyle: 'skutik',
    description: 'Skutik sporty berotot dengan mesin 160 cc 4-katup eSP+ bertenaga 15.4 PS, rem cakram belakang & Smart Key',
  },
  {
    id: 'honda-scoopy',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Scoopy (Karbu / FI / Prestige Smart Key)',
    generation: 'Gen 1-5 (2010–2026)',
    startYear: 2010,
    endYear: 2026,
    engineCc: '110 cc eSP Retro Modern',
    categoryName: 'Skutik Retro Fashion',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#d97706',
    secondaryColor: '#fbbf24',
    bodyStyle: 'retro-scooter',
    description: 'Ikon skutik retro anak muda dengan velg 12 inci, ban tubeless donat, Smart Key System & lampu projector LED',
  },
  {
    id: 'honda-stylo-160',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Stylo 160 (CBS & ABS)',
    generation: 'Gen 1 (2024–2026)',
    startYear: 2024,
    endYear: 2026,
    engineCc: '160 cc 4-Katup eSP+ 15.4 PS',
    categoryName: 'Classy Fashion Skutik',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#831843',
    secondaryColor: '#f472b6',
    bodyStyle: 'retro-scooter',
    description: 'Skutik retro modern bertenaga mesin 160 cc 4-katup eSP+ terbesar di kelasnya dengan desain elegan Eropa',
  },
  {
    id: 'honda-pcx-150',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'PCX 150 (CBU Vietnam / Thailand & Lokal)',
    generation: 'Gen 1-3 (2010–2021)',
    startYear: 2010,
    endYear: 2021,
    engineCc: '150 cc PGM-FI Liquid Cooled',
    categoryName: 'Luxury Maxi Scooter',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e293b',
    secondaryColor: '#64748b',
    bodyStyle: 'maxi-scooter',
    description: 'Skutik premium elegan dengan riding posture santai, tangki bensin depan & Smart Key System',
  },
  {
    id: 'honda-pcx-160',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'All New PCX 160 (CBS & ABS / RoadSync)',
    generation: 'Gen 4 (2021–2026)',
    startYear: 2021,
    endYear: 2026,
    engineCc: '160 cc 4-Katup eSP+ 16 PS',
    categoryName: 'Luxury Flagship Maxi Scooter',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#0f172a',
    secondaryColor: '#f59e0b',
    bodyStyle: 'maxi-scooter',
    description: 'Maxi scooter mewah mesin 160 cc 4-katup eSP+, Honda Selectable Torque Control (HSTC) & bagasi 30 liter',
  },
  {
    id: 'honda-adv-160',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'ADV 150 & All New ADV 160 ABS',
    generation: 'Gen 1-2 (2019–2026)',
    startYear: 2019,
    endYear: 2026,
    engineCc: '160 cc 4-Katup eSP+ 16 PS',
    categoryName: 'Urban Adventure Skutik',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#9a3412',
    secondaryColor: '#ea580c',
    bodyStyle: 'maxi-scooter',
    description: 'Skutik adventure dengan suspensi subtank Showa, windshield adjustable, ban dual purpose & HSTC',
  },
  {
    id: 'honda-supra-x-125',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Supra X 125 (Karbu & Helm-in / PGM-FI)',
    generation: 'Gen 1-3 (2006–2026)',
    startYear: 2006,
    endYear: 2026,
    engineCc: '125 cc 4-Speed Rotary',
    categoryName: 'Bebek Rajanya Motor Indonesia',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#1e3a8a',
    secondaryColor: '#dc2626',
    bodyStyle: 'underbone',
    description: 'Rajanya motor bebek di Indonesia, mesin 125 cc sangat awet, tangguh di segala medan & irit bahan bakar',
  },
  {
    id: 'honda-sonic-150r',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'Sonic 150R (Special Edition)',
    generation: 'Gen 1 (2015–2024)',
    startYear: 2015,
    endYear: 2024,
    engineCc: '150 cc DOHC 4-Katup 6-Speed',
    categoryName: 'Hyperunderbone Ayam Jago',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#991b1b',
    secondaryColor: '#ef4444',
    bodyStyle: 'underbone',
    description: 'Motor ayam jago bertenaga mesin DOHC 150 cc 6-kecepatan dengan akselerasi tajam & stang jepit clip-on',
  },
  {
    id: 'honda-cb150r',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'CB150R Streetfire (Old & All New Special Edition)',
    generation: 'Gen 1-3 (2012–2026)',
    startYear: 2012,
    endYear: 2026,
    engineCc: '150 cc DOHC 6-Speed Liquid Cooled',
    categoryName: 'Street Naked Sport',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#b91c1c',
    secondaryColor: '#18181b',
    bodyStyle: 'sport-naked',
    description: 'Motor sport naked dengan rangka truss diamond frame, suspensi depan inverted USD Showa 37mm & DOHC 6-speed',
  },
  {
    id: 'honda-cbr150r',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'CBR150R (K45A / K45G / K45R Inverted Fork)',
    generation: 'Gen 1-4 (2014–2026)',
    startYear: 2014,
    endYear: 2026,
    engineCc: '150 cc DOHC 4-Katup Liquid Cooled',
    categoryName: 'Full Fairing Sport 150cc',
    fuelType: 'Bensin (Assist & Slipper Clutch)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#dc2626',
    secondaryColor: '#ffffff',
    bodyStyle: 'sport-fairing',
    description: 'Motor sport full fairing dengan suspensi USD emas, Assist/Slipper Clutch & desain turunan CBR250RR',
  },
  {
    id: 'honda-cbr250rr',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'CBR250RR (Standard & SP Quick Shifter)',
    generation: 'Gen 1-2 (2016–2026)',
    startYear: 2016,
    endYear: 2026,
    engineCc: '250 cc 2-Cylinder DOHC 8-Katup 42 PS',
    categoryName: 'Supersport 250cc Twin',
    fuelType: 'Bensin (Throttle-By-Wire)',
    defaultIntervalKm: 3000,
    defaultIntervalMonths: 4,
    accentColor: '#18181b',
    secondaryColor: '#dc2626',
    bodyStyle: 'sport-fairing',
    description: 'Motor 250cc 2-silinder bertenaga 42 PS dengan Throttle-by-Wire, 3 Riding Modes & Quick Shifter',
  },
  {
    id: 'honda-crf150l',
    type: 'MOTORCYCLE',
    brand: 'Honda',
    model: 'CRF150L (Extreme Black / Red)',
    generation: 'Gen 1 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '150 cc PGM-FI SOHC Air Cooled',
    categoryName: 'Trail Dual Purpose',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#dc2626',
    secondaryColor: '#f59e0b',
    bodyStyle: 'trail',
    description: 'Motor trail dual purpose dengan suspensi depan USD Showa terbesar di kelasnya & velg aluminium 21/18 inci',
  },

  // ==================== YAMAHA (MOTORCYCLES) ====================
  {
    id: 'yamaha-mio-karbu',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Mio Sporty & Mio Smile Karbu',
    generation: 'Gen 1 (2006–2012)',
    startYear: 2006,
    endYear: 2012,
    engineCc: '113 cc 5TL Karburator',
    categoryName: 'Skutik Legenda Otomatis',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#2563eb',
    secondaryColor: '#60a5fa',
    bodyStyle: 'skutik',
    description: 'Pelopor ledakan tren motor matik di Indonesia, mesin 5TL legendaris bertenaga responsif',
  },
  {
    id: 'yamaha-mio-m3',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Mio M3 125 & Mio Z (Blue Core)',
    generation: 'Gen 3 (2014–2026)',
    startYear: 2014,
    endYear: 2026,
    engineCc: '125 cc Blue Core SOHC',
    categoryName: 'Skutik Harian Kompak',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#1d4ed8',
    secondaryColor: '#f59e0b',
    bodyStyle: 'skutik',
    description: 'Skutik 125 cc berteknologi Blue Core dengan Eco Indicator, bagasi fungsional & bodi berdesain M-shape',
  },
  {
    id: 'yamaha-fazzio',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Fazzio Hybrid Connected (Neo & Lux)',
    generation: 'Gen 1 (2022–2026)',
    startYear: 2022,
    endYear: 2026,
    engineCc: '125 cc Blue Core Hybrid Connected',
    categoryName: 'Classy Skutik Neo Retro',
    fuelType: 'Hybrid (Electric Power Assist)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#059669',
    secondaryColor: '#34d399',
    bodyStyle: 'retro-scooter',
    description: 'Skutik neo-retro pertama dengan mesin Blue Core Hybrid (Electric Power Assist Start) & Y-Connect',
  },
  {
    id: 'yamaha-grand-filano',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Grand Filano Hybrid Connected',
    generation: 'Gen 1 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: '125 cc Blue Core Hybrid TFT',
    categoryName: 'Luxury Classy Skutik',
    fuelType: 'Hybrid (Electric Power Assist)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#475569',
    secondaryColor: '#94a3b8',
    bodyStyle: 'retro-scooter',
    description: 'Skutik fashion mewah bergaya Eropa dengan TFT Color Display, tangki bensin depan & bagasi 27 liter',
  },
  {
    id: 'yamaha-nmax-old',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'NMAX 155 Gen 1 (Non ABS & ABS)',
    generation: 'Gen 1 (2015–2019)',
    startYear: 2015,
    endYear: 2019,
    engineCc: '155 cc VVA Liquid Cooled 2DP',
    categoryName: 'Pelopor Maxi Scooter',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e3a8a',
    secondaryColor: '#3b82f6',
    bodyStyle: 'maxi-scooter',
    description: 'Pelopor revolusi Maxi Scooter di Indonesia dengan mesin 155 cc Variable Valve Actuation (VVA) & rem ABS ganda',
  },
  {
    id: 'yamaha-nmax-connected',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'All New NMAX 155 Connected / ABS',
    generation: 'Gen 2 (2020–2024)',
    startYear: 2020,
    endYear: 2024,
    engineCc: '155 cc VVA Blue Core SMG',
    categoryName: 'Maxi Scooter Terlaris',
    fuelType: 'Bensin (Smart Motor Generator)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#0f172a',
    secondaryColor: '#3b82f6',
    bodyStyle: 'maxi-scooter',
    description: 'Maxi scooter dengan Traction Control System (TCS), Smart Key, suspensi tabung belakang & konektivitas smartphone',
  },
  {
    id: 'yamaha-nmax-turbo',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'NMAX Turbo & NMAX Neo Tech MAX',
    generation: 'Gen 3 (2024–2026)',
    startYear: 2024,
    endYear: 2026,
    engineCc: '155 cc VVA Y-ECVT Turbo',
    categoryName: 'Flagship Turbo Maxi Scooter',
    fuelType: 'Bensin (Y-ECVT Electronic CVT)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e293b',
    secondaryColor: '#f59e0b',
    bodyStyle: 'maxi-scooter',
    description: 'Inovasi transmisi elektronik Y-ECVT dengan sensasi Turbo Riding Mode (T-Mode & S-Mode) & layar TFT navigasi Garmin',
  },
  {
    id: 'yamaha-aerox-155',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Aerox 155 & All New Aerox CyberCity',
    generation: 'Gen 1-2 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '155 cc VVA Blue Core Liquid Cooled',
    categoryName: 'Super Sport Maxi Scooter',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e40af',
    secondaryColor: '#06b6d4',
    bodyStyle: 'maxi-scooter',
    description: 'Skutik super sport dengan rasio tenaga-bobot (PWR) terbaik di kelasnya, ban lebar 140/70 & desain aerodinamis X-motif',
  },
  {
    id: 'yamaha-xmax-250',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'XMAX 250 & XMAX Connected Tech MAX',
    generation: 'Gen 1-2 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '250 cc Liquid Cooled 4-Katup 22.8 PS',
    categoryName: 'Flagship Luxury Maxi 250cc',
    fuelType: 'Bensin',
    defaultIntervalKm: 3000,
    defaultIntervalMonths: 4,
    accentColor: '#18181b',
    secondaryColor: '#f59e0b',
    bodyStyle: 'maxi-scooter',
    description: 'Maxi flagship 250 cc touring dengan layar TFT navigasi Garmin, Traction Control, windshield elektrik & bagasi 2 helm full-face',
  },
  {
    id: 'yamaha-jupiter-mx',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Jupiter MX 135 & MX King 150',
    generation: 'Gen 1-3 (2006–2026)',
    startYear: 2006,
    endYear: 2026,
    engineCc: '135 cc LC4V / 150 cc Liquid Cooled',
    categoryName: 'Bebek Super King of Underbone',
    fuelType: 'Bensin (5-Speed Manual Clutch)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1d4ed8',
    secondaryColor: '#dc2626',
    bodyStyle: 'underbone',
    description: 'Pelopor bebek super kencang berpendingin cairan dengan silinder DiASil, piston tempa (forged) & ban tapak lebar',
  },
  {
    id: 'yamaha-vixion',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'Vixion 3C1, New Vixion Lightning & Vixion R',
    generation: 'Gen 1-4 (2007–2026)',
    startYear: 2007,
    endYear: 2026,
    engineCc: '150 cc & 155 cc VVA SOHC 4-Valve DeltaBox',
    categoryName: 'Naked Sport Rajanya Motor Sport',
    fuelType: 'Bensin (6-Speed Assist & Slipper Clutch)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e3a8a',
    secondaryColor: '#38bdf8',
    bodyStyle: 'sport-naked',
    description: 'Pelopor motor sport injeksi di Indonesia dengan sasis DeltaBox legendaris, lengan ayun banana aluminium & mesin 155 VVA',
  },
  {
    id: 'yamaha-r15',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'YZF-R15 V2, V3 & R15M Connected V4',
    generation: 'Gen 1-4 (2014–2026)',
    startYear: 2014,
    endYear: 2026,
    engineCc: '155 cc VVA 19.3 PS Assist & Slipper',
    categoryName: 'Supersport 150cc R-DNA',
    fuelType: 'Bensin (Quick Shifter & Traction Control)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e40af',
    secondaryColor: '#60a5fa',
    bodyStyle: 'sport-fairing',
    description: 'Motor supersport turunan YZF-R1 dengan sasis DeltaBox, suspensi USD emas, Quick Shifter & Traction Control System',
  },
  {
    id: 'yamaha-xsr-155',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'XSR 155 (Heritage Sport)',
    generation: 'Gen 1 (2019–2026)',
    startYear: 2019,
    endYear: 2026,
    engineCc: '155 cc VVA 19.3 PS Born to be Free',
    categoryName: 'Heritage Modern Retro Sport',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#78350f',
    secondaryColor: '#d97706',
    bodyStyle: 'sport-naked',
    description: 'Motor sport retro modern dengan tangki drip-shaped, jok tuck & roll klasik, lampu bulat full LED & mesin 155 cc VVA',
  },
  {
    id: 'yamaha-wr-155r',
    type: 'MOTORCYCLE',
    brand: 'Yamaha',
    model: 'WR 155 R (Dual Purpose Adventure)',
    generation: 'Gen 1 (2019–2026)',
    startYear: 2019,
    endYear: 2026,
    engineCc: '155 cc VVA Liquid Cooled 16.7 PS',
    categoryName: 'Trail Dual Purpose Bertenaga',
    fuelType: 'Bensin (6-Speed)',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#1d4ed8',
    secondaryColor: '#f59e0b',
    bodyStyle: 'trail',
    description: 'Motor trail paling bertenaga di kelasnya dengan mesin 155 VVA berpendingin cairan, suspensi 41mm & tangki 8.1 liter',
  },

  // ==================== SUZUKI (MOTORCYCLES) ====================
  {
    id: 'suzuki-satria-f150',
    type: 'MOTORCYCLE',
    brand: 'Suzuki',
    model: 'Satria F150 (Karbu Barong & All New FI)',
    generation: 'Gen 1-3 (2006–2026)',
    startYear: 2006,
    endYear: 2026,
    engineCc: '150 cc DOHC 4-Valve Liquid Cooled 18.5 PS',
    categoryName: 'King of Hyperunderbone',
    fuelType: 'Bensin (6-Speed)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e40af',
    secondaryColor: '#e11d48',
    bodyStyle: 'underbone',
    description: 'Raja underbone di Indonesia bertenaga 18.5 PS dengan mesin DOHC 4-katup Overbore yang menjerit hingga 12.000 RPM',
  },
  {
    id: 'suzuki-gsx-r150',
    type: 'MOTORCYCLE',
    brand: 'Suzuki',
    model: 'GSX-R150 & GSX-S150 Keyless',
    generation: 'Gen 1 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '150 cc DOHC 4-Valve Water Cooled 19.2 PS',
    categoryName: 'Supersport 150cc High RPM',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#1e3a8a',
    secondaryColor: '#38bdf8',
    bodyStyle: 'sport-fairing',
    description: 'Motor sport teringan dan terkencang di kelasnya bertenaga 19.2 PS dengan Keyless Ignition System & speedometer full digital',
  },
  {
    id: 'suzuki-burgman-125',
    type: 'MOTORCYCLE',
    brand: 'Suzuki',
    model: 'Burgman Street 125 EX',
    generation: 'Gen 1 (2023–2026)',
    startYear: 2023,
    endYear: 2026,
    engineCc: '125 cc SEP Alpha Silent Starter',
    categoryName: 'Maxi Skutik Nyaman',
    fuelType: 'Bensin (EASS Engine Auto Stop-Start)',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#334155',
    secondaryColor: '#94a3b8',
    bodyStyle: 'maxi-scooter',
    description: 'Skutik perkotaan elegan dengan posisi pijakan kaki selonjoran ekstra lega, mesin SEP Alpha & konsumsi bensin hingga 56 km/l',
  },

  // ==================== KAWASAKI (MOTORCYCLES) ====================
  {
    id: 'kawasaki-ninja-150',
    type: 'MOTORCYCLE',
    brand: 'Kawasaki',
    model: 'Ninja 150 R & Ninja 150 RR 2-Tak',
    generation: 'Super KIPS (2006–2015)',
    startYear: 2006,
    endYear: 2015,
    engineCc: '150 cc 2-Tak Super KIPS 29 PS',
    categoryName: 'Legenda 2-Tak Super KIPS',
    fuelType: 'Bensin 2-Tak (Oli Samping)',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#15803d',
    secondaryColor: '#4ade80',
    bodyStyle: 'sport-fairing',
    description: 'Legenda sport 2-tak Indonesia bertenaga 29 PS dengan katup Super KIPS yang membuka jambakan tenaga di atas 7.000 RPM',
  },
  {
    id: 'kawasaki-ninja-250',
    type: 'MOTORCYCLE',
    brand: 'Kawasaki',
    model: 'Ninja 250 FI & Ninja ZX-25R 4-Silinder',
    generation: 'Gen 1-3 (2008–2026)',
    startYear: 2008,
    endYear: 2026,
    engineCc: '250 cc 2-Silinder / 4-Silinder In-Line 51 PS',
    categoryName: 'Ikon Sportbike 250cc',
    fuelType: 'Bensin',
    defaultIntervalKm: 3000,
    defaultIntervalMonths: 4,
    accentColor: '#166534',
    secondaryColor: '#22c55e',
    bodyStyle: 'sport-fairing',
    description: 'Ikon sportbike 250 cc paling prestisius di Indonesia termasuk mahakarya ZX-25R 4-silinder bersuara jeritan merdu 17.000 RPM',
  },
  {
    id: 'kawasaki-klx-150',
    type: 'MOTORCYCLE',
    brand: 'Kawasaki',
    model: 'KLX 150 S/L/BF & KLX 150 SE Facelift',
    generation: 'Gen 1-3 (2009–2026)',
    startYear: 2009,
    endYear: 2026,
    engineCc: '150 cc SOHC Karburator Keihin NCV24',
    categoryName: 'Pelopor Trail Indonesia',
    fuelType: 'Bensin',
    defaultIntervalKm: 2000,
    defaultIntervalMonths: 2,
    accentColor: '#15803d',
    secondaryColor: '#86efac',
    bodyStyle: 'trail',
    description: 'Pelopor motor trail petualang di Indonesia, sasis perimeter kokoh, suspensi upside-down & suku cadang modifikasi melimpah',
  },
  {
    id: 'kawasaki-w175',
    type: 'MOTORCYCLE',
    brand: 'Kawasaki',
    model: 'W175 (SE / Cafe / TR Tracker / Black Style)',
    generation: 'Gen 1 (2017–2026)',
    startYear: 2017,
    endYear: 2026,
    engineCc: '177 cc SOHC Karburator Mikuni VM24',
    categoryName: 'Authentic Retro Classic',
    fuelType: 'Bensin',
    defaultIntervalKm: 2500,
    defaultIntervalMonths: 3,
    accentColor: '#451a03',
    secondaryColor: '#b45309',
    bodyStyle: 'sport-naked',
    description: 'Motor retro autentik karburator dengan nuansa vintage murni tanpa panel digital, mudah dikustomisasi bergaya bratstyle/cafe racer',
  },

  // ==================== VESPA / PIAGGIO (MOTORCYCLES) ====================
  {
    id: 'vespa-sprint-150',
    type: 'MOTORCYCLE',
    brand: 'Vespa',
    model: 'Vespa Sprint 150 i-Get ABS & Sprint S',
    generation: 'Gen 1-2 (2014–2026)',
    startYear: 2014,
    endYear: 2026,
    engineCc: '150 cc i-Get 3-Valve ABS',
    categoryName: 'Sport Classy Skuter Italia',
    fuelType: 'Bensin',
    defaultIntervalKm: 3000,
    defaultIntervalMonths: 4,
    accentColor: '#b91c1c',
    secondaryColor: '#ef4444',
    bodyStyle: 'retro-scooter',
    description: 'Skuter sport ikonik Italia dengan lampu heksagonal khas, bodi baja monokok rigid, velg 12 inci & rem cakram ABS',
  },
  {
    id: 'vespa-primavera-150',
    type: 'MOTORCYCLE',
    brand: 'Vespa',
    model: 'Vespa Primavera 150 i-Get ABS & Color Vibe',
    generation: 'Gen 1-2 (2014–2026)',
    startYear: 2014,
    endYear: 2026,
    engineCc: '150 cc i-Get 3-Valve ABS',
    categoryName: 'Elegan Retro Skuter Italia',
    fuelType: 'Bensin',
    defaultIntervalKm: 3000,
    defaultIntervalMonths: 4,
    accentColor: '#047857',
    secondaryColor: '#10b981',
    bodyStyle: 'retro-scooter',
    description: 'Ikon abadi desain klasik Vespa dengan lampu bulat round headlamp, finishing chrome mewah & mesin i-Get halus getaran minim',
  },
  {
    id: 'vespa-gts-super',
    type: 'MOTORCYCLE',
    brand: 'Vespa',
    model: 'Vespa GTS Super Sport 150 & GTS 300 HPE',
    generation: 'Gen 1-2 (2014–2026)',
    startYear: 2014,
    endYear: 2026,
    engineCc: '150 cc 4-Katup i-Get / 300 cc HPE 23.8 PS',
    categoryName: 'Big Body Luxury Flagship Vespa',
    fuelType: 'Bensin (Traction Control ASR & Dual ABS)',
    defaultIntervalKm: 3000,
    defaultIntervalMonths: 4,
    accentColor: '#1e1b4b',
    secondaryColor: '#f59e0b',
    bodyStyle: 'retro-scooter',
    description: 'Vespa bodi besar (Big Body) dengan mesin 4-katup bertenaga, sistem kontrol traksi ASR, Keyless & radiator pendingin ganda',
  },
];

console.log(`🚀 Generating ${VEHICLES.length} Individual Vehicle Presets & Dedicated SVG Thumbnails...`);

function getSilhouetteSvg(bodyStyle, accentColor, secondaryColor) {
  switch (bodyStyle) {
    case 'suv':
      return `
      <!-- SUV Silhouette -->
      <path d="M 60 145 L 90 115 L 150 100 L 250 100 L 310 120 L 340 145 L 345 160 L 55 160 Z" fill="${accentColor}" opacity="0.85"/>
      <path d="M 100 115 L 148 105 L 148 140 L 85 140 Z" fill="#ffffff" opacity="0.3"/>
      <path d="M 156 105 L 245 105 L 245 140 L 156 140 Z" fill="#ffffff" opacity="0.3"/>
      <path d="M 253 107 L 295 122 L 295 140 L 253 140 Z" fill="#ffffff" opacity="0.2"/>
      <!-- Wheels & Arches -->
      <circle cx="110" cy="160" r="22" fill="#0f172a"/>
      <circle cx="110" cy="160" r="12" fill="#94a3b8"/>
      <circle cx="110" cy="160" r="6" fill="#f8fafc"/>
      <circle cx="290" cy="160" r="22" fill="#0f172a"/>
      <circle cx="290" cy="160" r="12" fill="#94a3b8"/>
      <circle cx="290" cy="160" r="6" fill="#f8fafc"/>
      <!-- Roof Rails -->
      <line x1="130" y1="94" x2="260" y2="94" stroke="${secondaryColor}" stroke-width="4" stroke-linecap="round"/>
      <!-- Lights -->
      <polygon points="55,147 75,145 70,154 55,152" fill="#fef08a" opacity="0.9"/>
      <polygon points="345,147 330,146 332,154 345,153" fill="#ef4444" opacity="0.9"/>
      `;

    case 'mpv':
      return `
      <!-- MPV Silhouette -->
      <path d="M 55 148 L 95 110 L 160 98 L 290 102 L 340 125 L 345 160 L 50 160 Z" fill="${accentColor}" opacity="0.85"/>
      <path d="M 105 112 L 158 103 L 158 138 L 88 138 Z" fill="#ffffff" opacity="0.3"/>
      <path d="M 166 103 L 235 104 L 235 138 L 166 138 Z" fill="#ffffff" opacity="0.3"/>
      <path d="M 243 105 L 305 112 L 315 138 L 243 138 Z" fill="#ffffff" opacity="0.25"/>
      <!-- Wheels & Arches -->
      <circle cx="105" cy="160" r="20" fill="#0f172a"/>
      <circle cx="105" cy="160" r="11" fill="#cbd5e1"/>
      <circle cx="105" cy="160" r="5" fill="#f8fafc"/>
      <circle cx="295" cy="160" r="20" fill="#0f172a"/>
      <circle cx="295" cy="160" r="11" fill="#cbd5e1"/>
      <circle cx="295" cy="160" r="5" fill="#f8fafc"/>
      <!-- Accent Line -->
      <path d="M 60 146 Q 200 140 340 148" fill="none" stroke="${secondaryColor}" stroke-width="3" opacity="0.8"/>
      <!-- Lights -->
      <polygon points="52,148 70,146 66,155 50,154" fill="#fef08a"/>
      <polygon points="345,142 335,140 337,152 345,150" fill="#ef4444"/>
      `;

    case 'hatchback':
      return `
      <!-- Hatchback Silhouette -->
      <path d="M 65 150 L 105 118 L 165 106 L 260 106 L 310 135 L 335 152 L 335 160 L 60 160 Z" fill="${accentColor}" opacity="0.85"/>
      <path d="M 112 119 L 165 110 L 165 140 L 95 140 Z" fill="#ffffff" opacity="0.35"/>
      <path d="M 173 110 L 250 110 L 275 140 L 173 140 Z" fill="#ffffff" opacity="0.3"/>
      <!-- Wheels -->
      <circle cx="108" cy="160" r="19" fill="#0f172a"/>
      <circle cx="108" cy="160" r="10" fill="#94a3b8"/>
      <circle cx="108" cy="160" r="4" fill="#f8fafc"/>
      <circle cx="288" cy="160" r="19" fill="#0f172a"/>
      <circle cx="288" cy="160" r="10" fill="#94a3b8"/>
      <circle cx="288" cy="160" r="4" fill="#f8fafc"/>
      <!-- Rear Spoiler -->
      <path d="M 255 102 L 275 98 L 270 106 Z" fill="${secondaryColor}"/>
      <!-- Lights -->
      <polygon points="62,150 78,148 74,156 60,155" fill="#fef08a"/>
      <polygon points="335,148 322,146 325,155 335,154" fill="#ef4444"/>
      `;

    case 'sedan':
      return `
      <!-- Sedan Silhouette -->
      <path d="M 50 152 L 95 145 L 135 112 L 245 112 L 295 142 L 345 148 L 350 160 L 45 160 Z" fill="${accentColor}" opacity="0.85"/>
      <path d="M 140 115 L 185 115 L 185 140 L 110 140 Z" fill="#ffffff" opacity="0.35"/>
      <path d="M 193 115 L 240 115 L 275 140 L 193 140 Z" fill="#ffffff" opacity="0.3"/>
      <!-- Wheels -->
      <circle cx="105" cy="160" r="19" fill="#0f172a"/>
      <circle cx="105" cy="160" r="11" fill="#e2e8f0"/>
      <circle cx="105" cy="160" r="5" fill="#0f172a"/>
      <circle cx="295" cy="160" r="19" fill="#0f172a"/>
      <circle cx="295" cy="160" r="11" fill="#e2e8f0"/>
      <circle cx="295" cy="160" r="5" fill="#0f172a"/>
      <!-- Dynamic Waistline -->
      <line x1="50" y1="147" x2="345" y2="147" stroke="${secondaryColor}" stroke-width="2.5" opacity="0.8"/>
      <!-- Lights -->
      <polygon points="48,152 68,148 64,156 46,155" fill="#fef08a"/>
      <polygon points="350,148 335,146 338,155 350,154" fill="#ef4444"/>
      `;

    case 'ev':
      return `
      <!-- EV Silhouette -->
      <path d="M 60 150 L 100 112 L 170 100 L 265 100 L 320 130 L 340 152 L 340 160 L 55 160 Z" fill="${accentColor}" opacity="0.85"/>
      <path d="M 108 114 L 170 105 L 170 138 L 92 138 Z" fill="#ffffff" opacity="0.4"/>
      <path d="M 178 105 L 260 105 L 290 138 L 178 138 Z" fill="#ffffff" opacity="0.35"/>
      <!-- Wheels (Aero Disk EV) -->
      <circle cx="108" cy="160" r="20" fill="#0f172a"/>
      <circle cx="108" cy="160" r="14" fill="#38bdf8" opacity="0.8"/>
      <circle cx="108" cy="160" r="6" fill="#f8fafc"/>
      <circle cx="288" cy="160" r="20" fill="#0f172a"/>
      <circle cx="288" cy="160" r="14" fill="#38bdf8" opacity="0.8"/>
      <circle cx="288" cy="160" r="6" fill="#f8fafc"/>
      <!-- EV Lightbar & Lightning Icon -->
      <line x1="55" y1="148" x2="340" y2="148" stroke="#38bdf8" stroke-width="3" stroke-dasharray="8 3"/>
      <path d="M 195 72 L 205 72 L 198 84 L 208 84 L 192 100 L 197 88 L 188 88 Z" fill="#38bdf8"/>
      `;

    case 'maxi-scooter':
      return `
      <!-- Maxi Scooter Silhouette -->
      <path d="M 90 160 L 130 110 L 170 125 L 220 115 L 270 120 L 310 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- Windshield -->
      <path d="M 115 110 L 125 78 L 145 85 L 135 115 Z" fill="#ffffff" opacity="0.45"/>
      <!-- Seat & Footrest -->
      <path d="M 170 122 Q 220 108 265 120 L 260 136 L 175 136 Z" fill="#1e293b"/>
      <!-- Wheels -->
      <circle cx="95" cy="160" r="22" fill="#0f172a"/>
      <circle cx="95" cy="160" r="12" fill="#cbd5e1"/>
      <circle cx="95" cy="160" r="5" fill="#0f172a"/>
      <circle cx="295" cy="160" r="22" fill="#0f172a"/>
      <circle cx="295" cy="160" r="12" fill="#cbd5e1"/>
      <circle cx="295" cy="160" r="5" fill="#0f172a"/>
      <!-- Headlight LED -->
      <polygon points="105,120 125,125 118,135 100,130" fill="#fef08a"/>
      `;

    case 'skutik':
      return `
      <!-- Skutik Compact Silhouette -->
      <path d="M 100 160 L 135 118 L 175 135 L 225 125 L 275 138 L 295 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- Handlebar & Headlamp -->
      <circle cx="140" cy="112" r="8" fill="${secondaryColor}"/>
      <path d="M 180 130 Q 230 118 270 135 L 265 145 L 185 145 Z" fill="#0f172a"/>
      <!-- Wheels -->
      <circle cx="102" cy="160" r="19" fill="#0f172a"/>
      <circle cx="102" cy="160" r="10" fill="#94a3b8"/>
      <circle cx="102" cy="160" r="4" fill="#f8fafc"/>
      <circle cx="285" cy="160" r="19" fill="#0f172a"/>
      <circle cx="285" cy="160" r="10" fill="#94a3b8"/>
      <circle cx="285" cy="160" r="4" fill="#f8fafc"/>
      <!-- Light -->
      <polygon points="120,122 135,126 130,135 115,130" fill="#fef08a"/>
      `;

    case 'retro-scooter':
      return `
      <!-- Retro Scooter (Vespa / Scoopy / Fazzio) Silhouette -->
      <path d="M 95 160 L 130 120 L 165 140 L 230 128 L 275 142 L 295 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- Round Retro Headlight -->
      <circle cx="138" cy="104" r="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="138" cy="104" r="6" fill="#fef08a"/>
      <!-- Retro Curved Side Pods -->
      <ellipse cx="245" cy="142" rx="30" ry="16" fill="${accentColor}" stroke="${secondaryColor}" stroke-width="2"/>
      <!-- Brown Retro Saddle Seat -->
      <path d="M 175 132 Q 220 122 260 132 L 255 142 L 180 142 Z" fill="#78350f"/>
      <!-- Wheels (White-wall Retro) -->
      <circle cx="100" cy="160" r="19" fill="#0f172a"/>
      <circle cx="100" cy="160" r="14" fill="#f8fafc"/>
      <circle cx="100" cy="160" r="8" fill="#94a3b8"/>
      <circle cx="285" cy="160" r="19" fill="#0f172a"/>
      <circle cx="285" cy="160" r="14" fill="#f8fafc"/>
      <circle cx="285" cy="160" r="8" fill="#94a3b8"/>
      `;

    case 'underbone':
      return `
      <!-- Bebek Underbone / Hyperunderbone Silhouette -->
      <path d="M 90 160 L 125 125 L 165 142 L 230 125 L 285 132 L 305 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- Handlebar -->
      <line x1="125" y1="125" x2="135" y2="108" stroke="#334155" stroke-width="4"/>
      <!-- Slim Sport Seat -->
      <path d="M 170 136 L 275 126 L 270 138 L 175 145 Z" fill="#0f172a"/>
      <!-- Spokes Wheels & Chain -->
      <circle cx="95" cy="160" r="22" fill="#0f172a"/>
      <circle cx="95" cy="160" r="14" fill="#cbd5e1" stroke="#0f172a" stroke-dasharray="3 3"/>
      <circle cx="95" cy="160" r="5" fill="#f8fafc"/>
      <circle cx="295" cy="160" r="22" fill="#0f172a"/>
      <circle cx="295" cy="160" r="14" fill="#cbd5e1" stroke="#0f172a" stroke-dasharray="3 3"/>
      <circle cx="295" cy="160" r="5" fill="#f8fafc"/>
      <!-- Exhaust Muffler -->
      <polygon points="210,162 285,152 285,158 210,166" fill="#94a3b8"/>
      `;

    case 'sport-naked':
      return `
      <!-- Sport Naked Silhouette -->
      <path d="M 90 160 L 130 120 L 175 110 L 235 122 L 285 115 L 305 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- Exposed Trellis / DeltaBox Frame -->
      <polygon points="150,125 195,120 185,148 140,145" fill="none" stroke="${secondaryColor}" stroke-width="3.5"/>
      <!-- Muscle Tank & Shrouds -->
      <path d="M 140 120 Q 170 102 205 118 L 195 135 L 145 135 Z" fill="${accentColor}"/>
      <!-- Upside Down Forks -->
      <line x1="125" y1="115" x2="95" y2="160" stroke="#fbbf24" stroke-width="5"/>
      <!-- Wheels & Discs -->
      <circle cx="95" cy="160" r="22" fill="#0f172a"/>
      <circle cx="95" cy="160" r="12" fill="#cbd5e1"/>
      <circle cx="95" cy="160" r="5" fill="#ef4444"/>
      <circle cx="295" cy="160" r="22" fill="#0f172a"/>
      <circle cx="295" cy="160" r="12" fill="#cbd5e1"/>
      <circle cx="295" cy="160" r="5" fill="#ef4444"/>
      `;

    case 'sport-fairing':
      return `
      <!-- Sport Full Fairing Silhouette -->
      <path d="M 85 160 L 110 115 L 170 98 L 235 115 L 290 105 L 310 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- Aerodynamic Full Cowling -->
      <polygon points="110,115 155,108 175,148 115,152" fill="${secondaryColor}" opacity="0.9"/>
      <!-- Smoked Windscreen -->
      <path d="M 120 108 L 140 82 L 160 92 L 145 112 Z" fill="#0f172a" opacity="0.6"/>
      <!-- High Racy Tail & Split Seat -->
      <polygon points="235,115 285,102 280,115 240,125" fill="#0f172a"/>
      <!-- Upside Down Gold Front Fork -->
      <line x1="130" y1="108" x2="95" y2="160" stroke="#f59e0b" stroke-width="4.5"/>
      <!-- Wheels & Wave Discs -->
      <circle cx="95" cy="160" r="22" fill="#0f172a"/>
      <circle cx="95" cy="160" r="12" fill="#cbd5e1"/>
      <circle cx="95" cy="160" r="5" fill="#dc2626"/>
      <circle cx="295" cy="160" r="22" fill="#0f172a"/>
      <circle cx="295" cy="160" r="12" fill="#cbd5e1"/>
      <circle cx="295" cy="160" r="5" fill="#dc2626"/>
      `;

    case 'trail':
      return `
      <!-- Trail / Dual Purpose Silhouette -->
      <path d="M 85 160 L 130 112 L 180 115 L 245 125 L 290 120 L 305 160 Z" fill="${accentColor}" opacity="0.85"/>
      <!-- High Trail Front Fender -->
      <polygon points="90,118 135,112 130,122 80,125" fill="${secondaryColor}"/>
      <!-- Long Inverted Fork -->
      <line x1="125" y1="110" x2="90" y2="160" stroke="#fbbf24" stroke-width="4"/>
      <!-- Flat Enduro Seat -->
      <path d="M 150 116 L 265 116 L 260 125 L 155 125 Z" fill="#0f172a"/>
      <!-- Spoke Offroad Knobby Wheels -->
      <circle cx="90" cy="160" r="24" fill="#0f172a"/>
      <circle cx="90" cy="160" r="16" fill="#cbd5e1" stroke="#0f172a" stroke-dasharray="4 2"/>
      <circle cx="90" cy="160" r="5" fill="#f8fafc"/>
      <circle cx="295" cy="160" r="21" fill="#0f172a"/>
      <circle cx="295" cy="160" r="14" fill="#cbd5e1" stroke="#0f172a" stroke-dasharray="4 2"/>
      <circle cx="295" cy="160" r="5" fill="#f8fafc"/>
      `;

    default:
      return `
      <rect x="70" y="110" width="260" height="50" rx="10" fill="${accentColor}"/>
      <circle cx="110" cy="160" r="20" fill="#0f172a"/>
      <circle cx="290" cy="160" r="20" fill="#0f172a"/>
      `;
  }
}

function generateSvgContent(v) {
  const isCar = v.type === 'CAR';
  const typeLabel = isCar ? 'MOBIL' : 'MOTOR';
  const typeBadgeBg = isCar ? '#2563eb' : '#d97706';
  const silhouette = getSilhouetteSvg(v.bodyStyle, v.accentColor, v.secondaryColor);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad_${v.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="accentGrad_${v.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${v.accentColor}"/>
      <stop offset="100%" stop-color="${v.secondaryColor}"/>
    </linearGradient>
    <linearGradient id="cardGrad_${v.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <!-- Card Background -->
  <rect width="400" height="260" rx="20" fill="url(#bgGrad_${v.id})"/>
  
  <!-- Subtle Grid Lines -->
  <line x1="0" y1="65" x2="400" y2="65" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
  <line x1="0" y1="185" x2="400" y2="185" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
  
  <!-- Ground Reflection Line -->
  <line x1="30" y1="182" x2="370" y2="182" stroke="url(#accentGrad_${v.id})" stroke-width="2" opacity="0.6"/>
  <ellipse cx="200" cy="184" rx="160" ry="12" fill="${v.accentColor}" opacity="0.15"/>

  <!-- Vehicle Silhouette Vector Graphic -->
  <g transform="translate(0, 5)">
    ${silhouette}
  </g>

  <!-- Top Header Pill Badges -->
  <g transform="translate(20, 20)">
    <!-- Type Pill -->
    <rect x="0" y="0" width="56" height="22" rx="6" fill="${typeBadgeBg}"/>
    <text x="28" y="15" fill="#ffffff" font-size="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" text-anchor="middle" letter-spacing="0.5">${typeLabel}</text>

    <!-- Brand Name -->
    <text x="66" y="16" fill="#f8fafc" font-size="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" letter-spacing="0.5">${v.brand.toUpperCase()}</text>
  </g>

  <!-- Year Range Badge Top Right -->
  <g transform="translate(260, 20)">
    <rect x="0" y="0" width="120" height="22" rx="6" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1"/>
    <text x="60" y="15" fill="#e2e8f0" font-size="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" text-anchor="middle">📅 ${v.startYear} – ${v.endYear}</text>
  </g>

  <!-- Bottom Details Container -->
  <rect x="14" y="194" width="372" height="54" rx="12" fill="url(#cardGrad_${v.id})" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>

  <!-- Model Title -->
  <text x="28" y="215" fill="#ffffff" font-size="12.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800">${v.model.length > 36 ? v.model.substring(0, 34) + '...' : v.model}</text>
  
  <!-- Subtitle / CC & Category -->
  <text x="28" y="235" fill="#94a3b8" font-size="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="600">⚡ ${v.engineCc} • ${v.categoryName}</text>

  <!-- Servisin Guarantee Stamp Icon -->
  <g transform="translate(348, 208)">
    <circle cx="12" cy="12" r="12" fill="url(#accentGrad_${v.id})"/>
    <path d="M 8 12 L 11 15 L 17 9" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
}

// 1. Generate SVG Files in client/public/presets/vehicles/
const outputSvgDir = path.join(__dirname, '../client/public/presets/vehicles');
fs.mkdirSync(outputSvgDir, { recursive: true });

// Also copy to client/dist/presets/vehicles for production build if dist exists
const distSvgDir = path.join(__dirname, '../client/dist/presets/vehicles');
fs.mkdirSync(distSvgDir, { recursive: true });

let fileCount = 0;
VEHICLES.forEach((v) => {
  const filename = `${v.id}.svg`;
  v.thumbnailUrl = `/presets/vehicles/${filename}`;
  const svgContent = generateSvgContent(v);
  
  const publicFilePath = path.join(outputSvgDir, filename);
  fs.writeFileSync(publicFilePath, svgContent, 'utf8');

  const distFilePath = path.join(distSvgDir, filename);
  fs.writeFileSync(distFilePath, svgContent, 'utf8');
  fileCount++;
});

console.log(`✅ Generated ${fileCount} unique, non-shared SVG thumbnails in /client/public/presets/vehicles/`);

// 2. Generate TypeScript file client/src/data/popularVehicles.ts
const tsContent = `import { VehicleType } from '../types';

export interface PopularVehiclePreset {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
  generation: string;
  startYear: number;
  endYear: number;
  engineCc: string;
  categoryName: string;
  fuelType: string;
  defaultIntervalKm: number;
  defaultIntervalMonths: number;
  thumbnailUrl: string;
  description: string;
}

export const POPULAR_BRANDS = [
  'Semua Merk',
  'Toyota',
  'Honda',
  'Yamaha',
  'Suzuki',
  'Mitsubishi',
  'Daihatsu',
  'Kawasaki',
  'Vespa',
  'Hyundai',
  'Wuling',
  'Mazda',
  'Nissan',
] as const;

export const POPULAR_VEHICLES: PopularVehiclePreset[] = ${JSON.stringify(
  VEHICLES.map(({ accentColor, secondaryColor, bodyStyle, ...rest }) => rest),
  null,
  2
)};

export const filterVehicles = (
  type?: VehicleType | 'ALL',
  brand?: string,
  year?: number | string,
  search?: string
): PopularVehiclePreset[] => {
  return POPULAR_VEHICLES.filter((item) => {
    // 1. Type filter
    if (type && type !== 'ALL' && item.type !== type) return false;

    // 2. Brand filter
    if (brand && brand !== 'Semua Merk' && item.brand.toLowerCase() !== brand.toLowerCase()) return false;

    // 3. Year filter (if specified, vehicle must be active in that year)
    if (year && year !== 'ALL') {
      const yr = Number(year);
      if (!isNaN(yr)) {
        if (yr < item.startYear || yr > item.endYear) return false;
      }
    }

    // 4. Search query
    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchModel = item.model.toLowerCase().includes(q);
      const matchCategory = item.categoryName.toLowerCase().includes(q);
      const matchCc = item.engineCc.toLowerCase().includes(q);
      const matchGen = item.generation.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchBrand && !matchModel && !matchCategory && !matchCc && !matchGen && !matchDesc) {
        return false;
      }
    }

    return true;
  });
};
`;

const tsFilePath = path.join(__dirname, '../client/src/data/popularVehicles.ts');
fs.writeFileSync(tsFilePath, tsContent, 'utf8');

console.log(`✅ Successfully written comprehensive vehicle database to ${tsFilePath}`);
console.log(`🎉 Total Presets: ${VEHICLES.length} (From 2006 to 2026, 100% individual non-sharing thumbnails)`);