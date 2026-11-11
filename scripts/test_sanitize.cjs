const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(process.cwd(), "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const defaultMonths = [
  "Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026",
  "Januari 2027", "Februari 2027", "Maret 2027", "April 2027", "Mei 2027", "Juni 2027",
  "Juli 2027", "Agustus 2027", "September 2027", "Oktober 2027", "November 2027", "Desember 2027"
];

// Ensure every student has default iuranStatus
db.students.forEach((student) => {
  if (!Array.isArray(student.iuranStatus)) {
    student.iuranStatus = defaultMonths.map(m => ({ month: m, paid: false, amount: 20000 }));
  } else {
    defaultMonths.forEach((m) => {
      const exists = student.iuranStatus.some((i) => i.month === m);
      if (!exists) {
        student.iuranStatus.push({ month: m, paid: false, amount: 20000 });
      }
    });
  }
});

let updatedCount = 0;

// Scan transactions to mark paid status
if (Array.isArray(db.transactions)) {
  db.transactions.forEach((tx) => {
    if (tx.type === "IN" && (tx.category === "Iuran Kas" || (tx.description && tx.description.toLowerCase().includes("iuran kas")))) {
      // Find target student
      let student = null;
      if (tx.studentId) {
        student = db.students.find(s => s.id === tx.studentId);
      }
      if (!student && tx.description) {
        const descLower = tx.description.toLowerCase();
        student = db.students.find(s => {
          const sName = s.name.trim().toLowerCase();
          return sName.length >= 3 && descLower.includes(sName);
        });
      }

      if (student) {
        // Find paid months in description or monthsPaid
        let paidMonths = tx.monthsPaid || [];
        if (paidMonths.length === 0 && tx.description) {
          defaultMonths.forEach(m => {
            if (tx.description.includes(m)) {
              paidMonths.push(m);
            }
          });
        }

        paidMonths.forEach(m => {
          let stItem = student.iuranStatus.find(i => i.month === m);
          if (stItem) {
            if (!stItem.paid) {
              stItem.paid = true;
              stItem.paidAt = tx.date || "2026-11-08";
              updatedCount++;
            }
          } else {
            student.iuranStatus.push({ month: m, paid: true, paidAt: tx.date || "2026-11-08", amount: 20000 });
            updatedCount++;
          }
        });
      }
    }
  });
}

console.log(`Updated ${updatedCount} month statuses across students based on transactions!`);

// Print summary of unpaid counts per month for 2026
const months2026 = ["Juli 2026", "Agustus 2026", "September 2026", "Oktober 2026", "November 2026", "Desember 2026"];
months2026.forEach(m => {
  const unpaid = db.students.filter(s => {
    const item = (s.iuranStatus || []).find(i => i.month === m);
    return !item || !item.paid;
  }).length;
  console.log(`${m}: ${db.students.length - unpaid}/${db.students.length} Lunas (${unpaid} Nunggak)`);
});
