import React, { useState, useEffect } from 'react';
import { BellNotification, Plus, WarningTriangle, Clock, CheckCircle } from 'iconoir-react';
import api from '../services/api';
import { ServiceReminder, Vehicle } from '../types';
import { ReminderCard } from '../components/reminders/ReminderCard';
import { AddReminderModal } from '../components/reminders/AddReminderModal';
import { EditReminderModal } from '../components/reminders/EditReminderModal';

export const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState<ServiceReminder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OVERDUE' | 'DUE_SOON' | 'ACTIVE'>('ALL');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReminderForEdit, setSelectedReminderForEdit] = useState<ServiceReminder | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [remRes, vehRes] = await Promise.all([
        api.get('/reminders'),
        api.get('/vehicles'),
      ]);

      if (remRes.data.success) setReminders(remRes.data.data);
      if (vehRes.data.success) setVehicles(vehRes.data.data);
    } catch (e) {
      console.error('Failed to load reminders data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteReminder = async (reminder: ServiceReminder) => {
    try {
      const res = await api.post(`/reminders/${reminder.id}/complete`);
      if (res.data.success) {
        fetchData();
      }
    } catch {
      alert('Gagal mereset siklus pengingat.');
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!window.confirm('Yakin ingin menghapus pengingat ini?')) return;
    try {
      const res = await api.delete(`/reminders/${reminderId}`);
      if (res.data.success) {
        fetchData();
      }
    } catch {
      alert('Gagal menghapus pengingat.');
    }
  };

  // Filter
  const filteredReminders = reminders.filter((r) => {
    const matchesVehicle = selectedVehicleId === 'ALL' || r.vehicleId === selectedVehicleId;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesVehicle && matchesStatus;
  });

  const countOverdue = reminders.filter((r) => r.status === 'OVERDUE').length;
  const countDueSoon = reminders.filter((r) => r.status === 'DUE_SOON').length;
  const countActive = reminders.filter((r) => r.status === 'ACTIVE').length;

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Pengingat Servis</h2>
          <p className="text-xs text-slate-500">
            Jadwal perawatan berkala berbasis KM & Waktu
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-brand-500/20 transition-colors tap-bounce"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Baru</span>
        </button>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setFilterStatus(filterStatus === 'OVERDUE' ? 'ALL' : 'OVERDUE')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'OVERDUE'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
            <WarningTriangle className="w-3.5 h-3.5" />
            Terlewat
          </div>
          <p className="text-base font-extrabold text-rose-700 mt-0.5">{countOverdue}</p>
        </button>

        <button
          onClick={() => setFilterStatus(filterStatus === 'DUE_SOON' ? 'ALL' : 'DUE_SOON')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'DUE_SOON'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
            <Clock className="w-3.5 h-3.5" />
            Mendekati
          </div>
          <p className="text-base font-extrabold text-amber-700 mt-0.5">{countDueSoon}</p>
        </button>

        <button
          onClick={() => setFilterStatus(filterStatus === 'ACTIVE' ? 'ALL' : 'ACTIVE')}
          className={`p-2.5 rounded-2xl border text-left transition-all ${
            filterStatus === 'ACTIVE'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            Aman
          </div>
          <p className="text-base font-extrabold text-emerald-700 mt-0.5">{countActive}</p>
        </button>
      </div>

      {/* Vehicle Filter */}
      <div>
        <select
          value={selectedVehicleId}
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none shadow-xs"
        >
          <option value="ALL">Semua Kendaraan ({vehicles.length})</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} ({v.licensePlate})
            </option>
          ))}
        </select>
      </div>

      {/* Reminders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredReminders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <BellNotification className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-600">
            Tidak ada pengingat pada kategori ini.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
          >
            Buat Pengingat Servis
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleCompleteReminder}
              onDelete={handleDeleteReminder}
              onEdit={(r) => setSelectedReminderForEdit(r)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddReminderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchData();
        }}
      />

      {/* Edit Modal */}
      <EditReminderModal
        isOpen={Boolean(selectedReminderForEdit)}
        reminder={selectedReminderForEdit}
        onClose={() => setSelectedReminderForEdit(null)}
        onSuccess={() => {
          setSelectedReminderForEdit(null);
          fetchData();
        }}
      />
    </div>
  );
};
