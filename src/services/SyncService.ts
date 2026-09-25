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
    const limit = pLimit(3); // Protect against rate limits

    const validationPromises = results.map(r => limit(async () => {
      // Reconstruct the internal payload the Hub expects
      const internalMangaPayload = {
        externalLinks: r.externalLinks
      };

      // Fetch chapters from ProviderHub
      const providerChapters = await hub.getChapters(internalMangaPayload);
      
      // Filter PT-BR explicitly
      const ptBrChapters = providerChapters.filter(c => c.language === 'pt-BR');

      // Se quantidade de capítulos PT-BR === 0 DESCARTAR OBRA
      if (ptBrChapters.length === 0) {
        return null; 
      }

      // Map to DomainManga structure
      const domainManga = {
        id: r.internal_manga_id,
        title: r.title,
        description: r.description,
        cover: r.coverUrl,
        status: r.status,
        type: r.type,
        genres: r.genres,
        language: ['pt-BR'], // Enforce absolute true
        authors: [r.author].filter(Boolean),
        artists: [r.artist].filter(Boolean),
        contentRating: r.contentRating || 'safe',
        originalLanguage: r.originalLanguage || 'ja',
        providers: Object.keys(r.externalLinks),
        externalLinks: r.externalLinks
      } as any;

      const synced = await mangaRepo.upsertManga(domainManga);

      // Persist the PT-BR chapters we just fetched to avoid duplicate fetching later
      for (const ch of ptBrChapters) {
        await chapterRepo.upsertChapter(synced.id, ch);
      }

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

    // Upsert to DB
    for (const ch of chapters) {
      await chapterRepo.upsertChapter(manga.id, ch);
    }

    return await chapterRepo.getChaptersByMangaId(manga.id);
  }
}
