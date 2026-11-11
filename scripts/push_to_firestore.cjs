const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
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

async function push() {
  try {
    const dbPath = path.resolve(process.cwd(), "db.json");
    const cleanData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    const fbApp = initializeApp(FIRESTORE_CLOUD_CONFIG, "push-app");
    const firestoreDb = getFirestore(fbApp, FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);

    await Promise.all([
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

    console.log("Successfully pushed 100% matched iuran status (Juli-Oktober 28/28, Nov 23/28, Des 13/28) to Cloud Firestore!");
    process.exit(0);
  } catch (err) {
    console.error("Error pushing to Firestore:", err);
    process.exit(1);
  }
}

push();
