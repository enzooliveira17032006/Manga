const fs = require('fs');

// Update CatalogView.tsx to include Sort Dropdown
let view = fs.readFileSync('components/CatalogView.tsx', 'utf8');

// Replace the states and fetch logic
view = view.replace(
  "const [genre, setGenre] = useState<string>('');",
  "const [genre, setGenre] = useState<string>('');\n  const [sort, setSort] = useState<'popular' | 'recent'>('popular');"
);

view = view.replace(
  "const fetchCatalog = useCallback(async (pageNum: number, currentGenre: string, isLoadMore: boolean = false) => {",
  "const fetchCatalog = useCallback(async (pageNum: number, currentGenre: string, currentSort: 'popular' | 'recent', isLoadMore: boolean = false) => {"
);

view = view.replace(
  "const data = await ApiClient.discover({ category, limit: 30, page: pageNum, genre: currentGenre });",
  "const data = await ApiClient.discover({ category, limit: 30, page: pageNum, genre: currentGenre, sort: currentSort });"
);

view = view.replace(
  "fetchCatalog(1, genre, false);",
  "fetchCatalog(1, genre, sort, false);"
);
view = view.replace(
  "}, [genre, fetchCatalog]);",
  "}, [genre, sort, fetchCatalog]);"
);

view = view.replace(
  "fetchCatalog(nextPage, genre, true);",
  "fetchCatalog(nextPage, genre, sort, true);"
);

// Add the Sort Dropdown to the UI
const filterHtml = `
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-textMuted">Ordenar:</label>
            <select 
              className="bg-surface border border-neutral-800 rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value as 'popular' | 'recent')}
            >
              <option value="popular">Mais Populares</option>
              <option value="recent">Atualizados Recentemente</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-textMuted">Gênero:</label>
            <select 
              className="bg-surface border border-neutral-800 rounded px-3 py-2 text-sm focus:border-primary outline-none"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Todos os Gêneros</option>
              {AVAILABLE_GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
`;

view = view.replace(
  /<div className="flex items-center gap-2">\s*<label className="text-sm text-textMuted">Filtrar por:[\s\S]*?<\/select>\s*<\/div>/,
  filterHtml
);

fs.writeFileSync('components/CatalogView.tsx', view);

// Update app/discover/page.tsx to use CatalogView
const discoverCode = `'use client';

import { Suspense } from 'react';
import { CatalogView } from '../../components/CatalogView';

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div>Carregando descoberta...</div>}>
      <CatalogView title="Explorar Todas as Obras" category="" icon="ðŸ”" />
    </Suspense>
  );
}
`;
fs.writeFileSync('app/discover/page.tsx', discoverCode);

console.log('Added sorting to CatalogView');
