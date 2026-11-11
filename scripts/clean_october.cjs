const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
const raw = fs.readFileSync(dbPath, 'utf-8');
const db = JSON.parse(raw);

console.log(`Total transactions before cleanup: ${db.transactions.length}`);

// Keep transactions before 2026-10-01
const keptTransactions = db.transactions.filter(t => {
  if (!t.date) return false;
  return t.date < '2026-10-01';
});

console.log(`Transactions kept (up to Sep 2026): ${keptTransactions.length}`);
db.transactions = keptTransactions;

// Reset student iuranStatus for October 2026 onwards to paid = false
db.students.forEach(student => {
  if (!Array.isArray(student.iuranStatus)) return;
  student.iuranStatus.forEach(st => {
    if (st.month && (st.month.includes('Oktober 2026') || st.month.includes('November 2026') || st.month.includes('Desember 2026') || st.month.includes('2027'))) {
      st.paid = false;
      delete st.paidAt;
    }
  });

  // Re-scan kept transactions
  keptTransactions.forEach(tx => {
    if (tx.type === 'IN' && tx.category === 'Iuran Kas' && tx.studentId === student.id) {
      const desc = tx.description || '';
      student.iuranStatus.forEach(st => {
        if (desc.includes(st.month) || (tx.date && tx.date.startsWith('2026-09') && st.month.includes('September'))) {
          st.paid = true;
          if (!st.paidAt) st.paidAt = tx.date;
        }
      });
    }
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Successfully cleaned db.json! Transactions from October onwards removed.');
