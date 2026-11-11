const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const dbPath = path.resolve(__dirname, '../db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

console.log('Total transactions before:', db.transactions.length);
const octTxs = db.transactions.filter(t => t.date && t.date.startsWith('2026-10'));
console.log('October transactions to remove:', octTxs.length);

// Keep all transactions EXCEPT October 2026
db.transactions = db.transactions.filter(t => !t.date || !t.date.startsWith('2026-10'));
console.log('Total transactions after removal:', db.transactions.length);

// Reset October 2026 iuranStatus for all students so user can re-input fresh
db.students.forEach(student => {
  if (Array.isArray(student.iuranStatus)) {
    student.iuranStatus.forEach(status => {
      if (status.month === 'Oktober 2026') {
        status.paid = false;
        delete status.paidAt;
      }
    });
  }
});

// Write to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully updated local db.json');

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
    const fbApp = initializeApp(FIRESTORE_CLOUD_CONFIG, "clear-oct-app");
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

    console.log('Successfully synced cleared October transactions to Cloud Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('Error syncing to Firestore:', err);
    process.exit(1);
  }
}

syncFirestore();
