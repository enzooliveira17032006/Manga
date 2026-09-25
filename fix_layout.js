const fs = require('fs');

const layoutTsx = `import './globals.css';
import { ReactNode } from 'react';
import { Header } from '../components/Header';

export const metadata = {
  title: 'Manga Reader',
  description: 'Leitor de Mangás em PT-BR',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-text flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6">
          {children}
        </main>
        <footer className="border-t border-surface p-6 text-center text-textMuted mt-10">
          Manga Reader © {new Date().getFullYear()} - Somente conteúdo PT-BR.
        </footer>
      </body>
    </html>
  );
}
`;

const headerTsx = `'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, BookOpen } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Mangás', href: '/mangas' },
  { label: 'Manhwas', href: '/manhwas' },
  { label: 'Manhuas', href: '/manhuas' },
  { label: '🔞 Pornhwa 18+', href: '/pornhwa' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(\`/search?q=\${encodeURIComponent(searchQuery)}\`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <BookOpen className="w-6 h-6" />
          <span className="hidden sm:inline">Manga Reader</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={\`text-sm font-medium transition-colors hover:text-primary \${
                pathname === link.href ? 'text-primary' : 'text-neutral-300'
              }\`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Search */}
        <div className="hidden lg:block w-64">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary text-neutral-100"
            />
            <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-neutral-300 hover:text-primary"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-neutral-950 border-b border-neutral-800 shadow-xl py-4 px-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Pesquisar obras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary text-neutral-100"
            />
            <button type="submit" aria-label="Buscar" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary">
              <Search className="w-5 h-5" />
            </button>
          </form>
          
          <nav className="flex flex-col gap-2 mt-2">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={\`py-3 text-lg font-medium border-b border-neutral-900 \${
                  pathname === link.href ? 'text-primary' : 'text-neutral-300'
                }\`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
`;

fs.writeFileSync('app/layout.tsx', layoutTsx, 'utf8');
fs.writeFileSync('components/Header.tsx', headerTsx, 'utf8');
