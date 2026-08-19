import React from 'react';
import { WarningTriangle, Clock, CheckCircle, Trash, Refresh, DashboardSpeed, Calendar, EditPencil } from 'iconoir-react';
import { ServiceReminder, CATEGORY_LABELS } from '../../types';

interface ReminderCardProps {
  reminder: ServiceReminder;
  onComplete: (reminder: ServiceReminder) => void;
  onDelete: (reminderId: string) => void;
  onEdit?: (reminder: ServiceReminder) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onComplete,
  onDelete,
  onEdit,
}) => {
  const currentOdo = reminder.vehicle?.currentOdometer || 0;
  const isOverdue = reminder.status === 'OVERDUE';
  const isDueSoon = reminder.status === 'DUE_SOON';

  // Distance calculation
  let distanceText = '';
  if (reminder.nextDueOdometer !== null && reminder.nextDueOdometer !== undefined) {
    const diff = reminder.nextDueOdometer - currentOdo;
    if (diff < 0) {
      distanceText = `Terlewat ${Math.abs(diff).toLocaleString('id-ID')} km`;
    } else {
      distanceText = `Sisa ${diff.toLocaleString('id-ID')} km lagi`;
    }
  }

  // Date calculation
  let dateText = '';
  if (reminder.nextDueDate) {
    const dueDate = new Date(reminder.nextDueDate);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      dateText = `Terlewat ${Math.abs(diffDays)} hari lalu`;
    } else if (diffDays === 0) {
      dateText = 'Jatuh tempo hari ini!';
    } else {
      dateText = `Jatuh tempo dlm ${diffDays} hari (${dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})`;
    }
  }

  const getStatusBadge = () => {
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200">
          <WarningTriangle className="w-3 h-3" />
          TERLEWAT
        </span>
      );
    }
    if (isDueSoon) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3" />
          MENDEKATI
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3" />
        AMAN
      </span>
    );
  };

  const getBorderColor = () => {
    if (isOverdue) return 'border-rose-200 bg-white hover:border-rose-300';
    if (isDueSoon) return 'border-amber-200 bg-white hover:border-amber-300';
    return 'border-slate-200 bg-white hover:border-slate-300';
  };

  return (
    <div
      className={`rounded-2xl border shadow-xs p-4 transition-all space-y-3 ${getBorderColor()}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
              {CATEGORY_LABELS[reminder.category] || reminder.category}
            </span>
            {getStatusBadge()}
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 mt-1">
            {reminder.title}
          </h3>
          {reminder.vehicle && (
            <p className="text-[11px] text-slate-500 font-medium">
              {reminder.vehicle.brand} {reminder.vehicle.model} •{' '}
              <span className="font-mono font-bold text-slate-700">
                {reminder.vehicle.licensePlate}
              </span>
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(reminder)}
              className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
              title="Edit pengingat"
            >
              <EditPencil className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Hapus pengingat"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target details */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
        {reminder.nextDueOdometer && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
            <DashboardSpeed className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold">Target KM</p>
              <p className="font-mono font-bold text-slate-800 truncate">
                {reminder.nextDueOdometer.toLocaleString('id-ID')} km
              </p>
              <p
                className={`text-[10px] font-bold truncate ${
                  isOverdue ? 'text-rose-600' : isDueSoon ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                {distanceText}
              </p>
            </div>
          </div>
        )}

        {reminder.nextDueDate && (
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
            <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold">Target Waktu</p>
              <p className="font-bold text-slate-800 truncate">
                {new Date(reminder.nextDueDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p
                className={`text-[10px] font-bold truncate ${
                  isOverdue ? 'text-rose-600' : isDueSoon ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                {dateText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action to complete / reset cycle */}
      <div className="pt-1 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Interval: {reminder.intervalKm ? `${reminder.intervalKm.toLocaleString()} km` : ''}
          {reminder.intervalKm && reminder.intervalMonths ? ' / ' : ''}
          {reminder.intervalMonths ? `${reminder.intervalMonths} bln` : ''}
        </span>

        <button
          onClick={() => onComplete(reminder)}
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Refresh className="w-3.5 h-3.5" />
          Servis Selesai (Reset)
        </button>
      </div>
    </div>
  );
};
