import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { INITIAL_SEED_DATA } from "./src/seedData";

dotenv.config();

let seedDbData: any = null;
try {
  const seedPath = path.resolve(process.cwd(), "db.json");
  if (fs.existsSync(seedPath)) {
    seedDbData = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
  }
} catch (e) {
  console.warn("Could not read ./db.json directly:", e);
}

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

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

// Middleware to parse large JSON files (receipts are base64 strings)
app.use(express.json({ limit: "20mb" }));

// Enable CORS for Vercel deployment
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Normalize req.url path for Vercel Serverless Functions
app.use((req, res, next) => {
  if (process.env.VERCEL && req.url) {
    if (!req.url.startsWith("/api")) {
      req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
    }
  }
  next();
});

// Pure Cashbook Server (No Gemini API required - 100% Free Publish)

// Initialize Firebase Firestore with dedicated cloud database
let dbCache: any = null;
let firestoreDb: any = null;

const FIRESTORE_CLOUD_CONFIG = {
  projectId: "smart-league-czp2g",
  appId: "1:401246954965:web:294bca30e0c5cfaf48c95c",
  apiKey: "AIzaSyBOEnYHenHp8emJTkDq98V-k1q7mIHvi6Q",
  authDomain: "smart-league-czp2g.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-kaskelas1c-b57958dd-6772-4270-abe8-5fe7f2bcfd85",
  storageBucket: "smart-league-czp2g.firebasestorage.app",
  messagingSenderId: "401246954965"
};

try {
  const existingApps = getApps();
  const fbApp = existingApps.find(a => a.name === "kaskelas-firestore") || 
    initializeApp(FIRESTORE_CLOUD_CONFIG, "kaskelas-firestore");
  firestoreDb = getFirestore(fbApp, FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);
  console.log("Firebase Firestore connected to cloud database:", FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);
} catch (err) {
  console.error("Firebase Firestore cloud init error:", err);
}

// Helper to sanitize student iuranStatus (Rp 20.000 / month starting Juli 2026 through 2027)
function sanitizeIuranData(db: any) {
  if (!db || !Array.isArray(db.students)) return db;
  const invalidMonths = ["Januari 2026", "Februari 2026", "Maret 2026", "April 2026", "Mei 2026", "Juni 2026"];
  const defaultMonths = [
    "Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026",
    "Januari 2027", "Februari 2027", "Maret 2027", "April 2027", "Mei 2027", "Juni 2027",
    "Juli 2027", "Agustus 2027", "September 2027", "Oktober 2027", "November 2027", "Desember 2027"
  ];

  // 1. Initialize every student's iuranStatus with all 18 standard months (Juli 2026 - Desember 2027) set to unpaid
  // The paid status is authoritatively reconstructed from active 'IN' transactions below,
  // ensuring that deleting or editing a transaction immediately unchecks the corresponding months.
  db.students.forEach((student: any) => {
    student.iuranStatus = defaultMonths.map((m: string) => ({
      month: m,
      paid: false,
      amount: 20000
    }));
  });

  // 2. Ensure transactions accurately link to students and update student.iuranStatus
  if (Array.isArray(db.transactions) && Array.isArray(db.students)) {
    db.transactions.forEach((tx: any) => {
      let targetStudent: any = null;
      if (tx.studentId) {
        targetStudent = db.students.find((s: any) => s.id === tx.studentId);
      }
      if (!targetStudent && tx.description) {
        const desc = tx.description || "";
        const siswaWaliMatch = desc.match(/Siswa:\s*([^(\n\r]+?)(?:\s*\(Wali:\s*([^)\n\r]+)\))?$/i)
          || desc.match(/-\s*([^(\n\r]+?)\s*\(Wali:\s*([^)\n\r]+)\)/i);

        if (siswaWaliMatch) {
          const rawStudent = (siswaWaliMatch[1] || "").trim().toLowerCase();
          const rawWali = (siswaWaliMatch[2] || "").trim().toLowerCase();

          targetStudent = db.students.find((s: any) => s.name.trim().toLowerCase() === rawStudent)
            || db.students.find((s: any) => s.nickname && s.nickname.trim().toLowerCase() === rawStudent);

          if (!targetStudent && rawStudent.length >= 3) {
            targetStudent = db.students.find((s: any) => s.name.toLowerCase().includes(rawStudent) || rawStudent.includes(s.name.toLowerCase()));
          }

          if (!targetStudent && rawWali) {
            targetStudent = db.students.find((s: any) => s.parentName.trim().toLowerCase() === rawWali);
          }
        }

        if (!targetStudent) {
          const descLower = desc.toLowerCase();
          const matchedStudents = db.students
            .filter((s: any) => {
              const sName = s.name.trim().toLowerCase();
              return sName.length >= 4 && descLower.includes(sName);
            })
            .sort((a: any, b: any) => b.name.length - a.name.length);

          if (matchedStudents.length > 0) {
            targetStudent = matchedStudents[0];
          }
        }

        if (targetStudent) {
          tx.studentId = targetStudent.id;
          tx.studentName = targetStudent.name;
          if (!tx.parentName) {
            tx.parentName = targetStudent.parentName;
          }
        }
      } else if (tx.studentId && !tx.studentName) {
        const std = db.students.find((s: any) => s.id === tx.studentId);
        if (std) {
          tx.studentName = std.name;
          if (!tx.parentName) tx.parentName = std.parentName;
          targetStudent = std;
        }
      }

      // Sync student iuranStatus from Iuran Kas transactions
      if (tx.type === "IN" && (tx.category === "Iuran Kas" || (tx.description && tx.description.toLowerCase().includes("iuran kas"))) && targetStudent) {
        let paidMonths: string[] = Array.isArray(tx.monthsPaid) ? tx.monthsPaid : [];
        if (paidMonths.length === 0 && tx.description) {
          defaultMonths.forEach((m: string) => {
            if (tx.description.includes(m)) {
              paidMonths.push(m);
            }
          });
        }

        targetStudent.iuranStatus = targetStudent.iuranStatus || [];
        paidMonths.forEach((m: string) => {
          let monthStatus = targetStudent.iuranStatus.find((i: any) => i.month === m);
          if (monthStatus) {
            monthStatus.paid = true;
            if (!monthStatus.paidAt) monthStatus.paidAt = tx.date || "2026-11-08";
            monthStatus.amount = 20000;
          } else {
            targetStudent.iuranStatus.push({
              month: m,
              paid: true,
              paidAt: tx.date || "2026-11-08",
              amount: 20000
            });
          }
        });
      }
    });
  }

  return sanitizeAssetData(db);
}

