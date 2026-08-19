import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellNotification, WarningTriangle, Clock, NavArrowRight } from 'iconoir-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ServiceReminder } from '../../types';

export const TopHeader: React.FC = () => {
  const { user } = useAuth();
  const [urgentReminders, setUrgentReminders] = useState<ServiceReminder[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/reminders');
      if (res.data.success) {
        const due = res.data.data.filter(
          (r: ServiceReminder) => r.status === 'OVERDUE' || r.status === 'DUE_SOON'
        );
        setUrgentReminders(due);
      }
    } catch (e) {
      console.error('Failed to fetch reminders for header badge', e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.webp"
              alt="Servisin Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-xs border border-slate-100 bg-white"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  SERVIS<span className="text-brand-600">IN</span>
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    user?.tier === 'PRO'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {user?.tier === 'PRO' ? 'PRO ⚡' : 'FREE'}
                </span>
              </div>
            </div>
          </Link>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Notifikasi Pengingat"
            >
              {urgentReminders.length > 0 ? (
                <BellNotification className="w-5 h-5 text-brand-600" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
              {urgentReminders.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                  {urgentReminders.length}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <Link
              to="/profile"
              className="flex items-center gap-1.5 pl-1 rounded-xl p-1 hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs uppercase shadow-sm">
                {user?.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Notification Modal / Popover */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/50 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setShowNotifications(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 animate-fade-in z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Notifikasi Pengingat Servis
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {urgentReminders.length} aktif
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
              {urgentReminders.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  ✨ Semua jadwal servis kendaraan Anda aman dan terkendali!
                </div>
              ) : (
                urgentReminders.map((reminder) => (
                  <Link
                    key={reminder.id}
                    to="/reminders"
                    onClick={() => setShowNotifications(false)}
                    className="py-3 flex items-start gap-3 hover:bg-slate-50 rounded-xl px-2 transition-colors block"
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        reminder.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {reminder.status === 'OVERDUE' ? (
                        <WarningTriangle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {reminder.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {reminder.vehicle?.brand} {reminder.vehicle?.model} ({reminder.vehicle?.licensePlate})
                      </p>
                      <p
                        className={`text-[10px] font-semibold mt-0.5 ${
                          reminder.status === 'OVERDUE' ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      >
                        {reminder.status === 'OVERDUE'
                          ? '⚠️ Jatuh tempo telah terlewat!'
                          : '⏰ Mendekati batas kilometer/waktu'}
                      </p>
                    </div>
                    <NavArrowRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
                  </Link>
                ))
              )}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/reminders"
                onClick={() => setShowNotifications(false)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Lihat Semua Pengingat →
              </Link>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
