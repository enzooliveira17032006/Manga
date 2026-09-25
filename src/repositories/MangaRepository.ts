import { prisma } from './prismaClient';
import { DomainManga, DomainChapter } from '../domain/models';

export class MangaRepository {
  async upsertManga(mangaData: DomainManga) {
    // Upsert logic to update or create Manga based on an existing external identifier
    // For simplicity, we search if any of the externalLinks exists.
    let existingMangaId = null;
    
    // Check if any MangaProvider matches
    for (const provider of mangaData.providers) {
      const externalId = (mangaData as any).externalLinks?.[provider];
      if (externalId) {
        const mp = await prisma.mangaProvider.findUnique({
          where: { providerId_externalId: { providerId: provider, externalId: externalId } }
        });
        if (mp) existingMangaId = mp.mangaId;
      }
    }

    let manga;
    if (existingMangaId) {
      manga = await prisma.manga.update({
        where: { id: existingMangaId },
        data: {
          title: mangaData.title,
          description: mangaData.description,
          cover: mangaData.cover,
          status: mangaData.status,
          type: (mangaData as any).type,
          contentRating: (mangaData as any).contentRating,
          originalLanguage: (mangaData as any).originalLanguage,
          genres: mangaData.genres,
          language: mangaData.language,
          authors: mangaData.authors,
          artists: mangaData.artists
        }
      });
    } else {
      manga = await prisma.manga.create({
        data: {
          title: mangaData.title,
          description: mangaData.description,
          cover: mangaData.cover,
          status: mangaData.status,
          type: (mangaData as any).type,
          contentRating: (mangaData as any).contentRating,
          originalLanguage: (mangaData as any).originalLanguage,
          genres: mangaData.genres,
          language: mangaData.language,
          authors: mangaData.authors,
          artists: mangaData.artists
        }
      });
    }

    // Upsert MangaProviders
    for (const provider of mangaData.providers) {
      const externalId = (mangaData as any).externalLinks?.[provider];
      if (externalId) {
        await prisma.mangaProvider.upsert({
          where: { providerId_externalId: { providerId: provider, externalId: externalId } },
          update: {},
          create: {
            mangaId: manga.id,
            providerId: provider,
            externalId: externalId
          }
        });
      }
    }

    return manga;
  }

  async getManga(id: string) {
    const manga = await prisma.manga.findUnique({
      where: { id },
      include: { providers: true }
    });
    return manga;
  }

  async searchMangaByTitle(title: string, options?: { category?: string }) {
    const whereClause: any = {};
    if (title) {
      whereClause.title = { contains: title, mode: 'insensitive' };
    }

    if (options?.category === 'manga') {
      whereClause.originalLanguage = 'ja';
      whereClause.contentRating = { in: ['safe', 'suggestive'] };
    } else if (options?.category === 'manhwa') {
      whereClause.originalLanguage = 'ko';
      whereClause.contentRating = { in: ['safe', 'suggestive'] };
    } else if (options?.category === 'manhua') {
      whereClause.originalLanguage = { in: ['zh', 'zh-hk'] };
      whereClause.contentRating = { in: ['safe', 'suggestive'] };
    } else if (options?.category === 'pornhwa') {
      whereClause.originalLanguage = 'ko';
      whereClause.contentRating = { in: ['erotica', 'pornographic'] };
    }

    const mangas = await prisma.manga.findMany({
      where: whereClause,
      include: { providers: true }
    });
    return mangas;
  }
}
