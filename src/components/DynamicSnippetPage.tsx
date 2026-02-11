import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, ArrowLeft, Zap, Loader2 } from 'lucide-react';
import BlockRendererReact from './blocks/BlockRendererReact';
import Badge from './ui/Badge';
import ShareButtons from './ui/ShareButtons';
import Card from './Card';
import type { WPCodeSnippet } from '../types/wp';

const API_BASE = 'https://code.amsot.net/wp-json/wp/v2';

export default function DynamicSnippetPage() {
  const [snippet, setSnippet] = useState<WPCodeSnippet | null>(null);
  const [relatedSnippets, setRelatedSnippets] = useState<WPCodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.replace(/\/$/, '').split('/');
    const slug = pathParts[pathParts.length - 1];

    if (!slug || slug === 'codes' || slug === 'dynamic') {
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/codes?slug=${encodeURIComponent(slug)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(async (data: WPCodeSnippet[]) => {
        if (data.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const s = data[0];
        setSnippet(s);

        // Update page title
        document.title = `${s.title.rendered.replace(/<[^>]*>/g, '')} | TWF.code`;

        // Fetch related snippets by category
        const categoryIds = s.nombres_categorias?.map((c: any) => c.id || c.term_id) || [];
        if (categoryIds.length > 0) {
          try {
            const relRes = await fetch(
              `${API_BASE}/codes?snippet-categories=${categoryIds.join(',')}&per_page=4&exclude=${s.id}`
            );
            if (relRes.ok) {
              const relData = await relRes.json();
              setRelatedSnippets(relData);
            }
          } catch {
            // Ignore related fetch errors
          }
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
          <p className="text-lg font-black uppercase tracking-widest">Cargando Snippet...</p>
        </div>
      </div>
    );
  }

  if (notFound || !snippet) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-black uppercase italic mb-4">
            404<span className="text-[#ff3344]">!</span>
          </h1>
          <p className="text-2xl font-black uppercase tracking-tight mb-8">
            Ruta no encontrada
          </p>
          <a
            href="/codes"
            className="inline-flex items-center gap-4 px-10 py-5 border-2 border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-black uppercase tracking-widest hover:bg-[#ff3344] transition-all"
          >
            <ArrowLeft size={20} />
            Ir al Archivo
          </a>
        </div>
      </div>
    );
  }

  const { title, date, acf, datos_autor, nombres_categorias, nombres_tags, slug } = snippet;
  const formattedDate = format(new Date(date), 'dd.MM.yyyy', { locale: es });
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://code.amsot.net/codes/${slug}`;

  return (
    <article className="min-h-screen pt-20">
      {/* Header */}
      <div className="border-b-2 border-[var(--text-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <a
            href="/codes"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3344] mb-8 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={14} /> ARCHIVO
          </a>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <Badge difficulty={acf.dificultad} />
            <span className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Calendar size={14} /> {formattedDate}
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] mb-10 italic tracking-tighter"
            dangerouslySetInnerHTML={{ __html: title.rendered }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-[var(--border-color)]">
            <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-tight">
              {acf.extracto_corto}
            </p>
            <div className="flex flex-wrap gap-8 items-center md:justify-end">
              {datos_autor && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#ff3344] mb-1">AUTOR</span>
                  <a
                    href={`/author/${datos_autor.id}`}
                    className="text-sm font-black uppercase hover:text-[#ff3344] transition-colors"
                  >
                    {datos_autor.nombre}
                  </a>
                </div>
              )}
              {nombres_categorias?.[0] && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#ff3344] mb-1">CATEGORIA</span>
                  <a
                    href={`/category/${nombres_categorias[0].slug}`}
                    className="text-sm font-black uppercase hover:underline"
                  >
                    {nombres_categorias[0].name}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-8">
          <div className="prose prose-xl dark:prose-invert max-w-none
            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic prose-headings:text-[var(--text-primary)]
            prose-p:text-lg md:text-xl prose-p:font-medium prose-p:text-[var(--text-primary)] prose-p:leading-relaxed
            prose-a:text-[#ff3344] prose-a:font-black prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-8 prose-blockquote:border-[#ff3344] prose-blockquote:bg-[var(--bg-secondary)] prose-blockquote:font-bold prose-blockquote:uppercase prose-blockquote:rounded-none prose-blockquote:text-[var(--text-primary)]
            prose-strong:text-[var(--text-primary)] prose-strong:font-black
            prose-li:text-[var(--text-primary)] prose-li:font-medium prose-li:leading-relaxed"
          >
            <BlockRendererReact blocks={acf.contenido_snippet} />
          </div>

          {relatedSnippets.length > 0 && (
            <div className="mt-24 pt-16 border-t-4 border-[var(--text-primary)]">
              <div className="flex items-center gap-4 mb-10">
                <Zap size={32} className="text-[#ff3344]" />
                <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-[var(--text-primary)]">
                  Relacionados
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedSnippets.map(s => (
                  <Card key={s.id} snippet={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="p-8 border-4 border-[var(--text-primary)] bg-[var(--bg-secondary)] shadow-[8px_8px_0px_0px_#ff3344]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff3344] mb-6">ETIQUETAS</h3>
              <div className="flex flex-wrap gap-2">
                {nombres_tags?.map((tag) => (
                  <a
                    key={tag.slug}
                    href={`/tag/${tag.slug}`}
                    className="text-[10px] font-black uppercase px-3 py-1.5 border-2 border-[var(--text-primary)] hover:bg-[#ff3344] hover:text-white transition-all"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="p-8 border-4 border-[var(--text-primary)] bg-[var(--bg-primary)]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff3344] mb-6">COMPARTIR</h3>
              <ShareButtons title={title.rendered} url={currentUrl} />
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
