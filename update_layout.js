const fs = require('fs');

const pageTsx = `'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '../lib/apiClient';
import { FrontendManga } from '../types';
import { MangaCard } from '../components/MangaCard';
import { Search, Compass, Book, Clock, Star, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function DiscoverySection({ title, icon, params, seeAllHref }: { title: string, icon: React.ReactNode, params: any, seeAllHref: string }) {
  const [mangas, setMangas] = useState<FrontendManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMangas = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await ApiClient.discover(params);
      setMangas(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMangas();
  }, [JSON.stringify(params)]);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {icon} {title}
        </h2>
        <Link href={seeAllHref} className="text-primary hover:text-primaryDark text-sm font-semibold transition-colors">
          Ver todos &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-surface border border-neutral-800 rounded-xl p-6 text-center">
          <p className="text-neutral-400 mb-4">Não foi possível carregar esta seção.</p>
          <button onClick={fetchMangas} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors">
            Tentar novamente
          </button>
        </div>
      ) : mangas.length > 0 ? (
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full snap-x snap-mandatory hide-scrollbar">
          {mangas.map(manga => (
            <div key={manga.id} className="min-w-[140px] sm:min-w-0 snap-start">
              <MangaCard manga={manga} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-neutral-500 py-10 bg-surface rounded-xl border border-neutral-800">
          Não encontramos obras disponíveis nesta categoria.
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(\`/search?q=\${encodeURIComponent(searchQuery.trim())}\`);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-surface border border-neutral-800 rounded-2xl p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
          MANGA READER
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg mb-8 relative z-10">
          Leia seus títulos favoritos em PT-BR
        </p>
        
        <form onSubmit={handleSearch} className="w-full max-w-xl relative z-10">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar obras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-full py-4 pl-12 pr-6 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-lg text-lg"
            />
            <button 
              type="submit"
              className="absolute right-2 bg-primary hover:bg-primaryDark text-black font-bold py-2.5 px-6 rounded-full transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Categorias Rápidas */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Compass className="text-primary w-6 h-6" /> Explore por categoria
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <Link href="/mangas" className="bg-surface hover:bg-neutral-800 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center transition-colors">
          <span className="text-3xl mb-2">🇯🇵</span>
          <h3 className="font-bold text-lg">Mangás</h3>
        </Link>
        <Link href="/manhwas" className="bg-surface hover:bg-neutral-800 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center transition-colors">
          <span className="text-3xl mb-2">🇰🇷</span>
          <h3 className="font-bold text-lg">Manhwas</h3>
        </Link>
        <Link href="/manhuas" className="bg-surface hover:bg-neutral-800 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center transition-colors">
          <span className="text-3xl mb-2">🇨🇳</span>
          <h3 className="font-bold text-lg">Manhuas</h3>
        </Link>
        <Link href="/pornhwa" className="bg-surface hover:bg-neutral-800 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center transition-colors relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">18+</div>
          <span className="text-3xl mb-2">🔞</span>
          <h3 className="font-bold text-lg text-red-500">18+</h3>
        </Link>
      </div>

      {/* Discovery Sections */}
      <DiscoverySection 
        title="Atualizados recentemente" 
        icon={<Clock className="text-primary w-6 h-6" />} 
        params={{ sort: 'recent', limit: 8 }} 
        seeAllHref="/discover?sort=recent" 
      />

      <DiscoverySection 
        title="Descubra em PT-BR" 
        icon={<Star className="text-primary w-6 h-6" />} 
        params={{ sort: 'popular', limit: 8 }} 
        seeAllHref="/discover?sort=popular" 
      />

      <DiscoverySection 
        title="Mangás" 
        icon={<Book className="text-primary w-6 h-6" />} 
        params={{ category: 'manga', sort: 'popular', limit: 8 }} 
        seeAllHref="/mangas" 
      />

      <DiscoverySection 
        title="Manhwas" 
        icon={<Flame className="text-primary w-6 h-6" />} 
        params={{ category: 'manhwa', sort: 'popular', limit: 8 }} 
        seeAllHref="/manhwas" 
      />

    </div>
  );
}
`;

fs.writeFileSync('app/page.tsx', pageTsx, 'utf8');
