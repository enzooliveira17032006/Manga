const fs = require('fs');
let c = fs.readFileSync('components/CatalogView.tsx', 'utf8');

c = c.replace(
  "interface CatalogViewProps {",
  "interface CatalogViewProps {\n  defaultSort?: 'popular' | 'recent';"
);

c = c.replace(
  "export function CatalogView({ title, category, icon }: CatalogViewProps) {",
  "export function CatalogView({ title, category, icon, defaultSort = 'popular' }: CatalogViewProps) {"
);

c = c.replace(
  "const [sort, setSort] = useState<'popular' | 'recent'>('popular');",
  "const [sort, setSort] = useState<'popular' | 'recent'>(defaultSort);"
);

fs.writeFileSync('components/CatalogView.tsx', c);

// Update DiscoverPage to read search params
let discover = fs.readFileSync('app/discover/page.tsx', 'utf8');
const newDiscover = `'use client';

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
`;
fs.writeFileSync('app/discover/page.tsx', newDiscover);
console.log('Fixed defaultSort');
