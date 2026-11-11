import React, { useState, useEffect } from "react";
import { Download, Smartphone, X, CheckCircle, Share, PlusSquare, Sparkles, ArrowRight } from "lucide-react";

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
  isStandalone: boolean;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
  isStandalone
}) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* Top Decorative Background Header */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-purple-700 via-purple-600 to-emerald-600 p-6 flex items-start justify-between">
          <div className="flex items-center gap-2 text-white">
            <Smartphone className="w-6 h-6 text-yellow-300" />
            <span className="font-extrabold text-sm tracking-wide font-display">APLIKASI HP (PWA)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Logo Avatar */}
        <div className="relative pt-12 mb-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl border-4 border-white p-1 mb-2">
            <img src="/icon.svg" alt="Kas Kelas 1C Logo" className="w-full h-full rounded-xl object-cover" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 font-display">
            Pasang Kas Kelas 1C di HP
          </h2>
          <p className="text-xs text-slate-500 font-medium px-4 mt-1">
            Nikmati akses cepat instan dari Layar Utama HP tanpa mengetik alamat website!
          </p>
        </div>

        {/* Status / Instructions based on device state */}
        <div className="space-y-4 my-4">
          {isStandalone ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-emerald-900">Aplikasi Sudah Terpasang!</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Anda sudah membuka dalam mode aplikasi HP native.
              </p>
            </div>
          ) : deferredPrompt ? (
            /* Android / Chrome Native Prompt Button */
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-900">
                  <p className="font-bold">Keuntungan Aplikasi HP:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-purple-700">
                    <li>Ikon resmi Kas Kelas 1C di layar utama HP</li>
                    <li>Buka instan 1-klik layaknya aplikasi Play Store</li>
                    <li>Tampilan full screen tanpa browser bar</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={onTriggerInstall}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-700 to-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-yellow-300 animate-bounce" />
                <span>Instal Aplikasi Sekarang (1-Klik)</span>
              </button>
            </div>
          ) : isIOS ? (
            /* iOS Safari Step-by-Step Instructions */
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-left">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AppleIcon className="w-4 h-4 text-slate-700" />
                <span>Cara Instal di iPhone / iPad (Safari):</span>
              </p>
              <ol className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                  <span>Ketuk tombol <strong>Bagikan (Share)</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> di bagian bawah browser Safari.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                  <span>Gulir ke bawah dan pilih <strong>&quot;Tambah ke Layar Utama&quot;</strong> (Add to Home Screen) <PlusSquare className="w-3.5 h-3.5 inline text-slate-800 mx-0.5" />.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                  <span>Ketuk <strong>&quot;Tambah&quot;</strong> di kanan atas. Aplikasi siap dipakai di layar HP Anda!</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Fallback Chrome / Android / Desktop Instructions */
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-left">
              <p className="text-xs font-bold text-slate-800">
                Cara Instal Manual via Menu Browser:
              </p>
              <ol className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Ketuk titik tiga <strong>(⋮)</strong> di sudut kanan atas browser HP Anda.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Pilih opsi <strong>&quot;Instal Aplikasi&quot;</strong> atau <strong>&quot;Tambahkan ke Layar Utama&quot;</strong>.</span>
                </li>
              </ol>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition text-center"
        >
          Tutup & Lanjutkan ke Web
        </button>
      </div>
    </div>
  );
};

// Helper SVG Icon for Apple
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.3c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.16-.57 2.81-1.37z" />
  </svg>
);