// Helper to sanitize and seed default class assets (Dispenser & Galon 1, 2)
function sanitizeAssetData(db: any) {
  if (!db) return db;
  if (!Array.isArray(db.assets) || db.assets.length === 0) {
    db.assets = [
      {
        id: "asset_001",
        assetCode: "ASIC/VII/2026/0001",
        name: "Dispenser Air Minum Kelas 1C",
        category: "Konsumsi & Peralatan",
        purchaseDate: "2026-07-25",
        price: 175000,
        condition: "SANGAT_BAIK",
        locationHolder: "Sudut Belakang Kelas 1C",
        quantity: 1,
        status: "AKTIF",
        notes: "Dispenser air panas/normal untuk kebutuhan konsumsi siswa & guru.",
        addedBy: "Bendahara Kas 1C"
      },
      {
        id: "asset_002",
        assetCode: "ASIC/VII/2026/0002",
        name: "Galon Air Minum (Utama)",
        category: "Konsumsi & Peralatan",
        purchaseDate: "2026-07-25",
        price: 55000,
        condition: "SANGAT_BAIK",
        locationHolder: "Terpasang di Dispenser Kelas",
        quantity: 1,
        status: "AKTIF",
        notes: "Galon air utama isi ulang dari kas kelas.",
        addedBy: "Bendahara Kas 1C"
      },
      {
        id: "asset_003",
        assetCode: "ASIC/VII/2026/0003",
        name: "Galon Air Minum (Cadangan)",
        category: "Konsumsi & Peralatan",
        purchaseDate: "2026-07-25",
        price: 55000,
        condition: "SANGAT_BAIK",
        locationHolder: "Samping Rak Dispenser Kelas",
        quantity: 1,
        status: "AKTIF",
        notes: "Galon air cadangan untuk diisi ulang jika galon utama habis.",
        addedBy: "Bendahara Kas 1C"
      }
    ];
  }
  return db;
}

function mergeTransactions(localTxs: any[], cloudTxs: any[]) {
  const map = new Map<string, any>();
  (localTxs || []).forEach(t => { if (t && t.id) map.set(t.id, t); });
  (cloudTxs || []).forEach(t => { if (t && t.id) map.set(t.id, t); });
  return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Ensure Database State is loaded from file immediately and synced asynchronously
let lastSyncTime = 0;
const CACHE_TTL_MS = 10000;

async function ensureDBSynced(force = false) {
  if (!dbCache || !dbCache.students || dbCache.students.length === 0) {
    dbCache = readDBFromFile();
  }

  const now = Date.now();
  if (!force && (now - lastSyncTime < CACHE_TTL_MS)) {
    return sanitizeIuranData(dbCache);
  }

  if (firestoreDb) {
    try {
      const syncPromise = (async () => {
        const [studentsSnap, txSnap, extrasSnap, settingsSnap] = await Promise.all([
          getDoc(doc(firestoreDb, "appData", "students")),
          getDoc(doc(firestoreDb, "appData", "transactions")),
          getDoc(doc(firestoreDb, "appData", "financeExtras")),
          getDoc(doc(firestoreDb, "appData", "settings"))
        ]);

        if (studentsSnap.exists() || txSnap.exists()) {
          const studentsData = studentsSnap.exists() ? (studentsSnap.data() as any) : {};
          const txData = txSnap.exists() ? (txSnap.data() as any) : {};
          const extrasData = extrasSnap.exists() ? (extrasSnap.data() as any) : {};
          const settingsData = settingsSnap.exists() ? (settingsSnap.data() as any) : {};

          const loadedStudents = Array.isArray(studentsData.students) ? studentsData.students : [];
          const loadedTx = Array.isArray(txData.transactions) ? txData.transactions : [];

          if (loadedStudents.length > 0 || loadedTx.length > 0) {
            const finalTx = loadedTx.length > 0 ? loadedTx : (dbCache?.transactions || []);
            const fetched = sanitizeIuranData({
              students: loadedStudents.length > 0 ? loadedStudents : (dbCache?.students || []),
              transactions: finalTx,
              kasbons: extrasData.kasbons || (dbCache?.kasbons || []),
              reimbursements: extrasData.reimbursements || (dbCache?.reimbursements || []),
              iuranConfirmations: extrasData.iuranConfirmations || (dbCache?.iuranConfirmations || []),
              assets: extrasData.assets || (dbCache?.assets || []),
              settings: settingsData.settings || dbCache?.settings || { themeId: "emerald" }
            });

            dbCache = fetched;
            lastSyncTime = Date.now();
            try {
              fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), "utf-8");
            } catch (e) {}
            return dbCache;
          }
        }
        return null;
      })();

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
      const res = await Promise.race([syncPromise, timeoutPromise]);
      if (res) return res;
    } catch (err) {
      console.error("Error syncing with Firestore:", err);
    }
  }

  return sanitizeIuranData(dbCache);
}

// Initial DB load
ensureDBSynced();

// Express Middleware to ensure dbCache is ready without blocking requests
app.use((req, res, next) => {
  if (!dbCache || !dbCache.students || dbCache.students.length === 0) {
    dbCache = readDBFromFile();
  }
  ensureDBSynced().catch(err => console.warn("Background sync error:", err));
  next();
});

