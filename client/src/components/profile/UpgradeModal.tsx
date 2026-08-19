import React, { useState } from 'react';
import { Xmark, Sparks, CheckCircle, ShieldCheck, CreditCard, ArrowRight } from 'iconoir-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { refreshUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [showSimulateButton, setShowSimulateButton] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setLoading(true);
    setShowSimulateButton(false);
    try {
      const res = await api.post('/payments/create-snap-token', {
        planType: selectedPlan,
      });

      if (res.data.success) {
        const { snapToken, orderId } = res.data.data;
        setActiveOrderId(orderId);

        // Check if Midtrans Snap popup is loaded in window
        if (window.snap && snapToken && !snapToken.startsWith('mock-snap-token')) {
          window.snap.pay(snapToken, {
            onSuccess: async (result: any) => {
              console.log('Payment success:', result);
              await refreshUser();
              if (onSuccess) onSuccess();
              onClose();
            },
            onPending: (result: any) => {
              console.log('Payment pending:', result);
              alert('Menunggu penyelesaian pembayaran. Silakan cek instruksi pembayaran.');
            },
            onError: (result: any) => {
              console.error('Payment error:', result);
              alert('Terjadi kendala saat pembayaran. Silakan coba kembali.');
            },
            onClose: () => {
              setShowSimulateButton(true);
            },
          });
        } else {
          // If in sandbox mock mode or window.snap not found
          setShowSimulateButton(true);
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memproses pembuatan transaksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!activeOrderId) return;
    setSimulating(true);
    try {
      const res = await api.post('/payments/simulate-success', {
        orderId: activeOrderId,
      });
      if (res.data.success) {
        await refreshUser();
        alert('Selamat! Paket FixGarasi PRO Anda telah aktif.');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal simulasi pembayaran.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Sparks className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Upgrade ke FixGarasi PRO</h3>
              <p className="text-[11px] text-slate-500">Buka akses penuh seluruh fitur garasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <Xmark className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Plan Selector */}
          <div className="grid grid-cols-2 gap-3">
            {/* Monthly */}
            <div
              onClick={() => setSelectedPlan('MONTHLY')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === 'MONTHLY'
                  ? 'border-brand-600 bg-brand-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Paket Bulanan</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-base font-extrabold text-slate-900">Rp 19.000</span>
                <span className="text-[10px] text-slate-500">/bln</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Cocok untuk coba fleksibel</p>
            </div>

            {/* Yearly */}
            <div
              onClick={() => setSelectedPlan('YEARLY')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                selectedPlan === 'YEARLY'
                  ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                HEMAT 35%
              </div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase">Paket Tahunan</span>
              <div className="mt-1 flex items-baseline gap-0.5">
                <span className="text-base font-extrabold text-slate-900">Rp 149.000</span>
                <span className="text-[10px] text-slate-500">/thn</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Hanya ~Rp 12.400/bln</p>
            </div>
          </div>

          {/* Features Comparison List */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
            <h4 className="font-extrabold text-slate-900 text-xs">Keuntungan FixGarasi PRO:</h4>
            <div className="space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Garasi Tanpa Batas:</strong> Tambah seluruh mobil & motor Anda.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Upload Nota & Kuitansi:</strong> Simpan foto bukti servis tak terbatas.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Laporan Pengeluaran Lengkap:</strong> Grafik 12 bulan & analitik sparepart.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Pengingat Servis Prioritas:</strong> Notifikasi KM & interval waktu berkala.</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span className="font-bold text-slate-800">Midtrans Payment Gateway</span>
            </div>
            <span className="text-slate-500 text-[10px]">QRIS, VA Bank, GoPay, ShopeePay</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 tap-bounce disabled:opacity-50"
          >
            {loading ? (
              <span>Menghubungkan ke Midtrans...</span>
            ) : (
              <>
                <span>Bayar {selectedPlan === 'YEARLY' ? 'Rp 149.000 / Tahun' : 'Rp 19.000 / Bulan'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {showSimulateButton && (
            <button
              onClick={handleSimulateSuccess}
              disabled={simulating}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {simulating ? 'Mengaktifkan...' : 'Konfirmasi Simulasi Pembayaran Sukses'}
            </button>
          )}

          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Pembayaran terenkripsi 256-bit & Garansi Uang Kembali 7 Hari
          </p>
        </div>
      </div>
    </div>
  );
};
