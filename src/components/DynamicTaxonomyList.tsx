import React, { useState, useEffect, useRef } from 'react';
import type { TaxonomyTerm } from '../types/wp';
import gsap from 'gsap';

interface DynamicTaxonomyListProps {
  type: 'categories' | 'tags';
  staticItems?: TaxonomyTerm[];
}

const API_BASE = 'https://code.amsot.net/wp-json/wp/v2';

const endpoints: Record<string, string> = {
  categories: 'snippet-categories',
  tags: 'snippet-tags',
};

export default function DynamicTaxonomyList({ type, staticItems = [] }: DynamicTaxonomyListProps) {
  const [items, setItems] = useState<TaxonomyTerm[]>(staticItems);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    fetch(`${API_BASE}/${endpoints[type]}?per_page=100&hide_empty=true`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: TaxonomyTerm[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [type]);

  useEffect(() => {
    if (!loading && !hasAnimated.current && containerRef.current && containerRef.current.children.length > 0) {
      hasAnimated.current = true;
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [loading, items]);

  if (loading && staticItems.length === 0) {
    const count = type === 'categories' ? 8 : 12;
    if (type === 'categories') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border-2 border-[var(--text-primary)] p-8 h-40 animate-pulse">
              <div className="h-3 w-16 bg-[var(--border-color)] mb-8" />
              <div className="h-6 w-3/4 bg-[var(--border-color)] mb-4" />
              <div className="h-3 w-20 bg-[var(--border-color)]" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-3 md:gap-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-[var(--bg-secondary)] border-2 border-[var(--text-primary)] px-6 py-3 h-10 w-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'categories') {
    return (
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {items.map((cat) => (
          <a
            key={cat.id || cat.term_id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col p-8 bg-[var(--bg-secondary)] border-2 border-[var(--text-primary)] hover:bg-[var(--bg-primary)] hover:shadow-[8px_8px_0px_0px_#ff3344] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black font-mono">POSTS: {cat.count}</span>
              <div className="w-2 h-2 bg-[#ff3344]" />
            </div>
            <h2 className="text-2xl font-black uppercase leading-[0.9] group-hover:text-[#ff3344] transition-colors mb-4">
              {cat.name}
            </h2>
            <div className="mt-auto text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-[#ff3344] transition-all">
              ACCEDER &rarr;
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Tags layout
  return (
    <div ref={containerRef} className="flex flex-wrap gap-3 md:gap-4">
      {items.map((tag) => (
        <a
          key={tag.id || tag.term_id}
          href={`/tag/${tag.slug}`}
          className="group px-6 py-3 border-2 border-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[#ff3344] hover:text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
        >
          <span className="text-xs md:text-sm font-black uppercase">#{tag.name}</span>
          <span className="ml-3 text-[10px] font-black opacity-30 group-hover:opacity-100">{tag.count}</span>
        </a>
      ))}
    </div>
  );
}
