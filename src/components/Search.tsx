import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import Card from './Card';
import type { WPCodeSnippet } from '../types/wp';
import gsap from 'gsap';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WPCodeSnippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<any>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasSearched && resultsRef.current) {
      gsap.fromTo(resultsRef.current.children, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [results, hasSearched]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://code.amsot.net/wp-json/wp/v2/codes?search=${encodeURIComponent(query)}&per_page=9`);
        if (!res.ok) throw new Error('Error fetching');
        const data = await res.json();
        setResults(data);
      } catch (err) {
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
    <div className="w-full">
      <div className="relative group mb-12">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[var(--text-primary)] group-focus-within:text-[#ff3344] transition-colors">
          <SearchIcon className="h-6 w-6" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-16 pr-16 py-6 text-xl font-black border-4 border-[var(--text-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-30 focus:outline-none focus:bg-[var(--bg-primary)] focus:shadow-[8px_8px_0px_0px_#ff3344] transition-all duration-300 uppercase tracking-tighter"
          placeholder="TERMINAL_BUSQUEDA_"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading ? (
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                <Loader2 className="h-6 w-6 text-[#ff3344] animate-spin" />
            </div>
        ) : query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute inset-y-0 right-0 pr-6 flex items-center text-[var(--text-secondary)] hover:text-[#ff3344] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {hasSearched && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex items-center justify-between border-b-4 border-[var(--text-primary)] pb-4">
            <h2 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">
              RESULTADOS <span className="text-[#ff3344] not-italic">// {query}</span>
            </h2>
            {!loading && (
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#ff3344] px-3 py-1 text-white border-2 border-black">
                {results.length} SNIPPETS
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[var(--bg-secondary)] border-2 border-[var(--text-primary)] p-4 h-20 shadow-[4px_4px_0px_0px_#ff3344] opacity-50 animate-pulse"></div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div ref={resultsRef} className="grid grid-cols-1 gap-4">
              {results.map((snippet) => (
                <a 
                  key={snippet.id} 
                  href={`/codes/${snippet.slug}`}
                  className="flex items-center justify-between p-4 bg-[var(--bg-primary)] border-2 border-[var(--text-primary)] hover:bg-[#ff3344] hover:text-white transition-all group"
                >
                  <div className="flex flex-col">
                    <h3 className="font-black uppercase text-sm leading-tight" dangerouslySetInnerHTML={{ __html: snippet.title.rendered }} />
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{snippet.acf.dificultad}</span>
                  </div>
                  <SearchIcon size={16} className="opacity-40 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 border-2 border-dashed border-[var(--text-primary)]">
                <h3 className="text-xl font-black uppercase">SIN RESULTADOS</h3>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
