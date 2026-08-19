<p align="center">
  <img src="https://raw.githubusercontent.com/RivaldiDev/Servisin/main/client/public/logo.png" width="160" alt="FixGarasi Logo" />
</p>

<h1 align="center">FixGarasi</h1>

<p align="center">
  <strong>Modern SaaS Vehicle Maintenance & Digital Garage Management System</strong><br>
  <em>Mobile-First &middot; Android WebView Ready &middot; Smart Odometer Reminders &middot; 100% Type-Safe</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-6.4-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Database-Neon_PostgreSQL-00e599?style=flat-square&logo=postgresql" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="MIT License" />
</p>

---

## Tentang FixGarasi

**FixGarasi** adalah platform SaaS manajemen perawatan kendaraan dan buku servis digital yang dirancang khusus untuk pemilik mobil dan motor di Indonesia. Platform ini memudahkan pengguna dalam mencatat riwayat servis, mengelola anggaran biaya perawatan, menyimpan bukti foto kuitansi/nota bengkel secara terenkripsi, serta memantau jadwal penggantian oli dan suku cadang otomatis berbasis kilometer odometer maupun waktu.

Dibangun dengan arsitektur **Mobile-First Responsive Web** yang dioptimalkan untuk performa tinggi, aplikasi ini dapat diakses langsung melalui browser maupun di-embed ke dalam **Android WebView Native** dengan standar aplikasi native.

---

## Fitur Utama

### 1. Garasi Digital Multi-Kendaraan (Mobil & Motor)
- **Katalog 106+ Model Kendaraan Lokal**: Mendukung preset foto studio latar putih resolusi tinggi untuk seluruh kendaraan populer di Indonesia (Toyota, Honda, Daihatsu, Mitsubishi, Suzuki, Hyundai, Wuling, Yamaha, Kawasaki, Vespa, dll).
- **Quick Odometer Update**: Tambah jarak tempuh harian/mingguan dengan tombol instan (`+50`, `+100`, `+500`, `+1.000` km).
- **Manajemen Dokumen**: Simpan detail plat nomor, tahun perakitan, kapasitas mesin (CC), dan nomor rangka/mesin secara terstruktur.

### 2. Pencatatan Servis & Rincian Biaya (Service Logs)
- **12 Kategori Perawatan Terstandarisasi**: Oli Mesin, Oli Transmisi/Gardan, Sistem Rem, Ban & Velg, Tune Up, Aki/Kelistrikan, Busi, Kaki-kaki/Suspensi, Filter Udara/AC, Radiator/Coolant, Pemeriksaan Rutin, dan Lain-lain.
- **Dukungan Multi-Item Suku Cadang & Jasa**: Hitung total biaya servis otomatis per komponen.
- **Upload Nota / Kwitansi Bengkel**: Simpan arsip foto kuitansi bengkel lengkap dengan fitur *fullscreen preview* & zoom.

### 3. Smart Maintenance Reminders (Pengingat Servis Otomatis)
- **Kalkulasi Otomatis**: Prediksi jatuh tempo servis berbasis jarak tempuh (KM) atau interval waktu (Bulan).
- **Status Indikator**:
  - **Overdue**: Melewati batas kilometer atau tanggal target.
  - **Due Soon**: Sisa < 500 km atau < 14 hari sebelum jatuh tempo.
  - **Active**: Interval dalam batas aman.
- **One-Click Cycle Reset**: Tombol "Selesaikan Servis" untuk memperbarui siklus interval berikutnya secara instan.

### 4. Analitik & Laporan Pengeluaran Keuangan
- Total pengeluaran servis terakumulasi & rata-rata biaya perawatan.
- Grafik batang tren pengeluaran bulanan (12 bulan terakhir).
- Diagram distribusi pengeluaran per kategori komponen.
- Komparasi total biaya perawatan antar kendaraan di garasi.

### 5. Model SaaS Freemium & Integrasi Midtrans
- **Tier Free**: Kelola hingga 2 unit kendaraan dengan fitur pencatatan esensial.
- **Tier Pro**: Garasi tanpa batas (*Unlimited Vehicles*), kapasitas penyimpanan bukti servis tanpa batas, dan laporan analitik menyeluruh.
- **Integrasi Pembayaran Indonesia**: Siap dihubungkan ke gerbang pembayaran **Midtrans** (QRIS, Virtual Account Multi-Bank, & E-Wallet).

---

## Arsitektur & Tech Stack

