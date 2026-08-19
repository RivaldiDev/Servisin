import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { DashboardSpeed, Plus } from 'iconoir-react';
import api from '../../services/api';
import { Vehicle } from '../../types';

interface UpdateOdometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSuccess: () => void;
}

export const UpdateOdometerModal: React.FC<UpdateOdometerModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSuccess,
}) => {
  const [odometer, setOdometer] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (vehicle) {
      setOdometer(vehicle.currentOdometer.toString());
      setErrorMessage(null);
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const handleIncrement = (amount: number) => {
    const current = parseInt(odometer || '0', 10) || 0;
    setOdometer((current + amount).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await api.patch(`/vehicles/${vehicle.id}/odometer`, {
        odometer: parseInt(odometer, 10),
      });

      if (res.data.success) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal memperbarui odometer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perbarui Odometer"
      subtitle={`${vehicle.brand} ${vehicle.model} • ${vehicle.licensePlate}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Total Kilometer Terkini
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="0"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <DashboardSpeed className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            <span className="absolute right-3 top-3.5 text-xs font-bold text-slate-400 font-mono">
              KM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Sebelumnya:{' '}
            <span className="font-mono font-semibold text-slate-600">
              {vehicle.currentOdometer.toLocaleString('id-ID')} km
            </span>
          </p>
        </div>

        {/* Quick Increment Buttons */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
            Tambah Cepat:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[50, 100, 500, 1000].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => handleIncrement(inc)}
                className="py-1.5 px-2 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                {inc}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Memperbarui...' : 'Simpan Odometer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
