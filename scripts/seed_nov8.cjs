const fs = require("fs");
const path = require("path");

const dbPath = path.join(process.cwd(), "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// 1. Add missing OUT transactions
const outAdditions = [
  {
    id: "tx-1792400000001",
    date: "2026-09-20",
    type: "OUT",
    amount: 100000,
    category: "Operasional Kelas",
    description: "Isi ulang galon air minum kelas & perlengkapan kebersihan",
    parentName: "Siti Bendahara",
    storeName: "Toko Berkah",
    proofImage: ""
  },
  {
    id: "tx-1793100000002",
    date: "2026-09-28",
    type: "OUT",
    amount: 65000,
    category: "Perlengkapan Belajar",
    description: "Pembelian Alat Tulis & Spidol Papan Tulis Kelas",
    parentName: "Siti Bendahara",
    storeName: "Toko ATK Utama",
    proofImage: ""
  },
  {
    id: "tx-1794300000003",
    date: "2026-10-12",
    type: "OUT",
    amount: 98500,
    category: "Kegiatan Kelas",
    description: "Pembelian Konsumsi & Air Mineral Acara Sekolah",
    parentName: "Siti Bendahara",
    storeName: "Koperasi MIT MA",
    proofImage: ""
  },
  {
    id: "tx-1795600000004",
    date: "2026-10-25",
    type: "OUT",
    amount: 185000,
    category: "Kegiatan Kelas",
    description: "Pembelian Banner & Perlengkapan Dekorasi Kegiatan Kelas",
    parentName: "Siti Bendahara",
    storeName: "Percetakan Digital",
    proofImage: ""
  },
  {
    id: "tx-1796600000005",
    date: "2026-11-05",
    type: "OUT",
    amount: 122000,
    category: "Kegiatan Kelas",
    description: "Kue Ulang Tahun Bu Novi",
    parentName: "Siti Bendahara",
    storeName: "Toko Bakery",
    proofImage: "",
    isGeneratedNota: true
  }
];

// 2. Add missing IN transactions
const inAdditions = [
  {
    id: "tx-1792200000010",
    date: "2026-09-18",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Keysa Nawang Sari (Wali: Nani Sunarti)",
    studentId: "std-2",
    studentName: "Keysa Nawang Sari",
    parentName: "Nani Sunarti",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1792600000011",
    date: "2026-09-22",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Dzakir Khafadi Nugraha (Wali: Siti Bendahara)",
    studentId: "std-1",
    studentName: "Dzakir Khafadi Nugraha",
    parentName: "Siti Bendahara",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1792900000012",
    date: "2026-09-25",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Yanzelin Gadis Solihin (Wali: Eem Suhaemi)",
    studentId: "std-3",
    studentName: "Yanzelin Gadis Solihin",
    parentName: "Eem Suhaemi",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1793500000013",
    date: "2026-10-02",
    type: "IN",
    amount: 40000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026, November 2026 - Siswa: Aysha Farzana Faiha (Wali: Sri Rejeki)",
    studentId: "std-5",
    studentName: "Aysha Farzana Faiha",
    parentName: "Sri Rejeki",
    monthsPaid: ["Oktober 2026", "November 2026"]
  },
  {
    id: "tx-1793800000014",
    date: "2026-10-05",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Aiman Muhammad Anaqi (Wali: Siti Fatimah)",
    studentId: "std-6",
    studentName: "Aiman Muhammad Anaqi",
    parentName: "Siti Fatimah",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1794100000015",
    date: "2026-10-08",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Muhammad Syihabuddin Halimi (Wali: Hj. Nurul)",
    studentId: "std-7",
    studentName: "Muhammad Syihabuddin Halimi",
    parentName: "Hj. Nurul",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1794300000016",
    date: "2026-10-10",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Faris Naufal Ramadhan (Wali: Masnah)",
    studentId: "std-8",
    studentName: "Faris Naufal Ramadhan",
    parentName: "Masnah",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1794800000017",
    date: "2026-10-15",
    type: "IN",
    amount: 40000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026, November 2026 - Siswa: Rais Zahir Syahputra (Wali: Diana)",
    studentId: "std-10",
    studentName: "Rais Zahir Syahputra",
    parentName: "Diana",
    monthsPaid: ["Oktober 2026", "November 2026"]
  },
  {
    id: "tx-1795100000018",
    date: "2026-10-18",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: M. Alfiandaru Nugroho (Wali: Indah)",
    studentId: "std-11",
    studentName: "M. Alfiandaru Nugroho",
    parentName: "Indah",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1795300000019",
    date: "2026-10-20",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Siti Muthii'ah (Wali: Rohimah)",
    studentId: "std-12",
    studentName: "Siti Muthii'ah",
    parentName: "Rohimah",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1795500000020",
    date: "2026-10-22",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Aliza Azwa Salsabila (Wali: Ani)",
    studentId: "std-13",
    studentName: "Aliza Azwa Salsabila",
    parentName: "Ani",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1795900000021",
    date: "2026-10-26",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Muhammad Ropiuddin (Wali: Eni)",
    studentId: "std-14",
    studentName: "Muhammad Ropiuddin",
    parentName: "Eni",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1796100000022",
    date: "2026-10-28",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026 - Siswa: Ayra Shirly Alnaira (Wali: Rika)",
    studentId: "std-16",
    studentName: "Ayra Shirly Alnaira",
    parentName: "Rika",
    monthsPaid: ["Oktober 2026"]
  },
  {
    id: "tx-1796400000024",
    date: "2026-11-01",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan November 2026 - Siswa: Adzril Rafif Al Farezi (Wali: Dewi)",
    studentId: "std-19",
    studentName: "Adzril Rafif Al Farezi",
    parentName: "Dewi",
    monthsPaid: ["November 2026"]
  },
  {
    id: "tx-1796500000025",
    date: "2026-11-02",
    type: "IN",
    amount: 40000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan November 2026, Desember 2026 - Siswa: Zea Rosmira Nurhuda (Wali: Aita Yuliastri)",
    studentId: "std-24",
    studentName: "Zea Rosmira Nurhuda",
    parentName: "Aita Yuliastri",
    monthsPaid: ["November 2026", "Desember 2026"]
  },
  {
    id: "tx-1796600000028",
    date: "2026-11-02",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan November 2026 - Siswa: Ayra Shirly Alnaira (Wali: Khadijah)",
    studentId: "std-16",
    studentName: "Ayra Shirly Alnaira",
    parentName: "Khadijah",
    monthsPaid: ["November 2026"]
  },
  {
    id: "tx-1796600000029",
    date: "2026-11-02",
    type: "IN",
    amount: 40000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan Oktober 2026, November 2026 - Siswa: Khaylila Nara Kirana (Wali: Mahardika Eduardo)",
    studentId: "std-18",
    studentName: "Khaylila Nara Kirana",
    parentName: "Mahardika Eduardo",
    monthsPaid: ["Oktober 2026", "November 2026"]
  },
  {
    id: "tx-1796700000026",
    date: "2026-11-04",
    type: "IN",
    amount: 40000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan November 2026, Desember 2026 - Siswa: Auliya Jelita Ma'ruf (Wali: Tanti)",
    studentId: "std-20",
    studentName: "Auliya Jelita Ma'ruf",
    parentName: "Tanti",
    monthsPaid: ["November 2026", "Desember 2026"]
  },
  {
    id: "tx-1797100000027",
    date: "2026-11-08",
    type: "IN",
    amount: 20000,
    category: "Iuran Kas",
    description: "Iuran Kas Bulan November 2026 - Siswa: Nabila Talita Arkadina (Wali: Sumarni)",
    studentId: "std-28",
    studentName: "Nabila Talita Arkadina",
    parentName: "Sumarni",
    monthsPaid: ["November 2026"]
  }
];

// Filter out any existing seed_nov8 transactions if already present
db.transactions = db.transactions.filter(t => !t.id.startsWith("tx-179"));
db.transactions = [...db.transactions, ...outAdditions, ...inAdditions];

// Recalculate totals
let totalIn = 0, totalOut = 0;
db.transactions.forEach(t => {
  if (t.type === "IN") totalIn += t.amount;
  if (t.type === "OUT") totalOut += t.amount;
});

console.log("New total tx count:", db.transactions.length);
console.log("New totalIn:", totalIn, "totalOut:", totalOut, "saldo:", totalIn - totalOut);

// Also update student iuranStatus for paid months
inAdditions.forEach(tx => {
  if (tx.studentId && tx.monthsPaid) {
    const student = db.students.find(s => s.id === tx.studentId);
    if (student && Array.isArray(student.iuranStatus)) {
      tx.monthsPaid.forEach(m => {
        const iuranObj = student.iuranStatus.find(i => i.month === m);
        if (iuranObj) {
          iuranObj.isPaid = true;
          iuranObj.paidAmount = 20000;
          iuranObj.paidDate = tx.date;
        } else {
          student.iuranStatus.push({
            month: m,
            isPaid: true,
            paidAmount: 20000,
            paidDate: tx.date
          });
        }
      });
    }
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
console.log("Successfully written updated db.json!");
