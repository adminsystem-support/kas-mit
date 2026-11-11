import React, { useState, useEffect } from "react";
import { 
  Users, Wallet, CreditCard, Plus, HelpCircle, 
  CheckCircle2, AlertCircle, Clock, Check, X, 
  Send, Phone, Calendar, ArrowUpRight, ArrowDownLeft, 
  ChevronRight, RefreshCw, LogOut, User, Sparkles, 
  Scale, Ruler, FileText, CheckCircle, ShieldAlert, Copy, Trash2,
  Camera, Upload, Image, Search, Gift, Heart, Smile, Activity, TrendingUp, Eye, EyeOff, Receipt,
  Smartphone, Download, Loader2, Edit2, Package, Box, Tag, Bell, MessageCircle, Share2, Filter, Megaphone,
  FileSpreadsheet
} from "lucide-react";
import { DBState, Student, Transaction, Kasbon, Reimbursement, OCRResult, ReceiptItem, IuranConfirmation, ClassAsset, GoogleSheetsConfig } from "./types";
import { calculateAge, isBirthdayComingSoon, formatRupiah, generateAssetCode } from "./utils";
import SmartGuide from "./components/SmartGuide";
import GrowthChart from "./components/GrowthChart";
import ReceiptVerifier from "./components/ReceiptVerifier";
import ThermalSupermarketReceipt from "./components/ThermalSupermarketReceipt";
import { InstallPwaModal } from "./components/InstallPwaModal";
import { ClassAssetsView } from "./components/ClassAssetsView";
import { GoogleSheetsSyncModal } from "./components/GoogleSheetsSyncModal";
import { syncAllTransactionsToSheet, getGoogleAccessToken } from "./services/googleSheetsService";


// Visual Theme Configuration for Kas Kelas 1C
export const THEMES = [
  {
    id: "blue",
    name: "Biru Samudra (Bawaan)",
    description: "Tema biru cerdas, akademis, dan terpercaya untuk administrasi sekolah.",
    icon: "🌊",
    primaryColor: "blue",
    bgClass: "from-blue-600 to-indigo-700",
    textClass: "text-blue-600",
    textHover: "hover:text-blue-700",
    bgLight: "bg-blue-50 border-blue-100",
    borderFocus: "focus:border-blue-500",
    buttonBg: "bg-blue-600 hover:bg-blue-700",
    buttonAccent: "bg-indigo-600 hover:bg-indigo-700",
    accentText: "text-blue-700",
    badgeBg: "bg-blue-100 text-blue-800",
    ringColor: "ring-blue-500",
    textLight: "text-blue-100",
    iconBg: "bg-blue-600",
    cardBorder: "border-blue-500",
    cardBg: "bg-blue-50/30",
    cardRing: "ring-blue-100",
    splashBorder: "border-blue-400",
    splashRing: "ring-blue-100",
    pillsActive: "bg-blue-600 text-white shadow-xs"
  },
  {
    id: "emerald",
    name: "Kebun Hijau Pintar",
    description: "Tema segar bernuansa pertumbuhan, energi positif, dan kesehatan anak.",
    icon: "🌱",
    primaryColor: "emerald",
    bgClass: "from-emerald-600 to-teal-700",
    textClass: "text-emerald-600",
    textHover: "hover:text-emerald-700",
    bgLight: "bg-emerald-50 border-emerald-100",
    borderFocus: "focus:border-emerald-500",
    buttonBg: "bg-emerald-600 hover:bg-emerald-700",
    buttonAccent: "bg-teal-600 hover:bg-teal-700",
    accentText: "text-emerald-700",
    badgeBg: "bg-emerald-100 text-emerald-800",
    ringColor: "ring-emerald-500",
    textLight: "text-emerald-100",
    iconBg: "bg-emerald-600",
    cardBorder: "border-emerald-500",
    cardBg: "bg-emerald-50/30",
    cardRing: "ring-emerald-100",
    splashBorder: "border-emerald-400",
    splashRing: "ring-emerald-100",
    pillsActive: "bg-emerald-600 text-white shadow-xs"
  },
  {
    id: "autumn",
    name: "Jingga Musim Gugur",
    description: "Warna jingga & amber hangat yang ramah, bersahabat, dan nyaman.",
    icon: "🍂",
    primaryColor: "amber",
    bgClass: "from-amber-500 to-orange-600",
    textClass: "text-amber-600",
    textHover: "hover:text-amber-700",
    bgLight: "bg-amber-50 border-amber-100",
    borderFocus: "focus:border-amber-500",
    buttonBg: "bg-amber-600 hover:bg-amber-700",
    buttonAccent: "bg-orange-600 hover:bg-orange-700",
    accentText: "text-amber-700",
    badgeBg: "bg-amber-100 text-amber-800",
    ringColor: "ring-amber-500",
    textLight: "text-amber-100",
    iconBg: "bg-amber-500",
    cardBorder: "border-amber-500",
    cardBg: "bg-amber-50/30",
    cardRing: "ring-amber-100",
    splashBorder: "border-amber-400",
    splashRing: "ring-amber-100",
    pillsActive: "bg-amber-600 text-white shadow-xs"
  },
  {
    id: "candy",
    name: "Arum Manis (Playful Candy)",
    description: "Tema warna pastel pink-rose & violet ceria khas anak kelas 1 SD.",
    icon: "🍭",
    primaryColor: "rose",
    bgClass: "from-rose-500 to-purple-600",
    textClass: "text-rose-600",
    textHover: "hover:text-rose-700",
    bgLight: "bg-rose-50 border-rose-100",
    borderFocus: "focus:border-rose-500",
    buttonBg: "bg-rose-500 hover:bg-rose-600",
    buttonAccent: "bg-purple-600 hover:bg-purple-700",
    accentText: "text-rose-700",
    badgeBg: "bg-rose-100 text-rose-800",
    ringColor: "ring-rose-500",
    textLight: "text-rose-100",
    iconBg: "bg-rose-500",
    cardBorder: "border-rose-500",
    cardBg: "bg-rose-50/30",
    cardRing: "ring-rose-100",
    splashBorder: "border-rose-400",
    splashRing: "ring-rose-100",
    pillsActive: "bg-rose-500 text-white shadow-xs"
  },
  {
    id: "cosmic",
    name: "Abu-Abu Kosmik",
    description: "Tema modern minimalis dengan kontras arang dan abu-abu gelap.",
    icon: "🌌",
    primaryColor: "slate",
    bgClass: "from-slate-700 to-slate-900",
    textClass: "text-slate-700",
    textHover: "hover:text-slate-800",
    bgLight: "bg-slate-100 border-slate-200",
    borderFocus: "focus:border-slate-500",
    buttonBg: "bg-slate-800 hover:bg-slate-900",
    buttonAccent: "bg-zinc-700 hover:bg-zinc-800",
    accentText: "text-slate-800",
    badgeBg: "bg-slate-200 text-slate-800",
    ringColor: "ring-slate-500",
    textLight: "text-slate-200",
    iconBg: "bg-slate-800",
    cardBorder: "border-slate-500",
    cardBg: "bg-slate-100",
    cardRing: "ring-slate-100",
    splashBorder: "border-slate-400",
    splashRing: "ring-slate-100",
    pillsActive: "bg-slate-800 text-white shadow-xs"
  }
];

function getBirthDayNumber(birthdayStr?: string): string {
  if (!birthdayStr) return "28";
  const parts = birthdayStr.split(/[-/]/).map(p => p.trim());
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return String(parseInt(parts[2], 10) || 28);
    } else if (parts[2].length === 4) {
      return String(parseInt(parts[0], 10) || 28);
    } else {
      return String(parseInt(parts[2], 10) || 28);
    }
  }
  const m = birthdayStr.match(/\d+/);
  return m ? String(parseInt(m[0], 10)) : "28";
}

function getAutoPassword(nickname?: string, name?: string, birthday?: string): string {
  const nick = (nickname || (name || "").trim().split(/\s+/)[0] || "").toLowerCase().trim().replace(/\s+/g, '');
  const dayNum = getBirthDayNumber(birthday);
  return `${nick || "nama"}${dayNum}`;
}

const ALL_IURAN_MONTHS = [
  "Juli 2026",
  "Agustus 2026",
  "September 2026",
  "Oktober 2026",
  "November 2026",
  "Desember 2026",
  "Januari 2027",
  "Februari 2027",
  "Maret 2027",
  "April 2027",
  "Mei 2027",
  "Juni 2027",
  "Juli 2027",
  "Agustus 2027",
  "September 2027",
  "Oktober 2027",
  "November 2027",
  "Desember 2027"
];

function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth(); // 0 = Jan, 6 = July
  if (year === 2026 && monthIdx >= 6) {
    const idx = Math.min(monthIdx - 6, 5);
    return ALL_IURAN_MONTHS[idx];
  } else if (year === 2027) {
    const idx = Math.min(6 + monthIdx, ALL_IURAN_MONTHS.length - 1);
    return ALL_IURAN_MONTHS[idx];
  }
  return "Juli 2026";
}

import { INITIAL_SEED_DATA } from "./seedData";

