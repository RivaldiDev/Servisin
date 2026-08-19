import React, { useState, useEffect } from 'react';
import { Search, Plus, Wrench, Calendar, Page } from 'iconoir-react';
import api from '../services/api';
import { ServiceLog, Vehicle, CATEGORY_LABELS } from '../types';
import { AddServiceModal } from '../components/services/AddServiceModal';
import { EditServiceModal } from '../components/services/EditServiceModal';
import { ServiceDetailModal } from '../components/services/ServiceDetailModal';

export const ServicesPage: React.FC = () => {
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<ServiceLog | null>(null);
  const [selectedLogForEdit, setSelectedLogForEdit] = useState<ServiceLog | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsRes, vehRes] = await Promise.all([
        api.get('/service-logs'),
        api.get('/vehicles'),
      ]);

      if (logsRes.data.success) {
        const list = Array.isArray(logsRes.data.data) ? logsRes.data.data : logsRes.data.data?.logs || [];
        setLogs(list);
      }
      if (vehRes.data.success) setVehicles(vehRes.data.data);
    } catch (e) {
      console.error('Failed to load services data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesVehicle =
      selectedVehicleId === 'ALL' || log.vehicleId === selectedVehicleId;
    const matchesSearch =
      searchQuery === '' ||
      log.workshopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.items?.some((i) =>
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      log.vehicle?.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vehicle?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      log.items?.some((i) => i.category === selectedCategory);

    return matchesVehicle && matchesSearch && matchesCategory;
  });

  const totalSpent = filteredLogs.reduce((sum, l) => sum + l.totalCost, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Riwayat Servis</h2>
          <p className="text-xs text-slate-500">
            {filteredLogs.length} catatan servis tercatat
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-brand-500/20 transition-colors tap-bounce"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama bengkel, oli, plat nomor, sparepart..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Filters pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Vehicle filter */}
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="ALL">Semua Kendaraan</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.licensePlate})
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="ALL">Semua Kategori</option>
            {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
              <option key={catKey} value={catKey}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Filtered Cost Banner */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-xs">
        <span className="text-xs font-semibold text-slate-500">Total Pengeluaran:</span>
        <span className="text-sm font-extrabold font-mono text-brand-700">
          Rp {totalSpent.toLocaleString('id-ID')}
        </span>
      </div>

      {/* Logs List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">
            Tidak ada riwayat servis yang cocok.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
          >
            Catat Servis Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLogForDetail(log)}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-brand-300 transition-all cursor-pointer space-y-2.5"
            >
              {/* Header: Date, Vehicle, Cost */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">
                      {new Date(log.serviceDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="font-mono font-bold text-slate-700">
                      {log.odometer.toLocaleString('id-ID')} km
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    {log.workshopName || 'Servis Berkala'}
                  </h4>
                  {log.vehicle && (
                    <p className="text-[11px] text-slate-500">
                      {log.vehicle.brand} {log.vehicle.model} ({log.vehicle.licensePlate})
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold font-mono text-brand-600 block">
                    Rp {log.totalCost.toLocaleString('id-ID')}
                  </span>
                  {log.invoicePhotoUrl && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md mt-1">
                      <Page className="w-3 h-3" />
                      Ada Nota
                    </span>
                  )}
                </div>
              </div>

              {/* Items chips */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {log.items?.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
                  >
                    {item.description} (Rp {item.cost.toLocaleString('id-ID')})
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchData();
        }}
      />

      <ServiceDetailModal
        isOpen={!!selectedLogForDetail}
        onClose={() => setSelectedLogForDetail(null)}
        serviceLog={selectedLogForDetail}
        onDeleted={() => {
          setSelectedLogForDetail(null);
          fetchData();
        }}
        onEdit={(log) => {
          setSelectedLogForDetail(null);
          setSelectedLogForEdit(log);
        }}
      />

      <EditServiceModal
        isOpen={!!selectedLogForEdit}
        onClose={() => setSelectedLogForEdit(null)}
        serviceLog={selectedLogForEdit}
        onSuccess={() => {
          setSelectedLogForEdit(null);
          fetchData();
        }}
      />
    </div>
  );
};
