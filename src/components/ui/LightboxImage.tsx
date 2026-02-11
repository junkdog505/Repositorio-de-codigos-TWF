import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxProps {
  src: string;
  alt: string;
}

export default function LightboxImage({ src, alt }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setScale(1);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <>
      <div 
        className="relative my-10 cursor-zoom-in group border-2 border-[var(--text-primary)] overflow-hidden bg-[var(--bg-secondary)]"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto max-h-[600px] object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[#ff3344]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em]">
            Expandir Plano Técnico
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute top-0 left-0 w-full h-20 border-b-2 border-[var(--text-primary)] flex items-center justify-between px-8 bg-[var(--bg-primary)]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{alt}</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleZoomOut} 
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-color)] hover:bg-[#ff3344] hover:text-white transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={18}/>
              </button>
              <button 
                onClick={handleZoomIn} 
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-color)] hover:bg-[#ff3344] hover:text-white transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={18}/>
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="ml-4 w-10 h-10 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[#ff3344] transition-colors shadow-lg shadow-[#ff3344]/20"
              >
                <X size={20}/>
              </button>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center overflow-auto pt-20">
            <div 
              className="transition-transform duration-200 ease-out origin-center"
              style={{ transform: `scale(${scale})` }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={src} 
                alt={alt} 
                className="max-w-[90vw] max-h-[80vh] object-contain shadow-2xl"
                style={{ cursor: scale > 1 ? 'grab' : 'default' }}
              />
            </div>
          </div>

          <div className="absolute bottom-8 right-8 text-[10px] font-black uppercase tracking-widest bg-[var(--text-primary)] text-[var(--bg-primary)] px-3 py-1">
            Zoom: {Math.round(scale * 100)}%
          </div>
        </div>
      )}
    </>
  );
}
