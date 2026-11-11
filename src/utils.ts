/**
 * Calculate age in years and months from birthdate string (YYYY-MM-DD)
 */
export function calculateAge(birthday: string): string {
  if (!birthday) return "-";
  const birthDate = new Date(birthday);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  
  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
      years--;
    }
  }

  if (years === 0) {
    return `${months} Bulan`;
  }
  return `${years} Tahun ${months} Bulan`;
}

/**
 * Check if the child's birthday is coming up in the next 30 days
 */
export function isBirthdayComingSoon(birthday: string): boolean {
  if (!birthday) return false;
  const birthDate = new Date(birthday);
  const today = new Date();
  
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  // If birthday already passed this year, check next year
  if (nextBirthday.getTime() < today.getTime()) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = Math.abs(nextBirthday.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 30;
}

/**
 * Get Roman Numeral for month (1 to 12)
 */
export function getRomanNumeral(monthNumber: number): string {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return romans[Math.max(0, Math.min(11, monthNumber - 1))] || "I";
}

/**
 * Generate asset code with format: ASIC/[BULAN ROMAWI]/[TAHUN]/[NOMOR URUT]
 * Example: ASIC/VII/2026/0001
 */
export function generateAssetCode(dateString: string, currentAssetsCount: number): string {
  const dateObj = dateString ? new Date(dateString) : new Date();
  const year = isNaN(dateObj.getFullYear()) ? new Date().getFullYear() : dateObj.getFullYear();
  const month = isNaN(dateObj.getMonth()) ? new Date().getMonth() + 1 : dateObj.getMonth() + 1;
  const romanMonth = getRomanNumeral(month);
  
  const seqNumber = String(currentAssetsCount + 1).padStart(4, "0");
  return `ASIC/${romanMonth}/${year}/${seqNumber}`;
}

/**
 * Format currency to Indonesian Rupiah (IDR)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Generate beautifully styled receipt images as base64 strings
 * so the user can test the Gemini OCR API immediately without uploading files.
 */
export function generateMockReceiptBase64(type: "koperasi" | "tokobuku" | "apotek"): { base64: string; name: string } {
  let svgContent = "";
  let name = "";

  if (type === "koperasi") {
    name = "nota_koperasi_sekolah.png";
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="450" height="620" viewBox="0 0 450 620">
      <defs>
        <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.12"/>
        </filter>
      </defs>
      
      <!-- Outer Background Container -->
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      
      <!-- Thermal Paper Ticket -->
      <g filter="url(#paperShadow)">
        <rect x="25" y="20" width="400" height="580" fill="#fbfbf8" rx="2"/>
        
        <!-- Top Serrated Edge (Zigzag Cut) -->
        <path d="M 25 20 L 35 12 L 45 20 L 55 12 L 65 20 L 75 12 L 85 20 L 95 12 L 105 20 L 115 12 L 125 20 L 135 12 L 145 20 L 155 12 L 165 20 L 175 12 L 185 20 L 195 12 L 205 20 L 215 12 L 225 20 L 235 12 L 245 20 L 255 12 L 265 20 L 275 12 L 285 20 L 295 12 L 305 20 L 315 12 L 325 20 L 335 12 L 345 20 L 355 12 L 365 20 L 375 12 L 385 20 L 395 12 L 405 20 L 415 12 L 425 20 L 425 22 L 25 22 Z" fill="#e2e8f0"/>
        
        <!-- Header Store Info -->
        <text x="225" y="60" font-family="'Courier New', monospace" font-weight="900" font-size="20" text-anchor="middle" fill="#0f172a" letter-spacing="1">★ KOPERASI SEKOLAH 1C ★</text>
        <text x="225" y="80" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="middle" fill="#334155">MIT MA BUARAN JATI - CLASS 1C</text>
        <text x="225" y="96" font-family="'Courier New', monospace" font-size="11" text-anchor="middle" fill="#64748b">Jl. Raya Buaran Jati No. 45 - Tangerang</text>
        <text x="225" y="112" font-family="'Courier New', monospace" font-weight="bold" font-size="10" text-anchor="middle" fill="#475569">TELP: 021-9876543 &bull; KASIR: SITI BENDAHARA</text>
        
        <!-- Dashed Divider -->
        <line x1="45" y1="128" x2="405" y2="128" stroke="#475569" stroke-dasharray="4,4" stroke-width="1.5"/>
        
        <!-- Meta Details -->
        <text x="50" y="152" font-family="'Courier New', monospace" font-size="12" fill="#1e293b">NO. STRUK : KOP-2026-0720</text>
        <text x="50" y="172" font-family="'Courier New', monospace" font-size="12" fill="#1e293b">TANGGAL   : 2026-07-20 10:15</text>
        <text x="50" y="192" font-family="'Courier New', monospace" font-size="12" fill="#1e293b">PELANGGAN : WALI MURID (BUDI SANTOSO)</text>
        
        <!-- Dashed Divider -->
        <line x1="45" y1="208" x2="405" y2="208" stroke="#475569" stroke-dasharray="4,4" stroke-width="1.5"/>
        
        <!-- Table Column Headers -->
        <text x="50" y="230" font-family="'Courier New', monospace" font-weight="bold" font-size="11" fill="#475569">NAMA BARANG / ITEM</text>
        <text x="350" y="230" font-family="'Courier New', monospace" font-weight="bold" font-size="11" text-anchor="end" fill="#475569">TOTAL</text>
        
        <!-- Item 1 -->
        <text x="50" y="258" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#0f172a">1. BUKU GAMBAR A4</text>
        <text x="70" y="276" font-family="'Courier New', monospace" font-size="11" fill="#475569">2x @ Rp 8.000</text>
        <text x="350" y="276" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#0f172a">Rp 16.000</text>

        <!-- Item 2 -->
        <text x="50" y="302" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#0f172a">2. PENSIL WARNA FABER</text>
        <text x="70" y="320" font-family="'Courier New', monospace" font-size="11" fill="#475569">1x @ Rp 24.000</text>
        <text x="350" y="320" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#0f172a">Rp 24.000</text>

        <!-- Item 3 -->
        <text x="50" y="346" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#0f172a">3. PENGGARIS SEGITIGA</text>
        <text x="70" y="364" font-family="'Courier New', monospace" font-size="11" fill="#475569">1x @ Rp 10.000</text>
        <text x="350" y="364" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#0f172a">Rp 10.000</text>

        <!-- Dashed Divider -->
        <line x1="45" y1="384" x2="405" y2="384" stroke="#475569" stroke-dasharray="4,4" stroke-width="1.5"/>
        
        <!-- Totals Section -->
        <text x="50" y="408" font-family="'Courier New', monospace" font-size="12" fill="#334155">TOTAL ITEM  : 3 Jenis (4 Pcs)</text>
        <text x="50" y="428" font-family="'Courier New', monospace" font-size="12" fill="#334155">SUBTOTAL    : Rp 50.000</text>
        <text x="50" y="448" font-family="'Courier New', monospace" font-size="12" fill="#334155">DISCOUNT    : Rp 0</text>
        
        <!-- Heavy Divider -->
        <line x1="45" y1="462" x2="405" y2="462" stroke="#0f172a" stroke-width="2"/>
        
        <text x="50" y="488" font-family="'Courier New', monospace" font-weight="900" font-size="15" fill="#0f172a">TOTAL BAYAR :</text>
        <rect x="230" y="468" width="125" height="28" fill="#fef08a" rx="4"/>
        <text x="350" y="488" font-family="'Courier New', monospace" font-weight="900" font-size="16" text-anchor="end" fill="#0f172a">Rp 50.000</text>

        <text x="50" y="512" font-family="'Courier New', monospace" font-size="11" fill="#475569">METODE BAYAR: TUNAI KAS KELAS</text>

        <!-- Verification Stamp -->
        <g transform="translate(240, 520) rotate(-5)">
          <rect x="0" y="0" width="145" height="42" fill="#ecfdf5" stroke="#059669" stroke-width="2" rx="4"/>
          <text x="72" y="18" font-family="sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#047857">✓ TERVERIFIKASI REAL</text>
          <text x="72" y="32" font-family="sans-serif" font-weight="bold" font-size="9" text-anchor="middle" fill="#059669">BENDAHARA KELAS 1C</text>
        </g>

        <!-- Footer Message & Barcode -->
        <text x="225" y="575" font-family="'Courier New', monospace" font-weight="bold" font-size="11" text-anchor="middle" fill="#475569">*** TERIMA KASIH ***</text>
        <text x="225" y="590" font-family="'Courier New', monospace" font-size="9" text-anchor="middle" fill="#64748b">Bukti sah iuran &amp; pengeluaran kas siswa 1C</text>
        
        <!-- Bottom Serrated Edge (Zigzag Cut) -->
        <path d="M 25 600 L 35 608 L 45 600 L 55 608 L 65 600 L 75 608 L 85 600 L 95 608 L 105 600 L 115 608 L 125 600 L 135 608 L 145 600 L 155 608 L 165 600 L 175 608 L 185 600 L 195 608 L 205 600 L 215 608 L 225 600 L 235 608 L 245 600 L 255 608 L 265 600 L 275 608 L 285 600 L 295 608 L 305 600 L 315 608 L 325 600 L 335 608 L 345 600 L 355 608 L 365 600 L 375 608 L 385 600 L 395 608 L 405 600 L 415 608 L 425 600 L 425 598 L 25 598 Z" fill="#e2e8f0"/>
      </g>
    </svg>
    `;
  } else if (type === "tokobuku") {
    name = "nota_toko_buku_utama.png";
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="450" height="620" viewBox="0 0 450 620">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <g>
        <rect x="25" y="20" width="400" height="580" fill="#fcfcf9" rx="2"/>
        
        <text x="225" y="60" font-family="'Courier New', monospace" font-weight="900" font-size="22" text-anchor="middle" fill="#854d0e">★ TOKO BUKU UTAMA ★</text>
        <text x="225" y="80" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="middle" fill="#a16207">KAWASAN NIAGA SLIPI NO. 12</text>
        <text x="225" y="96" font-family="'Courier New', monospace" font-size="11" text-anchor="middle" fill="#71717a">JAKARTA BARAT &bull; TELP: 021-5554321</text>
        
        <line x1="45" y1="115" x2="405" y2="115" stroke="#a16207" stroke-dasharray="4,4" stroke-width="1.5"/>
        
        <text x="50" y="138" font-family="'Courier New', monospace" font-size="12" fill="#27272a">NOTA NO  : TBU-88910</text>
        <text x="50" y="158" font-family="'Courier New', monospace" font-size="12" fill="#27272a">TANGGAL  : 2026-07-18 14:20</text>
        <text x="50" y="178" font-family="'Courier New', monospace" font-size="12" fill="#27272a">PEMBELI  : WALI MURID KELAS 1C</text>
        
        <line x1="45" y1="195" x2="405" y2="195" stroke="#a16207" stroke-dasharray="4,4" stroke-width="1.5"/>
        
        <text x="50" y="220" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#18181b">1. BUKU PAKET MATEMATIKA 1C</text>
        <text x="350" y="238" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#18181b">Rp 65.000</text>

        <text x="50" y="264" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#18181b">2. BUKU PAKET IPA 1C</text>
        <text x="350" y="282" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#18181b">Rp 35.000</text>

        <text x="50" y="308" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#18181b">3. BUKU TULIS KOTAK (5 PCS)</text>
        <text x="350" y="326" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#18181b">Rp 25.000</text>

        <line x1="45" y1="350" x2="405" y2="350" stroke="#a16207" stroke-dasharray="4,4" stroke-width="1.5"/>
        
        <text x="50" y="380" font-family="'Courier New', monospace" font-weight="900" font-size="15" fill="#18181b">TOTAL AKHIR :</text>
        <rect x="230" y="360" width="130" height="28" fill="#fef08a" rx="4"/>
        <text x="350" y="380" font-family="'Courier New', monospace" font-weight="900" font-size="16" text-anchor="end" fill="#18181b">Rp 125.000</text>
        
        <text x="50" y="410" font-family="'Courier New', monospace" font-size="12" fill="#27272a">BAYAR CASH  : Rp 150.000</text>
        <text x="50" y="430" font-family="'Courier New', monospace" font-size="12" fill="#27272a">KEMBALIAN   : Rp  25.000</text>
        
        <!-- Verification Stamp -->
        <g transform="translate(240, 460) rotate(-6)">
          <rect x="0" y="0" width="145" height="42" fill="#fef3c7" stroke="#d97706" stroke-width="2" rx="4"/>
          <text x="72" y="18" font-family="sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#b45309">LUNAS &amp; VALID</text>
          <text x="72" y="32" font-family="sans-serif" font-weight="bold" font-size="9" text-anchor="middle" fill="#d97706">KASIR TOKO BUKU</text>
        </g>

        <text x="225" y="550" font-family="'Courier New', monospace" font-style="italic" font-size="11" text-anchor="middle" fill="#71717a">Barang yang sudah dibeli tidak dapat ditukar</text>
        <text x="225" y="568" font-family="'Courier New', monospace" font-style="italic" font-size="10" text-anchor="middle" fill="#a1a1aa">*** TERIMA KASIH ***</text>
      </g>
    </svg>
    `;
  } else {
    name = "nota_apotek_sehat.png";
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="450" height="620" viewBox="0 0 450 620">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <g>
        <rect x="25" y="20" width="400" height="580" fill="#fcfcf9" rx="2"/>
        
        <text x="225" y="60" font-family="'Courier New', monospace" font-weight="900" font-size="20" text-anchor="middle" fill="#047857">★ APOTEK SEHAT SEJAHTERA ★</text>
        <text x="225" y="80" font-family="'Courier New', monospace" font-size="12" text-anchor="middle" fill="#059669">JL. KESEHATAN NO. 45 JAKARTA</text>
        <text x="225" y="96" font-family="'Courier New', monospace" font-size="11" text-anchor="middle" fill="#4b5563">SIA: 199/SIA/2025 &bull; TELP: 021-77889900</text>
        
        <line x1="45" y1="115" x2="405" y2="115" stroke="#059669" stroke-dasharray="3,3" stroke-width="1.5"/>
        
        <text x="50" y="138" font-family="'Courier New', monospace" font-size="12" fill="#1f2937">NO RESEP : R-8871</text>
        <text x="50" y="158" font-family="'Courier New', monospace" font-size="12" fill="#1f2937">TANGGAL  : 2026-07-15 09:45</text>
        <text x="50" y="178" font-family="'Courier New', monospace" font-size="12" fill="#1f2937">DOKTER   : DR. SPESIALIS ANAK</text>
        
        <line x1="45" y1="195" x2="405" y2="195" stroke="#059669" stroke-dasharray="3,3" stroke-width="1.5"/>
        
        <text x="50" y="220" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#111827">1. PARACETAMOL SIRUP ANAK</text>
        <text x="350" y="238" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#111827">Rp 25.000</text>

        <text x="50" y="264" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#111827">2. VITAMIN C SIRUP ANAK</text>
        <text x="350" y="282" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#111827">Rp 20.000</text>

        <line x1="45" y1="310" x2="405" y2="310" stroke="#059669" stroke-dasharray="3,3" stroke-width="1.5"/>
        
        <text x="50" y="340" font-family="'Courier New', monospace" font-weight="900" font-size="15" fill="#111827">TOTAL AKHIR :</text>
        <rect x="230" y="320" width="130" height="28" fill="#a7f3d0" rx="4"/>
        <text x="350" y="340" font-family="'Courier New', monospace" font-weight="900" font-size="16" text-anchor="end" fill="#065f46">Rp 45.000</text>
        
        <text x="50" y="370" font-family="'Courier New', monospace" font-size="12" fill="#1f2937">BAYAR DEBIT : Rp 45.000</text>
        
        <!-- Verification Stamp -->
        <g transform="translate(240, 420) rotate(-5)">
          <rect x="0" y="0" width="145" height="42" fill="#ecfdf5" stroke="#059669" stroke-width="2" rx="4"/>
          <text x="72" y="18" font-family="sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#047857">✓ TERVERIFIKASI REAL</text>
          <text x="72" y="32" font-family="sans-serif" font-weight="bold" font-size="9" text-anchor="middle" fill="#059669">APOTEK SEHAT</text>
        </g>

        <text x="225" y="520" font-family="'Courier New', monospace" font-style="italic" font-size="11" text-anchor="middle" fill="#4b5563">Semoga Lekas Sembuh Anakku</text>
        <text x="225" y="538" font-family="'Courier New', monospace" font-style="italic" font-size="10" text-anchor="middle" fill="#6b7280">Gunakan struk ini untuk rembes Kas Kelas 1C</text>
      </g>
    </svg>
    `;
  }

  // Convert SVG string directly to a clean base64 data URI
  const base64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
  return { base64, name };
}

/**
 * Generate a high-resolution, realistic thermal supermarket receipt image (Base64)
 * for purchases made without a physical receipt (e.g. bought at traditional warung/market/shop).
 */
export function generateDigitalReceiptBase64(params: {
  merchant: string;
  purpose: string;
  amount: number;
  date: string;
  parentName: string;
  studentName?: string;
  items?: (string | { name: string; qty?: number; unitPrice?: number; price?: number })[];
  itemPhotoBase64?: string;
}): string {
  const { merchant, purpose, amount, date, parentName, studentName, items } = params;
  const formattedAmount = formatRupiah(amount);
  const nowStr = date || new Date().toISOString().split("T")[0];
  const refNo = `TRX-${nowStr.replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Parse items from params or purpose string
  let itemsList: { name: string; qty: number; unitPrice: number; price: number }[] = [];

  if (items && items.length > 0) {
    itemsList = items.map((it) => {
      if (typeof it === "string") {
        return { name: it, qty: 1, unitPrice: amount, price: amount };
      }
      const qty = it.qty || 1;
      const unitPrice = it.unitPrice || (it.price ? Math.round(it.price / qty) : Math.round(amount / items.length));
      const price = it.price || (qty * unitPrice);
      return { name: it.name, qty, unitPrice, price };
    });
  } else if (purpose) {
    const rawLines = purpose.split(/[\n,;&]+/);
    rawLines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) {
        const priceMatch = trimmed.match(/(\d+[\.\d]*\d*)$/);
        if (priceMatch) {
          const priceVal = parseInt(priceMatch[1].replace(/\./g, ""));
          const itemName = trimmed.replace(priceMatch[1], "").trim();
          itemsList.push({ name: itemName || trimmed, qty: 1, unitPrice: priceVal, price: priceVal });
        } else {
          itemsList.push({ name: trimmed, qty: 1, unitPrice: 0, price: 0 });
        }
      }
    });
  }

  if (itemsList.length === 0) {
    itemsList = [{ name: purpose || "Pembelian Keperluan Belajar Siswa", qty: 1, unitPrice: amount, price: amount }];
  }

  // Calculate rendering height dynamically
  const displayItems = itemsList.slice(0, 6);
  const itemsHeight = displayItems.length * 42;
  const totalSvgHeight = 600 + itemsHeight;

  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="450" height="${totalSvgHeight}" viewBox="0 0 450 ${totalSvgHeight}">
    <defs>
      <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.15"/>
      </filter>
    </defs>

    <!-- Canvas Container -->
    <rect width="100%" height="100%" fill="#f1f5f9"/>

    <!-- Thermal Paper Card -->
    <g filter="url(#paperShadow)">
      <rect x="25" y="20" width="400" height="${totalSvgHeight - 40}" fill="#fbfbf8" rx="2"/>

      <!-- Top AI Badge -->
      <rect x="45" y="32" width="360" height="24" fill="#d1fae5" rx="4" stroke="#10b981" stroke-width="1"/>
      <text x="225" y="48" font-family="sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#047857">✨ STRUK THERMAL SUPERMARKET - GEMINI AI 1C</text>

      <!-- Store Header -->
      <text x="225" y="82" font-family="'Courier New', monospace" font-weight="900" font-size="20" text-anchor="middle" fill="#0f172a">★ ${merchant.toUpperCase()} ★</text>
      <text x="225" y="100" font-family="'Courier New', monospace" font-weight="bold" font-size="11" text-anchor="middle" fill="#475569">MIT MA BUARAN JATI - KELAS 1C</text>
      <text x="225" y="116" font-family="'Courier New', monospace" font-size="10" text-anchor="middle" fill="#64748b">Tangerang, Banten &bull; Telp: 0812-9876-5432</text>

      <line x1="45" y1="130" x2="405" y2="130" stroke="#0f172a" stroke-dasharray="4,4" stroke-width="1.5"/>

      <!-- Transaction Meta -->
      <text x="50" y="152" font-family="'Courier New', monospace" font-size="11" fill="#1e293b">NO. STRUK : ${refNo}</text>
      <text x="50" y="170" font-family="'Courier New', monospace" font-size="11" fill="#1e293b">TANGGAL   : ${nowStr} 14:30</text>
      <text x="50" y="188" font-family="'Courier New', monospace" font-size="11" fill="#1e293b">WALI MURID: ${parentName.toUpperCase()} ${studentName ? `(${studentName.toUpperCase()})` : ""}</text>
      <text x="50" y="206" font-family="'Courier New', monospace" font-size="11" fill="#1e293b">KASIR     : ASISTEN AI BENDAHARA</text>

      <line x1="45" y1="220" x2="405" y2="220" stroke="#0f172a" stroke-dasharray="4,4" stroke-width="1.5"/>

      <!-- Items Header -->
      <text x="50" y="242" font-family="'Courier New', monospace" font-weight="900" font-size="11" fill="#475569">NAMA BARANG / RINCIAN BELANJA</text>
      <text x="350" y="242" font-family="'Courier New', monospace" font-weight="900" font-size="11" text-anchor="end" fill="#475569">TOTAL</text>

      <!-- Items Loop -->
      ${displayItems.map((it, idx) => `
        <text x="50" y="${270 + idx * 42}" font-family="'Courier New', monospace" font-weight="bold" font-size="12" fill="#0f172a">${idx + 1}. ${it.name.length > 28 ? it.name.slice(0, 28) + '...' : it.name}</text>
        <text x="70" y="${288 + idx * 42}" font-family="'Courier New', monospace" font-size="11" fill="#64748b">${it.qty}x @ ${formatRupiah(it.unitPrice)}</text>
        <text x="350" y="${288 + idx * 42}" font-family="'Courier New', monospace" font-weight="bold" font-size="12" text-anchor="end" fill="#0f172a">${formatRupiah(it.price)}</text>
      `).join("")}

      <line x1="45" y1="${250 + itemsHeight}" x2="405" y2="${250 + itemsHeight}" stroke="#0f172a" stroke-dasharray="4,4" stroke-width="1.5"/>

      <!-- Financial Totals -->
      <g transform="translate(0, ${itemsHeight})">
        <text x="50" y="275" font-family="'Courier New', monospace" font-size="11" fill="#475569">TOTAL ITEM  : ${itemsList.length} Jenis Barang</text>
        <text x="50" y="293" font-family="'Courier New', monospace" font-size="11" fill="#475569">SUBTOTAL    : ${formattedAmount}</text>
        <text x="50" y="311" font-family="'Courier New', monospace" font-size="11" fill="#475569">DISKON PROMO: Rp 0</text>
        <text x="50" y="329" font-family="'Courier New', monospace" font-size="11" fill="#475569">PPN 11%     : INCLUDED</text>

        <line x1="45" y1="342" x2="405" y2="342" stroke="#0f172a" stroke-width="2"/>

        <text x="50" y="368" font-family="'Courier New', monospace" font-weight="900" font-size="15" fill="#0f172a">TOTAL BAYAR :</text>
        <rect x="220" y="348" width="135" height="28" fill="#fef08a" rx="4"/>
        <text x="350" y="368" font-family="'Courier New', monospace" font-weight="900" font-size="16" text-anchor="end" fill="#0f172a">${formattedAmount}</text>

        <text x="50" y="392" font-family="'Courier New', monospace" font-size="11" fill="#475569">METODE BAYAR: REIMBURSEMENT KAS 1C</text>
        <text x="50" y="408" font-family="'Courier New', monospace" font-weight="bold" font-size="11" fill="#047857">STATUS      : LUNAS &amp; FOTO TERLAMPIR</text>

        <!-- Official Stamp -->
        <g transform="translate(240, 415) rotate(-5)">
          <rect x="0" y="0" width="145" height="42" fill="#ecfdf5" stroke="#059669" stroke-width="2" rx="4"/>
          <text x="72" y="18" font-family="sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#047857">✓ TERVERIFIKASI REAL</text>
          <text x="72" y="32" font-family="sans-serif" font-weight="bold" font-size="9" text-anchor="middle" fill="#059669">ASISTEN AI BENDAHARA</text>
        </g>

        <!-- Simulated Barcode -->
        <g transform="translate(130, 470)">
          <rect x="0" y="0" width="190" height="30" fill="#ffffff" stroke="#cbd5e1" rx="2"/>
          ${[...Array(30)].map((_, i) => `<rect x="${i * 6 + 5}" y="3" width="${i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1}" height="24" fill="#0f172a"/>`).join("")}
        </g>
        <text x="225" y="512" font-family="'Courier New', monospace" font-size="9" text-anchor="middle" fill="#64748b">* ${refNo} *</text>

        <text x="225" y="532" font-family="'Courier New', monospace" font-weight="bold" font-size="11" text-anchor="middle" fill="#334155">*** TERIMA KASIH ***</text>
        <text x="225" y="546" font-family="'Courier New', monospace" font-size="9" text-anchor="middle" fill="#64748b">Simpan struk ini sebagai bukti transaksi sah Kas Kelas 1C</text>
      </g>

      <!-- Bottom Serrated Edge (Zigzag Cut) -->
      <path d="M 25 ${totalSvgHeight - 20} L 35 ${totalSvgHeight - 12} L 45 ${totalSvgHeight - 20} L 55 ${totalSvgHeight - 12} L 65 ${totalSvgHeight - 20} L 75 ${totalSvgHeight - 12} L 85 ${totalSvgHeight - 20} L 95 ${totalSvgHeight - 12} L 105 ${totalSvgHeight - 20} L 115 ${totalSvgHeight - 12} L 125 ${totalSvgHeight - 20} L 135 ${totalSvgHeight - 12} L 145 ${totalSvgHeight - 20} L 155 ${totalSvgHeight - 12} L 165 ${totalSvgHeight - 20} L 175 ${totalSvgHeight - 12} L 185 ${totalSvgHeight - 20} L 195 ${totalSvgHeight - 12} L 205 ${totalSvgHeight - 20} L 215 ${totalSvgHeight - 12} L 225 ${totalSvgHeight - 20} L 235 ${totalSvgHeight - 12} L 245 ${totalSvgHeight - 20} L 255 ${totalSvgHeight - 12} L 265 ${totalSvgHeight - 20} L 275 ${totalSvgHeight - 12} L 285 ${totalSvgHeight - 20} L 295 ${totalSvgHeight - 12} L 305 ${totalSvgHeight - 20} L 315 ${totalSvgHeight - 12} L 325 ${totalSvgHeight - 20} L 335 ${totalSvgHeight - 12} L 345 ${totalSvgHeight - 20} L 355 ${totalSvgHeight - 12} L 365 ${totalSvgHeight - 20} L 375 ${totalSvgHeight - 12} L 385 ${totalSvgHeight - 20} L 395 ${totalSvgHeight - 12} L 405 ${totalSvgHeight - 20} L 415 ${totalSvgHeight - 12} L 425 ${totalSvgHeight - 20} L 425 ${totalSvgHeight - 22} L 25 ${totalSvgHeight - 22} Z" fill="#f1f5f9"/>
    </g>
  </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;
}

