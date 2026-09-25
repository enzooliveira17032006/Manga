'use client';

import { FrontendManga } from '../types';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export function MangaCard({ manga }: { manga: FrontendManga }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/manga/${manga.id}`} className="block h-full">
      <div className="bg-surface rounded-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer h-full border border-neutral-800 flex flex-col">
        <div className="relative aspect-[2/3] w-full bg-neutral-900 shrink-0">
          {manga.cover && !imgError ? (
            <img 
              src={manga.cover} 
              alt={`Capa de ${manga.title}`} 
              className="object-cover w-full h-full"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 text-sm bg-neutral-900/80 p-2 text-center">
              <span>Sem Capa</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded shadow-md">
            PT-BR
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-sm sm:text-base md:text-lg line-clamp-2 break-words" title={manga.title}>{manga.title}</h3>
          {manga.authors && manga.authors.length > 0 && (
            <p className="text-xs sm:text-sm text-textMuted mt-1 line-clamp-1 break-words">{manga.authors.join(', ')}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
