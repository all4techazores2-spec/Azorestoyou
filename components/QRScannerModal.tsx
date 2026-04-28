
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, RefreshCcw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  title: string;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScan, title }) => {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const startScanner = async () => {
        try {
          const html5QrCode = new Html5Qrcode("reader");
          scannerRef.current = html5QrCode;
          
          const qrCodeSuccessCallback = (decodedText: string) => {
            html5QrCode.stop().then(() => {
              onScan(decodedText);
            });
          };

          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          
          await html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            qrCodeSuccessCallback,
            undefined
          );
        } catch (err) {
          console.error("Erro ao iniciar câmera:", err);
          setError("Não foi possível aceder à câmera. Verifique as permissões.");
        }
      };

      // Pequeno atraso para o modal animar antes de ligar a camera
      const timer = setTimeout(startScanner, 500);
      return () => {
        clearTimeout(timer);
        if (scannerRef.current?.isScanning) {
          scannerRef.current.stop();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <div className="w-full flex justify-between items-center mb-8 px-4">
          <div className="text-white">
            <h2 className="text-xl font-black tracking-tight">{title}</h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Aponte para o QR Code do Restaurante</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="relative w-full aspect-square max-w-[320px] rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl">
          <div id="reader" className="w-full h-full bg-slate-900"></div>
          
          {/* Overlay do Scanner */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-[40px] border-black/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-2 border-blue-500 rounded-2xl shadow-[0_0_0_999px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 animate-pulse bg-blue-500/10"></div>
              {/* Cantos */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
            </div>
            
            {/* Linha Laser Animada */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[180px] h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {error ? (
          <div className="mt-8 p-6 bg-red-500/20 border border-red-500/50 rounded-3xl text-center">
            <p className="text-red-200 text-sm font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="p-4 bg-white/5 rounded-full animate-bounce">
              <Camera className="text-white/40" size={24} />
            </div>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">A processar imagem...</p>
          </div>
        )}

        <style>{`
          @keyframes scan {
            0% { transform: translate(-50%, -100px); }
            50% { transform: translate(-50%, 100px); }
            100% { transform: translate(-50%, -100px); }
          }
          #reader video {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default QRScannerModal;
