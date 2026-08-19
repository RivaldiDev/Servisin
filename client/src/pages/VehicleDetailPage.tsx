import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Car,
  Motorcycle,
  Calendar,
  Wrench,
  BellNotification,
  Plus,
  Trash,
  Page,
  EditPencil,
  Book,
} from 'iconoir-react';
import api from '../services/api';
import { Vehicle, ServiceLog, ServiceReminder } from '../types';
import { AddServiceModal } from '../components/services/AddServiceModal';
import { EditServiceModal } from '../components/services/EditServiceModal';
import { AddReminderModal } from '../components/reminders/AddReminderModal';
import { EditReminderModal } from '../components/reminders/EditReminderModal';
import { ServiceDetailModal } from '../components/services/ServiceDetailModal';
import { UpdateOdometerModal } from '../components/vehicles/UpdateOdometerModal';
import { EditVehicleModal } from '../components/vehicles/EditVehicleModal';
import { DigitalServiceBookModal } from '../components/vehicles/DigitalServiceBookModal';
import { ReminderCard } from '../components/reminders/ReminderCard';
import { useAuth } from '../context/AuthContext';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'LOGS' | 'REMINDERS'>('LOGS');

  const [showEditVehicle, setShowEditVehicle] = useState(false);
  const [showDigitalBook, setShowDigitalBook] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showUpdateOdo, setShowUpdateOdo] = useState(false);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceLog | null>(null);
  const [selectedLogForEdit, setSelectedLogForEdit] = useState<ServiceLog | null>(null);
  const [selectedReminderForEdit, setSelectedReminderForEdit] = useState<ServiceReminder | null>(null);

  const fetchVehicleDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/vehicles/${id}`);
      if (res.data.success) {
        setVehicle(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data kendaraan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const handleDeleteVehicle = async () => {
    if (!vehicle) return;
    if (
      !window.confirm(
        `Yakin ingin menghapus ${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate}) beserta seluruh riwayat servisnya? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    try {
      const res = await api.delete(`/vehicles/${vehicle.id}`);
      if (res.data.success) {
        navigate('/');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus kendaraan.');
    }
  };

  const handleCompleteReminder = async (reminder: ServiceReminder) => {
    try {
      const res = await api.post(`/reminders/${reminder.id}/complete`);
      if (res.data.success) {
        fetchVehicleDetails();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mereset siklus pengingat.');
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!window.confirm('Yakin ingin menghapus pengingat ini?')) return;
    try {
      const res = await api.delete(`/reminders/${reminderId}`);
      if (res.data.success) {
        fetchVehicleDetails();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus pengingat.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 pb-20">
        <div className="h-44 bg-white rounded-3xl animate-pulse" />
        <div className="h-64 bg-white rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-sm font-bold text-rose-600">{error || 'Kendaraan tidak ditemukan'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Garasi
        </Link>
      </div>
    );
  }

  const logs = vehicle.serviceLogs || [];
  const reminders = vehicle.reminders || [];
  const totalExpenses = logs.reduce((sum, log) => sum + log.totalCost, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Garasi</span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEditVehicle(true)}
            className="p-1.5 text-slate-500 hover:text-brand-600 rounded-xl hover:bg-brand-50 transition-colors bg-white border border-slate-200"
            title="Edit Kendaraan"
          >
            <EditPencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteVehicle}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors bg-white border border-slate-200"
            title="Hapus Kendaraan"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vehicle Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {vehicle.photoUrl ? (
              <img
                src={vehicle.photoUrl}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
            ) : vehicle.type === 'MOTORCYCLE' ? (
              <Motorcycle className="w-8 h-8 text-slate-600" />
            ) : (
              <Car className="w-8 h-8 text-brand-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {vehicle.brand}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {vehicle.year}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-snug truncate">
              {vehicle.model}
            </h2>
            <div className="inline-block mt-1 bg-slate-900 text-white font-mono font-bold text-xs px-2 py-0.5 rounded-md tracking-wider">
              {vehicle.licensePlate}
            </div>
          </div>
        </div>

        {/* Vehicle Stats Bar */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold">Odometer</span>
              <button
                onClick={() => setShowUpdateOdo(true)}
                className="text-[10px] font-bold text-brand-600 hover:text-brand-700"
              >
                Ubah
              </button>
            </div>
            <p className="font-extrabold text-sm font-mono text-slate-900 mt-0.5">
              {vehicle.currentOdometer.toLocaleString('id-ID')} km
            </p>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] text-slate-400 font-semibold block">Total Servis</span>
            <p className="font-extrabold text-sm font-mono text-brand-600 mt-0.5">
              Rp {totalExpenses.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {vehicle.notes && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl mt-3 border border-slate-100">
            {vehicle.notes}
          </p>
        )}

        {/* Action Button: Digital Service Book */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setShowDigitalBook(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Book className="w-4 h-4" />
            <span>Buka Buku Servis Digital (Cetak & Ekspor)</span>
          </button>
        </div>
      </div>

      {/* Segmented Tabs: Service Logs vs Reminders */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'LOGS'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Riwayat Servis ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('REMINDERS')}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'REMINDERS'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BellNotification className="w-3.5 h-3.5" />
          Pengingat ({reminders.length})
        </button>
      </div>

      {/* TAB 1: SERVICE LOGS */}
      {activeTab === 'LOGS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Catatan Perawatan</h3>
            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Catat Servis
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              <Wrench className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Belum ada catatan servis untuk kendaraan ini.
              </p>
              <button
                onClick={() => setShowAddService(true)}
                className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
              >
                Catat Servis Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedServiceDetail(log)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs hover:border-brand-300 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(log.serviceDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-semibold text-slate-600">
                          {log.odometer.toLocaleString('id-ID')} km
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                        {log.workshopName || 'Servis Berkala'}
                      </h4>
                    </div>

                    <span className="text-sm font-extrabold font-mono text-brand-600">
                      Rp {log.totalCost.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Items preview tags */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-100">
                    {log.items?.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md truncate max-w-[140px]"
                      >
                        {item.description}
                      </span>
                    ))}
                    {(log.items?.length || 0) > 3 && (
                      <span className="text-[10px] font-bold text-slate-400 self-center">
                        +{log.items.length - 3} lainnya
                      </span>
                    )}
                    {log.invoicePhotoUrl && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded-md flex items-center gap-0.5 ml-auto">
                        <Page className="w-3 h-3" />
                        Nota
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REMINDERS */}
      {activeTab === 'REMINDERS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Jadwal Pengingat</h3>
            <button
              onClick={() => setShowAddReminder(true)}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Buat Pengingat
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
              <BellNotification className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Belum ada pengingat untuk kendaraan ini.
              </p>
              <button
                onClick={() => setShowAddReminder(true)}
                className="px-3 py-1.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
              >
                Buat Pengingat Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={{ ...reminder, vehicle }}
                  onComplete={handleCompleteReminder}
                  onDelete={handleDeleteReminder}
                  onEdit={(r) => setSelectedReminderForEdit(r)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <EditVehicleModal
        isOpen={showEditVehicle}
        vehicle={vehicle}
        onClose={() => setShowEditVehicle(false)}
        onSuccess={() => {
          setShowEditVehicle(false);
          fetchVehicleDetails();
        }}
      />

      <DigitalServiceBookModal
        isOpen={showDigitalBook}
        vehicle={vehicle}
        ownerName={user?.fullName}
        onClose={() => setShowDigitalBook(false)}
      />

      <AddServiceModal
        isOpen={showAddService}
        onClose={() => setShowAddService(false)}
        initialVehicleId={vehicle.id}
        onSuccess={() => {
          setShowAddService(false);
          fetchVehicleDetails();
        }}
      />

      <EditServiceModal
        isOpen={Boolean(selectedLogForEdit)}
        serviceLog={selectedLogForEdit}
        onClose={() => setSelectedLogForEdit(null)}
        onSuccess={() => {
          setSelectedLogForEdit(null);
          fetchVehicleDetails();
        }}
      />

      <AddReminderModal
        isOpen={showAddReminder}
        onClose={() => setShowAddReminder(false)}
        initialVehicleId={vehicle.id}
        onSuccess={() => {
          setShowAddReminder(false);
          fetchVehicleDetails();
        }}
      />

      <EditReminderModal
        isOpen={Boolean(selectedReminderForEdit)}
        reminder={selectedReminderForEdit}
        onClose={() => setSelectedReminderForEdit(null)}
        onSuccess={() => {
          setSelectedReminderForEdit(null);
          fetchVehicleDetails();
        }}
      />

      <UpdateOdometerModal
        isOpen={showUpdateOdo}
        onClose={() => setShowUpdateOdo(false)}
        vehicle={vehicle}
        onSuccess={() => {
          setShowUpdateOdo(false);
          fetchVehicleDetails();
        }}
      />

      <ServiceDetailModal
        isOpen={!!selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        serviceLog={selectedServiceDetail}
        onDeleted={() => {
          setSelectedServiceDetail(null);
          fetchVehicleDetails();
        }}
        onEdit={(log) => {
          setSelectedServiceDetail(null);
          setSelectedLogForEdit(log);
        }}
      />
    </div>
  );
};
