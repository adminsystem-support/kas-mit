const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(process.cwd(), "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Target amounts per month according to Image 2 (kas-kelas-1c.ai.studio):
// Juli 2026: In 920.000, Out 265.000 -> End 655.000
// Agustus 2026: In 1.300.000, Out 416.000 -> End 1.539.000
// September 2026: In 560.000, Out 538.000 -> End 1.561.000
// Oktober 2026: In 320.000, Out 254.500 -> End 1.626.500
// November 2026: In 200.000, Out 122.000 -> End 1.704.500
// Desember 2026: In 0, Out 0 -> End 1.704.500

console.log("=== CHECKING TRANSACTIONS IN SEPT & OKT ===");
const septTxs = db.transactions.filter(t => t.date && t.date.startsWith("2026-09"));
const oktTxs = db.transactions.filter(t => t.date && t.date.startsWith("2026-10"));

console.log("September transactions:");
septTxs.forEach(t => console.log(`  [${t.date}] ${t.type} Rp ${t.amount} - ${t.description}`));

console.log("\nOktober transactions:");
oktTxs.forEach(t => console.log(`  [${t.date}] ${t.type} Rp ${t.amount} - ${t.description}`));
