import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Car, Motorcycle, Upload, WarningCircle } from 'iconoir-react';
import api from '../../services/api';
import { Vehicle } from '../../types';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSuccess: () => void;
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSuccess,
}) => {
  const [type, setType] = useState<'CAR' | 'MOTORCYCLE'>('CAR');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [year, setYear] = useState('');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (vehicle) {
      setType(vehicle.type || 'CAR');
      setBrand(vehicle.brand || '');
      setModel(vehicle.model || '');
      setLicensePlate(vehicle.licensePlate || '');
      setYear(vehicle.year?.toString() || new Date().getFullYear().toString());
      setNotes(vehicle.notes || '');
      setPhotoFile(null);
      setPhotoPreview(vehicle.photoUrl || null);
      setErrorMessage(null);
    }
  }, [vehicle, isOpen]);

  if (!vehicle) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('licensePlate', licensePlate);
      formData.append('year', year);
      formData.append('notes', notes);

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await api.put(`/vehicles/${vehicle.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal memperbarui kendaraan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Informasi Kendaraan"
      subtitle={`${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})`}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <WarningCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Vehicle Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Tipe Kendaraan
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('CAR')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                type === 'CAR'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4" />
              Mobil
            </button>
            <button
              type="button"
              onClick={() => setType('MOTORCYCLE')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                type === 'MOTORCYCLE'
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Motorcycle className="w-4 h-4" />
              Motor
            </button>
          </div>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Merk Kendaraan
            </label>
            <input
              type="text"
              required
              placeholder="Honda / Toyota"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Model / Seri
            </label>
            <input
              type="text"
              required
              placeholder="Civic / NMAX"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>
        </div>

        {/* License Plate & Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nomor Plat Polisi
            </label>
            <input
              type="text"
              required
              placeholder="B 1234 ABC"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tahun Pembuatan
            </label>
            <input
              type="number"
              required
              min="1950"
              max={new Date().getFullYear() + 1}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Custom Photo Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Foto Kendaraan
          </label>
          <div className="flex items-center gap-3">
            {photoPreview && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors text-slate-500 hover:text-brand-600">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {photoFile ? 'Ganti File Foto' : 'Pilih Foto Baru'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Catatan Khusus
          </label>
          <textarea
            rows={2}
            placeholder="No. Rangka, No. Mesin, warna mobil, oli rekomendasi, dll."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none font-medium"
          />
        </div>

        {/* Action Buttons */}
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
            className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};