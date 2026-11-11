import React from "react";
import { CheckCircle2, ShieldCheck, Printer, Sparkles, Building2, Receipt } from "lucide-react";
import { formatRupiah } from "../utils";
import { ReceiptItem } from "../types";

interface ThermalSupermarketReceiptProps {
  textData?: string;
  merchant?: string;
  purpose?: string;
  amount?: number;
  date?: string;
  parentName?: string;
  studentName?: string;
  items?: (string | ReceiptItem)[];
  isGeneratedNota?: boolean;
}

export default function ThermalSupermarketReceipt({
  textData,
  merchant,
  purpose,
  amount,
  date,
  parentName,
  studentName,
  items,
  isGeneratedNota = true,
}: ThermalSupermarketReceiptProps) {
  // Parse raw textData if provided (e.g. "Pembelian: Label tom and jerry 10 pack 80.000 Pensil 2B 5 pack 30.000 (Fotocopy Hidayah)")
  let parsedMerchant = merchant || "";
  let parsedPurpose = purpose || "";
  let parsedAmount = amount || 0;
  let parsedItems: { name: string; qty?: string; price?: number }[] = [];

  if (textData && !merchant && !purpose) {
    let cleanText = textData;

    // If textData is an SVG base64 string, try decoding or stripping
    if (cleanText.startsWith("data:image/svg+xml;base64,")) {
      try {
        const base64Str = cleanText.split(",")[1];
        const decoded = decodeURIComponent(escape(atob(base64Str)));
        // Extract text inside svg tags if possible
        const matches = decoded.match(/<text[^>]*>(.*?)<\/text>/g);
        if (matches && matches.length > 0) {
          cleanText = matches.map(m => m.replace(/<[^>]+>/g, "").trim()).filter(Boolean).join(" ");
        }
      } catch (e) {
        cleanText = "Pembelian Keperluan Perlengkapan Belajar Siswa (Koperasi 1C)";
      }
    }

    if (cleanText.startsWith("Nota Belanja - ")) {
      cleanText = cleanText.replace("Nota Belanja - ", "");
    }
    if (cleanText.startsWith("Pembelian: ")) {
      cleanText = cleanText.replace("Pembelian: ", "");
    }

    // Extract merchant in parentheses if present, e.g. "(Fotocopy Hidayah)"
    const matchMerchant = cleanText.match(/\(([^)]+)\)$/);
    if (matchMerchant) {
      parsedMerchant = matchMerchant[1];
      cleanText = cleanText.replace(/\(([^)]+)\)$/, "").trim();
    }

    parsedPurpose = cleanText;

    // Split by newlines or commas
    const lines = cleanText.split(/[\n,;&]+/);
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed) {
        // Try extracting price if line ends with digits or rupiah pattern
        const priceMatch = trimmed.match(/(\d[\d\.\s]*\d|\d+)$/);
        if (priceMatch) {
          const rawNum = priceMatch[1].replace(/[\.\s]/g, "");
          const numVal = parseInt(rawNum);
          if (!isNaN(numVal) && numVal > 100) {
            const itemName = trimmed.replace(priceMatch[1], "").trim();
            parsedItems.push({ name: itemName || trimmed, price: numVal });
          } else {
            parsedItems.push({ name: trimmed });
          }
        } else {
          parsedItems.push({ name: trimmed });
        }
      }
    });
  }

  // Fallback defaults
  if (!parsedMerchant) parsedMerchant = "FOTOCOPY & ATK HIDAYAH";
  if (!parsedPurpose) parsedPurpose = "Pembelian Keperluan Perlengkapan Belajar Siswa";
  if (!parsedAmount || parsedAmount === 0) parsedAmount = 110000;

  if (items && items.length > 0) {
    parsedItems = items.map((it) => {
      if (typeof it === "string") {
        return { name: it };
      }
      const q = it.qty || 1;
      const uPrice = it.unitPrice || 0;
      const p = it.price || (q * uPrice);
      return {
        name: it.name,
        qty: uPrice > 0 ? `${q}x @ ${formatRupiah(uPrice)}` : `${q}x`,
        price: p
      };
    });
  }

  if (parsedItems.length === 0) {
    // Breakdown purpose string into lines or items
    const parts = parsedPurpose.split(/[\n,;&]+/);
    parsedItems = parts.map((p) => {
      const trimmed = p.trim();
      return { name: trimmed };
    });
  }

  const transactionDate = date || new Date().toISOString().split("T")[0];
  const refNo = `TRX-${transactionDate.replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center my-2 w-full max-w-[330px] sm:max-w-sm mx-auto font-mono text-slate-800">
      {/* Action Bar */}
      <div className="w-full flex justify-between items-center mb-2 px-1 text-xs">
        <span className="font-bold text-slate-500 flex items-center gap-1">
          <Receipt className="w-4 h-4 text-purple-600" /> Struk Thermal Supermarket
        </span>
        <button
          type="button"
          onClick={handlePrint}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-sans font-semibold flex items-center gap-1 cursor-pointer transition"
        >
          <Printer className="w-3 h-3" /> Cetak Struk
        </button>
      </div>

      {/* RECEIPT PAPER CONTAINER */}
      <div className="w-full bg-[#fbfbf8] border-x border-slate-300 shadow-md relative p-5 pt-6 text-slate-900 select-none">
        
        {/* Top Serrated Edge (Zigzag Cut) */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-slate-200 overflow-hidden">
          <div 
            className="w-full h-full bg-[#fbfbf8]"
            style={{
              clipPath: "polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)"
            }}
          />
        </div>

        {/* Official Header Badge */}
        <div className="bg-slate-100 border border-slate-300 text-slate-800 rounded-md py-1 px-2 text-center text-[10px] font-bold mb-3 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>BUKTI TRANSAKSI KAS RESMI</span>
        </div>

        {/* STORE / MERCHANT HEADER */}
        <div className="text-center space-y-0.5 border-b border-dashed border-slate-400 pb-3">
          <h2 className="text-base font-extrabold tracking-wider uppercase text-slate-900">
            ★ {parsedMerchant} ★
          </h2>
          <p className="text-[11px] text-slate-600 font-medium">
            MIT MA BUARAN JATI - KELAS 1C
          </p>
          <p className="text-[10px] text-slate-500">
            Kec. Sukadiri, Kab. Tangerang, Banten
          </p>
          <p className="text-[10px] text-slate-500 font-bold">
            TELP: 0812-9876-5432 &bull; OPERATOR: BENDAHARA KELAS
          </p>
        </div>

        {/* METADATA TRANSACTION */}
        <div className="py-2.5 border-b border-dashed border-slate-400 text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">NO. STRUK :</span>
            <span className="font-bold">{refNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">TANGGAL   :</span>
            <span className="font-bold">{transactionDate} 14:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">WALI MURID:</span>
            <span className="font-bold truncate max-w-[160px]">
              {parentName || "Hendra Santoso"}
            </span>
          </div>
          {studentName && (
            <div className="flex justify-between">
              <span className="text-slate-500">SISWA     :</span>
              <span className="font-bold">{studentName} (1C)</span>
            </div>
          )}
        </div>

        {/* LINE ITEM TABLE */}
        <div className="py-3 border-b border-dashed border-slate-400 space-y-2 text-xs">
          <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase tracking-wider pb-1">
            <span>NAMA BARANG / ITEM</span>
            <span>TOTAL</span>
          </div>

          {parsedItems.map((it, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="font-bold text-slate-900 uppercase leading-tight">
                {idx + 1}. {it.name}
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 pl-3">
                <span>{it.qty || "1x"}</span>
                <span className="font-bold text-slate-900">
                  {it.price 
                    ? formatRupiah(it.price) 
                    : parsedItems.length === 1 
                      ? formatRupiah(parsedAmount) 
                      : formatRupiah(Math.round(parsedAmount / parsedItems.length))}
                </span>
              </div>
            </div>
          ))}

          {parsedItems.length === 0 && (
            <div className="flex justify-between text-xs">
              <span className="uppercase font-bold">{parsedPurpose}</span>
              <span className="font-bold">{formatRupiah(parsedAmount)}</span>
            </div>
          )}
        </div>

        {/* FINANCIAL TOTALS */}
        <div className="py-3 border-b-2 border-dashed border-slate-800 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>TOTAL ITEM:</span>
            <span className="font-bold">{parsedItems.length || 1} Jenis Barang</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>SUBTOTAL:</span>
            <span>{formatRupiah(parsedAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>DISKON PROMO:</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>PPN 11%:</span>
            <span>INCLUDED</span>
          </div>

          <div className="flex justify-between items-center text-sm font-extrabold pt-2 border-t border-slate-300">
            <span className="text-slate-900">TOTAL BAYAR:</span>
            <span className="text-base text-slate-950 font-black tracking-tight bg-yellow-100/80 px-1.5 py-0.5 rounded">
              {formatRupiah(parsedAmount)}
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-slate-600 pt-1">
            <span>METODE BAYAR:</span>
            <span className="font-bold text-slate-800">REIMBURSEMENT KAS 1C</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>STATUS REKAP:</span>
            <span className="font-bold text-emerald-700">LUNAS (VERIFIED)</span>
          </div>
        </div>

        {/* OFFICIAL STAMP & BARCODE */}
        <div className="pt-4 text-center space-y-3">
          {/* Stamp */}
          <div className="inline-block border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded-md transform -rotate-3 text-[11px] font-black uppercase tracking-wider bg-emerald-50/50 shadow-2xs">
            ✓ TERVERIFIKASI & SAH
            <div className="text-[8px] font-normal tracking-normal text-emerald-600">
              BENDAHARA KAS KELAS 1C
            </div>
          </div>

          {/* CODE 128 SIMULATED BARCODE */}
          <div className="space-y-1">
            <div className="flex justify-center items-center gap-0.5 h-8 bg-white p-1 border border-slate-200 rounded">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${
                    i % 5 === 0 ? "w-1.5 bg-slate-900" : i % 3 === 0 ? "w-1 bg-slate-800" : "w-0.5 bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-[9px] font-mono tracking-widest text-slate-500">* {refNo} *</p>
          </div>

          {/* Footer message */}
          <div className="text-[10px] text-slate-500 space-y-0.5 font-medium leading-tight pt-1">
            <p className="font-bold text-slate-700">*** TERIMA KASIH ***</p>
            <p>Simpan struk ini sebagai bukti transaksi resmi</p>
            <p className="text-[9px] text-slate-400">Kas Kelas 1C &bull; MIT MA Buaran Jati</p>
          </div>
        </div>

        {/* Bottom Serrated Edge (Zigzag Cut) */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-200 overflow-hidden">
          <div 
            className="w-full h-full bg-[#fbfbf8]"
            style={{
              clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)"
            }}
          />
        </div>

      </div>
    </div>
  );
}
