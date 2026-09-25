'use client';

import { useState, useEffect, useCallback } from 'react';
import { FrontendChapter, FrontendPage, FrontendManga } from '../../types';
import { ReaderPage } from './ReaderPage';
import { ReaderControls } from './ReaderControls';

interface ReaderProps {
  manga: FrontendManga;
  chapter: FrontendChapter;
  pages: FrontendPage[];
  prevChapter: FrontendChapter | null;
  nextChapter: FrontendChapter | null;
}

export function Reader({ manga, chapter, pages, prevChapter, nextChapter }: ReaderProps) {
  const [showControls, setShowControls] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState<'LTR' | 'RTL'>('RTL'); // Manga defaults to RTL
  
  // Hide controls on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowControls(false);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handlePageVisible = useCallback((index: number) => {
    setCurrentPage(index + 1);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const isRTL = direction === 'RTL';
      
      switch (e.key) {
        case 'ArrowLeft':
          if (isRTL) window.scrollBy({ top: 800, behavior: 'smooth' }); // In horizontal this would be next
          else window.scrollBy({ top: -800, behavior: 'smooth' });
          break;
        case 'ArrowRight':
          if (isRTL) window.scrollBy({ top: -800, behavior: 'smooth' });
          else window.scrollBy({ top: 800, behavior: 'smooth' });
          break;
        case 'PageDown':
          window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
          break;
        case 'PageUp':
          window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
          break;
        case 'Home':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Preload Logic (Preload +3 pages ahead of current)
  const isPreloadTarget = (index: number) => {
    return index < currentPage + 3;
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 pb-32">
      <ReaderControls 
        show={showControls}
        mangaId={manga.id}
        mangaTitle={manga.title}
        chapterNumber={chapter.number}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        currentPage={currentPage}
        totalPages={pages.length}
        direction={direction}
        onDirectionToggle={() => setDirection(d => d === 'LTR' ? 'RTL' : 'LTR')}
        onFullscreenToggle={toggleFullscreen}
      />

      {/* Main Reading Area */}
      <div 
        className="max-w-4xl mx-auto flex flex-col items-center cursor-pointer pt-20"
        onClick={() => setShowControls(c => !c)}
      >
        {pages.map((p, index) => (
          <ReaderPage 
            key={p.index} 
            index={index} 
            url={p.url} 
            onVisible={handlePageVisible}
            shouldPreload={isPreloadTarget(index)}
          />
        ))}
      </div>

      {currentPage === pages.length && (
        <div className="max-w-2xl mx-auto mt-16 p-8 border border-neutral-800 rounded-xl text-center bg-surface">
           <h3 className="text-2xl font-bold mb-6 text-primary">Você chegou ao final do capítulo.</h3>
           <div className="flex justify-center gap-4">
              {nextChapter && (
                <a href={`/read/${nextChapter.id}`} className="px-6 py-3 bg-primary text-black font-bold rounded hover:bg-primaryDark transition-colors">
                  Próximo Capítulo ➔
                </a>
              )}
              {!nextChapter && (
                <a href={`/manga/${manga.id}`} className="px-6 py-3 border border-neutral-700 text-textMuted rounded hover:bg-neutral-800 transition-colors">
                  Voltar para Obra
                </a>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
