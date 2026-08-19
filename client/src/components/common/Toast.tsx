import React from 'react';
import { CheckCircle, WarningCircle, InfoCircle, Xmark } from 'iconoir-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <WarningCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <InfoCircle className="w-5 h-5 text-brand-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-900';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-900';
      default:
        return 'border-brand-200 bg-brand-50 text-brand-900';
    }
  };

  return (
    <div
      className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg animate-fade-in ${getBorderColor()}`}
    >
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span className="text-xs font-semibold leading-relaxed">{message}</span>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
      >
        <Xmark className="w-4 h-4" />
      </button>
    </div>
  );
};
