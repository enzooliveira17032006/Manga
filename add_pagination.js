const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/providers/types.ts', 'utf8');
types = types.replace(
  "search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number }): Promise<MangaMetadata[]>;",
  "search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<MangaMetadata[]>;"
);
fs.writeFileSync('src/providers/types.ts', types);

// 2. ProviderHub.ts
let hub = fs.readFileSync('src/providers/ProviderHub.ts', 'utf8');
hub = hub.replace(
  "search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number }): Promise<any[]> {",
  "search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<any[]> {"
);
hub = hub.replace(
  "const cacheKey = `${query}-${options?.category || 'all'}-${options?.sort || 'popular'}-${options?.limit || 30}`;",
  "const cacheKey = `${query}-${options?.category || 'all'}-${options?.sort || 'popular'}-${options?.limit || 30}-${options?.page || 1}-${options?.genre || 'all'}`;"
);
fs.writeFileSync('src/providers/ProviderHub.ts', hub);

// 3. MangaDexProvider.ts
let md = fs.readFileSync('src/providers/MangaDexProvider.ts', 'utf8');
md = md.replace(
  "search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number }): Promise<MangaMetadata[]> {",
  "search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<MangaMetadata[]> {"
);
let mdParams = `
      const params: any = { 
        'availableTranslatedLanguage[]': ['pt-br'],
        'includes[]': ['cover_art'],
        hasAvailableChapters: 'true',
        order: orderConfig,
        limit: options?.limit || 30,
        offset: ((options?.page || 1) - 1) * (options?.limit || 30)
      };

      if (options?.genre) {
        // Genre to Tag mapping approximation
        const genresMap: Record<string, string> = {
          'action': '391b0423-d847-456f-aff0-8b0cfc03066b',
          'romance': '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
          'comedy': '4d32cc48-9f00-4cca-9b5a-a839f0764984',
          'fantasy': 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
          'horror': 'cdad7e68-1419-41dd-bdce-27753074a640',
          'slice of life': 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
          'succubus': '5bd0e105-4481-44ca-b6e7-7544da56b1a3' // Example mapping or generic ecchi/monster girls
        };
        const tag = genresMap[options.genre.toLowerCase()];
        if (tag) {
          params['includedTags[]'] = [tag];
        }
      }
`;
md = md.replace(/const params: any = \{[\s\S]*?limit: options\?\.limit \|\| 30\s*\};\s*/, mdParams);
fs.writeFileSync('src/providers/MangaDexProvider.ts', md);

// 4. ConsumetProvider.ts
let consumet = fs.readFileSync('src/providers/ConsumetProvider.ts', 'utf8');
consumet = consumet.replace(
  "search(query: string): Promise<MangaMetadata[]> {",
  "search(query: string, options?: any): Promise<MangaMetadata[]> {"
);
fs.writeFileSync('src/providers/ConsumetProvider.ts', consumet);

// 5. SyncService.ts
let sync = fs.readFileSync('src/services/SyncService.ts', 'utf8');
sync = sync.replace(
  "searchAndSync(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number }) {",
  "searchAndSync(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }) {"
);
fs.writeFileSync('src/services/SyncService.ts', sync);

// 6. manga.ts
let routes = fs.readFileSync('src/api/routes/manga.ts', 'utf8');
routes = routes.replace(
  "const limit = parseInt(req.query.limit as string) || 15;",
  "const limit = parseInt(req.query.limit as string) || 15;\n    const page = parseInt(req.query.page as string) || 1;\n    const genre = req.query.genre as string;"
);
routes = routes.replace(
  "const cacheKey = `${category}-${sort}-${limit}`;",
  "const cacheKey = `${category}-${sort}-${limit}-${page}-${genre || 'all'}`;"
);
routes = routes.replace(
  "const results = await syncService.searchAndSync('', { category, sort, limit: poolLimit });",
  "const results = await syncService.searchAndSync('', { category, sort, limit: poolLimit, page, genre });"
);
fs.writeFileSync('src/api/routes/manga.ts', routes);

console.log('Backend pagination implemented');
