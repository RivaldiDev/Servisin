import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  DashboardSpeed,
  CheckCircle,
  ArrowRight,
  Eye,
  Refresh,
  SmartphoneDevice,
  Plus,
  Minus,
  Upload
} from 'iconoir-react';
import { useAuth } from '../../context/AuthContext';

interface MobileLandingProps {
  onOpenLegal: (tab: 'terms' | 'privacy' | 'refund' | 'contact') => void;
}

export const MobileLanding: React.FC<MobileLandingProps> = ({ onOpenLegal }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
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
    <div className="min-h-screen bg-[#caf0f8]/20 text-[#03045e] font-sans pb-28 flex flex-col selection:bg-[#0077b6] selection:text-white antialiased">
      {/* 1. Mobile Top Frosted Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#90e0ef]/60 px-4 py-3 flex items-center justify-between shadow-2xs">
        <Link to="/" className="flex items-center gap-2 active:scale-95 transition-transform duration-150">
          <img src="/logo.webp" alt="FixGarasi Logo" className="w-8 h-8 rounded-xl object-contain shadow-2xs border border-[#90e0ef]/40" />
          <span className="font-extrabold text-base tracking-tight text-[#03045e]">
            FIX<span className="text-[#0077b6]">GARASI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="px-2.5 py-1.5 rounded-lg border border-[#90e0ef] text-[#03045e] bg-white active:scale-95 text-[11px] font-extrabold flex items-center gap-1 shadow-2xs transition-[transform,background-color] duration-150 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#0077b6]" />
            <span>{demoLoading ? '...' : 'Demo'}</span>
          </button>
          <Link
            to="/login"
            className="px-3 py-1.5 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-95 text-white text-xs font-extrabold rounded-lg shadow-xs transition-transform duration-150"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* 2. Mobile Hero Section */}
      <section className="px-5 pt-6 pb-6 bg-gradient-to-b from-white to-[#caf0f8]/30 space-y-4">
        <h1 className="text-3xl font-extrabold text-[#03045e] tracking-tight leading-tight">
          Rawat Mobil &amp; Motor Lebih Hemat, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0077b6] via-[#00b4d8] to-[#03045e]">
            Bebas Lupa Servis.
          </span>
        </h1>

        <p className="text-xs text-[#03045e]/80 leading-relaxed">
          Catat riwayat perawatan, simpan foto kuitansi bengkel, dan pantau jatuh tempo ganti oli di saku Anda.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/register"
            className="w-full py-3.5 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_-2px_rgba(0,119,182,0.35)] text-center flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 ease-out"
          >
            <span>Daftar Gratis Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleDemoLogin}
            className="w-full py-3 bg-white border border-[#90e0ef] active:scale-[0.97] text-[#03045e] text-xs font-bold rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-[transform,background-color] duration-150 ease-out cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#0077b6]" />
            <span>Coba Demo 1-Klik Tanpa Daftar</span>
          </button>
        </div>
      </section>

      {/* 3. Mobile Interactive Vehicle Preview Widget */}
      <section className="px-5 py-3">
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(3,4,94,0.05),0_10px_24px_-6px_rgba(3,4,94,0.1)] border border-[#90e0ef] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#90e0ef]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#caf0f8] text-[#0077b6] flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#03045e]">Honda HR-V 1.5 SE</h4>
                <p className="text-[10px] font-mono tabular-nums text-[#0077b6]">B 1984 RVD</p>
              </div>
            </div>
            <span className="bg-[#caf0f8] text-[#0077b6] text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-[#00b4d8]">
              Optimal
            </span>
          </div>

          {/* Quick Odometer Simulator */}
          <div className="p-3 bg-[#caf0f8]/30 rounded-xl border border-[#90e0ef]/40 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] font-bold text-[#03045e] flex items-center gap-1">
                <DashboardSpeed className="w-3.5 h-3.5 text-[#0077b6]" /> Simulasi KM:
              </span>
              <span className="font-extrabold font-mono tabular-nums text-[#03045e]">{mobileOdo.toLocaleString('id-ID')} KM</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setMobileOdo(prev => prev + 100)}
                className="py-1.5 bg-white border border-[#90e0ef] hover:border-[#0077b6] active:scale-95 text-[#03045e] text-[10px] font-bold rounded-lg shadow-2xs transition-[transform,border-color] duration-150 cursor-pointer"
              >
                +100 KM
              </button>
              <button
                onClick={() => setMobileOdo(prev => prev + 500)}
                className="py-1.5 bg-white border border-[#90e0ef] hover:border-[#0077b6] active:scale-95 text-[#03045e] text-[10px] font-bold rounded-lg shadow-2xs transition-[transform,border-color] duration-150 cursor-pointer"
              >
                +500 KM
              </button>
              <button
                onClick={() => setMobileOdo(24500)}
                className="py-1.5 bg-[#caf0f8] active:scale-95 text-[#03045e] text-[10px] font-bold rounded-lg flex items-center justify-center gap-0.5 transition-[transform,background-color] duration-150 cursor-pointer"
              >
                <Refresh className="w-2.5 h-2.5" /> Reset
              </button>
            </div>
          </div>

          {/* Live Status indicator */}
          <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors duration-150 ${
            mobileOdo >= 25000 ? 'bg-[#caf0f8] border-[#0077b6] text-[#03045e]' : 'bg-[#caf0f8] border-[#00b4d8] text-[#03045e]'
          }`}>
            <span className="font-bold text-[11px]">
              {mobileOdo >= 25000 ? '⚠️ Waktunya Ganti Oli Mesin!' : `✅ Oli Mesin Aman (Sisa ${25000 - mobileOdo} KM)`}
            </span>
            <span className="text-[10px] font-mono tabular-nums font-bold text-[#0077b6]">25.000 KM</span>
          </div>
        </div>
      </section>

      {/* 4. Mobile 3-Part Bento Stack (Deep Twilight #03045e Base) */}
      <section className="px-5 py-6 bg-[#03045e] text-white my-4 rounded-3xl space-y-4">
        <h3 className="font-extrabold text-lg text-white">Fitur Terintegrasi</h3>

        <div className="space-y-4">
          {/* Bento Part 1: Visual Score Card */}
          <div className="bg-[#02033b] rounded-2xl p-4 border border-[#0077b6]/50 space-y-3">
            <h4 className="font-extrabold text-sm text-white">Status Visual &amp; Skor Garasi</h4>
            <p className="text-xs text-[#90e0ef] leading-relaxed">
              Monitoring kondisi mesin terpusat untuk semua kendaraan harian Anda.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-[#03045e] rounded-xl border border-[#00b4d8] text-center">
                <span className="text-xs font-bold text-white block">Innova Zenix</span>
                <span className="text-[9px] font-mono text-[#caf0f8]">Score 98 • Prima</span>
              </div>
              <div className="p-2.5 bg-[#03045e] rounded-xl border border-[#0077b6] text-center">
                <span className="text-xs font-bold text-white block">HR-V 1.5</span>
                <span className="text-[9px] text-[#90e0ef] font-bold">Due Soon</span>
              </div>
            </div>
          </div>

          {/* Bento Part 2: Tracking Progress & Workshop Logs */}
          <div className="bg-[#02033b] rounded-2xl p-4 border border-[#0077b6]/50 space-y-3">
            <h4 className="font-extrabold text-sm text-white">Tracking Interval Servis</h4>
            <p className="text-xs text-[#90e0ef] leading-relaxed">
              Kalkulasi otomatis hitung mundur ganti oli dan servis rem berkala.
            </p>
            <div className="flex items-center justify-between p-2.5 bg-[#03045e] rounded-xl border border-[#0077b6] text-xs">
              <span className="text-[#caf0f8]">Ganti Oli 5.000 KM</span>
              <span className="text-[#00b4d8] font-bold font-mono">Siap Reset</span>
            </div>
          </div>

          {/* Bento Part 3: Upload Nota Cloud */}
          <div className="bg-[#02033b] rounded-2xl p-4 border border-[#0077b6]/50 space-y-3">
            <h4 className="font-extrabold text-sm text-white">Arsip Foto Nota &amp; Kuitansi</h4>
            <p className="text-xs text-[#90e0ef] leading-relaxed">
              Foto bukti servis tersimpan aman di cloud terenkripsi PostgreSQL Neon.
            </p>
            <div className="p-3 bg-[#03045e] rounded-xl border border-[#00b4d8]/60 flex items-center justify-center gap-2 text-xs font-bold text-[#00b4d8]">
              <Upload className="w-4 h-4" />
              <span>Simpan Nota Otomatis</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mobile Android & Web App Integration Banner (Deep Twilight) */}
      <section className="px-5 py-3">
        <div className="bg-[#03045e] text-white rounded-2xl p-4 shadow-md flex items-center gap-3 border border-[#0077b6]/50">
          <div className="w-12 h-12 rounded-xl bg-[#02033b] flex items-center justify-center shrink-0 text-[#00b4d8]">
            <SmartphoneDevice className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-xs text-white">Ringan &amp; Siap di HP Android</h4>
            <p className="text-[10px] text-[#90e0ef] leading-relaxed">
              Buka lewat browser Chrome/Safari, simpan sebagai PWA, atau integrasikan ke APK Android WebView secara instan.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Mobile Pricing Quick Card (Deep Twilight + Turquoise #00b4d8 Glow) */}
      <section className="px-5 py-4 space-y-3">
        <h3 className="font-extrabold text-lg text-[#03045e]">Pilihan Paket</h3>

        <div className="bg-[#03045e] text-white rounded-2xl p-5 border-2 border-[#00b4d8] shadow-[0_4px_16px_-4px_rgba(0,180,216,0.3)] relative space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#00b4d8] uppercase">FixGarasi PRO</span>
              <h4 className="text-2xl font-extrabold text-white font-mono tabular-nums">Rp 149.000 <span className="text-xs font-normal text-[#90e0ef]">/tahun</span></h4>
            </div>
            <span className="bg-[#0077b6] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              Hemat 35%
            </span>
          </div>

          <ul className="space-y-2 text-xs text-[#caf0f8] border-t border-[#0077b6]/50 pt-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#00b4d8] shrink-0" />
              <span>Unlimited Kendaraan (Mobil &amp; Motor)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#00b4d8] shrink-0" />
              <span>Upload Foto Nota Bebas Kuota</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#00b4d8] shrink-0" />
              <span>Garansi 7 Hari &amp; Pembayaran QRIS Midtrans</span>
            </li>
          </ul>

          <Link
            to="/register"
            className="w-full py-3 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white text-xs font-extrabold rounded-xl text-center block shadow-[0_4px_14px_-2px_rgba(0,180,216,0.4)] transition-[transform,background-color] duration-150 cursor-pointer"
          >
            Upgrade ke PRO Sekarang
          </Link>
        </div>
      </section>

      {/* 7. Mobile Accordion FAQ */}
      <section className="px-5 py-4 space-y-3">
        <h3 className="font-extrabold text-base text-[#03045e] text-center">FAQ (Tanya Jawab)</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-[#90e0ef] overflow-hidden shadow-2xs">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-3.5 text-left font-extrabold text-xs text-[#03045e] flex items-center justify-between gap-2 active:bg-[#caf0f8]/30 transition-colors duration-150 cursor-pointer"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <Minus className="w-4 h-4 text-[#0077b6] shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-[#00b4d8] shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-3.5 pb-3.5 text-[11px] text-[#03045e]/80 leading-relaxed border-t border-[#90e0ef]/40 pt-2 bg-[#caf0f8]/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Mobile Footer Links (Deep Twilight) */}
      <footer className="px-5 pt-8 pb-4 text-center space-y-4 text-[#90e0ef] text-xs border-t border-[#0077b6]/30 mt-6 bg-[#03045e]">
        <div className="flex justify-center items-center gap-2">
          <img src="/logo.webp" alt="FixGarasi" className="w-6 h-6 rounded-md bg-white p-0.5" />
          <span className="font-extrabold text-white text-sm">FIX<span className="text-[#00b4d8]">GARASI</span></span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-[#90e0ef] font-bold">
          <button onClick={() => onOpenLegal('terms')} className="cursor-pointer active:scale-95 hover:text-white">Ketentuan</button>
          <button onClick={() => onOpenLegal('privacy')} className="cursor-pointer active:scale-95 hover:text-white">Privasi</button>
          <button onClick={() => onOpenLegal('refund')} className="cursor-pointer active:scale-95 hover:text-white">Refund</button>
          <button onClick={() => onOpenLegal('contact')} className="cursor-pointer active:scale-95 hover:text-white">Bantuan</button>
        </div>
        <p className="text-[10px] text-[#90e0ef]/70">&copy; 2026 FixGarasi Indonesia. Hak Cipta Dilindungi.</p>
      </footer>

      {/* 9. Floating Thumb Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#90e0ef]/80 p-3 shadow-[0_-4px_16px_rgba(3,4,94,0.08)] flex items-center gap-2.5 max-w-lg mx-auto">
        <button
          onClick={handleDemoLogin}
          disabled={demoLoading}
          className="w-1/3 py-2.5 bg-[#caf0f8] hover:bg-[#90e0ef] active:scale-95 text-[#03045e] text-xs font-extrabold rounded-xl transition-[transform,background-color] duration-150 text-center flex items-center justify-center gap-1 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#0077b6]" />
          <span>Demo</span>
        </button>
        <Link
          to="/register"
          className="w-2/3 py-2.5 bg-[#0077b6] hover:bg-[#00b4d8] active:scale-[0.97] text-white text-xs font-extrabold rounded-xl shadow-[0_4px_14px_-2px_rgba(0,119,182,0.35)] text-center flex items-center justify-center gap-1.5 transition-[transform,background-color] duration-150 cursor-pointer"
        >
          <span>Mulai Gratis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
