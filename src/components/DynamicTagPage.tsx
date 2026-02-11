import React, { useState, useEffect } from 'react';
import DynamicSnippetList from './DynamicSnippetList';
import { Hash, Loader2 } from 'lucide-react';
import type { TaxonomyTerm } from '../types/wp';

const API_BASE = 'https://code.amsot.net/wp-json/wp/v2';

export default function DynamicTagPage() {
  const [tag, setTag] = useState<TaxonomyTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.replace(/\/$/, '').split('/');
    const slug = pathParts[pathParts.length - 1];

    if (!slug || slug === 'tag' || slug === 'dynamic') {
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/snippet-tags?slug=${encodeURIComponent(slug)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: TaxonomyTerm[]) => {
        if (data.length === 0) {
          setNotFound(true);
        } else {
          setTag(data[0]);
          document.title = `Etiqueta: ${data[0].name} | TWF.code`;
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#ff3344] animate-spin mx-auto mb-6" />
          <p className="text-lg font-black uppercase tracking-widest">Cargando Etiqueta...</p>
        </div>
      </div>
    );
  }

  if (notFound || !tag) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-black uppercase italic mb-4">404<span className="text-[#ff3344]">!</span></h1>
          <p className="text-2xl font-black uppercase tracking-tight mb-8">Etiqueta no encontrada</p>
          <a href="/tags" className="inline-flex items-center gap-4 px-10 py-5 border-2 border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-widest hover:bg-[#ff3344] transition-all">
            Ir a Etiquetas
          </a>
        </div>
      </div>
    );
  }

  const tagId = tag.id || tag.term_id;

  return (
    <>
      <section className="pt-32 pb-20 px-6 border-b-2 border-[var(--text-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#ff3344] flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Hash size={20} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Nodo de Referencia</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8 italic">
            #{tag.name}<span className="text-[#ff3344]">.</span>
          </h1>
          <p className="text-lg font-bold text-[var(--text-secondary)] max-w-xl uppercase tracking-tight leading-tight">
            Recursos tecnicos detectados bajo este descriptor.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <DynamicSnippetList
          apiParams={{ 'snippet-tags': tagId }}
          emptyMessage="Sin Despliegues para este Tag"
        />
      </div>
    </>
  );
}