// Database Helpers
function readDBFromFile() {
  try {
    const candidates = [
      DB_FILE,
      path.join(process.cwd(), "db.json"),
      path.resolve("db.json")
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        const db = JSON.parse(data);
        if (db && Array.isArray(db.students) && db.students.length > 0) {
          if (!db.settings) db.settings = {};
          if (!db.settings.themeId) db.settings.themeId = "candy";
          db.iuranConfirmations = db.iuranConfirmations || [];
          return sanitizeIuranData(db);
        }
      }
    }
  } catch (err) {
    console.error("Error reading database file, using fallback state:", err);
  }

  if (seedDbData && Array.isArray(seedDbData.students) && seedDbData.students.length > 0) {
    return sanitizeIuranData(JSON.parse(JSON.stringify(seedDbData)));
  }

  if (INITIAL_SEED_DATA && Array.isArray(INITIAL_SEED_DATA.students) && INITIAL_SEED_DATA.students.length > 0) {
    return sanitizeIuranData(JSON.parse(JSON.stringify(INITIAL_SEED_DATA)));
  }

  return sanitizeIuranData({ students: [], transactions: [], kasbons: [], reimbursements: [], iuranConfirmations: [], settings: { themeId: "candy" } });
}

function readDB() {
  if (!dbCache || !Array.isArray(dbCache.students) || dbCache.students.length === 0) {
    dbCache = readDBFromFile();
  }
  return sanitizeIuranData(dbCache);
}

async function writeDB(data: any) {
  const cleanData = JSON.parse(JSON.stringify(data));
  dbCache = cleanData;
  lastSyncTime = Date.now();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(cleanData, null, 2), "utf-8");
  } catch (err) {
    // Read-only filesystem on Vercel/serverless ignored
  }
  if (firestoreDb) {
    try {
      const persistPromise = Promise.all([
        setDoc(doc(firestoreDb, "appData", "students"), {
          students: cleanData.students || []
        }),
        setDoc(doc(firestoreDb, "appData", "transactions"), {
          transactions: cleanData.transactions || []
        }),
        setDoc(doc(firestoreDb, "appData", "financeExtras"), {
          kasbons: cleanData.kasbons || [],
          reimbursements: cleanData.reimbursements || [],
          iuranConfirmations: cleanData.iuranConfirmations || [],
          assets: cleanData.assets || []
        }),
        setDoc(doc(firestoreDb, "appData", "settings"), {
          settings: cleanData.settings || {},
          updatedAt: new Date().toISOString()
        })
      ]);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore write timeout")), 6000));
      await Promise.race([persistPromise, timeoutPromise]);
    } catch (err) {
      console.warn("Firebase Firestore background write notice (data preserved in cache):", err);
    }
  }
}

// ==========================================
// API Endpoints
// ==========================================

// Get Full Database State
app.get("/api/db", async (req, res) => {
  const db = await ensureDBSynced();
  res.json(db);
});
app.get("/db", async (req, res) => {
  const db = await ensureDBSynced();
  res.json(db);
});

// Class Assets (Inventaris Kas Kelas 1C) API
app.post("/api/assets", async (req, res) => {
  const assetData = req.body;
  if (!assetData || !assetData.name) {
    return res.status(400).json({ error: "Nama barang/aset wajib diisi" });
  }

  const db = readDB();
  db.assets = db.assets || [];

  if (assetData.id) {
    const idx = db.assets.findIndex((a: any) => a.id === assetData.id);
    if (idx !== -1) {
      db.assets[idx] = { ...db.assets[idx], ...assetData };
    } else {
      db.assets.push(assetData);
    }
  } else {
    const newAsset = {
      ...assetData,
      id: `asset_${Date.now()}`
    };
    db.assets.push(newAsset);
  }

  await writeDB(db);
  res.json({ success: true, assets: db.assets });
});

app.delete("/api/assets/:id", async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.assets = (db.assets || []).filter((a: any) => a.id !== id);
  await writeDB(db);
  res.json({ success: true, assets: db.assets });
});

