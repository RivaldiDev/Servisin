import React, { useState, useEffect } from 'react';
import { Dollar, Wrench, GraphUp, Car, StatsReport, CheckCircle, WarningTriangle, Clock } from 'iconoir-react';
import api from '../services/api';
import { AnalyticsSummary } from '../types';

export const AnalyticsPage: React.FC = () => {
 const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 api
 .get('/analytics/summary')
 .then((res) => {
 if (res.data.success) {
 setSummary(res.data.data);
 }
 })
 .catch((err) => console.error('Failed to fetch analytics', err))
 .finally(() => setLoading(false));
 }, []);

 if (loading) {
 return (
 <div className="space-y-4 pb-20">
 <div className="h-28 bg-white rounded-3xl animate-pulse" />
 <div className="h-64 bg-white rounded-3xl animate-pulse" />
 <div className="h-44 bg-white rounded-3xl animate-pulse" />
 </div>
 );
 }

 if (!summary) {
 return (
 <div className="text-center py-10 text-xs text-slate-500">
 Gagal memuat data laporan analitik.
 </div>
 );
 }

 const { summary: stats, monthlyBreakdown, categoryBreakdown, vehicleBreakdown } = summary;
 const maxMonthly = Math.max(...monthlyBreakdown.map((m) => m.amount), 1);
 const totalCategoryExpenses = categoryBreakdown.reduce((sum, c) => sum + c.totalCost, 0) || 1;
 const averageCost = stats.totalServices > 0 ? Math.round(stats.totalSpent / stats.totalServices) : 0;

 return (
 <div className="space-y-4 pb-20">
 {/* Header */}
 <div>
 <h2 className="text-lg font-extrabold text-slate-900">Laporan & Analitik</h2>
 <p className="text-xs text-slate-500">
 Ringkasan pengeluaran perawatan dan statistik armada kendaraan
 </p>
 </div>

 {/* KPI Cards */}
 <div className="grid grid-cols-2 gap-3">
 <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
 <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
 <Dollar className="w-4 h-4" />
 </div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
 Total Biaya Servis
 </p>
 <p className="text-base font-extrabold font-mono text-slate-900 leading-tight">
 Rp {stats.totalSpent.toLocaleString('id-ID')}
 </p>
 </div>

 <div className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
 <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
 <Wrench className="w-4 h-4" />
 </div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
 Rata-rata / Servis
 </p>
 <p className="text-base font-extrabold font-mono text-slate-900 leading-tight">
 Rp {averageCost.toLocaleString('id-ID')}
 </p>
 </div>
 </div>

 {/* Reminder Status Summary Widget */}
 <div className="grid grid-cols-3 gap-2">
 <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
 <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
 <WarningTriangle className="w-3 h-3" />
 Terlewat
 </div>
 <p className="text-sm font-extrabold text-rose-700 mt-0.5">{stats.overdueCount} Jadwal</p>
 </div>

 <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
 <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
 <Clock className="w-3 h-3" />
 Mendekati
 </div>
 <p className="text-sm font-extrabold text-amber-700 mt-0.5">{stats.dueSoonCount} Jadwal</p>
 </div>

 <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
 <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
 <CheckCircle className="w-3 h-3" />
 Aman
 </div>
 <p className="text-sm font-extrabold text-emerald-700 mt-0.5">{stats.activeCount} Jadwal</p>
 </div>
 </div>

 {/* Monthly Expenditure Bar Chart */}
 <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <GraphUp className="w-4 h-4 text-brand-600" />
 <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
 Pengeluaran 12 Bulan Terakhir
 </h3>
 </div>
 <span className="text-[10px] font-bold text-slate-400">Bulanan</span>
 </div>

 {/* Bar Chart Container */}
 <div className="pt-4 flex items-end justify-between gap-1.5 h-36 border-b border-slate-100 pb-2">
 {monthlyBreakdown.map((m, idx) => {
 const heightPercent = Math.max((m.amount / maxMonthly) * 100, 4);
 const labelParts = m.month.split(' ');
 const monthLabel = labelParts[0] || m.month;

 return (
 <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
 {/* Tooltip on hover */}
 <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
 Rp {(m.amount / 1000).toLocaleString('id-ID')}k ({m.count}x)
 </div>

 {/* Bar */}
 <div className="w-full bg-slate-100 rounded-t-md flex items-end h-24 overflow-hidden">
 <div
 style={{ height: `${heightPercent}%` }}
 className={`w-full rounded-t-md transition-all duration-500 ${
 m.amount > 0
 ? 'bg-brand-600 group-hover: group-hover:'
 : 'bg-slate-200'
 }`}
 />
 </div>

 {/* Month label */}
 <span className="text-[9px] font-semibold text-slate-400 truncate max-w-[28px]">
 {monthLabel}
 </span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Category Expenses Breakdown */}
 <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
 <div className="flex items-center gap-2">
 <StatsReport className="w-4 h-4 text-brand-600" />
 <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
 Distribusi Biaya per Komponen
 </h3>
 </div>

 <div className="space-y-3">
 {categoryBreakdown.length === 0 ? (
 <p className="text-xs text-slate-400 py-4 text-center">
 Belum ada data komponen servis tercatat.
 </p>
 ) : (
 categoryBreakdown.map((cat) => {
 const percent = Math.round((cat.totalCost / totalCategoryExpenses) * 100);
 return (
 <div key={cat.category} className="space-y-1">
 <div className="flex items-center justify-between text-xs">
 <span className="font-bold text-slate-700">
 {cat.label || cat.category}
 </span>
 <span className="font-mono font-bold text-slate-900">
 Rp {cat.totalCost.toLocaleString('id-ID')}{' '}
 <span className="text-[10px] text-slate-400 font-normal">
 ({percent}%)
 </span>
 </span>
 </div>
 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
 <div
 style={{ width: `${percent}%` }}
 className="h-full bg-brand-600 rounded-full"
 />
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>

 {/* Vehicle Expenses Comparison */}
 <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
 <div className="flex items-center gap-2">
 <Car className="w-4 h-4 text-brand-600" />
 <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
 Pengeluaran Tiap Kendaraan
 </h3>
 </div>

 <div className="space-y-2">
 {vehicleBreakdown.length === 0 ? (
 <p className="text-xs text-slate-400 py-2 text-center">
 Belum ada data pengeluaran kendaraan.
 </p>
 ) : (
 vehicleBreakdown.map((v) => (
 <div
 key={v.id}
 className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
 >
 <div>
 <h4 className="text-xs font-extrabold text-slate-900">
 {v.name}
 </h4>
 <p className="text-[10px] font-mono text-slate-500">
 {v.plate} • {v.serviceCount}x servis
 </p>
 </div>

 <span className="text-xs font-extrabold font-mono text-brand-700">
 Rp {v.totalCost.toLocaleString('id-ID')}
 </span>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 );
};
