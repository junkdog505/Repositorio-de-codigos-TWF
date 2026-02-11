import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import type { WPCodeSnippet } from '../types/wp';
import { Zap } from 'lucide-react';
import gsap from 'gsap';

interface DynamicSnippetListProps {
  limit?: number;
  /** Snippets pre-renderizados en build time (fallback mientras carga la API) */
  staticSnippets?: WPCodeSnippet[];
}

const API_BASE = 'https://code.amsot.net/wp-json/wp/v2';

export default function DynamicSnippetList({ limit, staticSnippets = [] }: DynamicSnippetListProps) {
  const [snippets, setSnippets] = useState<WPCodeSnippet[]>(staticSnippets);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const perPage = limit || 100;

    fetch(`${API_BASE}/codes?per_page=${perPage}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: WPCodeSnippet[]) => {
        setSnippets(data);
        setLoading(false);
      })
      .catch(() => {
        // Si falla la API, mantenemos los staticSnippets
        setError(true);
        setLoading(false);
      });
  }, [limit]);

  useEffect(() => {
    if (!loading && !hasAnimated.current && gridRef.current && gridRef.current.children.length > 0) {
      hasAnimated.current = true;
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [loading, snippets]);

  if (loading && staticSnippets.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(limit || 6)].map((_, i) => (
          <div
            key={i}
            className="bg-[var(--bg-secondary)] border-2 border-[var(--text-primary)] p-8 h-64 animate-pulse"
          >
            <div className="h-4 w-24 bg-[var(--border-color)] mb-8" />
            <div className="h-6 w-3/4 bg-[var(--border-color)] mb-4" />
            <div className="h-6 w-1/2 bg-[var(--border-color)] mb-6" />
            <div className="h-4 w-full bg-[var(--border-color)] mb-2" />
            <div className="h-4 w-2/3 bg-[var(--border-color)]" />
          </div>
        ))}
      </div>
    );
  }

  if (snippets.length === 0 && !loading) {
    return (
      <div className="col-span-full py-32 border-4 border-dashed border-[var(--text-primary)] text-center opacity-30">
        <Zap size={48} className="mx-auto mb-6" />
        <p className="text-2xl font-black uppercase tracking-tighter">Sin Despliegues Activos</p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {snippets.map((snippet) => (
        <Card key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