// Update Global Theme / Visual Style
app.post("/api/settings/theme", async (req, res) => {
  const { themeId } = req.body;
  if (!themeId) {
    return res.status(400).json({ error: "themeId wajib diisi" });
  }

  const db = readDB();
  db.settings = db.settings || {};
  db.settings.themeId = themeId;
  await writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// Update Google Sheets Synchronization Configuration
app.post("/api/settings/google-sheets", async (req, res) => {
  const { config } = req.body;
  const db = readDB();
  db.settings = db.settings || {};
  db.settings.googleSheets = {
    ...(db.settings.googleSheets || {}),
    ...(config || {})
  };
  await writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// Parent / Wali Murid Login API
app.post("/api/login-parent", async (req, res) => {
  const { nickname, password, deviceId } = req.body;
  if (!nickname) {
    return res.status(400).json({ error: "Silakan pilih atau masukkan nama siswa/anak." });
  }

  const db = readDB();
  const query = nickname.trim().toLowerCase();
  const student = db.students.find((s: any) => {
    const nick = (s.nickname || "").trim().toLowerCase();
    const firstWord = s.name.trim().split(/\s+/)[0].toLowerCase();
    const fullName = s.name.trim().toLowerCase();
    const parentName = (s.parentName || "").trim().toLowerCase();
    return nick === query || firstWord === query || fullName === query || parentName === query || s.id === nickname;
  });

  if (!student) {
    return res.status(404).json({ error: "Nama siswa/anak tidak ditemukan di Kelas 1C. Silakan pilih dari daftar siswa." });
  }

  const autoPassword = getAutoPassword(student.nickname, student.name, student.birthday);
  const savedPassword = student.password || autoPassword;
  const birthDay = student.birthday ? student.birthday.split("-")[2] : "";

  // Flexible login: allow saved password, autoPassword, "123", birthday date, or empty if using direct select
  const inputPwd = (password || "").trim().toLowerCase();
  const isValidPassword = 
    !password ||
    inputPwd === "123" || 
    inputPwd === savedPassword.toLowerCase() || 
    inputPwd === autoPassword.toLowerCase() ||
    (birthDay && inputPwd === birthDay) ||
    inputPwd === student.nickname?.toLowerCase();

  if (!isValidPassword) {
    return res.status(401).json({ 
      error: `Kata sandi salah! Sandi bawaan adalah '${autoPassword}' atau cukup gunakan sandi mudah '123'.` 
    });
  }

  if (deviceId) {
    student.activeDeviceId = deviceId;
    writeDB(db).catch(err => console.warn("Background writeDB error on parent login:", err));
  }

  const mustChangePassword = false;
  res.json({ success: true, student, mustChangePassword });
});

// Bendahara Login API
app.post("/api/login-bendahara", async (req, res) => {
  const { password, deviceId } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Sandi Bendahara wajib diisi" });
  }

  const cleanPwd = password.trim();
  const db = readDB();
  const customPwd = db.settings?.bendaharaPassword;

  // Accept MIT2026 (case-insensitive) or common master passwords or custom password
  const isMatch = 
    cleanPwd.toUpperCase() === "MIT2026" ||
    cleanPwd.toLowerCase() === "admin" ||
    cleanPwd === "123456" ||
    cleanPwd === "123" ||
    (customPwd && cleanPwd === customPwd);

  if (!isMatch) {
    return res.status(401).json({ error: "Kata sandi Bendahara salah! Hanya bendahara yang memiliki akses ini." });
  }

  db.settings = db.settings || {};
  if (deviceId) {
    db.settings.activeBendaharaDeviceId = deviceId;
    writeDB(db).catch(err => console.warn("Background writeDB error on bendahara login:", err));
  }

  res.json({ success: true, message: "Berhasil masuk sebagai Bendahara" });
});

// Single-Device Session Validation Check
app.get("/api/check-session", (req, res) => {
  // Always keep session active and valid so user never gets kicked out
  res.json({ sessionValid: true });
});

// Update Student / Parent Password
app.post("/api/students/:id/change-password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Kata sandi baru wajib diisi" });
  }
  if (password === "123") {
    return res.status(400).json({ error: "Sandi baru tidak boleh menggunakan sandi sementara '123'" });
  }

  const db = readDB();
  const student = db.students.find((s: any) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  student.password = password;
  await writeDB(db);
  res.json({ success: true, student });
});

// Reset Student / Parent Password to 123 (Bendahara / Admin tool)
app.post("/api/students/:id/reset-password", async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const student = db.students.find((s: any) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const autoPassword = getAutoPassword(student.nickname, student.name, student.birthday);

  student.password = autoPassword;
  await writeDB(db);
  res.json({ success: true, student, autoPassword });
});

// Create New Student (Registrasi Siswa Baru)
app.post("/api/students", async (req, res) => {
  const { name, nickname, parentName, parentPhone, birthday, photoUrl, initialWeight, initialHeight } = req.body;
  if (!name || !parentName || !parentPhone) {
    return res.status(400).json({ error: "Nama siswa, nama wali murid, dan nomor HP/WA wajib diisi." });
  }

  const db = readDB();
  const todayStr = new Date().toISOString().split("T")[0];
  const chosenNickname = (nickname || name.trim().split(/\s+/)[0]).trim();
  const bDay = birthday || "2019-01-28";
  const autoPassword = getAutoPassword(chosenNickname, name, bDay);

  const newStudent = {
    id: `siswa-${Date.now()}`,
    name,
    nickname: chosenNickname,
    parentName,
    parentPhone,
    birthday: bDay,
    password: autoPassword,
    photoUrl: photoUrl || "",
    sisaKasbon: 0,
    weightLogs: initialWeight ? [{ date: todayStr, value: parseFloat(initialWeight) }] : [],
    heightLogs: initialHeight ? [{ date: todayStr, value: parseFloat(initialHeight) }] : [],
    iuranStatus: [
      "Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026",
      "Januari 2027", "Februari 2027", "Maret 2027", "April 2027", "Mei 2027", "Juni 2027",
      "Juli 2027", "Agustus 2027", "September 2027", "Oktober 2027", "November 2027", "Desember 2027"
    ].map(m => ({ month: m, paid: false, amount: 20000 }))
  };

  db.students.push(newStudent);
  await writeDB(db);
  res.json({ success: true, student: newStudent, autoPassword });
});

// Update Student Bio Data (BB, TB, Birthday, Name, Nickname, Parent Name, Photo)
app.post("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, nickname, parentName, parentPhone, birthday, photoUrl } = req.body;
  const db = readDB();
  const studentIndex = db.students.findIndex((s: any) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const currentStd = db.students[studentIndex];
  const updatedName = name || currentStd.name;
  const updatedNickname = nickname !== undefined ? nickname.trim() : (currentStd.nickname || updatedName.trim().split(/\s+/)[0]);
  const updatedBirthday = birthday || currentStd.birthday;

  // Re-calculate auto password if current password was default or "123"
  let updatedPassword = currentStd.password;
  const expectedAutoPass = getAutoPassword(updatedNickname, updatedName, updatedBirthday);

  if (!updatedPassword || updatedPassword === "123") {
    updatedPassword = expectedAutoPass;
  }

  db.students[studentIndex] = {
    ...currentStd,
    name: updatedName,
    nickname: updatedNickname,
    parentName: parentName || currentStd.parentName,
    parentPhone: parentPhone || currentStd.parentPhone,
    birthday: updatedBirthday,
    password: updatedPassword,
    photoUrl: photoUrl !== undefined ? photoUrl : currentStd.photoUrl,
  };

  await writeDB(db);
  res.json({ success: true, student: db.students[studentIndex] });
});

// Delete Student (Hapus Data Siswa - Bendahara Feature)
app.delete("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.students.findIndex((s: any) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const deleted = db.students.splice(index, 1)[0];
  await writeDB(db);
  res.json({ success: true, deletedStudent: deleted, message: `Siswa ${deleted.name} berhasil dihapus` });
});

