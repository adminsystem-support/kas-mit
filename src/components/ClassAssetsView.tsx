import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Tag,
  Edit2,
  Trash2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Copy,
  Check,
  Info,
  Layers,
  Box
} from "lucide-react";
import { ClassAsset } from "../types";
import { formatRupiah, generateAssetCode } from "../utils";

interface ClassAssetsViewProps {
  assets: ClassAsset[];
  activeRole: "BENDAHARA" | "WALI_MURID";
  onSaveAsset: (asset: Partial<ClassAsset>) => Promise<void>;
  onDeleteAsset: (assetId: string) => Promise<void>;
}

export const ClassAssetsView: React.FC<ClassAssetsViewProps> = ({
  assets = [],
  activeRole,
  onSaveAsset,
  onDeleteAsset,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<ClassAsset | null>(null);
  const [printingAsset, setPrintingAsset] = useState<ClassAsset | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<ClassAsset | null>(null);

  // Form State
  const [formAssetCode, setFormAssetCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Konsumsi & Peralatan");
  const [formPurchaseDate, setFormPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formPrice, setFormPrice] = useState<number | "">(0);
  const [formCondition, setFormCondition] = useState<
    "SANGAT_BAIK" | "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT"
  >("SANGAT_BAIK");
  const [formLocationHolder, setFormLocationHolder] = useState("Kelas 1C");
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<
    "AKTIF" | "DIPINJAM" | "DIPERBAIKI" | "DIHAPUS"
  >("AKTIF");
  const [formNotes, setFormNotes] = useState("");

  const handleOpenAddModal = () => {
    const defaultDate = new Date().toISOString().split("T")[0];
    const generatedCode = generateAssetCode(defaultDate, assets.length);
    
    setEditingAsset(null);
    setFormAssetCode(generatedCode);
    setFormName("");
    setFormCategory("Konsumsi & Peralatan");
    setFormPurchaseDate(defaultDate);
    setFormPrice(0);
    setFormCondition("SANGAT_BAIK");
    setFormLocationHolder("Kelas 1C");
    setFormQuantity(1);
    setFormStatus("AKTIF");
    setFormNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (asset: ClassAsset) => {
    setEditingAsset(asset);
    setFormAssetCode(asset.assetCode);
    setFormName(asset.name);
    setFormCategory(asset.category || "Konsumsi & Peralatan");
    setFormPurchaseDate(asset.purchaseDate);
    setFormPrice(asset.price);
    setFormCondition(asset.condition);
    setFormLocationHolder(asset.locationHolder || "Kelas 1C");
    setFormQuantity(asset.quantity || 1);
    setFormStatus(asset.status || "AKTIF");
    setFormNotes(asset.notes || "");
    setIsModalOpen(true);
  };

  const handlePurchaseDateChange = (dateVal: string) => {
    setFormPurchaseDate(dateVal);
    // Auto re-generate code if user is creating a new asset and hasn't manually altered code
    if (!editingAsset) {
      const generated = generateAssetCode(dateVal, assets.length);
      setFormAssetCode(generated);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload: Partial<ClassAsset> = {
        id: editingAsset ? editingAsset.id : undefined,
        assetCode: formAssetCode || generateAssetCode(formPurchaseDate, assets.length),
        name: formName.trim(),
        category: formCategory,
        purchaseDate: formPurchaseDate,
        price: Number(formPrice) || 0,
        condition: formCondition,
        locationHolder: formLocationHolder,
        quantity: Number(formQuantity) || 1,
        status: formStatus,
        notes: formNotes,
        addedBy: activeRole === "BENDAHARA" ? "Bendahara Kas 1C" : "Wali Murid",
      };

      await onSaveAsset(payload);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving asset:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;
    setIsSubmitting(true);
    try {
      await onDeleteAsset(assetToDelete.id);
      setAssetToDelete(null);
    } catch (err) {
      console.error("Error deleting asset:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered Assets
  const filteredAssets = assets.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      item.name.toLowerCase().includes(query) ||
      item.assetCode.toLowerCase().includes(query) ||
      (item.locationHolder && item.locationHolder.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query));

    const matchesCondition =
      conditionFilter === "ALL" || item.condition === conditionFilter;
    const matchesCategory =
      categoryFilter === "ALL" || item.category === categoryFilter;

    return matchesQuery && matchesCondition && matchesCategory;
  });

  // Calculate statistics
  const totalAssetsCount = assets.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAssetValue = assets.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const goodConditionCount = assets.filter(
    (a) => a.condition === "SANGAT_BAIK" || a.condition === "BAIK"
  ).length;

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "SANGAT_BAIK":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Sangat Baik
          </span>
        );
      case "BAIK":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" /> Baik
          </span>
        );
      case "RUSAK_RINGAN":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Rusak Ringan
          </span>
        );
      case "RUSAK_BERAT":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" /> Rusak Berat
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AKTIF":
        return (
          <span className="inline-block bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
            Aktif Digunakan
          </span>
        );
      case "DIPINJAM":
        return (
          <span className="inline-block bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
            Dipinjam
          </span>
        );
      case "DIPERBAIKI":
        return (
          <span className="inline-block bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
            Sedang Diperbaiki
          </span>
        );
      case "DIHAPUS":
        return (
          <span className="inline-block bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
            Nonaktif
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER & STATS */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-purple-700/30">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Package className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md px-3 py-1 rounded-full border border-purple-400/30 text-purple-200 text-xs font-bold mb-2">
                <Box className="w-3.5 h-3.5 text-purple-300" />
                <span>Inventaris & Barang Kas Kelas 1C</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                Pencatatan Aset & Fasilitas Bersama
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl mt-1">
                Seluruh pengadaan barang kas kelas (seperti dispenser, galon, kipas, peralatan kelas) terdata lengkap dengan kode resmi stiker label dan status lokasi.
              </p>
            </div>

            {activeRole === "BENDAHARA" && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Barang / Aset Baru</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-white">
              <span className="text-[11px] text-purple-200 font-semibold block">Total Item Aset</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black">{totalAssetsCount}</span>
                <span className="text-xs text-purple-300 font-bold">unit</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-white">
              <span className="text-[11px] text-purple-200 font-semibold block">Estimasi Nilai Total Aset</span>
              <span className="text-lg sm:text-xl font-black text-emerald-300 block mt-0.5">
                {formatRupiah(totalAssetValue)}
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 text-white">
              <span className="text-[11px] text-purple-200 font-semibold block">Kondisi Baik / Sangat Baik</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-blue-300">{goodConditionCount}</span>
                <span className="text-xs text-purple-300 font-bold">dari {assets.length} jenis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode (ASIC/...), nama barang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">Semua Kondisi</option>
            <option value="SANGAT_BAIK">✨ Sangat Baik</option>
            <option value="BAIK">👍 Baik</option>
            <option value="RUSAK_RINGAN">⚠️ Rusak Ringan</option>
            <option value="RUSAK_BERAT">❌ Rusak Berat</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Konsumsi & Peralatan">Konsumsi & Peralatan</option>
            <option value="Elektronik & Kelistrikan">Elektronik & Kelistrikan</option>
            <option value="Kebersihan Kelas">Kebersihan Kelas</option>
            <option value="Furnitur & Fasilitas">Furnitur & Fasilitas</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* ASSETS CARDS LIST */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak ada barang / aset ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau filter kondisi barang yang dipilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-slate-200 hover:border-purple-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition space-y-4 relative group"
            >
              {/* Card Top Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Code Badge */}
                    <button
                      type="button"
                      onClick={() => copyCodeToClipboard(asset.assetCode)}
                      className="font-mono text-[11px] font-black bg-slate-900 text-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer shadow-2xs"
                      title="Klik untuk salin kode aset"
                    >
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span>{asset.assetCode}</span>
                      {copiedCode === asset.assetCode ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>

                    {getStatusBadge(asset.status || "AKTIF")}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 font-display pt-1">
                    {asset.name}
                  </h3>
                </div>

                <div className="text-right flex-shrink-0">
                  {getConditionBadge(asset.condition)}
                </div>
              </div>

              {/* Asset Details Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Jumlah</span>
                    <span className="font-bold text-slate-800">{asset.quantity || 1} Unit</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Harga / Beli</span>
                    <span className="font-bold text-emerald-700">{formatRupiah(asset.price || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Tanggal Beli</span>
                    <span className="font-bold text-slate-700">{asset.purchaseDate || "-"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 block font-medium">Lokasi / Holder</span>
                    <span className="font-bold text-slate-700 truncate block">
                      {asset.locationHolder || "Kelas 1C"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {asset.notes && (
                <div className="text-xs text-slate-500 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/60 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{asset.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setPrintingAsset(asset)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Cetak Stiker Label Barcode Aset"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-600" />
                  <span>Stiker Label</span>
                </button>

                {activeRole === "BENDAHARA" && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(asset)}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                      title="Ubah data aset"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssetToDelete(asset)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Hapus aset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: ADD / EDIT ASSET */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 font-display">
                    {editingAsset ? "Ubah Data Barang Kas" : "Tambah Barang / Aset Baru"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {editingAsset
                      ? "Perbarui rincian informasi aset kas kelas"
                      : "Registrasi aset barang kas kelas baru dengan nomor unik"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Asset Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode Unik Aset <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formAssetCode}
                    onChange={(e) => setFormAssetCode(e.target.value)}
                    placeholder="Contoh: ASIC/VII/2026/0001"
                    className="w-full pl-3 pr-3 py-2 bg-slate-900 text-amber-300 font-mono text-xs font-bold rounded-xl border border-slate-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Format otomatis: ASIC/[BULAN ROMAWI]/[TAHUN]/[NOMOR URUT]
                </span>
              </div>

              {/* Asset Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Barang / Aset <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Dispenser Air Minum, Galon 2 buah, Kipas Angin..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Category & Purchase Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Konsumsi & Peralatan">Konsumsi & Peralatan</option>
                    <option value="Elektronik & Kelistrikan">Elektronik & Kelistrikan</option>
                    <option value="Kebersihan Kelas">Kebersihan Kelas</option>
                    <option value="Furnitur & Fasilitas">Furnitur & Fasilitas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Beli
                  </label>
                  <input
                    type="date"
                    required
                    value={formPurchaseDate}
                    onChange={(e) => handlePurchaseDateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Harga Pembelian (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jumlah (Unit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Condition & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kondisi Barang
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) =>
                      setFormCondition(
                        e.target.value as "SANGAT_BAIK" | "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT"
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="SANGAT_BAIK">✨ Sangat Baik</option>
                    <option value="BAIK">👍 Baik</option>
                    <option value="RUSAK_RINGAN">⚠️ Rusak Ringan</option>
                    <option value="RUSAK_BERAT">❌ Rusak Berat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Penggunaan
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) =>
                      setFormStatus(
                        e.target.value as "AKTIF" | "DIPINJAM" | "DIPERBAIKI" | "DIHAPUS"
                      )
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="AKTIF">Aktif Digunakan</option>
                    <option value="DIPINJAM">Sedang Dipinjam</option>
                    <option value="DIPERBAIKI">Sedang Diperbaiki</option>
                    <option value="DIHAPUS">Nonaktif / Dihapus</option>
                  </select>
                </div>
              </div>

              {/* Location / Holder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi Simpan / Penanggung Jawab
                </label>
                <input
                  type="text"
                  value={formLocationHolder}
                  onChange={(e) => setFormLocationHolder(e.target.value)}
                  placeholder="Misal: Sudut Belakang Kelas 1C / Rak Guru"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Spesifikasi, nomor garansi, atau informasi pelengkap..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Aset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE STICKER LABEL MODAL */}
      {printingAsset && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-extrabold text-slate-800 font-display">
                  Stiker Label Resmi Aset Kelas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPrintingAsset(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* STICKER PREVIEW BOX */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-5 rounded-2xl border-2 border-dashed border-amber-300 text-slate-900 space-y-3 relative shadow-inner">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-purple-800" />
                  <span className="text-[11px] font-black tracking-wider text-purple-900 uppercase">
                    PROPERTI KAS KELAS 1C
                  </span>
                </div>
                <span className="text-[9px] font-extrabold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                  ASSET TAG
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900 leading-tight">
                  {printingAsset.name}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                  Kategori: {printingAsset.category || "Fasilitas Kelas"}
                </p>
              </div>

              {/* Barcode visual design */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 text-center space-y-1 shadow-2xs">
                <div className="flex justify-center items-center gap-1 my-1">
                  {/* Simulated barcode lines */}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 ${
                        i % 3 === 0
                          ? "w-1 bg-slate-900"
                          : i % 2 === 0
                          ? "w-0.5 bg-slate-800"
                          : "w-1.5 bg-slate-900"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-black text-slate-900 tracking-widest block">
                  {printingAsset.assetCode}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-600 font-bold border-t border-amber-200/80 pt-2">
                <span>Tgl Beli: {printingAsset.purchaseDate}</span>
                <span>Nilai: {formatRupiah(printingAsset.price || 0)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrintingAsset(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Label Stiker</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {assetToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Hapus Barang Aset Ini?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Anda yakin ingin menghapus <strong className="text-slate-800">{assetToDelete.name}</strong> ({assetToDelete.assetCode}) dari daftar inventaris kelas?
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAssetToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Ya, Hapus Aset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
