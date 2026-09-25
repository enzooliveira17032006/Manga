'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiClient } from '../../lib/apiClient';
import { MangaCard } from '../../components/MangaCard';
import { FrontendManga } from '../../types';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [results, setResults] = useState<FrontendManga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    ApiClient.searchManga(q)
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">
        {q ? `Resultados para "${q}"` : 'Busca Geral'}
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-textMuted">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Vasculhando Providers...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full">
          {results.map(manga => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="text-center text-neutral-500 py-10">
          Nenhum mangá encontrado.
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando busca...</div>}>
      <SearchResults />
    </Suspense>
  );
}
