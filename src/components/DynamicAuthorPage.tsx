import React, { useState, useEffect } from 'react';
import DynamicSnippetList from './DynamicSnippetList';
import Search from './Search';
import { User, Loader2 } from 'lucide-react';
import type { AuthorData } from '../types/wp';

const API_BASE = 'https://code.amsot.net/wp-json/wp/v2';

export default function DynamicAuthorPage() {
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.replace(/\/$/, '').split('/');
    const idStr = pathParts[pathParts.length - 1];

    if (!idStr || idStr === 'author' || idStr === 'dynamic') {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const userId = parseInt(idStr, 10);
    if (isNaN(userId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((user: any) => {
        const authorData: AuthorData = {
          id: user.id,
          nombre: user.name,
          avatar: user.avatar_urls?.['96'] || '',
        };
        setAuthor(authorData);
        document.title = `Autor: ${user.name} | TWF.code`;
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
          <p className="text-lg font-black uppercase tracking-widest">Cargando Autor...</p>
        </div>
      </div>
    );
  }

  if (notFound || !author) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-black uppercase italic mb-4">404<span className="text-[#ff3344]">!</span></h1>
          <p className="text-2xl font-black uppercase tracking-tight mb-8">Autor no encontrado</p>
          <a href="/" className="inline-flex items-center gap-4 px-10 py-5 border-2 border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-widest hover:bg-[#ff3344] transition-all">
            Ir al Inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-20 p-8 border-4 border-black dark:border-white bg-[var(--bg-secondary)] shadow-[12px_12px_0px_0px_#ff3344]">
          <div className="relative shrink-0">
            {author.avatar ? (
              <img src={author.avatar} alt={author.nombre} className="w-32 h-32 border-4 border-[var(--text-primary)] grayscale" />
            ) : (
              <div className="w-32 h-32 bg-[var(--bg-primary)] border-4 border-[var(--text-primary)] flex items-center justify-center">
                <User className="w-16 h-16 text-[#ff3344]" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black uppercase italic mb-2">{author.nombre}</h2>
            <div className="inline-flex items-center gap-3 px-4 py-1 bg-[#ff3344] text-white text-xs font-black uppercase tracking-widest">
              COLABORADOR
            </div>
          </div>
        </div>

        <DynamicSnippetList
          apiParams={{ author: author.id }}
          emptyMessage="Sin Despliegues Activos"
        />
      </div>
    </>
  );
}
