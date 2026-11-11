import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, 
  ExternalLink, LogOut, Check, X, Shield, Sparkles, Plus, 
  Link as LinkIcon, Database, ArrowRight, Loader2, Info, Download, Upload
} from "lucide-react";
import { Transaction, GoogleSheetsConfig } from "../types";
import { 
  signInWithGoogleSheets, 
  signOutGoogle, 
  getCurrentGoogleUser, 
  getGoogleAccessToken, 
  createCashbookSpreadsheet, 
  verifySpreadsheetAccess, 
  syncAllTransactionsToSheet,
  extractSpreadsheetId,
  formatTransactionsForSheet
} from "../services/googleSheetsService";
import { User } from "firebase/auth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  currentConfig?: GoogleSheetsConfig;
  onSaveConfig: (newConfig: GoogleSheetsConfig) => Promise<void>;
  themeColor?: string;
}

export const GoogleSheetsSyncModal: React.FC<Props> = ({
  isOpen,
  onClose,
  transactions,
  currentConfig,
  onSaveConfig,
  themeColor = "blue"
}) => {
  const config = currentConfig || {};
  const [user, setUser] = useState<User | null>(getCurrentGoogleUser());
  const [token, setToken] = useState<string | null>(getGoogleAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Config state
  const [spreadsheetId, setSpreadsheetId] = useState(config.spreadsheetId || "");
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(config.spreadsheetUrl || "");
  const [sheetTitle, setSheetTitle] = useState(config.sheetTitle || "Buku Kas Kelas 1C - MIT MA");
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);
  const [lastSyncedAt, setLastSyncedAt] = useState(config.lastSyncedAt || "");
  const [syncedCount, setSyncedCount] = useState(config.syncedCount || 0);

  // Mode: "CREATE_NEW" | "EXISTING"
  const [linkMode, setLinkMode] = useState<"CREATE_NEW" | "EXISTING">("CREATE_NEW");
  const [existingInput, setExistingInput] = useState("");

  // Confirmation dialog for sync (compliance with destructive operations guideline)
  const [showConfirmSync, setShowConfirmSync] = useState(false);

  useEffect(() => {
    setUser(getCurrentGoogleUser());
    setToken(getGoogleAccessToken());
  }, [isOpen]);

  useEffect(() => {
    if (currentConfig?.spreadsheetId) {
      setSpreadsheetId(currentConfig.spreadsheetId);
      setSpreadsheetUrl(currentConfig.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${currentConfig.spreadsheetId}/edit`);
      setSheetTitle(currentConfig.sheetTitle || "Buku Kas Kelas 1C - MIT MA");
      setAutoSync(currentConfig.autoSync ?? true);
      setLastSyncedAt(currentConfig.lastSyncedAt || "");
      setSyncedCount(currentConfig.syncedCount || 0);
    }
  }, [currentConfig]);

  if (!isOpen) return null;

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await signInWithGoogleSheets();
      setUser(res.user);
      setToken(res.accessToken);
      setSuccessMsg(`Berhasil terhubung dengan Google (${res.user.email})`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Gagal masuk dengan Google. Silakan periksa koneksi atau izinkan popup.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign Out
  const handleGoogleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOutGoogle();
      setUser(null);
      setToken(null);
      setSuccessMsg("Berhasil keluar dari akun Google.");
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new Spreadsheet
  const handleCreateNewSpreadsheet = async () => {
    if (!token) {
      setErrorMsg("Silakan hubungkan akun Google terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const info = await createCashbookSpreadsheet(sheetTitle || "Buku Kas Kelas 1C - MIT MA", token);
      setSpreadsheetId(info.spreadsheetId);
      setSpreadsheetUrl(info.spreadsheetUrl);
      setSheetTitle(info.title);

      // Now sync existing transactions
      const syncResult = await syncAllTransactionsToSheet(info.spreadsheetId, transactions, token);
      const now = new Date().toLocaleString("id-ID");
      setLastSyncedAt(now);
      setSyncedCount(syncResult.syncedCount);

      const newConfig: GoogleSheetsConfig = {
        spreadsheetId: info.spreadsheetId,
        spreadsheetUrl: info.spreadsheetUrl,
        sheetTitle: info.title,
        autoSync,
        lastSyncedAt: now,
        syncedCount: syncResult.syncedCount,
        userEmail: user?.email || undefined,
        userName: user?.displayName || undefined
      };

      await onSaveConfig(newConfig);
      setSuccessMsg(`Spreadsheet "${info.title}" berhasil dibuat dan ${syncResult.syncedCount} transaksi langsung disinkronkan!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Gagal membuat Google Spreadsheet.");
    } finally {
      setIsLoading(false);
    }
  };

  // Link existing Spreadsheet
  const handleLinkExistingSpreadsheet = async () => {
    if (!token) {
      setErrorMsg("Silakan hubungkan akun Google terlebih dahulu.");
      return;
    }

    const cleanId = extractSpreadsheetId(existingInput);
    if (!cleanId) {
      setErrorMsg("Harap masukkan ID atau Link Google Spreadsheet yang valid.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const check = await verifySpreadsheetAccess(cleanId, token);
      const fullUrl = `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;
      
      setSpreadsheetId(cleanId);
      setSpreadsheetUrl(fullUrl);
      setSheetTitle(check.title);

      const now = new Date().toLocaleString("id-ID");
      const newConfig: GoogleSheetsConfig = {
        spreadsheetId: cleanId,
        spreadsheetUrl: fullUrl,
        sheetTitle: check.title,
        autoSync,
        lastSyncedAt: currentConfig?.lastSyncedAt || now,
        syncedCount: currentConfig?.syncedCount || 0,
        userEmail: user?.email || undefined,
        userName: user?.displayName || undefined
      };

      await onSaveConfig(newConfig);
      setSuccessMsg(`Berhasil menautkan ke Google Spreadsheet: "${check.title}"`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Gagal mengakses spreadsheet tersebut. Pastikan izin berbagi/edit telah diatur.");
    } finally {
      setIsLoading(false);
    }
  };

  // Execute manual full sync (after user confirms dialog)
  const handleExecuteFullSync = async () => {
    setShowConfirmSync(false);
    if (!spreadsheetId) {
      setErrorMsg("Belum ada Google Spreadsheet yang ditautkan.");
      return;
    }
    if (!token) {
      setErrorMsg("Akses token Google sudah kedaluwarsa. Silakan Hubungkan Akun Google kembali.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const result = await syncAllTransactionsToSheet(spreadsheetId, transactions, token);
      const now = new Date().toLocaleString("id-ID");
      setLastSyncedAt(now);
      setSyncedCount(result.syncedCount);

      const newConfig: GoogleSheetsConfig = {
        ...currentConfig,
        spreadsheetId,
        spreadsheetUrl,
        sheetTitle,
        autoSync,
        lastSyncedAt: now,
        syncedCount: result.syncedCount,
        userEmail: user?.email || undefined,
        userName: user?.displayName || undefined
      };

      await onSaveConfig(newConfig);
      setSuccessMsg(`Sukses menyinkronkan ${result.syncedCount} transaksi ke Google Sheets!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Gagal menyinkronkan data transaksi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Auto-sync setting
  const handleToggleAutoSync = async (checked: boolean) => {
    setAutoSync(checked);
    if (spreadsheetId) {
      await onSaveConfig({
        ...currentConfig,
        spreadsheetId,
        spreadsheetUrl,
        sheetTitle,
        autoSync: checked,
        lastSyncedAt,
        syncedCount
      });
    }
  };

  // Instant offline backup generators to ensure zero data loss
  const handleDownloadJsonBackup = async () => {
    try {
      const res = await fetch("/api/db");
      const fullDb = await res.json();
      const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-lengkap-kas-kelas1c-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh cadangan JSON. Pastikan server terhubung.");
    }
  };

  const handleDownloadCsvBackup = () => {
    try {
      const rows = formatTransactionsForSheet(transactions);
      const headers = ["No", "Tanggal", "Tipe", "Kategori", "Deskripsi / Keperluan", "Uang Masuk (Rp)", "Uang Keluar (Rp)", "Saldo Berjalan (Rp)", "Pencatat", "Toko", "Bukti", "ID Transaksi"];
      const csvLines = [headers.join(","), ...rows.map(r => r.map((c: any) => `"${String(c || "").replace(/"/g, '""')}"`).join(","))];
      const blob = new Blob(["\uFEFF" + csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `buku-kas-kelas-1c-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh rekap CSV.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Sinkronisasi Google Sheets</h2>
              <p className="text-xs text-emerald-100">Integrasi mutasi kas kelas secara real-time & transparan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Alerts */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div>
                  <span className="font-bold">Terjadi Kendala: </span>
                  {errorMsg}
                </div>
                {errorMsg.includes("Authorized Domains") ? (
                  <div className="pt-2 border-t border-rose-200/60 space-y-1.5">
                    <p className="text-xs text-rose-700 font-medium">
                      💡 <strong>Solusi Mudah:</strong> Klik tombol <strong>"Unduh Rekap Kas (.CSV)"</strong> di bawah, lalu buka di Google Sheets. Anda juga bisa menambahkan domain ini di Firebase Console (Authentication &gt; Settings &gt; Authorized domains).
                    </p>
                  </div>
                ) : (errorMsg.toLowerCase().includes("scope") || errorMsg.toLowerCase().includes("permission") || errorMsg.toLowerCase().includes("izin")) && (
                  <div className="pt-2 border-t border-rose-200/60">
                    <p className="text-xs text-rose-700 font-medium mb-2">
                      Izin Google Sheets & Google Drive telah diperbarui oleh sistem. Silakan klik tombol di bawah untuk menyegarkan login akun Google Anda:
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                    >
                      Segarkan Otorisasi Akun Google Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMsg}</div>
            </div>
          )}

          {/* Section: Cadangan Data Mandiri (Offline Backup - Anti Hilang) */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-900">Takut Data Hilang? Unduh Cadangan Offline Detik Ini</h4>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Anda dapat menyimpan salinan arsip seluruh <strong>28 siswa, seluruh mutasi iuran, dan {transactions.length} transaksi kas</strong> langsung ke perangkat HP / Laptop Anda sebagai file cadangan darurat.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadJsonBackup}
                className="px-3 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" />
                <span>Unduh Cadangan (.JSON)</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadCsvBackup}
                className="px-3 py-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Rekap Kas (.CSV)</span>
              </button>
              <label 
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Impor / Restore (.JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const text = await file.text();
                      const parsed = JSON.parse(text);
                      const res = await fetch("/api/restore-database", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ dbState: parsed })
                      });
                      const result = await res.json();
                      if (result.success) {
                        setSuccessMsg("Berhasil mengimpor data kas kelas! Halaman akan menyegarkan data.");
                        setTimeout(() => window.location.reload(), 1000);
                      } else {
                        setErrorMsg(result.error || "Gagal mengimpor file data.");
                      }
                    } catch (err: any) {
                      setErrorMsg("Format file JSON tidak valid: " + err.message);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {/* Section 1: Google Account Connection */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Status Akun Google
              </span>
              {user && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Terhubung
                </span>
              )}
            </div>

            {!user ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hubungkan akun Google Anda untuk mengizinkan aplikasi menulis mutasi transaksi ke Google Spreadsheet pribadi atau drive kelas secara aman.
                </p>
                
                {/* Official Sign in with Google Material Button */}
                <div className="pt-1">
                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="gsi-material-button shadow-xs hover:shadow-md transition-all active:scale-98"
                  >
                    <div className="gsi-material-button-content-wrapper">
                      <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                          <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents">
                        {isLoading ? "Menghubungkan..." : "Masuk dengan Google (Otorisasi Sheets)"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Google Avatar" 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-xs" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                      {user.displayName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{user.displayName || "Pengguna Google"}</h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleSignOut}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Putuskan
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Linked Spreadsheet Info or Setup */}
          {spreadsheetId ? (
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase">Spreadsheet Aktif</span>
                    <h3 className="text-base font-bold text-slate-900">{sheetTitle}</h3>
                    <p className="text-xs text-slate-500 font-mono truncate max-w-xs sm:max-w-md">ID: {spreadsheetId}</p>
                  </div>
                </div>

                <a 
                  href={spreadsheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <span>Buka Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Status metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-100 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Tersinkronisasi</span>
                  <span className="font-bold text-slate-800 text-sm">{syncedCount} Baris</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-slate-400 block text-[10px]">Total di Aplikasi</span>
                  <span className="font-bold text-slate-800 text-sm">{transactions.length} Transaksi</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">Waktu Sync Terakhir</span>
                  <span className="font-medium text-slate-700 text-xs truncate block">{lastSyncedAt || "Belum pernah"}</span>
                </div>
              </div>

              {/* Real-time Toggle */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Sinkronisasi Real-Time</h5>
                    <p className="text-[11px] text-slate-500">Otomatis kirim ke Google Sheets setiap kali ada transaksi baru</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoSync} 
                    onChange={(e) => handleToggleAutoSync(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button 
                  onClick={() => setShowConfirmSync(true)}
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Sinkronkan Semua Transaksi Sekarang ({transactions.length})</span>
                </button>

                <button 
                  onClick={() => {
                    if (window.confirm("Apakah Anda ingin mengganti tautan spreadsheet ini?")) {
                      setSpreadsheetId("");
                    }
                  }}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 text-xs font-medium rounded-xl transition-colors"
                >
                  Ganti Spreadsheet
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex border-b border-slate-200">
                <button 
                  onClick={() => setLinkMode("CREATE_NEW")}
                  className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-colors ${
                    linkMode === "CREATE_NEW" 
                      ? "border-emerald-600 text-emerald-600" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Buat Spreadsheet Otomatis
                </button>
                <button 
                  onClick={() => setLinkMode("EXISTING")}
                  className={`flex-1 py-2.5 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-colors ${
                    linkMode === "EXISTING" 
                      ? "border-emerald-600 text-emerald-600" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Tautkan Spreadsheet yang Ada
                </button>
              </div>

              {linkMode === "CREATE_NEW" ? (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Spreadsheet di Google Drive</label>
                    <input 
                      type="text" 
                      value={sheetTitle} 
                      onChange={(e) => setSheetTitle(e.target.value)}
                      placeholder="e.g. Buku Kas Kelas 1C - MIT MA"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Format Otomatis Rapi & Lengkap:
                    </p>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Sistem akan membuat file spreadsheet baru dengan lembar <strong>"Buku Kas"</strong> lengkap dengan kolom: No, Tanggal, Tipe, Kategori, Keperluan, Uang Masuk, Uang Keluar, Saldo Berjalan, Pencatat, Toko, dan ID Transaksi.
                    </p>
                  </div>

                  <button 
                    onClick={handleCreateNewSpreadsheet}
                    disabled={isLoading || !user}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Buat Spreadsheet & Sinkronkan Sekarang</span>
                  </button>
                  {!user && (
                    <p className="text-center text-[11px] text-amber-700">⚠️ Mohon login ke akun Google terlebih dahulu di bagian atas.</p>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ID atau URL Google Spreadsheet</label>
                    <input 
                      type="text" 
                      value={existingInput} 
                      onChange={(e) => setExistingInput(e.target.value)}
                      placeholder="Paste link https://docs.google.com/spreadsheets/d/.../edit"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Pastikan akun Google yang Anda hubungkan memiliki akses <strong>Edit</strong> ke spreadsheet tersebut.
                  </p>

                  <button 
                    onClick={handleLinkExistingSpreadsheet}
                    disabled={isLoading || !user || !existingInput.trim()}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Cek & Tautkan Spreadsheet</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Feature highlights info box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              Keuntungan Dual Backup Google Sheets:
            </h5>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              <li><strong>Akses Kapan Pun:</strong> Buka mutasi kas langsung dari Google Sheets di HP atau browser tanpa harus login ke dashboard aplikasi.</li>
              <li><strong>Arsip Permanen:</strong> Setiap rupiah tercatat ganda di cloud Firestore dan Google Drive Anda sehingga risiko transaksi terlewat adalah 0%.</li>
              <li><strong>Audit & Cetak:</strong> Mudah dicetak, dibuat grafik, atau diunduh sebagai Excel (.xlsx) / PDF untuk pelaporan rapat komite wali murid.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Selesai / Tutup
          </button>
        </div>

      </div>

      {/* Confirmation Dialog for Destructive / Overwrite Sync (Compliance with workspace-integration guidelines) */}
      {showConfirmSync && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Sinkronisasi Data</h3>
                <p className="text-xs text-slate-500">Google Sheets Workspace API</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda akan memperbarui seluruh <strong>{transactions.length} data transaksi</strong> ke dalam Google Spreadsheet:
              <br />
              <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                "{sheetTitle}"
              </span>
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-relaxed">
              ⚠️ Operasi ini akan menimpa baris data sebelumnya di lembar <em>"Buku Kas"</em> dengan data terbaru yang ada di aplikasi, menghitung ulang saldo berjalan, dan memastikan urutan kronologis yang akurat.
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button 
                onClick={() => setShowConfirmSync(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleExecuteFullSync}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Ya, Sinkronkan Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
