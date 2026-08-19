import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Calendar, DashboardSpeed, MapPin, Page, Trash, Expand, WarningCircle } from 'iconoir-react';
import { ServiceLog, CATEGORY_LABELS } from '../../types';
import api from '../../services/api';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceLog: ServiceLog | null;
  onDeleted: () => void;
  onEdit?: (serviceLog: ServiceLog) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  serviceLog,
  onDeleted,
  onEdit,
}) => {
  const [showPhotoZoom, setShowPhotoZoom] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!serviceLog) return null;

  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus catatan riwayat servis ini?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      const res = await api.delete(`/service-logs/${serviceLog.id}`);
      if (res.data.success) {
        onDeleted();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus catatan.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Detail Riwayat Servis"
        subtitle={`${serviceLog.vehicle?.brand || ''} ${serviceLog.vehicle?.model || ''} (${serviceLog.vehicle?.licensePlate || ''})`}
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <WarningCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Tanggal</p>
                <p className="text-xs font-bold text-slate-800">
                  {new Date(serviceLog.serviceDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
              <DashboardSpeed className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Odometer</p>
                <p className="text-xs font-bold text-slate-800 font-mono">
                  {serviceLog.odometer.toLocaleString('id-ID')} km
                </p>
              </div>
            </div>
          </div>

          {/* Workshop Info */}
          {serviceLog.workshopName && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">{serviceLog.workshopName}</p>
                {serviceLog.workshopAddress && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{serviceLog.workshopAddress}</p>
                )}
              </div>
            </div>
          )}

          {/* Itemized Services */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">Rincian Item & Sparepart</h4>
            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {serviceLog.items && serviceLog.items.length > 0 ? (
                serviceLog.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 px-2 bg-white rounded-lg border border-slate-100 text-xs"
                  >
                    <div>
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 bg-brand-50 text-brand-700 rounded mr-1.5">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="font-semibold text-slate-800">{item.description}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                      Rp {item.cost.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-1 text-center">Tidak ada rincian item.</p>
              )}

              {/* Total Row */}
              <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between px-2">
                <span className="text-xs font-bold text-slate-700">Total Biaya:</span>
                <span className="text-sm font-extrabold text-brand-700 font-mono">
                  Rp {serviceLog.totalCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {serviceLog.notes && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1">Catatan</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {serviceLog.notes}
              </p>
            </div>
          )}

          {/* Invoice Receipt Photo */}
          {serviceLog.invoicePhotoUrl && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Page className="w-4 h-4 text-brand-600" />
                Foto Nota / Invoice
              </h4>
              <div
                onClick={() => setShowPhotoZoom(true)}
                className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group"
              >
                <img
                  src={serviceLog.invoicePhotoUrl}
                  alt="Nota Servis"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold gap-1.5">
                  <Expand className="w-4 h-4" />
                  Klik untuk Memperbesar
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Trash className="w-4 h-4" />
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </button>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(serviceLog)}
                  className="px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Edit Servis
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Photo Zoom Fullscreen Modal */}
      {showPhotoZoom && serviceLog.invoicePhotoUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowPhotoZoom(false)}
        >
          <img
            src={serviceLog.invoicePhotoUrl}
            alt="Zoom Nota"
            className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
};
