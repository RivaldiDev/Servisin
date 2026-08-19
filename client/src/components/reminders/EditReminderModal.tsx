import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { WarningCircle } from 'iconoir-react';
import api from '../../services/api';
import { ServiceReminder, ServiceCategory, CATEGORY_LABELS } from '../../types';

interface EditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ServiceReminder | null;
  onSuccess: () => void;
}

export const EditReminderModal: React.FC<EditReminderModalProps> = ({
  isOpen,
  onClose,
  reminder,
  onSuccess,
}) => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<ServiceCategory>('ENGINE_OIL');
  const [intervalKm, setIntervalKm] = useState<string>('');
  const [intervalMonths, setIntervalMonths] = useState<string>('');
  const [lastOdometer, setLastOdometer] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title || '');
      setCategory(reminder.category || 'ENGINE_OIL');
      setIntervalKm(reminder.intervalKm?.toString() || '');
      setIntervalMonths(reminder.intervalMonths?.toString() || '');
      setLastOdometer(reminder.lastServiceOdometer?.toString() || '');
      setNotes(reminder.notes || '');
      setErrorMessage(null);
    }
  }, [reminder, isOpen]);

  if (!reminder) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!intervalKm && !intervalMonths) {
      setErrorMessage('Isi minimal salah satu interval (kilometer atau bulan).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.put(`/reminders/${reminder.id}`, {
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
      setErrorMessage(err.response?.data?.message || 'Gagal memperbarui pengingat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Pengingat Servis"
      subtitle={`${reminder.vehicle?.brand || ''} ${reminder.vehicle?.model || ''} (${reminder.vehicle?.licensePlate || ''})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <WarningCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Category Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Kategori Servis
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
                onClick={() => {
                  setCategory(catKey);
                  if (!title || title.trim().length === 0) {
                    setTitle(CATEGORY_LABELS[catKey]);
                  }
                }}
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
            placeholder="Contoh: Ganti Oli Mesin 5000 KM"
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
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
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
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
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
            <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
              KM
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Catatan Tambahan
          </label>
          <textarea
            rows={2}
            placeholder="Merk oli rekomendasi, jenis part, dll."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none font-medium"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};