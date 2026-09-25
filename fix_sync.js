const fs = require('fs');
let c = fs.readFileSync('src/services/SyncService.ts', 'utf8');

c = c.replace(/const validationPromises = results\.map\(r => limit\(async \(\) => \{[\s\S]*?return synced;\n      \}\)\);/m, 
`const validationPromises = results.map(r => limit(async () => {
        // Map to DomainManga structure
        // We trust the provider's native language filtering (MangaDex enforces pt-br at the API level)
        // This avoids fetching thousands of chapters during discover phase.
        const domainManga = {
          id: r.internal_manga_id,
          title: r.title,
          description: r.description,
          cover: r.coverUrl,
          status: r.status,
          type: r.type,
          genres: r.genres,
          language: ['pt-BR'],
          authors: [r.author].filter(Boolean),
          artists: [r.artist].filter(Boolean),
          contentRating: r.contentRating || 'safe',
          originalLanguage: r.originalLanguage || 'ja',
          providers: Object.keys(r.externalLinks),
          externalLinks: r.externalLinks
        } as any;
  
        const synced = await mangaRepo.upsertManga(domainManga);
        return synced;
      }));`);

fs.writeFileSync('src/services/SyncService.ts', c, 'utf8');
console.log('Fixed searchAndSync');
