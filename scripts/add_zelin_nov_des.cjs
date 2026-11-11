const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const dbPath = path.resolve(process.cwd(), "db.json");
const seedPath = path.resolve(process.cwd(), "src/seedData.ts");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Find Yanzelin student object
const zelinStudent = db.students.find(s => s.name.toLowerCase().includes("yanzelin"));

const newTx = {
  id: "tx-1794195887199",
  type: "IN",
  category: "Iuran Kas",
  amount: 40000,
  date: "2026-11-09",
  description: "Iuran Kas Bulan November 2026, Desember 2026 - Siswa: Yanzelin Gadis Solihin (Wali: Linda H)",
  studentId: zelinStudent ? zelinStudent.id : "siswa-1785121337492",
  studentName: zelinStudent ? zelinStudent.name : "Yanzelin Gadis Solihin",
  parentName: zelinStudent ? zelinStudent.parentName : "Linda H",
  monthsPaid: ["November 2026", "Desember 2026"],
  isGeneratedNota: false
};

// Check if transaction already exists
const exists = db.transactions.some(t => t.id === newTx.id || (t.description && t.description.includes("Yanzelin Gadis Solihin") && t.description.includes("November 2026, Desember 2026")));

if (!exists) {
  db.transactions.unshift(newTx);
  console.log("Added Yanzelin +Rp 40.000 transaction (Nov & Des 2026).");
}

if (zelinStudent) {
  zelinStudent.iuranStatus = zelinStudent.iuranStatus || [];
  ["November 2026", "Desember 2026"].forEach(m => {
    let item = zelinStudent.iuranStatus.find(i => i.month === m);
    if (item) {
      item.paid = true;
      item.paidAt = "2026-11-09";
      item.amount = 20000;
    } else {
      zelinStudent.iuranStatus.push({ month: m, paid: true, paidAt: "2026-11-09", amount: 20000 });
    }
  });
}

// Calculate totals
const totalIn = db.transactions.filter(t => t.type === "IN").reduce((acc, t) => acc + (t.amount || 0), 0);
const totalOut = db.transactions.filter(t => t.type === "OUT").reduce((acc, t) => acc + (t.amount || 0), 0);

console.log(`Total IN: ${totalIn}, Total OUT: ${totalOut}, Saldo: ${totalIn - totalOut}`);

// Save db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

// Save src/seedData.ts
const tsContent = `import { DBState } from "./types";

export const INITIAL_SEED_DATA: DBState = ${JSON.stringify(db, null, 2)};
`;
fs.writeFileSync(seedPath, tsContent, "utf-8");

// Save to Cloud Firestore
const FIRESTORE_CLOUD_CONFIG = {
  projectId: "smart-league-czp2g",
  appId: "1:401246954965:web:294bca30e0c5cfaf48c95c",
  apiKey: "AIzaSyBOEnYHenHp8emJTkDq98V-k1q7mIHvi6Q",
  authDomain: "smart-league-czp2g.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-kaskelas1c-b57958dd-6772-4270-abe8-5fe7f2bcfd85",
  storageBucket: "smart-league-czp2g.firebasestorage.app",
  messagingSenderId: "401246954965"
};

async function pushCloud() {
  try {
    const fbApp = initializeApp(FIRESTORE_CLOUD_CONFIG, "zelin-app");
    const firestoreDb = getFirestore(fbApp, FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);

    await Promise.all([
      setDoc(doc(firestoreDb, "appData", "students"), { students: db.students || [] }),
      setDoc(doc(firestoreDb, "appData", "transactions"), { transactions: db.transactions || [] }),
      setDoc(doc(firestoreDb, "appData", "financeExtras"), {
        kasbons: db.kasbons || [],
        reimbursements: db.reimbursements || [],
        iuranConfirmations: db.iuranConfirmations || [],
        assets: db.assets || []
      }),
      setDoc(doc(firestoreDb, "appData", "settings"), { settings: db.settings || {}, updatedAt: new Date().toISOString() })
    ]);
    console.log("Pushed Yanzelin transaction and updated totals to Cloud Firestore successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Cloud push error:", err);
    process.exit(1);
  }
}

pushCloud();
