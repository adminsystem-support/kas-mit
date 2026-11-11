const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const FIRESTORE_CLOUD_CONFIG = {
  projectId: "smart-league-czp2g",
  appId: "1:401246954965:web:294bca30e0c5cfaf48c95c",
  apiKey: "AIzaSyBOEnYHenHp8emJTkDq98V-k1q7mIHvi6Q",
  authDomain: "smart-league-czp2g.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-kaskelas1c-b57958dd-6772-4270-abe8-5fe7f2bcfd85",
  storageBucket: "smart-league-czp2g.firebasestorage.app",
  messagingSenderId: "401246954965"
};

async function pull() {
  try {
    const fbApp = initializeApp(FIRESTORE_CLOUD_CONFIG, "pull-app");
    const firestoreDb = getFirestore(fbApp, FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);

    const [studentsSnap, txSnap, extrasSnap, settingsSnap] = await Promise.all([
      getDoc(doc(firestoreDb, "appData", "students")),
      getDoc(doc(firestoreDb, "appData", "transactions")),
      getDoc(doc(firestoreDb, "appData", "financeExtras")),
      getDoc(doc(firestoreDb, "appData", "settings"))
    ]);

    const students = studentsSnap.exists() ? studentsSnap.data().students || [] : [];
    const transactions = txSnap.exists() ? txSnap.data().transactions || [] : [];
    const extras = extrasSnap.exists() ? extrasSnap.data() || {} : {};
    const settings = settingsSnap.exists() ? settingsSnap.data().settings || {} : {};

    const fullDb = {
      students,
      transactions,
      kasbons: extras.kasbons || [],
      reimbursements: extras.reimbursements || [],
      iuranConfirmations: extras.iuranConfirmations || [],
      assets: extras.assets || [],
      settings: settings || { themeId: "emerald" }
    };

    console.log(`Fetched ${students.length} students, ${transactions.length} transactions from Cloud Firestore.`);

    const dbPath = path.resolve(process.cwd(), "db.json");
    fs.writeFileSync(dbPath, JSON.stringify(fullDb, null, 2), "utf-8");
    console.log(`Updated local db.json with ${transactions.length} transactions.`);
    process.exit(0);
  } catch (err) {
    console.error("Error pulling Firestore database:", err);
    process.exit(1);
  }
}

pull();
