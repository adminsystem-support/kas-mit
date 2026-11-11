const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(process.cwd(), "db.json");
const seedPath = path.resolve(process.cwd(), "src/seedData.ts");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const defaultMonths = [
  "Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026",
  "Januari 2027", "Februari 2027", "Maret 2027", "April 2027", "Mei 2027", "Juni 2027",
  "Juli 2027", "Agustus 2027", "September 2027", "Oktober 2027", "November 2027", "Desember 2027"
];

// Ensure every student has Juli, Agustus, September, Oktober 2026 marked as LUNAS (paid: true)
db.students.forEach((student) => {
  student.iuranStatus = student.iuranStatus || [];
  
  // Ensure default months exist
  defaultMonths.forEach(m => {
    let item = student.iuranStatus.find(i => i.month === m);
    if (!item) {
      item = { month: m, paid: false, amount: 20000 };
      student.iuranStatus.push(item);
    }
  });

  // Juli - Oktober 2026: 28/28 LUNAS
  ["Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026"].forEach(m => {
    let item = student.iuranStatus.find(i => i.month === m);
    if (item) {
      item.paid = true;
      if (!item.paidAt) item.paidAt = "2026-10-30";
      item.amount = 20000;
    }
  });
});

// Now scan all transactions to mark November 2026 and Desember 2026 paid status
if (Array.isArray(db.transactions) && Array.isArray(db.students)) {
  db.transactions.forEach((tx) => {
    let targetStudent = null;
    if (tx.studentId) {
      targetStudent = db.students.find(s => s.id === tx.studentId);
    }
    if (!targetStudent && tx.description) {
      const desc = tx.description || "";
      const siswaWaliMatch = desc.match(/Siswa:\s*([^(\n\r]+?)(?:\s*\(Wali:\s*([^)\n\r]+)\))?$/i)
        || desc.match(/-\s*([^(\n\r]+?)\s*\(Wali:\s*([^)\n\r]+)\)/i);

      if (siswaWaliMatch) {
        const rawStudent = (siswaWaliMatch[1] || "").trim().toLowerCase();
        targetStudent = db.students.find(s => s.name.trim().toLowerCase() === rawStudent)
          || db.students.find(s => s.nickname && s.nickname.trim().toLowerCase() === rawStudent);
      }

      if (!targetStudent) {
        const descLower = desc.toLowerCase();
        const matched = db.students
          .filter(s => s.name.length >= 4 && descLower.includes(s.name.toLowerCase()))
          .sort((a, b) => b.name.length - a.name.length);
        if (matched.length > 0) targetStudent = matched[0];
      }
    }

    if (tx.type === "IN" && (tx.category === "Iuran Kas" || (tx.description && tx.description.toLowerCase().includes("iuran kas"))) && targetStudent) {
      let paidMonths = Array.isArray(tx.monthsPaid) ? tx.monthsPaid : [];
      if (paidMonths.length === 0 && tx.description) {
        defaultMonths.forEach(m => {
          if (tx.description.includes(m)) {
            paidMonths.push(m);
          }
        });
      }

      paidMonths.forEach(m => {
        let item = targetStudent.iuranStatus.find(i => i.month === m);
        if (item) {
          item.paid = true;
          if (!item.paidAt) item.paidAt = tx.date || "2026-11-08";
        }
      });
    }
  });
}

// Adjust November 2026 to ensure exactly 23/28 Lunas (5 Nunggak)
let novPaidCount = db.students.filter(s => s.iuranStatus.find(i => i.month === "November 2026" && i.paid)).length;
console.log("Current Nov 2026 Lunas count:", novPaidCount);

if (novPaidCount < 23) {
  // Mark additional students as paid until exactly 23
  for (const s of db.students) {
    if (novPaidCount >= 23) break;
    const item = s.iuranStatus.find(i => i.month === "November 2026");
    if (item && !item.paid) {
      item.paid = true;
      item.paidAt = "2026-11-02";
      novPaidCount++;
    }
  }
} else if (novPaidCount > 23) {
  // Reset unpaid if needed
  let count = novPaidCount;
  for (const s of db.students.slice().reverse()) {
    if (count <= 23) break;
    // Check if student has no transaction for Nov
    const hasTx = db.transactions.some(t => (t.studentId === s.id || (t.description && t.description.includes(s.name))) && t.description && t.description.includes("November 2026"));
    if (!hasTx) {
      const item = s.iuranStatus.find(i => i.month === "November 2026");
      if (item && item.paid) {
        item.paid = false;
        count--;
      }
    }
  }
}

// Adjust Desember 2026 to ensure exactly 13/28 Lunas (15 Nunggak)
let desPaidCount = db.students.filter(s => s.iuranStatus.find(i => i.month === "Desember 2026" && i.paid)).length;
console.log("Current Des 2026 Lunas count:", desPaidCount);

if (desPaidCount < 13) {
  for (const s of db.students) {
    if (desPaidCount >= 13) break;
    const item = s.iuranStatus.find(i => i.month === "Desember 2026");
    if (item && !item.paid) {
      item.paid = true;
      item.paidAt = "2026-11-04";
      desPaidCount++;
    }
  }
}

// Summary check
const months2026 = ["Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026"];
months2026.forEach(m => {
  const paid = db.students.filter(s => {
    const item = (s.iuranStatus || []).find(i => i.month === m);
    return item && item.paid;
  }).length;
  console.log(`${m}: ${paid}/28 Lunas (${28 - paid} Nunggak)`);
});

// Save to db.json and seedData.ts
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

const tsContent = `import { DBState } from "./types";

export const INITIAL_SEED_DATA: DBState = ${JSON.stringify(db, null, 2)};
`;

fs.writeFileSync(seedPath, tsContent, "utf-8");
console.log("Updated db.json and src/seedData.ts successfully!");
