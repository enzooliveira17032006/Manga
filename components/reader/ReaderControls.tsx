import { FrontendChapter } from '../../types';
import Link from 'next/link';

interface ControlsProps {
  show: boolean;
  mangaId: string;
  mangaTitle: string;
  chapterNumber: string;
  prevChapter: FrontendChapter | null;
  nextChapter: FrontendChapter | null;
  currentPage: number;
  totalPages: number;
  direction: 'LTR' | 'RTL';
  onDirectionToggle: () => void;
  onFullscreenToggle: () => void;
}

export function ReaderControls({ show, mangaId, mangaTitle, chapterNumber, prevChapter, nextChapter, currentPage, totalPages, direction, onDirectionToggle, onFullscreenToggle }: ControlsProps) {
  return (
    <div className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-background/95 backdrop-blur border-b border-neutral-800 p-4 shadow-lg shadow-black/50 text-text">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <Link href={`/manga/${mangaId}`} className="text-sm text-textMuted hover:text-primary transition-colors">
              ← Voltar para Obra
            </Link>
            <h1 className="font-bold text-lg mt-1 line-clamp-1">{mangaTitle} - Cap. {chapterNumber}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold bg-neutral-800 px-3 py-1 rounded">
                Página {currentPage} / {totalPages}
              </span>
            </div>

            <div className="flex gap-2">
              <button onClick={onDirectionToggle} className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-sm transition-colors">
                {direction === 'LTR' ? 'Leitura LTR' : 'Leitura RTL'}
              </button>
              <button onClick={onFullscreenToggle} className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-sm transition-colors">
                ⛶
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom bar for chapter nav */}
      <div className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="bg-background/95 backdrop-blur border-t border-neutral-800 p-4 text-text flex justify-center gap-4">
            <Link href={prevChapter ? `/read/${prevChapter.id}` : '#'} className={`px-4 py-2 rounded font-bold transition-colors ${prevChapter ? 'bg-primary text-black hover:bg-primaryDark' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed pointer-events-none'}`}>
              ← Anterior
            </Link>
            <Link href={nextChapter ? `/read/${nextChapter.id}` : '#'} className={`px-4 py-2 rounded font-bold transition-colors ${nextChapter ? 'bg-primary text-black hover:bg-primaryDark' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed pointer-events-none'}`}>
              Próximo →
            </Link>
         </div>
      </div>
    </div>
  );
}
