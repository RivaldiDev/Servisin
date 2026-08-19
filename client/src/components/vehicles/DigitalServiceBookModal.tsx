import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Printer, Copy, Check, Calendar, Wrench } from 'iconoir-react';
import { Vehicle, ServiceLog, CATEGORY_LABELS } from '../../types';

interface DigitalServiceBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  ownerName?: string;
}

export const DigitalServiceBookModal: React.FC<DigitalServiceBookModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  ownerName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!vehicle) return null;

  const logs: ServiceLog[] = vehicle.serviceLogs || [];
  const totalCost = logs.reduce((sum, l) => sum + l.totalCost, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    let text = `📄 *BUKU SERVIS DIGITAL - SERVISIN*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🚗 *Kendaraan:* ${vehicle.brand} ${vehicle.model} (${vehicle.year})\n`;
    text += `🔢 *Plat Nomor:* ${vehicle.licensePlate}\n`;
    text += `📍 *Odometer Terkini:* ${vehicle.currentOdometer.toLocaleString('id-ID')} km\n`;
    text += `💰 *Total Biaya Servis Terdata:* Rp ${totalCost.toLocaleString('id-ID')} (${logs.length}x servis)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `*RIWAYAT SERVIS BERKALA:*\n`;

    if (logs.length === 0) {
      text += `Belum ada riwayat servis yang tercatat.\n`;
    } else {
      logs.forEach((log, idx) => {
        const d = new Date(log.serviceDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        text += `\n${idx + 1}. *Tanggal:* ${d} | *KM:* ${log.odometer.toLocaleString('id-ID')} km\n`;
        if (log.workshopName) text += `   *Bengkel:* ${log.workshopName}\n`;
        text += `   *Total Biaya:* Rp ${log.totalCost.toLocaleString('id-ID')}\n`;
        if (log.items && log.items.length > 0) {
          text += `   *Rincian:*\n`;
          log.items.forEach((item) => {
            text += `   • ${item.description} (Rp ${item.cost.toLocaleString('id-ID')})\n`;
          });
        }
        if (log.notes) {
          text += `   *Catatan:* ${log.notes}\n`;
        }
      });
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `_Dicatat otomatis via Servisin Digital Garage._`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buku Servis Digital"
      subtitle={`${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
          <button
            onClick={handleCopyWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Teks WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>
        </div>

        {/* Printable Document Sheet */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 text-xs font-sans">
          {/* Header Card */}
          <div className="border-b border-slate-200 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-brand-600 font-extrabold text-xs tracking-wider uppercase mb-1">
                <Wrench className="w-3.5 h-3.5" />
                <span>Buku Riwayat Servis Digital</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900">
                {vehicle.brand} {vehicle.model}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded text-[11px]">
                  {vehicle.licensePlate}
                </span>
                <span className="text-slate-500 font-semibold">Tahun {vehicle.year}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-semibold block">Odometer Saat Ini</span>
              <span className="text-sm font-extrabold font-mono text-slate-900">
                {vehicle.currentOdometer.toLocaleString('id-ID')} km
              </span>
              {ownerName && (
                <p className="text-[10px] text-slate-500 mt-1">Pemilik: {ownerName}</p>
              )}
            </div>
          </div>

          {/* Quick Summary Strip */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Servis Tercatat</span>
              <p className="text-sm font-extrabold text-slate-800">{logs.length} Kali Servis</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Akumulasi Biaya</span>
              <p className="text-sm font-extrabold font-mono text-brand-700">
                Rp {totalCost.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Chronological Table of Services */}
          <div>
            <h3 className="font-extrabold text-slate-800 mb-2">Riwayat Pengerjaan Servis:</h3>

            {logs.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Belum ada catatan servis pada kendaraan ini.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <strong className="text-slate-700">
                            {new Date(log.serviceDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </strong>
                          <span>•</span>
                          <span className="font-mono">{log.odometer.toLocaleString('id-ID')} km</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs mt-0.5">
                          {log.workshopName || 'Servis Rutin'}
                        </h4>
                      </div>

                      <span className="font-mono font-extrabold text-brand-700 text-xs">
                        Rp {log.totalCost.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Item list */}
                    {log.items && log.items.length > 0 && (
                      <div className="bg-white p-2 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                        {log.items.map((item, iIdx) => (
                          <div key={iIdx} className="flex items-center justify-between text-slate-700">
                            <span>
                              <strong className="text-[10px] text-brand-600 bg-brand-50 px-1 rounded mr-1">
                                {CATEGORY_LABELS[item.category] || item.category}
                              </strong>
                              {item.description}
                            </span>
                            <span className="font-mono font-medium text-slate-600">
                              Rp {item.cost.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-white/80 p-1.5 rounded">
                        Catatan: {log.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer certification badge */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Servisin Cloud SaaS Platform</span>
            <span>Verifikasi Garasi Digital</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
};