app.post("/api/students/:id/delete", async (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const index = db.students.findIndex((s: any) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const deleted = db.students.splice(index, 1)[0];
  await writeDB(db);
  res.json({ success: true, deletedStudent: deleted, message: `Siswa ${deleted.name} berhasil dihapus` });
});

// Add Child Growth Log (Height / Weight)
app.post("/api/students/:id/growth", async (req, res) => {
  const { id } = req.params;
  const { type, value, date } = req.body; // type: 'weight' | 'height', value: number, date: YYYY-MM-DD
  const db = readDB();
  const student = db.students.find((s: any) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const logEntry = { date, value: parseFloat(value) };
  if (type === "weight") {
    student.weightLogs = student.weightLogs || [];
    student.weightLogs.push(logEntry);
    // Sort logs by date
    student.weightLogs.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (type === "height") {
    student.heightLogs = student.heightLogs || [];
    student.heightLogs.push(logEntry);
    // Sort logs by date
    student.heightLogs.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else {
    return res.status(400).json({ error: "Tipe pertumbuhan tidak valid" });
  }

  await writeDB(db);
  res.json({ success: true, student });
});

// Pay monthly class cash (Iuran Kas)
app.post("/api/pay-iuran", async (req, res) => {
  const { studentId, month, amount, datePaid } = req.body;
  const db = readDB();
  const student = db.students.find((s: any) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  // Find or create month status
  student.iuranStatus = student.iuranStatus || [];
  let monthStatus = student.iuranStatus.find((i: any) => i.month === month);

  const payAmount = amount || 20000;

  if (monthStatus) {
    monthStatus.paid = true;
    monthStatus.paidAt = datePaid || new Date().toISOString().split("T")[0];
    monthStatus.amount = payAmount;
  } else {
    monthStatus = {
      month,
      paid: true,
      paidAt: datePaid || new Date().toISOString().split("T")[0],
      amount: payAmount
    };
    student.iuranStatus.push(monthStatus);
  }

  // Create real-time transaction log (IN)
  const txId = "tx-" + Date.now();
  db.transactions.push({
    id: txId,
    type: "IN",
    category: "Iuran Kas",
    amount: payAmount,
    date: datePaid || new Date().toISOString().split("T")[0],
    description: `Iuran Kas ${month} - Siswa: ${student.name} (Wali: ${student.parentName})`
  });

  await writeDB(db);
  res.json({ success: true, student, transactions: db.transactions, dbState: db });
});

// Submit Iuran Kas Confirmation (Wali Murid Mandiri)
app.post("/api/iuran-confirmations", async (req, res) => {
  const { studentId, parentName, months, paymentMethod, proofImage } = req.body;
  const db = readDB();
  const student = db.students.find((s: any) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  if (!months || !Array.isArray(months) || months.length === 0) {
    return res.status(400).json({ error: "Pilih minimal satu bulan yang dibayarkan." });
  }

  const calculatedAmount = months.length * 20000;
  const newConf = {
    id: "ic-" + Date.now(),
    studentId,
    parentName: parentName || student.parentName,
    months,
    amount: calculatedAmount,
    paymentMethod: paymentMethod || "CASH",
    proofImage: proofImage || "",
    status: "PENDING",
    dateSubmitted: new Date().toISOString().split("T")[0]
  };

  db.iuranConfirmations = db.iuranConfirmations || [];
  db.iuranConfirmations.push(newConf);

  await writeDB(db);
  res.json({ success: true, confirmation: newConf, dbState: db });
});

// Process Iuran Confirmation (Bendahara Approval)
app.post("/api/iuran-confirmations/:id/process", async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body; // 'APPROVED' | 'REJECTED'
  const db = readDB();
  db.iuranConfirmations = db.iuranConfirmations || [];
  const conf = db.iuranConfirmations.find((c: any) => c.id === id);

  if (!conf) {
    return res.status(404).json({ error: "Konfirmasi iuran tidak ditemukan" });
  }

  if (conf.status !== "PENDING") {
    return res.status(400).json({ error: "Konfirmasi iuran sudah diproses sebelumnya" });
  }

  conf.status = status;
  conf.dateProcessed = new Date().toISOString().split("T")[0];
  conf.adminNotes = adminNotes || "";

  if (status === "APPROVED") {
    const student = db.students.find((s: any) => s.id === conf.studentId);
    const todayStr = new Date().toISOString().split("T")[0];

    if (student) {
      student.iuranStatus = student.iuranStatus || [];
      conf.months.forEach((m: string) => {
        let monthStatus = student.iuranStatus.find((i: any) => i.month === m);
        if (monthStatus) {
          monthStatus.paid = true;
          monthStatus.paidAt = todayStr;
          monthStatus.amount = 20000;
        } else {
          student.iuranStatus.push({
            month: m,
            paid: true,
            paidAt: todayStr,
            amount: 20000
          });
        }
      });
    }

    // Automatically enter into Buku Besar (Transactions)
    const methodText = conf.paymentMethod === "CASH" ? "Tunai/Cash" : "Transfer Bank";
    const studentNameText = student ? student.name : "Siswa";
    db.transactions.push({
      id: "tx-" + Date.now(),
      type: "IN",
      category: "Iuran Kas",
      amount: conf.amount,
      date: todayStr,
      description: `Pembayaran Iuran Kas Bulan ${conf.months.join(", ")} - Siswa: ${studentNameText} (Wali: ${conf.parentName}) - Metode: ${methodText}`
    });
  }

  await writeDB(db);
  res.json({ success: true, confirmation: conf, dbState: db });
});

// Submit Kasbon Request (Wali Murid)
app.post("/api/kasbons", async (req, res) => {
  const { studentId, parentName, amount, purpose, payoutMethod, bankName, bankAccount, bankAccountName } = req.body;
  const db = readDB();
  const student = db.students.find((s: any) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const selectedPayoutMethod = payoutMethod === "TRANSFER" ? "TRANSFER" : "CASH";

  const newKasbon = {
    id: "kb-" + Date.now(),
    studentId,
    parentName,
    amount: parseInt(amount),
    purpose,
    payoutMethod: selectedPayoutMethod,
    bankName: selectedPayoutMethod === "TRANSFER" ? (bankName || "") : "",
    bankAccount: selectedPayoutMethod === "TRANSFER" ? (bankAccount || "") : "",
    bankAccountName: selectedPayoutMethod === "TRANSFER" ? (bankAccountName || "") : "",
    status: "PENDING",
    dateRequested: new Date().toISOString().split("T")[0]
  };

  db.kasbons = db.kasbons || [];
  db.kasbons.push(newKasbon);

  await writeDB(db);
  res.json({ success: true, kasbon: newKasbon });
});

// Approve/Reject Kasbon Request (Bendahara)
app.post("/api/kasbons/:id/process", async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body; // status: 'APPROVED' | 'REJECTED'
  const db = readDB();
  const kasbon = db.kasbons.find((k: any) => k.id === id);

  if (!kasbon) {
    return res.status(404).json({ error: "Kasbon tidak ditemukan" });
  }

  if (kasbon.status !== "PENDING") {
    return res.status(400).json({ error: "Kasbon sudah diproses sebelumnya" });
  }

  kasbon.status = status;
  kasbon.dateProcessed = new Date().toISOString().split("T")[0];
  kasbon.adminNotes = adminNotes || "";

  if (status === "APPROVED") {
    // Increase student's sisaKasbon debt
    const student = db.students.find((s: any) => s.id === kasbon.studentId);
    if (student) {
      student.sisaKasbon = (student.sisaKasbon || 0) + kasbon.amount;
    }

    // Record class cash OUT transaction
    db.transactions.push({
      id: "tx-" + Date.now(),
      type: "OUT",
      category: "Kasbon",
      amount: kasbon.amount,
      date: new Date().toISOString().split("T")[0],
      description: `Disbursement Kasbon - Wali: ${kasbon.parentName} (${student?.name || "Siswa"}). Keperluan: ${kasbon.purpose}`
    });
  }

  await writeDB(db);
  res.json({ success: true, kasbon });
});

// Verify Receipt / Nota - Pure Image Upload
app.post("/api/verify-receipt", async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "Gambar nota diperlukan." });
  }

  return res.json({
    merchant: "Toko / Koperasi Kelas 1C",
    storeName: "Toko / Koperasi Kelas 1C",
    date: new Date().toISOString().split("T")[0],
    totalAmount: 0,
    items: [],
    confidence: 1.0,
    manualUpload: true
  });
});

// Submit Reimbursement (Rembes) Request
app.post("/api/reimbursements", async (req, res) => {
  const { 
    studentId, parentName, amount, purpose, 
    fromKasbon, kasbonId, kasbonAmount,
    returnMethod, returnProofImage,
    payoutMethod, bankName, bankAccount, bankAccountName, 
    receiptImage, itemPhoto, isGeneratedNota, ocrResult 
  } = req.body;
  
  const db = readDB();
  const student = db.students.find((s: any) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: "Siswa tidak ditemukan" });
  }

  const originalAmount = parseInt(amount) || 0; // Nilai Nota
  const isFromKasbon = Boolean(fromKasbon);
  const targetKasbonAmount = isFromKasbon ? (parseInt(kasbonAmount) || student.sisaKasbon || 0) : 0;

  // Deducted amount is how much of the Kasbon debt is settled by this receipt
  const deductedAmount = isFromKasbon ? Math.min(targetKasbonAmount, originalAmount) : 0;
  
  // Final payable amount: if Nota > Kasbon (or not from Kasbon), how much Bendahara pays to Wali
  const finalPayableAmount = isFromKasbon ? Math.max(0, originalAmount - targetKasbonAmount) : originalAmount;

  const newReimbursement = {
    id: "rb-" + Date.now(),
    studentId,
    parentName,
    amount: originalAmount,
    purpose,
    fromKasbon: isFromKasbon,
    kasbonId: kasbonId || "",
    kasbonAmount: targetKasbonAmount,
    returnMethod: returnMethod || undefined,
    returnProofImage: returnProofImage || "",
    payoutMethod: payoutMethod || "TRANSFER",
    bankName: bankName || "",
    bankAccount: bankAccount || "",
    bankAccountName: bankAccountName || "",
    receiptImage: receiptImage || "",
    itemPhoto: itemPhoto || "",
    isGeneratedNota: Boolean(isGeneratedNota),
    status: "PENDING",
    dateRequested: new Date().toISOString().split("T")[0],
    originalAmount,
    deductedAmount,
    finalPayableAmount,
    ocrResult: ocrResult || null
  };

  db.reimbursements = db.reimbursements || [];
  db.reimbursements.push(newReimbursement);

  await writeDB(db);
  res.json({ success: true, reimbursement: newReimbursement, dbState: db });
});

