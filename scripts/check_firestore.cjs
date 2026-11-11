const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

const FIRESTORE_CLOUD_CONFIG = {
  projectId: "smart-league-czp2g",
  appId: "1:401246954965:web:294bca30e0c5cfaf48c95c",
  apiKey: "AIzaSyBOEnYHenHp8emJTkDq98V-k1q7mIHvi6Q",
  authDomain: "smart-league-czp2g.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-kaskelas1c-b57958dd-6772-4270-abe8-5fe7f2bcfd85",
  storageBucket: "smart-league-czp2g.firebasestorage.app",
  messagingSenderId: "401246954965"
};

async function check() {
  try {
    const fbApp = initializeApp(FIRESTORE_CLOUD_CONFIG, "check-app");
    const firestoreDb = getFirestore(fbApp, FIRESTORE_CLOUD_CONFIG.firestoreDatabaseId);

    const [studentsSnap, txSnap, extrasSnap] = await Promise.all([
      getDoc(doc(firestoreDb, "appData", "students")),
      getDoc(doc(firestoreDb, "appData", "transactions")),
      getDoc(doc(firestoreDb, "appData", "financeExtras"))
    ]);

    console.log("Students exists:", studentsSnap.exists());
    console.log("Tx exists:", txSnap.exists());
    
    if (txSnap.exists()) {
      const txs = txSnap.data().transactions || [];
      console.log("Total Transactions in Firestore Cloud:", txs.length);
      console.log("Latest 5 transactions:");
      console.log(JSON.stringify(txs.slice(-5), null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error("Firestore check error:", err);
    process.exit(1);
  }
}

check();
