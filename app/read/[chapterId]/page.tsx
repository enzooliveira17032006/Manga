'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiClient } from '../../../lib/apiClient';
import { FrontendChapter, FrontendPage, FrontendManga } from '../../../types';
import { Reader } from '../../../components/reader/Reader';

export default function ReadPage() {
  const { chapterId } = useParams() as { chapterId: string };
  const [data, setData] = useState<{
    manga: FrontendManga;
    chapter: FrontendChapter;
    pages: FrontendPage[];
    prev: FrontendChapter | null;
    next: FrontendChapter | null;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // 1. Get Chapter Details to know the mangaId
        const chapter = await ApiClient.getChapterDetails(chapterId);
        
        // 2. Fetch Manga
        const manga = await ApiClient.getManga(chapter.mangaId);

        // 3. Fetch All Chapters to calculate Prev/Next
        const allChapters = await ApiClient.getChapters(chapter.mangaId);
        
        // 4. Fetch Pages
        const pages = await ApiClient.getPages(chapter.id);

        // Sort chapters numerically to find prev/next
        const sorted = [...allChapters].sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
        const currentIndex = sorted.findIndex(c => c.id === chapter.id);
        
        const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
        const next = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

        setData({ manga, chapter, pages, prev, next });
      } catch (err: any) {
        setError(err.message || 'Não foi possível carregar este capítulo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-primary animate-pulse text-xl">Montando o Leitor e requisitando rotas JIT...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950">
      <div className="text-red-500 text-xl mb-4">{error}</div>
      <button onClick={() => window.location.reload()} className="px-4 py-2 bg-neutral-800 text-white rounded">Tentar novamente</button>
    </div>
  );
  if (!data) return null;

  return (
    <Reader 
      manga={data.manga}
      chapter={data.chapter}
      pages={data.pages}
      prevChapter={data.prev}
      nextChapter={data.next}
    />
  );
}
