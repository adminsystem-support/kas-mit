export interface GrowthLog {
  date: string;
  value: number;
}

export interface MonthlyIuran {
  month: string;
  paid: boolean;
  paidAt?: string;
  amount: number;
}

export interface Student {
  id: string;
  name: string;
  nickname?: string;
  parentName: string;
  parentPhone: string;
  birthday: string;
  sisaKasbon: number;
  weightLogs: GrowthLog[];
  heightLogs: GrowthLog[];
  iuranStatus: MonthlyIuran[];
  password?: string;
  photoUrl?: string;
  activeDeviceId?: string;
}

export interface Transaction {
  id: string;
  type: "IN" | "OUT";
  category: string;
  amount: number;
  date: string;
  description: string;
  storeName?: string;
  storeAddress?: string;
  parentName?: string;
  studentId?: string;
  studentName?: string;
  items?: ReceiptItem[];
  proofImage?: string;
  isGeneratedNota?: boolean;
  monthsPaid?: string[];
}

export interface Kasbon {
  id: string;
  studentId: string;
  parentName: string;
  amount: number;
  purpose: string;
  payoutMethod?: "CASH" | "TRANSFER";
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  dateRequested: string;
  dateProcessed?: string;
  adminNotes?: string;
}

export interface ReceiptItem {
  id?: string;
  name: string;
  qty: number;
  unitPrice: number;
  price?: number;
}

export interface OCRResult {
  merchant: string;
  date: string;
  totalAmount: number;
  items: (string | ReceiptItem)[];
  confidence: number;
  simulated?: boolean;
}

export interface Reimbursement {
  id: string;
  studentId: string;
  parentName: string;
  amount: number; // Nilai Nota / Total belanja
  purpose: string;
  
  // Kasbon linking details
  fromKasbon: boolean;
  kasbonId?: string;
  kasbonAmount?: number;
  
  // Method details
  returnMethod?: "CASH" | "TRANSFER"; // Used when Nota < Kasbon (kelebihan kasbon dikembalikan ke bendahara)
  returnProofImage?: string; // Proof of transfer if returnMethod === "TRANSFER"
  
  payoutMethod?: "CASH" | "TRANSFER"; // Used when Nota > Kasbon or Tidak dari Kasbon (bendahara bayar ke wali)
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  
  receiptImage: string; // Base64 image data of receipt or AI generated receipt
  itemPhoto?: string; // Foto barang if bought without physical receipt
  isGeneratedNota?: boolean; // True if AI Nota generator was used
  
  status: "PENDING" | "APPROVED" | "REJECTED";
  dateRequested: string;
  dateProcessed?: string;
  originalAmount: number;
  deductedAmount: number;
  finalPayableAmount: number;
  ocrResult?: OCRResult | null;
  adminNotes?: string;
}

export interface ClassAsset {
  id: string;
  assetCode: string; // e.g. "ASIC/VII/2026/0001"
  name: string;
  category: string;
  purchaseDate: string;
  price: number;
  condition: "SANGAT_BAIK" | "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";
  locationHolder: string;
  quantity: number;
  status: "AKTIF" | "DIPINJAM" | "DIPERBAIKI" | "DIHAPUS";
  notes?: string;
  addedBy?: string;
}

export interface IuranConfirmation {
  id: string;
  studentId: string;
  parentName: string;
  months: string[];
  amount: number;
  paymentMethod: "CASH" | "TRANSFER";
  proofImage?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  dateSubmitted: string;
  dateProcessed?: string;
  adminNotes?: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  sheetTitle?: string;
  autoSync?: boolean;
  lastSyncedAt?: string;
  syncedCount?: number;
  userEmail?: string;
  userName?: string;
}

export interface DBState {
  students: Student[];
  transactions: Transaction[];
  kasbons: Kasbon[];
  reimbursements: Reimbursement[];
  iuranConfirmations?: IuranConfirmation[];
  assets?: ClassAsset[];
  settings?: {
    themeId?: string;
    googleSheets?: GoogleSheetsConfig;
    [key: string]: any;
  };
}
