const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(process.cwd(), "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const zelinTx = db.transactions.filter(t => t.description && t.description.toLowerCase().includes("yanzelin"));
console.log("Yanzelin transactions count:", zelinTx.length);
console.log(JSON.stringify(zelinTx, null, 2));

const totalIn = db.transactions.filter(t => t.type === "IN").reduce((acc, t) => acc + (t.amount || 0), 0);
const totalOut = db.transactions.filter(t => t.type === "OUT").reduce((acc, t) => acc + (t.amount || 0), 0);
console.log(`Total IN: ${totalIn}, Total OUT: ${totalOut}, Saldo: ${totalIn - totalOut}`);

// Check Yanzelin student object
const zelinStudent = db.students.find(s => s.name.toLowerCase().includes("yanzelin"));
console.log("Yanzelin student found:", !!zelinStudent);
if (zelinStudent) {
  console.log("Yanzelin iuranStatus for Nov & Des 2026:");
  console.log(zelinStudent.iuranStatus.filter(i => i.month.includes("2026")));
}
