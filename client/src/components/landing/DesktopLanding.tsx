import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Motorcycle,
  DashboardSpeed,
  Page,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  ArrowRight,
  Eye,
  Refresh,
  Lock,
  Upload,
  Camera,
  Check
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

  // Calculator estimations
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
    <div className="min-h-screen bg-[#caf0f8]/20 text-[#03045e] font-sans selection:bg-[#0077b6] selection:text-white flex flex-col antialiased">
      {/* 1. Desktop Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#90e0ef]/50 transition-[background-color,border-color] duration-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group active:scale-[0.98] transition-transform duration-150 ease-out">
            <img
              src="/logo.webp"
              alt="FixGarasi Logo"
              className="w-11 h-11 rounded-2xl object-contain shadow-xs border border-[#90e0ef]/40 bg-white group-hover:scale-105 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#03045e] block leading-none">
                FIX<span className="text-[#0077b6]">GARASI</span>
              </span>
              <span className="text-[10px] font-bold text-[#0077b6]/70 uppercase tracking-widest block mt-0.5">
                Digital Garage &amp; Maintenance
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[#03045e]/80">
            <a href="#fitur" className="hover:text-[#0077b6] transition-colors duration-150">Fitur</a>
            <a href="#kalkulator" className="hover:text-[#0077b6] transition-colors duration-150">Kalkulator Servis</a>
            <a href="#katalog" className="hover:text-[#0077b6] transition-colors duration-150">Model Kendaraan</a>
            <a href="#harga" className="hover:text-[#0077b6] transition-colors duration-150">Paket &amp; Harga</a>
            <a href="#faq" className="hover:text-[#0077b6] transition-colors duration-150">FAQ</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#90e0ef] hover:border-[#0077b6] bg-white hover:bg-[#caf0f8]/40 text-[#03045e] hover:text-[#0077b6] active:scale-[0.97] text-xs font-extrabold transition-[transform,background-color,border-color,color] duration-150 ease-out shadow-xs cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#0077b6]" />
              <span>{demoLoading ? 'Menyiapkan...' : 'Coba Demo 1-Klik'}</span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2.5 text-xs font-bold text-[#03045e] hover:text-[#0077b6] active:scale-[0.97] transition-[transform,color] duration-150 ease-out"
            >
              Masuk
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_-2px_rgba(0,119,182,0.35)] hover:shadow-[0_8px_20px_-4px_rgba(0,180,216,0.45)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Strict Palette: Deep Twilight, Teal Blue, Turquoise Surf, Frosted Blue, Light Cyan) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-[#caf0f8]/30 to-[#caf0f8]/50 border-b border-[#90e0ef]/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00b4d8]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#0077b6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#03045e] tracking-tight leading-[1.15]">
              Buku Servis Digital &amp; <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#03045e]">
                Pengingat Perawatan Cerdas
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#03045e]/80 max-w-2xl leading-relaxed">
              Catat riwayat perawatan mobil &amp; motor, arsipkan nota kuitansi bengkel secara aman terenkripsi, dan dapatkan pengingat servis otomatis berbasis jarak tempuh odometer maupun waktu.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white text-sm font-extrabold rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,119,182,0.35),0_1px_2px_rgba(3,4,94,0.1)] hover:shadow-[0_16px_32px_-6px_rgba(0,180,216,0.45)] transition-[transform,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <span>Daftar Gratis Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleDemoLogin}
                className="inline-flex items-center gap-2 px-6 py-4 bg-white hover:bg-[#caf0f8]/50 active:scale-[0.97] text-[#03045e] text-sm font-bold rounded-2xl border border-[#90e0ef] shadow-xs hover:border-[#0077b6] transition-[transform,background-color,border-color] duration-150 ease-out cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#0077b6]" />
                <span>Buka Demo Interaktif</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Digital Garage Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 shadow-[0_1px_3px_rgba(3,4,94,0.06),0_16px_36px_-8px_rgba(3,4,94,0.15)] border border-[#90e0ef]/70 relative overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-[#90e0ef]/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#caf0f8] border border-[#90e0ef] flex items-center justify-center text-[#0077b6]">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#03045e]">Honda HR-V 1.5 SE</h3>
                    <p className="text-[11px] font-mono tabular-nums text-[#0077b6]/80 font-bold">B 1984 RVD &bull; 2022</p>
                  </div>
                </div>
                <span className="bg-[#caf0f8] text-[#0077b6] border border-[#00b4d8] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                  Status: Prima
                </span>
              </div>

              {/* Odometer Quick Adjust Interactive */}
              <div className="my-4 p-4 bg-[#caf0f8]/30 rounded-2xl border border-[#90e0ef]/40">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-[#03045e] flex items-center gap-1.5">
                    <DashboardSpeed className="w-4 h-4 text-[#0077b6]" />
                    Odometer Aktif:
                  </span>
                  <span className="font-extrabold text-[#03045e] font-mono tabular-nums text-sm transition-all duration-150">
                    {previewOdo.toLocaleString('id-ID')} KM
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPreviewOdo(prev => prev + 100)}
                    className="py-1.5 bg-white border border-[#90e0ef] hover:border-[#0077b6] text-[#03045e] active:scale-95 text-[11px] font-extrabold rounded-xl shadow-2xs hover:text-[#0077b6] transition-[transform,border-color,color] duration-150 cursor-pointer"
                  >
                    +100 KM
                  </button>
                  <button
                    onClick={() => setPreviewOdo(prev => prev + 500)}
                    className="py-1.5 bg-white border border-[#90e0ef] hover:border-[#0077b6] text-[#03045e] active:scale-95 text-[11px] font-extrabold rounded-xl shadow-2xs hover:text-[#0077b6] transition-[transform,border-color,color] duration-150 cursor-pointer"
                  >
                    +500 KM
                  </button>
                  <button
                    onClick={() => setPreviewOdo(24500)}
                    className="py-1.5 bg-[#caf0f8] hover:bg-[#90e0ef] text-[#03045e] active:scale-95 text-[11px] font-extrabold rounded-xl transition-[transform,background-color] duration-150 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Refresh className="w-3 h-3" /> Reset
                  </button>
                </div>
              </div>

              {/* Live Reminder Indicators */}
              <div className="space-y-2.5">
                <div className="p-3 bg-[#caf0f8] rounded-xl border border-[#00b4d8]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0077b6] animate-pulse" />
                    <div>
                      <strong className="text-[#03045e] block font-bold">Ganti Oli Mesin (5W-30)</strong>
                      <span className="text-[11px] text-[#0077b6]">
                        {previewOdo >= 25000 ? '⚠️ Jatuh tempo sekarang!' : `Sisa ${25000 - previewOdo} KM lagi`}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums font-bold text-[#03045e] bg-white px-2 py-0.5 rounded-lg border border-[#90e0ef]">
                    Target: 25.000 KM
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#90e0ef]/50 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <strong className="text-[#03045e] block font-bold">Rotasi Ban &amp; Spooring</strong>
                    <span className="text-[11px] text-[#0077b6]/70">Target 30.000 KM (Aman)</span>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-bold text-[#0077b6]">30.000 KM</span>
                </div>
              </div>

              {/* Bottom CTA within mockup */}
              <div className="mt-4 pt-3 border-t border-[#90e0ef]/40 flex items-center justify-between text-[11px]">
                <span className="text-[#0077b6] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#00b4d8]" /> Data terenkripsi Neon DB
                </span>
                <span className="text-[#0077b6] font-bold hover:underline cursor-pointer active:scale-95 inline-block transition-transform" onClick={handleDemoLogin}>
                  Lihat Buku Servis Lengkap &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Metric Stats Strip (Deep Twilight: #03045e) */}
      <section className="bg-[#03045e] text-white py-8 border-y border-[#0077b6]/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-[#00b4d8] font-mono tabular-nums">106+</div>
            <p className="text-xs text-[#90e0ef] mt-1 font-semibold uppercase tracking-wider">Preset Model Lokal</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-[#90e0ef] font-mono tabular-nums">12</div>
            <p className="text-xs text-[#90e0ef]/80 mt-1 font-semibold uppercase tracking-wider">Kategori Perawatan</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-[#caf0f8] font-mono tabular-nums">99.9%</div>
            <p className="text-xs text-[#90e0ef]/80 mt-1 font-semibold uppercase tracking-wider">Cloud Uptime</p>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-extrabold text-[#00b4d8] font-mono tabular-nums">0 Iklan</div>
            <p className="text-xs text-[#90e0ef] mt-1 font-semibold uppercase tracking-wider">Privasi Pengguna Terjaga</p>
          </div>
        </div>
      </section>

      {/* 4. 3-COLUMN BENTO GRID FEATURE SECTION (Deep Twilight #03045e Base with Turquoise #00b4d8 & Frosted #90e0ef Accents) */}
      <section id="fitur" className="py-24 bg-[#03045e] text-white border-b border-[#0077b6]/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Manajemen Garasi Modern
            </h2>
            <p className="text-[#90e0ef] text-sm sm:text-base mt-2">
              Satu sistem terintegrasi untuk memantau kondisi fisik, jadwal servis, dan arsip dokumen setiap kendaraan.
            </p>
          </div>

          {/* 3-Column Bento Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* COLUMN 1: Visual Multi-Vehicle Overview (Tall Card with 2x2 Grid & Focus Brackets) */}
            <div className="bg-[#02033b] border border-[#0077b6]/50 rounded-3xl p-7 flex flex-col justify-between hover:border-[#00b4d8] transition-[border-color,box-shadow] duration-200 shadow-xl">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Status Visual &amp; Skor Kesehatan
                </h3>
                <p className="text-xs text-[#90e0ef] mt-1.5 leading-relaxed">
                  Evaluasi kondisi riil mesin dan transmisi kendaraan secara presisi berdasarkan riwayat servis aktual.
                </p>
              </div>

              {/* 2x2 Visual Vehicle Matrix with Focus Target Brackets */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                {/* Vehicle 1 (Focused with Scanner Brackets & Score Pill) */}
                <div className="relative rounded-2xl bg-[#03045e] p-3 border border-[#00b4d8] flex flex-col items-center justify-center text-center overflow-hidden group">
                  {/* Focus Frame Brackets in Turquoise Surf */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00b4d8] rounded-tl-sm" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00b4d8] rounded-tr-sm" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00b4d8] rounded-bl-sm" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00b4d8] rounded-br-sm" />
                  
                  <div className="w-12 h-12 rounded-xl bg-[#0077b6]/20 border border-[#00b4d8]/40 flex items-center justify-center text-[#00b4d8] mb-2 mt-1">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-white block">Innova Zenix</span>
                  <span className="text-[10px] text-[#90e0ef] font-mono">B 2410 RVD</span>
                  
                  {/* Floating Score Badge in Light Cyan & Deep Twilight */}
                  <div className="mt-2.5 bg-[#caf0f8] text-[#03045e] px-2.5 py-0.5 rounded-md text-[10px] font-extrabold font-mono shadow-sm">
                    score 98
                  </div>
                </div>

                {/* Vehicle 2 */}
                <div className="rounded-2xl bg-[#03045e]/70 p-3 border border-[#0077b6]/40 flex flex-col items-center justify-center text-center opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-xl bg-[#02033b] flex items-center justify-center text-[#90e0ef] mb-2 mt-1">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-white block">HR-V 1.5 SE</span>
                  <span className="text-[10px] text-[#90e0ef]/70 font-mono">B 1984 RVD</span>
                  <div className="mt-2.5 bg-[#0077b6]/30 text-[#90e0ef] border border-[#00b4d8]/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    Due Soon
                  </div>
                </div>

                {/* Vehicle 3 */}
                <div className="rounded-2xl bg-[#03045e]/70 p-3 border border-[#0077b6]/40 flex flex-col items-center justify-center text-center opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-xl bg-[#02033b] flex items-center justify-center text-[#90e0ef] mb-2 mt-1">
                    <Car className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-white block">Fortuner VRZ</span>
                  <span className="text-[10px] text-[#90e0ef]/70 font-mono">B 8888 RFS</span>
                  <div className="mt-2.5 bg-[#00b4d8]/20 text-[#caf0f8] border border-[#00b4d8]/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    Optimal
                  </div>
                </div>

                {/* Vehicle 4 */}
                <div className="rounded-2xl bg-[#03045e]/70 p-3 border border-[#0077b6]/40 flex flex-col items-center justify-center text-center opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-xl bg-[#02033b] flex items-center justify-center text-[#90e0ef] mb-2 mt-1">
                    <Motorcycle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-white block">Vespa Sprint</span>
                  <span className="text-[10px] text-[#90e0ef]/70 font-mono">B 3321 KAS</span>
                  <div className="mt-2.5 bg-[#00b4d8]/20 text-[#caf0f8] border border-[#00b4d8]/40 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    Optimal
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0077b6]/40 flex items-center justify-between text-[11px] text-[#90e0ef]">
                <span>Multi-Vehicle Dashboard</span>
                <span className="text-[#00b4d8] font-bold">Auto-Sync Odometer</span>
              </div>
            </div>

            {/* COLUMN 2: Stacked 2 Cards (Track Progress & Schedule Maintenance) */}
            <div className="flex flex-col gap-6">
              {/* Card 2.A: Track Progress with Dot Track & Milestone Nodes */}
              <div className="bg-[#02033b] border border-[#0077b6]/50 rounded-3xl p-6 hover:border-[#00b4d8] transition-[border-color,box-shadow] duration-200 shadow-xl flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Tracking Siklus Servis
                  </h3>
                  <p className="text-xs text-[#90e0ef] mt-1 leading-relaxed">
                    Pantau setiap tahapan perawatan kendaraan dari servis berkala hingga jatuh tempo penggantian suku cadang.
                  </p>
                </div>

                {/* Dot Track with Timeline Steps */}
                <div className="my-5 space-y-4">
                  {/* Subtle Dot Track Bar */}
                  <div className="flex items-center justify-between px-2 text-[#0077b6]">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 4 ? 'bg-[#00b4d8] ring-4 ring-[#00b4d8]/30' : 'bg-[#0077b6]/50'}`} />
                    ))}
                  </div>

                  {/* Dynamic Floating Milestone Chips */}
                  <div className="relative h-20 flex items-center justify-center">
                    <div className="absolute top-0 left-6 bg-[#03045e] border border-[#0077b6] px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#caf0f8] shadow-md">
                      Oli Mesin 5.000 KM
                    </div>
                    <div className="absolute bottom-0 right-6 bg-[#03045e] border border-[#00b4d8] text-[#00b4d8] px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md">
                      Servis Rem 20.000 KM
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0077b6]/40 flex items-center justify-between text-[11px] text-[#90e0ef]">
                  <span>Smart Maintenance Log</span>
                  <span className="text-[#00b4d8] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 1-Click Reset
                  </span>
                </div>
              </div>

              {/* Card 2.B: Schedule Maintenance Seamlessly (Side-by-side Visuals) */}
              <div className="bg-[#02033b] border border-[#0077b6]/50 rounded-3xl p-6 hover:border-[#00b4d8] transition-[border-color,box-shadow] duration-200 shadow-xl flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    Riwayat Montir &amp; Bengkel
                  </h3>
                  <p className="text-xs text-[#90e0ef] mt-1 leading-relaxed">
                    Catat pengerjaan mekanik, estimasi jasa bengkel resmi vs umum tanpa ribet.
                  </p>
                </div>

                {/* 2 Visual Thumbnail Cards Side-by-Side */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="bg-[#03045e] rounded-2xl p-3 border border-[#0077b6]/40 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0077b6]/20 text-[#00b4d8] flex items-center justify-center shrink-0">
                      <Page className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-white block truncate">Bengkel Resmi</span>
                      <span className="text-[10px] text-[#90e0ef] font-mono">Rp 650.000</span>
                    </div>
                  </div>

                  <div className="bg-[#03045e] rounded-2xl p-3 border border-[#0077b6]/40 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#00b4d8]/20 text-[#caf0f8] flex items-center justify-center shrink-0">
                      <Page className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-white block truncate">Bengkel Rekanan</span>
                      <span className="text-[10px] text-[#90e0ef] font-mono">Rp 380.000</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0077b6]/40 flex items-center justify-between text-[11px] text-[#90e0ef]">
                  <span>Transparansi Biaya</span>
                  <span className="text-[#00b4d8] font-bold">Auto Expense Chart</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Easy Upload & Cloud Vault (Tall Card with Dark Grid Pattern & Upload Action) */}
            <div className="bg-[#02033b] border border-[#0077b6]/50 rounded-3xl p-7 flex flex-col justify-between hover:border-[#00b4d8] transition-[border-color,box-shadow] duration-200 shadow-xl relative overflow-hidden">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  Arsip Nota &amp; Scan Otomatis
                </h3>
                <p className="text-xs text-[#90e0ef] mt-1.5 leading-relaxed">
                  Satu klik unggah atau drag &amp; drop kuitansi bengkel langsung tersimpan rapi di cloud terenkripsi.
                </p>
              </div>

              {/* Central Grid Mesh with Floating Upload Action Card */}
              <div className="my-6 relative h-48 rounded-2xl bg-[#03045e] border border-[#0077b6]/40 flex items-center justify-center overflow-hidden">
                {/* Background Blueprint Grid Mesh */}
                <div 
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #0077b6 1px, transparent 1px), linear-gradient(to bottom, #0077b6 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* Floating Centered Upload Button Card */}
                <div className="relative z-10 w-28 h-28 rounded-2xl bg-[#02033b] border border-[#00b4d8]/60 shadow-2xl flex flex-col items-center justify-center p-3 text-center group cursor-pointer hover:border-[#00b4d8] hover:scale-105 transition-[transform,border-color] duration-150">
                  <div className="w-10 h-10 rounded-xl bg-[#0077b6] text-white flex items-center justify-center mb-1.5 shadow-md shadow-[#0077b6]/40 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#caf0f8]">Upload Nota</span>
                  <span className="text-[9px] text-[#90e0ef]">JPG, PNG, PDF</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#0077b6]/40 flex items-center justify-between text-[11px] text-[#90e0ef]">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#00b4d8]" /> Support Kamera HP
                </span>
                <span className="text-[#00b4d8] font-bold">Cloud Enkripsi</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Interactive ROI & Maintenance Cost Calculator */}
      <section id="kalkulator" className="py-20 bg-white border-b border-[#90e0ef]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#caf0f8]/20 rounded-3xl p-8 lg:p-12 shadow-[0_1px_3px_rgba(3,4,94,0.05),0_20px_40px_-10px_rgba(3,4,94,0.08)] border border-[#90e0ef]/70 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Calculator Controls */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#03045e] tracking-tight">
                Kalkulator Estimasi Biaya Perawatan Rutin
              </h3>
              <p className="text-xs sm:text-sm text-[#03045e]/80">
                Lihat perbandingan antara biaya servis berkala yang teratur dengan risiko biaya perbaikan besar (turun mesin / overhaul) akibat lalai servis.
              </p>

              {/* Controls */}
              <div className="space-y-4 pt-2">
                {/* Vehicle Type Switch */}
                <div>
                  <label className="block text-xs font-bold text-[#03045e] mb-1.5">Tipe Kendaraan</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setVehicleType('CAR')}
                      className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-[transform,background-color,border-color,color] duration-150 active:scale-95 cursor-pointer ${
                        vehicleType === 'CAR'
                          ? 'bg-[#0077b6] text-white border-[#0077b6] shadow-xs'
                          : 'bg-white text-[#03045e] border-[#90e0ef] hover:bg-[#caf0f8]/40'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      <span>Mobil (MPV/SUV/Sedan)</span>
                    </button>
                    <button
                      onClick={() => setVehicleType('MOTORCYCLE')}
                      className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-[transform,background-color,border-color,color] duration-150 active:scale-95 cursor-pointer ${
                        vehicleType === 'MOTORCYCLE'
                          ? 'bg-[#0077b6] text-white border-[#0077b6] shadow-xs'
                          : 'bg-white text-[#03045e] border-[#90e0ef] hover:bg-[#caf0f8]/40'
                      }`}
                    >
                      <Motorcycle className="w-4 h-4" />
                      <span>Sepeda Motor / Skutik</span>
                    </button>
                  </div>
                </div>

                {/* Monthly KM Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#03045e] mb-1">
                    <span>Jarak Tempuh Rata-Rata per Bulan:</span>
                    <span className="text-[#0077b6] font-mono tabular-nums">{monthlyKm.toLocaleString('id-ID')} KM/bulan</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="4000"
                    step="100"
                    value={monthlyKm}
                    onChange={(e) => setMonthlyKm(Number(e.target.value))}
                    className="w-full h-2 bg-[#90e0ef]/40 rounded-lg appearance-none cursor-pointer accent-[#0077b6]"
                  />
                  <div className="flex justify-between text-[10px] text-[#0077b6]/70 mt-1">
                    <span>300 KM (Jarang Pakai)</span>
                    <span>2.000 KM (Komuter Harian)</span>
                    <span>4.000 KM (Operasional Tinggi)</span>
                  </div>
                </div>

                {/* Vehicle Age Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#03045e] mb-1">
                    <span>Usia Kendaraan:</span>
                    <span className="text-[#0077b6] font-mono tabular-nums">{vehicleAge} Tahun</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={vehicleAge}
                    onChange={(e) => setVehicleAge(Number(e.target.value))}
                    className="w-full h-2 bg-[#90e0ef]/40 rounded-lg appearance-none cursor-pointer accent-[#0077b6]"
                  />
                </div>
              </div>
            </div>

            {/* Calculator Results Display */}
            <div className="lg:col-span-6 bg-[#03045e] text-white p-8 rounded-3xl shadow-[0_1px_2px_rgba(3,4,94,0.2),0_18px_36px_-8px_rgba(3,4,94,0.4)] space-y-6 border border-[#0077b6]/60">
              <span className="text-xs font-extrabold text-[#00b4d8] uppercase tracking-wider block">
                Hasil Estimasi Tahunan
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#02033b] rounded-2xl border border-[#0077b6]/40">
                  <span className="text-[11px] text-[#90e0ef] block">Biaya Ganti Oli Setahun</span>
                  <span className="text-xl font-extrabold text-white font-mono tabular-nums block mt-1">
                    Rp {estimatedYearlyOilCost.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-[#90e0ef]/70">~{Math.round(monthlyKm * 12 / (vehicleType === 'CAR' ? 5000 : 2500))}x ganti/tahun</span>
                </div>

                <div className="p-4 bg-[#02033b] rounded-2xl border border-[#0077b6]/40">
                  <span className="text-[11px] text-[#90e0ef] block">Total Servis Berkala</span>
                  <span className="text-xl font-extrabold text-[#00b4d8] font-mono tabular-nums block mt-1">
                    Rp {estimatedRoutineTotal.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-[#90e0ef]/70">Termasuk filter &amp; rem</span>
                </div>
              </div>

              {/* Highlight Savings Box */}
              <div className="p-5 bg-[#02033b] rounded-2xl border border-[#00b4d8] space-y-2">
                <div className="flex items-center gap-2 text-[#00b4d8] text-xs font-extrabold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Potensi Kerugian yang Dicegah:</span>
                </div>
                <div className="text-2xl font-extrabold text-[#caf0f8] font-mono tabular-nums">
                  Hingga Rp {estimatedMajorBreakdownPrevented.toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-[#90e0ef] leading-relaxed">
                  Menjaga servis rutin dengan pengingat FixGarasi mencegah risiko kerusakan fatal seperti oli kering, mesin jebol, dan keausan transmisi.
                </p>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white font-extrabold text-xs rounded-xl shadow-md transition-[transform,background-color] duration-150 flex items-center justify-center gap-2 text-center block cursor-pointer"
              >
                <span>Mulai Lindungi Kendaraan Anda (Gratis)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Vehicle Catalog Brand Showcase */}
      <section id="katalog" className="py-20 bg-[#caf0f8]/20 border-b border-[#90e0ef]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#03045e] tracking-tight">
              Mendukung 106+ Model Mobil &amp; Motor Populer
            </h2>
            <p className="text-[#03045e]/80 text-sm">
              Preset spesifikasi, kapasitas CC, jenis bahan bakar, dan foto visual studio siap pakai tanpa perlu upload manual.
            </p>
          </div>

          {/* Brand Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {brands.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBrandFilter(b.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-[transform,background-color,border-color,color] duration-150 active:scale-95 border cursor-pointer ${
                  activeBrandFilter === b.id
                    ? 'bg-[#03045e] text-white border-[#03045e] shadow-xs'
                    : 'bg-white text-[#03045e] border-[#90e0ef] hover:bg-[#caf0f8]'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseVehicles.map((veh, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-[#90e0ef] hover:border-[#0077b6] hover:shadow-[0_8px_20px_-4px_rgba(0,119,182,0.15)] transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-[#caf0f8] text-[#0077b6] uppercase">
                    {veh.brand}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-[#0077b6]/70 font-bold">{veh.year}</span>
                </div>
                <h4 className="font-extrabold text-sm text-[#03045e] mb-1">{veh.model}</h4>
                <p className="text-[11px] text-[#03045e]/70 font-mono tabular-nums mb-4">Jarak Odometer: {veh.odo}</p>
                <div className="pt-3 border-t border-[#90e0ef]/40 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-[#03045e]/70">Kondisi:</span>
                  <span className={`font-extrabold px-2.5 py-0.5 rounded-full ${
                    veh.status.includes('Jatuh') ? 'bg-[#caf0f8] text-[#0077b6] border border-[#0077b6]' : 'bg-[#caf0f8] text-[#03045e] border border-[#00b4d8]'
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
      <section id="harga" className="py-20 bg-white border-b border-[#90e0ef]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#03045e] tracking-tight">
              Pilihan Paket Garasi
            </h2>
            <p className="text-[#03045e]/80 text-sm">
              Mulai gratis untuk kendaraan harian, atau tingkatkan ke Pro untuk garasi keluarga tanpa batas kuota.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Free Plan */}
            <div className="bg-[#caf0f8]/20 rounded-3xl p-8 border border-[#90e0ef] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[#0077b6] uppercase tracking-wider">Paket Gratis</span>
                  <span className="text-[10px] font-bold bg-[#caf0f8] text-[#0077b6] px-2 py-0.5 rounded-md">Selamanya</span>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-[#03045e] font-mono tabular-nums">Rp 0</span>
                  <span className="text-xs text-[#03045e]/70">/selamanya</span>
                </div>

                <ul className="space-y-3 text-xs text-[#03045e]/80 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#0077b6] shrink-0" />
                    <span>Maksimal <strong>2 Unit Kendaraan</strong> (Mobil / Motor)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#0077b6] shrink-0" />
                    <span>Pencatatan Riwayat Servis &amp; Odometer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#0077b6] shrink-0" />
                    <span>Smart Maintenance Reminders Aktif</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#0077b6] shrink-0" />
                    <span>Simpan Bukti Foto Nota &amp; Kwitansi</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 bg-white hover:bg-[#caf0f8] active:scale-[0.97] text-[#03045e] text-xs font-extrabold rounded-xl border border-[#90e0ef] transition-[transform,background-color] duration-150 text-center block cursor-pointer"
              >
                Mulai Akun Gratis
              </Link>
            </div>

            {/* Pro Plan (Deep Twilight #03045e + Turquoise #00b4d8 High-Contrast Glow) */}
            <div className="bg-[#03045e] text-white rounded-3xl p-8 border-2 border-[#00b4d8] shadow-[0_1px_2px_rgba(3,4,94,0.2),0_20px_40px_-10px_rgba(0,180,216,0.3)] relative flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 bg-[#00b4d8] text-[#03045e] font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                Paling Populer &bull; Hemat 35%
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-[#00b4d8] uppercase tracking-wider">FixGarasi PRO</span>
                  <span className="text-[10px] font-bold bg-[#0077b6]/40 text-[#caf0f8] px-2 py-0.5 rounded-md border border-[#00b4d8]/40">Garansi 7 Hari</span>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">Rp 149.000</span>
                  <span className="text-xs text-[#90e0ef]">/tahun (~Rp 12.400/bln)</span>
                </div>
                <p className="text-[11px] text-[#90e0ef] mb-6">Tersedia opsi bulanan Rp 19.000 / bulan</p>

                <ul className="space-y-3 text-xs text-[#caf0f8] mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#00b4d8] shrink-0" />
                    <span><strong>Garasi Tanpa Batas (Unlimited Vehicles)</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#00b4d8] shrink-0" />
                    <span>Kapasitas Upload Foto Nota Tak Terbatas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#00b4d8] shrink-0" />
                    <span>Laporan Analitik Pengeluaran Mendalam 12 Bulan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#00b4d8] shrink-0" />
                    <span>Prioritas Bantuan Customer Support</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#00b4d8] shrink-0" />
                    <span>Pembayaran Otomatis QRIS, VA, &amp; E-Wallet (Midtrans)</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_-2px_rgba(0,180,216,0.45)] transition-[transform,box-shadow,background-color] duration-150 text-center block cursor-pointer"
              >
                Upgrade ke FixGarasi PRO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Desktop FAQ Section */}
      <section id="faq" className="py-20 bg-[#caf0f8]/20 border-b border-[#90e0ef]/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#03045e] tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs sm:text-sm text-[#0077b6]">
              Punya pertanyaan seputar FixGarasi? Temukan jawabannya di bawah ini.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl border border-[#90e0ef]">
              <h4 className="font-extrabold text-sm text-[#03045e] mb-2">Apakah data riwayat servis saya aman dan tersimpan di cloud?</h4>
              <p className="text-xs text-[#03045e]/80 leading-relaxed">
                Ya. Seluruh data garasi, riwayat servis, dan foto kuitansi disimpan secara terisolasi pada cloud database PostgreSQL Neon dengan enkripsi standar industri TLS 1.3. Data Anda tidak akan hilang meskipun Anda berganti perangkat HP atau laptop.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#90e0ef]">
              <h4 className="font-extrabold text-sm text-[#03045e] mb-2">Bagaimana cara kerja pengingat servis (Smart Reminder)?</h4>
              <p className="text-xs text-[#03045e]/80 leading-relaxed">
                Anda cukup memasukkan interval servis (misal: ganti oli tiap 5.000 KM atau 6 bulan). Saat Anda mengupdate angka odometer terkini, FixGarasi akan otomatis menghitung sisa kilometer dan memberi status Due Soon atau Overdue.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#90e0ef]">
              <h4 className="font-extrabold text-sm text-[#03045e] mb-2">Metode pembayaran apa saja yang didukung untuk upgrade PRO?</h4>
              <p className="text-xs text-[#03045e]/80 leading-relaxed">
                FixGarasi terhubung langsung dengan gerbang pembayaran resmi Midtrans berlisensi Bank Indonesia yang mendukung QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account Multi-Bank (BCA, Mandiri, BNI, BRI, Permata), dan transfer bank.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#90e0ef]">
              <h4 className="font-extrabold text-sm text-[#03045e] mb-2">Apakah aplikasi bisa digunakan di HP Android?</h4>
              <p className="text-xs text-[#03045e]/80 leading-relaxed">
                Ya! FixGarasi didesain secara mobile-first dan responsif. Anda dapat membukanya di browser Chrome/Safari HP, menyimpannya sebagai PWA di layar utama, atau membungkusnya ke dalam Android Native APK dengan WebView.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Desktop Footer (Deep Twilight: #03045e) */}
      <footer className="bg-[#03045e] text-white pt-16 pb-12 border-t border-[#0077b6]/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo.webp" alt="FixGarasi Logo" className="w-10 h-10 rounded-xl bg-white p-0.5" />
              <span className="font-extrabold text-lg tracking-tight">
                FIX<span className="text-[#00b4d8]">GARASI</span>
              </span>
            </div>
            <p className="text-xs text-[#90e0ef] max-w-sm leading-relaxed">
              Platform SaaS manajemen pemeliharaan kendaraan digital untuk pemilik mobil dan motor di Indonesia. Catat, pantau, dan rawat garasi Anda secara presisi.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#90e0ef] pt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#00b4d8]" /> SSL 256-bit Encrypted</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-[#caf0f8]" /> Midtrans Verified</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Navigasi Layanan</h5>
            <ul className="space-y-2 text-[#90e0ef]">
              <li><a href="#fitur" className="hover:text-white transition-colors duration-150">Fitur</a></li>
              <li><a href="#kalkulator" className="hover:text-white transition-colors duration-150">Kalkulator Servis</a></li>
              <li><a href="#katalog" className="hover:text-white transition-colors duration-150">Katalog Kendaraan</a></li>
              <li><a href="#harga" className="hover:text-white transition-colors duration-150">Paket &amp; Harga PRO</a></li>
              <li><button onClick={handleDemoLogin} className="hover:text-white transition-colors duration-150 text-left cursor-pointer">Demo Interaktif</button></li>
            </ul>
          </div>

          {/* Col 3: Legal & Bantuan */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">Legal &amp; Dukungan</h5>
            <ul className="space-y-2 text-[#90e0ef]">
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
              <li className="text-[#caf0f8] pt-1 font-mono">support@fixgarasi.id</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#0077b6]/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#90e0ef]/70 gap-4">
          <p>&copy; 2026 FixGarasi Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <p>Ditenagai oleh Neon Serverless PostgreSQL &amp; Vercel Edge Network.</p>
        </div>
      </footer>
    </div>
  );
};
