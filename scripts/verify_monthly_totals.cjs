const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(process.cwd(), "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const months2026 = [
  { name: "Juli 2026", prefix: "2026-07" },
  { name: "Agustus 2026", prefix: "2026-08" },
  { name: "September 2026", prefix: "2026-09" },
  { name: "Oktober 2026", prefix: "2026-10" },
  { name: "November 2026", prefix: "2026-11" },
  { name: "Desember 2026", prefix: "2026-12" }
];

let runningBalance = 0;
console.log("=== MONTHLY BREAKDOWN CHECK ===");
months2026.forEach(m => {
  const txs = db.transactions.filter(t => t.date && t.date.startsWith(m.prefix));
  const inAmount = txs.filter(t => t.type === "IN").reduce((acc, t) => acc + (t.amount || 0), 0);
  const outAmount = txs.filter(t => t.type === "OUT").reduce((acc, t) => acc + (t.amount || 0), 0);
  const startBal = runningBalance;
  runningBalance += (inAmount - outAmount);
  console.log(`${m.name}: Awal=${startBal}, Masuk=${inAmount}, Keluar=${outAmount}, Akhir=${runningBalance}`);
});

const totalIn = db.transactions.filter(t => t.type === "IN").reduce((acc, t) => acc + (t.amount || 0), 0);
const totalOut = db.transactions.filter(t => t.type === "OUT").reduce((acc, t) => acc + (t.amount || 0), 0);

console.log(`\nTOTAL IN: ${totalIn}, TOTAL OUT: ${totalOut}, SALDO: ${totalIn - totalOut}`);