// Approve/Reject Reimbursement (Bendahara)
app.post("/api/reimbursements/:id/process", async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body; // status: 'APPROVED' | 'REJECTED'
  const db = readDB();
  const rembes = db.reimbursements.find((r: any) => r.id === id);

  if (!rembes) {
    return res.status(404).json({ error: "Rembes tidak ditemukan" });
  }

  if (rembes.status !== "PENDING") {
    return res.status(400).json({ error: "Pengajuan rembesan sudah diproses sebelumnya" });
  }

  rembes.status = status;
  rembes.dateProcessed = new Date().toISOString().split("T")[0];
  rembes.adminNotes = adminNotes || "";

  if (status === "APPROVED") {
    const student = db.students.find((s: any) => s.id === rembes.studentId);
    const todayStr = new Date().toISOString().split("T")[0];

    if (rembes.fromKasbon) {
      const kasbonVal = rembes.kasbonAmount || 0;
      const notaVal = rembes.amount || 0;

      if (student) {
        // Reduce student's kasbon debt by total kasbonVal (both deducted by receipt + excess returned cash/transfer)
        student.sisaKasbon = Math.max(0, (student.sisaKasbon || 0) - kasbonVal);
      }

      // If Nota < Kasbon: Wali returned excess money
      if (notaVal < kasbonVal) {
        const excessReturned = kasbonVal - notaVal;
        const methodStr = rembes.returnMethod === "CASH" ? "Cash/Tunai" : "Transfer Bank";
        
        db.transactions.push({
          id: "tx-" + Date.now(),
          type: "IN",
          category: "Kasbon",
          amount: excessReturned,
          date: todayStr,
          description: `Pengembalian Kelebihan Kasbon (Kasbon: Rp ${kasbonVal.toLocaleString("id-ID")}, Nota: Rp ${notaVal.toLocaleString("id-ID")}) via ${methodStr} - Wali: ${rembes.parentName} (${student?.name || "Siswa"})`
        });
      }

      // Record settlement of Kasbon portion matched by receipt
      if (rembes.deductedAmount > 0) {
        db.transactions.push({
          id: "tx-" + (Date.now() + 1),
          type: "IN",
          category: "Kasbon",
          amount: rembes.deductedAmount,
          date: todayStr,
          description: `Pelunasan Kasbon via Rembesan Struk - Wali: ${rembes.parentName} (${student?.name || "Siswa"}). Nilai Nota: Rp ${rembes.deductedAmount.toLocaleString("id-ID")}`
        });
      }

      // If Nota > Kasbon: Bendahara pays the excess difference to Wali
      if (rembes.finalPayableAmount > 0) {
        const payoutStr = rembes.payoutMethod === "CASH" ? "Cash/Tunai" : `Transfer (${rembes.bankName || "Bank"})`;
        db.transactions.push({
          id: "tx-" + (Date.now() + 2),
          type: "OUT",
          category: "Rembes",
          amount: rembes.finalPayableAmount,
          date: todayStr,
          description: `Pencairan Kekurangan Rembesan (Nota > Kasbon) via ${payoutStr} - Wali: ${rembes.parentName} (${student?.name || "Siswa"})`
        });
      }
    } else {
      // Direct Rembesan (Tidak dari kasbon)
      if (rembes.finalPayableAmount > 0) {
        const payoutStr = rembes.payoutMethod === "CASH" ? "Cash/Tunai" : `Transfer (${rembes.bankName || "Bank"})`;
        db.transactions.push({
          id: "tx-" + Date.now(),
          type: "OUT",
          category: "Rembes",
          amount: rembes.finalPayableAmount,
          date: todayStr,
          description: `Pencairan Rembesan Langsung via ${payoutStr} - Wali: ${rembes.parentName} (${student?.name || "Siswa"}). Keperluan: ${rembes.purpose}`
        });
      }
    }
  }

  await writeDB(db);
  res.json({ success: true, reimbursement: rembes, dbState: db });
});

