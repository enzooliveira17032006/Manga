'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiClient } from '../../../lib/apiClient';
import { FrontendManga, FrontendChapter } from '../../../types';
import { ChapterList } from '../../../components/ChapterList';

export default function MangaDetails() {
  const { id } = useParams() as { id: string };
  const [manga, setManga] = useState<FrontendManga | null>(null);
  const [chapters, setChapters] = useState<FrontendChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem('progress_' + id);
      if (p) {
        setProgress(JSON.parse(p));
      }
    } catch (e) {}
  }, [id]);

  useEffect(() => {
    async function load() {
      try {
        const m = await ApiClient.getManga(id);
        setManga(m);
        
        const ch = await ApiClient.getChapters(id);
        setChapters(ch);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar obra.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="mt-20 text-center animate-pulse text-xl text-primary">Sincronizando capítulos e metadados...</div>;
  if (error) return <div className="mt-20 text-center text-red-400">{error}</div>;
  if (!manga) return null;

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row gap-8 bg-surface p-6 rounded-2xl border border-neutral-800">
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
          <div className="aspect-[2/3] w-full bg-neutral-900 rounded-xl overflow-hidden relative shadow-2xl shadow-black/50">
            {manga.cover ? (
               <img src={manga.cover} alt="Cover" className="object-cover w-full h-full" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-textMuted">Sem Capa</div>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary text-black px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{manga.status}</span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs font-bold tracking-wider">PT-BR</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{manga.title}</h1>
          <p className="text-textMuted mb-6 leading-relaxed text-lg line-clamp-4">{manga.description || 'Sem sinopse disponível.'}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {manga.genres.map(g => (
              <span key={g} className="bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-full text-sm text-neutral-300">{g}</span>
            ))}
          </div>

          {progress && (
            <div className="mb-6">
              <a href={`/read/${progress.chapterId}`} className="inline-block bg-primary hover:bg-primaryDark text-black font-bold py-3 px-8 rounded-full transition-colors text-lg">
                Continuar Leitura
              </a>
            </div>
          )}

          <div className="text-sm text-neutral-400">
            <p><strong className="text-neutral-200">Autores:</strong> {manga.authors.join(', ') || 'N/A'}</p>
            <p className="mt-1"><strong className="text-neutral-200">Fontes vinculadas:</strong> {manga.providers.join(', ').toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* CHAPTERS SECTION */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold border-b border-surface pb-4 mb-4">Capítulos ({chapters.length})</h2>
        <ChapterList chapters={chapters} />
      </div>
    </div>
  );
}
