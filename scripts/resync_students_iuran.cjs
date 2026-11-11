const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const dbPath = path.resolve(__dirname, '../db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const defaultMonths = [
  'Juli 2026', 'Agustus 2026', 'September 2026', 'Oktober 2026',
  'November 2026', 'Desember 2026', 'Januari 2027', 'Februari 2027',
  'Maret 2027', 'April 2027', 'Mei 2027', 'Juni 2027',
  'Juli 2027', 'Agustus 2027', 'September 2027', 'Oktober 2027',
  'November 2027', 'Desember 2027'
];

console.log('Total students:', db.students.length);
console.log('Total transactions:', db.transactions.length);

// 1. Reset all student iuranStatus to unpaid
db.students.forEach(student => {
  student.iuranStatus = defaultMonths.map(m => ({
    month: m,
    paid: false,
    amount: 20000
  }));
});

// 2. Mark paid months strictly from active transactions
db.transactions.forEach(tx => {
  if (tx.type === 'IN' && (tx.category === 'Iuran Kas' || (tx.description && tx.description.toLowerCase().includes('iuran kas')))) {
    const student = db.students.find(s => s.id === tx.studentId || (tx.studentName && s.name.toLowerCase() === tx.studentName.toLowerCase()));
    if (student) {
      let paidMonths = Array.isArray(tx.monthsPaid) ? tx.monthsPaid : [];
      if (paidMonths.length === 0 && tx.description) {
        defaultMonths.forEach(m => {
          if (tx.description.includes(m)) paidMonths.push(m);
        });
      }
      paidMonths.forEach(m => {
        const item = student.iuranStatus.find(i => i.month === m);
        if (item) {
          item.paid = true;
          item.paidAt = tx.date || '2026-11-08';
        }
      });
    }
  }
});

// Write to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Updated db.json successfully!');

// Verification for Yanzelin, Aysha, Syihab
['zelin', 'aysha', 'syihab'].forEach(query => {
  const s = db.students.find(st => st.name.toLowerCase().includes(query));
  if (s) {
    console.log(`Student ${s.name}:`);
    console.log('  Paid months:', s.iuranStatus.filter(i => i.paid).map(i => i.month));
    console.log('  November paid?:', s.iuranStatus.find(i => i.month === 'November 2026')?.paid);
    console.log('  Desember paid?:', s.iuranStatus.find(i => i.month === 'Desember 2026')?.paid);
  }
});

// Sync to Cloud Firestore
const FIRESTORE_CLOUD_CONFIG = {
  projectId: "smart-league-czp2g",
  appId: "1:401246954965:web:294bca30e0c5cfaf48c95c",
  apiKey: "AIzaSyBOEnYHenHp8emJTkDq98V-k1q7mIHvi6Q",
  authDomain: "smart-league-czp2g.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-kaskelas1c-b57958dd-6772-4270-abe8-5fe7f2bcfd85",
  storageBucket: "smart-league-czp2g.firebasestorage.app",
  messagingSenderId: "401246954965"
};

async function syncFirestore() {
  try {
    const fbApp = initializeApp(FIRESTORE_CLOUD_CONFIG, "resync-iuran-app");
    const firestoreDb = getFirestore(fbApp, FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);

    await Promise.all([
      setDoc(doc(firestoreDb, "appData", "students"), {
        students: db.students || []
      }),
      setDoc(doc(firestoreDb, "appData", "transactions"), {
        transactions: db.transactions || []
      }),
      setDoc(doc(firestoreDb, "appData", "financeExtras"), {
        kasbons: db.kasbons || [],
        reimbursements: db.reimbursements || [],
        iuranConfirmations: db.iuranConfirmations || [],
        assets: db.assets || []
      }),
      setDoc(doc(firestoreDb, "appData", "settings"), {
        settings: db.settings || {},
        updatedAt: new Date().toISOString()
      })
    ]);

    console.log('Successfully synced resynced student iuranStatus to Cloud Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing to Firestore:', err);
    process.exit(1);
  }
}

syncFirestore();