const handleCreateTransaction = async (req: any, res: any) => {
  try {
    const { type, category, amount, description, date, studentId, studentName, parentName, months, proofImage, storeName, items, isGeneratedNota } = req.body;
    const db = readDB();

    const todayStr = new Date().toISOString().split("T")[0];
    let finalAmount = parseInt(amount) || 0;
    let finalDesc = description || "Transaksi Kas Kelas 1C";
    let finalStudent = studentId ? db.students.find((s: any) => s.id === studentId) : null;

    // If manual transaction is for Iuran Kas with selected student and months
    if (category === "Iuran Kas" && type === "IN" && studentId && months && Array.isArray(months) && months.length > 0) {
      const student = finalStudent || db.students.find((s: any) => s.id === studentId);
      if (student) {
        finalStudent = student;
        finalAmount = months.length * 20000;
        finalDesc = `Iuran Kas Bulan ${months.join(", ")} - Siswa: ${student.name} (Wali: ${student.parentName})`;

        student.iuranStatus = student.iuranStatus || [];
        months.forEach((m: string) => {
          let monthStatus = student.iuranStatus.find((i: any) => i.month === m);
          if (monthStatus) {
            monthStatus.paid = true;
            monthStatus.paidAt = date || todayStr;
            monthStatus.amount = 20000;
          } else {
            student.iuranStatus.push({
              month: m,
              paid: true,
              paidAt: date || todayStr,
              amount: 20000
            });
          }
        });
      }
    }

    const newTx = {
      id: "tx-" + Date.now(),
      type: type || "IN", // 'IN' | 'OUT'
      category: category || "Iuran Kas",
      amount: finalAmount,
      description: finalDesc,
      date: date || todayStr,
      studentId: finalStudent ? finalStudent.id : (studentId || undefined),
      studentName: finalStudent ? finalStudent.name : (studentName || undefined),
      parentName: finalStudent ? finalStudent.parentName : (parentName || undefined),
      storeName: storeName || undefined,
      items: Array.isArray(items) ? items : undefined,
      proofImage: proofImage || undefined,
      isGeneratedNota: Boolean(isGeneratedNota)
    };

    db.transactions.push(newTx);
    await writeDB(db);
    res.json({ success: true, transaction: newTx, dbState: db });
  } catch (err: any) {
    console.error("Error saving transaction:", err);
    res.status(500).json({ error: "Gagal menyimpan transaksi: " + (err?.message || "Internal server error") });
  }
};

app.post("/api/transactions", handleCreateTransaction);
app.post("/transactions", handleCreateTransaction);

