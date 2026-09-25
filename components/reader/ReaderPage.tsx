import { useEffect, useRef, useState } from 'react';

interface ReaderPageProps {
  url: string;
  index: number;
  onVisible: (index: number) => void;
  shouldPreload: boolean;
}

export function ReaderPage({ url, index, onVisible, shouldPreload }: ReaderPageProps) {
  const [state, setState] = useState<'pending' | 'loading' | 'loaded' | 'error'>('pending');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onVisible(index);
        if (state === 'pending') {
          setState('loading');
        }
      }
    }, { rootMargin: '0px 0px 500px 0px' });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [index, onVisible, state]);

  // Handle Preload Trigger from Parent
  useEffect(() => {
    if (shouldPreload && state === 'pending') {
      setState('loading');
    }
  }, [shouldPreload, state]);

  const handleRetry = () => {
    setState('loading');
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center my-2 min-h-[50vh] relative bg-neutral-950">
      {state === 'pending' && (
        <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
          Aguardando carregamento (Pág. {index + 1})
        </div>
      )}
      
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
          Carregando página {index + 1}...
        </div>
      )}

      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
          <span className="mb-4">Falha ao carregar imagem</span>
          <button onClick={handleRetry} className="px-4 py-2 bg-red-900/50 hover:bg-red-900 transition-colors rounded">
            Tentar novamente
          </button>
        </div>
      )}

      {(state === 'loading' || state === 'loaded') && (
        <img
          src={url}
          alt={`Página ${index + 1}`}
          className={`max-w-full h-auto object-contain transition-opacity duration-300 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
        />
      )}
    </div>
  );
}
