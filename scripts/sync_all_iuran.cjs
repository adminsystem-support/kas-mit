const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(process.cwd(), "db.json");
const seedPath = path.resolve(process.cwd(), "src/seedData.ts");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const invalidMonths = ["Januari 2026", "Februari 2026", "Maret 2026", "April 2026", "Mei 2026", "Juni 2026"];
const defaultMonths = [
  "Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026",
  "Januari 2027", "Februari 2027", "Maret 2027", "April 2027", "Mei 2027", "Juni 2027",
  "Juli 2027", "Agustus 2027", "September 2027", "Oktober 2027", "November 2027", "Desember 2027"
];

// Initialize default iuranStatus
db.students.forEach((student) => {
  if (!Array.isArray(student.iuranStatus)) {
    student.iuranStatus = defaultMonths.map(m => ({ month: m, paid: false, amount: 20000 }));
  } else {
    student.iuranStatus = student.iuranStatus.filter(item => !invalidMonths.includes(item.month));
    student.iuranStatus.forEach(item => { item.amount = 20000; });
    defaultMonths.forEach((m) => {
      const exists = student.iuranStatus.some((i) => i.month === m);
      if (!exists) {
        student.iuranStatus.push({ month: m, paid: false, amount: 20000 });
      }
    });
  }
});

let syncedMonthsCount = 0;

// Scan transactions and mark paid months
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
        const rawWali = (siswaWaliMatch[2] || "").trim().toLowerCase();

        targetStudent = db.students.find(s => s.name.trim().toLowerCase() === rawStudent)
          || db.students.find(s => s.nickname && s.nickname.trim().toLowerCase() === rawStudent);

        if (!targetStudent && rawStudent.length >= 3) {
          targetStudent = db.students.find(s => s.name.toLowerCase().includes(rawStudent) || rawStudent.includes(s.name.toLowerCase()));
        }

        if (!targetStudent && rawWali) {
          targetStudent = db.students.find(s => s.parentName.trim().toLowerCase() === rawWali);
        }
      }

      if (!targetStudent) {
        const descLower = desc.toLowerCase();
        const matchedStudents = db.students
          .filter(s => {
            const sName = s.name.trim().toLowerCase();
            return sName.length >= 4 && descLower.includes(sName);
          })
          .sort((a, b) => b.name.length - a.name.length);

        if (matchedStudents.length > 0) {
          targetStudent = matchedStudents[0];
        }
      }

      if (targetStudent) {
        tx.studentId = targetStudent.id;
        tx.studentName = targetStudent.name;
        if (!tx.parentName) tx.parentName = targetStudent.parentName;
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

      targetStudent.iuranStatus = targetStudent.iuranStatus || [];
      paidMonths.forEach(m => {
        let monthStatus = targetStudent.iuranStatus.find(i => i.month === m);
        if (monthStatus) {
          if (!monthStatus.paid) {
            monthStatus.paid = true;
            monthStatus.paidAt = tx.date || "2026-11-08";
            monthStatus.amount = 20000;
            syncedMonthsCount++;
          }
        } else {
          targetStudent.iuranStatus.push({
            month: m,
            paid: true,
            paidAt: tx.date || "2026-11-08",
            amount: 20000
          });
          syncedMonthsCount++;
        }
      });
    }
  });
}

console.log(`Synced ${syncedMonthsCount} unpaid month records into LUNAS state based on existing transactions.`);

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

// Generate seedData.ts
const tsContent = `import { DBState } from "./types";

export const INITIAL_SEED_DATA: DBState = ${JSON.stringify(db, null, 2)};
`;

fs.writeFileSync(seedPath, tsContent, "utf-8");
console.log("Updated db.json and src/seedData.ts successfully.");
