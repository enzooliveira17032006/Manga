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
      
      {/* Top Bar */}
      <div className="bg-background/95 backdrop-blur border-b border-neutral-800 p-3 sm:p-4 shadow-lg shadow-black/50 text-text">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors text-neutral-300 font-bold shadow-md">
              <span className="text-lg">🏠</span> <span className="hidden sm:inline">Início</span>
            </Link>
            <Link href={`/manga/${mangaId}`} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full transition-colors text-neutral-300 font-bold shadow-md">
              <span className="text-lg">←</span> <span className="hidden sm:inline">Página da Obra</span>
            </Link>
            <div className="flex flex-col ml-2 border-l border-neutral-700 pl-4 hidden md:flex">
              <h1 className="font-bold text-sm sm:text-base line-clamp-1">{mangaTitle}</h1>
              <span className="text-xs text-primary font-bold">Capítulo {chapterNumber}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm font-bold bg-neutral-800 px-2 sm:px-3 py-1 rounded-full text-neutral-300">
              {currentPage} / {totalPages}
            </span>
            <div className="flex gap-1 sm:gap-2">
              <button onClick={onDirectionToggle} className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded-full text-sm transition-colors text-neutral-300 font-bold" title={direction === 'LTR' ? 'Modo atual: Direita' : 'Modo atual: Esquerda'}>
                {direction === 'LTR' ? 'L' : 'R'}
              </button>
              <button onClick={onFullscreenToggle} className="w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 rounded-full text-sm transition-colors text-neutral-300" title="Tela Cheia">
                ⛶
              </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="bg-background/95 backdrop-blur border-t border-neutral-800 p-3 sm:p-4 text-text flex justify-center items-center gap-2 sm:gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors" title="Ir para o topo">
              <span className="text-xl">⇪</span>
              <span className="text-[10px] uppercase font-bold hidden sm:block mt-1">Topo</span>
            </button>

            <Link href={prevChapter ? `/read/${prevChapter.id}` : '#'} className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold transition-colors shadow-lg ${prevChapter ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed pointer-events-none'}`}>
              <span className="text-lg">←</span> <span className="hidden sm:inline">Anterior</span>
            </Link>

            <Link href={nextChapter ? `/read/${nextChapter.id}` : '#'} className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full font-bold transition-colors shadow-lg ${nextChapter ? 'bg-primary text-black hover:bg-primaryDark' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed pointer-events-none'}`}>
              <span className="hidden sm:inline">Próximo</span> <span className="text-lg">→</span>
            </Link>

            <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="flex flex-col items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors" title="Ir para o final">
              <span className="text-xl">⇟</span>
              <span className="text-[10px] uppercase font-bold hidden sm:block mt-1">Final</span>
            </button>

         </div>
      </div>

    </div>
  );
}
