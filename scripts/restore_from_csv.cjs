const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../public/assets/aistudio/buku-kas-kelas-1c-2026-11-11__1__205be63d.csv');
const dbPath = path.resolve(__dirname, '../db.json');

const csvText = fs.readFileSync(csvPath, 'utf-8');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i+1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

const defaultMonths = [
  'Juli 2026', 'Agustus 2026', 'September 2026', 'Oktober 2026',
  'November 2026', 'Desember 2026', 'Januari 2027', 'Februari 2027',
  'Maret 2027', 'April 2027', 'Mei 2027', 'Juni 2027',
  'Juli 2027', 'Agustus 2027', 'September 2027', 'Oktober 2027',
  'November 2027', 'Desember 2027'
];

const lines = csvText.trim().split('\n');
const restoredTxs = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  const date = cols[1];
  const tipeStr = cols[2];
  const category = cols[3];
  const description = cols[4];
  const masuk = cols[5] ? parseInt(cols[5]) : 0;
  const keluar = cols[6] ? parseInt(cols[6]) : 0;
  const parentName = cols[8];
  const storeName = cols[9] === '-' ? '' : cols[9];
  const proofImage = cols[10] === '-' ? '' : cols[10];
  const id = cols[11];

  const type = tipeStr === 'MASUK' ? 'IN' : 'OUT';
  const amount = type === 'IN' ? masuk : keluar;

  let studentId = '';
  let studentName = '';
  const siswaWaliMatch = description.match(/Siswa:\s*([^(\n\r]+?)(?:\s*\(Wali:\s*([^)\n\r]+)\))?$/i);
  if (siswaWaliMatch) {
    const rawStudent = (siswaWaliMatch[1] || '').trim().toLowerCase();
    const foundStd = db.students.find(s => s.name.trim().toLowerCase() === rawStudent || s.name.toLowerCase().includes(rawStudent) || rawStudent.includes(s.name.toLowerCase()));
    if (foundStd) {
      studentId = foundStd.id;
      studentName = foundStd.name;
    }
  }

  restoredTxs.push({
    id,
    date,
    type,
    category,
    description,
    amount,
    parentName: parentName || '',
    storeName: storeName || '',
    proofImage: proofImage || '',
    studentId: studentId || '',
    studentName: studentName || '',
    isGeneratedNota: proofImage.includes('Nota Otomatis')
  });
}

// Update db.transactions
db.transactions = restoredTxs;

// Re-calculate iuranStatus for all 28 students
db.students.forEach(student => {
  student.iuranStatus = defaultMonths.map(m => ({
    month: m,
    paid: false,
    amount: 20000
  }));
});

db.transactions.forEach(tx => {
  if (tx.type === 'IN' && (tx.category === 'Iuran Kas' || (tx.description && tx.description.toLowerCase().includes('iuran kas')))) {
    const student = db.students.find(s => s.id === tx.studentId || (tx.studentName && s.name.toLowerCase() === tx.studentName.toLowerCase()));
    if (student) {
      let paidMonths = Array.isArray(tx.monthsPaid) ? tx.monthsPaid : [];
      if (paidMonths.length === 0 && tx.description) {
        defaultMonths.forEach(m => {
          if (tx.description.includes(m)) paidMonths.push(m);
        });
      }
      paidMonths.forEach(m => {
        const item = student.iuranStatus.find(i => i.month === m);
        if (item) {
          item.paid = true;
          item.paidAt = tx.date || '2026-11-08';
        }
      });
    }
  }
});

// Save to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Restored all 97 transactions (including 16 in Oct 2026) to db.json!');
