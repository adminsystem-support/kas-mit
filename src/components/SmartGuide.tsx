import React, { useState } from "react";
import { HelpCircle, ChevronLeft, ChevronRight, X, Info, CreditCard, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

interface SmartGuideProps {
  onClose: () => void;
}

export default function SmartGuide({ onClose }: SmartGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Selamat Datang di Kas Kelas 1C!",
      icon: <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />,
      description: "Aplikasi ini dirancang khusus untuk mempermudah Wali Murid dan Bendahara mengelola iuran Kas Kelas 1C dengan transparansi penuh, bebas ribet, dan aman.",
      tips: [
        "Wali Murid dapat memantau uang masuk, tumbuh kembang anak, dan mengajukan dana.",
        "Bendahara dapat memantau keuangan dan memverifikasi bukti transaksi otomatis dibantu AI.",
        "Aplikasi ini responsif dan dapat di-install di HP Anda!"
      ]
    },
    {
      title: "1. Cara Membayar Iuran Bulanan",
      icon: <CreditCard className="w-12 h-12 text-blue-500" />,
      description: "Setiap bulan, siswa memiliki kewajiban iuran Kas sebesar Rp 20.000 untuk kebutuhan kelas.",
      tips: [
        "Buka menu 'Iuran Bulanan Anak' di Dashboard Anda.",
        "Lihat daftar bulan yang masih bertanda merah (Belum Lunas).",
        "Klik 'Bayar Sekarang' lalu lakukan transfer ke rekening Bendahara yang tertera.",
        "Klik tombol 'Konfirmasi Pembayaran' untuk memperbarui data kas secara real-time!"
      ]
    },
    {
      title: "2. Mengajukan Kasbon (Dana Talangan)",
      icon: <Info className="w-12 h-12 text-purple-500" />,
      description: "Wali murid bisa mengajukan kasbon (pinjam dana kas) terlebih dahulu jika ada kebutuhan sekolah anak yang mendesak.",
      tips: [
        "Masuk ke tab 'Kasbon & Rembesan'.",
        "Klik tombol 'Ajukan Kasbon Baru'.",
        "Masukkan jumlah uang, detail kebutuhan, serta nomor rekening bank Anda.",
        "Bendahara akan langsung memproses persetujuan setelah memverifikasi sistem."
      ]
    },
    {
      title: "3. Mengajukan Rembesan (Reimbursement) & Potong Kasbon",
      icon: <TrendingUp className="w-12 h-12 text-emerald-500" />,
      description: "Rembesan dilakukan setelah Anda membeli keperluan anak secara mandiri menggunakan dana pribadi atau dari kasbon sebelumnya.",
      tips: [
        "Klik 'Ajukan Rembesan Baru' dan unggah foto/gambar bukti nota belanja.",
        "Unggah foto nota fisik atau struk belanja dari kamera / galeri HP.",
        "Aturan Potong Kasbon Otomatis:",
        "Jika Anda punya utang Kasbon (misal Rp 50.000) dan merembes Rp 100.000, sistem akan otomatis memotongnya sehingga Anda menerima transfer bersih sisa Rp 50.000.",
        "Jika tidak ada kasbon, dana akan ditransfer utuh Rp 100.000."
      ]
    },
    {
      title: "4. Verifikasi Bukti Transaksi secara Akurat",
      icon: <ShieldCheck className="w-12 h-12 text-teal-500" />,
      description: "Sistem mencatat setiap bukti transaksi secara transparan dan rapi.",
      tips: [
        "Setiap bukti yang diunggah wali murid tersimpan aman dan terlampir di buku kas kelas.",
        "Wali murid dan bendahara dapat melihat foto nota secara langsung kapan saja.",
        "Bendahara dapat memverifikasi nominal pengajuan sehingga meminimalisir kesalahan pencatatan keuangan."
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 font-display">Panduan Pengguna Pintar</h3>
              <p className="text-xs text-slate-500">Langkah demi langkah bagi Wali Murid & Bendahara</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-slate-50 rounded-2xl flex items-center justify-center">
            {steps[currentStep].icon}
          </div>
          
          <h4 className="text-lg font-bold text-slate-800 font-display mb-2">
            {steps[currentStep].title}
          </h4>
          
          <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md">
            {steps[currentStep].description}
          </p>

          <div className="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4">
            <h5 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              💡 Petunjuk Penting:
            </h5>
            <ul className="space-y-2">
              {steps[currentStep].tips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2 items-start">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? "bg-blue-600 w-5" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button 
                onClick={handlePrev} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Kembali
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button 
                onClick={handleNext} 
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1 shadow-sm transition"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={onClose} 
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
              >
                Saya Mengerti! 👍
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
