import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Badge from './ui/Badge';
import { Terminal, ArrowUpRight } from 'lucide-react';
import type { WPCodeSnippet } from '../types/wp';

interface CardProps {
  snippet: WPCodeSnippet;
}

export default function Card({ snippet }: CardProps) {
  const { title, acf, date, slug } = snippet;
  const formattedDate = format(new Date(date), "dd.MM.yyyy", { locale: es });

  return (
    <a href={`/codes/${slug}`} className="group relative block bg-[var(--bg-primary)] border-2 border-[var(--text-primary)] p-8 hover:shadow-[10px_10px_0px_0px_#ff3344] transition-all duration-300 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <Terminal size={14} className="text-[#ff3344]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{formattedDate}</span>
          </div>
          <Badge difficulty={acf.dificultad} className="text-[8px]" />
        </div>

        <h3 className="text-2xl font-black uppercase leading-[1.1] mb-6 group-hover:text-[#ff3344] transition-colors" dangerouslySetInnerHTML={{ __html: title.rendered }} />

        <p className="text-sm font-bold text-[var(--text-secondary)] line-clamp-3 mb-8 tracking-tight leading-relaxed">
          {acf.extracto_corto}
        </p>
        
        <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#ff3344]">
          EXPLORAR SNIPPET <span>→</span>
        </div>
      </div>
    </a>
  );
}
