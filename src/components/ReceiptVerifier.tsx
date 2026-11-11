import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Cpu, Check, Camera, Sparkles, Trash2, Plus } from "lucide-react";
import { generateMockReceiptBase64, generateDigitalReceiptBase64, formatRupiah } from "../utils";
import { OCRResult, ReceiptItem } from "../types";

interface ReceiptVerifierProps {
  onVerified: (result: OCRResult, imageBase64: string, isGeneratedNota?: boolean, itemPhotoBase64?: string) => void;
  onCancel: () => void;
  parentName?: string;
  studentName?: string;
}

export default function ReceiptVerifier({ onVerified, onCancel, parentName = "Wali Murid", studentName = "" }: ReceiptVerifierProps) {
  const [mode, setMode] = useState<"physical" | "no_receipt">("physical");

  // Mode 1: Physical Receipt States
  const [selectedReceiptType, setSelectedReceiptType] = useState<"koperasi" | "tokobuku" | "apotek" | "custom" | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  // Mode 2: No Receipt (Warung/Pasar - Upload Foto Barang) States
  const [itemPhotoBase64, setItemPhotoBase64] = useState<string | null>(null);
  const [noReceiptMerchant, setNoReceiptMerchant] = useState("");
  const [noReceiptItems, setNoReceiptItems] = useState("");
  const [noReceiptAmount, setNoReceiptAmount] = useState("");
  const [noReceiptDate, setNoReceiptDate] = useState(new Date().toISOString().split("T")[0]);
  const [isGeneratingAiNota, setIsGeneratingAiNota] = useState(false);

  // Dynamic Itemized Table for Mode 2
  const [itemRows, setItemRows] = useState<ReceiptItem[]>([
    { id: "1", name: "", qty: 1, unitPrice: 0, price: 0 }
  ]);

  const [error, setError] = useState<string | null>(null);

  // Triggered when a mock/demo receipt is selected
  const handleSelectMock = (type: "koperasi" | "tokobuku" | "apotek") => {
    setSelectedReceiptType(type);
    setError(null);
    setOcrResult(null);
    
    const { base64, name } = generateMockReceiptBase64(type);
    setImageBase64(base64);
    setImageName(name);
  };

  // Triggered when a physical receipt file is uploaded
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedReceiptType("custom");
    setError(null);
    setOcrResult(null);
    setImageName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.onerror = () => {
      setError("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  // Triggered when item photo is uploaded for Mode 2
  const handleItemPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setItemPhotoBase64(reader.result as string);
    };
    reader.onerror = () => {
      setError("Gagal membaca foto barang.");
    };
    reader.readAsDataURL(file);
  };

  // Mode 1: Call backend for Gemini OCR verification
  const handleStartAIVerification = async () => {
    if (!imageBase64) {
      setError("Silakan pilih atau unggah foto nota terlebih dahulu.");
      return;
    }

    setIsVerifying(true);
    setVerifyStep(1);
    setError(null);

    const stepIntervals = [
      { step: 1, delay: 600 },
      { step: 2, delay: 1200 },
      { step: 3, delay: 1800 },
    ];

    stepIntervals.forEach((item) => {
      setTimeout(() => {
        setVerifyStep(item.step);
      }, item.delay);
    });

    try {
      const response = await fetch("/api/verify-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        throw new Error("Sistem gagal memverifikasi nota. Silakan coba lagi.");
      }

      const data = (await response.json()) as OCRResult;
      
      setTimeout(() => {
        setOcrResult(data);
        setIsVerifying(false);
        setVerifyStep(4);
      }, 2200);

    } catch (err: any) {
      setIsVerifying(false);
      setVerifyStep(0);
      setError(err.message || "Gagal menghubungi asisten AI.");
    }
  };

  // Helper handlers for itemized rows in Mode 2
  const handleAddItemRow = () => {
    setItemRows((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", qty: 1, unitPrice: 0, price: 0 }
    ]);
  };

  const handleRemoveItemRow = (id: string) => {
    if (itemRows.length <= 1) return;
    setItemRows((prev) => {
      const next = prev.filter((it) => it.id !== id);
      const newTotal = next.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
      setNoReceiptAmount(newTotal > 0 ? newTotal.toString() : "");
      return next;
    });
  };

  const handleItemRowChange = (id: string, field: "name" | "qty" | "unitPrice", value: any) => {
    setItemRows((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "qty" || field === "unitPrice") {
            updated.price = (updated.qty || 0) * (updated.unitPrice || 0);
          }
          return updated;
        }
        return item;
      });

      const newTotal = next.reduce((sum, item) => sum + ((item.qty || 0) * (item.unitPrice || 0)), 0);
      if (newTotal > 0) {
        setNoReceiptAmount(newTotal.toString());
      }
      return next;
    });
  };

  // Mode 2: Generate AI Digital Receipt from Item Photo + Details
  const handleGenerateAiNota = () => {
    if (!itemPhotoBase64) {
      setError("Wajib mengunggah foto barang yang sudah dibeli sebagai bukti fisik!");
      return;
    }
    if (!noReceiptMerchant.trim()) {
      setError("Harap isi nama toko/warung/pasar tempat pembelian!");
      return;
    }

    const validItems = itemRows.filter((i) => i.name.trim().length > 0);
    const purposeText = noReceiptItems.trim() || (validItems.length > 0 ? validItems.map(i => i.name).join(", ") : "");

    if (validItems.length === 0 && !purposeText) {
      setError("Harap isi rincian minimal 1 barang yang dibeli (nama barang, qty, dan harga satuan)!");
      return;
    }

    const calculatedTotal = validItems.length > 0
      ? validItems.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0)
      : (parseInt(noReceiptAmount) || 0);

    const finalAmount = calculatedTotal > 0 ? calculatedTotal : (parseInt(noReceiptAmount) || 0);

    if (finalAmount <= 0) {
      setError("Harap masukkan harga satuan dan qty yang valid!");
      return;
    }

    setError(null);
    setIsGeneratingAiNota(true);

    setTimeout(() => {
      const itemsToUse: ReceiptItem[] = validItems.length > 0
        ? validItems.map(v => ({
            id: v.id,
            name: v.name,
            qty: v.qty || 1,
            unitPrice: v.unitPrice || 0,
            price: (v.qty || 1) * (v.unitPrice || 0)
          }))
        : [{
            name: purposeText,
            qty: 1,
            unitPrice: finalAmount,
            price: finalAmount
          }];

      const generatedSvgBase64 = generateDigitalReceiptBase64({
        merchant: noReceiptMerchant,
        purpose: purposeText,
        amount: finalAmount,
        date: noReceiptDate,
        parentName,
        studentName,
        items: itemsToUse,
        itemPhotoBase64
      });

      const simulatedOcr: OCRResult = {
        merchant: noReceiptMerchant,
        date: noReceiptDate,
        totalAmount: finalAmount,
        items: itemsToUse,
        confidence: 0.98,
        simulated: true
      };

      setIsGeneratingAiNota(false);
      onVerified(simulatedOcr, generatedSvgBase64, true, itemPhotoBase64);
    }, 1200);
  };

  const handleApplyResult = () => {
    if (ocrResult && imageBase64) {
      onVerified(ocrResult, imageBase64, false);
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm font-display">Asisten Nota & Verifikasi AI</h4>
            <p className="text-[10px] text-slate-400">Pilih opsi ketersediaan nota belanja Anda</p>
          </div>
        </div>

        {/* Mode Toggle Pills */}
        <div className="grid grid-cols-2 sm:flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setMode("physical");
              setError(null);
            }}
            className={`px-3 py-2 sm:py-1.5 rounded-lg transition cursor-pointer text-center ${
              mode === "physical" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            📄 Ada Struk/Nota
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("no_receipt");
              setError(null);
            }}
            className={`px-3 py-2 sm:py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 text-center ${
              mode === "no_receipt" ? "bg-purple-600 text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            <span className="truncate">Tanpa Nota (Warung/Pasar)</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          MODE 1: PHYSICAL RECEIPT (ADA NOTA CETAK)
          ========================================== */}
      {mode === "physical" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Pindai foto nota asli untuk ekstraksi nominal & rincian belanja secara otomatis menggunakan AI.
          </p>

          {!isVerifying && !ocrResult && (
            <div className="space-y-4">
              {/* Demo Receipts */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">
                  💡 Belum punya foto nota? Coba klik Contoh Nota di bawah ini:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectMock("koperasi")}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex flex-col justify-between h-20 ${
                      selectedReceiptType === "koperasi"
                        ? "border-blue-600 bg-blue-50/50 text-blue-700"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className="font-semibold block truncate">Koperasi 1C</span>
                    <span className="text-[10px] text-slate-500">Rp 50.000</span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md self-start font-mono">Buku/Alat Tulis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectMock("tokobuku")}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex flex-col justify-between h-20 ${
                      selectedReceiptType === "tokobuku"
                        ? "border-amber-500 bg-amber-50/50 text-amber-800"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className="font-semibold block truncate">Toko Buku Utama</span>
                    <span className="text-[10px] text-slate-500">Rp 125.000</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md self-start font-mono">Buku Paket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectMock("apotek")}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex flex-col justify-between h-20 ${
                      selectedReceiptType === "apotek"
                        ? "border-emerald-600 bg-emerald-50/50 text-emerald-800"
                        : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <span className="font-semibold block truncate">Apotek Sehat</span>
                    <span className="text-[10px] text-slate-500">Rp 45.000</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md self-start font-mono">Obat Anak</span>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-semibold uppercase">atau</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Upload Receipt */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">
                  Unggah Foto Nota Asli Anda:
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl bg-white p-4 text-center hover:border-blue-500 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Pilih atau Seret Foto Nota di Sini</p>
                  <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG (Maks 10MB)</p>
                </div>
              </div>
            </div>
          )}

          {/* Image preview & scan trigger */}
          {imageBase64 && !isVerifying && !ocrResult && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 truncate">{imageName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageBase64(null);
                    setSelectedReceiptType(null);
                    setOcrResult(null);
                  }}
                  className="text-[10px] font-semibold text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 max-h-40 flex items-center justify-center p-2">
                <img 
                  src={imageBase64} 
                  alt="Bukti Nota" 
                  className="max-h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              <button
                type="button"
                onClick={handleStartAIVerification}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Cpu className="w-4 h-4 animate-pulse" />
                Mulai Verifikasi Sistematis AI
              </button>
            </div>
          )}

          {/* Loading Animation */}
          {isVerifying && (
            <div className="mt-4 bg-white border border-slate-200 rounded-xl p-6 text-center space-y-4">
              <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">Pemindaian Sistematis Aktif...</h5>
                <p className="text-[11px] text-slate-500 animate-pulse">
                  {verifyStep === 1 && "Membaca pixel gambar bukti transaksi..."}
                  {verifyStep === 2 && "Mengidentifikasi Nama Toko & Tanggal transaksi..."}
                  {verifyStep === 3 && "Mengekstrak harga & rincian daftar barang..."}
                </p>
              </div>
            </div>
          )}

          {/* OCR Result View */}
          {ocrResult && (
            <div className="mt-4 space-y-3">
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3" /> AI Terverifikasi
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Confidence: {(ocrResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-3 border-b border-emerald-100 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nama Toko/Koperasi</span>
                    <span className="text-xs font-bold text-slate-800 truncate block">{ocrResult.merchant}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tanggal Nota</span>
                    <span className="text-xs font-bold text-slate-800 block">{ocrResult.date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block">Rekomendasi Jumlah Kas</span>
                    <span className="text-sm font-extrabold text-emerald-600 block">{formatRupiah(ocrResult.totalAmount)}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Rincian Barang Terdeteksi:</span>
                  <ul className="space-y-1">
                    {ocrResult.items.map((item, idx) => (
                      <li key={idx} className="text-[10px] font-semibold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">
                          {typeof item === "string" 
                            ? item 
                            : `${item.name} (${item.qty || 1}x @ ${formatRupiah(item.unitPrice || 0)})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOcrResult(null);
                    setImageBase64(null);
                  }}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Ulangi
                </button>
                <button
                  type="button"
                  onClick={handleApplyResult}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  Gunakan Hasil AI
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          MODE 2: NO RECEIPT (BELI DI WARUNG / PASAR)
          ========================================== */}
      {mode === "no_receipt" && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs space-y-1.5 text-purple-900">
            <span className="font-extrabold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-600" /> Mode Pembuatan Nota Digital AI
            </span>
            <p className="text-[11px] leading-relaxed text-purple-800 font-medium">
              Jika toko/warung/pasar tidak menyediakan struk cetak, Anda <strong>wajib mengunggah foto barang yang sudah dibeli</strong>. Lalu isi detail pembelian di bawah, dan AI akan membantu membuatkan Nota Digital resmi untuk pengajuan rembesan Anda.
            </p>
          </div>

          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            {/* Step 1: Upload Item Photo (MANDATORY) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                1. Upload Foto Barang yang Sudah Dibeli <span className="text-red-500">* (Wajib)</span>
              </label>
              <div className="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-xl p-3 text-center hover:border-purple-500 transition relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleItemPhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {itemPhotoBase64 ? (
                  <div className="space-y-2">
                    <img
                      src={itemPhotoBase64}
                      alt="Foto Barang Dibeli"
                      className="max-h-32 object-contain mx-auto rounded-lg border border-purple-300 shadow-2xs"
                    />
                    <span className="text-[10px] text-purple-700 font-bold block">✓ Foto Barang Berhasil Diunggah! (Klik untuk ganti)</span>
                  </div>
                ) : (
                  <div className="py-2">
                    <Camera className="w-7 h-7 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-purple-900">Ambil/Unggah Foto Barang Belanjaan</p>
                    <p className="text-[9px] text-purple-600 mt-0.5">Bukti fisik nyata barang yang dibeli di warung/pasar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Fill Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-600 block mb-1">
                  2. Nama Toko / Warung / Tempat Pembelian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Warung Bu Mini, Pasar Serpong, Toko Kelontong Jaya"
                  value={noReceiptMerchant}
                  onChange={(e) => setNoReceiptMerchant(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700 flex flex-wrap items-center gap-1.5">
                    <span>3. Rincian Barang Belanjaan</span>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-extrabold">Nama Item, Qty & Harga Satuan</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-[11px] bg-purple-600 hover:bg-purple-700 text-white px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tambah Barang</span>
                    <span className="sm:hidden">+ Item</span>
                  </button>
                </div>

                {/* Table Header for Desktop */}
                <div className="hidden sm:grid grid-cols-12 gap-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-1 pt-1">
                  <span className="col-span-5">Nama Barang</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-3 text-right">Harga @ (Rp)</span>
                  <span className="col-span-2 text-right">Aksi</span>
                </div>

                {/* Itemized Rows - Responsive Layout */}
                <div className="space-y-2">
                  {itemRows.map((row, idx) => {
                    const rowSubtotal = (row.qty || 0) * (row.unitPrice || 0);
                    return (
                      <div key={row.id || idx} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-1.5 sm:items-center">
                        {/* Item Name */}
                        <div className="sm:col-span-5 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`Barang #${idx + 1}`}
                            value={row.name}
                            onChange={(e) => handleItemRowChange(row.id || idx.toString(), "name", e.target.value)}
                            className="w-full px-2.5 py-2 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(row.id || idx.toString())}
                            disabled={itemRows.length <= 1}
                            className="sm:hidden p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-30 cursor-pointer shrink-0"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Qty & Unit Price */}
                        <div className="grid grid-cols-12 gap-2 sm:contents">
                          <div className="col-span-4 sm:col-span-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">Qty</label>
                            <input
                              type="number"
                              min={1}
                              value={row.qty || ""}
                              onChange={(e) => handleItemRowChange(row.id || idx.toString(), "qty", Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full px-2 py-2 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            />
                          </div>

                          <div className="col-span-8 sm:col-span-3">
                            <label className="text-[9px] font-bold text-slate-400 uppercase sm:hidden block mb-0.5">Harga @ (Rp)</label>
                            <input
                              type="number"
                              min={0}
                              placeholder="Rp / pcs"
                              value={row.unitPrice || ""}
                              onChange={(e) => handleItemRowChange(row.id || idx.toString(), "unitPrice", parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-2 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-right focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            />
                          </div>

                          <div className="hidden sm:flex col-span-2 items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(row.id || idx.toString())}
                              disabled={itemRows.length <= 1}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition disabled:opacity-30 cursor-pointer"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Row Total Summary Display */}
                        {rowSubtotal > 0 && (
                          <div className="sm:col-span-12 flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <span>Subtotal ({row.qty || 1} pcs x {formatRupiah(row.unitPrice || 0)}):</span>
                            <span className="font-extrabold text-purple-700 text-xs">{formatRupiah(rowSubtotal)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">
                  4. Total Nominal Belanja (Otomatis) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Otomatis dari rincian item..."
                    value={noReceiptAmount}
                    onChange={(e) => setNoReceiptAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-50/60 border border-purple-200 rounded-xl text-xs font-extrabold text-purple-900 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                    required
                  />
                  {parseInt(noReceiptAmount) > 0 && (
                    <span className="absolute right-3 top-2 text-xs font-extrabold text-purple-700">
                      {formatRupiah(parseInt(noReceiptAmount))}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">
                  Tanggal Pembelian
                </label>
                <input
                  type="date"
                  value={noReceiptDate}
                  onChange={(e) => setNoReceiptDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              disabled={isGeneratingAiNota}
              onClick={handleGenerateAiNota}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAiNota ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-yellow-300" />
                  <span>Memproses & Generasi Nota Digital AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />
                  <span>Buatkan Nota Digital via AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex gap-2 items-start font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
