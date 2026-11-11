import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { Transaction } from "../types";
import { formatRupiah } from "../utils";

const FIREBASE_SHEETS_CONFIG = {
  projectId: "smart-league-czp2g",
  appId: "1:401246954965:web:294bca30e0c5cfaf48c95c",
  apiKey: "AIzaSyBOEnYHenHp8emJTkDq98V-k1q7mIHvi6Q",
  authDomain: "smart-league-czp2g.firebaseapp.com",
  storageBucket: "smart-league-czp2g.firebasestorage.app",
  messagingSenderId: "401246954965"
};

// Initialize Firebase client app specifically for smart-league-czp2g
const existingApps = getApps();
let app = existingApps.find(a => a.options.projectId === FIREBASE_SHEETS_CONFIG.projectId);
if (!app) {
  try {
    app = initializeApp(FIREBASE_SHEETS_CONFIG, "kaskelas-sheets-auth");
  } catch (e) {
    app = getApp();
  }
}
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Google Sheets and Drive File scopes
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.setCustomParameters({
  prompt: "consent"
});

// Cache the access token strictly in memory (per Workspace guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not in memory after reload, prompt user to sign in
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const signInWithGoogleSheets = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Gagal memperoleh token otorisasi dari Google. Silakan coba lagi.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Sign-In error:", error);
    const msg = String(error?.message || "");
    if (error.code === "auth/popup-blocked") {
      throw new Error("Jendela pop-up Google Login diblokir oleh browser. Harap izinkan pop-up (Allow Pop-ups) di browser HP/Laptop Anda lalu klik tombol login kembali.");
    } else if (error.code === "auth/popup-closed-by-user" || msg.includes("popup-closed-by-user")) {
      throw new Error("Jendela otorisasi Google ditutup. Jika muncul 'Akses diblokir (Error 403: access_denied)', Google Cloud Console Anda saat ini berstatus Testing. Silakan tambahkan email Anda ke daftar Test Users di Google Cloud Console, atau gunakan tombol 'Unduh Rekap Kas (.CSV)' di atas untuk membuka data kas secara instan di Google Sheets.");
    } else if (error.code === "auth/unauthorized-domain") {
      throw new Error(`Domain '${window.location.hostname}' belum terdaftar di Authorized Domains Firebase. Silakan gunakan tombol 'Unduh Rekap Kas (.CSV)' di bawah untuk langsung membuka seluruh data kas di Google Sheets.`);
    } else if (msg.includes("403") || msg.includes("access_denied") || msg.includes("penguji") || msg.includes("verification")) {
      throw new Error("Akses diblokir (Error 403: access_denied). Status OAuth project Google Cloud Anda berstatus 'Testing'. Silakan tambahkan email Anda ke daftar 'Test users' di Google Cloud Console OAuth Consent Screen, atau gunakan tombol 'Unduh Rekap Kas (.CSV)'.");
    }
    throw new Error(error?.message || "Gagal masuk dengan Google. Pastikan koneksi internet stabil dan pop-up diizinkan.");
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setGoogleAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const signOutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCurrentGoogleUser = (): User | null => {
  return auth.currentUser;
};

export interface SheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

