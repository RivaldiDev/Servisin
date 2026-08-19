import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Plus, Trash, Upload, WarningCircle } from 'iconoir-react';
import api from '../../services/api';
import { Vehicle, ServiceCategory, CATEGORY_LABELS } from '../../types';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialVehicleId?: string;
}

interface ServiceItemInput {
  category: ServiceCategory;
  description: string;
  cost: number;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialVehicleId,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [serviceDate, setServiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [odometer, setOdometer] = useState<string>('0');
  const [workshopName, setWorkshopName] = useState<string>('');
  const [workshopAddress, setWorkshopAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [items, setItems] = useState<ServiceItemInput[]>([
    { category: 'ENGINE_OIL', description: 'Ganti Oli Mesin', cost: 150000 },
  ]);

  const [invoicePhoto, setInvoicePhoto] = useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch user vehicles
  useEffect(() => {
    if (isOpen) {
      api.get('/vehicles').then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setVehicles(res.data.data);
          const target = initialVehicleId || res.data.data[0].id;
          setSelectedVehicleId(target);

          const currentVeh = res.data.data.find((v: Vehicle) => v.id === target);
          if (currentVeh) {
            setOdometer(currentVeh.currentOdometer.toString());
          }
        }
      });
    }
  }, [isOpen, initialVehicleId]);

  const handleVehicleChange = (vId: string) => {
    setSelectedVehicleId(vId);
    const matched = vehicles.find((v) => v.id === vId);
    if (matched) {
      setOdometer(matched.currentOdometer.toString());
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { category: 'GENERAL_CHECKUP', description: '', cost: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ServiceItemInput, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInvoicePhoto(file);
      setInvoicePreview(URL.createObjectURL(file));
    }
  };

  const totalCalculatedCost = items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedVehicleId) {
      setErrorMessage('Pilih kendaraan terlebih dahulu.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Tambahkan minimal satu rincian item servis.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('vehicleId', selectedVehicleId);
      formData.append('serviceDate', serviceDate);
      formData.append('odometer', odometer);
      if (workshopName) formData.append('workshopName', workshopName);
      if (workshopAddress) formData.append('workshopAddress', workshopAddress);
      if (notes) formData.append('notes', notes);
      formData.append('items', JSON.stringify(items));
      formData.append('totalCost', totalCalculatedCost.toString());

      if (invoicePhoto) {
        formData.append('invoicePhoto', invoicePhoto);
      }

      const res = await api.post('/service-logs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        // Reset form
        setWorkshopName('');
        setWorkshopAddress('');
        setNotes('');
        setInvoicePhoto(null);
        setInvoicePreview(null);
        setItems([{ category: 'ENGINE_OIL', description: 'Ganti Oli Mesin', cost: 150000 }]);
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mencatat servis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Riwayat Servis Baru"
      subtitle="Input detail pengerjaan servis dan foto nota bengkel"
      maxWidth="md"
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
            onChange={(e) => handleVehicleChange(e.target.value)}
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

        {/* Date & Odometer */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tanggal Servis
            </label>
            <input
              type="date"
              required
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Odometer (KM Servis)
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="absolute right-2.5 top-2.5 text-xs font-bold text-slate-400 font-mono">
                KM
              </span>
            </div>
          </div>
        </div>

        {/* Workshop info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Bengkel
            </label>
            <input
              type="text"
              placeholder="Contoh: Auto2000 / AHASS"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lokasi / Kota Bengkel
            </label>
            <input
              type="text"
              placeholder="Contoh: Jakarta Selatan"
              value={workshopAddress}
              onChange={(e) => setWorkshopAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Itemized Service List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              Rincian Pekerjaan & Sparepart
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-2 py-1 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Item
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 relative"
              >
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={item.category}
                    onChange={(e) =>
                      handleItemChange(index, 'category', e.target.value as ServiceCategory)
                    }
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                      <option key={catKey} value={catKey}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                      title="Hapus baris"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <input
                      type="text"
                      required
                      placeholder="Keterangan (mis: Oli 10W-40 4L)"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="Biaya (Rp)"
                      value={item.cost || ''}
                      onChange={(e) =>
                        handleItemChange(index, 'cost', parseInt(e.target.value, 10) || 0)
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Cost Display */}
          <div className="mt-3 p-3 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-brand-900">Total Biaya Servis:</span>
            <span className="text-sm font-extrabold text-brand-700 font-mono">
              Rp {totalCalculatedCost.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Invoice / Receipt Photo Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Foto Nota / Invoice Bengkel (Opsional)
          </label>
          <div className="flex items-center gap-3">
            {invoicePreview && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <img
                  src={invoicePreview}
                  alt="Invoice"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors text-slate-500 hover:text-brand-600">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {invoicePhoto ? 'Ganti Foto Nota' : 'Upload Foto Nota/Kwitansi'}
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
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Catatan dari mekanik, garansi pekerjaan, keluhan yang sudah beres, dll."
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
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Menyimpan Catatan...' : 'Simpan Riwayat Servis'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
