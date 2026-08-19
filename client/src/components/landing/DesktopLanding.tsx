import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Motorcycle,
  BellNotification,
  DashboardSpeed,
  Page,
  StatsUpSquare,
  ShieldCheck,
  CheckCircle,
  Sparks,
  CreditCard,
  ArrowRight,
  Calculator,
  Eye,
  Refresh,
  Lock
} from 'iconoir-react';
import { useAuth } from '../../context/AuthContext';

interface DesktopLandingProps {
  onOpenLegal: (tab: 'terms' | 'privacy' | 'refund' | 'contact') => void;
}

export const DesktopLanding: React.FC<DesktopLandingProps> = ({ onOpenLegal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  // Calculator State
  const [vehicleType, setVehicleType] = useState<'CAR' | 'MOTORCYCLE'>('CAR');
  const [monthlyKm, setMonthlyKm] = useState<number>(1200);
  const [vehicleAge, setVehicleAge] = useState<number>(3);

  // Vehicle Brand Catalog Filter
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('ALL');

  // Interactive Live Preview State
  const [previewOdo, setPreviewOdo] = useState<number>(24500);

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const res = await login({ email: 'demo@fixgarasi.id', password: 'password123' });
      if (res.success) {
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch {
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  // Calculator estimations with tabular arithmetic
  const estimatedYearlyOilCost = vehicleType === 'CAR' ? Math.round((monthlyKm * 12 / 5000) * 450000) : Math.round((monthlyKm * 12 / 2500) * 85000);
  const estimatedRoutineTotal = vehicleType === 'CAR' ? Math.round(estimatedYearlyOilCost * 2.2 + (vehicleAge * 150000)) : Math.round(estimatedYearlyOilCost * 2.0 + (vehicleAge * 50000));
  const estimatedMajorBreakdownPrevented = vehicleType === 'CAR' ? 12500000 : 3500000;

  const brands = [
    { id: 'ALL', name: 'Semua Brand' },
    { id: 'Toyota', name: 'Toyota' },
    { id: 'Honda', name: 'Honda' },
    { id: 'Daihatsu', name: 'Daihatsu' },
    { id: 'Mitsubishi', name: 'Mitsubishi' },
    { id: 'Yamaha', name: 'Yamaha' },
    { id: 'Vespa', name: 'Vespa' },
  ];

  const showcaseVehicles = [
    { brand: 'Toyota', model: 'Innova Zenix 2.0 V CVT', type: 'CAR', year: 2023, odo: '18.400 km', status: 'Optimal' },
    { brand: 'Honda', model: 'HR-V 1.5 SE', type: 'CAR', year: 2022, odo: '24.500 km', status: 'Oli Mesin Jatuh Tempo' },
    { brand: 'Mitsubishi', model: 'Xpander Ultimate CVT', type: 'CAR', year: 2023, odo: '15.200 km', status: 'Optimal' },
    { brand: 'Toyota', model: 'Fortuner 2.8 VRZ 4x2', type: 'CAR', year: 2022, odo: '32.100 km', status: 'Optimal' },
    { brand: 'Yamaha', model: 'NMAX 155 Connected', type: 'MOTORCYCLE', year: 2023, odo: '12.800 km', status: 'Ganti V-Belt' },
    { brand: 'Honda', model: 'Vario 160 CBS', type: 'MOTORCYCLE', year: 2022, odo: '19.400 km', status: 'Optimal' },
    { brand: 'Vespa', model: 'Sprint S 150 i-Get ABS', type: 'MOTORCYCLE', year: 2023, odo: '7.600 km', status: 'Optimal' },
    { brand: 'Daihatsu', model: 'Rocky 1.0 R TC ADS', type: 'CAR', year: 2022, odo: '21.000 km', status: 'Optimal' },
  ].filter(v => activeBrandFilter === 'ALL' || v.brand === activeBrandFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-500 selection:text-white flex flex-col antialiased">
      {/* 1. Desktop Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-[background-color,border-color] duration-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group active:scale-[0.98] transition-transform duration-150 ease-out">
            <img
              src="/logo.webp"
              alt="FixGarasi Logo"
              className="w-11 h-11 rounded-2xl object-contain shadow-xs border border-slate-100 bg-white group-hover:scale-105 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                FIX<span className="text-brand-600">GARASI</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                Digital Garage &amp; Maintenance
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#fitur" className="hover:text-brand-600 transition-colors duration-150">Fitur Unggulan</a>
            <a href="#kalkulator" className="hover:text-brand-600 transition-colors duration-150">Kalkulator Servis</a>
            <a href="#katalog" className="hover:text-brand-600 transition-colors duration-150">106+ Model Kendaraan</a>
            <a href="#harga" className="hover:text-brand-600 transition-colors duration-150">Paket &amp; Harga</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors duration-150">FAQ</a>
          </nav>

          {/* Right Action CTAs with Emil Kowalski Active State Polish */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-500 bg-white hover:bg-brand-50/50 text-slate-700 hover:text-brand-700 active:scale-[0.97] text-xs font-extrabold transition-[transform,background-color,border-color,color] duration-150 ease-out shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4 text-brand-600" />
              <span>{demoLoading ? 'Menyiapkan...' : 'Coba Demo 1-Klik'}</span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-brand-600 active:scale-[0.97] transition-[transform,color] duration-150 ease-out"
            >
              Masuk
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-[0.97] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_-2px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_20px_-4px_rgba(37,99,235,0.45)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Wide 2-Column Desktop Grid) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200/80 px-3.5 py-1.5 rounded-full text-brand-700 text-xs font-extrabold shadow-xs">
              <Sparks className="w-4 h-4 text-amber-500" />
              <span>Platform SaaS Manajemen Kendaraan #1 di Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Buku Servis Digital &amp; <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800">
                Pengingat Perawatan Cerdas
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Catat riwayat perawatan mobil &amp; motor, arsipkan nota kuitansi bengkel secara aman terenkripsi, dan dapatkan pengingat servis otomatis berbasis jarak tempuh odometer maupun waktu.
            </p>

            {/* Action Buttons with Tactile Press Feedback */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.97] text-white text-sm font-extrabold rounded-2xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.35),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(37,99,235,0.45)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <span>Daftar Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleDemoLogin}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-100 active:scale-[0.97] text-slate-800 text-sm font-bold rounded-2xl border border-slate-200/90 shadow-xs hover:border-brand-300 transition-[transform,background-color,border-color] duration-150 ease-out cursor-pointer"
              >
                <Eye className="w-4 h-4 text-brand-600" />
                <span>Buka Demo Interaktif</span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tanpa Biaya Registrasi</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Bebas Iklan</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Support Android APK</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Digital Garage Preview Card (Emil Nested Radius Polish) */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_16px_36px_-8px_rgba(15,23,42,0.12)] border border-slate-200/80 relative overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Honda HR-V 1.5 SE</h3>
                    <p className="text-[11px] font-mono tabular-nums text-slate-500 font-bold">B 1984 RVD &bull; 2022</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                  Status: Prima
                </span>
              </div>

              {/* Odometer Quick Adjust Interactive */}
              <div className="my-4 p-4 bg-slate-50/90 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-600 flex items-center gap-1.5">
                    <DashboardSpeed className="w-4 h-4 text-brand-600" />
                    Odometer Aktif:
                  </span>
                  <span className="font-extrabold text-slate-900 font-mono tabular-nums text-sm transition-all duration-150">
                    {previewOdo.toLocaleString('id-ID')} KM
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPreviewOdo(prev => prev + 100)}
                    className="py-1.5 bg-white border border-slate-200 hover:border-brand-500 text-slate-700 active:scale-95 text-[11px] font-extrabold rounded-xl shadow-2xs hover:text-brand-600 transition-[transform,border-color,color] duration-150 cursor-pointer"
                  >
                    +100 KM
                  </button>
                  <button
                    onClick={() => setPreviewOdo(prev => prev + 500)}
                    className="py-1.5 bg-white border border-slate-200 hover:border-brand-500 text-slate-700 active:scale-95 text-[11px] font-extrabold rounded-xl shadow-2xs hover:text-brand-600 transition-[transform,border-color,color] duration-150 cursor-pointer"
                  >
                    +500 KM
                  </button>
                  <button
                    onClick={() => setPreviewOdo(24500)}
                    className="py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 active:scale-95 text-[11px] font-extrabold rounded-xl transition-[transform,background-color] duration-150 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Refresh className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Live Reminder Indicators */}
              <div className="space-y-2.5">
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Ganti Oli Mesin (5W-30)</strong>
                      <span className="text-[11px] text-amber-800">
                        {previewOdo >= 25000 ? '⚠️ Jatuh tempo sekarang!' : `Sisa ${25000 - previewOdo} KM lagi`}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg">
                    Target: 25.000 KM
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <strong className="text-slate-900 block font-bold">Rotasi Ban &amp; Spooring</strong>
                    <span className="text-[11px] text-slate-500">Target 30.000 KM (Aman)</span>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-bold text-slate-700">30.000 KM</span>
                </div>
              </div>

              {/* Bottom CTA within mockup */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Data terenkripsi Neon DB
                </span>
                <span className="text-brand-600 font-bold hover:underline cursor-pointer active:scale-95 inline-block transition-transform" onClick={handleDemoLogin}>
                  Lihat Buku Servis Lengkap &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Metric Stats Strip */}
      <section className="bg-slate-900 text-white py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-brand-400 font-mono tabular-nums">106+</div>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Preset Model Lokal</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">12</div>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Kategori Perawatan</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">99.9%</div>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Cloud Uptime</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-indigo-400 font-mono tabular-nums">0 Iklan</div>
            <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">Privasi Pengguna Terjaga</p>
          </div>
        </div>
      </section>

      {/* 4. Core Features Deep Dive */}
      <section id="fitur" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-brand-600 tracking-wider uppercase bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Solusi Terpadu Garasi Anda
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Fitur Lengkap untuk Pemilik Mobil &amp; Motor
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Tinggalkan catatan kertas yang mudah hilang. Kelola seluruh aspek teknis dan finansial armada kendaraan Anda dalam satu aplikasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-brand-500 hover:bg-white hover:shadow-[0_12px_28px_-6px_rgba(37,99,235,0.15)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out group">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <BellNotification className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Smart Maintenance Reminder</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Sistem menghitung jatuh tempo penggantian oli mesin, oli gardan, minyak rem, aki, dan ban otomatis berdasarkan jarak tempuh KM maupun rentang bulan kalender.
              </p>
              <div className="text-xs font-bold text-brand-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150">
                <span>One-Click Cycle Reset</span> &rarr;
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-500 hover:bg-white hover:shadow-[0_12px_28px_-6px_rgba(99,102,241,0.15)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <Page className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Arsip Foto Nota &amp; Kuitansi</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Foto bukti transaksi dari bengkel resmi maupun bengkel umum langsung tersimpan aman di cloud. Dilengkapi fitur zoom gambar untuk transparansi saat mobil dijual kembali.
              </p>
              <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150">
                <span>Digital Resale Value Booster</span> &rarr;
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-white hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.15)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <StatsUpSquare className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Analitik Biaya &amp; Anggaran</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Pantau pengeluaran servis 12 bulan terakhir, diagram persentase sparepart vs jasa mekanik, dan komparasi biaya operasional antar mobil/motor di garasi Anda.
              </p>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150">
                <span>Laporan Finansial Rinci</span> &rarr;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive ROI & Maintenance Cost Calculator */}
      <section id="kalkulator" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_-10px_rgba(15,23,42,0.1)] border border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Calculator Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-800 text-xs font-extrabold">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Simulasi Biaya &amp; Penghematan</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Kalkulator Estimasi Biaya Perawatan Rutin
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Lihat perbandingan antara biaya servis berkala yang teratur dengan risiko biaya perbaikan besar (turun mesin / overhaul) akibat lalai servis.
              </p>

              {/* Controls */}
              <div className="space-y-4 pt-2">
                {/* Vehicle Type Switch */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Kendaraan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setVehicleType('CAR')}
                      className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-[transform,background-color,border-color,color] duration-150 active:scale-95 cursor-pointer ${
                        vehicleType === 'CAR'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>Mobil (MPV/SUV/Sedan)</span>
                    </button>
                    <button
                      onClick={() => setVehicleType('MOTORCYCLE')}
                      className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-[transform,background-color,border-color,color] duration-150 active:scale-95 cursor-pointer ${
                        vehicleType === 'MOTORCYCLE'
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Motorcycle className="w-4 h-4" />
                      <span>Sepeda Motor / Skutik</span>
                    </button>
                  </div>
                </div>

                {/* Monthly KM Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Jarak Tempuh Rata-Rata per Bulan:</span>
                    <span className="text-brand-600 font-mono tabular-nums">{monthlyKm.toLocaleString('id-ID')} KM/bulan</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="4000"
                    step="100"
                    value={monthlyKm}
                    onChange={(e) => setMonthlyKm(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>300 KM (Jarang Pakai)</span>
                    <span>2.000 KM (Komuter Harian)</span>
                    <span>4.000 KM (Operasional Tinggi)</span>
                  </div>
                </div>

                {/* Vehicle Age Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Usia Kendaraan:</span>
                    <span className="text-brand-600 font-mono tabular-nums">{vehicleAge} Tahun</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={vehicleAge}
                    onChange={(e) => setVehicleAge(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
              </div>
            </div>

            {/* Calculator Results Display (Emil High-Contrast Polish) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_18px_36px_-8px_rgba(0,0,0,0.5)] space-y-6 border border-slate-800">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
                Hasil Kalkulasi Estimasi Tahunan
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block">Biaya Ganti Oli Setahun</span>
                  <span className="text-xl font-extrabold text-white font-mono tabular-nums block mt-1">
                    Rp {estimatedYearlyOilCost.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400">~{Math.round(monthlyKm * 12 / (vehicleType === 'CAR' ? 5000 : 2500))}x ganti/tahun</span>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block">Total Servis Berkala</span>
                  <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums block mt-1">
                    Rp {estimatedRoutineTotal.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400">Termasuk filter &amp; rem</span>
                </div>
              </div>

              {/* Highlight Savings Box */}
              <div className="p-5 bg-gradient-to-r from-emerald-950/80 to-slate-900 rounded-2xl border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Potensi Kerugian yang Dicegah:</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-300 font-mono tabular-nums">
                  Hingga Rp {estimatedMajorBreakdownPrevented.toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Menjaga servis rutin dengan pengingat FixGarasi mencegah risiko kerusakan fatal seperti oli kering, mesin jebol, dan keausan transmisi.
                </p>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 active:scale-[0.97] text-white font-extrabold text-xs rounded-xl shadow-md transition-[transform,background-color] duration-150 flex items-center justify-center gap-2 text-center block cursor-pointer"
              >
                <span>Mulai Lindungi Kendaraan Anda (Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Vehicle Catalog Brand Showcase */}
      <section id="katalog" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs font-extrabold text-brand-600 tracking-wider uppercase bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Katalog Lengkap Indonesia
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mendukung 106+ Model Mobil &amp; Motor Populer
            </h2>
            <p className="text-slate-600 text-sm">
              Preset spesifikasi, kapasitas CC, jenis bahan bakar, dan foto visual studio siap pakai tanpa perlu upload manual.
            </p>
          </div>

          {/* Brand Tabs with Tactile Press Feedback */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {brands.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBrandFilter(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-[transform,background-color,border-color,color] duration-150 active:scale-95 border cursor-pointer ${
                  activeBrandFilter === b.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseVehicles.map((veh, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:bg-white hover:border-brand-500 hover:shadow-[0_8px_20px_-4px_rgba(15,23,42,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700 uppercase">
                    {veh.brand}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-slate-400 font-bold">{veh.year}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">{veh.model}</h4>
                <p className="text-[11px] text-slate-500 font-mono tabular-nums mb-4">Jarak Odometer: {veh.odo}</p>
                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-500">Kondisi:</span>
                  <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                    veh.status.includes('Jatuh') ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {veh.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Transparent Midtrans Pricing Table */}
      <section id="harga" className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Biaya Transparan &amp; Fleksibel
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pilihan Paket Sesuai Kebutuhan Garasi Anda
            </h2>
            <p className="text-slate-600 text-sm">
              Mulai gratis untuk kendaraan harian, atau tingkatkan ke Pro untuk garasi keluarga tanpa batas kuota.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Paket Gratis</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">Selamanya</span>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-slate-950 font-mono tabular-nums">Rp 0</span>
                  <span className="text-xs text-slate-500">/selamanya</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Maksimal <strong>2 Unit Kendaraan</strong> (Mobil / Motor)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pencatatan Riwayat Servis &amp; Odometer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Smart Maintenance Reminders Aktif</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Simpan Bukti Foto Nota &amp; Kwitansi</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 active:scale-[0.97] text-slate-800 text-xs font-extrabold rounded-xl transition-[transform,background-color] duration-150 text-center block cursor-pointer"
              >
                Mulai Akun Gratis
              </Link>
            </div>

            {/* Pro Plan (Highlighted with Layered Glow & Soft Borders) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-8 border-2 border-amber-500 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_20px_40px_-10px_rgba(245,158,11,0.25)] relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Paling Populer &bull; Hemat 35%
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">FixGarasi PRO</span>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/30">Garansi 7 Hari</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">Rp 149.000</span>
                  <span className="text-xs text-slate-400">/tahun (~Rp 12.400/bln)</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-6">Tersedia opsi bulanan Rp 19.000 / bulan</p>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Garasi Tanpa Batas (Unlimited Vehicles)</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Kapasitas Upload Foto Nota Tak Terbatas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Laporan Analitik Pengeluaran Mendalam 12 Bulan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Prioritas Bantuan Customer Support</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pembayaran Otomatis QRIS, VA, &amp; E-Wallet (Midtrans)</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.97] text-slate-950 text-xs font-extrabold rounded-xl shadow-[0_4px_14px_-2px_rgba(245,158,11,0.35)] transition-[transform,box-shadow,background-color] duration-150 text-center block cursor-pointer"
              >
                Upgrade ke FixGarasi PRO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Desktop FAQ Section */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Punya pertanyaan seputar FixGarasi? Temukan jawabannya di bawah ini.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="font-extrabold text-sm text-slate-900 mb-2">Apakah data riwayat servis saya aman dan tersimpan di cloud?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ya. Seluruh data garasi, riwayat servis, dan foto kuitansi disimpan secara terisolasi pada cloud database PostgreSQL Neon dengan enkripsi standar industri TLS 1.3. Data Anda tidak akan hilang meskipun Anda berganti perangkat HP atau laptop.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="font-extrabold text-sm text-slate-900 mb-2">Bagaimana cara kerja pengingat servis (Smart Reminder)?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda cukup memasukkan interval servis (misal: ganti oli tiap 5.000 KM atau 6 bulan). Saat Anda mengupdate angka odometer terkini, FixGarasi akan otomatis menghitung sisa kilometer dan memberi status Due Soon atau Overdue.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="font-extrabold text-sm text-slate-900 mb-2">Metode pembayaran apa saja yang didukung untuk upgrade PRO?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                FixGarasi terhubung langsung dengan gerbang pembayaran resmi Midtrans berlisensi Bank Indonesia yang mendukung QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account Multi-Bank (BCA, Mandiri, BNI, BRI, Permata), dan transfer bank.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="font-extrabold text-sm text-slate-900 mb-2">Apakah aplikasi bisa digunakan di HP Android?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ya! FixGarasi didesain secara mobile-first dan responsif. Anda dapat membukanya di browser Chrome/Safari HP, menyimpannya sebagai PWA di layar utama, atau membungkusnya ke dalam Android Native APK dengan WebView.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Desktop Footer */}
      <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.webp" alt="FixGarasi Logo" className="w-10 h-10 rounded-xl bg-white p-0.5" />
              <span className="font-extrabold text-lg tracking-tight">
                FIX<span className="text-brand-500">GARASI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Platform SaaS manajemen pemeliharaan kendaraan digital untuk pemilik mobil dan motor di Indonesia. Catat, pantau, dan rawat garasi Anda secara presisi.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SSL 256-bit Encrypted</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-amber-400" /> Midtrans Verified</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Navigasi Layanan</h5>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#fitur" className="hover:text-white transition-colors duration-150">Fitur Unggulan</a></li>
              <li><a href="#kalkulator" className="hover:text-white transition-colors duration-150">Kalkulator Servis</a></li>
              <li><a href="#katalog" className="hover:text-white transition-colors duration-150">Katalog Kendaraan</a></li>
              <li><a href="#harga" className="hover:text-white transition-colors duration-150">Paket &amp; Harga PRO</a></li>
              <li><button onClick={handleDemoLogin} className="hover:text-white transition-colors duration-150 text-left cursor-pointer">Demo Interaktif</button></li>
            </ul>
          </div>

          {/* Col 3: Legal & Bantuan */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Legal &amp; Dukungan</h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Ketentuan Layanan
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('refund')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Kebijakan Pembayaran &amp; Refund
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('contact')} className="hover:text-white transition-colors duration-150 cursor-pointer">
                  Hubungi Dukungan Support
                </button>
              </li>
              <li className="text-slate-500 pt-1 font-mono">support@fixgarasi.id</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>&copy; 2026 FixGarasi Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <p>Ditenagai oleh Neon Serverless PostgreSQL &amp; Vercel Edge Network.</p>
        </div>
      </footer>
    </div>
  );
};
