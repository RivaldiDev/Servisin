import React from 'react';
import { NavLink } from 'react-router-dom';
import { Car, Wrench, Plus, BellNotification, StatsUpSquare } from 'iconoir-react';

interface BottomNavProps {
 onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenQuickAdd }) => {
 return (
 <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-nav">
 <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
 {/* Garasi / Home */}
 <NavLink
 to="/"
 end
 className={({ isActive }) =>
 `flex flex-col items-center justify-center w-14 py-1 tap-bounce transition-colors ${
 isActive ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
 }`
 }
 >
 <Car className="w-5 h-5 mb-0.5" />
 <span className="text-[10px] tracking-tight">Garasi</span>
 </NavLink>

 {/* Servis History */}
 <NavLink
 to="/services"
 className={({ isActive }) =>
 `flex flex-col items-center justify-center w-14 py-1 tap-bounce transition-colors ${
 isActive ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
 }`
 }
 >
 <Wrench className="w-5 h-5 mb-0.5" />
 <span className="text-[10px] tracking-tight">Servis</span>
 </NavLink>

 {/* Quick Add Action Button (Center elevated) */}
 <div className="relative -top-3 flex flex-col items-center">
 <button
 onClick={onOpenQuickAdd}
 className="w-12 h-12 rounded-full bg-brand-600 hover: hover: text-white shadow-lg shadow-brand-500/30 flex items-center justify-center tap-bounce border-4 border-white transition-all transform active:scale-95"
 aria-label="Aksi Cepat"
 >
 <Plus className="w-6 h-6 stroke-[2.5]" />
 </button>
 <span className="text-[10px] font-semibold text-slate-500 mt-0.5">Catat</span>
 </div>

 {/* Pengingat */}
 <NavLink
 to="/reminders"
 className={({ isActive }) =>
 `flex flex-col items-center justify-center w-14 py-1 tap-bounce transition-colors ${
 isActive ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
 }`
 }
 >
 <BellNotification className="w-5 h-5 mb-0.5" />
 <span className="text-[10px] tracking-tight">Pengingat</span>
 </NavLink>

 {/* Laporan / Analitik */}
 <NavLink
 to="/analytics"
 className={({ isActive }) =>
 `flex flex-col items-center justify-center w-14 py-1 tap-bounce transition-colors ${
 isActive ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-600 font-medium'
 }`
 }
 >
 <StatsUpSquare className="w-5 h-5 mb-0.5" />
 <span className="text-[10px] tracking-tight">Laporan</span>
 </NavLink>
 </div>
 </nav>
 );
};