// Create a new Google Spreadsheet for Class 1C Cashbook
export const createCashbookSpreadsheet = async (
  title: string = "Buku Kas Kelas 1C - MIT MA",
  token: string
): Promise<SheetInfo> => {
  const url = "https://sheets.googleapis.com/v4/spreadsheets";
  
  const payload = {
    properties: {
      title: title
    },
    sheets: [
      {
        properties: {
          title: "Buku Kas",
          gridProperties: {
            frozenRowCount: 1,
            columnCount: 12
          }
        }
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal membuat Google Spreadsheet (HTTP ${response.status})`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write headers & format the sheet
  await setupSheetHeadersAndFormat(spreadsheetId, token);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title
  };
};

// Set up nice headers and column widths
export const setupSheetHeadersAndFormat = async (
  spreadsheetId: string,
  token: string
) => {
  const headers = [
    [
      "No",
      "Tanggal",
      "Tipe",
      "Kategori",
      "Deskripsi / Keperluan",
      "Uang Masuk (Rp)",
      "Uang Keluar (Rp)",
      "Saldo Berjalan (Rp)",
      "Pencatat / Wali Murid",
      "Toko / Merchant",
      "Bukti Transaksi / Nota",
      "ID Transaksi"
    ]
  ];

  // Update header row values
  const range = encodeURIComponent("Buku Kas!A1:L1");
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
  
  await fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ values: headers })
  });
};

// Verify if a spreadsheet ID is accessible
export const verifySpreadsheetAccess = async (
  spreadsheetId: string,
  token: string
): Promise<{ title: string; sheets: string[] }> => {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId) {
    throw new Error("ID atau Link Google Spreadsheet tidak valid.");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=properties.title,sheets.properties.title`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || "Tidak dapat mengakses Google Spreadsheet. Pastikan ID benar dan akun Google Anda memiliki akses edit.");
  }

  const data = await response.json();
  const sheetTitles = (data.sheets || []).map((s: any) => s.properties?.title || "");
  return {
    title: data.properties?.title || "Spreadsheet Tanpa Judul",
    sheets: sheetTitles
  };
};

export const extractSpreadsheetId = (input: string): string => {
  if (!input) return "";
  const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input.trim();
};

// Convert Transaction array to Google Sheets rows with running balance
export const formatTransactionsForSheet = (transactions: Transaction[]): any[][] => {
  // Sort transactions chronologically
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let runningBalance = 0;
  const rows: any[][] = [];

  sorted.forEach((tx, index) => {
    const masuk = tx.type === "IN" ? tx.amount : 0;
    const keluar = tx.type === "OUT" ? tx.amount : 0;
    runningBalance += (masuk - keluar);

    const proof = tx.proofImage 
      ? (tx.proofImage.startsWith("data:") ? "[Foto Terlampir di Aplikasi]" : tx.proofImage)
      : (tx.isGeneratedNota ? "[Nota Otomatis AI]" : "-");

    rows.push([
      index + 1,
      tx.date || "",
      tx.type === "IN" ? "MASUK" : "KELUAR",
      tx.category || "Umum",
      tx.description || "",
      masuk,
      keluar,
      runningBalance,
      tx.parentName || tx.studentName || "Bendahara",
      tx.storeName || "-",
      proof,
      tx.id || ""
    ]);
  });

  return rows;
};

// Full synchronization: overwrites the transactions table with the latest state
export const syncAllTransactionsToSheet = async (
  spreadsheetId: string,
  transactions: Transaction[],
  token: string,
  sheetName: string = "Buku Kas"
): Promise<{ syncedCount: number }> => {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId) throw new Error("ID Spreadsheet tidak valid");

  // First ensure headers exist
  await setupSheetHeadersAndFormat(cleanId, token);

  const rows = formatTransactionsForSheet(transactions);

  // Clear existing data rows first (A2:L1000)
  const clearRange = encodeURIComponent(`${sheetName}!A2:L2000`);
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${clearRange}:clear`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (rows.length > 0) {
    const writeRange = encodeURIComponent(`${sheetName}!A2:L${rows.length + 1}`);
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${writeRange}?valueInputOption=USER_ENTERED`;
    
    const res = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: rows })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Gagal memperbarui baris data di Google Sheets");
    }
  }

  return { syncedCount: rows.length };
};

// Append a single new transaction row in real-time
export const appendSingleTransactionToSheet = async (
  spreadsheetId: string,
  transaction: Transaction,
  currentBalance: number,
  allTransactionsCount: number,
  token: string,
  sheetName: string = "Buku Kas"
): Promise<boolean> => {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId || !token) return false;

  const masuk = transaction.type === "IN" ? transaction.amount : 0;
  const keluar = transaction.type === "OUT" ? transaction.amount : 0;
  const newBalance = currentBalance + (masuk - keluar);

  const proof = transaction.proofImage 
    ? (transaction.proofImage.startsWith("data:") ? "[Foto Terlampir di Aplikasi]" : transaction.proofImage)
    : (transaction.isGeneratedNota ? "[Nota Otomatis AI]" : "-");

  const row = [
    allTransactionsCount + 1,
    transaction.date || new Date().toISOString().split("T")[0],
    transaction.type === "IN" ? "MASUK" : "KELUAR",
    transaction.category || "Umum",
    transaction.description || "",
    masuk,
    keluar,
    newBalance,
    transaction.parentName || transaction.studentName || "Bendahara",
    transaction.storeName || "-",
    proof,
    transaction.id || ""
  ];

  const range = encodeURIComponent(`${sheetName}!A1`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: [row] })
    });
    return res.ok;
  } catch (err) {
    console.error("Gagal melakukan penambahan baris real-time ke Google Sheet:", err);
    return false;
  }
};
