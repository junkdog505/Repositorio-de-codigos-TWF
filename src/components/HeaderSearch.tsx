// HeaderSearch Component - Compact for Header
import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import type { WPCodeSnippet } from '../types/wp';

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WPCodeSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://code.amsot.net/wp-json/wp/v2/codes?search=${encodeURIComponent(query)}&per_page=5`);
        if (!res.ok) throw new Error('Error fetching');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
        if(debounceRef.current) clearTimeout(debounceRef.current);
    }
  }, [query]);

  return (
    <div className="relative" ref={containerRef}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
          aria-label="Buscar"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
           <div className="relative">
              <input
                ref={inputRef}
                type="text"
                className="w-48 sm:w-64 px-4 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-slate-400 text-slate-900 dark:text-slate-100"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loading ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                   <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
                </div>
              ) : null}
           </div>
           <button 
             onClick={() => { setIsOpen(false); setQuery(''); }}
             className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && query && results.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
           <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                 Resultados
              </div>
              {results.map(snippet => (
                 <a 
                   key={snippet.id} 
                   href={`/codes/${snippet.slug}`}
                   className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                 >
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-1" dangerouslySetInnerHTML={{ __html: snippet.title.rendered }} />
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{snippet.acf.extracto_corto}</p>
                 </a>
              ))}
           </div>
        </div>
      )}
    </div>
  );
}