// Helper to robustly extract ID on Vercel serverless / Express
function extractId(req: any): string {
  let id = req.params?.id || req.body?.id;
  if (!id && req.url) {
    const cleanUrl = req.url.split('?')[0].replace(/\/+$/, '');
    const parts = cleanUrl.split('/');
    const foundTx = parts.find(p => typeof p === 'string' && p.startsWith('tx-'));
    if (foundTx) return foundTx;
    id = parts[parts.length - 1];
  }
  if (!id && req.query?.path) {
    const p = req.query.path;
    if (Array.isArray(p)) {
      const foundTx = p.find(item => typeof item === 'string' && item.startsWith('tx-'));
      if (foundTx) return foundTx;
      id = p[p.length - 1];
    } else if (typeof p === 'string') {
      const cleanP = p.split('?')[0].replace(/\/+$/, '');
      if (cleanP.startsWith('tx-')) return cleanP;
      const parts = cleanP.split('/');
      id = parts[parts.length - 1];
    }
  }
  return id || "";
}

// Edit Existing Transaction (Bendahara)
const handleEditTransaction = async (req: any, res: any) => {
  try {
    const id = extractId(req);
    const { type, category, amount, description, date, storeName, storeAddress, parentName, studentId, studentName, items, proofImage, isGeneratedNota } = req.body;
    
    let db: any = null;
    try {
      db = await ensureDBSynced(true);
    } catch (e) {
      db = readDB();
    }
    if (!db || !db.transactions || !Array.isArray(db.transactions)) {
      db = readDB();
    }
    if (!db.transactions || !Array.isArray(db.transactions)) {
      db.transactions = [];
    }

    const index = db.transactions.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan (ID: " + id + ")" });
    }

    const tx = db.transactions[index];
    if (type) tx.type = type;
    if (category) tx.category = category;
    if (amount !== undefined) tx.amount = parseInt(amount) || 0;
    if (description) tx.description = description;
    if (date) tx.date = date;
    if (studentId !== undefined) tx.studentId = studentId;
    if (studentName !== undefined) tx.studentName = studentName;
    if (storeName !== undefined) tx.storeName = storeName;
    if (storeAddress !== undefined) tx.storeAddress = storeAddress;
    if (parentName !== undefined) tx.parentName = parentName;
    if (items !== undefined) tx.items = items;
    if (proofImage !== undefined) tx.proofImage = proofImage;
    if (isGeneratedNota !== undefined) tx.isGeneratedNota = Boolean(isGeneratedNota);

    db = sanitizeIuranData(db);

    try {
      await writeDB(db);
    } catch (writeErr) {
      console.warn("Firestore write warning in edit:", writeErr);
    }

    res.json({ success: true, transaction: tx, dbState: db });
  } catch (err: any) {
    console.error("Error editing transaction:", err);
    res.status(500).json({ error: "Gagal memperbarui transaksi: " + (err?.message || "Internal error") });
  }
};

app.put("/api/transactions/:id", handleEditTransaction);
app.put("/transactions/:id", handleEditTransaction);
app.post("/api/transactions/:id/edit", handleEditTransaction);
app.post("/transactions/:id/edit", handleEditTransaction);

const handleDeleteTransactionRoute = async (req: any, res: any) => {
  try {
    const id = extractId(req);
    if (!id) {
      return res.status(400).json({ error: "ID transaksi tidak valid" });
    }
    let db: any = null;
    try {
      db = await ensureDBSynced(true);
    } catch (e) {
      db = readDB();
    }
    if (!db || !db.transactions || !Array.isArray(db.transactions)) {
      db = readDB();
    }
    if (!db.transactions || !Array.isArray(db.transactions)) {
      db.transactions = [];
    }
    const index = db.transactions.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan (ID: " + id + ")" });
    }
    db.transactions.splice(index, 1);
    db = sanitizeIuranData(db);

    try {
      await writeDB(db);
    } catch (writeErr) {
      console.warn("Firestore write warning in delete:", writeErr);
    }
    res.json({ success: true, dbState: db });
  } catch (err: any) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ error: "Gagal menghapus transaksi: " + (err?.message || "Internal error") });
  }
};

// Delete Transaction Endpoint
app.delete("/api/transactions/:id", handleDeleteTransactionRoute);
app.delete("/transactions/:id", handleDeleteTransactionRoute);
app.post("/api/transactions/:id/delete", handleDeleteTransactionRoute);
app.post("/transactions/:id/delete", handleDeleteTransactionRoute);

// Reset Database API (Bendahara)
app.post("/api/reset-database", async (req, res) => {
  const cleanData = {
    students: [],
    transactions: [],
    kasbons: [],
    reimbursements: [],
    iuranConfirmations: [],
    settings: { themeId: "candy" }
  };
  await writeDB(cleanData);
  res.json({ success: true, message: "Semua data transaksi, siswa, kasbon, & rembesan berhasil dikosongkan!", dbState: cleanData });
});

// Restore / Import Database JSON API
app.post("/api/restore-database", async (req, res) => {
  try {
    const importedData = req.body.dbState || req.body;
    if (!importedData || (!Array.isArray(importedData.students) && !Array.isArray(importedData.transactions))) {
      return res.status(400).json({ error: "Format file JSON cadangan tidak valid. Pastikan berisi data siswa atau transaksi." });
    }

    const currentDb = readDB();
    const sanitized = sanitizeIuranData({
      students: Array.isArray(importedData.students) ? importedData.students : currentDb.students,
      transactions: Array.isArray(importedData.transactions) ? importedData.transactions : currentDb.transactions,
      kasbons: Array.isArray(importedData.kasbons) ? importedData.kasbons : (currentDb.kasbons || []),
      reimbursements: Array.isArray(importedData.reimbursements) ? importedData.reimbursements : (currentDb.reimbursements || []),
      iuranConfirmations: Array.isArray(importedData.iuranConfirmations) ? importedData.iuranConfirmations : (currentDb.iuranConfirmations || []),
      assets: Array.isArray(importedData.assets) ? importedData.assets : (currentDb.assets || []),
      settings: importedData.settings || currentDb.settings || {}
    });

    await writeDB(sanitized);
    res.json({ success: true, message: "Data berhasil dipulihkan / diimpor!", dbState: sanitized });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memproses pengimporan data: " + err.message });
  }
});

// ==========================================
// Vite Dev server or static files setup
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vitePkg = "vite";
    const { createServer: createViteServer } = await import(vitePkg);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
