const fs = require('fs');

// ApiClient.ts
let client = fs.readFileSync('lib/apiClient.ts', 'utf8');
client = client.replace(
  "static async discover(params: { category?: string, sort?: 'popular' | 'recent', limit?: number }): Promise<FrontendManga[]> {",
  "static async discover(params: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<FrontendManga[]> {"
);
client = client.replace(
  "if (params.limit) url.searchParams.append('limit', params.limit.toString());",
  "if (params.limit) url.searchParams.append('limit', params.limit.toString());\n    if (params.page) url.searchParams.append('page', params.page.toString());\n    if (params.genre) url.searchParams.append('genre', params.genre);"
);
fs.writeFileSync('lib/apiClient.ts', client);

// CatalogView.tsx
let view = fs.readFileSync('components/CatalogView.tsx', 'utf8');

const newView = `'use client';

import { useEffect, useState, useCallback } from 'react';
import { ApiClient } from '../lib/apiClient';
import { MangaCard } from './MangaCard';
import { FrontendManga } from '../types';

interface CatalogViewProps {
  title: string;
  category: string;
  icon: string;
}

const AVAILABLE_GENRES = [
  'Action', 'Romance', 'Comedy', 'Fantasy', 'Horror', 'Slice of Life'
];

export function CatalogView({ title, category, icon }: CatalogViewProps) {
  const [results, setResults] = useState<FrontendManga[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);

  const fetchCatalog = useCallback(async (pageNum: number, currentGenre: string, isLoadMore: boolean = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      const data = await ApiClient.discover({ category, limit: 30, page: pageNum, genre: currentGenre });
      
      if (data.length < 30) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isLoadMore) {
        setResults(prev => [...prev, ...data]);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category]);

  // Initial load or genre change
  useEffect(() => {
    setPage(1);
    fetchCatalog(1, genre, false);
  }, [genre, fetchCatalog]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCatalog(nextPage, genre, true);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span>{icon}</span> {title}
        </h1>

        <div className="flex items-center gap-2">
          <label className="text-sm text-textMuted">Filtrar por:</label>
          <select 
            className="bg-surface border border-neutral-800 rounded px-3 py-2 text-sm focus:border-primary outline-none"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">Todos os Gêneros</option>
            {AVAILABLE_GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Vasculhando Providers...</p>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full mb-10">
            {results.map((manga, idx) => (
              <MangaCard key={manga.id + idx} manga={manga} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center w-full mt-8 mb-12">
              <button 
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Carregando...' : 'Carregar Mais Obras'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-neutral-500 py-10">
          Nenhuma obra encontrada nesta categoria ou filtro.
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('components/CatalogView.tsx', newView);
console.log('Frontend pagination implemented');