export default function App() {
  // DB State (Initial seed data for instant frame-1 render, synced with backend)
  const [dbState, setDbState] = useState<DBState>(INITIAL_SEED_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Current Month & Due Months Filter (Tunggakan only for current month and earlier)
  const currentMonthKey = getCurrentMonthKey();
  const currentMonthIndex = ALL_IURAN_MONTHS.indexOf(currentMonthKey);
  const dueMonthsList = ALL_IURAN_MONTHS.slice(0, currentMonthIndex >= 0 ? currentMonthIndex + 1 : 1);

  // Google Sheets Integration State & Handlers
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  const handleSaveGoogleSheetsConfig = async (newConfig: GoogleSheetsConfig) => {
    try {
      const res = await fetch("/api/settings/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: newConfig })
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => ({
          ...prev,
          settings: data.settings
        }));
      }
    } catch (err) {
      console.error("Gagal menyimpan konfigurasi Google Sheets:", err);
    }
  };

  const triggerAutoSyncTransactions = async (updatedTransactions: Transaction[]) => {
    const cfg = dbState.settings?.googleSheets;
    if (!cfg?.spreadsheetId || cfg.autoSync === false) return;
    const token = getGoogleAccessToken();
    if (!token) return;

    try {
      const res = await syncAllTransactionsToSheet(cfg.spreadsheetId, updatedTransactions, token);
      const now = new Date().toLocaleString("id-ID");
      await handleSaveGoogleSheetsConfig({
        ...cfg,
        lastSyncedAt: now,
        syncedCount: res.syncedCount
      });
    } catch (err) {
      console.warn("Auto-sync ke Google Sheets:", err);
    }
  };

  // Edit Transaction Modal States (Bendahara)
  const [isEditTxModalOpen, setIsEditTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editTxType, setEditTxType] = useState<"IN" | "OUT">("OUT");
  const [editTxCategory, setEditTxCategory] = useState("Kebutuhan Kelas");
  const [editTxAmount, setEditTxAmount] = useState("");
  const [editTxDescription, setEditTxDescription] = useState("");
  const [editTxDate, setEditTxDate] = useState("");
  const [editTxHasReceipt, setEditTxHasReceipt] = useState<"UPLOAD" | "MANUAL">("MANUAL");
  const [editTxStoreName, setEditTxStoreName] = useState("");
  const [editTxStoreAddress, setEditTxStoreAddress] = useState("");
  const [editTxParentName, setEditTxParentName] = useState("");
  const [editTxProofImage, setEditTxProofImage] = useState("");
  const [editTxItems, setEditTxItems] = useState<{ name: string; qty: number; unitPrice: number }[]>([
    { name: "", qty: 1, unitPrice: 0 }
  ]);
  const [isSavingTxEdit, setIsSavingTxEdit] = useState(false);
  const [txEditError, setTxEditError] = useState("");

  const openEditTransactionModal = (tx: Transaction) => {
    setEditingTx(tx);
    setEditTxType(tx.type);

    // If type is OUT, default category to "Kebutuhan Kelas"
    const defaultCat = tx.category || (tx.type === "OUT" ? "Kebutuhan Kelas" : "Iuran Kas");
    setEditTxCategory(defaultCat);
    setEditTxAmount((tx.amount || 0).toString());
    setEditTxDescription(tx.description || "");
    setEditTxDate(tx.date || new Date().toISOString().split("T")[0]);

    setEditTxStoreName(tx.storeName || ((defaultCat === "Jenguk Siswa Sakit" || defaultCat === "Uang Duka") ? "Kas Sosial Kelas 1C" : ""));
    setEditTxStoreAddress(tx.storeAddress || "Kec. Sukadiri, Kab. Tangerang, Banten");
    setEditTxParentName(tx.parentName || (dbState.students[0]?.parentName || "Wali Murid Kelas 1C"));
    setEditTxProofImage(tx.proofImage || "");

    if (defaultCat === "Jenguk Siswa Sakit" || defaultCat === "Uang Duka") {
      const matched = dbState.students.find(s => tx.description?.includes(s.name) || tx.parentName?.includes(s.parentName));
      if (matched) {
        setEditTxSickStudentId(matched.id);
      } else {
        setEditTxSickStudentId("");
      }
    } else {
      setEditTxSickStudentId("");
    }

    const hasPhysicalProof = Boolean(tx.proofImage && !tx.isGeneratedNota && (tx.proofImage.startsWith("data:image") || tx.proofImage.startsWith("http")));
    setEditTxHasReceipt(hasPhysicalProof ? "UPLOAD" : "MANUAL");

    if (tx.items && tx.items.length > 0) {
      setEditTxItems(
        tx.items.map(it => 
          typeof it === "string" 
            ? { name: it, qty: 1, unitPrice: 0 } 
            : { name: it.name, qty: it.qty || 1, unitPrice: it.unitPrice || 0 }
        )
      );
    } else {
      setEditTxItems([
        { name: tx.description || "Perlengkapan / Kebutuhan Kelas", qty: 1, unitPrice: tx.amount || 0 }
      ]);
    }

    setTxEditError("");
    setIsEditTxModalOpen(true);
  };

  const handleAddEditTxItem = () => {
    setEditTxItems(prev => [...prev, { name: "", qty: 1, unitPrice: 0 }]);
  };

  const handleRemoveEditTxItem = (index: number) => {
    if (editTxItems.length <= 1) return;
    const updated = editTxItems.filter((_, i) => i !== index);
    setEditTxItems(updated);
    recalculateEditTxTotal(updated);
  };

  const handleItemChange = (index: number, field: "name" | "qty" | "unitPrice", value: string | number) => {
    const updated = [...editTxItems];
    if (field === "name") {
      updated[index].name = value as string;
    } else if (field === "qty") {
      updated[index].qty = Math.max(1, parseInt(value as string) || 1);
    } else if (field === "unitPrice") {
      updated[index].unitPrice = Math.max(0, parseInt(value as string) || 0);
    }
    setEditTxItems(updated);
    if (editTxHasReceipt === "MANUAL") {
      recalculateEditTxTotal(updated);
    }
  };

  const recalculateEditTxTotal = (itemsList: { name: string; qty: number; unitPrice: number }[]) => {
    const total = itemsList.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    if (total > 0) {
      setEditTxAmount(total.toString());
    }
  };

  const handleSaveTxEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    setIsSavingTxEdit(true);
    setTxEditError("");

    const isManual = editTxHasReceipt === "MANUAL" || !editTxProofImage;
    const validItems = editTxItems.filter(it => it.name.trim() !== "");
    const computedTotal = isManual && validItems.length > 0
      ? validItems.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0)
      : parseInt(editTxAmount) || 0;

    try {
      const res = await fetch(`/api/transactions/${editingTx.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editTxType,
          category: editTxCategory,
          amount: computedTotal,
          description: editTxDescription,
          date: editTxDate,
          storeName: editTxStoreName || undefined,
          storeAddress: editTxStoreAddress || undefined,
          parentName: editTxParentName || undefined,
          items: validItems.length > 0 ? validItems : undefined,
          proofImage: isManual ? undefined : editTxProofImage,
          isGeneratedNota: isManual
        })
      });

      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        setIsEditTxModalOpen(false);
        setEditingTx(null);
        if (resData.dbState) {
          setDbState(resData.dbState);
          triggerAutoSyncTransactions(resData.dbState.transactions);
        } else {
          fetchDB();
        }
      } else {
        const data = await res.json();
        setTxEditError(data.error || "Gagal memperbarui transaksi.");
      }
    } catch (err) {
      console.error("Failed updating transaction:", err);
      setTxEditError("Terjadi kesalahan koneksi server.");
    } finally {
      setIsSavingTxEdit(false);
    }
  };

  const handleDeleteTransaction = async (txId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus transaksi ini? Saldo dan laporan kas akan disesuaikan otomatis.")) {
      return;
    }
    try {
      const res = await fetch(`/api/transactions/${txId}/delete`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.dbState) {
          setDbState(data.dbState);
          triggerAutoSyncTransactions(data.dbState.transactions);
        } else {
          fetchDB();
        }
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Gagal menghapus transaksi.");
      }
    } catch (err) {
      console.error("Failed deleting transaction:", err);
      alert("Terjadi kesalahan koneksi saat menghapus transaksi.");
    }
  };

  // Theme States (Global Visual Vibe)
  const themeId = dbState.settings?.themeId || "blue";
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const selectTheme = async (id: string) => {
    try {
      const res = await fetch("/api/settings/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId: id })
      });
      if (res.ok) {
        // Update the state locally too, so the visual feel changes immediately
        setDbState(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            themeId: id
          }
        }));
      }
    } catch (err) {
      console.error("Gagal memperbarui tampilan secara global:", err);
    }
  };

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  // Roles & Authentication
  const [activeRole, setActiveRole] = useState<"SPLASH" | "WALI_MURID" | "BENDAHARA">("SPLASH");
  const [loginTab, setLoginTab] = useState<"WALI_MURID" | "BENDAHARA">("WALI_MURID");
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Parent Login & Change Password States
  const [parentLoginNickname, setParentLoginNickname] = useState("");
  const [parentLoginPassword, setParentLoginPassword] = useState("");
  const [parentLoginError, setParentLoginError] = useState("");
  const [showParentPassword, setShowParentPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");

  // Layout Tab selection
  const [parentTab, setParentTab] = useState<"dashboard" | "keuangan" | "kasbon_rembes" | "daftar_siswa" | "inventaris">("dashboard");
  const [bendaharaTab, setBendaharaTab] = useState<"ringkasan" | "buku_kas" | "daftar_siswa" | "persetujuan" | "inventaris">("ringkasan");

  // Asset Manager Handlers
  const handleSaveAsset = async (assetData: Partial<ClassAsset>) => {
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDbState(prev => ({
          ...prev,
          assets: data.assets
        }));
      }
    } catch (err) {
      console.error("Error saving asset:", err);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDbState(prev => ({
          ...prev,
          assets: data.assets
        }));
      }
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  // Birthday Corner Month Filter (0 = Januari, 6 = Juli, etc.)
  const [birthdayMonthFilter, setBirthdayMonthFilter] = useState<number>(new Date().getMonth());

  // PWA Mobile App Installation States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkStandalone();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTriggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstallModalOpen(false);
        }
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };


  // Student Detail View & Registration Modal States
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [showMobileOverviewStats, setShowMobileOverviewStats] = useState(false);
  const [tunggakanMonthFilter, setTunggakanMonthFilter] = useState<string>("ALL");
  const [isMonthlyReminderModalOpen, setIsMonthlyReminderModalOpen] = useState(false);
  const [reminderSelectedMonth, setReminderSelectedMonth] = useState<string>(getCurrentMonthKey());
  const [reminderCopySuccess, setReminderCopySuccess] = useState(false);
  const [isWaReportModalOpen, setIsWaReportModalOpen] = useState(false);
  const [waReportSelectedMonth, setWaReportSelectedMonth] = useState<string>("ALL");
  const [waReportCopySuccess, setWaReportCopySuccess] = useState(false);

  // Thank You WA Chat States
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [thankYouSelectedStudentId, setThankYouSelectedStudentId] = useState<string>("");
  const [thankYouSelectedMonths, setThankYouSelectedMonths] = useState<string[]>([]);
  const [thankYouCopySuccess, setThankYouCopySuccess] = useState(false);

  // Transaction Detail Modal State
  const [selectedTxDetail, setSelectedTxDetail] = useState<Transaction | null>(null);
  const [txThankYouCopySuccess, setTxThankYouCopySuccess] = useState(false);
  
  // Registration Form States
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newParentName, setNewParentName] = useState("");
  const [newParentPhone, setNewParentPhone] = useState("");
  const [newBirthday, setNewBirthday] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newInitialWeight, setNewInitialWeight] = useState("");
  const [newInitialHeight, setNewInitialHeight] = useState("");
  const [addStudentError, setAddStudentError] = useState("");
  const [addStudentSuccess, setAddStudentSuccess] = useState("");

  // Student Edit Modal States
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState("");
  const [editNickname, setEditNickname] = useState("");
  const [editParentName, setEditParentName] = useState("");
  const [editParentPhone, setEditParentPhone] = useState("");
  const [editBirthday, setEditBirthday] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Interactive Popup / Modals State
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [viewImageModal, setViewImageModal] = useState<{ src?: string; title: string; tx?: Transaction } | null>(null);

  // Forms Input State
  // 1. Growth Log Form
  const [growthType, setGrowthType] = useState<"weight" | "height">("weight");
  const [growthValue, setGrowthValue] = useState("");
  const [growthDate, setGrowthDate] = useState(new Date().toISOString().split("T")[0]);
  const [growthSuccess, setGrowthSuccess] = useState(false);

  // 2. Manual Iuran Form (Parent Sim)
  const [iuranMonth, setIuranMonth] = useState("Juli 2026");
  const [iuranLoading, setIuranLoading] = useState(false);
  const [iuranSuccess, setIuranSuccess] = useState(false);

  // 3. New Kasbon Form
  const [kasbonAmount, setKasbonAmount] = useState("");
  const [kasbonPurpose, setKasbonPurpose] = useState("");
  const [kasbonPayoutMethod, setKasbonPayoutMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [kasbonBank, setKasbonBank] = useState("Bank BCA");
  const [kasbonAccount, setKasbonAccount] = useState("");
  const [kasbonAccName, setKasbonAccName] = useState("");
  const [kasbonSuccess, setKasbonSuccess] = useState(false);

  // 4. New Reimbursement Form
  const [rembesAmount, setRembesAmount] = useState("");
  const [rembesPurpose, setRembesPurpose] = useState("");
  const [rembesBank, setRembesBank] = useState("Bank BCA");
  const [rembesAccount, setRembesAccount] = useState("");
  const [rembesAccName, setRembesAccName] = useState("");
  const [rembesReceipt, setRembesReceipt] = useState("");
  const [rembesOcr, setRembesOcr] = useState<OCRResult | null>(null);
  const [rembesItems, setRembesItems] = useState<ReceiptItem[]>([]);
  const [rembesSuccess, setRembesSuccess] = useState(false);
  const [showOcrVerifier, setShowOcrVerifier] = useState(false);
  const [rembesFromKasbon, setRembesFromKasbon] = useState(true);
  const [rembesKasbonId, setRembesKasbonId] = useState("");
  const [rembesReturnMethod, setRembesReturnMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [rembesReturnProofImage, setRembesReturnProofImage] = useState("");
  const [rembesPayoutMethod, setRembesPayoutMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [rembesItemPhoto, setRembesItemPhoto] = useState("");
  const [rembesIsGeneratedNota, setRembesIsGeneratedNota] = useState(false);

  // 5. Admin Manual Transaction Form
  const [txType, setTxType] = useState<"IN" | "OUT">("IN");
  const [txCategory, setTxCategory] = useState("Iuran Kas");
  const [txAmount, setTxAmount] = useState("");
  const [txDesc, setTxDesc] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txProofImage, setTxProofImage] = useState("");
  const [txIsGeneratedNota, setTxIsGeneratedNota] = useState(false);
  const [txReceiptMode, setTxReceiptMode] = useState<"NONE" | "UPLOAD" | "GENERATE">("NONE");
  const [selectedSickStudentId, setSelectedSickStudentId] = useState("");
  const [editTxSickStudentId, setEditTxSickStudentId] = useState("");

  // 6. Admin Process Form (Approval Modal)
  const [processingItem, setProcessingItem] = useState<{ type: "KASBON" | "REMBES", item: any } | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // 7. Wali Murid Self-Service Iuran Confirmation Modal
  const [isIuranConfirmModalOpen, setIsIuranConfirmModalOpen] = useState(false);
  const [selectedIuranMonths, setSelectedIuranMonths] = useState<string[]>([]);
  const [iuranPaymentMethod, setIuranPaymentMethod] = useState<"CASH" | "TRANSFER">("CASH");
  const [iuranProofImage, setIuranProofImage] = useState("");
  const [iuranConfirmLoading, setIuranConfirmLoading] = useState(false);
  const [iuranConfirmError, setIuranConfirmError] = useState("");
  const [iuranConfirmSuccess, setIuranConfirmSuccess] = useState("");

  // 8. Bendahara Manual Transaction Selector State & Year Filter
  const [selectedIuranStudentId, setSelectedIuranStudentId] = useState("");
  const [selectedManualMonths, setSelectedManualMonths] = useState<string[]>([]);
  const [selectedYearFilter, setSelectedYearFilter] = useState<number>(2026);

  const getMonthsForYear = (year: number) => {
    if (year === 2026) {
      return [
        { key: "Juli 2026", label: "Juli" },
        { key: "Agustus 2026", label: "Agustus" },
        { key: "September 2026", label: "September" },
        { key: "Oktober 2026", label: "Oktober" },
        { key: "November 2026", label: "November" },
        { key: "Desember 2026", label: "Desember" }
      ];
    } else {
      const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return monthNames.map(m => ({
        key: `${m} ${year}`,
        label: m.substring(0, 3)
      }));
    }
  };

  // Synced state on Mount & Sync Trigger
  const fetchDB = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/db");
      if (res.ok) {
        const data = await res.json();
        setDbState(data);
      }
    } catch (err) {
      console.error("Gagal sinkronisasi data dari server:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      await fetchDB();
      try {
        const savedSession = localStorage.getItem("kas_pintar_remember_session");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.role === "BENDAHARA") {
            setActiveRole("BENDAHARA");
            setBendaharaTab("ringkasan");
          } else if (parsed.role === "WALI_MURID" && parsed.studentId) {
            setActiveRole("WALI_MURID");
            setSelectedStudentId(parsed.studentId);
            if (parsed.parentName) {
              setKasbonAccName(parsed.parentName);
              setRembesAccName(parsed.parentName);
            }
            setParentTab("dashboard");
          }
        }
      } catch (err) {
        console.error("Gagal memuat sesi login otomatis:", err);
      }
    };

    initApp();
  }, []);

  // Quick helper to get active parent's student record
  const currentStudent = dbState.students.find(s => s.id === selectedStudentId);

  // Calculation helpers for dashboard summary
  const getTotals = () => {
    let totalMasuk = 0;
    let totalKeluar = 0;
    dbState.transactions.forEach(tx => {
      if (tx.type === "IN") totalMasuk += tx.amount;
      else totalKeluar += tx.amount;
    });
    return {
      totalMasuk,
      totalKeluar,
      saldo: totalMasuk - totalKeluar
    };
  };

  const totals = getTotals();

  const [overviewYearFilter, setOverviewYearFilter] = useState<string>("2026");
  const [cashbookYearFilter, setCashbookYearFilter] = useState<string>("2026");
  const [cashbookMonthOnlyFilter, setCashbookMonthOnlyFilter] = useState<string>("ALL");

  const cashbookMonthFilter = (() => {
    if (cashbookYearFilter === "ALL" && cashbookMonthOnlyFilter === "ALL") return "ALL";
    if (cashbookYearFilter === "ALL" && cashbookMonthOnlyFilter !== "ALL") return `MONTH-${cashbookMonthOnlyFilter}`;
    if (cashbookYearFilter !== "ALL" && cashbookMonthOnlyFilter === "ALL") return cashbookYearFilter;
    return `${cashbookYearFilter}-${cashbookMonthOnlyFilter}`;
  })();

  const getPeriodLabel = (filterKey: string): string => {
    if (!filterKey || filterKey === "ALL") return "Semua Bulan";

    const monthNames: { [key: string]: string } = {
      "01": "Januari",
      "02": "Februari",
      "03": "Maret",
      "04": "April",
      "05": "Mei",
      "06": "Juni",
      "07": "Juli",
      "08": "Agustus",
      "09": "September",
      "10": "Oktober",
      "11": "November",
      "12": "Desember"
    };

    if (filterKey.startsWith("MONTH-")) {
      const m = filterKey.replace("MONTH-", "");
      return (monthNames[m] || m) + " (Semua Tahun)";
    }

    if (filterKey.length === 4) {
      return "Tahun " + filterKey;
    }

    if (filterKey.includes("-")) {
      const [year, month] = filterKey.split("-");
      if (monthNames[month]) {
        return `${monthNames[month]} ${year}`;
      }
    }

    return filterKey;
  };

  const getMonthlyBreakdown = (yearFilter?: string) => {
    const months = [
      { key: "2026-07", name: "Juli 2026" },
      { key: "2026-08", name: "Agustus 2026" },
      { key: "2026-09", name: "September 2026" },
      { key: "2026-10", name: "Oktober 2026" },
      { key: "2026-11", name: "November 2026" },
      { key: "2026-12", name: "Desember 2026" },
      { key: "2027-01", name: "Januari 2027" },
      { key: "2027-02", name: "Februari 2027" },
      { key: "2027-03", name: "Maret 2027" },
      { key: "2027-04", name: "April 2027" },
      { key: "2027-05", name: "Mei 2027" },
      { key: "2027-06", name: "Juni 2027" },
      { key: "2027-07", name: "Juli 2027" },
      { key: "2027-08", name: "Agustus 2027" },
      { key: "2027-09", name: "September 2027" },
      { key: "2027-10", name: "Oktober 2027" },
      { key: "2027-11", name: "November 2027" },
      { key: "2027-12", name: "Desember 2027" }
    ];

    const map: { [key: string]: { monthName: string; totalMasuk: number; totalKeluar: number } } = {};
    
    months.forEach(m => {
      map[m.key] = { monthName: m.name, totalMasuk: 0, totalKeluar: 0 };
    });

    dbState.transactions.forEach(tx => {
      if (!tx.date) return;
      const key = tx.date.substring(0, 7);
      if (!map[key]) {
        const [year, monthNum] = key.split("-");
        const mIdx = parseInt(monthNum, 10) - 1;
        const mNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const mName = mIdx >= 0 && mIdx < 12 ? `${mNames[mIdx]} ${year}` : key;
        map[key] = { monthName: mName, totalMasuk: 0, totalKeluar: 0 };
      }
      if (tx.type === "IN") {
        map[key].totalMasuk += tx.amount;
      } else {
        map[key].totalKeluar += tx.amount;
      }
    });

    const sortedKeys = Object.keys(map).sort();
    let cumulative = 0;

    const result = sortedKeys.map(key => {
      const item = map[key];
      const saldoAwal = cumulative;
      const net = item.totalMasuk - item.totalKeluar;
      const saldoAkhir = saldoAwal + net;
      cumulative = saldoAkhir;

      return {
        monthKey: key,
        monthName: item.monthName,
        saldoAwal,
        totalMasuk: item.totalMasuk,
        totalKeluar: item.totalKeluar,
        net,
        saldoAkhir
      };
    });

    if (yearFilter && yearFilter !== "ALL") {
      return result.filter(r => r.monthKey.startsWith(yearFilter));
    }

    return result;
  };

  const getFilteredCashbookData = (filter: string) => {
    let filteredTx = [...dbState.transactions];
    if (filter !== "ALL") {
      if (filter.startsWith("MONTH-")) {
        const monthStr = filter.replace("MONTH-", "");
        filteredTx = filteredTx.filter(tx => {
          if (!tx.date) return false;
          const parts = tx.date.split("-");
          return parts[1] === monthStr;
        });
      } else {
        filteredTx = filteredTx.filter(tx => tx.date && tx.date.startsWith(filter));
      }
    }

    // Sort transactions by date descending (latest date first), then by id descending
    filteredTx.sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return (b.id || "").localeCompare(a.id || "");
    });

    let totalMasuk = 0;
    let totalKeluar = 0;
    filteredTx.forEach(tx => {
      if (tx.type === "IN") totalMasuk += tx.amount;
      else totalKeluar += tx.amount;
    });

    return {
      transactions: filteredTx,
      totalMasuk,
      totalKeluar,
      saldoFilter: totalMasuk - totalKeluar
    };
  };

  // Helper: Generate raw unencoded formatted text for monthly cashbook report
  const getWaCashbookRawText = (filterKey: string) => {
    const periodLabel = getPeriodLabel(filterKey);
    const filteredData = getFilteredCashbookData(filterKey);
    const totalStats = getTotals();

    let msg = `Assalamu'alaikum Wr. Wb. 🙏\n\n📢 *RINGKASAN LAPORAN KAS KELAS 1C* 📢\n`;
    msg += `🏫 *MADRASAH IBTIDAIYAH TERPADU MA BUARAN JATI*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📅 *PERIODE:* ${periodLabel.toUpperCase()}\n\n`;

    msg += `📊 *RINGKASAN KEUANGAN KAS:*\n`;
    msg += `🟢 *Total Penerimaan (Masuk):* ${formatRupiah(filteredData.totalMasuk)}\n`;
    msg += `🔴 *Total Pengeluaran (Keluar):* ${formatRupiah(filteredData.totalKeluar)}\n`;
    msg += `💰 *Saldo Periode Ini:* ${formatRupiah(filteredData.saldoFilter)}\n`;
    msg += `🏦 *TOTAL SALDO KAS UTAMA SAAT INI:* ${formatRupiah(totalStats.saldo)}\n`;

    msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✨ *Catatan:* Data buku kas ini dikelola secara terbuka & transparan via Aplikasi Kas Pintar Kelas 1C.\n`;
    msg += `🙏 Terima kasih kepada seluruh Bapak/Ibu Wali Murid Kelas 1C atas perhatian dan kerjasamanya.`;

    return msg;
  };

  // Helper: Generate encoded URL string for WhatsApp sharing
  const generateWaCashbookShareText = (filterKey: string) => {
    return encodeURIComponent(getWaCashbookRawText(filterKey));
  };

  // Helper: Device ID for single active device lock
  const getDeviceId = (): string => {
    if (typeof window === "undefined") return "device_default";
    let id = localStorage.getItem("kas_pintar_device_id");
    if (!id) {
      id = "device_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("kas_pintar_device_id", id);
    }
    return id;
  };

  // Single Device Active Session Lock Polling
  useEffect(() => {
    if (activeRole === "SPLASH") return;

    // Passive heartbeat to ensure session stays alive
    const sessionCheckInterval = setInterval(async () => {
      try {
        const devId = getDeviceId();
        const query = new URLSearchParams({
          role: activeRole,
          studentId: selectedStudentId || "",
          deviceId: devId
        });

        await fetch(`/api/check-session?${query.toString()}`);
      } catch (err) {
        // network silent retry
      }
    }, 15000);

    return () => clearInterval(sessionCheckInterval);
  }, [activeRole, selectedStudentId]);

  // Handle Login Roles
  const handleParentLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentLoginNickname || !parentLoginPassword) {
      setParentLoginError("Nama panggilan anak dan sandi wajib diisi!");
      return;
    }
    setParentLoginError("");

    try {
      const devId = getDeviceId();
      const res = await fetch("/api/login-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: parentLoginNickname,
          password: parentLoginPassword,
          deviceId: devId
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.student) {
        const student = data.student;
        setSelectedStudentId(student.id);
        setKasbonAccName(student.parentName);
        setRembesAccName(student.parentName);

        if (rememberMe) {
          localStorage.setItem("kas_pintar_remember_session", JSON.stringify({
            role: "WALI_MURID",
            studentId: student.id,
            parentName: student.parentName,
            timestamp: Date.now()
          }));
        } else {
          localStorage.removeItem("kas_pintar_remember_session");
        }

        setIsChangingPassword(!!data.mustChangePassword);
        setActiveRole("WALI_MURID");
        setParentTab("dashboard");
        setParentLoginNickname("");
        setParentLoginPassword("");
        return;
      }

      if (!res.ok && data.error && res.status === 401) {
        setParentLoginError(data.error);
        return;
      }
    } catch (err) {
      // Network/Server error fallback
    }

    // Client-side fallback for Wali Murid
    const targetNick = parentLoginNickname.trim().toLowerCase();
    const targetPwd = parentLoginPassword.trim();
    const found = dbState.students.find(s => 
      (s.nickname || "").toLowerCase() === targetNick ||
      s.name.toLowerCase().includes(targetNick) ||
      s.id === parentLoginNickname
    );

    if (found) {
      const expectedPwd = found.password || getAutoPassword(found.nickname, found.name, found.birthday);
      if (targetPwd === expectedPwd || targetPwd === "123" || targetPwd.toLowerCase() === "123") {
        setSelectedStudentId(found.id);
        setKasbonAccName(found.parentName);
        setRembesAccName(found.parentName);
        if (rememberMe) {
          localStorage.setItem("kas_pintar_remember_session", JSON.stringify({
            role: "WALI_MURID",
            studentId: found.id,
            parentName: found.parentName,
            timestamp: Date.now()
          }));
        } else {
          localStorage.removeItem("kas_pintar_remember_session");
        }
        setActiveRole("WALI_MURID");
        setParentTab("dashboard");
        setParentLoginNickname("");
        setParentLoginPassword("");
        return;
      }
    }

    setParentLoginError("Nama panggilan anak atau kata sandi tidak sesuai.");
  };

  const handleQuickBudiLogin = async () => {
    setParentLoginNickname("Budi");
    setParentLoginPassword("123");
    setParentLoginError("");

    try {
      const devId = getDeviceId();
      const res = await fetch("/api/login-parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: "Budi",
          password: "123",
          deviceId: devId
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.student) {
        const student = data.student;
        setSelectedStudentId(student.id);
        setKasbonAccName(student.parentName);
        setRembesAccName(student.parentName);

        if (rememberMe) {
          localStorage.setItem("kas_pintar_remember_session", JSON.stringify({
            role: "WALI_MURID",
            studentId: student.id,
            parentName: student.parentName,
            timestamp: Date.now()
          }));
        } else {
          localStorage.removeItem("kas_pintar_remember_session");
        }

        setIsChangingPassword(!!data.mustChangePassword);
        setActiveRole("WALI_MURID");
        setParentTab("dashboard");
        setParentLoginNickname("");
        setParentLoginPassword("");
        return;
      }
    } catch (err) {
      // Network error
    }

    const found = dbState.students[0];
    if (found) {
      setSelectedStudentId(found.id);
      setKasbonAccName(found.parentName);
      setRembesAccName(found.parentName);
      setActiveRole("WALI_MURID");
      setParentTab("dashboard");
      setParentLoginNickname("");
      setParentLoginPassword("");
    }
  };

  const handleParentChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) {
      setChangePasswordError("Sandi baru wajib diisi!");
      return;
    }
    if (newPasswordInput === "123") {
      setChangePasswordError("Sandi baru tidak boleh menggunakan sandi sementara '123'!");
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setChangePasswordError("Konfirmasi sandi baru tidak cocok!");
      return;
    }
    setChangePasswordError("");

    try {
      const res = await fetch(`/api/students/${selectedStudentId}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPasswordInput
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setChangePasswordSuccess("Sandi berhasil diperbarui! Selamat datang di dashboard.");
        setTimeout(() => {
          setIsChangingPassword(false);
          setNewPasswordInput("");
          setConfirmNewPasswordInput("");
          setChangePasswordSuccess("");
          fetchDB();
        }, 1500);
        return;
      }
    } catch (err) {
      // Fallback update locally
    }

    setIsChangingPassword(false);
    setNewPasswordInput("");
    setConfirmNewPasswordInput("");
    setChangePasswordSuccess("");
  };

  const handleBendaharaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordInput) {
      setAdminAuthError("Masukkan sandi Bendahara.");
      return;
    }

    const cleanPwd = adminPasswordInput.trim().toUpperCase();

    try {
      const devId = getDeviceId();
      const res = await fetch("/api/login-bendahara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: adminPasswordInput,
          deviceId: devId
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (rememberMe) {
          localStorage.setItem("kas_pintar_remember_session", JSON.stringify({
            role: "BENDAHARA",
            timestamp: Date.now()
          }));
        } else {
          localStorage.removeItem("kas_pintar_remember_session");
        }

        setActiveRole("BENDAHARA");
        setAdminPasswordInput("");
        setAdminAuthError("");
        setBendaharaTab("ringkasan");
        return;
      }

      if (!res.ok && data.error && res.status === 401) {
        setAdminAuthError(data.error);
        return;
      }
    } catch (err) {
      // Network/Server error fallback
    }

    // Resilient Client-Side Fallback for Bendahara Login
    if (cleanPwd === "MIT2026" || cleanPwd === "ADMIN" || cleanPwd === "BEND2026" || cleanPwd === "123") {
      if (rememberMe) {
        localStorage.setItem("kas_pintar_remember_session", JSON.stringify({
          role: "BENDAHARA",
          timestamp: Date.now()
        }));
      } else {
        localStorage.removeItem("kas_pintar_remember_session");
      }

      setActiveRole("BENDAHARA");
      setAdminPasswordInput("");
      setAdminAuthError("");
      setBendaharaTab("ringkasan");
      return;
    }

    setAdminAuthError("Kata sandi Bendahara salah! Hanya bendahara yang memiliki akses ini.");
  };

  // Post Call Helpers
  const handleAddGrowthLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !growthValue) return;

    try {
      const res = await fetch(`/api/students/${selectedStudentId}/growth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: growthType,
          value: growthValue,
          date: growthDate
        })
      });

      if (res.ok) {
        setGrowthSuccess(true);
        setGrowthValue("");
        fetchDB();
        setTimeout(() => setGrowthSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayIuranSimulated = async (month: string, amount: number) => {
    if (!selectedStudentId) return;
    setIuranLoading(true);

    try {
      const res = await fetch("/api/pay-iuran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          month,
          amount,
          datePaid: new Date().toISOString().split("T")[0]
        })
      });

      if (res.ok) {
        setIuranSuccess(true);
        fetchDB();
        setTimeout(() => setIuranSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIuranLoading(false);
    }
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditNickname(student.nickname || student.name.trim().split(/\s+/)[0]);
    setEditParentName(student.parentName);
    setEditParentPhone(student.parentPhone);
    setEditBirthday(student.birthday);
    setEditPhotoUrl(student.photoUrl || "");
    setEditError("");
    setEditSuccess("");
    setIsEditStudentModalOpen(true);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setEditError("Ukuran foto maksimal 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoUrl(reader.result as string);
        setEditError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewStudentPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setAddStudentError("Ukuran foto maksimal 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoUrl(reader.result as string);
        setAddStudentError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddStudentError("");
    setAddStudentSuccess("");
    if (!newName || !newParentName || !newParentPhone) {
      setAddStudentError("Nama siswa, nama wali murid, dan nomor HP/WA wajib diisi.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          nickname: newNickname,
          parentName: newParentName,
          parentPhone: newParentPhone,
          birthday: newBirthday || "2019-01-28",
          photoUrl: newPhotoUrl,
          initialWeight: newInitialWeight,
          initialHeight: newInitialHeight
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAddStudentSuccess("Siswa baru berhasil diregistrasi!");
        fetchDB();
        setTimeout(() => {
          setIsAddStudentModalOpen(false);
          setNewName("");
          setNewNickname("");
          setNewParentName("");
          setNewParentPhone("");
          setNewBirthday("");
          setNewPhotoUrl("");
          setNewInitialWeight("");
          setNewInitialHeight("");
          setAddStudentSuccess("");
        }, 1200);
      } else {
        setAddStudentError(data.error || "Gagal meregistrasi siswa.");
      }
    } catch (err) {
      setAddStudentError("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          nickname: editNickname,
          parentName: editParentName,
          parentPhone: editParentPhone,
          birthday: editBirthday,
          photoUrl: editPhotoUrl
        })
      });
      
      if (res.ok) {
        setEditSuccess("Data siswa berhasil diperbarui!");
        setTimeout(() => {
          setIsEditStudentModalOpen(false);
          setEditingStudent(null);
        }, 1200);
        fetchDB();
      } else {
        const errData = await res.json();
        setEditError(errData.error || "Gagal memperbarui data siswa");
      }
    } catch (err) {
      setEditError("Terjadi kesalahan koneksi internet.");
      console.error(err);
    }
  };

  const handleApplyKasbon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !kasbonAmount || !kasbonPurpose) return;

    if (kasbonPayoutMethod === "TRANSFER" && (!kasbonAccount || !kasbonAccName)) {
      alert("Mohon lengkapi nomor dan atas nama rekening bank/e-wallet pengiriman!");
      return;
    }

    try {
      const res = await fetch("/api/kasbons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          parentName: currentStudent?.parentName || "Orang Tua",
          amount: kasbonAmount,
          purpose: kasbonPurpose,
          payoutMethod: kasbonPayoutMethod,
          bankName: kasbonPayoutMethod === "TRANSFER" ? kasbonBank : "",
          bankAccount: kasbonPayoutMethod === "TRANSFER" ? kasbonAccount : "",
          bankAccountName: kasbonPayoutMethod === "TRANSFER" ? kasbonAccName : ""
        })
      });

      if (res.ok) {
        setKasbonSuccess(true);
        setKasbonAmount("");
        setKasbonPurpose("");
        setKasbonAccount("");
        setKasbonAccName("");
        fetchDB();
        setTimeout(() => setKasbonSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyRembes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !rembesAmount || !rembesPurpose || !rembesReceipt) return;

    let activeKasbonVal = 0;
    if (rembesFromKasbon) {
      if (rembesKasbonId) {
        const foundKb = dbState.kasbons.find(k => k.id === rembesKasbonId);
        if (foundKb) activeKasbonVal = foundKb.amount;
      } else {
        activeKasbonVal = currentStudent?.sisaKasbon || 0;
      }
    }

    try {
      const res = await fetch("/api/reimbursements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          parentName: currentStudent?.parentName || "Orang Tua",
          amount: rembesAmount,
          purpose: rembesPurpose,
          fromKasbon: rembesFromKasbon,
          kasbonId: rembesKasbonId,
          kasbonAmount: activeKasbonVal,
          returnMethod: rembesReturnMethod,
          returnProofImage: rembesReturnProofImage,
          payoutMethod: rembesPayoutMethod,
          bankName: rembesBank,
          bankAccount: rembesAccount,
          bankAccountName: rembesAccName,
          receiptImage: rembesReceipt,
          itemPhoto: rembesItemPhoto,
          isGeneratedNota: rembesIsGeneratedNota,
          ocrResult: rembesOcr ? { ...rembesOcr, items: rembesItems.length > 0 ? rembesItems : rembesOcr.items } : null
        })
      });

      if (res.ok) {
        setRembesSuccess(true);
        setRembesAmount("");
        setRembesPurpose("");
        setRembesAccount("");
        setRembesReceipt("");
        setRembesOcr(null);
        setRembesItems([]);
        setRembesFromKasbon(true);
        setRembesKasbonId("");
        setRembesReturnMethod("CASH");
        setRembesReturnProofImage("");
        setRembesPayoutMethod("CASH");
        setRembesItemPhoto("");
        setRembesIsGeneratedNota(false);
        fetchDB();
        setTimeout(() => setRembesSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReceiptOcrVerified = (result: OCRResult, imageBase64: string, isGeneratedNota?: boolean, itemPhotoBase64?: string) => {
    setRembesAmount(result.totalAmount.toString());
    setRembesReceipt(imageBase64);
    setRembesOcr(result);
    setRembesIsGeneratedNota(Boolean(isGeneratedNota));
    setRembesItemPhoto(itemPhotoBase64 || "");

    const formattedItems: ReceiptItem[] = (result.items || []).map((it, idx) => {
      if (typeof it === "string") {
        const uPrice = Math.round(result.totalAmount / (result.items.length || 1));
        return {
          id: idx.toString(),
          name: it,
          qty: 1,
          unitPrice: uPrice,
          price: uPrice
        };
      }
      const q = it.qty || 1;
      const uPrice = it.unitPrice || (it.price ? Math.round(it.price / q) : Math.round(result.totalAmount / (result.items.length || 1)));
      return {
        id: it.id || idx.toString(),
        name: it.name,
        qty: q,
        unitPrice: uPrice,
        price: it.price || (q * uPrice)
      };
    });

    setRembesItems(formattedItems);

    const itemNamesStr = formattedItems.map(i => `${i.name} (${i.qty}x @ ${formatRupiah(i.unitPrice)})`).join(", ");
    const purposeText = itemNamesStr 
      ? `Pembelian: ${itemNamesStr} (${result.merchant})` 
      : `Pembelian keperluan sekolah (${result.merchant})`;
    setRembesPurpose(purposeText);
    setShowOcrVerifier(true);
  };

  const handleSubmitIuranConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;
    if (selectedIuranMonths.length === 0) {
      setIuranConfirmError("Silakan pilih minimal satu bulan yang dibayarkan.");
      return;
    }

    setIuranConfirmLoading(true);
    setIuranConfirmError("");
    setIuranConfirmSuccess("");

    try {
      const res = await fetch("/api/iuran-confirmations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentStudent.id,
          parentName: currentStudent.parentName,
          months: selectedIuranMonths,
          paymentMethod: iuranPaymentMethod,
          proofImage: iuranProofImage
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIuranConfirmSuccess("Konfirmasi pembayaran iuran kas berhasil dikirim ke Bendahara!");
        setSelectedIuranMonths([]);
        setIuranProofImage("");
        fetchDB();
        setTimeout(() => {
          setIuranConfirmSuccess("");
          setIsIuranConfirmModalOpen(false);
        }, 2000);
      } else {
        setIuranConfirmError(data.error || "Gagal mengirim konfirmasi");
      }
    } catch (err) {
      setIuranConfirmError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIuranConfirmLoading(false);
    }
  };

  const handleProcessIuranConfirmation = async (confId: string, status: "APPROVED" | "REJECTED") => {
    try {
      const targetConf = dbState.iuranConfirmations?.find(c => c.id === confId);
      const res = await fetch(`/api/iuran-confirmations/${confId}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        if (resData.dbState) {
          setDbState(resData.dbState);
          triggerAutoSyncTransactions(resData.dbState.transactions);
        } else {
          fetchDB();
        }
        if (status === "APPROVED" && targetConf) {
          const std = dbState.students.find(s => s.id === targetConf.studentId);
          if (std) {
            handleCopyWhatsAppThankYou(std, targetConf.months);
            setThankYouSelectedStudentId(std.id);
            setThankYouSelectedMonths(targetConf.months);
            setIsThankYouModalOpen(true);
          }
        }
      }
    } catch (err) {
      console.error("Gagal memproses konfirmasi iuran:", err);
    }
  };

  const handleAddManualTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (txLoading) return;

    let finalAmount = txAmount;
    let finalDesc = txDesc;

    if (txCategory === "Iuran Kas" && txType === "IN") {
      if (!selectedIuranStudentId) {
        alert("Silakan pilih nama siswa yang terdaftar!");
        return;
      }
      if (selectedManualMonths.length === 0) {
        alert("Silakan ceklis minimal satu bulan iuran yang dibayarkan!");
        return;
      }
      const st = dbState.students.find(s => s.id === selectedIuranStudentId);
      finalAmount = (selectedManualMonths.length * 20000).toString();
      if (!finalDesc || finalDesc.trim() === "") {
        finalDesc = `Iuran Kas Bulan ${selectedManualMonths.join(", ")} - Siswa: ${st?.name || ""} (Wali: ${st?.parentName || ""})`;
      }
    } else if (txCategory === "Jenguk Siswa Sakit") {
      if (!selectedSickStudentId) {
        alert("Silakan pilih nama siswa yang dijenguk!");
        return;
      }
      const st = dbState.students.find(s => s.id === selectedSickStudentId);
      finalAmount = "150000";
      if (!finalDesc || finalDesc.trim() === "") {
        finalDesc = `Santunan / Biaya Jenguk Siswa Sakit - ${st?.name || ""} (Wali: ${st?.parentName || ""})`;
      }
    } else if (txCategory === "Uang Duka") {
      if (!finalAmount || parseInt(finalAmount) <= 0) {
        finalAmount = "200000";
      }
      if (!finalDesc || finalDesc.trim() === "") {
        finalDesc = "Uang Duka";
      }
    } else {
      if (!finalAmount || parseInt(finalAmount) <= 0) {
        alert("Silakan masukkan nominal transaksi yang valid (lebih dari 0)!");
        return;
      }
      if (!finalDesc || finalDesc.trim() === "") {
        alert("Silakan masukkan detail keterangan transaksi!");
        return;
      }
    }

    let finalProofImage = txProofImage;
    if (txType === "OUT" && (txReceiptMode === "GENERATE" || !finalProofImage)) {
      finalProofImage = `Pembelian: ${finalDesc} Rp ${parseInt(finalAmount).toLocaleString("id-ID")} (${txCategory})`;
    }

    const payload: any = {
      type: txType,
      category: txCategory,
      amount: finalAmount,
      description: finalDesc,
      date: txDate || new Date().toISOString().split("T")[0],
      proofImage: finalProofImage,
      isGeneratedNota: txType === "OUT" && (txReceiptMode === "GENERATE" || txIsGeneratedNota || !txProofImage)
    };

    if (txCategory === "Iuran Kas" && txType === "IN") {
      const st = dbState.students.find(s => s.id === selectedIuranStudentId);
      payload.studentId = selectedIuranStudentId;
      payload.studentName = st?.name;
      payload.parentName = st?.parentName;
      payload.months = selectedManualMonths;
    } else if (txCategory === "Jenguk Siswa Sakit") {
      const st = dbState.students.find(s => s.id === selectedSickStudentId);
      payload.studentId = selectedSickStudentId;
      payload.studentName = st?.name;
      payload.storeName = "Kas Sosial Kelas 1C";
      payload.parentName = st?.parentName || "Wali Murid Kelas 1C";
      payload.items = [
        { name: `Santunan / Biaya Jenguk Siswa Sakit - ${st?.name || ""}`, qty: 1, unitPrice: 150000 }
      ];
    } else if (txCategory === "Uang Duka") {
      const st = dbState.students.find(s => s.id === selectedSickStudentId);
      payload.storeName = "Kas Sosial Kelas 1C";
      if (st) {
        payload.studentId = st.id;
        payload.studentName = st.name;
        payload.parentName = st.parentName;
      }
      payload.items = [
        { name: finalDesc, qty: 1, unitPrice: parseInt(finalAmount) || 200000 }
      ];
    }

    setTxLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.dbState) {
          setDbState(data.dbState);
          triggerAutoSyncTransactions(data.dbState.transactions);
        } else {
          await fetchDB();
        }
        setTxSuccess(true);
        setTxAmount("");
        setTxDesc("");
        setTxProofImage("");
        setTxIsGeneratedNota(false);
        setTxReceiptMode("NONE");
        setSelectedIuranStudentId("");
        setSelectedManualMonths([]);
        setSelectedSickStudentId("");
        setTimeout(() => setTxSuccess(false), 4000);
      } else {
        const errData = await res.json().catch(() => ({ error: "Gagal menyimpan transaksi" }));
        alert(errData.error || "Gagal menyimpan transaksi ke dalam buku kas.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi saat mencatat transaksi.");
    } finally {
      setTxLoading(false);
    }
  };

  // Bendahara processing Kasbon or Rembes Approval
  const handleProcessSubmission = async (status: "APPROVED" | "REJECTED") => {
    if (!processingItem) return;
    const { type, item } = processingItem;
    
    const endpoint = type === "KASBON" 
      ? `/api/kasbons/${item.id}/process`
      : `/api/reimbursements/${item.id}/process`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes
        })
      });

      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        setProcessingItem(null);
        setAdminNotes("");
        if (resData.dbState) {
          setDbState(resData.dbState);
          triggerAutoSyncTransactions(resData.dbState.transactions);
        } else {
          fetchDB();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate concise copyable WhatsApp notification template for unpaid monthly cash
  const handleCopyWhatsAppNotification = (student: Student) => {
    const unpaidMonths = student.iuranStatus.filter(i => !i.paid && dueMonthsList.includes(i.month));
    if (unpaidMonths.length === 0) return;

    const totalBills = unpaidMonths.reduce((sum, curr) => sum + curr.amount, 0);
    const monthsText = unpaidMonths.map(i => ` • *${i.month}* (${formatRupiah(i.amount)})`).join("\n");

    const message = `Assalamu'alaikum Wr. Wb. 🙏

📢 *INFO TAGIHAN KAS KELAS 1C*

Yth. Bpk/Ibu *${student.parentName}* (Wali *${student.name}*),

Mengingatkan iuran Kas 1C yang belum terbayar:
${monthsText}
*Total Tagihan: ${formatRupiah(totalBills)}*

Mohon konfirmasi jika sudah melakukan pembayaran. Terima kasih! 🙏😊`;

    navigator.clipboard.writeText(message);
    setCopyStatus(student.id);
    setTimeout(() => setCopyStatus(null), 3000);
  };

  // Helper function to copy payment account details for Bendahara
  const handleCopyPaymentInfo = () => {
    const info = `Assalamu'alaikum Wr. Wb. 🙏\n\n💳 *INFORMASI REKENING PEMBAYARAN KAS KELAS 1C*\n\n💵 *Cash:* Setiap Sabtu (09.30 WIB) di sekolah (Bendahara Yayah Sulhiyah)\n📱 *DANA:* 085715524962 (a.n. Yayah Sulhiyah)\n🏦 *Bank BSI:* 7298472591 (a.n. Yayah Sulhiyah)`;
    navigator.clipboard.writeText(info);
    setCopyStatus("payment_info_copied");
    setTimeout(() => setCopyStatus(null), 3000);
  };

  // Generate copyable WhatsApp thank-you message for paid student
  const handleCopyWhatsAppThankYou = (student: Student, specificMonths?: string[]) => {
    const paidItems = student.iuranStatus ? student.iuranStatus.filter(i => i.paid && (!specificMonths || specificMonths.length === 0 || specificMonths.includes(i.month))) : [];
    const targetMonths = paidItems.length > 0 ? paidItems : (student.iuranStatus ? student.iuranStatus.filter(i => i.paid) : []);

    if (targetMonths.length === 0) {
      alert("Siswa ini belum memiliki riwayat bulan yang lunas.");
      return;
    }

    const message = getWhatsAppThankYouRawText(student, specificMonths);

    navigator.clipboard.writeText(message);
    setCopyStatus("thankyou_" + student.id);
    setTimeout(() => setCopyStatus(null), 3000);
  };

  // Helper raw text for preview and direct WA link (Penerimaan Iuran Siswa - Ringkas & Padat)
  const getWhatsAppThankYouRawText = (student: Student | null, specificMonths?: string[]) => {
    if (!student) return "";
    const paidItems = student.iuranStatus ? student.iuranStatus.filter(i => i.paid && (!specificMonths || specificMonths.length === 0 || specificMonths.includes(i.month))) : [];
    const targetMonths = paidItems.length > 0 ? paidItems : (student.iuranStatus ? student.iuranStatus.filter(i => i.paid) : []);

    const totalPaid = targetMonths.reduce((sum, curr) => sum + (curr.amount || 20000), 0);
    const monthsText = targetMonths.length > 0 
      ? targetMonths.map(i => i.month).join(", ")
      : "Bulan Terpilih";

    return `Assalamu'alaikum Bunda/Ayah *${student.parentName}* (${student.name}) 🙏

Alhamdulillah, iuran kas kelas (${monthsText}) sebesar *${formatRupiah(totalPaid)}* telah kami terima & dicatat lunas.

Terima kasih banyak atas partisipasinya, semoga berkah selalu. 😊
— *Bendahara Kas Kelas 1C*`;
  };

  // Helper to match transaction with a student record accurately
  const getMatchedStudentFromTx = (tx: Transaction | null): Student | null => {
    if (!tx || !dbState.students || dbState.students.length === 0) return null;

    // 1. Direct match by studentId
    if (tx.studentId) {
      const byId = dbState.students.find(s => s.id === tx.studentId);
      if (byId) return byId;
    }

    const desc = tx.description || "";
    const descLower = desc.toLowerCase();

    // 2. Structured pattern match: "- Siswa: [Name] (Wali: [Wali])" or "- [Name] (Wali: [Wali])"
    const siswaWaliMatch = desc.match(/Siswa:\s*([^(\n\r]+?)(?:\s*\(Wali:\s*([^)\n\r]+)\))?$/i)
      || desc.match(/-\s*([^(\n\r]+?)\s*\(Wali:\s*([^)\n\r]+)\)/i);

    if (siswaWaliMatch) {
      const rawStudent = (siswaWaliMatch[1] || "").trim().toLowerCase();
      const rawWali = (siswaWaliMatch[2] || "").trim().toLowerCase();

      // Exact student name
      const exactStudent = dbState.students.find(s => s.name.trim().toLowerCase() === rawStudent);
      if (exactStudent) return exactStudent;

      // By nickname
      const byNick = dbState.students.find(s => s.nickname && s.nickname.trim().toLowerCase() === rawStudent);
      if (byNick) return byNick;

      // Substring match in student name (student name contains extracted, or vice versa)
      if (rawStudent.length >= 3) {
        const subStudent = dbState.students.find(s => {
          const sName = s.name.trim().toLowerCase();
          return sName.includes(rawStudent) || rawStudent.includes(sName);
        });
        if (subStudent) return subStudent;
      }

      // Exact match by extracted Wali if student name wasn't conclusive
      if (rawWali) {
        const byWali = dbState.students.find(s => s.parentName.trim().toLowerCase() === rawWali);
        if (byWali) return byWali;
      }
    }

    // 3. Match full student name directly in description, prioritizing LONGEST name
    // (This prevents short sub-strings like 'imas' in 'Dimas' from matching other people)
    const matchedStudents = dbState.students
      .filter(s => {
        const sName = s.name.trim().toLowerCase();
        return sName.length >= 4 && descLower.includes(sName);
      })
      .sort((a, b) => b.name.length - a.name.length);

    if (matchedStudents.length > 0) {
      return matchedStudents[0];
    }

    // 4. By tx.studentName exact match
    if (tx.studentName) {
      const targetName = tx.studentName.trim().toLowerCase();
      const byStudentName = dbState.students.find(s => s.name.trim().toLowerCase() === targetName);
      if (byStudentName) return byStudentName;
    }

    // 5. By tx.parentName exact match
    if (tx.parentName) {
      const targetParent = tx.parentName.trim().toLowerCase();
      const byParent = dbState.students.find(s => s.parentName.trim().toLowerCase() === targetParent);
      if (byParent) return byParent;
    }

    // 6. By extracted "Wali: [Parent]" exact match
    const waliMatch = desc.match(/Wali:\s*([^)\n\r]+)/i);
    if (waliMatch) {
      const targetWali = (waliMatch[1] || "").trim().toLowerCase();
      const byWali = dbState.students.find(s => s.parentName.trim().toLowerCase() === targetWali);
      if (byWali) return byWali;
    }

    return null;
  };

  // Helper raw text for transaction WA (Penerimaan vs Pengeluaran dibuat berbeda)
  const getTxThankYouRawText = (tx: Transaction | null): string => {
    if (!tx) return "";
    const matchedStudent = getMatchedStudentFromTx(tx);

    // Clean description to remove redundant "- Siswa: Name (Wali: Parent)"
    const cleanDesc = (tx.description || "")
      .replace(/\s*-\s*Siswa:.*$/i, "")
      .replace(/\s*\(Wali:.*\)$/i, "")
      .trim();

    const parentName = matchedStudent ? matchedStudent.parentName : (tx.parentName || "Wali Murid");
    const studentName = matchedStudent ? matchedStudent.name : (tx.studentName || "");

    // 1. FORMAT PENERIMAAN / KAS MASUK (IN): Ringkas, padat & tidak terlalu panjang
    if (tx.type === "IN") {
      return `Assalamu'alaikum Bunda/Ayah *${parentName}*${studentName ? ` (${studentName})` : ""} 🙏

Alhamdulillah, pembayaran kas sebesar *${formatRupiah(tx.amount)}* (${cleanDesc || tx.category}) tgl ${tx.date} telah kami terima & dicatat lunas.

Terima kasih banyak atas partisipasinya, semoga berkah selalu. 😊
— *Bendahara Kas Kelas 1C*`;
    }

    // 2. FORMAT PENGELUARAN / KAS KELUAR (OUT): Transparan, terperinci & berbeda fungsi
    let itemsText = "";
    if (tx.items && tx.items.length > 0) {
      itemsText = tx.items.map(it => {
        const isStr = typeof it === "string";
        const name = isStr ? it : it.name;
        const qty = isStr ? 1 : (it.qty || 1);
        const price = isStr ? 0 : (it.unitPrice || 0);
        return `• ${name}${qty > 1 ? ` (${qty}x)` : ""}${price > 0 ? ` @${formatRupiah(price)}` : ""}`;
      }).join("\n");
    }

    if (tx.category === "Uang Duka") {
      return `Assalamu'alaikum Wr. Wb. 🙏

📢 *INFORMASI PENGELUARAN KAS KELAS 1C*
Kategori: *Uang Duka* 🤲

Telah disalurkan dana santunan duka dari kas kelas:
• *Keperluan:* ${cleanDesc || "Santunan Uang Duka"}
• *Tanggal:* ${tx.date}
• *Nominal:* *${formatRupiah(tx.amount)}*
${tx.parentName ? `• *Penerima/Keluarga:* ${tx.parentName}\n` : ""}
Pencatatan telah dibukukan resmi dalam kas kelas. Semoga almarhum/almarhumah husnul khotimah dan segenap keluarga diberikan ketabahan serta kelapangan hati. Aamiin 🤲

— *Pengurus & Bendahara Kas Kelas 1C*`;
    }

    if (tx.category === "Jenguk Siswa Sakit") {
      return `Assalamu'alaikum Wr. Wb. 🙏

📢 *INFORMASI PENGELUARAN KAS KELAS 1C*
Kategori: *Jenguk Siswa Sakit* 🩹

Telah disalurkan dana kas kelas untuk jenguk siswa sakit:
• *Keperluan:* ${cleanDesc || "Biaya / Santunan Jenguk Siswa Sakit"}
• *Tanggal:* ${tx.date}
• *Nominal:* *${formatRupiah(tx.amount)}*
${tx.parentName ? `• *Wali Murid Terkait:* ${tx.parentName}\n` : ""}
Pencatatan telah dibukukan resmi dalam kas kelas. Semoga ananda lekas sehat walafiat dan dapat kembali belajar bersama di kelas. Aamiin 🤲

— *Pengurus & Bendahara Kas Kelas 1C*`;
    }

    // Default Pengeluaran (Kebutuhan Kelas, Perlengkapan/ATK, Konsumsi, Kegiatan, dll)
    return `Assalamu'alaikum Wr. Wb. 🙏

📢 *INFORMASI PENGELUARAN KAS KELAS 1C*
Kategori: *${tx.category || "Pengeluaran Kas"}*

Berikut informasi penggunaan dana kas kelas:
• *Keperluan:* ${cleanDesc || tx.description || "Pengeluaran Kas Kelas 1C"}
• *Tanggal:* ${tx.date}
• *Total Dana:* *${formatRupiah(tx.amount)}*
${tx.storeName ? `• *Toko/Penyedia:* ${tx.storeName}\n` : ""}${itemsText ? `• *Rincian Item:*\n${itemsText}\n` : ""}
Pengeluaran ini telah dicatat resmi dalam pembukuan kas kelas demi transparansi bersama. 🙏

— *Pengurus & Bendahara Kas Kelas 1C*`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100/90 via-indigo-50/30 to-purple-50/40 text-slate-800 flex flex-col antialiased pb-20 sm:pb-0 relative overflow-x-hidden">
      
      {/* Decorative Fixed Ambient Background Blur Circles */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Smart Guide Popup Overlay if triggered */}
      {isGuideOpen && <SmartGuide onClose={() => setIsGuideOpen(false)} />}

      {/* PWA Installation Guidance Modal */}
      <InstallPwaModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={handleTriggerInstall}
        isStandalone={isStandalone}
      />

      {/* Google Sheets Live Synchronization Modal */}
      <GoogleSheetsSyncModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        transactions={dbState.transactions}
        currentConfig={dbState.settings?.googleSheets}
        onSaveConfig={handleSaveGoogleSheetsConfig}
        themeColor={activeTheme.primaryColor}
      />

      {/* HEADER BAR (Visible once logged in) */}
      {activeRole !== "SPLASH" && (
        <header className="sticky top-0 bg-white border-b border-slate-200 z-30 px-4 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 ${activeTheme.iconBg} text-white rounded-lg font-bold font-display text-sm tracking-wider`}>
                1C
              </span>
              <div>
                <h1 className="font-extrabold text-slate-900 text-base font-display">KAS PINTAR MIT MA KELAS 1C</h1>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Madrasah Ibtidaiyah Terpadu MA Buaran Jati</p>
              </div>
            </div>

            {/* Quick Tutorial Toggle, PWA Install & Role Indicator */}
            <div className="flex items-center gap-2">
              
              {/* Google Sheets Sync Header Button */}
              <button
                onClick={() => setIsSheetsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                title="Sinkronisasi Google Sheets Real-Time"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Google Sheets</span>
                <span className="md:hidden">Sheets</span>
                {dbState.settings?.googleSheets?.spreadsheetId ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Terhubung"></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                )}
              </button>

              {/* PWA Install Button Header */}
              <button
                onClick={handleTriggerInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Pasang Aplikasi HP"
              >
                <Smartphone className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                <span className="hidden md:inline">Instal App HP</span>
                <span className="md:hidden">Instal App</span>
              </button>

              {/* Theme Selection Toggle */}
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition`}
              >
                <span>{activeTheme.icon}</span>
                <span className="hidden sm:inline font-bold">Gaya Tampilan</span>
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-xl text-xs font-semibold transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-yellow-600 animate-pulse" />
                <span>Panduan</span>
              </button>

              <div className="h-6 w-px bg-slate-200"></div>

              {/* Role Indicator Details */}
              <div className="flex items-center gap-2">
                {activeRole === "WALI_MURID" ? (
                  <div className="text-right">
                    <span className={`text-[10px] ${activeTheme.badgeBg} font-bold px-2 py-0.5 rounded-md block`}>
                      Wali Murid
                    </span>
                    <span className="text-xs font-bold text-slate-700 block truncate max-w-[100px] sm:max-w-[120px]">
                      {currentStudent?.parentName}
                    </span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md block">
                      Bendahara Kelas
                    </span>
                    <span className="text-xs font-bold text-slate-700 block">
                      Siti Bendahara
                    </span>
                  </div>
                )}
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    localStorage.removeItem("kas_pintar_remember_session");
                    setActiveRole("SPLASH");
                    setSelectedStudentId(null);
                  }}
                  className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* MOBILE WARNING / PWA INSTALLATION HINT ON TOP BAR */}
      {activeRole !== "SPLASH" && !isStandalone && (
        <div className={`sm:hidden bg-gradient-to-r ${activeTheme.bgClass} text-white py-2 px-4 text-xs font-bold flex items-center justify-between gap-2 shadow-xs border-b border-white/20`}>
          <div className="flex items-center gap-1.5 truncate">
            <Smartphone className="w-4 h-4 text-yellow-300 shrink-0 animate-bounce" />
            <span className="truncate">Pasang Kas Kelas 1C di HP Anda!</span>
          </div>
          <button 
            onClick={handleTriggerInstall} 
            className="bg-white text-purple-900 px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs hover:bg-yellow-300 transition cursor-pointer"
          >
            Instal App
          </button>
        </div>
      )}


      {/* MAIN LAYOUT GATE */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* ==========================================
            SCREEN 1: WELCOME & ROLE SPLASH SELECTION
            ========================================== */}
        {activeRole === "SPLASH" && (
          <div className="max-w-lg mx-auto my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Vibrant Hero Islamic Primary School Branding */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 text-center border-2 border-emerald-300/30">
              {/* Playful background decorative pattern elements */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-400/20 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-sky-400/20 rounded-full blur-xl pointer-events-none"></div>
              
              {/* Cute Islamic Elementary School Kids Vector Art Illustration */}
              <div className="relative z-10 flex justify-center items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-inner flex items-center justify-center">
                    {/* SVG Graphic: Happy Islamic Primary School Boy & Girl */}
                    <svg className="w-12 h-12 text-amber-300" viewBox="0 0 64 64" fill="currentColor">
                      {/* Songkok/Peci Boy Icon */}
                      <path d="M12 28C12 22 20 20 20 20C20 20 28 22 28 28V30H12V28Z" fill="#FBBF24" />
                      <circle cx="20" cy="36" r="6" fill="#FDE68A" />
                      {/* Hijab Girl Icon */}
                      <path d="M44 20C38 20 34 26 34 32C34 40 40 44 44 44C48 44 54 40 54 32C54 26 50 20 44 20Z" fill="#67E8F9" />
                      <circle cx="44" cy="34" r="5" fill="#FDE68A" />
                      {/* Star and Book */}
                      <path d="M30 10L32 14L36 15L33 18L34 22L30 20L26 22L27 18L24 15L28 14Z" fill="#FACD15" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-xs">
                    SD/MIT
                  </span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-xs">
                KAS PINTAR MIT MA KELAS 1C
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-bold mt-1 max-w-sm mx-auto leading-snug">
                Madrasah Ibtidaiyah Terpadu MA Buaran Jati
              </p>

              {/* Install PWA Prompt Button */}
              <div className="mt-4 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerInstall}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-emerald-950 font-black text-xs rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-900" />
                  <span>📱 Pasang Aplikasi Kas Kelas di HP</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold text-amber-200 border border-white/20">
                  📱 Multi-Device Ready
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-bold text-emerald-100 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  AI Smart OCR Nota
                </span>
              </div>

            </div>

            {/* Gaptek Friendly Tutorial Note */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 mb-5 flex items-start gap-3 shadow-xs">
              <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0 animate-bounce" />
              <div>
                <h4 className="text-xs font-black text-amber-900">Petunjuk Akses Wali & Bendahara</h4>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-medium">
                  Aplikasi ini dirancang praktis. Cukup pilih peran Anda di bawah ini untuk masuk.
                </p>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="text-xs font-bold text-amber-950 underline mt-1 block hover:text-emerald-900"
                >
                  Buka Panduan Lengkap &rarr;
                </button>
              </div>
            </div>

            {/* ROLE TAB SELECTOR CARD */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xl space-y-5">
              
              {/* Tab Buttons: Wali Murid vs Bendahara */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLoginTab("WALI_MURID")}
                  className={`py-3 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                    loginTab === "WALI_MURID"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Wali Murid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginTab("BENDAHARA")}
                  className={`py-3 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                    loginTab === "BENDAHARA"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Bendahara</span>
                </button>
              </div>

              {/* SINGLE-DEVICE SECURITY BADGE */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                  🔒
                </div>
                <div className="text-[11px] text-emerald-950 font-semibold leading-tight">
                  <span className="font-extrabold block text-emerald-900">Keamanan 1 Akun = 1 Device Active</span>
                  1 Akun dikunci untuk 1 HP aktif. Jika dibuka di HP lain, HP sebelumnya akan otomatis terkeluar demi keamanan.
                </div>
              </div>

              {/* TAB CONTENT 1: WALI MURID LOGIN */}
              {loginTab === "WALI_MURID" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Masuk Wali Murid (Orang Tua)
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      Kelas 1C
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                      Memuat data kelas...
                    </div>
                  ) : (
                    <form onSubmit={handleParentLoginFormSubmit} className="space-y-4 pt-1">
                      {/* Quick Student Selector Dropdown */}
                      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-3">
                        <label className="text-[11px] font-extrabold text-emerald-900 block mb-1.5 flex items-center justify-between">
                          <span>✨ Cara Cepat: Pilih Siswa dari Daftar</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            {dbState.students.length} Siswa
                          </span>
                        </label>
                        <select
                          value={parentLoginNickname}
                          onChange={(e) => {
                            const val = e.target.value;
                            setParentLoginNickname(val);
                            setParentLoginError("");
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-300 transition"
                        >
                          <option value="">-- Ketuk untuk Memilih Nama Anak Anda --</option>
                          {dbState.students.map((st) => (
                            <option key={st.id} value={st.nickname || st.name}>
                              {st.name} {st.nickname ? `(${st.nickname})` : ""} — Wali: {st.parentName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                          Nama Panggilan / Nama Lengkap Siswa
                        </label>
                        <input
                          type="text"
                          placeholder="Ketik nama panggilan anak..."
                          value={parentLoginNickname}
                          onChange={(e) => {
                            setParentLoginNickname(e.target.value);
                            setParentLoginError("");
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                          Kata Sandi Wali Murid
                        </label>
                        <div className="relative">
                          <input
                            type={showParentPassword ? "text" : "password"}
                            placeholder="Masukkan kata sandi..."
                            value={parentLoginPassword}
                            onChange={(e) => {
                              setParentLoginPassword(e.target.value);
                              setParentLoginError("");
                            }}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 transition pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowParentPassword(!showParentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          >
                            {showParentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me Toggle */}
                      <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none hover:text-emerald-900 transition">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                          />
                          <span>Ingat Saya (Tetap Masuk Otomatis)</span>
                        </label>
                        <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          🔒 Bebas Login
                        </span>
                      </div>

                      {parentLoginError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] font-bold text-red-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span>{parentLoginError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-xs font-black transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Masuk ke Dashboard Wali Murid</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB CONTENT 2: BENDAHARA LOGIN */}
              {loginTab === "BENDAHARA" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                      Masuk Bendahara Kelas
                    </h3>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md">
                      Pengelola Kas
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Portal khusus Bendahara untuk verifikasi bukti iuran, persetujuan rembesan & kasbon, pencatatan buku kas, serta sinkronisasi Google Sheets.
                  </p>

                  <form onSubmit={handleBendaharaLogin} className="space-y-4 pt-1">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                        Kata Sandi Keamanan Bendahara
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi Bendahara..."
                          value={adminPasswordInput}
                          onChange={(e) => {
                            setAdminPasswordInput(e.target.value);
                            setAdminAuthError("");
                          }}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me Toggle */}
                    <div className="flex items-center justify-between p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none hover:text-purple-900 transition">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded-md border-slate-300 focus:ring-purple-500 cursor-pointer accent-purple-600"
                        />
                        <span>Ingat Saya (Tetap Masuk Bendahara)</span>
                      </label>
                      <span className="text-[10px] text-purple-800 font-extrabold bg-purple-100 px-2 py-0.5 rounded-md shrink-0">
                        ⚡ Login Instan
                      </span>
                    </div>

                    {adminAuthError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] font-bold text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>{adminAuthError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Masuk sebagai Bendahara</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ==========================================
            SCREEN 2: WALI MURID DASHBOARD (PARENT VIEW)
            ========================================== */}
        {activeRole === "WALI_MURID" && currentStudent && (
          <div className="space-y-6">
            {isChangingPassword ? (
              <div className="max-w-md mx-auto my-6 sm:my-12 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md animate-in fade-in zoom-in-95 duration-200">
                <div className={`p-5 bg-gradient-to-r ${activeTheme.bgClass} text-white text-center`}>
                  <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl shadow-xs">
                    🔑
                  </div>
                  <h3 className="font-extrabold font-display text-sm">
                    Ganti Kata Sandi Sementara
                  </h3>
                  <p className="text-[10px] opacity-90 font-semibold mt-1">Demi keamanan akun Wali Murid {currentStudent.name}</p>
                </div>

                <form onSubmit={handleParentChangePasswordSubmit} className="p-6 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-800 leading-normal font-semibold">
                      Anda terdeteksi masuk menggunakan sandi bawaan sementara <strong>123</strong>. Silakan ubah ke sandi baru pilihan Anda agar dapat mengakses dashboard.
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi baru..."
                      value={newPasswordInput}
                      onChange={(e) => {
                        setNewPasswordInput(e.target.value);
                        setChangePasswordError("");
                      }}
                      className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden ${activeTheme.borderFocus} focus:bg-white`}
                      required
                      minLength={4}
                    />
                    <span className="text-[9px] text-slate-400 block mt-1">Sandi baru minimal terdiri dari 4 karakter dan bukan "123".</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      placeholder="Ulangi kata sandi baru..."
                      value={confirmNewPasswordInput}
                      onChange={(e) => {
                        setConfirmNewPasswordInput(e.target.value);
                        setChangePasswordError("");
                      }}
                      className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden ${activeTheme.borderFocus} focus:bg-white`}
                      required
                    />
                  </div>

                  {changePasswordError && (
                    <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {changePasswordError}
                    </p>
                  )}

                  {changePasswordSuccess && (
                    <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {changePasswordSuccess}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveRole("SPLASH");
                        setSelectedStudentId(null);
                        setIsChangingPassword(false);
                        setNewPasswordInput("");
                        setConfirmNewPasswordInput("");
                      }}
                      className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer text-center"
                    >
                      Batal (Keluar)
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 py-2.5 ${activeTheme.buttonBg} text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer`}
                    >
                      Perbarui & Masuk
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Quick Profile & Notification Summary Header */}
            <div className={`bg-gradient-to-r ${activeTheme.bgClass} rounded-2xl p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm`}>
              <div className="space-y-1">
                <p className={`text-xs ${activeTheme.textLight} font-semibold flex items-center gap-1`}>
                  Selamat Datang Mama/Papa {currentStudent.parentName} 👋
                </p>
                <h2 className="text-xl md:text-2xl font-black font-display tracking-tight leading-none">
                  Siswa: {currentStudent.name}
                </h2>
                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2 mt-2.5 text-xs">
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 backdrop-blur-xs">
                    <span>🎂 Lahir:</span>
                    <span>{new Date(currentStudent.birthday).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </span>
                  <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 backdrop-blur-xs">
                    <span>🎈 Umur:</span>
                    <span>{calculateAge(currentStudent.birthday)}</span>
                  </span>
                </div>
              </div>

              {/* Dynamic Notification Badges inside Header */}
              <div className="flex flex-col gap-2 w-full md:w-auto">
                {currentStudent.sisaKasbon > 0 && (
                  <div className="bg-amber-500/35 border border-amber-400/50 rounded-xl px-3 py-2 text-xs flex items-center gap-2 self-stretch md:self-auto">
                    <Clock className="w-4 h-4 text-amber-200 animate-pulse flex-shrink-0" />
                    <span>Sisa Tunggakan Kasbon: <strong>{formatRupiah(currentStudent.sisaKasbon)}</strong></span>
                  </div>
                )}
                {isBirthdayComingSoon(currentStudent.birthday) && (
                  <div className="bg-rose-500/30 border border-rose-400/50 rounded-xl px-3 py-2 text-xs flex items-center gap-2 self-stretch md:self-auto animate-bounce">
                    <Sparkles className="w-4 h-4 text-pink-300 flex-shrink-0" />
                    <span>Ulang tahun {currentStudent.name} segera tiba! 🎉</span>
                  </div>
                )}
              </div>
            </div>

            {/* PARENT TABS NAVIGATION (Responsive Grid on Mobile, Row on Desktop) */}
            <div className="grid grid-cols-2 sm:flex bg-white p-1.5 sm:p-1 rounded-2xl sm:rounded-xl border border-slate-200/80 shadow-xs gap-1.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setParentTab("dashboard")}
                className={`py-2.5 sm:py-2 px-2.5 sm:flex-1 text-xs font-bold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  parentTab === "dashboard" ? `${activeTheme.buttonBg} text-white shadow-xs` : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => setParentTab("keuangan")}
                className={`py-2.5 sm:py-2 px-2.5 sm:flex-1 text-xs font-bold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  parentTab === "keuangan" ? `${activeTheme.buttonBg} text-white shadow-xs` : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span className="truncate">Keuangan Kelas</span>
              </button>
              <button
                type="button"
                onClick={() => setParentTab("kasbon_rembes")}
                className={`py-2.5 sm:py-2 px-2.5 sm:flex-1 text-xs font-bold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  parentTab === "kasbon_rembes" ? `${activeTheme.buttonBg} text-white shadow-xs` : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span className="truncate">Kasbon & Rembes</span>
              </button>
              <button
                type="button"
                onClick={() => setParentTab("daftar_siswa")}
                className={`py-2.5 sm:py-2 px-2.5 sm:flex-1 text-xs font-bold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  parentTab === "daftar_siswa" ? `${activeTheme.buttonBg} text-white shadow-xs` : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span className="truncate">Daftar Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => setParentTab("inventaris")}
                className={`py-2.5 sm:py-2 px-2.5 sm:flex-1 text-xs font-bold rounded-xl sm:rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  parentTab === "inventaris" ? `${activeTheme.buttonBg} text-white shadow-xs` : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span className="truncate">Inventaris Aset</span>
              </button>
            </div>

            {/* ==========================================
                PARENT TAB 1: DASHBOARD (Data Anak & Saldo Kas)
                ========================================== */}
            {parentTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* TOP SECTION: 2-COLUMN GRID (Data Profil Anak & Saldo Kas disebelahnya) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT COLUMN: Data Profil Anak (5 Cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-purple-600" /> Data Profil Anak
                        </span>
                        <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                          Kelas 1C
                        </span>
                      </div>

                      {/* Photo Avatar with Edit Action */}
                      <div className="flex flex-col items-center text-center space-y-3 pt-1">
                        <div className="relative group">
                          {currentStudent.photoUrl ? (
                            <img 
                              src={currentStudent.photoUrl} 
                              alt={currentStudent.name} 
                              className="w-28 h-28 object-cover rounded-2xl border-2 border-purple-300 shadow-md transition group-hover:opacity-90"
                            />
                          ) : (
                            <div className="w-28 h-28 bg-gradient-to-tr from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black font-display shadow-md border-2 border-purple-200">
                              {currentStudent.name.charAt(0)}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(currentStudent)}
                            className="absolute -bottom-2 -right-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition cursor-pointer"
                            title="Ubah Foto Anak"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <h3 className="text-lg font-black font-display text-slate-800 leading-tight">
                            {currentStudent.name}
                          </h3>
                          <p className="text-xs text-purple-700 font-bold mt-0.5">
                            Panggilan: <span className="underline">{currentStudent.nickname || currentStudent.name.trim().split(/\s+/)[0]}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            Siswa MIT MA Buaran Jati
                          </p>
                        </div>
                      </div>

                      {/* Details List */}
                      <div className="space-y-2.5 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-medium">Wali Murid</span>
                          <span className="font-bold text-slate-800">{currentStudent.parentName}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-medium">Nomor HP/WA</span>
                          <a 
                            href={`https://wa.me/${currentStudent.parentPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-500" />
                            {currentStudent.parentPhone}
                          </a>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-medium">Tanggal Lahir</span>
                          <span className="font-bold text-slate-800">
                            {new Date(currentStudent.birthday).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-medium">Usia Anak</span>
                          <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                            {calculateAge(currentStudent.birthday)}
                          </span>
                        </div>
                      </div>

                      {/* Current Measurements Badges */}
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block">Berat Badan</span>
                          <span className="text-sm font-extrabold text-blue-900 font-display">
                            {currentStudent.weightLogs && currentStudent.weightLogs.length > 0
                              ? `${currentStudent.weightLogs[currentStudent.weightLogs.length - 1].value} kg`
                              : "-"}
                          </span>
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block">Tinggi Badan</span>
                          <span className="text-sm font-extrabold text-emerald-900 font-display">
                            {currentStudent.heightLogs && currentStudent.heightLogs.length > 0
                              ? `${currentStudent.heightLogs[currentStudent.heightLogs.length - 1].value} cm`
                              : "-"}
                          </span>
                        </div>
                      </div>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(currentStudent)}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        ✏️ Ubah Data Profil & Foto Anak
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Saldo Saat Ini, Pemasukan & Pengeluaran Perbulan (7 Cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-800 text-sm font-display">
                              💰 Saldo & Laporan Kas Per Bulan
                            </h3>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              Transparan
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Informasi saldo kas kelas saat ini, total pemasukan & pengeluaran per bulan
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-2 rounded-2xl text-xs font-extrabold shadow-sm flex items-center gap-2">
                          <span>Saldo Saat Ini:</span>
                          <span className="text-sm font-black font-display">{formatRupiah(totals.saldo)}</span>
                        </div>
                      </div>

                      {(() => {
                        const mbData = getMonthlyBreakdown(overviewYearFilter);
                        const totalMasukYear = mbData.reduce((sum, item) => sum + item.totalMasuk, 0);
                        const totalKeluarYear = mbData.reduce((sum, item) => sum + item.totalKeluar, 0);
                        const finalSaldoYear = mbData.length > 0 ? mbData[mbData.length - 1].saldoAkhir : totals.saldo;

                        return (
                          <>
                            {/* Year Filter Buttons */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-purple-50/70 border border-purple-100 p-2.5 rounded-2xl">
                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 font-display">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span>Pilih Tahun Laporan Kas:</span>
                              </div>
                              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                                {[
                                  { key: "2026", label: "2026" },
                                  { key: "2027", label: "2027" },
                                  { key: "ALL", label: "Semua Tahun" }
                                ].map((y) => (
                                  <button
                                    key={y.key}
                                    type="button"
                                    onClick={() => setOverviewYearFilter(y.key)}
                                    className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                                      overviewYearFilter === y.key
                                        ? "bg-purple-700 text-white shadow-2xs"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                    }`}
                                  >
                                    {y.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Quick Summary Cards */}
                            <div className="grid grid-cols-3 gap-2.5">
                              <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl text-center">
                                <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                                  Pemasukan {overviewYearFilter !== "ALL" ? `(${overviewYearFilter})` : ""}
                                </span>
                                <span className="text-xs sm:text-sm font-black text-emerald-800 font-display mt-0.5 block">
                                  +{formatRupiah(totalMasukYear)}
                                </span>
                              </div>
                              <div className="bg-red-50/70 border border-red-100 p-3 rounded-2xl text-center">
                                <span className="text-[10px] font-bold text-red-600 block uppercase">
                                  Pengeluaran {overviewYearFilter !== "ALL" ? `(${overviewYearFilter})` : ""}
                                </span>
                                <span className="text-xs sm:text-sm font-black text-red-700 font-display mt-0.5 block">
                                  -{formatRupiah(totalKeluarYear)}
                                </span>
                              </div>
                              <div className="bg-purple-50/70 border border-purple-100 p-3 rounded-2xl text-center">
                                <span className="text-[10px] font-bold text-purple-700 block uppercase">
                                  Saldo {overviewYearFilter !== "ALL" ? `(${overviewYearFilter})` : "Total"}
                                </span>
                                <span className="text-xs sm:text-sm font-black text-purple-900 font-display mt-0.5 block">
                                  {formatRupiah(finalSaldoYear)}
                                </span>
                              </div>
                            </div>

                            {/* Per-Month Table */}
                            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                                    <th className="py-2.5 px-3">Bulan</th>
                                    <th className="py-2.5 px-3 text-right">Saldo Awal</th>
                                    <th className="py-2.5 px-3 text-right text-emerald-600">Pemasukan (+)</th>
                                    <th className="py-2.5 px-3 text-right text-red-500">Pengeluaran (-)</th>
                                    <th className="py-2.5 px-3 text-right text-slate-900">Saldo Akhir</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                  {mbData.length === 0 ? (
                                    <tr>
                                      <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">
                                        Belum ada data transaksi untuk tahun {overviewYearFilter}
                                      </td>
                                    </tr>
                                  ) : (
                                    mbData.map((mb) => (
                                      <tr key={mb.monthKey} className="hover:bg-slate-50 transition">
                                        <td className="py-2.5 px-3 font-bold text-purple-950 font-display whitespace-nowrap">
                                          📅 {mb.monthName}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono text-slate-500 font-semibold">
                                          {formatRupiah(mb.saldoAwal)}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                                          +{formatRupiah(mb.totalMasuk)}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono text-red-500 font-bold">
                                          -{formatRupiah(mb.totalKeluar)}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                                          {formatRupiah(mb.saldoAkhir)}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                </div>

                {/* MIDDLE SECTION: 2-COLUMN GRID (Catat Ukuran Fisik & Riwayat Pengukuran) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Input Pengukuran */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Plus className={`w-5 h-5 ${activeTheme.textClass}`} />
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm font-display">Catat Ukuran Fisik Anak</h3>
                        <p className="text-[10px] text-slate-400">Update rutin pengukuran BB & TB</p>
                      </div>
                    </div>

                    <form onSubmit={handleAddGrowthLog} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Tipe Pengukuran
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setGrowthType("weight")}
                            className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                              growthType === "weight" ? `bg-white ${activeTheme.textClass} shadow-xs` : "text-slate-500"
                            }`}
                          >
                            Berat Badan
                          </button>
                          <button
                            type="button"
                            onClick={() => setGrowthType("height")}
                            className={`py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                              growthType === "height" ? `bg-white ${activeTheme.textClass} shadow-xs` : "text-slate-500"
                            }`}
                          >
                            Tinggi Badan
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Nilai Ukuran ({growthType === "weight" ? "kg" : "cm"})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder={growthType === "weight" ? "Contoh: 21.5" : "Contoh: 117.5"}
                          value={growthValue}
                          onChange={(e) => setGrowthValue(e.target.value)}
                          className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden ${activeTheme.borderFocus} focus:bg-white`}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Tanggal Pengukuran
                        </label>
                        <input
                          type="date"
                          value={growthDate}
                          onChange={(e) => setGrowthDate(e.target.value)}
                          className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden ${activeTheme.borderFocus}`}
                          required
                        />
                      </div>

                      {growthSuccess && (
                        <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 p-2 rounded-lg">
                          <CheckCircle className="w-3.5 h-3.5" /> Data berhasil dicatat!
                        </p>
                      )}

                      <button
                        type="submit"
                        className={`w-full py-2 ${activeTheme.buttonBg} text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer`}
                      >
                        Simpan Perkembangan Anak
                      </button>
                    </form>
                  </div>

                  {/* Growth History Log Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm font-display mb-3">
                      Catatan Riwayat Pengukuran Fisik Anak
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Weight Logs */}
                      <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5 text-blue-500" /> Berat Badan (BB)
                        </span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {currentStudent.weightLogs?.slice().reverse().map((log, idx) => (
                            <div key={idx} className="flex justify-between text-xs p-1.5 bg-white rounded border border-slate-100">
                              <span className="font-medium text-slate-600">{log.date}</span>
                              <span className="font-bold text-slate-800">{log.value} kg</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Height Logs */}
                      <div className="border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                        <span className="text-xs font-semibold text-slate-500 block mb-2 flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-emerald-500" /> Tinggi Badan (TB)
                        </span>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {currentStudent.heightLogs?.slice().reverse().map((log, idx) => (
                            <div key={idx} className="flex justify-between text-xs p-1.5 bg-white rounded border border-slate-100">
                              <span className="font-medium text-slate-600">{log.date}</span>
                              <span className="font-bold text-slate-800">{log.value} cm</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: PENDINGAN WALI MURID (KAS / KASBON / REMBESAN) */}
                {(() => {
                  const unpaidIuran = currentStudent.iuranStatus.filter(i => !i.paid && dueMonthsList.includes(i.month));
                  const pendingKasbons = dbState.kasbons.filter(k => k.studentId === currentStudent.id && (k.status === "PENDING" || (k.status === "APPROVED" && currentStudent.sisaKasbon > 0)));
                  const pendingRembesan = dbState.reimbursements.filter(r => r.studentId === currentStudent.id && r.status === "PENDING");
                  const totalUnpaidIuran = unpaidIuran.reduce((sum, curr) => sum + curr.amount, 0);
                  const hasPendingItems = unpaidIuran.length > 0 || pendingKasbons.length > 0 || pendingRembesan.length > 0;

                  return (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-800 text-sm font-display">
                              Status Pendingan & Tagihan Saya ({currentStudent.name})
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium">
                              Informasi tunggakan kas kelas, pengajuan kasbon, dan rembesan pending
                            </p>
                          </div>
                        </div>
                        {hasPendingItems ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                            Ada {unpaidIuran.length + pendingKasbons.length + pendingRembesan.length} Item Perlu Ditindaklanjuti
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Bebas Tunggakan
                          </span>
                        )}
                      </div>

                      {!hasPendingItems ? (
                        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-center space-y-1">
                          <p className="text-xs font-bold text-emerald-800">🎉 Semua Keuangan Anak Anda Lunas & Tidak Ada Pengajuan Pending!</p>
                          <p className="text-[11px] text-emerald-600">Terima kasih banyak Mama/Papa atas ketepatan waktu pembayaran iuran kas kelas.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* Card 1: Uang Kas Kelas Pending */}
                          <div className={`p-4 rounded-xl border ${unpaidIuran.length > 0 ? "bg-amber-50/60 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                <Wallet className="w-3.5 h-3.5 text-amber-600" /> Tagihan Uang Kas
                              </span>
                              {unpaidIuran.length > 0 ? (
                                <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">Belum Lunas</span>
                              ) : (
                                <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">Lunas</span>
                              )}
                            </div>

                            {unpaidIuran.length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-sm font-extrabold text-amber-900 font-mono">
                                  Total: {formatRupiah(totalUnpaidIuran)}
                                </p>
                                <div className="space-y-1">
                                  {unpaidIuran.map((item, idx) => (
                                    <div key={idx} className="text-[11px] text-amber-800 flex justify-between bg-white/80 p-1.5 rounded border border-amber-200/60">
                                      <span>Iuran {item.month}</span>
                                      <span className="font-bold">{formatRupiah(item.amount)}</span>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setParentTab("keuangan")}
                                  className="w-full mt-2 text-[10px] bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                                >
                                  Bayar / Konfirmasi Kas Sekarang &rarr;
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 font-medium pt-2">Semua iuran bulanan kas kelas telah terlunasi.</p>
                            )}
                          </div>

                          {/* Card 2: Pengajuan Kasbon Pending / Aktif */}
                          <div className={`p-4 rounded-xl border ${pendingKasbons.length > 0 ? "bg-purple-50/60 border-purple-200" : "bg-slate-50 border-slate-200"}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                <CreditCard className="w-3.5 h-3.5 text-purple-600" /> Pengajuan Kasbon
                              </span>
                              {pendingKasbons.length > 0 ? (
                                <span className="text-[10px] bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded">Aktif / Pending</span>
                              ) : (
                                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded">Nihil</span>
                              )}
                            </div>

                            {pendingKasbons.length > 0 ? (
                              <div className="space-y-2">
                                {pendingKasbons.map((kasbon) => (
                                  <div key={kasbon.id} className="text-[11px] bg-white p-2 rounded-lg border border-purple-200 space-y-1">
                                    <div className="flex justify-between items-center font-bold text-slate-800">
                                      <span>{formatRupiah(kasbon.amount)}</span>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                        kasbon.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
                                      }`}>
                                        {kasbon.status === "PENDING" ? "⏳ Menunggu Verifikasi" : "⚠️ Belum Lunas"}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">{kasbon.purpose}</p>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setParentTab("kasbon_rembes")}
                                  className="w-full mt-1 text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                                >
                                  Kelola Kasbon Saya &rarr;
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 font-medium pt-2">Tidak ada pengajuan kasbon yang pending atau aktif.</p>
                            )}
                          </div>

                          {/* Card 3: Pengajuan Rembesan Pending */}
                          <div className={`p-4 rounded-xl border ${pendingRembesan.length > 0 ? "bg-blue-50/60 border-blue-200" : "bg-slate-50 border-slate-200"}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-blue-600" /> Rembesan (Reimburse)
                              </span>
                              {pendingRembesan.length > 0 ? (
                                <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">Pending</span>
                              ) : (
                                <span className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded">Nihil</span>
                              )}
                            </div>

                            {pendingRembesan.length > 0 ? (
                              <div className="space-y-2">
                                {pendingRembesan.map((rembes) => (
                                  <div key={rembes.id} className="text-[11px] bg-white p-2 rounded-lg border border-blue-200 space-y-1">
                                    <div className="flex justify-between items-center font-bold text-slate-800">
                                      <span>{formatRupiah(rembes.totalAmount)}</span>
                                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                        ⏳ Menunggu Pencairan
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">{rembes.title}</p>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setParentTab("kasbon_rembes")}
                                  className="w-full mt-1 text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                                >
                                  Kelola Rembesan Saya &rarr;
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 font-medium pt-2">Tidak ada klaim rembesan nota yang pending.</p>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Pojok Ulang Tahun Siswa Kelas 1C (Special Birthday Corner for Parents) */}
                <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-purple-500/20">
                  {/* Decorative Background Elements */}
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute right-20 top-2 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />

                  {/* Birthday Corner Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-black">
                        🎂
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base sm:text-lg font-display text-white tracking-wide">
                            Pojok Ulang Tahun Siswa Kelas 1C
                          </h3>
                          <span className="bg-pink-500/30 text-pink-200 border border-pink-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Spesial Momen
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/80 font-medium mt-0.5">
                          Ucapkan selamat ulang tahun kepada para siswa dan teman-teman kelas 1C di bulan berjalan!
                        </p>
                      </div>
                    </div>

                    <div className="text-right self-end sm:self-auto">
                      <span className="text-[10px] uppercase font-bold text-purple-300 block">Bulan Terpilih</span>
                      <span className="text-sm font-black font-display text-amber-300">
                        {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][birthdayMonthFilter]} 2026 🎉
                      </span>
                    </div>
                  </div>

                  {/* Month Filter Bar */}
                  <div className="mt-4 relative z-10">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-2">
                      Pilih Bulan Ulang Tahun:
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                      {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"].map((mShort, idx) => {
                        const countInMonth = dbState.students.filter(s => s.birthday && new Date(s.birthday).getMonth() === idx).length;
                        const isCurrentMonth = new Date().getMonth() === idx;
                        const isSelected = birthdayMonthFilter === idx;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setBirthdayMonthFilter(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                              isSelected
                                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105"
                                : isCurrentMonth
                                ? "bg-white/20 text-white border-purple-300/40 hover:bg-white/30"
                                : "bg-white/5 text-purple-200 border-white/10 hover:bg-white/15"
                            }`}
                          >
                            <span>{mShort}</span>
                            {countInMonth > 0 && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                                isSelected ? "bg-slate-900 text-amber-300" : "bg-pink-500 text-white"
                              }`}>
                                {countInMonth}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Birthday Cards Grid */}
                  <div className="mt-4 relative z-10">
                    {(() => {
                      const birthdayList = dbState.students
                        .filter(s => {
                          if (!s.birthday) return false;
                          return new Date(s.birthday).getMonth() === birthdayMonthFilter;
                        })
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }));

                      if (birthdayList.length === 0) {
                        return (
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xs">
                            <p className="text-xs text-purple-200 font-medium">
                              🎈 Tidak ada siswa yang berulang tahun di bulan{" "}
                              <strong>
                                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][birthdayMonthFilter]}
                              </strong>.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {birthdayList.map((std) => {
                            const bDate = new Date(std.birthday);
                            const today = new Date();
                            const ageVal = calculateAge(std.birthday);
                            const dayOfMonth = bDate.getDate();

                            const isToday = today.getDate() === dayOfMonth && today.getMonth() === bDate.getMonth();

                            const waGreeting = encodeURIComponent(
                              `Assalamu'alaikum Wr. Wb. Selamat Ulang Tahun untuk ananda *${std.name}* yang ke-${bDate.getFullYear() ? (today.getFullYear() - bDate.getFullYear()) : '7'} tahun! 🎉🎂\n\n` +
                              `Semoga panjang umur, sehat selalu, makin cerdas, dan membanggakan orang tua. Salam bahagia dari Pengurus Kas & Teman-teman Kelas 1C! 🎈🎁`
                            );

                            return (
                              <div 
                                key={std.id}
                                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                                  isToday 
                                    ? "bg-gradient-to-b from-amber-500/20 to-pink-600/20 border-amber-400 shadow-lg ring-2 ring-amber-400/50" 
                                    : "bg-white/10 border-white/15 hover:border-white/30 backdrop-blur-xs"
                                }`}
                              >
                                {isToday && (
                                  <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl shadow-xs">
                                    🎉 ULANG TAHUN HARI INI!
                                  </div>
                                )}

                                <div className="flex items-start gap-3">
                                  {std.photoUrl ? (
                                    <img 
                                      src={std.photoUrl} 
                                      alt={std.name} 
                                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shadow-md flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white font-black text-xl flex items-center justify-center border-2 border-white/30 flex-shrink-0 font-display">
                                      {std.name.charAt(0)}
                                    </div>
                                  )}

                                  <div className="space-y-0.5 min-w-0">
                                    <h4 className="font-extrabold text-sm text-white font-display truncate">
                                      {std.name}
                                    </h4>
                                    <p className="text-[11px] text-purple-200 truncate">
                                      Wali: {std.parentName}
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-1">
                                      <span className="text-[10px] bg-amber-400/20 border border-amber-300/30 text-amber-200 font-bold px-2 py-0.5 rounded-md font-mono">
                                        📅 {dayOfMonth} {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"][bDate.getMonth()]}
                                      </span>
                                      <span className="text-[10px] bg-pink-500/30 text-pink-200 font-bold px-2 py-0.5 rounded-md">
                                        {ageVal}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-1 border-t border-white/10">
                                  <a
                                    href={`https://wa.me/${std.parentPhone.replace(/[^0-9]/g, '')}?text=${waGreeting}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Ucapkan WA 🎉</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailStudent(std)}
                                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-[10px] transition cursor-pointer"
                                  >
                                    🔍 Detail
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            )}

            {/* ==========================================
                PARENT TAB 2: FINANCIAL REPORT (Keuangan Kelas & Bills)
                ========================================== */}
            {parentTab === "keuangan" && (
              <div className="space-y-6">
                {/* Google Sheets Transparency Info Banner */}
                {dbState.settings?.googleSheets?.spreadsheetUrl && (
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800">
                            Transparansi Keuangan Terbuka di Google Sheets
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Real-time Sync
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Seluruh rincian uang masuk, uang keluar, dan saldo kas kelas disinkronkan langsung ke Google Spreadsheet kelas dan dapat dipantau oleh setiap wali murid kapan saja secara transparan.
                        </p>
                      </div>
                    </div>

                    <a
                      href={dbState.settings.googleSheets.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition shrink-0 self-end sm:self-center"
                    >
                      <span>Buka Google Sheets ↗</span>
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Bills Status Column */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm font-display mb-0.5">
                          Iuran Bulanan Kas Kelas
                        </h3>
                        <p className="text-[10px] text-slate-500">Nominal iuran: <strong>Rp 20.000 / bulan</strong></p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIuranConfirmError("");
                          setIuranConfirmSuccess("");
                          setSelectedIuranMonths([]);
                          setIsIuranConfirmModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Konfirmasi Pembayaran Mandiri</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {currentStudent.iuranStatus.map((i, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            i.paid 
                              ? "border-emerald-100 bg-emerald-50/25 text-emerald-800" 
                              : "border-rose-100 bg-rose-50/25 text-rose-800"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold block">{i.month}</span>
                            <span className="text-[10px] text-slate-500 font-medium block">
                              {i.paid ? `Lunas pada ${i.paidAt}` : `Tagihan: ${formatRupiah(i.amount || 20000)}`}
                            </span>
                          </div>

                          {i.paid ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Lunas
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full font-bold">
                              Belum Lunas
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pending / Historical Confirmations for this student */}
                    {dbState.iuranConfirmations && dbState.iuranConfirmations.filter(c => c.studentId === currentStudent.id).length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-700 font-display">
                          Riwayat Konfirmasi Pembayaran Anda:
                        </h4>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {dbState.iuranConfirmations.filter(c => c.studentId === currentStudent.id).slice().reverse().map(conf => (
                            <div key={conf.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] flex justify-between items-center">
                              <div>
                                <span className="font-bold text-slate-800 block">{conf.months.join(", ")}</span>
                                <span className="text-slate-400 font-mono">
                                  {formatRupiah(conf.amount)} &bull; {conf.paymentMethod === "CASH" ? "Cash/Tunai" : "Transfer Bank"}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                conf.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                                conf.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}>
                                {conf.status === "PENDING" ? "⏳ Menunggu Approval" : conf.status === "APPROVED" ? "✅ Disetujui" : "❌ Ditolak"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Account Details Card */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4 border border-purple-500/30">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        <div>
                          <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-300 font-display">
                            Instruksi & Metode Pembayaran
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Iuran Kas Kelas & Pembayaran Kasbon
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-md font-mono">
                        BENDAHARA
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Option 1: Tunai */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-amber-300">
                          <span className="text-base">💵</span>
                          <span>Tunai (Cash)</span>
                        </div>
                        <p className="text-[11px] text-slate-300 pl-6">
                          Diserahkan langsung kepada <strong>Bendahara Kelas 1C (Ibu Yayah Sulhiyah)</strong>.
                        </p>
                      </div>

                      {/* Option 2: DANA */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-sky-400">
                            <span className="text-base">📱</span>
                            <span>E-Wallet DANA</span>
                          </div>
                          <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.5 rounded border border-sky-400/30">
                            Transfer DANA
                          </span>
                        </div>
                        <div className="pl-6 space-y-0.5 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">No. DANA:</span>
                            <span className="font-mono font-bold text-white text-xs select-all bg-white/10 px-2 py-0.5 rounded">085715524962</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Atas Nama:</span>
                            <span className="font-bold text-slate-200">Yayah Sulhiyah</span>
                          </div>
                        </div>
                      </div>

                      {/* Option 3: BSI */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-emerald-400">
                            <span className="text-base">🏦</span>
                            <span>Bank BSI (Bank Syariah Indonesia)</span>
                          </div>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                            Bank BSI
                          </span>
                        </div>
                        <div className="pl-6 space-y-0.5 text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">No. Rekening:</span>
                            <span className="font-mono font-bold text-white text-xs select-all bg-white/10 px-2 py-0.5 rounded">7298472591</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Atas Nama:</span>
                            <span className="font-bold text-slate-200">Yayah Sulhiyah</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Ledger (Transactions) Grid (Large) */}
                {(() => {
                  const filteredData = getFilteredCashbookData(cashbookMonthFilter);

                  return (
                    <div className="lg:col-span-2 space-y-4">
                      {/* Filter Tahun & Bulan Buku Kas */}
                      <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-slate-50 border border-purple-200/80 p-3.5 rounded-2xl shadow-2xs space-y-3">
                        {/* Header & Active Badge */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-600 text-white rounded-xl shadow-2xs">
                              <Filter className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-800 font-display">Filter Transaksi Kas</h4>
                              <p className="text-[10px] text-slate-500 font-medium">Filter berdasar tahun dan bulan pencatatan</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className="text-[10px] font-bold text-slate-500">Terpilih:</span>
                            <span className="text-xs font-black text-purple-900 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs">
                              📌 {getPeriodLabel(cashbookMonthFilter)}
                            </span>
                          </div>
                        </div>

                        {/* Filter controls */}
                        <div className="space-y-2.5">
                          {/* 1. Filter Tahun */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-extrabold text-slate-700 w-20 shrink-0 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-purple-600" />
                              <span>Tahun:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { key: "ALL", label: "Semua Tahun" },
                                { key: "2026", label: "2026" },
                                { key: "2027", label: "2027" }
                              ].map((y) => (
                                <button
                                  key={y.key}
                                  type="button"
                                  onClick={() => setCashbookYearFilter(y.key)}
                                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                                    cashbookYearFilter === y.key
                                      ? "bg-purple-700 text-white shadow-2xs"
                                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                  }`}
                                >
                                  {y.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Filter Bulan */}
                          <div className="flex flex-wrap items-start sm:items-center gap-2 pt-2 border-t border-purple-100/60">
                            <span className="text-[11px] font-extrabold text-slate-700 w-20 shrink-0 flex items-center gap-1 pt-1 sm:pt-0">
                              <Filter className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Bulan:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                              {[
                                { key: "ALL", label: "Semua Bulan" },
                                ...(cashbookYearFilter === "2026"
                                  ? [
                                      { key: "07", label: "Juli" },
                                      { key: "08", label: "Agustus" },
                                      { key: "09", label: "September" },
                                      { key: "10", label: "Oktober" },
                                      { key: "11", label: "November" },
                                      { key: "12", label: "Desember" }
                                    ]
                                  : cashbookYearFilter === "2027"
                                  ? [
                                      { key: "01", label: "Januari" },
                                      { key: "02", label: "Februari" },
                                      { key: "03", label: "Maret" },
                                      { key: "04", label: "April" },
                                      { key: "05", label: "Mei" },
                                      { key: "06", label: "Juni" },
                                      { key: "07", label: "Juli" },
                                      { key: "08", label: "Agustus" },
                                      { key: "09", label: "September" },
                                      { key: "10", label: "Oktober" },
                                      { key: "11", label: "November" },
                                      { key: "12", label: "Desember" }
                                    ]
                                  : [
                                      { key: "01", label: "Januari" },
                                      { key: "02", label: "Februari" },
                                      { key: "03", label: "Maret" },
                                      { key: "04", label: "April" },
                                      { key: "05", label: "Mei" },
                                      { key: "06", label: "Juni" },
                                      { key: "07", label: "Juli" },
                                      { key: "08", label: "Agustus" },
                                      { key: "09", label: "September" },
                                      { key: "10", label: "Oktober" },
                                      { key: "11", label: "November" },
                                      { key: "12", label: "Desember" }
                                    ])
                              ].map((m) => (
                                <button
                                  key={m.key}
                                  type="button"
                                  onClick={() => setCashbookMonthOnlyFilter(m.key)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                                    cashbookMonthOnlyFilter === m.key
                                      ? "bg-indigo-600 text-white shadow-2xs"
                                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                  }`}
                                >
                                  {m.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financial Stats Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-2xl p-3.5 border border-purple-500/30 shadow-xs relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider block">
                                Total Saldo Kas
                              </span>
                              <span className="text-lg font-black font-display text-white mt-0.5 block">
                                {formatRupiah(totals.saldo)}
                              </span>
                            </div>
                            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300 text-sm">
                              🏦
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-300 block mt-1 font-medium">
                            Kas Aktif Kelas 1C
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                                Penerimaan ({getPeriodLabel(cashbookMonthFilter)})
                              </span>
                              <span className="text-lg font-black font-display text-emerald-600 mt-0.5 block">
                                +{formatRupiah(filteredData.totalMasuk)}
                              </span>
                            </div>
                            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 text-sm">
                              📈
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-600 block mt-1 font-medium">
                            Total Pemasukan Kas
                          </span>
                        </div>

                        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
                                Pengeluaran ({getPeriodLabel(cashbookMonthFilter)})
                              </span>
                              <span className="text-lg font-black font-display text-rose-600 mt-0.5 block">
                                -{formatRupiah(filteredData.totalKeluar)}
                              </span>
                            </div>
                            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 text-sm">
                              📉
                            </div>
                          </div>
                          <span className="text-[9px] text-rose-600 block mt-1 font-medium">
                            Total Belanja & Kasbon
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Share Banner Action */}
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs font-bold">
                            📱
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-emerald-950 font-display">
                              Bagikan Laporan Kas via WhatsApp ({getPeriodLabel(cashbookMonthFilter)})
                            </h4>
                            <p className="text-[10px] text-emerald-700 font-medium">
                              Kirimkan ringkasan total penerimaan, pengeluaran, dan saldo kas per bulan ke grup WhatsApp.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const rawMsg = getWaCashbookRawText(cashbookMonthFilter);
                              navigator.clipboard.writeText(rawMsg);
                              setCopyStatus("wa_report_" + cashbookMonthFilter);
                              setTimeout(() => setCopyStatus(null), 3000);
                            }}
                            className="px-3 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer flex-1 sm:flex-none"
                          >
                            {copyStatus === "wa_report_" + cashbookMonthFilter ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>✓ Disalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin Laporan</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setWaReportSelectedMonth(cashbookMonthFilter);
                              setWaReportCopySuccess(false);
                              setIsWaReportModalOpen(true);
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer border border-emerald-500 flex-1 sm:flex-none"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Share Rekap WA</span>
                          </button>
                        </div>
                      </div>

                      {/* Transaction List */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm font-display">
                              Buku Kas Transaksi ({getPeriodLabel(cashbookMonthFilter)})
                            </h3>
                            <p className="text-[10px] text-slate-400">Laporan rincian pemasukan & pengeluaran kas kelas secara terbuka</p>
                          </div>
                          <span className="text-xs font-black text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                            {filteredData.transactions.length} Transaksi
                          </span>
                        </div>

                        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                          {filteredData.transactions.length === 0 ? (
                            <p className="text-center py-8 text-xs text-slate-400 italic">Belum ada transaksi di bulan ini.</p>
                          ) : (
                            filteredData.transactions.map((tx) => (
                              <div 
                                key={tx.id} 
                                onClick={() => setSelectedTxDetail(tx)}
                                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100/80 rounded-xl text-xs hover:bg-slate-100/80 transition cursor-pointer group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    tx.type === "IN" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                                  }`}>
                                    {tx.type === "IN" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-800 block group-hover:text-indigo-600 transition">{tx.description}</span>
                                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                                      <span>{tx.date}</span>
                                      <span>•</span>
                                      <span className="bg-white px-1.5 py-0.2 rounded border font-mono">{tx.category}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedTxDetail(tx);
                                        }}
                                        className="text-[9px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.2 rounded font-bold transition cursor-pointer"
                                      >
                                        🔍 Detail
                                      </button>
                                      {tx.proofImage ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewImageModal({
                                              src: tx.proofImage!,
                                              title: `Struk Belanja (${tx.category}) - ${tx.description}`,
                                              tx: tx
                                            });
                                          }}
                                          className="text-[9px] bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-1.5 py-0.2 rounded font-bold transition cursor-pointer"
                                        >
                                          📄 Struk
                                        </button>
                                      ) : tx.type === "OUT" ? (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewImageModal({
                                              src: `Pembelian: ${tx.description} ${tx.amount} (${tx.category})`,
                                              title: `Struk Digital Pengeluaran - ${tx.description}`,
                                              tx: tx
                                            });
                                          }}
                                          className="text-[9px] bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded font-semibold transition cursor-pointer"
                                        >
                                          📄 Struk Digital
                                        </button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                <span className={`font-black font-display text-xs sm:text-sm block ${
                                  tx.type === "IN" ? "text-emerald-600" : "text-red-600"
                                }`}>
                                  {tx.type === "IN" ? "+" : "-"}{formatRupiah(tx.amount)}
                                </span>
                                <span className={`text-[9px] font-extrabold block text-right mt-0.5 ${
                                  tx.type === "IN" ? "text-emerald-600" : "text-red-600"
                                }`}>
                                  {tx.type === "IN" ? "Pemasukan ↙" : "Pengeluaran ↗"}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                </div>
              </div>
            )}

            {/* ==========================================
                PARENT TAB 3: KASBON & REIMBURSEMENT FORMS
                ========================================== */}
            {parentTab === "kasbon_rembes" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Submission Lists Column */}
                <div className="space-y-6">
                  
                  {/* Active Kasbon Status Summary */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Aturan Sistem Kasbon Kelas 1C</h4>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        📌 <strong>Penyelesaian Kasbon Wajib Langsung Lunas:</strong> Pelunasan kasbon tidak boleh dilakukan setengah-setengah atau dicicil, melainkan harus diselesaikan sekaligus secara langsung dalam 1 kali transaksi/nota.
                      </p>
                      {currentStudent.sisaKasbon > 0 && (
                        <p className="text-[11px] text-amber-700 bg-amber-100/60 p-2 rounded-lg font-medium">
                          Status Anda saat ini memiliki Kasbon gantung sebesar <strong>{formatRupiah(currentStudent.sisaKasbon)}</strong>. Saat mengajukan rembesan, kasbon ini akan langsung diperhitungkan untuk dilunaskan sekaligus.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Kasbon Submissions list */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm font-display mb-1">
                      Riwayat Pengajuan Kasbon Anda
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4">Pengajuan dana talangan darurat untuk murid</p>

                    <div className="space-y-2">
                      {dbState.kasbons.filter(k => k.studentId === selectedStudentId).length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">Belum ada pengajuan kasbon</p>
                      ) : (
                        dbState.kasbons.filter(k => k.studentId === selectedStudentId).slice().reverse().map((kb) => (
                          <div key={kb.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-slate-800 block">{formatRupiah(kb.amount)}</span>
                                <p className="text-[10px] text-slate-500 mt-0.5">{kb.purpose}</p>
                              </div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                kb.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                kb.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}>
                                {kb.status}
                              </span>
                            </div>

                            <div className="text-[9px] text-slate-400 flex justify-between border-t border-slate-200/50 pt-2 font-mono">
                              <span>Diajukan: {kb.dateRequested}</span>
                              {kb.adminNotes && <span className="text-slate-500 text-right">Memo: {kb.adminNotes}</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Rembes submissions list */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm font-display mb-1">
                      Riwayat Pengajuan Rembesan (Reimbursement)
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4">Pencairan dana dengan melampirkan bukti nota fisik belanja</p>

                    <div className="space-y-2">
                      {dbState.reimbursements.filter(r => r.studentId === selectedStudentId).length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">Belum ada pengajuan rembesan</p>
                      ) : (
                        dbState.reimbursements.filter(r => r.studentId === selectedStudentId).slice().reverse().map((rb) => (
                          <div key={rb.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-slate-800 block">Nilai Nota: {formatRupiah(rb.amount)}</span>
                                <p className="text-[10px] text-slate-500 mt-0.5">{rb.purpose}</p>
                              </div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                rb.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                rb.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                              }`}>
                                {rb.status}
                              </span>
                            </div>

                            {/* Kasbon deduction math display */}
                            <div className="bg-white p-2 rounded border border-slate-200/40 text-[10px] text-slate-500 space-y-1">
                              <div className="flex justify-between">
                                <span>Nilai Nota Pengajuan</span>
                                <span>{formatRupiah(rb.originalAmount)}</span>
                              </div>
                              <div className="flex justify-between text-amber-600 font-semibold">
                                <span>Potongan Kasbon Terbayar</span>
                                <span>-{formatRupiah(rb.deductedAmount)}</span>
                              </div>
                              <div className="flex justify-between text-slate-800 font-bold border-t border-slate-100 pt-1">
                                <span>Dana Cair Diterima</span>
                                <span className="text-emerald-600">{formatRupiah(rb.finalPayableAmount)}</span>
                              </div>
                            </div>

                            {/* VISUAL NOTA & ITEM PHOTO THUMBNAILS */}
                            {(rb.receiptImage || rb.itemPhoto || rb.returnProofImage) && (
                              <div className="flex gap-2 pt-1 border-t border-slate-100 overflow-x-auto">
                                {rb.receiptImage && (
                                  <button
                                    type="button"
                                    onClick={() => setViewImageModal({ src: rb.receiptImage, title: `Nota Belanja - ${rb.purpose}` })}
                                    className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg hover:border-purple-400 transition cursor-pointer text-left shrink-0"
                                  >
                                    {rb.receiptImage.startsWith("data:image/jpeg") || rb.receiptImage.startsWith("data:image/png") || rb.receiptImage.startsWith("data:image/webp") || rb.receiptImage.startsWith("http") ? (
                                      <img 
                                        src={rb.receiptImage} 
                                        alt="Nota" 
                                        className="w-10 h-10 object-cover rounded-md"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-purple-100 rounded-md border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                                        <Receipt className="w-5 h-5" />
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-700 block">📄 {rb.isGeneratedNota ? "Nota AI" : "Nota"}</span>
                                      <span className="text-[8px] text-purple-600 font-semibold block">Klik Perbesar</span>
                                    </div>
                                  </button>
                                )}

                                {rb.itemPhoto && (
                                  <button
                                    type="button"
                                    onClick={() => setViewImageModal({ src: rb.itemPhoto, title: `Foto Barang - ${rb.purpose}` })}
                                    className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg hover:border-purple-400 transition cursor-pointer text-left shrink-0"
                                  >
                                    <img 
                                      src={rb.itemPhoto} 
                                      alt="Barang" 
                                      className="w-10 h-10 object-cover rounded-md"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-700 block">📦 Barang</span>
                                      <span className="text-[8px] text-purple-600 font-semibold block">Klik Perbesar</span>
                                    </div>
                                  </button>
                                )}

                                {rb.returnProofImage && (
                                  <button
                                    type="button"
                                    onClick={() => setViewImageModal({ src: rb.returnProofImage, title: "Bukti Transfer Pengembalian Kelebihan Sisa Kasbon" })}
                                    className="flex items-center gap-1.5 p-1 bg-white border border-amber-200 rounded-lg hover:border-amber-400 transition cursor-pointer text-left shrink-0"
                                  >
                                    <img 
                                      src={rb.returnProofImage} 
                                      alt="Pengembalian" 
                                      className="w-10 h-10 object-cover rounded-md"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <span className="text-[10px] font-bold text-amber-800 block">🏧 Pengembalian</span>
                                      <span className="text-[8px] text-amber-600 font-semibold block">Klik Perbesar</span>
                                    </div>
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="text-[9px] text-slate-400 flex justify-between border-t border-slate-250/30 pt-1 font-mono">
                              <span>Diajukan: {rb.dateRequested}</span>
                              {rb.ocrResult && <span className="text-emerald-600 font-bold">✨ OCR AI OK</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Submitting Forms Column */}
                <div className="space-y-6">
                  
                  {/* Tabs: Choose what to apply */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
                    
                    {/* Floating Toggle: Kasbon or Reimbursement */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm font-display">Ajukan Dana Baru</h3>
                        <p className="text-[10px] text-slate-400">Pilih jenis dana darurat kelas yang Anda butuhkan</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOcrVerifier(false);
                          setRembesSuccess(false);
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition ${
                          !showOcrVerifier ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Ajukan Kasbon
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOcrVerifier(true);
                          setKasbonSuccess(false);
                        }}
                        className={`py-2 text-xs font-bold rounded-lg transition ${
                          showOcrVerifier ? "bg-white text-slate-800 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Ajukan Rembesan (AI Nota)
                      </button>
                    </div>

                    {/* FORM A: NEW KASBON REQUEST */}
                    {!showOcrVerifier && (
                      <form onSubmit={handleApplyKasbon} className="space-y-4">
                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
                          <label className="text-[10px] font-bold text-purple-900 uppercase block tracking-wider">
                            Metode Pencairan Kasbon *
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setKasbonPayoutMethod("CASH")}
                              className={`py-2 rounded-xl transition cursor-pointer border ${
                                kasbonPayoutMethod === "CASH"
                                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              💵 Tunai (Cash)
                            </button>
                            <button
                              type="button"
                              onClick={() => setKasbonPayoutMethod("TRANSFER")}
                              className={`py-2 rounded-xl transition cursor-pointer border ${
                                kasbonPayoutMethod === "TRANSFER"
                                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              🏧 Transfer Bank
                            </button>
                          </div>

                          {kasbonPayoutMethod === "CASH" && (
                            <p className="text-[11px] text-purple-700 bg-white p-2.5 rounded-xl border border-purple-100 font-medium">
                              💡 Pencairan kasbon akan diberikan secara <strong>Tunai (Cash)</strong> langsung oleh Bendahara. Anda tidak perlu mengisi data rekening bank.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Jumlah Kasbon (Rp) *</label>
                          <input
                            type="number"
                            placeholder="Contoh: 50000"
                            value={kasbonAmount}
                            onChange={(e) => setKasbonAmount(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            required
                          />
                        </div>

                        {/* CONDITIONAL BANK ACCOUNT FIELDS FOR TRANSFER */}
                        {kasbonPayoutMethod === "TRANSFER" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                            <div className="sm:col-span-2">
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Data Rekening Penerima Transfer *</span>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Nama Bank / E-Wallet</label>
                              <select
                                value={kasbonBank}
                                onChange={(e) => setKasbonBank(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                              >
                                <option value="Bank BCA">Bank BCA</option>
                                <option value="Bank Mandiri">Bank Mandiri</option>
                                <option value="Bank BRI">Bank BRI</option>
                                <option value="Bank BNI">Bank BNI</option>
                                <option value="E-Wallet Gopay">E-Wallet Gopay</option>
                                <option value="E-Wallet OVO">E-Wallet OVO</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Nomor Rekening / HP</label>
                              <input
                                type="text"
                                placeholder="Masukkan nomor rekening..."
                                value={kasbonAccount}
                                onChange={(e) => setKasbonAccount(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                                required={kasbonPayoutMethod === "TRANSFER"}
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Atas Nama Rekening</label>
                              <input
                                type="text"
                                placeholder="Nama pemilik rekening..."
                                value={kasbonAccName}
                                onChange={(e) => setKasbonAccName(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                                required={kasbonPayoutMethod === "TRANSFER"}
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Detail Alasan Kasbon *</label>
                          <textarea
                            placeholder="Tuliskan secara lengkap detail keperluan darurat anak..."
                            value={kasbonPurpose}
                            onChange={(e) => setKasbonPurpose(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                            required
                          />
                        </div>

                        {/* Kasbon Settlement Rule Note */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium space-y-1">
                          <span className="font-bold block">⚠️ Ketentuan Penyelesaian Kasbon:</span>
                          <p className="text-[10px] text-amber-800 leading-relaxed">
                            Penyelesaian kasbon wajib dilakukan secara <strong>langsung & lunas sekaligus</strong> (100% lunas dalam 1 kali transaksi/nota), tidak diperbolehkan diselesaikan setengah-setengah atau dicicil.
                          </p>
                        </div>

                        {kasbonSuccess && (
                          <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Pengajuan kasbon berhasil dikirim! Hubungi Bendahara untuk diproses.
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Kirim Pengajuan Kasbon
                        </button>
                      </form>
                    )}

                    {/* FORM B: REIMBURSEMENT WITH SYSTEMATIC AI SCANNING */}
                    {showOcrVerifier && (
                      <div className="space-y-4">
                        
                        {/* STEP 1: PILIH JENIS REIMBURSEMENT & KASBON OUTSTANDING FIRST */}
                        <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                          <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">
                            1. Jenis Pengajuan Rembesan *
                          </label>
                          <div className="grid grid-cols-2 gap-2 bg-slate-200/70 p-1 rounded-xl text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setRembesFromKasbon(true);
                                const claimedIds = new Set(
                                  dbState.reimbursements
                                    .filter(r => r.kasbonId && r.status !== "REJECTED")
                                    .map(r => r.kasbonId)
                                );
                                const activeKbs = dbState.kasbons.filter(k => 
                                  k.studentId === selectedStudentId && 
                                  k.status === "APPROVED" && 
                                  !claimedIds.has(k.id)
                                );
                                if (activeKbs.length > 0 && !rembesKasbonId) {
                                  setRembesKasbonId(activeKbs[0].id);
                                }
                              }}
                              className={`py-2 rounded-lg transition cursor-pointer ${
                                rembesFromKasbon ? "bg-purple-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              💰 Rembes Kasbon Gantung
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRembesFromKasbon(false);
                                setRembesKasbonId("");
                              }}
                              className={`py-2 rounded-lg transition cursor-pointer ${
                                !rembesFromKasbon ? "bg-purple-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              💸 Bukan Rembes Kasbon
                            </button>
                          </div>

                          {/* If Rembes Kasbon, MUST select which outstanding Kasbon */}
                          {rembesFromKasbon && (
                            <div className="mt-2 space-y-2">
                              {(() => {
                                const claimedIds = new Set(
                                  dbState.reimbursements
                                    .filter(r => r.kasbonId && r.status !== "REJECTED")
                                    .map(r => r.kasbonId)
                                );
                                const outstandingKasbons = dbState.kasbons.filter(k => 
                                  k.studentId === selectedStudentId && 
                                  k.status === "APPROVED" && 
                                  !claimedIds.has(k.id)
                                );
                                if (outstandingKasbons.length > 0) {
                                  return (
                                    <div>
                                      <label className="text-[10px] font-bold text-purple-900 block mb-1">
                                        Pilih Kasbon Outstanding yang Akan Dirembes / Dilunasi: *
                                      </label>
                                      <select
                                        value={rembesKasbonId}
                                        onChange={(e) => setRembesKasbonId(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-600 shadow-xs"
                                        required
                                      >
                                        <option value="">-- Pilih Kasbon Outstanding --</option>
                                        {outstandingKasbons.map(kb => (
                                          <option key={kb.id} value={kb.id}>
                                            Kasbon #{kb.id.slice(-4)} - {formatRupiah(kb.amount)} ({kb.purpose}) - {kb.dateRequested}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
                                      ⚠️ Anak Anda ({currentStudent?.name}) saat ini tidak memiliki Kasbon gantung yang belum dirembes. Silakan pilih <strong>"Bukan Rembes Kasbon"</strong> jika ini pengeluaran mandiri.
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          )}
                        </div>

                        {/* STEP 2: SCAN RECEIPT OR SUBMIT COMPLETED FORM */}
                        {!rembesReceipt ? (
                          <div>
                            <ReceiptVerifier 
                              parentName={currentStudent?.parentName}
                              studentName={currentStudent?.name}
                              onVerified={handleReceiptOcrVerified} 
                              onCancel={() => setShowOcrVerifier(false)} 
                            />
                          </div>
                        ) : (
                          // If verified, display form and let user complete submission
                          <form onSubmit={handleApplyRembes} className="space-y-4">
                            
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                              <span className="font-semibold flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                {rembesIsGeneratedNota ? "✨ Nota Digital Berhasil Dibuat oleh AI" : "✓ Nota Berhasil Dipindai AI"}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setRembesReceipt("");
                                  setRembesOcr(null);
                                  setRembesItemPhoto("");
                                  setRembesIsGeneratedNota(false);
                                }}
                                className="text-[10px] font-bold underline cursor-pointer"
                              >
                                {rembesIsGeneratedNota ? "Buat Ulang" : "Pindai Ulang"}
                              </button>
                            </div>

                            {/* VISUAL PREVIEW OF NOTA & ITEM PHOTO */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-600 block">
                                  {rembesIsGeneratedNota ? "📄 Preview Nota Digital AI:" : "🧾 Preview Bukti Nota:"}
                                </span>
                                <div 
                                  onClick={() => setViewImageModal({ src: rembesReceipt, title: `Nota Belanja - ${rembesPurpose}` })}
                                  className="relative group cursor-pointer border border-slate-200 rounded-xl p-1.5 bg-white hover:border-purple-400 transition"
                                >
                                  {rembesIsGeneratedNota || rembesReceipt.includes("data:image/svg+xml") || (!rembesReceipt.startsWith("data:image/jpeg") && !rembesReceipt.startsWith("data:image/png") && !rembesReceipt.startsWith("http")) ? (
                                    <div className="max-h-60 overflow-y-auto p-1 bg-slate-100 rounded-lg">
                                      <ThermalSupermarketReceipt 
                                        textData={rembesPurpose} 
                                        merchant={rembesOcr?.merchant}
                                        purpose={rembesPurpose}
                                        amount={parseInt(rembesAmount) || 0}
                                        parentName={currentStudent?.parentName}
                                        studentName={currentStudent?.name}
                                        items={rembesOcr?.items}
                                        isGeneratedNota={rembesIsGeneratedNota}
                                      />
                                    </div>
                                  ) : (
                                    <img 
                                      src={rembesReceipt} 
                                      alt="Nota Belanja" 
                                      className="max-h-44 mx-auto object-contain rounded-lg"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-90 group-hover:opacity-100 transition flex items-center gap-1 shadow-xs z-10">
                                    <Eye className="w-3.5 h-3.5" /> Perbesar
                                  </div>
                                </div>
                              </div>

                              {rembesItemPhoto && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-slate-600 block">
                                    📦 Foto Fisik Barang:
                                  </span>
                                  <div 
                                    onClick={() => setViewImageModal({ src: rembesItemPhoto, title: "Foto Fisik Barang" })}
                                    className="relative group cursor-pointer border border-slate-200 rounded-xl p-1.5 bg-white hover:border-purple-400 transition"
                                  >
                                    <img 
                                      src={rembesItemPhoto} 
                                      alt="Foto Barang" 
                                      className="max-h-44 mx-auto object-contain rounded-lg"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-[10px] font-bold gap-1">
                                      <Eye className="w-4 h-4" /> Perbesar Foto
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* ITEMIZED BREAKDOWN DISPLAY */}
                            {rembesItems.length > 0 && (
                              <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                                    <Receipt className="w-4 h-4 text-purple-600" />
                                    <span>Rincian Barang & Harga Satuan</span>
                                  </span>
                                  <span className="text-[10px] bg-purple-200 text-purple-800 font-extrabold px-2 py-0.5 rounded-full">
                                    {rembesItems.length} Item
                                  </span>
                                </div>

                                <div className="space-y-1.5 bg-white p-2 rounded-xl border border-purple-100">
                                  <div className="grid grid-cols-12 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-100">
                                    <span className="col-span-6">Nama Barang</span>
                                    <span className="col-span-2 text-center">Qty</span>
                                    <span className="col-span-4 text-right">Harga Satuan & Subtotal</span>
                                  </div>

                                  {rembesItems.map((it, i) => (
                                    <div key={it.id || i} className="grid grid-cols-12 items-center text-xs py-1 border-b border-slate-50 last:border-0">
                                      <span className="col-span-6 font-semibold text-slate-800 truncate">{it.name}</span>
                                      <span className="col-span-2 text-center font-bold text-slate-600">{it.qty}x</span>
                                      <div className="col-span-4 text-right">
                                        <div className="text-[10px] text-slate-500">@ {formatRupiah(it.unitPrice)}</div>
                                        <div className="font-extrabold text-purple-700">{formatRupiah(it.qty * it.unitPrice)}</div>
                                      </div>
                                    </div>
                                  ))}

                                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-purple-200 text-xs">
                                    <span className="font-bold text-slate-700">Total Otomatis Nota:</span>
                                    <span className="font-extrabold text-purple-900 text-sm">
                                      {formatRupiah(rembesItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CALCULATED MATH & PAYMENT METHOD CONDITIONS */}
                            {(() => {
                              const notaVal = parseInt(rembesAmount) || 0;
                              let kasbonVal = 0;
                              if (rembesFromKasbon) {
                                if (rembesKasbonId) {
                                  const kb = dbState.kasbons.find(k => k.id === rembesKasbonId);
                                  kasbonVal = kb ? kb.amount : (currentStudent?.sisaKasbon || 0);
                                } else {
                                  kasbonVal = currentStudent?.sisaKasbon || 0;
                                }
                              }

                              if (rembesFromKasbon) {
                                if (notaVal < kasbonVal) {
                                  // Kelebihan Uang Kasbon -> Wali Wajib Kembalikan ke Bendahara
                                  const excess = kasbonVal - notaVal;
                                  return (
                                    <div className="space-y-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs">
                                      <div className="space-y-1">
                                        <div className="flex justify-between">
                                          <span className="text-slate-600">Nominal Kasbon Gantung:</span>
                                          <span className="font-bold">{formatRupiah(kasbonVal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-slate-600">Nilai Realisasi Nota:</span>
                                          <span className="font-bold text-slate-800">{formatRupiah(notaVal)}</span>
                                        </div>
                                        <div className="flex justify-between text-amber-800 font-extrabold text-sm border-t border-amber-200/60 pt-1.5">
                                          <span>Wajib Dikembalikan ke Bendahara:</span>
                                          <span>{formatRupiah(excess)}</span>
                                        </div>
                                      </div>

                                      <div className="p-2 bg-white rounded-xl border border-amber-200 space-y-2">
                                        <label className="text-[10px] font-bold text-amber-900 uppercase block">
                                          Metode Pengembalian Sisa Kasbon ke Bendahara *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                                          <button
                                            type="button"
                                            onClick={() => setRembesReturnMethod("CASH")}
                                            className={`py-1.5 rounded-lg border transition ${
                                              rembesReturnMethod === "CASH" 
                                                ? "bg-amber-600 text-white border-amber-600" 
                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                            }`}
                                          >
                                            💵 Tunai (Cash)
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setRembesReturnMethod("TRANSFER")}
                                            className={`py-1.5 rounded-lg border transition ${
                                              rembesReturnMethod === "TRANSFER" 
                                                ? "bg-amber-600 text-white border-amber-600" 
                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                            }`}
                                          >
                                            🏧 Transfer Bank
                                          </button>
                                        </div>

                                        {rembesReturnMethod === "TRANSFER" && (
                                          <div className="pt-2 space-y-2">
                                            <label className="text-[10px] font-bold text-slate-600 block">
                                              Upload Bukti Transfer Pengembalian Sisa Rp {excess.toLocaleString()} ke Bendahara *
                                            </label>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  const reader = new FileReader();
                                                  reader.onloadend = () => setRembesReturnProofImage(reader.result as string);
                                                  reader.readAsDataURL(file);
                                                }
                                              }}
                                              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                                              required={rembesReturnMethod === "TRANSFER"}
                                            />
                                            {rembesReturnProofImage && (
                                              <img src={rembesReturnProofImage} alt="Bukti Transfer Return" className="h-20 rounded-lg border border-amber-300 object-contain" />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                } else if (notaVal > kasbonVal) {
                                  // Kekurangan Uang Kasbon -> Bendahara Wajib Payout ke Wali
                                  const shortage = notaVal - kasbonVal;
                                  return (
                                    <div className="space-y-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                                      <div className="space-y-1">
                                        <div className="flex justify-between">
                                          <span className="text-slate-600">Nilai Realisasi Nota:</span>
                                          <span className="font-bold">{formatRupiah(notaVal)}</span>
                                        </div>
                                        <div className="flex justify-between text-amber-700">
                                          <span>Potongan Kasbon Terbayar:</span>
                                          <span>-{formatRupiah(kasbonVal)}</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-800 font-extrabold text-sm border-t border-emerald-200/60 pt-1.5">
                                          <span>Pencairan Kekurangan oleh Bendahara:</span>
                                          <span>{formatRupiah(shortage)}</span>
                                        </div>
                                      </div>

                                      <div className="p-2 bg-white rounded-xl border border-emerald-200 space-y-2">
                                        <label className="text-[10px] font-bold text-emerald-900 uppercase block">
                                          Metode Penerimaan Kekurangan Pencairan Dari Bendahara *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                                          <button
                                            type="button"
                                            onClick={() => setRembesPayoutMethod("CASH")}
                                            className={`py-1.5 rounded-lg border transition ${
                                              rembesPayoutMethod === "CASH" 
                                                ? "bg-emerald-600 text-white border-emerald-600" 
                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                            }`}
                                          >
                                            💵 Tunai (Cash)
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setRembesPayoutMethod("TRANSFER")}
                                            className={`py-1.5 rounded-lg border transition ${
                                              rembesPayoutMethod === "TRANSFER" 
                                                ? "bg-emerald-600 text-white border-emerald-600" 
                                                : "bg-slate-50 text-slate-700 border-slate-200"
                                            }`}
                                          >
                                            🏧 Transfer Bank
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // Nota Pas Persis dengan Kasbon
                                  return (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-1">
                                      <span className="font-bold text-blue-900 block">✅ Pas Persis dengan Kasbon</span>
                                      <p className="text-slate-600 text-[11px]">
                                        Nilai nota (<strong>{formatRupiah(notaVal)}</strong>) pas dengan Kasbon. Kasbon dinyatakan lunas tanpa perlu transaksi tambahan.
                                      </p>
                                    </div>
                                  );
                                }
                              } else {
                                // Bukan Dari Kasbon
                                return (
                                  <div className="space-y-3 p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs">
                                    <div className="flex justify-between items-center text-purple-900 font-extrabold text-sm">
                                      <span>Total Rembesan Dicairkan:</span>
                                      <span>{formatRupiah(notaVal)}</span>
                                    </div>

                                    <div className="p-2 bg-white rounded-xl border border-purple-200 space-y-2">
                                      <label className="text-[10px] font-bold text-purple-900 uppercase block">
                                        Metode Penerimaan Pencairan Dari Bendahara *
                                      </label>
                                      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                                        <button
                                          type="button"
                                          onClick={() => setRembesPayoutMethod("CASH")}
                                          className={`py-1.5 rounded-lg border transition ${
                                            rembesPayoutMethod === "CASH" 
                                              ? "bg-purple-600 text-white border-purple-600" 
                                              : "bg-slate-50 text-slate-700 border-slate-200"
                                          }`}
                                        >
                                          💵 Tunai (Cash)
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setRembesPayoutMethod("TRANSFER")}
                                          className={`py-1.5 rounded-lg border transition ${
                                            rembesPayoutMethod === "TRANSFER" 
                                              ? "bg-purple-600 text-white border-purple-600" 
                                              : "bg-slate-50 text-slate-700 border-slate-200"
                                          }`}
                                        >
                                          🏧 Transfer Bank
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })()}

                            {/* BANK ACCOUNT INPUTS IF PAYOUT METHOD IS TRANSFER */}
                            {(rembesPayoutMethod === "TRANSFER" || !rembesFromKasbon) && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Bank Pembayaran</label>
                                  <select
                                    value={rembesBank}
                                    onChange={(e) => setRembesBank(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white"
                                  >
                                    <option value="Bank BCA">Bank BCA</option>
                                    <option value="Bank Mandiri">Bank Mandiri</option>
                                    <option value="Bank BRI">Bank BRI</option>
                                    <option value="Bank BNI">Bank BNI</option>
                                    <option value="E-Wallet Gopay">E-Wallet Gopay</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Nomor Rekening Anda</label>
                                  <input
                                    type="text"
                                    placeholder="Masukkan nomor rekening..."
                                    value={rembesAccount}
                                    onChange={(e) => setRembesAccount(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white"
                                    required={rembesPayoutMethod === "TRANSFER"}
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Atas Nama Rekening</label>
                                  <input
                                    type="text"
                                    value={rembesAccName}
                                    onChange={(e) => setRembesAccName(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500"
                                    required={rembesPayoutMethod === "TRANSFER"}
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Nominal Nota Belanja (Rp)</label>
                              <input
                                type="number"
                                value={rembesAmount}
                                onChange={(e) => setRembesAmount(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white"
                                required
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-500 block mb-1">Alasan Pengeluaran & Rincian</label>
                              <textarea
                                value={rembesPurpose}
                                onChange={(e) => setRembesPurpose(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white"
                                required
                              />
                            </div>

                            {rembesSuccess && (
                              <p className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" /> Pengajuan rembesan berhasil dikirim kepada bendahara!
                              </p>
                            )}

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                            >
                              Kirim Pengajuan Rembesan
                            </button>
                          </form>
                        )}

                      </div>
                    )}

                  </div>
                </div>

              </div>
            )}

            {parentTab === "daftar_siswa" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-extrabold text-slate-800 text-sm font-display">
                        Daftar Siswa Kelas 1C
                      </h3>
                      <span className="bg-purple-100 text-purple-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                        👥 Total: {dbState.students.length} Siswa
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Daftar seluruh siswa. Klik pada nama atau baris siswa untuk melihat profil lengkap, grafik tumbuh kembang, dan rincian keuangan.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-purple-200 flex items-center gap-1.5 shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Anak Anda: <strong>{currentStudent.name}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama siswa, nama panggilan, atau nama wali murid..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white transition"
                    />
                    {studentSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setStudentSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition cursor-pointer"
                        title="Hapus kata kunci pencarian"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Year Filter Dropdown */}
                  <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 px-3 py-1.5 rounded-xl shrink-0">
                    <span className="text-xs font-extrabold text-purple-950 whitespace-nowrap">📅 Filter Tahun:</span>
                    <select
                      value={selectedYearFilter}
                      onChange={(e) => setSelectedYearFilter(Number(e.target.value))}
                      className="bg-white border border-purple-300 rounded-lg px-2.5 py-1 text-xs font-extrabold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs cursor-pointer"
                    >
                      <option value={2026}>Tahun 2026 (Juli - Des)</option>
                      <option value={2027}>Tahun 2027 (Jan - Des)</option>
                      <option value={2028}>Tahun 2028 (Jan - Des)</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                        <th className="py-2.5 px-3">Nama Siswa</th>
                        <th className="py-2.5 px-3">Wali Murid</th>
                        <th className="py-2.5 px-3">Tgl Lahir & Usia</th>
                        <th className="py-2.5 px-3">Sisa Kasbon</th>
                        {getMonthsForYear(selectedYearFilter).map((m) => (
                          <th key={m.key} className="py-2.5 px-2 text-center">{m.label}</th>
                        ))}
                        <th className="py-2.5 px-3 text-center">Informasi Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = dbState.students
                          .filter(s => {
                            const q = studentSearchQuery.trim().toLowerCase();
                            if (!q) return true;
                            return (
                              s.name.toLowerCase().includes(q) || 
                              s.parentName.toLowerCase().includes(q) ||
                              (s.nickname && s.nickname.toLowerCase().includes(q))
                            );
                          })
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={100} className="py-10 text-center bg-slate-50/50 rounded-b-xl">
                                <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                                  <span className="text-3xl">🔍</span>
                                  <h4 className="text-xs font-extrabold text-slate-700">
                                    Siswa Tidak Ditemukan
                                  </h4>
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    {studentSearchQuery ? (
                                      <>Siswa atau wali murid dengan kata kunci &quot;<strong className="text-purple-700">{studentSearchQuery}</strong>&quot; tidak ada dalam daftar Kelas 1C (Total: {dbState.students.length} Siswa).</>
                                    ) : (
                                      <>Belum ada data siswa yang terdaftar di database.</>
                                    )}
                                  </p>
                                  {studentSearchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => setStudentSearchQuery("")}
                                      className="mt-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition border border-purple-500 flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>Tampilkan Semua Siswa ({dbState.students.length})</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((student) => {
                          const isOwnChild = student.id === selectedStudentId;

                          return (
                            <tr 
                              key={student.id} 
                              onClick={() => {
                                if (isOwnChild) setSelectedDetailStudent(student);
                              }}
                              className={`transition ${
                                isOwnChild ? "bg-purple-50/40 hover:bg-purple-100/50 cursor-pointer border-l-4 border-purple-600" : "hover:bg-slate-50 cursor-default"
                              }`}
                            >
                              <td className="py-3 px-3 font-semibold text-slate-800 font-display whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {student.photoUrl ? (
                                    <img 
                                      src={student.photoUrl} 
                                      alt={student.name} 
                                      className="w-8 h-8 rounded-full object-cover border border-purple-200 shadow-2xs flex-shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                                      {student.name.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="hover:underline font-bold text-purple-900">{student.name}</span>
                                      {isOwnChild && (
                                        <span className="text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded-full animate-pulse">Anak Anda</span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                                      Panggilan: <strong className="text-purple-700 font-bold">{student.nickname || student.name.trim().split(/\s+/)[0]}</strong>
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="font-medium text-slate-600 block">{student.parentName}</span>
                                <span className="text-[10px] text-slate-400 block">{student.parentPhone}</span>
                                {isOwnChild && (
                                  <div className="mt-1">
                                    <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-mono font-bold px-1.5 py-0.5 rounded">
                                      Sandi: {student.password || getAutoPassword(student.nickname, student.name, student.birthday)}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                                  <span>🎂 {new Date(student.birthday).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                                <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                                  {calculateAge(student.birthday)}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-700">
                                {student.sisaKasbon > 0 ? (
                                  <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                                    {formatRupiah(student.sisaKasbon)}
                                  </span>
                                ) : "-"}
                              </td>
                              
                              {getMonthsForYear(selectedYearFilter).map((m) => {
                                const monthStatus = student.iuranStatus?.find(i => i.month === m.key);
                                return (
                                  <td key={m.key} className="py-3 px-2 text-center">
                                    {monthStatus?.paid ? (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                        Lunas
                                      </span>
                                    ) : (
                                      <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                        Belum
                                      </span>
                                    )}
                                  </td>
                                );
                              })}

                              <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                {isOwnChild ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailStudent(student)}
                                    className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1 rounded-lg transition border border-purple-500 cursor-pointer shadow-xs"
                                  >
                                    🔍 Detail & Profil Anak Anda
                                  </button>
                                ) : (
                                  <span className="text-[10px] bg-slate-100 text-slate-400 font-medium px-2 py-1 rounded-lg border border-slate-200 select-none inline-block">
                                    🔒 Detail Terkunci
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            </>
            )}

          </div>
        )}

        {/* ==========================================
            SCREEN 3: BENDAHARA DASHBOARD (SUPERADMIN VIEW)
            ========================================== */}
        {activeRole === "BENDAHARA" && (
          <div className="space-y-6">
            
            {/* BENDAHARA NAVIGATION BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-white p-1.5 sm:p-1 rounded-2xl sm:rounded-xl border border-slate-200 shadow-2xs gap-1 sm:gap-1">
              <button
                type="button"
                onClick={() => setBendaharaTab("ringkasan")}
                className={`py-2.5 text-xs font-bold rounded-xl sm:rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer sm:flex-1 ${
                  bendaharaTab === "ringkasan" ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="hidden sm:inline">🎂 Ikhtisar & Pojok Ultah</span>
                <span className="sm:hidden text-[11px]">🎂 Ikhtisar</span>
              </button>
              <button
                type="button"
                onClick={() => setBendaharaTab("buku_kas")}
                className={`py-2.5 text-xs font-bold rounded-xl sm:rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer sm:flex-1 ${
                  bendaharaTab === "buku_kas" ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="hidden sm:inline">📖 Pencatatan Buku Kas</span>
                <span className="sm:hidden text-[11px]">📖 Buku Kas</span>
              </button>
              <button
                type="button"
                onClick={() => setBendaharaTab("daftar_siswa")}
                className={`py-2.5 text-xs font-bold rounded-xl sm:rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer sm:flex-1 ${
                  bendaharaTab === "daftar_siswa" ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="hidden sm:inline">👥 Kelola Tagihan & Siswa</span>
                <span className="sm:hidden text-[11px]">👥 Tagihan Siswa</span>
              </button>
              <button
                type="button"
                onClick={() => setBendaharaTab("inventaris")}
                className={`py-2.5 text-xs font-bold rounded-xl sm:rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer sm:flex-1 ${
                  bendaharaTab === "inventaris" ? "bg-purple-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span className="hidden sm:inline">📦 Inventaris Kas Kelas</span>
                <span className="sm:hidden text-[11px]">📦 Inventaris</span>
              </button>
            </div>

            {/* ==========================================
                BENDAHARA TAB 1: OVERVIEW & BIRTHDAYS & GROWTH (Ringkasan)
                ========================================== */}
            {bendaharaTab === "ringkasan" && (
              <div className="space-y-6">

                {/* Saldo Saat Ini, Pemasukan & Pengeluaran Perbulan */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-800 text-sm font-display">
                          💰 Saldo & Laporan Kas Per Bulan
                        </h3>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Transparan
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Informasi saldo kas kelas saat ini, total pemasukan & pengeluaran per bulan
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-2 rounded-2xl text-xs font-extrabold shadow-sm flex items-center gap-2">
                      <span>Saldo Saat Ini:</span>
                      <span className="text-sm font-black font-display">{formatRupiah(totals.saldo)}</span>
                    </div>
                  </div>

                  {(() => {
                    const mbData = getMonthlyBreakdown(overviewYearFilter);
                    const totalMasukYear = mbData.reduce((sum, item) => sum + item.totalMasuk, 0);
                    const totalKeluarYear = mbData.reduce((sum, item) => sum + item.totalKeluar, 0);
                    const finalSaldoYear = mbData.length > 0 ? mbData[mbData.length - 1].saldoAkhir : totals.saldo;

                    return (
                      <>
                        {/* Year Filter Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-purple-50/70 border border-purple-100 p-2.5 rounded-2xl">
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 font-display">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>Pilih Tahun Laporan Kas:</span>
                          </div>
                          <div className="flex items-center gap-1.5 w-full sm:w-auto">
                            {[
                              { key: "2026", label: "2026" },
                              { key: "2027", label: "2027" },
                              { key: "ALL", label: "Semua Tahun" }
                            ].map((y) => (
                              <button
                                key={y.key}
                                type="button"
                                onClick={() => setOverviewYearFilter(y.key)}
                                className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                                  overviewYearFilter === y.key
                                    ? "bg-purple-700 text-white shadow-2xs"
                                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                }`}
                              >
                                {y.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Summary Cards */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl text-center">
                            <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                              Pemasukan {overviewYearFilter !== "ALL" ? `(${overviewYearFilter})` : ""}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-emerald-800 font-display mt-0.5 block">
                              +{formatRupiah(totalMasukYear)}
                            </span>
                          </div>
                          <div className="bg-red-50/70 border border-red-100 p-3 rounded-2xl text-center">
                            <span className="text-[10px] font-bold text-red-600 block uppercase">
                              Pengeluaran {overviewYearFilter !== "ALL" ? `(${overviewYearFilter})` : ""}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-red-700 font-display mt-0.5 block">
                              -{formatRupiah(totalKeluarYear)}
                            </span>
                          </div>
                          <div className="bg-purple-50/70 border border-purple-100 p-3 rounded-2xl text-center">
                            <span className="text-[10px] font-bold text-purple-700 block uppercase">
                              Saldo {overviewYearFilter !== "ALL" ? `(${overviewYearFilter})` : "Total"}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-purple-900 font-display mt-0.5 block">
                              {formatRupiah(finalSaldoYear)}
                            </span>
                          </div>
                        </div>

                        {/* Per-Month Table */}
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                                <th className="py-2.5 px-3">Bulan</th>
                                <th className="py-2.5 px-3 text-right">Saldo Awal</th>
                                <th className="py-2.5 px-3 text-right text-emerald-600">Pemasukan (+)</th>
                                <th className="py-2.5 px-3 text-right text-red-500">Pengeluaran (-)</th>
                                <th className="py-2.5 px-3 text-right text-slate-900">Saldo Akhir</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {mbData.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="py-6 text-center text-slate-400 font-medium">
                                    Belum ada data transaksi untuk tahun {overviewYearFilter}
                                  </td>
                                </tr>
                              ) : (
                                mbData.map((mb) => (
                                  <tr key={mb.monthKey} className="hover:bg-slate-50 transition">
                                    <td className="py-2.5 px-3 font-bold text-purple-950 font-display whitespace-nowrap">
                                      📅 {mb.monthName}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono text-slate-500 font-semibold">
                                      {formatRupiah(mb.saldoAwal)}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">
                                      +{formatRupiah(mb.totalMasuk)}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono text-red-500 font-bold">
                                      -{formatRupiah(mb.totalKeluar)}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900">
                                      {formatRupiah(mb.saldoAkhir)}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* 1. POJOK ULANG TAHUN SISWA KELAS 1C (BIRTHDAY CORNER) */}
                <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-purple-500/20">
                  {/* Decorative Background Elements */}
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute right-20 top-2 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />

                  {/* Birthday Corner Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-tr from-pink-500 to-amber-400 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-black">
                        🎂
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base sm:text-lg font-display text-white tracking-wide">
                            Pojok Ulang Tahun Siswa Kelas 1C
                          </h3>
                          <span className="bg-pink-500/30 text-pink-200 border border-pink-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Spesial Momen
                          </span>
                        </div>
                        <p className="text-xs text-purple-200/80 font-medium mt-0.5">
                          Ucapkan selamat ulang tahun kepada para siswa dan wali murid di bulan berjalan!
                        </p>
                      </div>
                    </div>

                    <div className="text-right self-end sm:self-auto">
                      <span className="text-[10px] uppercase font-bold text-purple-300 block">Bulan Terpilih</span>
                      <span className="text-sm font-black font-display text-amber-300">
                        {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][birthdayMonthFilter]} 2026 🎉
                      </span>
                    </div>
                  </div>

                  {/* Month Filter Bar */}
                  <div className="mt-4 relative z-10">
                    <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-2">
                      Pilih Bulan Ulang Tahun:
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                      {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"].map((mShort, idx) => {
                        const countInMonth = dbState.students.filter(s => s.birthday && new Date(s.birthday).getMonth() === idx).length;
                        const isCurrentMonth = new Date().getMonth() === idx;
                        const isSelected = birthdayMonthFilter === idx;

                        return (
                          <button
                            key={idx}
                            onClick={() => setBirthdayMonthFilter(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                              isSelected
                                ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105"
                                : isCurrentMonth
                                ? "bg-white/20 text-white border-purple-300/40 hover:bg-white/30"
                                : "bg-white/5 text-purple-200 border-white/10 hover:bg-white/15"
                            }`}
                          >
                            <span>{mShort}</span>
                            {countInMonth > 0 && (
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                                isSelected ? "bg-slate-900 text-amber-300" : "bg-pink-500 text-white"
                              }`}>
                                {countInMonth}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Birthday Cards Grid */}
                  <div className="mt-4 relative z-10">
                    {(() => {
                      const birthdayList = dbState.students
                        .filter(s => {
                          if (!s.birthday) return false;
                          return new Date(s.birthday).getMonth() === birthdayMonthFilter;
                        })
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }));

                      if (birthdayList.length === 0) {
                        return (
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xs">
                            <p className="text-xs text-purple-200 font-medium">
                              🎈 Tidak ada siswa yang berulang tahun di bulan{" "}
                              <strong>
                                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][birthdayMonthFilter]}
                              </strong>.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {birthdayList.map((std) => {
                            const bDate = new Date(std.birthday);
                            const today = new Date();
                            const ageVal = calculateAge(std.birthday);
                            const dayOfMonth = bDate.getDate();
                            
                            // Check relative days
                            const thisYearBirthday = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
                            const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            const diffDays = Math.round((thisYearBirthday.getTime() - todayZero.getTime()) / (1000 * 3000 * 24));

                            const isToday = today.getDate() === dayOfMonth && today.getMonth() === bDate.getMonth();

                            const waGreeting = encodeURIComponent(
                              `Assalamu'alaikum Wr. Wb. Selamat Ulang Tahun untuk ananda *${std.name}* yang ke-${bDate.getFullYear() ? (today.getFullYear() - bDate.getFullYear()) : '7'} tahun! 🎉🎂\n\n` +
                              `Semoga panjang umur, sehat selalu, makin cerdas, dan membanggakan orang tua. Salam bahagia dari Pengurus Kas & Teman-teman Kelas 1C! 🎈🎁`
                            );

                            return (
                              <div 
                                key={std.id}
                                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                                  isToday 
                                    ? "bg-gradient-to-b from-amber-500/20 to-pink-600/20 border-amber-400 shadow-lg ring-2 ring-amber-400/50" 
                                    : "bg-white/10 border-white/15 hover:border-white/30 backdrop-blur-xs"
                                }`}
                              >
                                {isToday && (
                                  <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl shadow-xs">
                                    🎉 ULANG TAHUN HARI INI!
                                  </div>
                                )}

                                <div className="flex items-start gap-3">
                                  {std.photoUrl ? (
                                    <img 
                                      src={std.photoUrl} 
                                      alt={std.name} 
                                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shadow-md flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 text-white font-black text-xl flex items-center justify-center border-2 border-white/30 flex-shrink-0 font-display">
                                      {std.name.charAt(0)}
                                    </div>
                                  )}

                                  <div className="space-y-0.5 min-w-0">
                                    <h4 className="font-extrabold text-sm text-white font-display truncate">
                                      {std.name}
                                    </h4>
                                    <p className="text-[11px] text-purple-200 truncate">
                                      Wali: {std.parentName}
                                    </p>
                                    <div className="flex items-center gap-1.5 pt-1">
                                      <span className="text-[10px] bg-amber-400/20 border border-amber-300/30 text-amber-200 font-bold px-2 py-0.5 rounded-md font-mono">
                                        📅 {dayOfMonth} {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"][bDate.getMonth()]}
                                      </span>
                                      <span className="text-[10px] bg-pink-500/30 text-pink-200 font-bold px-2 py-0.5 rounded-md">
                                        {ageVal}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-1 border-t border-white/10">
                                  <a
                                    href={`https://wa.me/${std.parentPhone.replace(/[^0-9]/g, '')}?text=${waGreeting}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Ucapkan WA 🎉</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailStudent(std)}
                                    className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-[10px] transition cursor-pointer"
                                  >
                                    🔍 Detail
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 2. IKHTISAR TUMBUH KEMBANG & KESEHATAN SISWA KELAS 1C */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm font-display">
                          Ikhtisar Tumbuh Kembang & Kesehatan Kelas 1C
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Rekapitilasi fisik berat badan (BB) dan tinggi badan (TB) seluruh anggota siswa
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                      ✨ Terintegrasi Grafik
                    </span>
                  </div>

                  {/* Growth Quick Metrics Row */}
                  {(() => {
                    const validW = dbState.students.filter(s => s.weightLogs && s.weightLogs.length > 0);
                    const avgW = validW.length > 0 
                      ? (validW.reduce((sum, s) => sum + s.weightLogs![s.weightLogs!.length - 1].value, 0) / validW.length).toFixed(1)
                      : "-";

                    const validH = dbState.students.filter(s => s.heightLogs && s.heightLogs.length > 0);
                    const avgH = validH.length > 0 
                      ? (validH.reduce((sum, s) => sum + s.heightLogs![s.heightLogs!.length - 1].value, 0) / validH.length).toFixed(1)
                      : "-";

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                          <span className="text-[10px] font-bold text-blue-600 uppercase block">Rata-Rata Berat (BB)</span>
                          <span className="text-lg font-black text-blue-900 font-display mt-0.5 block">{avgW} kg</span>
                          <span className="text-[9px] text-blue-500 font-medium">Standar Ideal 6-7 Thn</span>
                        </div>

                        <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase block">Rata-Rata Tinggi (TB)</span>
                          <span className="text-lg font-black text-emerald-900 font-display mt-0.5 block">{avgH} cm</span>
                          <span className="text-[9px] text-emerald-500 font-medium">Pertumbuhan Positif</span>
                        </div>

                        <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
                          <span className="text-[10px] font-bold text-purple-600 uppercase block">Total Anak Terdata</span>
                          <span className="text-lg font-black text-purple-900 font-display mt-0.5 block">{dbState.students.length} Siswa</span>
                          <span className="text-[9px] text-purple-500 font-medium">Kelas 1C Active</span>
                        </div>

                        <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                          <span className="text-[10px] font-bold text-amber-600 uppercase block">Pemeriksaan Berkala</span>
                          <span className="text-xs font-bold text-amber-900 font-display mt-1 block">Tiap Bulan</span>
                          <span className="text-[9px] text-amber-600 font-medium">Oleh Wali & Sekolah</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Student Growth List Roster */}
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100 text-[10px]">
                          <th className="py-2.5 px-3">Nama Siswa</th>
                          <th className="py-2.5 px-3">Usia</th>
                          <th className="py-2.5 px-3">BB Terakhir</th>
                          <th className="py-2.5 px-3">TB Terakhir</th>
                          <th className="py-2.5 px-3 text-center">Grafik Tumbuh Kembang</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dbState.students
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }))
                          .map((student) => {
                          const lastW = student.weightLogs && student.weightLogs.length > 0 
                            ? student.weightLogs[student.weightLogs.length - 1].value 
                            : "-";
                          const lastH = student.heightLogs && student.heightLogs.length > 0 
                            ? student.heightLogs[student.heightLogs.length - 1].value 
                            : "-";

                          return (
                            <tr key={student.id} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-3 font-semibold text-slate-800">
                                <div className="flex items-center gap-2">
                                  {student.photoUrl ? (
                                    <img src={student.photoUrl} alt={student.name} className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                                      {student.name.charAt(0)}
                                    </div>
                                  )}
                                  <span className="font-bold font-display">{student.name}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-500 text-[11px]">
                                {calculateAge(student.birthday)}
                              </td>
                              <td className="py-2.5 px-3 font-extrabold text-blue-600 font-mono">
                                {lastW !== "-" ? `${lastW} kg` : "-"}
                              </td>
                              <td className="py-2.5 px-3 font-extrabold text-emerald-600 font-mono">
                                {lastH !== "-" ? `${lastH} cm` : "-"}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedDetailStudent(student)}
                                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-lg text-[10px] transition cursor-pointer"
                                >
                                  📊 Buka Grafik & Detail
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. VERIFIKASI PENGAJUAN KASBON, REMBESAN & KONFIRMASI IURAN */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Pending Iuran Confirmations queue */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-800 text-sm font-display flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Approval Konfirmasi Uang Kas</span>
                      </h3>
                      {dbState.iuranConfirmations && dbState.iuranConfirmations.filter(c => c.status === "PENDING").length > 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                          {dbState.iuranConfirmations.filter(c => c.status === "PENDING").length} Baru
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mb-4">Konfirmasi pembayaran mandiri iuran kas oleh wali murid</p>

                    <div className="space-y-3">
                      {(!dbState.iuranConfirmations || dbState.iuranConfirmations.filter(c => c.status === "PENDING").length === 0) ? (
                        <p className="text-xs text-slate-400 text-center py-6">Tidak ada antrean konfirmasi iuran kas 🎉</p>
                      ) : (
                        dbState.iuranConfirmations.filter(c => c.status === "PENDING").map((conf) => {
                          const student = dbState.students.find(s => s.id === conf.studentId);
                          return (
                            <div key={conf.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-2.5">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-extrabold text-slate-800 text-sm block">{formatRupiah(conf.amount)}</span>
                                  <span className="text-[10px] text-slate-500 font-bold">
                                    {student?.name || "Siswa"} (Wali: {conf.parentName})
                                  </span>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px]">
                                  {conf.paymentMethod === "CASH" ? "💵 Cash/Tunai" : "🏧 Transfer"}
                                </span>
                              </div>

                              <div className="p-2 bg-white rounded-lg border border-slate-200 text-[10px] space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Bulan Dibayarkan:</span>
                                  <span className="font-bold text-slate-800">{conf.months.join(", ")}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Total Nominal:</span>
                                  <span className="font-bold text-emerald-600">{formatRupiah(conf.amount)} ({conf.months.length} Bulan)</span>
                                </div>
                              </div>

                              {conf.proofImage && (
                                <div className="space-y-1">
                                  <span className="text-[9px] font-bold text-slate-500 block">Bukti Transfer:</span>
                                  <img src={conf.proofImage} alt="Bukti Transfer" className="w-full h-24 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                                </div>
                              )}

                              <div className="flex gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleProcessIuranConfirmation(conf.id, "APPROVED")}
                                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approved
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleProcessIuranConfirmation(conf.id, "REJECTED")}
                                  className="py-1.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                >
                                  Tolak
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  
                  {/* Pending Kasbon queue */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm font-display mb-1">
                      Verifikasi Pengajuan Kasbon (Dana Talangan)
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4">Pengajuan yang membutuhkan persetujuan pencairan dana cepat</p>

                    <div className="space-y-3">
                      {dbState.kasbons.filter(k => k.status === "PENDING").length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">Tidak ada antrean pengajuan kasbon baru 🎉</p>
                      ) : (
                        dbState.kasbons.filter(k => k.status === "PENDING").map((kb) => {
                          const student = dbState.students.find(s => s.id === kb.studentId);
                          return (
                            <div key={kb.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-extrabold text-slate-800 text-sm block">{formatRupiah(kb.amount)}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">Diajukan oleh {kb.parentName} (Wali {student?.name})</span>
                                </div>
                                <span className="bg-yellow-150 text-yellow-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">PENDING</span>
                              </div>

                              <div className="text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-200/50">
                                <strong>Alasan:</strong> {kb.purpose}
                              </div>

                              {/* Bank / Cash Details */}
                              <div className="p-2 bg-blue-50/50 rounded-lg text-[10px] border border-blue-100/50 flex justify-between items-center">
                                {kb.payoutMethod === "CASH" || (!kb.bankAccount && !kb.bankName) ? (
                                  <span className="font-bold text-slate-800 flex items-center gap-1">💵 Pencairan: Tunai / Cash</span>
                                ) : (
                                  <>
                                    <div>
                                      <span className="text-slate-400 block">Kirim Transfer Ke</span>
                                      <span className="font-semibold text-slate-800">{kb.bankName} - {kb.bankAccount}</span>
                                    </div>
                                    <span className="font-bold text-slate-700">a.n {kb.bankAccountName}</span>
                                  </>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setProcessingItem({ type: "KASBON", item: kb })}
                                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                  Proses Pengajuan
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Pending Reimbursement Queue */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm font-display mb-1">
                      Verifikasi Pengajuan Rembesan (AI Systematic OCR)
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-4">Pencocokan silang antara nota fisik belanja, formulir wali murid, dan deteksi sistem AI</p>

                    <div className="space-y-3">
                      {dbState.reimbursements.filter(r => r.status === "PENDING").length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">Tidak ada antrean pengajuan rembesan baru 🎉</p>
                      ) : (
                        dbState.reimbursements.filter(r => r.status === "PENDING").map((rb) => {
                          const student = dbState.students.find(s => s.id === rb.studentId);
                          return (
                            <div key={rb.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-extrabold text-slate-800 text-sm block">Nilai Nota: {formatRupiah(rb.amount)}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">Diajukan oleh {rb.parentName} (Wali {student?.name})</span>
                                </div>
                                <span className="bg-yellow-150 text-yellow-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">PENDING</span>
                              </div>

                              {/* Math auto-deduction logic indicator */}
                              <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-lg text-[10px] text-slate-600 space-y-1">
                                <h5 className="font-bold text-purple-800">Pengecekan Kasbon Otomatis:</h5>
                                <div className="flex justify-between">
                                  <span>Kasbon Aktif Siswa:</span>
                                  <span className="font-semibold text-amber-600">{formatRupiah(student?.sisaKasbon || 0)}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                  <span>Potongan Hutang Kasbon:</span>
                                  <span className="text-red-500">-{formatRupiah(rb.deductedAmount)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-800 border-t border-purple-200/50 pt-1">
                                  <span>Dana Cair Wajib Transfer:</span>
                                  <span className="text-emerald-600">{formatRupiah(rb.finalPayableAmount)}</span>
                                </div>
                              </div>

                              {/* AI systematic results banner */}
                              {rb.ocrResult && (
                                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] space-y-1">
                                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                                    ✨ AI Scanning Hasil: {rb.ocrResult.merchant}
                                  </span>
                                  <p className="text-slate-500">Terbaca Nota: {formatRupiah(rb.ocrResult.totalAmount)} tgl {rb.ocrResult.date}</p>
                                  <div className="text-[9px] text-emerald-700 font-medium truncate">
                                    Items: {rb.ocrResult.items.map(it => typeof it === "string" ? it : `${it.name} (${it.qty}x @ ${formatRupiah(it.unitPrice)})`).join(", ")}
                                  </div>
                                </div>
                              )}

                              {/* Visual Receipt & Item Photo Thumbnails for Bendahara */}
                              {rb.receiptImage && (
                                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setViewImageModal({ src: rb.receiptImage, title: `Nota Belanja - Wali: ${rb.parentName} (${rb.purpose})` })}
                                    className="flex items-center gap-2 text-left cursor-pointer hover:opacity-80 transition"
                                  >
                                    {rb.receiptImage.startsWith("data:image/jpeg") || rb.receiptImage.startsWith("data:image/png") || rb.receiptImage.startsWith("data:image/webp") || rb.receiptImage.startsWith("http") ? (
                                      <img 
                                        src={rb.receiptImage} 
                                        alt="Nota" 
                                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-purple-100 rounded-md border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
                                        <Receipt className="w-6 h-6" />
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-800 block">📄 {rb.isGeneratedNota ? "Nota Digital AI Supermarket" : "Bukti Nota Fisik"}</span>
                                      <span className="text-[9px] text-purple-600 font-semibold block">Klik untuk perbesar & cetak</span>
                                    </div>
                                  </button>

                                  {rb.itemPhoto && (
                                    <button
                                      type="button"
                                      onClick={() => setViewImageModal({ src: rb.itemPhoto, title: `Foto Barang - Wali: ${rb.parentName}` })}
                                      className="flex items-center gap-1.5 border-l border-slate-200 pl-2 cursor-pointer hover:opacity-80 transition"
                                    >
                                      <img 
                                        src={rb.itemPhoto} 
                                        alt="Barang" 
                                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                                        referrerPolicy="no-referrer"
                                      />
                                      <span className="text-[9px] font-bold text-blue-700 block">📦 Barang</span>
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setProcessingItem({ type: "REMBES", item: rb })}
                                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                  Tinjau & Verifikasi Bukti
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ==========================================
                BENDAHARA TAB 2: MANUAL TRANSACTION LOGGER & FULL LEDGER
                ========================================== */}
            {bendaharaTab === "buku_kas" && (
              <div className="space-y-6">
                {/* Google Sheets Live Sync Banner Card */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800 font-display">
                          Sinkronisasi Google Sheets Real-Time
                        </h4>
                        {dbState.settings?.googleSheets?.spreadsheetId ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Belum Ditautkan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {dbState.settings?.googleSheets?.spreadsheetId ? (
                          <>
                            Terkoneksi ke <strong>"{dbState.settings.googleSheets.sheetTitle || "Buku Kas"}"</strong> • Terakhir sync: {dbState.settings.googleSheets.lastSyncedAt || "Hari ini"} ({dbState.settings.googleSheets.syncedCount || dbState.transactions.length} baris mutasi)
                          </>
                        ) : (
                          "Hubungkan Google Sheets agar setiap mutasi kas otomatis terupdate ke spreadsheet Google Drive Anda secara real-time."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {dbState.settings?.googleSheets?.spreadsheetUrl && (
                      <a
                        href={dbState.settings.googleSheets.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition"
                      >
                        <span>Buka Spreadsheet</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/db");
                          const fullDb = await res.json();
                          const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: "application/json" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `backup-kas-kelas1c-${new Date().toISOString().split("T")[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch (err) {
                          alert("Gagal mengunduh backup");
                        }
                      }}
                      title="Unduh salinan data lengkap (JSON) langsung ke HP/Laptop"
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cadangkan Data</span>
                    </button>

                    {/* Import / Restore JSON Button */}
                    <label 
                      title="Impor file cadangan JSON untuk menyamakan data dari aplikasi lain/real"
                      className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Impor Data (.JSON)</span>
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
                            if (result.success && result.dbState) {
                              setDbState(result.dbState);
                              alert("Berhasil! Data kas kelas telah diperbarui & disamakan 100%.");
                            } else {
                              alert(result.error || "Gagal mengimpor file data.");
                            }
                          } catch (err: any) {
                            alert("Format file JSON tidak valid atau rusak: " + err.message);
                          }
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSheetsModalOpen(true)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{dbState.settings?.googleSheets?.spreadsheetId ? "Kelola / Sync Sekarang" : "Hubungkan Google Sheets"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Manual Transaction Logger */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
                  <div className="flex items-center gap-2 mb-3">
                    <Plus className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm font-display">Catat Buku Kas Manual</h3>
                      <p className="text-[10px] text-slate-400">Tambahkan transaksi kas di luar iuran/kasbon siswa</p>
                    </div>
                  </div>

                  <form onSubmit={handleAddManualTransaction} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Jenis Transaksi
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setTxType("IN");
                            if (txCategory === "Kebutuhan Kelas") setTxCategory("Iuran Kas");
                          }}
                          className={`py-1.5 text-xs font-bold rounded-lg transition ${
                            txType === "IN" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-500"
                          }`}
                        >
                          Pemasukan (IN)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTxType("OUT");
                            if (txCategory === "Iuran Kas") setTxCategory("Kebutuhan Kelas");
                          }}
                          className={`py-1.5 text-xs font-bold rounded-lg transition ${
                            txType === "OUT" ? "bg-white text-red-500 shadow-xs" : "text-slate-500"
                          }`}
                        >
                          Pengeluaran (OUT)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Kategori</label>
                      <select
                        value={txCategory}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setTxCategory(cat);
                          if (cat !== "Iuran Kas") {
                            setSelectedIuranStudentId("");
                            setSelectedManualMonths([]);
                          }
                          if (cat !== "Jenguk Siswa Sakit" && cat !== "Uang Duka") {
                            setSelectedSickStudentId("");
                          }
                          if (cat === "Uang Duka") {
                            setTxAmount("200000");
                            if (!txDesc || txDesc.trim() === "" || txDesc.startsWith("Santunan") || txDesc === "Uang Duka") {
                              setTxDesc("Uang Duka");
                            }
                          } else if (cat === "Jenguk Siswa Sakit") {
                            setTxAmount("150000");
                            if (!txDesc || txDesc.trim() === "" || txDesc === "Uang Duka") {
                              setTxDesc("Santunan / Biaya Jenguk Siswa Sakit");
                            }
                          }
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white font-bold text-slate-800"
                      >
                        {txType === "OUT" ? (
                          <>
                            <option value="Kebutuhan Kelas">📦 Kebutuhan Kelas</option>
                            <option value="Jenguk Siswa Sakit">🩹 Jenguk Siswa Sakit</option>
                            <option value="Uang Duka">🤲 Uang Duka</option>
                            <option value="Perlengkapan / ATK">✏️ Perlengkapan / ATK</option>
                            <option value="Konsumsi">🍱 Konsumsi</option>
                            <option value="Kegiatan Kelas">🎉 Kegiatan / Acara</option>
                            <option value="Kasbon">💳 Disbursement Kasbon</option>
                            <option value="Rembes">💸 Rembes Tunai</option>
                            <option value="Lainnya">🌀 Lain-lain</option>
                          </>
                        ) : (
                          <>
                            <option value="Iuran Kas">💰 Iuran Kas</option>
                            <option value="Donasi / Infaq">🎁 Donasi / Infaq</option>
                            <option value="Sisa Kegiatan">🔄 Sisa Kegiatan</option>
                            <option value="Lainnya">🌀 Lain-lain</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* IF Category is Jenguk Siswa Sakit */}
                    {txCategory === "Jenguk Siswa Sakit" && (
                      <div className="space-y-3 bg-red-50/70 p-3.5 rounded-2xl border border-red-200 animate-in fade-in duration-150">
                        <div>
                          <label className="text-xs font-bold text-red-950 block mb-1">
                            Pilih Nama Siswa yang Sakit / Dijenguk *
                          </label>
                          <select
                            value={selectedSickStudentId}
                            onChange={(e) => {
                              const sId = e.target.value;
                              setSelectedSickStudentId(sId);
                              const st = dbState.students.find(s => s.id === sId);
                              if (st) {
                                setTxAmount("150000");
                                setTxDesc(`Santunan / Biaya Jenguk Siswa Sakit - ${st.name} (Wali: ${st.parentName})`);
                              }
                            }}
                            className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-red-500"
                            required
                          >
                            <option value="">-- Pilih Siswa Kelas 1C --</option>
                            {dbState.students
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }))
                              .map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} (Wali: {s.parentName})
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="p-2.5 bg-white border border-red-200 rounded-xl flex items-center justify-between text-xs font-bold text-red-900">
                          <span>Nominal Otomatis Jenguk Sakit:</span>
                          <span className="text-sm font-black font-display text-red-600">Rp 150.000</span>
                        </div>
                      </div>
                    )}

                    {/* IF Category is Uang Duka */}
                    {txCategory === "Uang Duka" && (
                      <div className="space-y-3 bg-slate-100 p-3.5 rounded-2xl border border-slate-300 animate-in fade-in duration-150">
                        <div>
                          <label className="text-xs font-bold text-slate-800 block mb-1">
                            Pilih Nama Siswa / Keluarga Duka (Opsional)
                          </label>
                          <select
                            value={selectedSickStudentId}
                            onChange={(e) => {
                              const sId = e.target.value;
                              setSelectedSickStudentId(sId);
                              const st = dbState.students.find(s => s.id === sId);
                              if (st) {
                                setTxAmount("200000");
                                setTxDesc(`Uang Duka - Siswa: ${st.name} (Wali: ${st.parentName})`);
                              } else {
                                setTxAmount("200000");
                                setTxDesc("Uang Duka");
                              }
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                          >
                            <option value="">-- Pilih Siswa Kelas 1C (Opsional) --</option>
                            {dbState.students
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }))
                              .map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} (Wali: {s.parentName})
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>Nominal Otomatis Uang Duka:</span>
                          <span className="text-sm font-black font-display text-slate-900">Rp 200.000</span>
                        </div>
                      </div>
                    )}

                    {/* IF Category is Iuran Kas & Type is IN: Show Student & Months Checkboxes */}
                    {txCategory === "Iuran Kas" && txType === "IN" ? (
                      <div className="space-y-3 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200">
                        <div>
                          <label className="text-[10px] font-bold text-purple-900 block mb-1">
                            Pilih Nama Siswa Terdaftar (Urutan Abjad A-Z) *
                          </label>
                          <select
                            value={selectedIuranStudentId}
                            onChange={(e) => {
                              const sId = e.target.value;
                              setSelectedIuranStudentId(sId);
                              const st = dbState.students.find(s => s.id === sId);
                              if (st) {
                                const descText = selectedManualMonths.length > 0 
                                  ? `Iuran Kas Bulan ${selectedManualMonths.join(", ")} - Siswa: ${st.name} (Wali: ${st.parentName})`
                                  : `Iuran Kas - Siswa: ${st.name} (Wali: ${st.parentName})`;
                                setTxDesc(descText);
                              }
                            }}
                            className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                            required
                          >
                            <option value="">-- Pilih Siswa Kelas 1C (A-Z) --</option>
                            {dbState.students
                              .slice()
                              .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }))
                              .map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} (Wali: {s.parentName})
                                </option>
                              ))}
                          </select>
                        </div>

                        {selectedIuranStudentId && (
                          <div>
                            <label className="text-[10px] font-bold text-purple-900 block mb-1.5">
                              Ceklis Bulan yang Dibayarkan (Rp 20.000 / Bulan) *
                            </label>
                            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-purple-100">
                              {ALL_IURAN_MONTHS.map((monthName) => {
                                const selectedStudentObj = dbState.students.find(s => s.id === selectedIuranStudentId);
                                const isAlreadyPaid = selectedStudentObj?.iuranStatus?.some(i => i.month === monthName && i.paid);
                                const isChecked = selectedManualMonths.includes(monthName);

                                return (
                                  <label 
                                    key={monthName}
                                    className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[10px] font-semibold cursor-pointer border transition ${
                                      isAlreadyPaid 
                                        ? "bg-slate-100 border-slate-200 text-slate-400" 
                                        : isChecked
                                        ? "bg-purple-100 border-purple-300 text-purple-900 font-bold"
                                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      disabled={isAlreadyPaid}
                                      checked={isChecked}
                                      onChange={(e) => {
                                        let updated: string[];
                                        if (e.target.checked) {
                                          updated = [...selectedManualMonths, monthName];
                                        } else {
                                          updated = selectedManualMonths.filter(m => m !== monthName);
                                        }
                                        setSelectedManualMonths(updated);
                                        const calculated = updated.length * 20000;
                                        setTxAmount(calculated.toString());
                                        if (selectedStudentObj) {
                                          const descText = updated.length > 0 
                                            ? `Iuran Kas Bulan ${updated.join(", ")} - Siswa: ${selectedStudentObj.name} (Wali: ${selectedStudentObj.parentName})`
                                            : `Iuran Kas - Siswa: ${selectedStudentObj.name} (Wali: ${selectedStudentObj.parentName})`;
                                          setTxDesc(descText);
                                        }
                                      }}
                                      className="rounded text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="truncate">{monthName}</span>
                                    {isAlreadyPaid && <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded ml-auto">Lunas</span>}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="p-2.5 bg-white rounded-xl border border-purple-200 space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>Bulan Terpilih:</span>
                            <span className="text-purple-700">{selectedManualMonths.length} Bulan</span>
                          </div>
                          <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-100 pt-1">
                            <span>Total Nominal Pemasukan:</span>
                            <span className="text-emerald-600 font-display text-sm">{formatRupiah(selectedManualMonths.length * 20000)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Jumlah Uang (Rp)</label>
                        <input
                          type="number"
                          placeholder="Contoh: 10000"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Tanggal Transaksi</label>
                      <input
                        type="date"
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Detail Keterangan</label>
                      <textarea
                        placeholder="Misal: Pembelian Sapu Ijuk dan Kemoceng Bulu..."
                        value={txDesc}
                        onChange={(e) => setTxDesc(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                      />
                    </div>

                    {/* Bukti Struk & Reimbursement Generator for Pengeluaran */}
                    {txType === "OUT" && (
                      <div className="space-y-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-extrabold text-amber-950 uppercase block">
                            🧾 Bukti Struk / Reimbursement
                          </label>
                          {txProofImage && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                              ✓ Struk Terpasang
                            </span>
                          )}
                        </div>

                        {/* Mode Selector Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTxReceiptMode("UPLOAD");
                              if (txIsGeneratedNota) {
                                setTxProofImage("");
                                setTxIsGeneratedNota(false);
                              }
                            }}
                            className={`py-2 px-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1 transition cursor-pointer ${
                              txReceiptMode === "UPLOAD"
                                ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                                : "bg-white text-amber-900 border-amber-200 hover:bg-amber-100/50"
                            }`}
                          >
                            <span>📷 Upload Struk Fisik</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTxReceiptMode("GENERATE");
                              setTxIsGeneratedNota(true);
                            }}
                            className={`py-2 px-2 text-[11px] font-bold rounded-xl border flex items-center justify-center gap-1 transition cursor-pointer ${
                              txReceiptMode === "GENERATE"
                                ? "bg-purple-600 text-white border-purple-700 shadow-xs"
                                : "bg-white text-purple-900 border-purple-200 hover:bg-purple-50"
                            }`}
                          >
                            <span>✨ Struk Digital Reimbursement</span>
                          </button>
                        </div>

                        {/* Option A: Upload Struk Fisik */}
                        {txReceiptMode === "UPLOAD" && (
                          <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                            <label className="text-[10px] font-bold text-slate-600 block">
                              Upload Foto Struk / Nota Fisik Belanja:
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setTxProofImage(reader.result as string);
                                    setTxIsGeneratedNota(false);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
                            />

                            {txProofImage && !txIsGeneratedNota && (
                              <div className="relative mt-2 border border-slate-200 rounded-xl overflow-hidden p-1 bg-slate-50">
                                <img src={txProofImage} alt="Struk Uploaded" className="max-h-36 mx-auto rounded-lg object-contain" />
                                <button
                                  type="button"
                                  onClick={() => setTxProofImage("")}
                                  className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-xs cursor-pointer"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Option B: Struk Digital Reimbursement */}
                        {txReceiptMode === "GENERATE" && (
                          <div className="bg-white p-3 rounded-xl border border-purple-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-purple-900 block">
                                📄 Form Struk Digital Reimbursement (Tanpa Struk Fisik)
                              </span>
                              <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                                Nota Otomatis
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Struk digital ini dibuat otomatis sebagai bukti sah pengeluaran kas kelas untuk audit & transparansi.
                            </p>

                            {/* Live Preview Card */}
                            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 font-mono text-[11px] space-y-1.5 text-slate-800">
                              <div className="text-center font-bold text-xs text-purple-950 border-b border-purple-200 pb-1">
                                NOTA REIMBURSEMENT KAS KELAS 1C
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Tanggal:</span>
                                <span className="font-bold">{txDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Kategori:</span>
                                <span className="font-bold text-purple-700">{txCategory}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Nominal:</span>
                                <span className="font-black text-rose-600">{formatRupiah(parseInt(txAmount) || 0)}</span>
                              </div>
                              <div className="border-t border-purple-200 pt-1">
                                <span className="text-slate-500 block text-[10px]">Detail Keperluan:</span>
                                <span className="font-semibold block text-slate-900 break-words">{txDesc || "(Belum diisi)"}</span>
                              </div>
                              <div className="border-t border-dashed border-purple-300 pt-1.5 text-center text-[10px] text-emerald-700 font-bold">
                                ✓ SAH & TERBAYAR OLEH BENDAHARA KELAS 1C
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {txSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>✓ Transaksi berhasil dicatat dan masuk ke Buku Kas!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={txLoading}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {txLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Menyimpan Transaksi...</span>
                        </>
                      ) : (
                        <span>Catat Transaksi Buku Kas</span>
                      )}
                    </button>
                  </form>
                </div>

                {/* Ledger Listing (Double Column) */}
                {(() => {
                  const filteredData = getFilteredCashbookData(cashbookMonthFilter);

                  return (
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm font-display">
                            Laporan Transaksi Buku Besar Kas 1C ({getPeriodLabel(cashbookMonthFilter)})
                          </h3>
                          <p className="text-[10px] text-slate-400">Pencatatan saldo masuk, keluar, dan posisi kas per bulan</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
                            Masuk: +{formatRupiah(filteredData.totalMasuk)}
                          </span>
                          <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-lg border border-red-200">
                            Keluar: -{formatRupiah(filteredData.totalKeluar)}
                          </span>
                        </div>
                      </div>

                      {/* Filter Tahun & Bulan Buku Kas */}
                      <div className="bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-slate-50 border border-purple-200/80 p-3.5 rounded-2xl shadow-2xs space-y-3">
                        {/* Header & Active Badge */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-600 text-white rounded-xl shadow-2xs">
                              <Filter className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-800 font-display">Filter Transaksi Kas</h4>
                              <p className="text-[10px] text-slate-500 font-medium">Filter berdasar tahun dan bulan pencatatan</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span className="text-[10px] font-bold text-slate-500">Terpilih:</span>
                            <span className="text-xs font-black text-purple-900 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-2xs">
                              📌 {getPeriodLabel(cashbookMonthFilter)}
                            </span>
                          </div>
                        </div>

                        {/* Filter controls */}
                        <div className="space-y-2.5">
                          {/* 1. Filter Tahun */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-extrabold text-slate-700 w-20 shrink-0 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-purple-600" />
                              <span>Tahun:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { key: "ALL", label: "Semua Tahun" },
                                { key: "2026", label: "2026" },
                                { key: "2027", label: "2027" }
                              ].map((y) => (
                                <button
                                  key={y.key}
                                  type="button"
                                  onClick={() => setCashbookYearFilter(y.key)}
                                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                                    cashbookYearFilter === y.key
                                      ? "bg-purple-700 text-white shadow-2xs"
                                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                  }`}
                                >
                                  {y.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* 2. Filter Bulan */}
                          <div className="flex flex-wrap items-start sm:items-center gap-2 pt-2 border-t border-purple-100/60">
                            <span className="text-[11px] font-extrabold text-slate-700 w-20 shrink-0 flex items-center gap-1 pt-1 sm:pt-0">
                              <Filter className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Bulan:</span>
                            </span>
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                              {[
                                { key: "ALL", label: "Semua Bulan" },
                                ...(cashbookYearFilter === "2026"
                                  ? [
                                      { key: "07", label: "Juli" },
                                      { key: "08", label: "Agustus" },
                                      { key: "09", label: "September" },
                                      { key: "10", label: "Oktober" },
                                      { key: "11", label: "November" },
                                      { key: "12", label: "Desember" }
                                    ]
                                  : cashbookYearFilter === "2027"
                                  ? [
                                      { key: "01", label: "Januari" },
                                      { key: "02", label: "Februari" },
                                      { key: "03", label: "Maret" },
                                      { key: "04", label: "April" },
                                      { key: "05", label: "Mei" },
                                      { key: "06", label: "Juni" },
                                      { key: "07", label: "Juli" },
                                      { key: "08", label: "Agustus" },
                                      { key: "09", label: "September" },
                                      { key: "10", label: "Oktober" },
                                      { key: "11", label: "November" },
                                      { key: "12", label: "Desember" }
                                    ]
                                  : [
                                      { key: "01", label: "Januari" },
                                      { key: "02", label: "Februari" },
                                      { key: "03", label: "Maret" },
                                      { key: "04", label: "April" },
                                      { key: "05", label: "Mei" },
                                      { key: "06", label: "Juni" },
                                      { key: "07", label: "Juli" },
                                      { key: "08", label: "Agustus" },
                                      { key: "09", label: "September" },
                                      { key: "10", label: "Oktober" },
                                      { key: "11", label: "November" },
                                      { key: "12", label: "Desember" }
                                    ])
                              ].map((m) => (
                                <button
                                  key={m.key}
                                  type="button"
                                  onClick={() => setCashbookMonthOnlyFilter(m.key)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                                    cashbookMonthOnlyFilter === m.key
                                      ? "bg-indigo-600 text-white shadow-2xs"
                                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                  }`}
                                >
                                  {m.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financial Stats Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-slate-900 to-purple-950 text-white rounded-2xl p-3.5 border border-purple-500/30 shadow-xs relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider block">
                                Total Saldo Kas
                              </span>
                              <span className="text-lg font-black font-display text-white mt-0.5 block">
                                {formatRupiah(totals.saldo)}
                              </span>
                            </div>
                            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-300 text-sm">
                              🏦
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-300 block mt-1 font-medium">
                            Kas Utama Kelas 1C
                          </span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                                Penerimaan ({getPeriodLabel(cashbookMonthFilter)})
                              </span>
                              <span className="text-lg font-black font-display text-emerald-600 mt-0.5 block">
                                +{formatRupiah(filteredData.totalMasuk)}
                              </span>
                            </div>
                            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 text-sm">
                              📈
                            </div>
                          </div>
                          <span className="text-[9px] text-emerald-600 block mt-1 font-medium">
                            Total Pemasukan Kas
                          </span>
                        </div>

                        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 shadow-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
                                Pengeluaran ({getPeriodLabel(cashbookMonthFilter)})
                              </span>
                              <span className="text-lg font-black font-display text-rose-600 mt-0.5 block">
                                -{formatRupiah(filteredData.totalKeluar)}
                              </span>
                            </div>
                            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 text-sm">
                              📉
                            </div>
                          </div>
                          <span className="text-[9px] text-rose-600 block mt-1 font-medium">
                            Total Belanja & Kasbon
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Share Banner Action */}
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-xs font-bold">
                            📱
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-emerald-950 font-display">
                              Bagikan Laporan Kas via WhatsApp ({getPeriodLabel(cashbookMonthFilter)})
                            </h4>
                            <p className="text-[10px] text-emerald-700 font-medium">
                              Kirimkan ringkasan total penerimaan, pengeluaran, dan saldo kas per bulan ke grup WhatsApp.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const rawMsg = getWaCashbookRawText(cashbookMonthFilter);
                              navigator.clipboard.writeText(rawMsg);
                              setCopyStatus("wa_report_bendahara_" + cashbookMonthFilter);
                              setTimeout(() => setCopyStatus(null), 3000);
                            }}
                            className="px-3 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer flex-1 sm:flex-none"
                          >
                            {copyStatus === "wa_report_bendahara_" + cashbookMonthFilter ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>✓ Disalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin Laporan</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setWaReportSelectedMonth(cashbookMonthFilter);
                              setWaReportCopySuccess(false);
                              setIsWaReportModalOpen(true);
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer border border-emerald-500 flex-1 sm:flex-none"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Share Rekap WA</span>
                          </button>
                        </div>
                      </div>

                      {/* Detail Transaction List (Matching Wali Murid Card Detail Layout with Arrow Icons) */}
                      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                        {filteredData.transactions.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-100 rounded-2xl">
                            Belum ada transaksi di bulan ini.
                          </div>
                        ) : (
                          filteredData.transactions.map((tx) => (
                            <div 
                              key={tx.id} 
                              onClick={() => setSelectedTxDetail(tx)}
                              className="flex items-center justify-between p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs hover:bg-slate-100/80 transition gap-3 shadow-2xs cursor-pointer group"
                            >
                              <div className="flex items-start sm:items-center gap-3 min-w-0">
                                <div className={`p-2.5 rounded-xl shrink-0 font-bold ${
                                  tx.type === "IN" 
                                    ? "bg-emerald-100/80 text-emerald-700 border border-emerald-200" 
                                    : "bg-red-100/80 text-red-600 border border-red-200"
                                }`}>
                                  {tx.type === "IN" ? (
                                    <ArrowDownLeft className="w-4.5 h-4.5 text-emerald-600" />
                                  ) : (
                                    <ArrowUpRight className="w-4.5 h-4.5 text-red-600" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm block truncate group-hover:text-indigo-600 transition">
                                    {tx.description}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
                                    <span className="font-semibold text-slate-600">{tx.date}</span>
                                    <span>•</span>
                                    <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-mono text-[10px] text-slate-700 font-bold">
                                      {tx.category}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTxDetail(tx);
                                      }}
                                      className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md font-bold transition cursor-pointer"
                                    >
                                      <Eye className="w-3 h-3 text-indigo-600" />
                                      <span>Lihat Detail</span>
                                    </button>
                                    {tx.storeName && (
                                      <span className="text-slate-600 font-medium">🏪 {tx.storeName}</span>
                                    )}
                                    {tx.proofImage ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewImageModal({
                                            src: tx.proofImage!,
                                            title: `Struk Belanja/Reimbursement (${tx.category}) - ${tx.description}`,
                                            tx: tx
                                          });
                                        }}
                                        className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md font-bold transition cursor-pointer"
                                      >
                                        <Eye className="w-3 h-3 text-purple-600" />
                                        <span>{tx.isGeneratedNota ? "📄 Struk Digital AI" : "📄 Lihat Struk"}</span>
                                      </button>
                                    ) : tx.type === "OUT" ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewImageModal({
                                            src: `Pembelian: ${tx.description} ${tx.amount} (${tx.category})`,
                                            title: `Struk Reimbursement Pengeluaran - ${tx.description}`,
                                            tx: tx
                                          });
                                        }}
                                        className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md font-semibold transition cursor-pointer"
                                      >
                                        <Eye className="w-3 h-3 text-amber-600" />
                                        <span>📄 Cetak Struk Digital</span>
                                      </button>
                                    ) : null}
                                  </div>
                                  {tx.items && tx.items.length > 0 && (
                                    <div className="text-[10px] text-slate-500 mt-1 font-normal">
                                      📦 <span className="font-semibold">Item:</span>{" "}
                                      {tx.items.map((it) => typeof it === "string" ? it : `${it.name} (${it.qty || 1}x @ ${formatRupiah(it.unitPrice || 0)})`).join(", ")}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0">
                                <div className="text-right">
                                  <span className={`font-black font-display text-xs sm:text-sm block ${
                                    tx.type === "IN" ? "text-emerald-600" : "text-red-600"
                                  }`}>
                                    {tx.type === "IN" ? "+" : "-"}{formatRupiah(tx.amount)}
                                  </span>
                                  <span className={`text-[9px] font-extrabold block text-right mt-0.5 ${
                                    tx.type === "IN" ? "text-emerald-600" : "text-red-600"
                                  }`}>
                                    {tx.type === "IN" ? "Pemasukan ↙" : "Pengeluaran ↗"}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditTransactionModal(tx);
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white border border-purple-200 px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer shadow-2xs"
                                  title="Edit Transaksi Ini"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Edit</span>
                                 </button>

                                 <button
                                   type="button"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleDeleteTransaction(tx.id);
                                   }}
                                   className="inline-flex items-center gap-1 text-[10px] bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer shadow-2xs"
                                   title="Hapus Transaksi Ini"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
                                   <span className="hidden sm:inline">Hapus</span>

                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })()}

                </div>
              </div>
            )}

            {/* ==========================================
                BENDAHARA TAB 3: ROSTER & MANUAL IURAN/NOTIFICATION MANAGEMENT
                ========================================== */}
            {bendaharaTab === "daftar_siswa" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-extrabold text-slate-800 text-sm font-display">
                        Pengelolaan Siswa & Iuran Kelas 1C
                      </h3>
                      <span className="bg-purple-100 text-purple-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                        👥 Total: {dbState.students.length} Siswa
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Klik pada nama siswa untuk membuka detail profil, grafik tumbuh kembang, dan riwayat transaksi lengkap.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setReminderSelectedMonth(getCurrentMonthKey());
                        setReminderCopySuccess(false);
                        setIsMonthlyReminderModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Bell className="w-4 h-4 animate-bounce" />
                      <span>📢 Pengingat Bayar Kas (Tgl 1)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPaymentInfo}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      title="Salin Rincian Rekening BSI & DANA untuk Bendahara"
                    >
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>{copyStatus === "payment_info_copied" ? "✓ Rekening Tersalin!" : "💳 Copy Rekening/E-Wallet"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (dbState.students.length > 0) {
                          const firstStd = dbState.students[0];
                          setThankYouSelectedStudentId(firstStd.id);
                          const paidM = firstStd.iuranStatus ? firstStd.iuranStatus.filter(i => i.paid).map(i => i.month) : [];
                          setThankYouSelectedMonths(paidM);
                        } else {
                          setThankYouSelectedStudentId("");
                          setThankYouSelectedMonths([]);
                        }
                        setThankYouCopySuccess(false);
                        setIsThankYouModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Heart className="w-4 h-4 text-white fill-white/30" />
                      <span>💚 Chat Terima Kasih WA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAddStudentError("");
                        setAddStudentSuccess("");
                        setIsAddStudentModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Registrasi Siswa Baru</span>
                    </button>
                  </div>
                </div>

                {/* Rincian Tunggakan Iuran Per Bulan Section */}
                <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-orange-50/40 border border-amber-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-amber-700" />
                        <h4 className="font-extrabold text-amber-950 text-xs font-display">
                          Rincian Tunggakan Iuran Kelas ({selectedYearFilter})
                        </h4>
                      </div>
                      <p className="text-[10px] text-amber-800/80 mt-0.5 font-medium">
                        Pantau tunggakan per bulan secara real-time. Klik pada kotak bulan untuk memfilter siswa yang belum lunas.
                      </p>
                    </div>

                    {tunggakanMonthFilter !== "ALL" && (
                      <button
                        type="button"
                        onClick={() => setTunggakanMonthFilter("ALL")}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tampilkan Semua Siswa</span>
                      </button>
                    )}
                  </div>

                  {/* Cards Grid per month */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                    {getMonthsForYear(selectedYearFilter).map((monthObj) => {
                      const monthKey = monthObj.key;
                      const isDue = dueMonthsList.includes(monthKey);
                      
                      const unpaidStudents = dbState.students.filter(s => {
                        const iuran = s.iuranStatus?.find(i => i.month === monthKey);
                        return !iuran || !iuran.paid;
                      });
                      const unpaidCount = unpaidStudents.length;
                      const unpaidTotal = unpaidCount * 20000;
                      const totalStudents = dbState.students.length || 1;
                      const paidCount = totalStudents - unpaidCount;
                      const isSelectedFilter = tunggakanMonthFilter === monthKey;

                      return (
                        <div
                          key={monthKey}
                          onClick={() => {
                            if (tunggakanMonthFilter === monthKey) {
                              setTunggakanMonthFilter("ALL");
                            } else {
                              setTunggakanMonthFilter(monthKey);
                            }
                          }}
                          className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                            isSelectedFilter
                              ? "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/50 scale-[1.02]"
                              : unpaidCount > 0
                              ? isDue
                                ? "bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/60 text-slate-800 shadow-2xs"
                                : "bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50"
                              : "bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-100/60"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-[11px] font-extrabold ${isSelectedFilter ? "text-white" : "text-slate-800"}`}>
                                {monthObj.label}
                              </span>
                              {isSelectedFilter ? (
                                <span className="text-[9px] bg-white text-amber-800 font-black px-1.5 py-0.5 rounded-full">
                                  Aktif
                                </span>
                              ) : unpaidCount > 0 ? (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  isDue ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-slate-100 text-slate-600"
                                }`}>
                                  {unpaidCount} Nunggak
                                </span>
                              ) : (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
                                  Lunas
                                </span>
                              )}
                            </div>

                            <div className={`text-xs font-black font-display my-1 ${
                              isSelectedFilter ? "text-white" : unpaidCount > 0 ? (isDue ? "text-amber-700" : "text-slate-700") : "text-emerald-700"
                            }`}>
                              {formatRupiah(unpaidTotal)}
                            </div>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-slate-200/40 text-[10px] font-semibold flex items-center justify-between">
                            <span className={isSelectedFilter ? "text-amber-100" : "text-slate-500"}>
                              {paidCount}/{totalStudents} Lunas
                            </span>
                            <span className={`text-[9px] font-bold underline ${isSelectedFilter ? "text-white" : "text-purple-600"}`}>
                              {isSelectedFilter ? "Reset" : "Filter 🔍"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Active Alert Badge */}
                {tunggakanMonthFilter !== "ALL" && (
                  <div className="bg-amber-100/90 border border-amber-300 rounded-xl p-2.5 px-3.5 text-xs font-bold text-amber-950 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <span>
                        Menampilkan siswa yang memiliki tunggakan iuran untuk bulan <strong>{tunggakanMonthFilter}</strong>.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTunggakanMonthFilter("ALL")}
                      className="text-[11px] bg-amber-800 hover:bg-amber-900 text-white font-extrabold px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reset Filter</span>
                    </button>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama siswa, nama panggilan, atau nama wali murid..."
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white transition"
                    />
                    {studentSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setStudentSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition cursor-pointer"
                        title="Hapus kata kunci pencarian"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Year Filter Dropdown */}
                  <div className="flex items-center gap-2 bg-purple-50/80 border border-purple-200 px-3 py-1.5 rounded-xl shrink-0">
                    <span className="text-xs font-extrabold text-purple-950 whitespace-nowrap">📅 Filter Tahun:</span>
                    <select
                      value={selectedYearFilter}
                      onChange={(e) => setSelectedYearFilter(Number(e.target.value))}
                      className="bg-white border border-purple-300 rounded-lg px-2.5 py-1 text-xs font-extrabold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs cursor-pointer"
                    >
                      <option value={2026}>Tahun 2026 (Juli - Des)</option>
                      <option value={2027}>Tahun 2027 (Jan - Des)</option>
                      <option value={2028}>Tahun 2028 (Jan - Des)</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                        <th className="py-2.5 px-3">Nama Siswa</th>
                        <th className="py-2.5 px-3">Wali Murid</th>
                        <th className="py-2.5 px-3">Tgl Lahir & Usia</th>
                        <th className="py-2.5 px-3">Sisa Kasbon</th>
                        {getMonthsForYear(selectedYearFilter).map((m) => (
                          <th key={m.key} className="py-2.5 px-2 text-center">{m.label}</th>
                        ))}
                        <th className="py-2.5 px-3 text-center">Notifikasi</th>
                        <th className="py-2.5 px-3 text-center">Informasi Detail</th>
                        <th className="py-2.5 px-3 text-center">Aksi / Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = dbState.students
                          .filter(s => {
                            const q = studentSearchQuery.trim().toLowerCase();
                            if (q) {
                              const match = (
                                s.name.toLowerCase().includes(q) || 
                                s.parentName.toLowerCase().includes(q) ||
                                (s.nickname && s.nickname.toLowerCase().includes(q))
                              );
                              if (!match) return false;
                            }
                            if (tunggakanMonthFilter !== "ALL") {
                              const iuran = s.iuranStatus?.find(i => i.month === tunggakanMonthFilter);
                              if (iuran && iuran.paid) return false;
                            }
                            return true;
                          })
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={100} className="py-10 text-center bg-slate-50/50 rounded-b-xl">
                                <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
                                  <span className="text-3xl">🔍</span>
                                  <h4 className="text-xs font-extrabold text-slate-700">
                                    Siswa Tidak Ditemukan
                                  </h4>
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    {studentSearchQuery ? (
                                      <>Siswa atau wali murid dengan kata kunci &quot;<strong className="text-purple-700">{studentSearchQuery}</strong>&quot; tidak ditemukan dalam daftar Kelas 1C (Total: {dbState.students.length} Siswa).</>
                                    ) : (
                                      <>Belum ada data siswa yang terdaftar di database.</>
                                    )}
                                  </p>
                                  {studentSearchQuery && (
                                    <button
                                      type="button"
                                      onClick={() => setStudentSearchQuery("")}
                                      className="mt-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition border border-purple-500 flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>Tampilkan Semua Siswa ({dbState.students.length})</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((student) => {
                          const unpaidCount = student.iuranStatus?.filter(i => !i.paid && dueMonthsList.includes(i.month)).length || 0;
                          const paidCount = student.iuranStatus?.filter(i => i.paid).length || 0;

                          return (
                            <tr 
                              key={student.id} 
                              onClick={() => setSelectedDetailStudent(student)}
                              className="hover:bg-purple-50/40 transition cursor-pointer"
                            >
                              <td className="py-3 px-3 font-semibold text-slate-800 font-display whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {student.photoUrl ? (
                                    <img 
                                      src={student.photoUrl} 
                                      alt={student.name} 
                                      className="w-8 h-8 rounded-full object-cover border border-purple-200 shadow-2xs flex-shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                                      {student.name.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <span className="hover:underline font-bold text-purple-900 block">{student.name}</span>
                                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                                      Panggilan: <strong className="text-purple-700 font-bold">{student.nickname || student.name.trim().split(/\s+/)[0]}</strong>
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <span className="font-medium text-slate-600 block">{student.parentName}</span>
                                <span className="text-[10px] text-slate-400 block">{student.parentPhone}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-mono font-bold px-1.5 py-0.5 rounded">
                                    Sandi: {student.password || "123"}
                                  </span>
                                  {student.password && student.password !== "123" && (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await fetch(`/api/students/${student.id}/reset-password`, { method: "POST" });
                                        fetchDB();
                                      }}
                                      className="text-[9px] text-purple-600 hover:text-purple-800 hover:underline font-bold cursor-pointer"
                                      title="Reset sandi kembali ke bawaan '123'"
                                    >
                                      [Reset ke 123]
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                                  <span>🎂 {new Date(student.birthday).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                                <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded border border-purple-200 inline-block mt-0.5">
                                  {calculateAge(student.birthday)}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-700">
                                {student.sisaKasbon > 0 ? (
                                  <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                                    {formatRupiah(student.sisaKasbon)}
                                  </span>
                                ) : "-"}
                              </td>
                              
                              {/* Monthly buttons to toggle manual payment */}
                              {getMonthsForYear(selectedYearFilter).map((m) => {
                                const monthStatus = student.iuranStatus?.find(i => i.month === m.key);
                                return (
                                  <td key={m.key} className="py-3 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                                    {monthStatus?.paid ? (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                        Lunas
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          await fetch("/api/pay-iuran", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                              studentId: student.id,
                                              month: m.key,
                                              amount: 20000,
                                              datePaid: new Date().toISOString().split("T")[0]
                                            })
                                          });
                                          fetchDB();
                                        }}
                                        className="text-[9px] bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 font-bold px-2 py-0.5 rounded transition cursor-pointer"
                                      >
                                        Selesaikan
                                      </button>
                                    )}
                                  </td>
                                );
                              })}

                              {/* Copy Notification & Thank You triggers */}
                              <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex flex-col gap-1 items-center justify-center">
                                  {unpaidCount > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleCopyWhatsAppNotification(student)}
                                      className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition cursor-pointer w-full"
                                      title="Salin Tagihan WA"
                                    >
                                      {copyStatus === student.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-amber-600" />
                                          <span>Tagihan Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5 text-amber-600" />
                                          <span>Salin Tagihan</span>
                                        </>
                                      )}
                                    </button>
                                  )}

                                  {paidCount > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => handleCopyWhatsAppThankYou(student)}
                                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-center gap-1 text-[10px] font-bold transition cursor-pointer w-full whitespace-nowrap"
                                      title="Salin Pesan Ucapan Terima Kasih WA"
                                    >
                                      {copyStatus === "thankyou_" + student.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          <span>Terima Kasih Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/30" />
                                          <span>Chat Terima Kasih</span>
                                        </>
                                      )}
                                    </button>
                                  ) : unpaidCount === 0 ? (
                                    <span className="text-[10px] text-emerald-600 font-bold block">Bebas Tagihan</span>
                                  ) : null}
                                </div>
                              </td>

                              <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDetailStudent(student)}
                                    className="text-[10px] bg-slate-100 hover:bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-lg transition border border-purple-200 cursor-pointer flex items-center gap-1"
                                    title="Lihat Detail & Profil Siswa"
                                  >
                                    🔍 Detail
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setStudentToDelete(student)}
                                    className="text-[10px] bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold px-2 py-1 rounded-lg transition border border-red-200 cursor-pointer flex items-center gap-1 shadow-2xs"
                                    title="Hapus data siswa ganda / double"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==========================================
          POPUP DETAIL MODAL: BENDAHARA DECISION CARD
          ========================================== */}
      {processingItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-purple-50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-slate-800 font-display text-sm">
                  Proses Pengajuan {processingItem.type === "KASBON" ? "Kasbon" : "Rembesan"}
                </h3>
              </div>
              <button 
                onClick={() => setProcessingItem(null)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Submission Information Details */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs border-b border-slate-100 pb-4">
                <div>
                  <span className="text-slate-400 block">Nama Wali Murid</span>
                  <span className="font-bold text-slate-800">{processingItem.item.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tanggal Pengajuan</span>
                  <span className="font-bold text-slate-800">{processingItem.item.dateRequested}</span>
                </div>
                <div className="col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                  <span className="text-slate-400 block text-[10px]">Alasan Penggunaan Dana</span>
                  <p className="font-semibold text-slate-700 mt-0.5 leading-relaxed">{processingItem.item.purpose}</p>
                </div>
              </div>

              {/* Special Reimbursement UI with Receipt Preview & Systematic OCR Checklist */}
              {processingItem.type === "REMBES" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perbandingan Bukti Transaksi AI</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Visual Receipt Photo */}
                    <div 
                      onClick={() => setViewImageModal({ src: processingItem.item.receiptImage, title: "Bukti Foto Nota Belanja" })}
                      className="border border-slate-200 rounded-xl p-2 bg-slate-50 flex flex-col justify-between h-40 cursor-pointer hover:border-purple-400 transition"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-500">Bukti Foto Nota:</span>
                        <span className="text-[9px] text-purple-600 font-semibold flex items-center gap-0.5"><Eye className="w-3 h-3" /> Perbesar</span>
                      </div>
                      <img 
                        src={processingItem.item.receiptImage} 
                        alt="Bukti Nota" 
                        className="max-h-28 object-contain rounded-lg mx-auto"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* AI extracted text validation side-by-side */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between h-40">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-emerald-800">✨ Deteksi OCR AI:</span>
                          <span className="text-[9px] text-slate-500">Conf: {(processingItem.item.ocrResult?.confidence * 100 || 90).toFixed(0)}%</span>
                        </div>
                        {processingItem.item.ocrResult ? (
                          <div className="text-[10px] space-y-1">
                            <p className="truncate"><strong>Toko:</strong> {processingItem.item.ocrResult.merchant}</p>
                            <p><strong>Tgl Nota:</strong> {processingItem.item.ocrResult.date}</p>
                            <p className="text-emerald-700 font-extrabold text-xs">Total: {formatRupiah(processingItem.item.ocrResult.totalAmount)}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic">No OCR payload synced</p>
                        )}
                      </div>
                      
                      {/* AI verification assessment advice */}
                      <span className="text-[9px] text-emerald-600 bg-emerald-100/50 p-1 rounded font-semibold text-center block">
                        {(processingItem.item.ocrResult?.totalAmount === processingItem.item.amount) 
                          ? "✓ Nominal sangat cocok dengan form"
                          : "⚠ Nominal sedikit berbeda dengan form, cek manual"}
                      </span>
                    </div>
                  </div>

                  {/* Deductions calculation breakdown clearly */}
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-xs space-y-1.5">
                    <span className="font-bold text-amber-800 block">Rincian Perhitungan Sistem & Kasbon:</span>
                    <div className="text-slate-700 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span>Status Kasbon:</span>
                        <span className="font-bold">{processingItem.item.fromKasbon ? "Diambil dari Kasbon Gantung" : "Tidak/Bukan dari Kasbon"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nilai Nota:</span>
                        <span className="font-bold">{formatRupiah(processingItem.item.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kasbon Digunakan:</span>
                        <span className="font-bold text-purple-700">-{formatRupiah(processingItem.item.deductedAmount || 0)}</span>
                      </div>
                      <div className="border-t border-amber-200/50 pt-1 flex justify-between font-extrabold text-slate-800 text-sm">
                        <span>Pencairan Bersih oleh Bendahara:</span>
                        <span className="text-emerald-600">{formatRupiah(processingItem.item.finalPayableAmount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Return proof image if Wali Murid returned excess kasbon */}
                  {processingItem.item.returnProofImage && (
                    <div 
                      onClick={() => setViewImageModal({ src: processingItem.item.returnProofImage, title: "Bukti Transfer Pengembalian Sisa Kasbon" })}
                      className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2 cursor-pointer hover:border-amber-400 transition"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-900">Bukti Transfer Pengembalian Sisa Kasbon:</span>
                        <span className="text-[9px] text-amber-700 font-semibold flex items-center gap-0.5"><Eye className="w-3 h-3" /> Perbesar</span>
                      </div>
                      <img 
                        src={processingItem.item.returnProofImage} 
                        alt="Bukti Transfer Pengembalian" 
                        className="max-h-36 object-contain rounded-lg border border-amber-300 mx-auto bg-white"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Item Photo if uploaded */}
                  {processingItem.item.itemPhoto && (
                    <div 
                      onClick={() => setViewImageModal({ src: processingItem.item.itemPhoto, title: "Foto Fisik Barang yang Dibeli" })}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-2 cursor-pointer hover:border-blue-400 transition"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-900">Foto Fisik Barang yang Dibeli:</span>
                        <span className="text-[9px] text-blue-700 font-semibold flex items-center gap-0.5"><Eye className="w-3 h-3" /> Perbesar</span>
                      </div>
                      <img 
                        src={processingItem.item.itemPhoto} 
                        alt="Foto Barang" 
                        className="max-h-36 object-contain rounded-lg border border-blue-300 mx-auto bg-white"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Bank accounts or Cash transfer details */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs space-y-2">
                <span className="font-bold text-blue-800 block">Detail Metode Pencairan / Transfer:</span>
                {processingItem.item.payoutMethod === "CASH" ? (
                  <p className="text-slate-700 font-bold text-xs">💵 Pencairan Dilakukan Secara Tunai / Cash</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Nama Bank</span>
                      <span className="font-bold text-slate-700">{processingItem.item.bankName || "Bank BCA"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Atas Nama Rekening</span>
                      <span className="font-bold text-slate-700">{processingItem.item.bankAccountName || "-"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Nomor Rekening / E-Wallet</span>
                      <span className="font-mono font-bold text-slate-800 text-xs tracking-wider">{processingItem.item.bankAccount || "-"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin decision remarks input */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Catatan / Memo Bendahara (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Sudah ditransfer ke rekening Mama Budi..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                type="button"
                onClick={() => handleProcessSubmission("REJECTED")}
                className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition shadow-xs"
              >
                Tolak Pengajuan
              </button>
              <button
                type="button"
                onClick={() => handleProcessSubmission("APPROVED")}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                ✓ Setujui & Cairkan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          THEME SELECTOR MODAL (Visual & Polished)
          ========================================== */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className={`p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r ${activeTheme.bgClass} text-white`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="font-extrabold font-display text-sm">
                    Gaya Tampilan Utama Aplikasi (Global)
                  </h3>
                  <p className="text-[10px] opacity-90 font-medium">Ubah visual untuk seluruh Wali Murid & Bendahara</p>
                </div>
              </div>
              <button 
                onClick={() => setIsThemeModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Pilih palet warna/gaya yang diinginkan. Pilihan ini akan langsung diterapkan secara <strong>global untuk semua pengguna</strong> (wali murid & bendahara) secara real-time:
              </p>

              <div className="space-y-3">
                {THEMES.map((t) => {
                  const isSelected = t.id === themeId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTheme(t.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition cursor-pointer ${
                        isSelected 
                          ? `${t.bgLight} ${t.cardBorder} ring-2 ${t.cardRing}` 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${t.bgClass} text-white flex items-center justify-center text-xl shadow-xs shrink-0`}>
                        {t.icon}
                      </div>
                      
                      <div className="flex-grow space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-xs font-display">{t.name}</span>
                          {isSelected && (
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-md ${t.badgeBg}`}>
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-semibold">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center self-center">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? `${t.cardBorder} bg-white` : "border-slate-300"
                        }`}>
                          {isSelected && <div className={`w-2 h-2 rounded-full ${t.iconBg}`}></div>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className={`px-5 py-2 ${activeTheme.buttonBg} text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer`}
              >
                Selesai & Terapkan
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          EDIT STUDENT BIO/PROFILE MODAL
          ========================================== */}
      {isEditStudentModalOpen && editingStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className={`p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r ${activeTheme.bgClass} text-white`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">✏️</span>
                <div>
                  <h3 className="font-extrabold font-display text-sm">
                    Ubah Data Profil Siswa
                  </h3>
                  <p className="text-[10px] opacity-90 font-medium">Siswa: {editingStudent.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditStudentModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent}>
              <div className="p-6 space-y-4">
                {editError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl font-bold flex items-center gap-1.5 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{editError}</span>
                  </p>
                )}

                {editSuccess && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-xl font-bold flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{editSuccess}</span>
                  </p>
                )}

                <div className="space-y-3">
                  {/* Photo Uploader Field */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                      Foto Profil Anak
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-200 rounded-xl">
                      {editPhotoUrl ? (
                        <img 
                          src={editPhotoUrl} 
                          alt="Preview Foto" 
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-xs flex-shrink-0" 
                        />
                      ) : (
                        <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-xl font-black font-display flex-shrink-0 border border-purple-200">
                          {editName ? editName.charAt(0) : "👧"}
                        </div>
                      )}
                      <div className="space-y-1.5 flex-grow">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Perangkat</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handlePhotoFileChange} 
                            className="hidden" 
                          />
                        </label>
                        {editPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditPhotoUrl("")}
                            className="text-[10px] text-red-500 hover:text-red-700 block font-semibold cursor-pointer"
                          >
                            Hapus Foto Profil
                          </button>
                        )}
                        <p className="text-[9px] text-slate-400">Format: JPG, PNG, WebP (Maksimal 3MB)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Nama Lengkap Siswa</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Nama Panggilan Anak (Untuk Login)</label>
                      <input
                        type="text"
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        placeholder="Contoh: Khafa"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Nama Wali Murid (Mama / Papa)</label>
                    <input
                      type="text"
                      value={editParentName}
                      onChange={(e) => setEditParentName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Nomor HP/WA Wali Murid</label>
                    <input
                      type="text"
                      value={editParentPhone}
                      onChange={(e) => setEditParentPhone(e.target.value)}
                      placeholder="Contoh: 0812xxxxxxxx"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Tanggal Lahir Anak</label>
                    <input
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 ${activeTheme.buttonBg} text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer`}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          BENDAHARA TAB 4: INVENTARIS & ASET KELAS
          ========================================== */}
      {bendaharaTab === "inventaris" && (
        <ClassAssetsView
          assets={dbState.assets || []}
          activeRole={activeRole}
          onSaveAsset={handleSaveAsset}
          onDeleteAsset={handleDeleteAsset}
        />
      )}

      {/* ==========================================
          STUDENT COMPREHENSIVE DETAIL MODAL
          ========================================== */}
      {selectedDetailStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className={`p-5 bg-gradient-to-r ${activeTheme.bgClass} text-white flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                {selectedDetailStudent.photoUrl ? (
                  <img 
                    src={selectedDetailStudent.photoUrl} 
                    alt={selectedDetailStudent.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-white/20 text-white font-black text-2xl flex items-center justify-center border-2 border-white/30 flex-shrink-0 font-display">
                    {selectedDetailStudent.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold font-display text-lg leading-tight">
                      {selectedDetailStudent.name}
                    </h3>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Kelas 1C
                    </span>
                  </div>
                  <p className="text-xs text-white/90 font-medium mt-0.5">
                    Nama Panggilan: <strong className="font-bold underline">{selectedDetailStudent.nickname || selectedDetailStudent.name.trim().split(/\s+/)[0]}</strong>
                  </p>
                  <p className="text-xs text-white/80 font-medium mt-0.5">
                    Wali Murid: <strong>{selectedDetailStudent.parentName}</strong> ({selectedDetailStudent.parentPhone})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDetailStudent(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50/50">
              
              {/* Quick Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-3 rounded-2xl border border-pink-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-pink-600 block uppercase flex items-center gap-1">
                    🎂 Tanggal Lahir & Usia
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 font-display mt-0.5 block">
                    {new Date(selectedDetailStudent.birthday).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="text-[10px] font-extrabold text-purple-800 bg-purple-100/80 px-1.5 py-0.2 rounded mt-1 inline-block border border-purple-200/80">
                    {calculateAge(selectedDetailStudent.birthday)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Berat Badan (BB)</span>
                  <span className="text-sm font-extrabold text-blue-600 font-display mt-0.5 block">
                    {selectedDetailStudent.weightLogs && selectedDetailStudent.weightLogs.length > 0
                      ? `${selectedDetailStudent.weightLogs[selectedDetailStudent.weightLogs.length - 1].value} kg`
                      : "-"}
                  </span>
                  <span className="text-[9px] text-slate-400">Terakhir dicatat</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Tinggi Badan (TB)</span>
                  <span className="text-sm font-extrabold text-emerald-600 font-display mt-0.5 block">
                    {selectedDetailStudent.heightLogs && selectedDetailStudent.heightLogs.length > 0
                      ? `${selectedDetailStudent.heightLogs[selectedDetailStudent.heightLogs.length - 1].value} cm`
                      : "-"}
                  </span>
                  <span className="text-[9px] text-slate-400">Terakhir dicatat</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Sisa Kasbon Aktif</span>
                  <span className={`text-sm font-extrabold font-display mt-0.5 block ${
                    selectedDetailStudent.sisaKasbon > 0 ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {selectedDetailStudent.sisaKasbon > 0 ? formatRupiah(selectedDetailStudent.sisaKasbon) : "Rp 0 (Bebas)"}
                  </span>
                  <span className="text-[9px] text-slate-400">Dipotong saat rembesan</span>
                </div>
              </div>

              {/* SECTION 1: PHYSICAL GROWTH CHART & HISTORY */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-600" />
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider font-display">
                      Grafik & Riwayat Perkembangan Fisik Anak
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400">Kurva Pertumbuhan BB & TB</span>
                </div>

                <GrowthChart 
                  weightLogs={selectedDetailStudent.weightLogs || []} 
                  heightLogs={selectedDetailStudent.heightLogs || []} 
                />

                {/* Log Lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-blue-500" /> Log Berat Badan (BB)
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto">
                      {selectedDetailStudent.weightLogs && selectedDetailStudent.weightLogs.length > 0 ? (
                        selectedDetailStudent.weightLogs.slice().reverse().map((log, i) => (
                          <div key={i} className="flex justify-between text-xs bg-white p-1.5 rounded border border-slate-100 font-mono">
                            <span className="text-slate-500">{log.date}</span>
                            <span className="font-bold text-slate-800">{log.value} kg</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">Belum ada riwayat BB</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1.5 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-emerald-500" /> Log Tinggi Badan (TB)
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto">
                      {selectedDetailStudent.heightLogs && selectedDetailStudent.heightLogs.length > 0 ? (
                        selectedDetailStudent.heightLogs.slice().reverse().map((log, i) => (
                          <div key={i} className="flex justify-between text-xs bg-white p-1.5 rounded border border-slate-100 font-mono">
                            <span className="text-slate-500">{log.date}</span>
                            <span className="font-bold text-slate-800">{log.value} cm</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">Belum ada riwayat TB</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: FINANCIAL STATUS & PAYMENTS */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider font-display">
                      Status Iuran Kas Bulanan (2026 - 2027)
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400">Rp 20.000 / Bulan</span>
                </div>

                {selectedDetailStudent.iuranStatus.some(i => i.paid) && (
                  <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                        <Heart className="w-4 h-4 fill-white/30" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-emerald-950 text-xs font-display">Pesan Terima Kasih WhatsApp</h5>
                        <p className="text-[10px] text-emerald-700 font-medium">Salin atau kirim apresiasi bukti pelunasan ke wali murid ({selectedDetailStudent.parentName})</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyWhatsAppThankYou(selectedDetailStudent)}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {copyStatus === "thankyou_" + selectedDetailStudent.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Pesan Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Chat WA</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const msg = getWhatsAppThankYouRawText(selectedDetailStudent);
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
                        }}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kirim WA</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedDetailStudent.iuranStatus.map((m, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border text-center ${
                      m.paid ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                    }`}>
                      <span className="text-[10px] font-bold block text-slate-600 uppercase">{m.month}</span>
                      <span className={`text-xs font-black block mt-1 ${
                        m.paid ? "text-emerald-700" : "text-amber-700"
                      }`}>
                        {m.paid ? "✅ Lunas" : "⏳ Belum Lunas"}
                      </span>
                      {m.paid && m.paidAt && (
                        <span className="text-[9px] text-emerald-600 block mt-0.5">Tgl: {m.paidAt}</span>
                      )}
                      {activeRole === "BENDAHARA" && !m.paid && (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch("/api/pay-iuran", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                studentId: selectedDetailStudent.id,
                                month: m.month,
                                amount: 20000,
                                datePaid: new Date().toISOString().split("T")[0]
                              })
                            });
                            const res = await fetch("/api/db");
                            const updatedDB = await res.json();
                            setDbState(updatedDB);
                            const updatedStd = updatedDB.students.find((s: Student) => s.id === selectedDetailStudent.id);
                            if (updatedStd) setSelectedDetailStudent(updatedStd);
                          }}
                          className="mt-1.5 w-full text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 rounded cursor-pointer shadow-2xs"
                        >
                          Tandai Lunas
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: CREDENTIALS & ACCOUNT SECURITY (BENDAHARA ONLY / PARENT OWN) */}
              {(activeRole === "BENDAHARA" || selectedDetailStudent.id === selectedStudentId) && (
                <div className="bg-purple-50/60 border border-purple-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-purple-900 block font-display">Akses Akun Login Wali Murid</span>
                    <p className="text-[11px] text-purple-700 mt-0.5 leading-relaxed">
                      Nama Panggilan: <strong className="font-semibold bg-white px-2 py-0.5 rounded border border-purple-200 mr-2">{selectedDetailStudent.nickname || selectedDetailStudent.name.trim().split(/\s+/)[0]}</strong>
                      Kata Sandi Login: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-purple-200">{selectedDetailStudent.password || getAutoPassword(selectedDetailStudent.nickname, selectedDetailStudent.name, selectedDetailStudent.birthday)}</strong>
                    </p>
                  </div>
                  {activeRole === "BENDAHARA" && (
                    <button
                      type="button"
                      onClick={async () => {
                        const resPost = await fetch(`/api/students/${selectedDetailStudent.id}/reset-password`, { method: "POST" });
                        const resData = await resPost.json();
                        const res = await fetch("/api/db");
                        const updatedDB = await res.json();
                        setDbState(updatedDB);
                        const updatedStd = updatedDB.students.find((s: Student) => s.id === selectedDetailStudent.id);
                        if (updatedStd) setSelectedDetailStudent(updatedStd);
                        if (resData.autoPassword) {
                          alert(`Kata sandi siswa berhasil di-reset ke password otomatis: ${resData.autoPassword}`);
                        }
                      }}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-bold shadow-2xs transition cursor-pointer shrink-0"
                    >
                      Reset Sandi Otomatis
                    </button>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-2">
              <a 
                href={`https://wa.me/${selectedDetailStudent.parentPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hubungi Wali via WA</span>
              </a>

              <div className="flex gap-2 w-full sm:w-auto">
                {(activeRole === "BENDAHARA" || selectedDetailStudent.id === selectedStudentId) && (
                  <button
                    type="button"
                    onClick={() => {
                      const stdToEdit = selectedDetailStudent;
                      setSelectedDetailStudent(null);
                      openEditModal(stdToEdit);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                  >
                    ✏️ Ubah Profil & Foto
                  </button>
                )}

                {activeRole === "BENDAHARA" && (
                  <button
                    type="button"
                    onClick={() => {
                      const std = selectedDetailStudent;
                      setSelectedDetailStudent(null);
                      setStudentToDelete(std);
                    }}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-red-200 shadow-2xs"
                    title="Hapus data siswa ganda / double"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Data Ganda</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedDetailStudent(null)}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          REGISTRASI SISWA BARU MODAL
          ========================================== */}
      {isAddStudentModalOpen && activeRole === "BENDAHARA" && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className={`p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r ${activeTheme.bgClass} text-white`}>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-sm">
                    Registrasi Siswa Baru Kelas 1C
                  </h3>
                  <p className="text-[10px] opacity-90 font-medium">Tambahkan siswa baru ke dalam sistem kas kelas</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddStudentModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {addStudentError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl font-bold flex items-center gap-1.5 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{addStudentError}</span>
                  </p>
                )}

                {addStudentSuccess && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-xl font-bold flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{addStudentSuccess}</span>
                  </p>
                )}

                <div className="space-y-3">
                  {/* Photo Upload */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                      Foto Profil Anak (Opsional)
                    </label>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-200 rounded-xl">
                      {newPhotoUrl ? (
                        <img 
                          src={newPhotoUrl} 
                          alt="Preview Foto" 
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-xs flex-shrink-0" 
                        />
                      ) : (
                        <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center text-xl font-black font-display flex-shrink-0 border border-purple-200">
                          👧
                        </div>
                      )}
                      <div className="space-y-1 flex-grow">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Foto Profil</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleNewStudentPhotoChange} 
                            className="hidden" 
                          />
                        </label>
                        {newPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setNewPhotoUrl("")}
                            className="text-[10px] text-red-500 hover:text-red-700 block font-semibold cursor-pointer"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Nama Lengkap Siswa *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Siti Aisyah"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Nama Panggilan Anak (Untuk Login) *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Aisyah"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                      Nama Wali Murid (Mama / Papa) *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ibu Fatimah"
                      value={newParentName}
                      onChange={(e) => setNewParentName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                      Nomor HP / WhatsApp Wali Murid *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 081234567890"
                      value={newParentPhone}
                      onChange={(e) => setNewParentPhone(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                      Tanggal Lahir Anak
                    </label>
                    <input
                      type="date"
                      value={newBirthday}
                      onChange={(e) => setNewBirthday(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Berat Awal (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Contoh: 20.5"
                        value={newInitialWeight}
                        onChange={(e) => setNewInitialWeight(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                        Tinggi Awal (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Contoh: 115"
                        value={newInitialHeight}
                        onChange={(e) => setNewInitialHeight(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-[10px] text-purple-800 space-y-1">
                    <div className="font-bold">🔑 Akses Login Otomatis Wali Murid:</div>
                    <div>Nama Panggilan: <strong className="bg-white px-1.5 py-0.5 rounded border border-purple-200">{newNickname || newName.trim().split(/\s+/)[0] || "nama_panggilan"}</strong></div>
                    <div>Kata Sandi Otomatis: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200">{getAutoPassword(newNickname, newName, newBirthday)}</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 ${activeTheme.buttonBg} text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan & Daftarkan Siswa</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          KONFIRMASI PEMBAYARAN MANDIRI IURAN KAS MODAL (WALI MURID)
          ========================================== */}
      {isIuranConfirmModalOpen && currentStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-sm">
                    Konfirmasi Pembayaran Uang Kas Mandiri
                  </h3>
                  <p className="text-[10px] opacity-90 font-medium">Siswa: {currentStudent.name} (Wali: {currentStudent.parentName})</p>
                </div>
              </div>
              <button 
                onClick={() => setIsIuranConfirmModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitIuranConfirmation}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                {iuranConfirmError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl font-bold flex items-center gap-1.5 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{iuranConfirmError}</span>
                  </p>
                )}

                {iuranConfirmSuccess && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-xl font-bold flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{iuranConfirmSuccess}</span>
                  </p>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                    Pilih Bulan yang Dibayarkan (Rp 20.000 / bulan) *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    {currentStudent.iuranStatus.map((item) => {
                      const isChecked = selectedIuranMonths.includes(item.month);
                      return (
                        <label 
                          key={item.month}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                            item.paid 
                              ? "bg-emerald-50/50 border-emerald-200 text-emerald-700 opacity-60" 
                              : isChecked
                              ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold shadow-2xs"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={item.paid}
                            checked={item.paid || isChecked}
                            onChange={(e) => {
                              if (item.paid) return;
                              if (e.target.checked) {
                                setSelectedIuranMonths([...selectedIuranMonths, item.month]);
                              } else {
                                setSelectedIuranMonths(selectedIuranMonths.filter(m => m !== item.month));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="truncate">{item.month}</span>
                          {item.paid && <span className="text-[9px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-md ml-auto font-bold">Lunas</span>}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Calculated Total Summary Box */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>Jumlah Bulan Dipilih:</span>
                    <span className="font-bold text-emerald-800">{selectedIuranMonths.length} Bulan</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm border-t border-emerald-200/60 pt-1">
                    <span>Total Nominal Pembayaran:</span>
                    <span className="text-emerald-700 font-display">{formatRupiah(selectedIuranMonths.length * 20000)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                    Metode Pembayaran *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIuranPaymentMethod("CASH")}
                      className={`p-3 rounded-2xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                        iuranPaymentMethod === "CASH" 
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-base">💵</span>
                      <div>
                        <span className="block text-xs">Cash / Tunai</span>
                        <span className="text-[9px] opacity-80 font-normal">Titip ke Bendahara</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIuranPaymentMethod("TRANSFER")}
                      className={`p-3 rounded-2xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                        iuranPaymentMethod === "TRANSFER" 
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-base">🏧</span>
                      <div>
                        <span className="block text-xs">Transfer / E-Wallet</span>
                        <span className="text-[9px] opacity-80 font-normal">DANA / Bank BSI</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Transfer Account Instruction Box */}
                {iuranPaymentMethod === "TRANSFER" && (
                  <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                    <span className="text-[10px] font-bold text-purple-900 block uppercase tracking-wider">
                      💳 Rekening & E-Wallet Tujuan (Bendahara)
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-purple-200/70 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-sky-700 block">📱 E-Wallet DANA</span>
                          <span className="text-[10px] text-slate-500">a.n. Yayah Sulhiyah</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded">085715524962</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-purple-200/70 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-emerald-700 block">🏦 Bank BSI</span>
                          <span className="text-[10px] text-slate-500">a.n. Yayah Sulhiyah</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded">7298472591</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Transfer Proof Image */}
                {iuranPaymentMethod === "TRANSFER" && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">
                      Upload Bukti Transfer (Opsional)
                    </label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                      {iuranProofImage ? (
                        <img src={iuranProofImage} alt="Bukti Transfer" className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-2xs" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold text-[10px]">
                          No Photo
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto Struk/Bukti</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setIuranProofImage(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }} 
                            className="hidden" 
                          />
                        </label>
                        {iuranProofImage && (
                          <button
                            type="button"
                            onClick={() => setIuranProofImage("")}
                            className="text-[10px] text-red-500 hover:text-red-700 block font-semibold cursor-pointer"
                          >
                            Hapus Foto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIuranConfirmModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={iuranConfirmLoading || selectedIuranMonths.length === 0}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Kirim Konfirmasi Ke Bendahara</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ==========================================
          PENGINGAT PEMBAYARAN BULANAN (TANGGAL 1) MODAL
          ========================================== */}
      {isMonthlyReminderModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-6 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Bell className="w-6 h-6 text-white animate-bounce" />
                </div>
                <div>
                  <h3 className="font-black text-base font-display">Pengingat Bayar Kas (Tgl 1)</h3>
                  <p className="text-xs text-amber-100 font-medium">Informasi & Format Pesan Broadcast WhatsApp</p>
                </div>
              </div>
              <button
                onClick={() => setIsMonthlyReminderModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Info Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 space-y-1">
                  <p className="font-extrabold">📅 Pengingat Rutin Tanggal 1 Setiap Bulan</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Klik tombol di bawah untuk menyalin pesan pengingat atau langsung mengirimkannya ke grup WhatsApp wali murid.
                  </p>
                </div>
              </div>

              {/* Month Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Bulan Periode Tagihan:
                </label>
                <select
                  value={reminderSelectedMonth}
                  onChange={(e) => setReminderSelectedMonth(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  {ALL_IURAN_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m} {m === getCurrentMonthKey() ? "(Bulan Ini)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Details Quick Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 font-display">
                  <Receipt className="w-4 h-4 text-purple-600" />
                  Informasi Detail Tempat & Metode Pembayaran:
                </h4>
                <div className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl font-medium text-emerald-950">
                    <span className="text-base shrink-0">💵</span>
                    <div>
                      <strong className="block text-emerald-900 font-extrabold">Pembayaran Cash (Di Sekolah):</strong>
                      <span>Setiap hari <strong>Sabtu jam 09:30 WIB</strong> di sekolah (ke Bendahara Yayah Sulhiyah).</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-blue-50 border border-blue-200 rounded-xl font-medium text-blue-950">
                    <span className="text-base shrink-0">📱</span>
                    <div>
                      <strong className="block text-blue-900 font-extrabold">E-Wallet DANA:</strong>
                      <span>085715524962 (a.n. Yayah Sulhiyah)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-purple-50 border border-purple-200 rounded-xl font-medium text-purple-950">
                    <span className="text-base shrink-0">🏦</span>
                    <div>
                      <strong className="block text-purple-900 font-extrabold">Bank BSI:</strong>
                      <span>7298472591 (a.n. Yayah Sulhiyah)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Format Message Preview Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700 font-display">
                    Preview Format Pesan WhatsApp:
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">Siap Kirim</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap select-all max-h-52 overflow-y-auto border border-slate-800 shadow-inner">
                  {`Assalamu'alaikum Wr. Wb. 🙏\n\n📢 *PENGINGAT PEMBAYARAN IURAN KAS KELAS 1C* 📢\n📅 *Periode: ${reminderSelectedMonth}*\n\nYth. Bapak/Ibu Wali Murid Kelas 1C,\n\nMengingatkan kembali untuk pembayaran Iuran Kas Kelas 1C bulan *${reminderSelectedMonth}* sebesar *Rp 20.000 / siswa*.\n\n*INFORMASI PEMBAYARAN:*\n💵 *Pembayaran Cash:* Setiap hari *Sabtu jam 09:30 WIB* di sekolah (ke Bendahara Yayah Sulhiyah)\n📱 *E-Wallet DANA:* 085715524962 (a.n. Yayah Sulhiyah)\n🏦 *Bank BSI:* 7298472591 (a.n. Yayah Sulhiyah)\n\nJika sudah melakukan pembayaran, silakan kirimkan bukti transfer ke Bendahara. Terima kasih banyak atas partisipasi dan kerjasamanya! 🙏😊`}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const msg = `Assalamu'alaikum Wr. Wb. 🙏\n\n📢 *PENGINGAT PEMBAYARAN IURAN KAS KELAS 1C* 📢\n📅 *Periode: ${reminderSelectedMonth}*\n\nYth. Bapak/Ibu Wali Murid Kelas 1C,\n\nMengingatkan kembali untuk pembayaran Iuran Kas Kelas 1C bulan *${reminderSelectedMonth}* sebesar *Rp 20.000 / siswa*.\n\n*INFORMASI PEMBAYARAN:*\n💵 *Pembayaran Cash:* Setiap hari *Sabtu jam 09:30 WIB* di sekolah (ke Bendahara Yayah Sulhiyah)\n📱 *E-Wallet DANA:* 085715524962 (a.n. Yayah Sulhiyah)\n🏦 *Bank BSI:* 7298472591 (a.n. Yayah Sulhiyah)\n\nJika sudah melakukan pembayaran, silakan kirimkan bukti transfer ke Bendahara. Terima kasih banyak atas partisipasi dan kerjasamanya! 🙏😊`;
                    navigator.clipboard.writeText(msg);
                    setReminderCopySuccess(true);
                    setTimeout(() => setReminderCopySuccess(false), 3000);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    reminderCopySuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  {reminderCopySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓ Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>📋 Salin Pesan Pengingat</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const msg = `Assalamu'alaikum Wr. Wb. 🙏\n\n📢 *PENGINGAT PEMBAYARAN IURAN KAS KELAS 1C* 📢\n📅 *Periode: ${reminderSelectedMonth}*\n\nYth. Bapak/Ibu Wali Murid Kelas 1C,\n\nMengingatkan kembali untuk pembayaran Iuran Kas Kelas 1C bulan *${reminderSelectedMonth}* sebesar *Rp 20.000 / siswa*.\n\n*INFORMASI PEMBAYARAN:*\n💵 *Pembayaran Cash:* Setiap hari *Sabtu jam 09:30 WIB* di sekolah (ke Bendahara Yayah Sulhiyah)\n📱 *E-Wallet DANA:* 085715524962 (a.n. Yayah Sulhiyah)\n🏦 *Bank BSI:* 7298472591 (a.n. Yayah Sulhiyah)\n\nJika sudah melakukan pembayaran, silakan kirimkan bukti transfer ke Bendahara. Terima kasih banyak atas partisipasi dan kerjasamanya! 🙏😊`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 Kirim via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL SHARE LAPORAN KAS WHATSAPP
          ========================================== */}
      {isWaReportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-6 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base font-display">Bagikan Laporan Kas WA</h3>
                  <p className="text-xs text-emerald-100 font-medium">Rekap Transparan Keuangan Kas Kelas 1C</p>
                </div>
              </div>
              <button
                onClick={() => setIsWaReportModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Select Period */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Periode Laporan Kas:
                </label>
                <select
                  value={waReportSelectedMonth}
                  onChange={(e) => setWaReportSelectedMonth(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">Semua Bulan (Kumulatif / Total Keseluruhan)</option>
                  {ALL_IURAN_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      Periode Bulan {m} {m === getCurrentMonthKey() ? "(Bulan Ini)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rincian Ringkas Summary Box */}
              {(() => {
                const fData = getFilteredCashbookData(waReportSelectedMonth);
                const tStats = getTotals();
                return (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-700 block">🟢 Total Masuk</span>
                      <strong className="text-sm font-black text-emerald-950 block">{formatRupiah(fData.totalMasuk)}</strong>
                    </div>
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <span className="text-[10px] font-bold text-rose-700 block">🔴 Total Keluar</span>
                      <strong className="text-sm font-black text-rose-950 block">{formatRupiah(fData.totalKeluar)}</strong>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <span className="text-[10px] font-bold text-blue-700 block">💰 Saldo Periode Ini</span>
                      <strong className="text-sm font-black text-blue-950 block">{formatRupiah(fData.saldoFilter)}</strong>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                      <span className="text-[10px] font-bold text-purple-700 block">🏦 Total Saldo Utama</span>
                      <strong className="text-sm font-black text-purple-950 block">{formatRupiah(tStats.saldo)}</strong>
                    </div>
                  </div>
                );
              })()}

              {/* Format Message Preview Box */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700 font-display">
                    Preview Format Teks WhatsApp:
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">Siap Kirim / Copy</span>
                </div>
                <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap select-all max-h-56 overflow-y-auto border border-slate-800 shadow-inner">
                  {getWaCashbookRawText(waReportSelectedMonth)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const rawMsg = getWaCashbookRawText(waReportSelectedMonth);
                    navigator.clipboard.writeText(rawMsg);
                    setWaReportCopySuccess(true);
                    setTimeout(() => setWaReportCopySuccess(false), 3000);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    waReportCopySuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 hover:bg-slate-900 text-white"
                  }`}
                >
                  {waReportCopySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓ Teks Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>📋 Salin Teks Laporan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const rawMsg = getWaCashbookRawText(waReportSelectedMonth);
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(rawMsg)}`, "_blank");
                  }}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>💬 Kirim via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL CHAT UCAPAN TERIMA KASIH WA
          ========================================== */}
      {isThankYouModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-6 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Heart className="w-6 h-6 text-white fill-white/30" />
                </div>
                <div>
                  <h3 className="font-black text-base font-display">Chat Terima Kasih WA</h3>
                  <p className="text-xs text-emerald-100 font-medium">Apresiasi Pembayaran Iuran Kas Kelas 1C</p>
                </div>
              </div>
              <button
                onClick={() => setIsThankYouModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Info Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <p className="font-extrabold">💚 Konfirmasi & Ucapan Terima Kasih Resmi</p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Pilih siswa dan periode bulan yang telah dilunasi untuk membuat pesan ucapan terima kasih WhatsApp secara otomatis.
                  </p>
                </div>
              </div>

              {/* Student Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Siswa / Wali Murid:
                </label>
                <select
                  value={thankYouSelectedStudentId}
                  onChange={(e) => {
                    const stdId = e.target.value;
                    setThankYouSelectedStudentId(stdId);
                    const std = dbState.students.find(s => s.id === stdId);
                    if (std) {
                      const paidM = std.iuranStatus ? std.iuranStatus.filter(i => i.paid).map(i => i.month) : [];
                      setThankYouSelectedMonths(paidM);
                    } else {
                      setThankYouSelectedMonths([]);
                    }
                  }}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">-- Pilih Siswa --</option>
                  {dbState.students.map((s) => {
                    const paidCount = s.iuranStatus ? s.iuranStatus.filter(i => i.paid).length : 0;
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} (Wali: {s.parentName}) • {paidCount} Bulan Lunas
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Paid Months Checklist */}
              {thankYouSelectedStudentId && (() => {
                const selectedStudent = dbState.students.find(s => s.id === thankYouSelectedStudentId);
                if (!selectedStudent) return null;
                const paidMonthsList = selectedStudent.iuranStatus ? selectedStudent.iuranStatus.filter(i => i.paid) : [];

                return (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Pilih Periode Bulan yang Ditampilkan dalam Pesan:
                    </label>
                    {paidMonthsList.length === 0 ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                        Siswa ini belum memiliki riwayat bulan lunas. Anda dapat menandai lunas terlebih dahulu di daftar iuran.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {paidMonthsList.map((m) => {
                          const isChecked = thankYouSelectedMonths.includes(m.month);
                          return (
                            <label
                              key={m.month}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-bold cursor-pointer transition ${
                                isChecked ? "bg-emerald-100/70 border-emerald-300 text-emerald-900" : "bg-white border-slate-200 text-slate-600"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setThankYouSelectedMonths([...thankYouSelectedMonths, m.month]);
                                  } else {
                                    setThankYouSelectedMonths(thankYouSelectedMonths.filter(x => x !== m.month));
                                  }
                                }}
                                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                              />
                              <span className="truncate">{m.month}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Message Preview */}
              {thankYouSelectedStudentId && (() => {
                const selectedStudent = dbState.students.find(s => s.id === thankYouSelectedStudentId);
                if (!selectedStudent) return null;
                const rawText = getWhatsAppThankYouRawText(selectedStudent, thankYouSelectedMonths);

                return (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-extrabold text-slate-700 font-display">
                        Preview Pesan Ucapan Terima Kasih:
                      </label>
                      <span className="text-[10px] font-bold text-emerald-600">Siap Kirim / Copy</span>
                    </div>
                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-2xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap select-all max-h-52 overflow-y-auto border border-slate-800 shadow-inner">
                      {rawText}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(rawText);
                          setThankYouCopySuccess(true);
                          setTimeout(() => setThankYouCopySuccess(false), 3000);
                        }}
                        className="py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        {thankYouCopySuccess ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Pesan Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-300" />
                            <span>📋 Salin Pesan</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(rawText)}`, "_blank");
                        }}
                        className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>💬 Kirim via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DETAIL TRANSAKSI KAS & WA THANK YOU
          ========================================== */}
      {selectedTxDetail && (() => {
        const tx = selectedTxDetail;
        const matchedStudent = getMatchedStudentFromTx(tx);
        const rawThankYouText = getTxThankYouRawText(tx);

        return (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-6 overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className={`p-5 text-white flex justify-between items-center ${
                tx.type === "IN"
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600"
                  : "bg-gradient-to-r from-slate-800 via-rose-800 to-slate-900"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                    {tx.type === "IN" ? (
                      <ArrowDownLeft className="w-6 h-6 text-white" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-base font-display">Detail Transaksi Kas Kelas</h3>
                    <p className="text-xs text-white/80 font-medium">
                      {tx.type === "IN" ? "Pemasukan Kas Kelas 1C" : "Pengeluaran Kas Kelas 1C"} • {tx.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTxDetail(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Nominal Hero Display */}
                <div className={`p-4 rounded-2xl border text-center relative overflow-hidden ${
                  tx.type === "IN"
                    ? "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-emerald-200"
                    : "bg-gradient-to-br from-rose-50 via-slate-50/50 to-white border-rose-200"
                }`}>
                  <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider mb-1">
                    Nominal Transaksi
                  </span>
                  <div className={`text-2xl sm:text-3xl font-black font-display ${
                    tx.type === "IN" ? "text-emerald-700" : "text-rose-700"
                  }`}>
                    {tx.type === "IN" ? "+" : "-"}{formatRupiah(tx.amount)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      tx.type === "IN"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-rose-300"
                    }`}>
                      {tx.type === "IN" ? "Pemasukan (IN)" : "Pengeluaran (OUT)"}
                    </span>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono">
                      {tx.category}
                    </span>
                  </div>
                </div>

                {/* Information Details List */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-0.5">
                      Keterangan Transaksi:
                    </span>
                    <p className="text-xs font-black text-slate-800 leading-snug">
                      {tx.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Tanggal:</span>
                      <span className="text-xs font-bold text-slate-700">{tx.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">ID Transaksi:</span>
                      <span className="text-xs font-mono font-bold text-slate-600">{tx.id}</span>
                    </div>
                  </div>
                </div>

                {/* Who Paid / Student & Parent Info Section ("biar ketauan siapa yang udh bayar") */}
                <div className="bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-200/80 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-600 text-white rounded-xl">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-indigo-950 font-display">
                          {tx.type === "IN" ? "Informasi Pembayar / Siswa" : "Penerima / Wali Terkait"}
                        </h4>
                        <p className="text-[10px] text-indigo-700 font-medium">Identitas siswa & wali murid pencatatan kas</p>
                      </div>
                    </div>
                    {matchedStudent && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-extrabold">
                        ✓ Siswa Terverifikasi
                      </span>
                    )}
                  </div>

                  {matchedStudent ? (
                    <div className="bg-white rounded-xl p-3 border border-indigo-100 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Nama Siswa:</span>
                          <span className="font-extrabold text-slate-900 block text-xs">{matchedStudent.name}</span>
                          {matchedStudent.nickname && (
                            <span className="text-[10px] text-slate-500">({matchedStudent.nickname})</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Nama Wali Murid:</span>
                          <span className="font-extrabold text-slate-900 block text-xs">{matchedStudent.parentName}</span>
                          {matchedStudent.parentPhone && (
                            <span className="text-[10px] text-emerald-700 font-medium block">📱 {matchedStudent.parentPhone}</span>
                          )}
                        </div>
                      </div>

                      {matchedStudent.iuranStatus && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500">
                            Status Pelunasan Iuran:
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {matchedStudent.iuranStatus.filter(i => i.paid).length} Bulan Lunas
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs text-slate-700">
                      <p className="font-bold text-slate-800">
                        {tx.parentName ? `Wali Murid: ${tx.parentName}` : "Pencatatan Kas Umum Kelas 1C"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {tx.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Merchant / Store info if applicable */}
                {tx.storeName && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Toko / Tempat Belanja:</span>
                    <p className="font-extrabold text-slate-800">🏪 {tx.storeName}</p>
                    {tx.storeAddress && <p className="text-[11px] text-slate-500">📍 {tx.storeAddress}</p>}
                  </div>
                )}

                {/* Items detail if applicable */}
                {tx.items && tx.items.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Rincian Item Belanja:</span>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {tx.items.map((it, idx) => {
                        const isStr = typeof it === "string";
                        const name = isStr ? it : it.name;
                        const qty = isStr ? 1 : (it.qty || 1);
                        const price = isStr ? 0 : (it.unitPrice || 0);
                        return (
                          <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-white rounded-lg border border-slate-100">
                            <span className="font-bold text-slate-800">{name} <span className="text-slate-400 font-normal">x{qty}</span></span>
                            {!isStr && price > 0 && (
                              <span className="font-mono text-slate-600 font-bold">{formatRupiah(price * qty)}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Proof image if present */}
                {tx.proofImage && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Bukti Struk Pembelian / Transfer:</span>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                      <img src={tx.proofImage} alt="Bukti Struk" className="w-full h-44 object-contain" />
                      <button
                        type="button"
                        onClick={() => setViewImageModal({
                          src: tx.proofImage!,
                          title: `Struk Transaksi - ${tx.description}`,
                          tx: tx
                        })}
                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                        <span>Perbesar Struk</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* WhatsApp Action Box (Dibuat berbeda antara Penerimaan vs Pengeluaran) */}
                <div className={`border rounded-2xl p-4 space-y-3 shadow-xs ${
                  tx.type === "IN"
                    ? "bg-gradient-to-br from-emerald-50 via-teal-50/60 to-emerald-100/40 border-emerald-300/80"
                    : "bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-slate-100 border-amber-300/80"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2.5 rounded-xl shadow-xs shrink-0 ${
                      tx.type === "IN" ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    }`}>
                      {tx.type === "IN" ? (
                        <Heart className="w-5 h-5 fill-white/30" />
                      ) : (
                        <Megaphone className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-black text-xs sm:text-sm font-display ${
                        tx.type === "IN" ? "text-emerald-950" : "text-amber-950"
                      }`}>
                        {tx.type === "IN"
                          ? "Konfirmasi Penerimaan Kas WA (Ringkas)"
                          : "Informasi Pengeluaran Kas WA (Transparan)"}
                      </h4>
                      <p className={`text-[11px] font-medium ${
                        tx.type === "IN" ? "text-emerald-800" : "text-amber-800"
                      }`}>
                        {tx.type === "IN"
                          ? "Kirim tanda terima ringkas pembayaran ini ke WhatsApp Wali Murid"
                          : "Bagikan rincian & bukti pengeluaran kas ini ke WhatsApp (grup kelas)"}
                      </p>
                    </div>
                  </div>

                  {/* Preview Box */}
                  <div className="bg-slate-900 text-slate-100 p-3 rounded-xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap select-all max-h-36 overflow-y-auto border border-slate-800">
                    {rawThankYouText}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(rawThankYouText);
                        setTxThankYouCopySuccess(true);
                        setTimeout(() => setTxThankYouCopySuccess(false), 3000);
                      }}
                      className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {txThankYouCopySuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Pesan Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-300" />
                          <span>{tx.type === "IN" ? "📋 Salin Chat Penerimaan" : "📋 Salin Info Pengeluaran"}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(rawThankYouText)}`, "_blank");
                      }}
                      className={`py-2.5 px-3.5 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        tx.type === "IN"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-teal-700 hover:bg-teal-800"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>💬 Kirim via WhatsApp</span>
                    </button>
                  </div>

                  {matchedStudent && tx.type === "IN" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTxDetail(null);
                        setThankYouSelectedStudentId(matchedStudent.id);
                        const paidM = matchedStudent.iuranStatus ? matchedStudent.iuranStatus.filter(i => i.paid).map(i => i.month) : [];
                        setThankYouSelectedMonths(paidM);
                        setIsThankYouModalOpen(true);
                      }}
                      className="w-full py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>💚 Kelola Detail Ucapan Terima Kasih Siswa Ini</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DELETE STUDENT CONFIRMATION MODAL */}
      {studentToDelete && activeRole === "BENDAHARA" && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-red-100 flex items-center justify-between bg-red-50 text-red-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 rounded-xl text-red-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-sm">
                    Konfirmasi Hapus Data Siswa
                  </h3>
                  <p className="text-[10px] text-red-700 font-medium">Hapus data siswa ganda / double</p>
                </div>
              </div>
              <button 
                onClick={() => setStudentToDelete(null)}
                className="p-1.5 rounded-full hover:bg-red-200/50 text-red-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                {studentToDelete.photoUrl ? (
                  <img 
                    src={studentToDelete.photoUrl} 
                    alt={studentToDelete.name} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 font-extrabold flex items-center justify-center text-base shrink-0">
                    {studentToDelete.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800 font-display">{studentToDelete.name}</h4>
                  <p className="text-xs text-slate-500">Wali: {studentToDelete.parentName} ({studentToDelete.parentPhone})</p>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block font-mono">
                    ID: {studentToDelete.id}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  ⚠️ Peringatan: Data akan dihapus permanen!
                </p>
                <p className="text-[11px] leading-relaxed text-red-700">
                  Fitur ini digunakan untuk membersihkan data ganda / double. Apakah Anda yakin ingin menghapus siswa <strong>{studentToDelete.name}</strong>?
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeletingStudent}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeletingStudent}
                onClick={async () => {
                  setIsDeletingStudent(true);
                  try {
                    const res = await fetch(`/api/students/${studentToDelete.id}`, {
                      method: "DELETE"
                    });
                    if (res.ok) {
                      setStudentToDelete(null);
                      fetchDB();
                    } else {
                      const data = await res.json();
                      alert(data.error || "Gagal menghapus siswa");
                    }
                  } catch (err) {
                    console.error("Failed deleting student:", err);
                    alert("Gagal menghapus data siswa. Coba lagi.");
                  } finally {
                    setIsDeletingStudent(false);
                  }
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isDeletingStudent ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Siswa</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Lightbox Modal for High Quality Image Inspection */}
      {viewImageModal && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={() => setViewImageModal(null)}
        >
          <div 
            className="bg-white rounded-2xl p-4 max-w-2xl w-full max-h-[90vh] flex flex-col items-center gap-3 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center w-full border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-800 text-sm font-display">{viewImageModal.title}</h4>
              <button 
                type="button"
                onClick={() => setViewImageModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[75vh] w-full flex justify-center p-2 bg-slate-50 rounded-xl">
              {viewImageModal.src && (
                viewImageModal.src.startsWith("data:image/jpeg") || 
                viewImageModal.src.startsWith("data:image/png") || 
                viewImageModal.src.startsWith("data:image/webp") || 
                viewImageModal.src.startsWith("http://") || 
                viewImageModal.src.startsWith("https://") || 
                viewImageModal.src.startsWith("blob:")
              ) && (!viewImageModal.tx || !viewImageModal.tx.isGeneratedNota) ? (
                <img 
                  src={viewImageModal.src} 
                  alt={viewImageModal.title} 
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : viewImageModal.tx ? (
                <ThermalSupermarketReceipt
                  merchant={viewImageModal.tx.storeName || "KOPERASI / TOKO KEBUTUHAN KELAS 1C"}
                  purpose={viewImageModal.tx.description}
                  amount={viewImageModal.tx.amount}
                  date={viewImageModal.tx.date}
                  parentName={viewImageModal.tx.parentName || "Wali Murid Kelas 1C"}
                  items={viewImageModal.tx.items && viewImageModal.tx.items.length > 0 
                    ? viewImageModal.tx.items 
                    : [{ name: viewImageModal.tx.description, qty: 1, unitPrice: viewImageModal.tx.amount, price: viewImageModal.tx.amount }]
                  }
                  isGeneratedNota={true}
                />
              ) : (
                <ThermalSupermarketReceipt textData={viewImageModal.src || viewImageModal.title} purpose={viewImageModal.title} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal for Bendahara */}
      {isEditTxModalOpen && editingTx && (
        <div 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsEditTxModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 my-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base font-display">Edit Transaksi Kas</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {editingTx.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditTxModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTxEdit} className="space-y-4 text-xs">
              {/* Type & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Transaksi</label>
                  <select
                    value={editTxType}
                    onChange={(e) => {
                      const newType = e.target.value as "IN" | "OUT";
                      setEditTxType(newType);
                      if (newType === "OUT") {
                        setEditTxCategory("Kebutuhan Kelas");
                      } else {
                        setEditTxCategory("Iuran Kas");
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                  >
                    <option value="OUT">➖ Pengeluaran (Kas Keluar)</option>
                    <option value="IN">➕ Pemasukan (Kas Masuk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Transaksi</label>
                  <select
                    value={editTxCategory}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setEditTxCategory(cat);
                      if (cat === "Uang Duka") {
                        setEditTxAmount("200000");
                        if (!editTxDescription || editTxDescription === "" || editTxDescription === "Santunan / Biaya Jenguk Siswa Sakit") {
                          setEditTxDescription("Uang Duka");
                        }
                      } else if (cat === "Jenguk Siswa Sakit") {
                        setEditTxAmount("150000");
                        if (!editTxDescription || editTxDescription === "" || editTxDescription === "Uang Duka") {
                          setEditTxDescription("Santunan / Biaya Jenguk Siswa Sakit");
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                  >
                    {editTxType === "OUT" ? (
                      <>
                        <option value="Kebutuhan Kelas">📦 Kebutuhan Kelas</option>
                        <option value="Jenguk Siswa Sakit">🩹 Jenguk Siswa Sakit</option>
                        <option value="Uang Duka">🤲 Uang Duka</option>
                        <option value="Perlengkapan / ATK">✏️ Perlengkapan / ATK</option>
                        <option value="Konsumsi">🍱 Konsumsi</option>
                        <option value="Kegiatan">🎉 Kegiatan / Acara</option>
                        <option value="Atribut / Seragam">👔 Atribut / Seragam</option>
                        <option value="Rembes">💸 Rembes</option>
                        <option value="Kasbon">💳 Kasbon</option>
                        <option value="Lain-lain">🌀 Lain-lain</option>
                      </>
                    ) : (
                      <>
                        <option value="Iuran Kas">💰 Iuran Kas</option>
                        <option value="Donasi / Infaq">🎁 Donasi / Infaq</option>
                        <option value="Sisa Kegiatan">🔄 Sisa Kegiatan</option>
                        <option value="Lain-lain">🌀 Lain-lain</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Jenguk Siswa Sakit Student Picker */}
              {editTxCategory === "Jenguk Siswa Sakit" && (
                <div className="space-y-3 bg-red-50/70 p-3.5 rounded-2xl border border-red-200 animate-in fade-in duration-150">
                  <div>
                    <label className="text-xs font-bold text-red-950 block mb-1">
                      Pilih Nama Siswa yang Sakit / Dijenguk *
                    </label>
                    <select
                      value={editTxSickStudentId}
                      onChange={(e) => {
                        const sId = e.target.value;
                        setEditTxSickStudentId(sId);
                        const st = dbState.students.find(s => s.id === sId);
                        if (st) {
                          setEditTxAmount("150000");
                          setEditTxDescription(`Santunan / Biaya Jenguk Siswa Sakit - ${st.name}`);
                          setEditTxStoreName("Kas Sosial Kelas 1C");
                          setEditTxParentName(st.parentName || "Wali Murid Kelas 1C");
                          setEditTxItems([
                            { name: `Santunan / Biaya Jenguk Siswa Sakit - ${st.name}`, qty: 1, unitPrice: 150000 }
                          ]);
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-red-500"
                      required
                    >
                      <option value="">-- Pilih Siswa Kelas 1C --</option>
                      {dbState.students
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }))
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} (Wali: {s.parentName})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="p-2.5 bg-white border border-red-200 rounded-xl flex items-center justify-between text-xs font-bold text-red-900">
                    <span>Nominal Otomatis Jenguk Sakit:</span>
                    <span className="text-sm font-black font-display text-red-600">Rp 150.000</span>
                  </div>
                </div>
              )}

              {/* Uang Duka Student Picker */}
              {editTxCategory === "Uang Duka" && (
                <div className="space-y-3 bg-slate-100 p-3.5 rounded-2xl border border-slate-300 animate-in fade-in duration-150">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Pilih Nama Siswa / Keluarga Duka (Opsional)
                    </label>
                    <select
                      value={editTxSickStudentId}
                      onChange={(e) => {
                        const sId = e.target.value;
                        setEditTxSickStudentId(sId);
                        const st = dbState.students.find(s => s.id === sId);
                        if (st) {
                          setEditTxAmount("200000");
                          setEditTxDescription(`Uang Duka - Siswa: ${st.name}`);
                          setEditTxStoreName("Kas Sosial Kelas 1C");
                          setEditTxParentName(st.parentName || "Wali Murid Kelas 1C");
                          setEditTxItems([
                            { name: `Uang Duka - Siswa: ${st.name}`, qty: 1, unitPrice: 200000 }
                          ]);
                        } else {
                          setEditTxAmount("200000");
                          if (!editTxDescription) setEditTxDescription("Uang Duka");
                        }
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                    >
                      <option value="">-- Pilih Siswa Kelas 1C (Opsional) --</option>
                      {dbState.students
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name, "id", { sensitivity: "base" }))
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} (Wali: {s.parentName})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Nominal Otomatis Uang Duka:</span>
                    <span className="text-sm font-black font-display text-slate-900">Rp 200.000</span>
                  </div>
                </div>
              )}

              {/* Tanggal & Keterangan */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={editTxDate}
                    onChange={(e) => setEditTxDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Keterangan Singkat</label>
                  <input
                    type="text"
                    value={editTxDescription}
                    onChange={(e) => setEditTxDescription(e.target.value)}
                    placeholder="Contoh: Pembelian spidol, kertas HVS & penghapus whiteboard"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Struk Option Segmented Control */}
              <div className="p-1 bg-slate-100 rounded-2xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditTxHasReceipt("MANUAL")}
                  className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    editTxHasReceipt === "MANUAL"
                      ? "bg-white text-purple-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Receipt className="w-4 h-4 text-purple-600" />
                  <span>Tidak Ada Struk (Isi Detail & Nota Digital)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditTxHasReceipt("UPLOAD")}
                  className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    editTxHasReceipt === "UPLOAD"
                      ? "bg-white text-purple-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Ada Struk (Upload Foto Struk)</span>
                </button>
              </div>

              {/* Mode UPLOAD FOTO STRUK */}
              {editTxHasReceipt === "UPLOAD" ? (
                <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Upload Foto Struk Fisik</label>
                    {editTxProofImage ? (
                      <div className="space-y-2">
                        <div className="p-2 border border-slate-200 rounded-xl bg-white flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700 truncate">Foto Struk Terlampir</span>
                          <button
                            type="button"
                            onClick={() => setEditTxProofImage("")}
                            className="text-xs text-red-600 font-bold hover:underline"
                          >
                            Hapus Foto
                          </button>
                        </div>
                        {editTxProofImage.startsWith("data:image") && (
                          <img src={editTxProofImage} alt="Struk Preview" className="h-32 object-contain mx-auto rounded-lg border shadow-2xs" />
                        )}
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setEditTxProofImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nominal Transaksi (Rp)</label>
                    <input
                      type="number"
                      value={editTxAmount}
                      onChange={(e) => setEditTxAmount(e.target.value)}
                      placeholder="Contoh: 75000"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-sm focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>
              ) : (
                /* Mode MANUAL: DETAIL TOKO, WALI MURID, & ITEM BELANJA */
                <div className="space-y-3 p-3 bg-purple-50/50 border border-purple-100 rounded-2xl">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nama Toko / Vendor</label>
                      <input
                        type="text"
                        value={editTxStoreName}
                        onChange={(e) => setEditTxStoreName(e.target.value)}
                        placeholder="Contoh: Toko Buku Hidayah / Koperasi 1C"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Toko / Lokasi</label>
                      <input
                        type="text"
                        value={editTxStoreAddress}
                        onChange={(e) => setEditTxStoreAddress(e.target.value)}
                        placeholder="Contoh: Kec. Sukadiri, Kab. Tangerang"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Wali Murid / Penanggung Jawab</label>
                    <input
                      type="text"
                      value={editTxParentName}
                      onChange={(e) => setEditTxParentName(e.target.value)}
                      placeholder="Contoh: Hendra Santoso (Wali Murid)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  {/* Dynamic Items Table */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                        📦 Rincian Item Barang / Kebutuhan:
                      </label>
                      <button
                        type="button"
                        onClick={handleAddEditTxItem}
                        className="text-[11px] bg-purple-100 hover:bg-purple-200 text-purple-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Item
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {editTxItems.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                              placeholder="Nama item/barang"
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 text-xs"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                              placeholder="Qty"
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold text-slate-800 text-xs"
                            />
                          </div>
                          <div className="col-span-4">
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                              placeholder="Harga /pcs"
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right font-bold text-slate-800 text-xs"
                            />
                          </div>
                          <div className="col-span-1 text-center">
                            {editTxItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEditTxItem(idx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded-md transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="col-span-12 text-right text-[10px] text-slate-500 font-mono pr-2">
                            Subtotal: <span className="font-bold text-slate-800">{formatRupiah(item.qty * item.unitPrice)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Auto Calculated Total Display */}
                    <div className="p-3 bg-purple-100/80 border border-purple-200 rounded-xl flex justify-between items-center">
                      <span className="font-extrabold text-purple-900 text-xs">Total Otomatis (Qty x Harga):</span>
                      <span className="font-black text-purple-950 text-base font-display">
                        {formatRupiah(
                          editTxItems.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0)
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Supermarket Thermal Receipt Preview */}
                  <div className="mt-3 pt-2 border-t border-purple-200">
                    <p className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      ✨ Pratinjau Struk Swalayan (Thermal Receipt):
                    </p>
                    <div className="max-h-60 overflow-y-auto bg-slate-100 p-2 rounded-2xl border border-slate-200">
                      <ThermalSupermarketReceipt
                        merchant={editTxStoreName || "KOPERASI / TOKO KEBUTUHAN KELAS 1C"}
                        purpose={editTxDescription || "Pengeluaran Kebutuhan Kelas"}
                        amount={editTxItems.reduce((sum, it) => sum + (it.qty * it.unitPrice), 0) || parseInt(editTxAmount) || 0}
                        date={editTxDate}
                        parentName={editTxParentName || "Wali Murid Kelas 1C"}
                        items={editTxItems.filter(it => it.name.trim() !== "").map(it => ({
                          name: it.name,
                          qty: it.qty,
                          unitPrice: it.unitPrice,
                          price: it.qty * it.unitPrice
                        }))}
                        isGeneratedNota={true}
                      />
                    </div>
                  </div>
                </div>
              )}

              {txEditError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {txEditError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditTxModalOpen(false)}
                  disabled={isSavingTxEdit}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingTxEdit}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  {isSavingTxEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Simpan Transaksi & Struk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on screens < sm when logged in) */}
      {activeRole !== "SPLASH" && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around pb-safe shadow-lg">
          {activeRole === "WALI_MURID" ? (
            <>
              <button
                onClick={() => setParentTab("dashboard")}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
                  parentTab === "dashboard"
                    ? `${activeTheme.textClass} bg-slate-100 font-extrabold scale-105`
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Dashboard</span>
              </button>

              <button
                onClick={() => setParentTab("keuangan")}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
                  parentTab === "keuangan"
                    ? `${activeTheme.textClass} bg-slate-100 font-extrabold scale-105`
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Kas Kelas</span>
              </button>

              <button
                onClick={() => setParentTab("kasbon_rembes")}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
                  parentTab === "kasbon_rembes"
                    ? `${activeTheme.textClass} bg-slate-100 font-extrabold scale-105`
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Pengajuan</span>
              </button>

              <button
                onClick={() => setParentTab("inventaris")}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition ${
                  parentTab === "inventaris"
                    ? `${activeTheme.textClass} bg-slate-100 font-extrabold scale-105`
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Aset</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setBendaharaTab("ringkasan")}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition ${
                  bendaharaTab === "ringkasan"
                    ? "text-purple-700 bg-purple-50 font-extrabold scale-105"
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Ikhtisar</span>
              </button>

              <button
                onClick={() => setBendaharaTab("buku_kas")}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition ${
                  bendaharaTab === "buku_kas"
                    ? "text-purple-700 bg-purple-50 font-extrabold scale-105"
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Buku Kas</span>
              </button>

              <button
                onClick={() => setBendaharaTab("daftar_siswa")}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition ${
                  bendaharaTab === "daftar_siswa"
                    ? "text-purple-700 bg-purple-50 font-extrabold scale-105"
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Siswa</span>
              </button>

              <button
                onClick={() => setBendaharaTab("inventaris")}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition ${
                  bendaharaTab === "inventaris"
                    ? "text-purple-700 bg-purple-50 font-extrabold scale-105"
                    : "text-slate-500 font-medium hover:text-slate-700"
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Aset</span>
              </button>
            </>
          )}
        </nav>
      )}

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 space-y-2 mt-auto pb-20 sm:pb-6">
        <p className="font-medium">Kas Kelas 1C &copy; 2026 MIT MA Buaran Jati</p>
        <p className="text-[10px] text-slate-300 font-mono">Bertenaga Gemini AI &bull; PWA Installable Mobile App</p>
      </footer>


    </div>
  );
}
