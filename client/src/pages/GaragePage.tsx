import React, { useState, useEffect } from 'react';
import { Car, Plus, Sparks, DashboardSpeed } from 'iconoir-react';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { UpdateOdometerModal } from '../components/vehicles/UpdateOdometerModal';
import { AddVehicleModal } from '../components/vehicles/AddVehicleModal';
import { UpgradeModal } from '../components/profile/UpgradeModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Vehicle } from '../types';

export const GaragePage: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVehicleForOdo, setSelectedVehicleForOdo] = useState<Vehicle | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat daftar kendaraan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const totalOdometer = vehicles.reduce((sum, v) => sum + v.currentOdometer, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* User Greeting & Stats Widget */}
      <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-brand-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-300">
              Garasi Kendaraan
            </span>
            <h2 className="text-lg font-extrabold tracking-tight mt-0.5">
              Halo, {user?.fullName || 'Pemilik Kendaraan'} 👋
            </h2>
          </div>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              user?.tier === 'PRO'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-700 text-slate-200'
            }`}
          >
            {user?.tier === 'PRO' ? 'PRO ⚡' : 'FREE TIER'}
          </span>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800/80 text-brand-400">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Total Kendaraan</p>
              <p className="font-extrabold text-sm">{vehicles.length} Unit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800/80 text-amber-400">
              <DashboardSpeed className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">Akumulasi Jarak</p>
              <p className="font-extrabold text-sm font-mono">
                {totalOdometer.toLocaleString('id-ID')} km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header bar: Title & Add Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Garasi Saya</h3>
          <p className="text-xs text-slate-500">
            {user?.tier === 'FREE' ? `${vehicles.length} / 2 Kuota Terpakai` : `${vehicles.length} Kendaraan Terdaftar`}
          </p>
        </div>

        <button
          onClick={() => setShowAddVehicleModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-brand-500/20 transition-colors tap-bounce"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Vehicle Cards List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-36 bg-white rounded-2xl border border-slate-200/60 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200">
          {error}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Garasi Masih Kosong</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Tambahkan mobil atau motor pertama Anda untuk mulai mencatat riwayat servis dan biaya perawatan.
            </p>
          </div>
          <button
            onClick={() => setShowAddVehicleModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            Daftarkan Kendaraan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((veh) => (
            <VehicleCard
              key={veh.id}
              vehicle={veh}
              onUpdateOdometer={(target) => setSelectedVehicleForOdo(target)}
            />
          ))}
        </div>
      )}

      {/* Freemium Upgrade Teaser */}
      {user?.tier === 'FREE' && vehicles.length >= 2 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparks className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">
                Garasi Anda Penuh (2/2)
              </h4>
              <p className="text-[11px] text-slate-600">
                Buka garasi tanpa batas dengan upgrade ke paket Pro.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[11px] font-bold shrink-0 shadow-xs"
          >
            Upgrade
          </button>
        </div>
      )}

      {/* Modals */}
      <UpdateOdometerModal
        isOpen={!!selectedVehicleForOdo}
        onClose={() => setSelectedVehicleForOdo(null)}
        vehicle={selectedVehicleForOdo}
        onSuccess={() => {
          setSelectedVehicleForOdo(null);
          fetchVehicles();
        }}
      />

      <AddVehicleModal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSuccess={() => {
          setShowAddVehicleModal(false);
          fetchVehicles();
        }}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={() => {
          fetchVehicles();
        }}
      />
    </div>
  );
};
