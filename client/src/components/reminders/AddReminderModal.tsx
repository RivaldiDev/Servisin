import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { WarningCircle } from 'iconoir-react';
import api from '../../services/api';
import { Vehicle, ServiceCategory, CATEGORY_LABELS } from '../../types';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialVehicleId?: string;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialVehicleId,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [title, setTitle] = useState<string>('Ganti Oli Mesin');
  const [category, setCategory] = useState<ServiceCategory>('ENGINE_OIL');
  const [intervalKm, setIntervalKm] = useState<string>('5000');
  const [intervalMonths, setIntervalMonths] = useState<string>('6');
  const [lastOdometer, setLastOdometer] = useState<string>('0');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.get('/vehicles').then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setVehicles(res.data.data);
          const target = initialVehicleId || res.data.data[0].id;
          setSelectedVehicleId(target);

          const currentVeh = res.data.data.find((v: Vehicle) => v.id === target);
          if (currentVeh) {
            setLastOdometer(currentVeh.currentOdometer.toString());
          }
        }
      });
    }
  }, [isOpen, initialVehicleId]);

  const handleCategoryPreset = (cat: ServiceCategory) => {
    setCategory(cat);
    setTitle(CATEGORY_LABELS[cat] || 'Servis Berkala');

    if (cat === 'ENGINE_OIL') {
      setIntervalKm('5000');
      setIntervalMonths('6');
    } else if (cat === 'TRANSMISSION_OIL') {
      setIntervalKm('20000');
      setIntervalMonths('12');
    } else if (cat === 'BRAKE') {
      setIntervalKm('10000');
      setIntervalMonths('12');
    } else if (cat === 'TIRES') {
      setIntervalKm('30000');
      setIntervalMonths('24');
    } else if (cat === 'BATTERY') {
      setIntervalKm('');
      setIntervalMonths('18');
    } else if (cat === 'SPARK_PLUG') {
      setIntervalKm('10000');
      setIntervalMonths('12');
    } else {
      setIntervalKm('10000');
      setIntervalMonths('12');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedVehicleId) {
      setErrorMessage('Pilih kendaraan terlebih dahulu.');
      return;
    }

    if (!intervalKm && !intervalMonths) {
      setErrorMessage('Isi minimal salah satu interval (kilometer atau bulan).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/reminders', {
        vehicleId: selectedVehicleId,
        title,
        category,
        intervalKm: intervalKm ? parseInt(intervalKm, 10) : null,
        intervalMonths: intervalMonths ? parseInt(intervalMonths, 10) : null,
        lastServiceOdometer: lastOdometer ? parseInt(lastOdometer, 10) : null,
        notes,
      });

      if (res.data.success) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal membuat pengingat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Pengingat Servis"
      subtitle="Atur interval waktu atau kilometer untuk pengingat servis rutin"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <WarningCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Vehicle Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Pilih Kendaraan
          </label>
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              const v = vehicles.find((veh) => veh.id === e.target.value);
              if (v) setLastOdometer(v.currentOdometer.toString());
            }}
            required
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.licensePlate})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Category Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Pilihan Kategori Servis
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                'ENGINE_OIL',
                'BRAKE',
                'TIRES',
                'TUNE_UP',
                'BATTERY',
                'TRANSMISSION_OIL',
              ] as ServiceCategory[]
            ).map((catKey) => (
              <button
                key={catKey}
                type="button"
                onClick={() => handleCategoryPreset(catKey)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  category === catKey
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {CATEGORY_LABELS[catKey]}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Nama Pengingat
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Ganti Oli Mesin Shell 5000 KM"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Intervals */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tiap Berapa KM?
            </label>
            <div className="relative">
              <input
                type="number"
                min="500"
                step="500"
                placeholder="5000"
                value={intervalKm}
                onChange={(e) => setIntervalKm(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                KM
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Atau Tiap Bulan?
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="60"
                placeholder="6"
                value={intervalMonths}
                onChange={(e) => setIntervalMonths(e.target.value)}
                className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                Bln
              </span>
            </div>
          </div>
        </div>

        {/* Odometer Terakhir */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            KM Terakhir Servis Dilakukan
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              value={lastOdometer}
              onChange={(e) => setLastOdometer(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
              KM
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Merk oli rekomendasi, jenis part, nomor mekanik langganan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none font-medium"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Menyimpan...' : 'Simpan Pengingat'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
