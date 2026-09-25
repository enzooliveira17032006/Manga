'use client';

import { useState } from 'react';
import { CatalogView } from '../../components/CatalogView';
import { useRouter } from 'next/navigation';

export default function PornhwaPage() {
  const [isAdult, setIsAdult] = useState(false);
  const router = useRouter();

  if (!isAdult) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 min-h-[60vh]">
        <div className="bg-surface border border-red-900 rounded-2xl p-8 max-w-md w-full text-center shadow-xl shadow-red-900/20">
          <div className="text-5xl mb-4">🔞</div>
          <h1 className="text-2xl font-bold mb-4 text-red-500">Conteúdo Adulto</h1>
          <p className="text-neutral-400 mb-8">
            Esta seção contém conteúdo destinado <strong>exclusivamente a maiores de 18 anos</strong>.
            Ao prosseguir, você confirma que possui idade legal para acessar conteúdo adulto em sua jurisdição.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setIsAdult(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Sou maior de 18 anos
            </button>
            <button 
              onClick={() => router.back()}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Voltar com segurança
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <CatalogView title="Pornhwa 18+" category="pornhwa" icon="🔞" />;
}
