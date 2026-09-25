import { prisma } from './prismaClient';

export class ChapterRepository {
  async upsertChapter(mangaId: string, chapterData: any) {
    // 1. Check if chapter already exists by mangaId, number, language
    let chapter = await prisma.chapter.findFirst({
      where: {
        mangaId: mangaId,
        number: chapterData.chapterNumber,
        language: chapterData.language
      }
    });

    if (!chapter) {
      chapter = await prisma.chapter.create({
        data: {
          mangaId,
          number: chapterData.chapterNumber,
          volume: chapterData.volumeNumber || null,
          title: chapterData.title,
          language: chapterData.language,
          publishedAt: chapterData.publishAt
        }
      });
    }

    // 2. Upsert ChapterProvider
    if (chapterData.providerId && chapterData.id) {
      await prisma.chapterProvider.upsert({
        where: { providerId_externalId: { providerId: chapterData.providerId, externalId: chapterData.id } },
        update: {},
        create: {
          chapterId: chapter.id,
          providerId: chapterData.providerId,
          externalId: chapterData.id
        }
      });
    }

    return chapter;
  }

  async getChaptersByMangaId(mangaId: string) {
    return prisma.chapter.findMany({
      where: { mangaId },
      include: { providers: true },
      orderBy: { number: 'asc' }
    });
  }
}