```
FixGarasi/
├── client/                     # Frontend Vite + React 19 SPA
│   ├── src/
│   │   ├── components/         # Reusable UI & Modal Components
│   │   ├── context/            # AuthContext & Session Store
│   │   ├── data/               # 106+ Vehicle Catalog Presets
│   │   ├── pages/              # Garage, Vehicle Detail, Services, Reminders, Analytics, Profile
│   │   ├── services/           # Axios API Client with JWT Interceptors
│   │   └── types/              # Strict TypeScript Definitions & Satisfies Contracts
│   └── vercel.json             # Vercel SPA Routing Configuration
│
├── server/                     # Backend Node.js + Express REST API
│   ├── prisma/                 # Database Schema (SQLite Dev & Neon PostgreSQL Prod)
│   ├── src/
│   │   ├── controllers/        # Auth, Vehicle, ServiceLog, Reminder, Analytics, Payment
│   │   ├── middlewares/        # JWT Auth, Multer Upload Whitelist, Helmet, Rate Limiters
│   │   └── routes/             # RESTful API Endpoints
│   └── uploads/                # User Upload Directory
│
├── ANDROID_WEBVIEW_GUIDE.md    # Panduan Implementasi Android Studio (Kotlin)
├── oxlint.config.ts            # Oxlint Security & Type Safety Configuration
└── vercel.json                 # Root Vercel Monorepo Deployment Config
```

| Komponen | Teknologi |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite 6 |
| **Styling & Icons** | Tailwind CSS v3.4 + Iconoir Icons (100% Native SVG Stroke) |
| **Backend Framework** | Node.js + Express.js + TypeScript |
| **Database & ORM** | Prisma ORM (SQLite Lokal Dev / Neon Serverless PostgreSQL Prod) |
| **Security & Auditing** | Helmet, Express Rate Limit (Auth & API), Strict File Whitelist, JWT |
| **Code Quality & Linting** | Oxlint + Anti-Slop Rules + Ponytail Minimalist Guidelines |

---

## Panduan Instalasi & Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/RivaldiDev/Servisin.git FixGarasi
cd FixGarasi
```

### 2. Instalasi Dependensi
```bash
# Instalasi root dependencies
npm install

# Instalasi client & server dependencies
npm --prefix client install
npm --prefix server install
```

### 3. Konfigurasi Environment Variables
Salin contoh konfigurasi ke dalam `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
DATABASE_URL="file:./dev.db"
CLIENT_URL=http://localhost:5173
```

### 4. Setup Database & Data Awal (Seed)
```bash
cd server
npx prisma db push
npm run seed
cd ..
```

### 5. Menjalankan Server Lokal
```bash
npm run dev
```
Akses aplikasi melalui browser:
- **Frontend Web App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api/health`

**Akun Demo:**
- **Email:** `demo@fixgarasi.id`
- **Password:** `password123`

---

## Setup Neon Serverless PostgreSQL (Production)

1. Buat database baru di **[Neon.tech](https://neon.tech)** (pilih region Singapore / AWS `ap-southeast-1`).
2. Masukkan connection string ke dalam `.env` server atau konfigurasi environment hosting:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[endpoint].ap-southeast-1.aws.neon.tech/fixgarasi_db?sslmode=require"
   ```
3. Sinkronisasikan skema Prisma ke Neon PostgreSQL:
   ```bash
   npm run prisma:push:neon
   ```

---

## Panduan Deploy ke Vercel

Proyek ini telah dikonfigurasi dengan file `vercel.json` dan `client/vercel.json` sehingga siap di-deploy langsung ke Vercel.

1. **Import Repositori di Dashboard Vercel**:
   - Hubungkan akun GitHub Anda dan pilih repositori `RivaldiDev/Servisin`.
2. **Pengaturan Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables di Vercel**:
   - `VITE_API_URL`: URL backend API produksi Anda (misal: `https://api.fixgarasi.id`).
4. Klik **Deploy**.

---

## Panduan Android WebView Native

Untuk membungkus FixGarasi ke dalam aplikasi Android APK/AAB, silakan baca panduan lengkap konfigurasi Android Studio (Kotlin), penanganan permission kamera/file upload, dan pull-to-refresh di [ANDROID_WEBVIEW_GUIDE.md](./ANDROID_WEBVIEW_GUIDE.md).

---

## Keamanan & Kualitas Kode

- **Anti-Brute Force**: Pembatasan *rate limiting* ketat pada rute otentikasi login/register.
- **Perlindungan Stored XSS**: Whitelist ketat MIME type upload file (`.jpg`, `.jpeg`, `.png`, `.webp`) dan penolakan otomatis format SVG berisiko.
- **Tenant Isolation**: Setiap query Prisma diisolasi berdasarkan `userId` token JWT terotentikasi.
- **Linting & Validasi**:
  ```bash
  npm run lint   # Menjalankan Oxlint
  ```

---

## Informasi Legal & Layanan

- **Ketentuan Layanan & Kebijakan Privasi**: Tersedia di dalam aplikasi melalui modal *Informasi Legal & Layanan* atau halaman profil.
- **Mitra Pembayaran**: Mendukung pembayaran aman via gerbang pembayaran berlisensi Bank Indonesia (Midtrans).
- **Layanan Pelanggan**: `support@fixgarasi.id`

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).

Dibuat oleh [Rivaldi](https://github.com/RivaldiDev) &middot; **FixGarasi Indonesia**
