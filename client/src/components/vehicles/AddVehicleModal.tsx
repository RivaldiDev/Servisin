import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
 Car,
 Motorcycle,
 Upload,
 WarningCircle,
 Sparks,
 Search,
} from 'iconoir-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { POPULAR_VEHICLES, PopularVehiclePreset } from '../../data/popularVehicles';

interface AddVehicleModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSuccess: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
 isOpen,
 onClose,
 onSuccess,
}) => {
 const { refreshUser } = useAuth();
 
 // Tab: 'PRESET' (Populer Indonesia) vs 'MANUAL' (Form Bebas)
 const [activeTab, setActiveTab] = useState<'PRESET' | 'MANUAL'>('PRESET');
 const [presetSearch, setPresetSearch] = useState('');
 const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

 const [type, setType] = useState<'CAR' | 'MOTORCYCLE'>('CAR');
 const [brand, setBrand] = useState('');
 const [model, setModel] = useState('');
 const [licensePlate, setLicensePlate] = useState('');
 const [year, setYear] = useState(new Date().getFullYear().toString());
 const [currentOdometer, setCurrentOdometer] = useState('0');
 const [notes, setNotes] = useState('');
 const [photoFile, setPhotoFile] = useState<File | null>(null);
 const [photoPreview, setPhotoPreview] = useState<string | null>(null);
 const [presetThumbnailUrl, setPresetThumbnailUrl] = useState<string | null>(null);

 const [loading, setLoading] = useState(false);
 const [errorMessage, setErrorMessage] = useState<string | null>(null);
 const [tierLimitReached, setTierLimitReached] = useState(false);

 const handleSelectPreset = (preset: PopularVehiclePreset) => {
 setSelectedPresetId(preset.id);
 setType(preset.type);
 setBrand(preset.brand);
 setModel(preset.model);
 setPresetThumbnailUrl(preset.thumbnailUrl);
 setPhotoPreview(preset.thumbnailUrl);
 setPhotoFile(null); // Use preset image URL
 setActiveTab('MANUAL'); // Switch to form to fill license plate & odometer
 };

 const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files[0]) {
 const file = e.target.files[0];
 setPhotoFile(file);
 setPhotoPreview(URL.createObjectURL(file));
 setPresetThumbnailUrl(null);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setErrorMessage(null);
 setTierLimitReached(false);
 setLoading(true);

 try {
 const formData = new FormData();
 formData.append('type', type);
 formData.append('brand', brand);
 formData.append('model', model);
 formData.append('licensePlate', licensePlate);
 formData.append('year', year);
 formData.append('currentOdometer', currentOdometer);
 if (notes) formData.append('notes', notes);
 
 if (photoFile) {
 formData.append('photo', photoFile);
 } else if (presetThumbnailUrl) {
 // Pass preset image path as photoUrl
 formData.append('photoUrl', presetThumbnailUrl);
 }

 const res = await api.post('/vehicles', formData, {
 headers: { 'Content-Type': 'multipart/form-data' },
 });

 if (res.data.success) {
 await refreshUser();
 // Reset form
 setBrand('');
 setModel('');
 setLicensePlate('');
 setYear(new Date().getFullYear().toString());
 setCurrentOdometer('0');
 setNotes('');
 setPhotoFile(null);
 setPhotoPreview(null);
 setPresetThumbnailUrl(null);
 setSelectedPresetId(null);
 setActiveTab('PRESET');
 onSuccess();
 }
 } catch (err: any) {
 if (err.response?.status === 403 && err.response?.data?.code === 'TIER_LIMIT_REACHED') {
 setTierLimitReached(true);
 }
 setErrorMessage(err.response?.data?.message || 'Gagal menambahkan kendaraan.');
 } finally {
 setLoading(false);
 }
 };

 // Filter States for Presets
 const [selectedBrand, setSelectedBrand] = useState<string>('Semua Merk');
 const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'CAR' | 'MOTORCYCLE'>('ALL');
 const [selectedYearEra, setSelectedYearEra] = useState<string>('ALL');

 // Filter presets
 const filteredPresets = POPULAR_VEHICLES.filter((p) => {
 // 1. Type
 if (selectedTypeFilter !== 'ALL' && p.type !== selectedTypeFilter) return false;

 // 2. Brand
 if (selectedBrand !== 'Semua Merk' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;

 // 3. Year Era
 if (selectedYearEra !== 'ALL') {
 if (selectedYearEra === '2006-2010' && (p.endYear < 2006 || p.startYear > 2010)) return false;
 if (selectedYearEra === '2011-2015' && (p.endYear < 2011 || p.startYear > 2015)) return false;
 if (selectedYearEra === '2016-2020' && (p.endYear < 2016 || p.startYear > 2020)) return false;
 if (selectedYearEra === '2021-2026' && (p.endYear < 2021 || p.startYear > 2026)) return false;
 }

 // 4. Search query
 if (presetSearch.trim().length > 0) {
 const q = presetSearch.toLowerCase();
 const matchBrand = p.brand.toLowerCase().includes(q);
 const matchModel = p.model.toLowerCase().includes(q);
 const matchCategory = p.categoryName.toLowerCase().includes(q);
 const matchCc = p.engineCc.toLowerCase().includes(q);
 const matchGen = p.generation.toLowerCase().includes(q);
 const matchDesc = p.description.toLowerCase().includes(q);
 if (!matchBrand && !matchModel && !matchCategory && !matchCc && !matchGen && !matchDesc) {
 return false;
 }
 }

 return true;
 });

 return (
 <Modal
 isOpen={isOpen}
 onClose={onClose}
 title="Tambah Kendaraan Baru"
 subtitle="Daftarkan mobil atau motor ke garasi digital Servisin"
 >
 {tierLimitReached ? (
 <div className="text-center py-4 space-y-4">
 <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
 <Sparks className="w-7 h-7" />
 </div>
 <div>
 <h4 className="text-base font-extrabold text-slate-900">
 Batas Kuota Akun Gratis (2 Kendaraan)
 </h4>
 <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
 Akun Gratis dibatasi maksimal 2 kendaraan di garasi. Untuk menambah armada kendaraan tanpa batas, upgrade ke paket <strong>Servisin Pro</strong>.
 </p>
 </div>
 <div className="pt-2 flex flex-col gap-2">
 <Link
 to="/profile"
 onClick={onClose}
 className="w-full py-3 px-4 bg-brand-600 hover: hover: text-white rounded-xl font-bold text-xs shadow-md shadow-amber-500/20 text-center"
 >
 Lihat Paket Servisin Pro ⚡
 </Link>
 <button
 onClick={onClose}
 className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
 >
 Kembali
 </button>
 </div>
 </div>
 ) : (
 <div className="space-y-4">
 {/* Preset vs Manual Tab Switcher */}
 <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
 <button
 type="button"
 onClick={() => setActiveTab('PRESET')}
 className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
 activeTab === 'PRESET'
 ? 'bg-white text-slate-900 shadow-xs'
 : 'text-slate-500 hover:text-slate-700'
 }`}
 >
 <Sparks className="w-3.5 h-3.5 text-amber-500" />
 Katalog Model 2006–2026 ({POPULAR_VEHICLES.length})
 </button>
 <button
 type="button"
 onClick={() => setActiveTab('MANUAL')}
 className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
 activeTab === 'MANUAL'
 ? 'bg-white text-slate-900 shadow-xs'
 : 'text-slate-500 hover:text-slate-700'
 }`}
 >
 <Car className="w-3.5 h-3.5 text-brand-600" />
 Form Input Manual
 </button>
 </div>

 {/* TAB 1: PRESET SELECTION */}
 {activeTab === 'PRESET' && (
 <div className="space-y-3">
 {/* Search Bar for Presets */}
 <div className="relative">
 <input
 type="text"
 placeholder="Cari merk, model, tipe cc, bodi (misal: Avanza, Vario, Pajero, Vespa, EV)..."
 value={presetSearch}
 onChange={(e) => setPresetSearch(e.target.value)}
 className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
 />
 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
 {presetSearch && (
 <button
 type="button"
 onClick={() => setPresetSearch('')}
 className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
 >
 ✕
 </button>
 )}
 </div>

 {/* Quick Filters Row 1: Vehicle Type & Year Era */}
 <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
 {/* Type Filter Buttons */}
 <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl shrink-0">
 <button
 type="button"
 onClick={() => setSelectedTypeFilter('ALL')}
 className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
 selectedTypeFilter === 'ALL'
 ? 'bg-white text-slate-900 shadow-xs'
 : 'text-slate-500 hover:text-slate-700'
 }`}
 >
 Semua
 </button>
 <button
 type="button"
 onClick={() => setSelectedTypeFilter('CAR')}
 className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
 selectedTypeFilter === 'CAR'
 ? 'bg-brand-600 text-white shadow-xs'
 : 'text-slate-500 hover:text-slate-700'
 }`}
 >
 <Car className="w-3 h-3" />
 Mobil
 </button>
 <button
 type="button"
 onClick={() => setSelectedTypeFilter('MOTORCYCLE')}
 className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
 selectedTypeFilter === 'MOTORCYCLE'
 ? 'bg-amber-600 text-white shadow-xs'
 : 'text-slate-500 hover:text-slate-700'
 }`}
 >
 <Motorcycle className="w-3 h-3" />
 Motor
 </button>
 </div>

 {/* Year Era Select */}
 <select
 value={selectedYearEra}
 onChange={(e) => setSelectedYearEra(e.target.value)}
 className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shrink-0"
 >
 <option value="ALL">📅 Rentang Tahun (Semua 2006–2026)</option>
 <option value="2021-2026">2021 – 2026 (Terbaru / EV / Gen Baru)</option>
 <option value="2016-2020">2016 – 2020 (Modern Facelift)</option>
 <option value="2011-2015">2011 – 2015 (Gen 2)</option>
 <option value="2006-2010">2006 – 2010 (Gen 1 / Klasik)</option>
 </select>
 </div>

 {/* Quick Filters Row 2: Brand Horizontal Scroll Chips */}
 <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
 {[
 'Semua Merk',
 'Toyota',
 'Honda',
 'Yamaha',
 'Suzuki',
 'Mitsubishi',
 'Daihatsu',
 'Kawasaki',
 'Vespa',
 'Hyundai',
 'Wuling',
 'Mazda',
 'Nissan',
 ].map((b) => (
 <button
 key={b}
 type="button"
 onClick={() => setSelectedBrand(b)}
 className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
 selectedBrand === b
 ? 'bg-slate-900 text-white shadow-xs'
 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
 }`}
 >
 {b}
 </button>
 ))}
 </div>

 {/* Presets Count Badge */}
 <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
 <span>Ditemukan: <strong className="text-slate-800">{filteredPresets.length}</strong> model kendaraan</span>
 {filteredPresets.length === 0 && (
 <button
 type="button"
 onClick={() => {
 setSelectedBrand('Semua Merk');
 setSelectedTypeFilter('ALL');
 setSelectedYearEra('ALL');
 setPresetSearch('');
 }}
 className="text-brand-600 hover:underline font-bold"
 >
 Reset Filter
 </button>
 )}
 </div>

 {/* Presets Grid */}
 <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto no-scrollbar pt-1 pr-0.5">
 {filteredPresets.map((preset) => (
 <div
 key={preset.id}
 onClick={() => handleSelectPreset(preset)}
 className={`p-2.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between group tap-bounce relative overflow-hidden ${
 selectedPresetId === preset.id
 ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-200'
 : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-md'
 }`}
 >
 {/* Thumbnail Image Container */}
 <div className="w-full h-28 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-2 border border-slate-200/80 relative group shadow-2xs">
 <img
 src={preset.thumbnailUrl}
 alt={preset.model}
 loading="lazy"
 onError={(e) => {
 const target = e.currentTarget;
 if (!target.src.endsWith('.svg')) {
 target.src = preset.thumbnailUrl.replace(/\.webp$/, '.svg');
 }
 }}
 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
 />
 </div>

 {/* Metadata */}
 <div className="space-y-1">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-black text-brand-600 uppercase tracking-wider">
 {preset.brand}
 </span>
 <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
 {preset.startYear}–{preset.endYear}
 </span>
 </div>
 
 <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-1">
 {preset.model}
 </h4>
 
 <p className="text-[10px] text-slate-500 line-clamp-1 font-medium">
 {preset.engineCc} • {preset.categoryName}
 </p>

 <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed pt-0.5">
 {preset.description}
 </p>
 </div>

 <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-brand-600 font-bold">
 <span>Pilih Template</span>
 <span className="group-hover:translate-x-1 transition-transform">→</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* TAB 2: MANUAL FORM */}
 {activeTab === 'MANUAL' && (
 <form onSubmit={handleSubmit} className="space-y-3.5">
 {errorMessage && (
 <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
 <WarningCircle className="w-4 h-4 shrink-0" />
 <span>{errorMessage}</span>
 </div>
 )}

 {/* Selected Preset Banner (if any) */}
 {presetThumbnailUrl && (
 <div className="p-2.5 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-3">
 <img
 src={presetThumbnailUrl}
 alt={model}
 className="w-12 h-12 rounded-xl object-cover border border-brand-200 bg-white"
 />
 <div className="flex-1 min-w-0">
 <span className="text-[10px] font-bold text-brand-600 uppercase">
 Template Terpilih
 </span>
 <p className="text-xs font-bold text-slate-900 truncate">
 {brand} {model}
 </p>
 </div>
 <button
 type="button"
 onClick={() => setActiveTab('PRESET')}
 className="text-[11px] font-bold text-brand-600 hover:text-brand-700 bg-white px-2 py-1 rounded-lg border border-brand-200"
 >
 Ganti
 </button>
 </div>
 )}

 {/* Vehicle Type Selector */}
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1.5">
 Tipe Kendaraan
 </label>
 <div className="grid grid-cols-2 gap-2">
 <button
 type="button"
 onClick={() => setType('CAR')}
 className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
 type === 'CAR'
 ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-xs'
 : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
 }`}
 >
 <Car className="w-4 h-4" />
 Mobil
 </button>
 <button
 type="button"
 onClick={() => setType('MOTORCYCLE')}
 className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
 type === 'MOTORCYCLE'
 ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-xs'
 : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
 }`}
 >
 <Motorcycle className="w-4 h-4" />
 Motor
 </button>
 </div>
 </div>

 {/* Brand & Model */}
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Merk Kendaraan
 </label>
 <input
 type="text"
 required
 placeholder={type === 'CAR' ? 'Honda / Toyota' : 'Honda / Yamaha'}
 value={brand}
 onChange={(e) => setBrand(e.target.value)}
 className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Model / Seri
 </label>
 <input
 type="text"
 required
 placeholder={type === 'CAR' ? 'Civic / Avanza' : 'Vario 160 / NMAX'}
 value={model}
 onChange={(e) => setModel(e.target.value)}
 className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
 />
 </div>
 </div>

 {/* License Plate & Year */}
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Nomor Plat Polisi
 </label>
 <input
 type="text"
 required
 placeholder="B 1234 ABC"
 value={licensePlate}
 onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
 className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
 />
 </div>
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Tahun Pembuatan
 </label>
 <input
 type="number"
 required
 min="1950"
 max={new Date().getFullYear() + 1}
 value={year}
 onChange={(e) => setYear(e.target.value)}
 className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
 />
 </div>
 </div>

 {/* Current Odometer */}
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Odometer Terkini (KM Saat Ini)
 </label>
 <div className="relative">
 <input
 type="number"
 min="0"
 required
 value={currentOdometer}
 onChange={(e) => setCurrentOdometer(e.target.value)}
 className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
 />
 <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
 KM
 </span>
 </div>
 </div>

 {/* Custom Photo Upload */}
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Foto Kendaraan (Opsional)
 </label>
 <div className="flex items-center gap-3">
 {photoPreview && (
 <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
 <img
 src={photoPreview}
 alt="Preview"
 className="w-full h-full object-cover"
 />
 </div>
 )}

 <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-colors text-slate-500 hover:text-brand-600">
 <Upload className="w-4 h-4" />
 <span className="text-xs font-semibold">
 {photoFile ? 'Ganti File Foto' : 'Pilih Foto Sendiri'}
 </span>
 <input
 type="file"
 accept="image/*"
 onChange={handlePhotoChange}
 className="hidden"
 />
 </label>
 </div>
 </div>

 {/* Notes */}
 <div>
 <label className="block text-xs font-bold text-slate-700 mb-1">
 Catatan Khusus (Opsional)
 </label>
 <textarea
 rows={2}
 placeholder="No. Rangka, No. Mesin, warna mobil, oli rekomendasi, dll."
 value={notes}
 onChange={(e) => setNotes(e.target.value)}
 className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none font-medium"
 />
 </div>

 {/* Submit Button */}
 <div className="pt-2">
 <button
 type="submit"
 disabled={loading}
 className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
 >
 {loading ? (
 <span>Menyimpan Kendaraan...</span>
 ) : (
 <span>Simpan ke Garasi</span>
 )}
 </button>
 </div>
 </form>
 )}
 </div>
 )}
 </Modal>
 );
};
