import { hub } from '../api/hubInstance';
import { MangaRepository } from '../repositories/MangaRepository';
import { ChapterRepository } from '../repositories/ChapterRepository';
import { DomainManga } from '../domain/models';
import pLimit from 'p-limit';

const mangaRepo = new MangaRepository();
const chapterRepo = new ChapterRepository();

export class SyncService {
  async searchAndSync(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }) {
    // 1. Search ProviderHub
    const results = await hub.search(query, options);
    
    // 2. Evaluate Chapters and Sync to DB
    const syncedMangas = [];
    const limit = pLimit(5); // Increased concurrency

    const validationPromises = results.map(r => limit(async () => {
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
    }));

    const validationResults = await Promise.all(validationPromises);
    for (const validManga of validationResults) {
      if (validManga) {
        syncedMangas.push(validManga);
      }
    }

    return syncedMangas;
  }

  async syncChapters(mangaId: string) {
    // We need the manga's external links from DB to query the hub
    const manga = await mangaRepo.getManga(mangaId);
    if (!manga) return [];

    // Reconstruct the internal payload the Hub expects
    const internalMangaPayload = {
      externalLinks: {} as Record<string, string>
    };
    for (const p of manga.providers) {
      internalMangaPayload.externalLinks[p.providerId] = p.externalId;
    }

    // Fetch chapters from ProviderHub
    const chapters = await hub.getChapters(internalMangaPayload);

    // Filter PT-BR explicitly and Upsert to DB
    const ptBrChapters = chapters.filter(c => c.language === 'pt-BR');
    for (const ch of ptBrChapters) {
      await chapterRepo.upsertChapter(manga.id, ch);
    }

    return await chapterRepo.getChaptersByMangaId(manga.id);
  }
}
