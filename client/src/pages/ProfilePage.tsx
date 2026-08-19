import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Sparks,
  LogOut,
  SmartphoneDevice,
  EditPencil,
  ShieldCheck,
  Page,
  HelpCircle,
  RefreshDouble,
} from 'iconoir-react';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { LegalModal } from '../components/profile/LegalModal';
import { UpgradeModal } from '../components/profile/UpgradeModal';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateTier } = useAuth();
  const [tierLoading, setTierLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>('terms');

  const handleOpenLegal = (tab: 'terms' | 'privacy' | 'refund' | 'contact') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const handleToggleTier = async () => {
    if (!user) return;
    setTierLoading(true);
    await updateTier(user.tier === 'PRO' ? 'FREE' : 'PRO');
    setTierLoading(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">Profil & Pengaturan</h2>
        <p className="text-xs text-slate-500">Kelola akun dan paket langganan Anda</p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center text-xl font-extrabold shadow-md shadow-brand-500/20 uppercase">
            {user?.fullName?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 truncate">
                {user?.fullName}
              </h3>
              <button
                onClick={() => setShowEditProfile(true)}
                className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Edit Profil"
              >
                <EditPencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {user?.email}
            </p>
            {user?.phoneNumber && (
              <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {user.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Tier Management Card */}
      <div
        className={`rounded-3xl border p-5 shadow-xs transition-all space-y-4 ${
          user?.tier === 'PRO'
            ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-300'
            : 'bg-white border-slate-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparks className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Status Paket SaaS
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                Paket {user?.tier === 'PRO' ? 'FixGarasi PRO' : 'FixGarasi Gratis'}
              </h4>
            </div>
          </div>

          <span
            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
              user?.tier === 'PRO'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user?.tier === 'PRO' ? 'AKTIF' : 'FREE'}
          </span>
        </div>

        {/* Pricing tag for Midtrans review transparency */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-slate-900">Tarif FixGarasi PRO:</span>
            <p className="text-[11px] text-slate-500">Mulai Rp 19.000 / bulan</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            Garansi 7 Hari
          </span>
        </div>

        {/* Features comparison */}
        <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-slate-600">
            <span>Maksimal Kuota Kendaraan di Garasi:</span>
            <strong className="text-slate-900 font-bold">
              {user?.tier === 'PRO' ? 'Tanpa Batas (Unlimited)' : '2 Unit Kendaraan'}
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Upload Foto Nota & Kwitansi:</span>
            <strong className="text-slate-900 font-bold">
              {user?.tier === 'PRO' ? 'Tak Terbatas' : 'Tersedia'}
            </strong>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Laporan & Analitik Pengeluaran:</span>
            <strong className="text-slate-900 font-bold">Lengkap 12 Bulan</strong>
          </div>
        </div>

        {/* Midtrans Payment Action */}
        <div className="pt-2 space-y-2">
          <button
            onClick={() => setUpgradeModalOpen(true)}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 tap-bounce"
          >
            <Sparks className="w-4 h-4" />
            <span>{user?.tier === 'PRO' ? 'Perpanjang / Kelola Paket PRO (Midtrans)' : 'Upgrade ke FixGarasi PRO (Midtrans)'}</span>
          </button>

          <button
            onClick={handleToggleTier}
            disabled={tierLoading}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshDouble className="w-3.5 h-3.5" />
            {tierLoading
              ? 'Mengubah status...'
              : user?.tier === 'PRO'
              ? 'Beralih ke Akun Free (Demo Toggle)'
              : 'Aktifkan PRO Instan (Demo Toggle)'}
          </button>
        </div>
      </div>

      {/* Legal, Terms & Customer Support Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Informasi Legal & Layanan Pelanggan</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleOpenLegal('terms')}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 font-bold text-slate-700 flex items-center gap-2 text-left transition-colors"
          >
            <Page className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-[11px] truncate">Syarat & Ketentuan</span>
          </button>
          <button
            onClick={() => handleOpenLegal('privacy')}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 font-bold text-slate-700 flex items-center gap-2 text-left transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-[11px] truncate">Kebijakan Privasi</span>
          </button>
          <button
            onClick={() => handleOpenLegal('refund')}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 font-bold text-slate-700 flex items-center gap-2 text-left transition-colors"
          >
            <RefreshDouble className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-[11px] truncate">Refund & Billing</span>
          </button>
          <button
            onClick={() => handleOpenLegal('contact')}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 font-bold text-slate-700 flex items-center gap-2 text-left transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-[11px] truncate">Hubungi Bantuan</span>
          </button>
        </div>
      </div>

      {/* Android WebView / Device Info */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold">
          <SmartphoneDevice className="w-4 h-4 text-brand-600" />
          <span>Status Aplikasi & Android WebView</span>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Aplikasi ini dirancang responsif *mobile-first* dan siap dijalankan langsung di browser smartphone atau di-embed ke dalam <strong>Android WebView Native</strong>.
        </p>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[11px] text-slate-600 space-y-1">
          <p>
            <strong>Platform:</strong> Web SPA (React + Vite)
          </p>
          <p>
            <strong>Version:</strong> v1.0.0-indonesia-edition
          </p>
          <p>
            <strong>Icon Library:</strong> Iconoir (100% Native Stroke)
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 tap-bounce"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </button>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};
