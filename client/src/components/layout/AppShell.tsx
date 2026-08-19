import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { Modal } from '../common/Modal';
import { Wrench, Car, BellNotification, ArrowRight } from 'iconoir-react';
import { AddVehicleModal } from '../vehicles/AddVehicleModal';
import { AddServiceModal } from '../services/AddServiceModal';
import { AddReminderModal } from '../reminders/AddReminderModal';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between items-center antialiased">
      {/* Mobile Screen Container */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl flex flex-col relative pb-safe">
        {/* Top Header */}
        <TopHeader />

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 py-4 overflow-y-auto">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <BottomNav onOpenQuickAdd={() => setShowQuickAddMenu(true)} />
      </div>

      {/* Quick Add Bottom Sheet Menu */}
      <Modal
        isOpen={showQuickAddMenu}
        onClose={() => setShowQuickAddMenu(false)}
        title="Aksi Cepat Servisin"
        subtitle="Pilih aktivitas yang ingin Anda catat sekarang"
        maxWidth="md"
      >
        <div className="space-y-2.5 py-1">
          {/* Action 1: Catat Servis */}
          <button
            onClick={() => {
              setShowQuickAddMenu(false);
              setShowAddService(true);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-300 hover:bg-brand-50/50 shadow-xs transition-all text-left tap-bounce group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  Catat Servis & Biaya
                </h4>
                <p className="text-xs text-slate-500">
                  Input riwayat servis, item sparepart & upload foto nota bengkel
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors shrink-0" />
          </button>

          {/* Action 2: Tambah Kendaraan */}
          <button
            onClick={() => {
              setShowQuickAddMenu(false);
              setShowAddVehicle(true);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/50 shadow-xs transition-all text-left tap-bounce group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Tambah Kendaraan Baru
                </h4>
                <p className="text-xs text-slate-500">
                  Daftarkan mobil atau motor baru ke garasi Anda
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors shrink-0" />
          </button>

          {/* Action 3: Buat Pengingat Servis */}
          <button
            onClick={() => {
              setShowQuickAddMenu(false);
              setShowAddReminder(true);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/50 shadow-xs transition-all text-left tap-bounce group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <BellNotification className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Jadwal Pengingat Servis
                </h4>
                <p className="text-xs text-slate-500">
                  Atur interval kilometer atau bulan servis rutin
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
          </button>
        </div>
      </Modal>

      {/* Global Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={showAddVehicle}
        onClose={() => setShowAddVehicle(false)}
        onSuccess={() => {
          setShowAddVehicle(false);
          navigate('/');
        }}
      />

      {/* Global Add Service Modal */}
      <AddServiceModal
        isOpen={showAddService}
        onClose={() => setShowAddService(false)}
        onSuccess={() => {
          setShowAddService(false);
          navigate('/services');
        }}
      />

      {/* Global Add Reminder Modal */}
      <AddReminderModal
        isOpen={showAddReminder}
        onClose={() => setShowAddReminder(false)}
        onSuccess={() => {
          setShowAddReminder(false);
          navigate('/reminders');
        }}
      />
    </div>
  );
};
