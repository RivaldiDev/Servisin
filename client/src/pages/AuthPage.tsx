import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Shield,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
} from 'iconoir-react';
import { useAuth } from '../context/AuthContext';
import { LegalModal } from '../components/profile/LegalModal';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>('terms');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (isLoginTab) {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/');
      } else {
        setErrorMessage(result.message || 'Email atau kata sandi salah.');
      }
    } else {
      const result = await register({ fullName, email, password, phoneNumber });
      if (result.success) {
        navigate('/');
      } else {
        setErrorMessage(result.message || 'Gagal mendaftarkan akun.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col">
        {/* Brand Banner */}
        <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white p-6 pb-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                SERVIS<span className="text-amber-300">IN</span>
              </h1>
              <p className="text-[11px] text-brand-100 font-medium">
                SaaS Manajemen Servis Kendaraan Pribadi
              </p>
            </div>
          </div>

          <p className="text-xs text-brand-100/90 leading-relaxed mt-2">
            Catat riwayat perbaikan mobil & motor, simpan bukti nota, dan pantau pengingat servis berkala secara akurat.
          </p>

          {/* Quick Features */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15 text-[11px]">
            <div className="flex items-center gap-1.5 text-white/90">
              <CheckCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Multi-Garasi Mobil/Motor</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <CheckCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Pengingat KM & Waktu</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="p-6 pt-5 flex-1 flex flex-col">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(true);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                isLoginTab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginTab(false);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                !isLoginTab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <WarningCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="08123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 tap-bounce disabled:opacity-50"
              >
                {loading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    <span>{isLoginTab ? 'Masuk ke Servisin' : 'Buat Akun Baru'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center space-y-1.5 pt-1">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Data garasi & riwayat servis Anda aman terenkripsi
                </p>
                <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => { setLegalTab('terms'); setLegalOpen(true); }}
                    className="hover:underline hover:text-slate-600"
                  >
                    Ketentuan Layanan
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => { setLegalTab('privacy'); setLegalOpen(true); }}
                    className="hover:underline hover:text-slate-600"
                  >
                    Kebijakan Privasi
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => { setLegalTab('refund'); setLegalOpen(true); }}
                    className="hover:underline hover:text-slate-600"
                  >
                    Refund & Billing
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <LegalModal
        isOpen={legalOpen}
        onClose={() => setLegalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
};
