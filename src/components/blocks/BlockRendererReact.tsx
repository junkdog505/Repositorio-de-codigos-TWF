import React, { useState, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Info, AlertTriangle, Lightbulb, Zap, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { FlexibleContentBlock, BlockText, BlockCode, BlockImage, BlockAlert, BlockList, BlockSeparator } from '../../types/wp';

// --- Block Components ---

function TextBlock({ block }: { block: BlockText }) {
  return (
    <div
      className="prose prose-lg dark:prose-invert max-w-none my-8 text-[var(--text-primary)] leading-relaxed"
      dangerouslySetInnerHTML={{ __html: block.texto }}
    />
  );
}

const langMap: Record<string, string> = {
  php: 'php',
  css: 'css',
  javascript: 'javascript',
  js: 'javascript',
  html: 'markup',
  sql: 'sql',
  xml: 'markup',
  htaccess: 'markup',
  json: 'json',
  bash: 'bash',
  typescript: 'typescript',
  ts: 'typescript',
};

function CodeBlock({ block }: { block: BlockCode }) {
  const [copied, setCopied] = useState(false);
  const language = langMap[block.lenguaje] || 'markup';

  const handleCopy = () => {
    navigator.clipboard.writeText(block.codigo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="group relative my-12 border-2 border-[var(--text-primary)] bg-[#0d1117] shadow-[8px_8px_0px_0px_rgba(255,51,68,1)]">
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[var(--text-primary)] bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#ff3344]" />
          <span className="text-[10px] font-black font-mono tracking-widest text-white/60 uppercase">
            {block.lenguaje}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#ff3344] transition-colors"
        >
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
      <div className="p-6 text-[15px] leading-relaxed font-mono overflow-x-auto selection:bg-[#ff3344] selection:text-white">
        <Highlight theme={themes.nightOwl} code={block.codigo} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={{ ...style, backgroundColor: 'transparent', margin: 0, padding: 0 }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}

function ImageBlock({ block }: { block: BlockImage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const imageUrl = block.imagen?.sizes?.large || block.imagen?.url;
  const altText = block.imagen?.alt || block.caption || 'Snippet Image';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setScale(1);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!imageUrl) return null;

  return (
    <>
      <div
        className="relative my-16 cursor-zoom-in group border-2 border-[var(--text-primary)] overflow-hidden bg-[var(--bg-secondary)]"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-auto max-h-[600px] object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[#ff3344]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em]">
            Expandir Plano Tecnico
          </div>
        </div>
      </div>

      {block.caption && (
        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-center text-[var(--text-primary)] bg-[var(--bg-secondary)] py-2 border-x-2 border-b-2 border-black dark:border-white">
          {block.caption}
        </p>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute top-0 left-0 w-full h-20 border-b-2 border-[var(--text-primary)] flex items-center justify-between px-8 bg-[var(--bg-primary)]">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{altText}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.5, 1)); }}
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-color)] hover:bg-[#ff3344] hover:text-white transition-colors"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.5, 4)); }}
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-color)] hover:bg-[#ff3344] hover:text-white transition-colors"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-4 w-10 h-10 flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[#ff3344] transition-colors shadow-lg shadow-[#ff3344]/20"
              >
                <X size={20} />
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
                src={imageUrl}
                alt={altText}
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

function AlertBlock({ block }: { block: BlockAlert }) {
  const styles: Record<string, string> = {
    info: 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white shadow-[4px_4px_0px_0px_#3b82f6]',
    warning: 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white shadow-[4px_4px_0px_0px_#eab308]',
    tip: 'bg-white text-black border-black dark:bg-black dark:text-white dark:border-white shadow-[4px_4px_0px_0px_#22c55e]',
  };

  const colors: Record<string, string> = {
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    tip: 'text-green-500',
  };

  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    info: Info,
    warning: AlertTriangle,
    tip: Lightbulb,
  };

  const Icon = icons[block.tipo_alerta] || Info;

  return (
    <div className={`my-10 p-6 border-4 flex gap-4 ${styles[block.tipo_alerta] || styles.info}`}>
      <div className={`flex-shrink-0 mt-1 ${colors[block.tipo_alerta] || colors.info}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div
        className="text-lg font-bold leading-snug prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: block.contenido_alerta }}
      />
    </div>
  );
}

function ListBlock({ block }: { block: BlockList }) {
  return (
    <ul className="space-y-4 my-10">
      {block.items_lista?.map((itemObj, i) => (
        <li key={i} className="flex items-center gap-4 text-[var(--text-primary)] font-bold text-xl">
          <Zap className="w-6 h-6 text-[#ff3344] flex-shrink-0" />
          <span>{itemObj.item}</span>
        </li>
      ))}
    </ul>
  );
}

function SeparatorBlock({ block }: { block: BlockSeparator }) {
  const styles: Record<string, string> = {
    simple: 'border-t border-slate-200 dark:border-slate-700 my-8',
    doble: 'border-t-4 border-double border-slate-200 dark:border-slate-700 my-8',
    espaciado: 'my-12',
  };

  return <hr className={styles[block.estilo] || styles.simple} />;
}

// --- Main Renderer ---

interface BlockRendererReactProps {
  blocks: FlexibleContentBlock[];
}

export default function BlockRendererReact({ blocks }: BlockRendererReactProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => {
        switch (block.acf_fc_layout) {
          case 'bloque_texto':
            return <TextBlock key={index} block={block} />;
          case 'bloque_codigo':
            return <CodeBlock key={index} block={block} />;
          case 'bloque_imagen':
            return <ImageBlock key={index} block={block} />;
          case 'bloque_alerta':
            return <AlertBlock key={index} block={block} />;
          case 'bloque_lista':
            return <ListBlock key={index} block={block} />;
          case 'bloque_separador':
            return <SeparatorBlock key={index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
