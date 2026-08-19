import React, { useState } from 'react';
import { Xmark, ShieldCheck, Page, HelpCircle, RefreshDouble } from 'iconoir-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'refund' | 'contact';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>(initialTab);

  if (!isOpen) return null;

  const getTabClass = (tab: 'terms' | 'privacy' | 'refund' | 'contact') => {
    const isSelected = activeTab === tab;
    return (
      'py-3 px-3 text-xs font-extrabold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ' +
      (isSelected
        ? 'border-brand-600 text-brand-600'
        : 'border-transparent text-slate-500 hover:text-slate-700')
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Informasi Legal & Layanan</h3>
              <p className="text-[11px] text-slate-500">FixGarasi - Manajemen Kendaraan SaaS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <Xmark className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-white px-3 gap-1 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('terms')} className={getTabClass('terms')}>
            <Page className="w-3.5 h-3.5" />
            Ketentuan Layanan
          </button>
          <button onClick={() => setActiveTab('privacy')} className={getTabClass('privacy')}>
            <ShieldCheck className="w-3.5 h-3.5" />
            Kebijakan Privasi
          </button>
          <button onClick={() => setActiveTab('refund')} className={getTabClass('refund')}>
            <RefreshDouble className="w-3.5 h-3.5" />
            Pembayaran & Refund
          </button>
          <button onClick={() => setActiveTab('contact')} className={getTabClass('contact')}>
            <HelpCircle className="w-3.5 h-3.5" />
            Bantuan
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">1. Ketentuan Penggunaan Layanan FixGarasi</h4>
              <p>
                Selamat datang di FixGarasi. Dengan mengakses dan menggunakan platform SaaS FixGarasi (aplikasi web maupun mobile), Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut.
              </p>
              <h5 className="font-bold text-slate-800">Akun & Keamanan</h5>
              <p>
                Pengguna bertanggung jawab penuh atas kerahasiaan kata sandi dan seluruh aktivitas yang terjadi di dalam akun Anda. Anda dilarang membagikan kredensial akun kepada pihak yang tidak berwenang.
              </p>
              <h5 className="font-bold text-slate-800">Paket Layanan SaaS</h5>
              <p>
                FixGarasi menyediakan tier <strong>Free</strong> (hingga 2 unit kendaraan) dan <strong>Pro</strong> (kendaraan tak terbatas, analitik mendalam, dan kapasitas penyimpanan bukti servis tak terbatas).
              </p>
              <h5 className="font-bold text-slate-800">Kepemilikan Data</h5>
              <p>
                Seluruh catatan servis, foto nota, dan data garasi yang Anda masukkan adalah hak milik Anda sepenuhnya. Kami tidak memperjualbelikan data garasi atau riwayat servis Anda kepada pihak ketiga.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">2. Kebijakan Privasi (Privacy Policy)</h4>
              <p>
                FixGarasi menghormati privasi setiap pengguna. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
              </p>
              <h5 className="font-bold text-slate-800">Data yang Kami Kumpulkan</h5>
              <ul className="list-disc pl-4 space-y-1">
                <li>Informasi Akun: Nama lengkap, alamat email, nomor telepon (opsional).</li>
                <li>Data Kendaraan: Merk, model, plat nomor, tahun pembuatan, angka odometer, dan nomor rangka/mesin.</li>
                <li>Riwayat Servis: Tanggal pengerjaan, nama bengkel, rincian biaya sparepart, serta foto struk/nota pengerjaan.</li>
              </ul>
              <h5 className="font-bold text-slate-800">Keamanan Data</h5>
              <p>
                Kami menerapkan enkripsi standar industri (HTTPS TLS 1.3, salted bcrypt hash untuk password, dan JWT berdurasi terbatas) untuk mencegah akses tidak sah ke data Anda.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">3. Kebijakan Pembayaran & Pengembalian Dana (Refund)</h4>
              <p>
                Pembayaran paket FixGarasi PRO diproses melalui mitra gerbang pembayaran resmi berlisensi Bank Indonesia (termasuk QRIS, Virtual Account Multi-Bank, dan E-Wallet).
              </p>
              <h5 className="font-bold text-slate-800">Tarif Langganan</h5>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Paket Bulanan:</strong> Rp 19.000 / bulan</li>
                <li><strong>Paket Tahunan:</strong> Rp 149.000 / tahun (Hemat 35%)</li>
              </ul>
              <h5 className="font-bold text-slate-800">Ketentuan Refund</h5>
              <p>
                Pengembalian dana (refund) dapat diajukan dalam waktu maksimal <strong>7 hari kalender</strong> sejak tanggal transaksi jika terjadi kendala teknis pada sistem yang membuat fitur Pro tidak dapat diakses. Hubungi customer support kami dengan menyertakan bukti Order ID Midtrans.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">4. Kontak & Layanan Pelanggan</h4>
              <p>
                Tim bantuan FixGarasi siap membantu Anda jika mengalami kendala transaksi atau pertanyaan operasional:
              </p>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <p><strong>Email Bantuan:</strong> support@fixgarasi.id</p>
                <p><strong>WhatsApp Resmi:</strong> +62 812-3456-7890</p>
                <p><strong>Jam Operasional:</strong> Senin – Minggu (08:00 – 21:00 WIB)</p>
                <p><strong>Lokasi:</strong> Jakarta, Indonesia</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
