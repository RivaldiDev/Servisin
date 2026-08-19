import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Motorcycle, DashboardSpeed, NavArrowRight, WarningTriangle, Clock, Calendar } from 'iconoir-react';
import { getAssetUrl } from '../../services/api';
import { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdateOdometer: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onUpdateOdometer }) => {
  const lastLog = vehicle.serviceLogs?.[0];
  const dueReminders = vehicle.reminders || [];
  const hasOverdue = dueReminders.some((r) => r.status === 'OVERDUE');
  const hasDueSoon = dueReminders.some((r) => r.status === 'DUE_SOON');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden relative">
      {/* Top Banner with Type & Plate */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Vehicle Icon / Photo */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative">
              {vehicle.photoUrl ? (
                <img
                  src={getAssetUrl(vehicle.photoUrl)}
                  alt={vehicle.model}
                  className="w-full h-full object-cover"
                />
              ) : vehicle.type === 'MOTORCYCLE' ? (
                <Motorcycle className="w-6 h-6 text-slate-600" />
              ) : (
                <Car className="w-6 h-6 text-brand-600" />
              )}
            </div>

            {/* Brand & Model */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {vehicle.brand}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {vehicle.year}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {vehicle.model}
              </h3>
            </div>
          </div>

          {/* License Plate Badge */}
          <div className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg tracking-wider shadow-xs shrink-0">
            {vehicle.licensePlate}
          </div>
        </div>

        {/* Current Odometer Strip */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            <DashboardSpeed className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-semibold">Odometer:</span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {vehicle.currentOdometer.toLocaleString('id-ID')} km
            </span>
          </div>

          {/* Quick Update Odometer Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onUpdateOdometer(vehicle);
            }}
            className="text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            Update KM
          </button>
        </div>
      </div>

      {/* Reminder Alert Pill (if any) */}
      {(hasOverdue || hasDueSoon) && (
        <div
          className={`px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
            hasOverdue
              ? 'bg-rose-50 text-rose-700 border-t border-rose-100'
              : 'bg-amber-50 text-amber-800 border-t border-amber-100'
          }`}
        >
          {hasOverdue ? (
            <WarningTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          ) : (
            <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          )}
          <span className="truncate">
            {hasOverdue ? 'Perhatian: Ada servis terlewat!' : 'Servis berkala mendekati jadwal'}
          </span>
        </div>
      )}

      {/* Footer Info: Last service & Detail Link */}
      <div className="bg-slate-50/80 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">
            Servis terakhir:{' '}
            <strong className="text-slate-700 font-medium">
              {lastLog
                ? new Date(lastLog.serviceDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Belum ada catatan'}
            </strong>
          </span>
        </div>

        <Link
          to={`/vehicles/${vehicle.id}`}
          className="flex items-center gap-0.5 text-brand-600 font-bold hover:text-brand-700 shrink-0 ml-2"
        >
          Detail
          <NavArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
