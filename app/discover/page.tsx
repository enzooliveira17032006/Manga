'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CatalogView } from '../../components/CatalogView';

function DiscoverParamsReader() {
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as 'popular' | 'recent') || 'popular';
  
  return <CatalogView title={sort === 'recent' ? "Atualizados Recentemente" : "Explorar Todas as Obras"} category="" icon="🔍" defaultSort={sort} />;
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div>Carregando descoberta...</div>}>
      <DiscoverParamsReader />
    </Suspense>
  );
}
