import React from 'react';
import { Share2, Twitter, Linkedin, Copy } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string; // Should be full URL if possible, or build it
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const fullUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
        alert('Enlace copiado!');
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-500 mr-2">Compartir:</span>
      
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Compartir en Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Compartir en LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <button 
        onClick={handleCopy}
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Copiar enlace"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
}
