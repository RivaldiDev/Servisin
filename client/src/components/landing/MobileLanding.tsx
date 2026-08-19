import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  BellNotification,
  DashboardSpeed,
  Page,
  StatsUpSquare,
  CheckCircle,
  Sparks,
  ArrowRight,
  Eye,
  Refresh,
  SmartphoneDevice,
  Plus,
  Minus
} from 'iconoir-react';
import { useAuth } from '../../context/AuthContext';

interface MobileLandingProps {
  onOpenLegal: (tab: 'terms' | 'privacy' | 'refund' | 'contact') => void;
}

export const MobileLanding: React.FC<MobileLandingProps> = ({ onOpenLegal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'reminder' | 'nota' | 'analytics'>('reminder');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [mobileOdo, setMobileOdo] = useState<number>(24500);

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

  const faqs = [
    {
      q: 'Apakah data saya aman jika ganti HP?',
      a: 'Sangat aman! Seluruh data garasi dan riwayat servis tersimpan otomatis di Neon Cloud PostgreSQL terenkripsi.'
    },
    {
      q: 'Bagaimana cara kerja pengingat servis?',
      a: 'Anda cukup mencatat KM terbaru saat isi bensin atau servis. Aplikasi akan otomatis mengkalkulasi sisa jarak tempuh sebelum jatuh tempo oli/servis.'
    },
    {
      q: 'Bisa upload foto nota kuitansi langsung dari kamera?',
      a: 'Bisa! Anda dapat memotret langsung nota bengkel dari kamera HP atau memilih file dari galeri.'
    },
    {
      q: 'Apakah mendukung pembayaran QRIS & E-Wallet?',
      a: 'Ya, upgrade FixGarasi PRO didukung oleh Midtrans dengan QRIS (GoPay, ShopeePay, Dana, OVO) dan Virtual Account bank.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-28 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. Mobile Top Frosted Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="FixGarasi Logo" className="w-8 h-8 rounded-xl object-contain shadow-2xs" />
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            FIX<span className="text-brand-600">GARASI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white text-[11px] font-extrabold flex items-center gap-1 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-brand-600" />
            <span>{demoLoading ? '...' : 'Demo'}</span>
          </button>
          <Link
            to="/login"
            className="px-3 py-1.5 bg-brand-600 text-white text-xs font-extrabold rounded-lg shadow-xs"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* 2. Mobile Hero Section */}
      <section className="px-5 pt-6 pb-8 bg-gradient-to-b from-white to-slate-50 space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full text-brand-700 text-[11px] font-extrabold">
          <Sparks className="w-3.5 h-3.5 text-amber-500" />
          <span>Buku Servis Digital Modern #1</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Rawat Mobil & Motor Lebih Hemat, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-700">
            Bebas Lupa Servis.
          </span>
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          Catat riwayat perawatan, simpan foto kuitansi bengkel, dan pantau jatuh tempo ganti oli di saku Anda.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/register"
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-brand-600/20 text-center flex items-center justify-center gap-2"
          >
            <span>Daftar Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-brand-600" />
            <span>Coba Demo 1-Klik Tanpa Daftar</span>
          </button>
        </div>

        {/* Feature Badges Strip */}
        <div className="pt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 font-bold">
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-emerald-600 block text-xs font-extrabold">100%</span>
            <span>Gratis 2 Kendaraan</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-brand-600 block text-xs font-extrabold">106+</span>
            <span>Preset Mobil/Motor</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <span className="text-amber-600 block text-xs font-extrabold">0 Iklan</span>
            <span>Aman & Nyaman</span>
          </div>
        </div>
      </section>

      {/* 3. Mobile Interactive Vehicle Preview Widget */}
      <section className="px-5 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Honda HR-V 1.5 SE</h4>
                <p className="text-[10px] font-mono text-slate-400">B 1984 RVD</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
              Optimal
            </span>
          </div>

          {/* Quick Odometer Simulator */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <DashboardSpeed className="w-3.5 h-3.5 text-brand-600" /> Simulasi KM:
              </span>
              <span className="font-extrabold font-mono text-slate-900">{mobileOdo.toLocaleString('id-ID')} KM</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setMobileOdo(prev => prev + 100)}
                className="py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md shadow-2xs"
              >
                +100 KM
              </button>
              <button
                onClick={() => setMobileOdo(prev => prev + 500)}
                className="py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md shadow-2xs"
              >
                +500 KM
              </button>
              <button
                onClick={() => setMobileOdo(24500)}
                className="py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md flex items-center justify-center gap-0.5"
              >
                <Refresh className="w-2.5 h-2.5" /> Reset
              </button>
            </div>
          </div>

          {/* Live Status indicator */}
          <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
            mobileOdo >= 25000 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <span className="font-bold text-[11px]">
              {mobileOdo >= 25000 ? '⚠️ Waktunya Ganti Oli Mesin!' : `✅ Oli Mesin Aman (Sisa ${25000 - mobileOdo} KM)`}
            </span>
            <span className="text-[10px] font-mono font-bold">25.000 KM</span>
          </div>
        </div>
      </section>

      {/* 4. Mobile Feature Tabs Switcher */}
      <section className="px-5 py-4 space-y-3">
        <h3 className="font-extrabold text-base text-slate-900">Fitur Utama di Ponsel Anda</h3>
        
        {/* Tab Buttons */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab('reminder')}
            className={`py-2 text-[11px] font-extrabold rounded-lg transition-all ${
              activeTab === 'reminder' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Pengingat
          </button>
          <button
            onClick={() => setActiveTab('nota')}
            className={`py-2 text-[11px] font-extrabold rounded-lg transition-all ${
              activeTab === 'nota' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Foto Nota
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 text-[11px] font-extrabold rounded-lg transition-all ${
              activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Analitik
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          {activeTab === 'reminder' && (
            <>
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-1">
                <BellNotification className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Pengingat Servis Presisi KM</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jadwal ganti oli, ban, filter, busi, dan transmisi terhitung otomatis sesuai pola pemakaian kilometer harian Anda.
              </p>
            </>
          )}

          {activeTab === 'nota' && (
            <>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                <Page className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Scan & Upload Nota Bengkel</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Foto kuitansi langsung dari kamera smartphone. Tersimpan rapi di cloud, bukti valid saat mobil/motor Anda mau dijual kembali.
              </p>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <StatsUpSquare className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Grafik Pengeluaran 12 Bulan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ketahui total pengeluaran suku cadang, jasa mekanik, dan tren biaya perawatan bulanan secara transparan.
              </p>
            </>
          )}
        </div>
      </section>

      {/* 5. Mobile Android & Web App Integration Banner */}
      <section className="px-5 py-4">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-4 shadow-md flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-emerald-400">
            <SmartphoneDevice className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-white">Ringan & Siap di HP Android</h4>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Buka lewat browser Chrome/Safari, simpan sebagai PWA, atau integrasikan ke APK Android WebView secara instan.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Mobile Pricing Quick Card */}
      <section className="px-5 py-4 space-y-3">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Paket FixGarasi
          </span>
          <h3 className="font-extrabold text-lg text-slate-900">Pilihan Harga Sederhana</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-amber-500 shadow-md relative space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-amber-600 uppercase">FixGarasi PRO</span>
              <h4 className="text-2xl font-extrabold text-slate-950 font-mono">Rp 149.000 <span className="text-xs font-normal text-slate-500">/tahun</span></h4>
            </div>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              Hemat 35%
            </span>
          </div>

          <ul className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Unlimited Kendaraan (Mobil & Motor)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Upload Foto Nota Bebas Kuota</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Garansi 7 Hari & Pembayaran QRIS Midtrans</span>
            </li>
          </ul>

          <Link
            to="/register"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold rounded-xl text-center block shadow-md"
          >
            Upgrade ke PRO Sekarang
          </Link>
        </div>
      </section>

      {/* 7. Mobile Accordion FAQ */}
      <section className="px-5 py-4 space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 text-center">FAQ (Tanya Jawab)</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-3.5 text-left font-extrabold text-xs text-slate-900 flex items-center justify-between gap-2"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <Minus className="w-4 h-4 text-brand-600 shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-3.5 pb-3.5 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Mobile Footer Links */}
      <footer className="px-5 pt-8 pb-4 text-center space-y-4 text-slate-400 text-xs border-t border-slate-200 mt-6 bg-slate-100/50">
        <div className="flex justify-center items-center gap-2">
          <img src="/logo.webp" alt="FixGarasi" className="w-6 h-6 rounded-md" />
          <span className="font-extrabold text-slate-800 text-sm">FIXGARASI</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-bold">
          <button onClick={() => onOpenLegal('terms')}>Ketentuan</button>
          <button onClick={() => onOpenLegal('privacy')}>Privasi</button>
          <button onClick={() => onOpenLegal('refund')}>Refund</button>
          <button onClick={() => onOpenLegal('contact')}>Bantuan</button>
        </div>
        <p className="text-[10px] text-slate-400">&copy; 2026 FixGarasi Indonesia. Hak Cipta Dilindungi.</p>
      </footer>

      {/* 9. Floating Thumb Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 shadow-lg flex items-center gap-2.5 max-w-lg mx-auto">
        <button
          onClick={handleDemoLogin}
          disabled={demoLoading}
          className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl transition-all text-center flex items-center justify-center gap-1"
        >
          <Eye className="w-3.5 h-3.5 text-brand-600" />
          <span>Demo</span>
        </button>
        <Link
          to="/register"
          className="w-2/3 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-brand-600/20 text-center flex items-center justify-center gap-1.5"
        >
          <span>Mulai Gratis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
