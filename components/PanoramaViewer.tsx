
import React, { useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface PanoramaViewerProps {
  imagePath: string;
  onClose: () => void;
}

declare global {
  interface Window {
    pannellum: any;
  }
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imagePath, onClose }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumInstance = useRef<any>(null);

  useEffect(() => {
    // Load Pannellum CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);

    // Load Pannellum JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => {
      if (viewerRef.current && window.pannellum) {
        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          type: 'equirectangular',
          panorama: imagePath,
          autoLoad: true,
          showControls: true,
          hfov: 110,
          vaov: 180,
          haov: 360,
          compass: true,
          northOffset: 247.5,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (pannellumInstance.current) {
        pannellumInstance.current.destroy();
      }
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, [imagePath]);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-in fade-in duration-500">
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 pointer-events-auto">
          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
            <Maximize2 size={16} className="text-blue-400" /> Experiência Imersiva 360°
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white text-black rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-2xl pointer-events-auto"
        >
          <X size={24} />
        </button>
      </div>

      <div ref={viewerRef} className="flex-1 w-full h-full" />

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
          Use o rato ou o dedo para explorar o espaço
        </div>
      </div>
    </div>
  );
};

export default PanoramaViewer;
