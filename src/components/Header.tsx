import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, Sun, Moon, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const navLinks = [
    { name: 'CÓDIGOS', href: '/codes' },
    { name: 'CATEGORÍAS', href: '/categories' },
    { name: 'ETIQUETAS', href: '/tags' },
    { name: 'NOSOTROS', href: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[var(--bg-primary)] border-b-2 border-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="font-black text-3xl tracking-tighter uppercase">
            TWF<span className="text-[#ff3344]">.</span>CODE
          </span>
        </a>

        <nav className="hidden md:flex items-center h-full">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="relative px-6 h-20 flex items-center text-xs font-black uppercase tracking-widest text-[var(--text-primary)] group overflow-hidden"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-12">{link.name}</span>
              <span className="absolute inset-0 flex items-center justify-center bg-[#ff3344] text-white translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-20">
                {link.name}
              </span>
            </a>
          ))}
          
          <div className="flex h-20 items-center ml-4 gap-2">
            <a 
              href="/search"
              className="w-10 h-10 flex items-center justify-center text-[var(--text-primary)] hover:text-[#ff3344] transition-colors"
            >
              <SearchIcon size={18} />
            </a>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center text-[var(--text-primary)] hover:text-[#ff3344] transition-colors"
            >
              {mounted && (theme === 'light' ? <Moon size={18} /> : <Sun size={18} />)}
            </button>
          </div>
        </nav>

        <button className="md:hidden p-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[var(--bg-primary)] border-b-2 border-[var(--text-primary)] animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="block px-8 py-6 text-sm font-black uppercase tracking-widest hover:bg-[#ff3344] hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
