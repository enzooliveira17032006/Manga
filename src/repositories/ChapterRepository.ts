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
      try {
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
      } catch (e: any) {
        // Race condition: another request just created it.
        if (e.code === 'P2002') {
          chapter = await prisma.chapter.findFirst({
            where: {
              mangaId: mangaId,
              number: chapterData.chapterNumber,
              language: chapterData.language
            }
          });
        } else {
          throw e;
        }
      }
    }

    if (!chapter) return null; // Fallback for unexpected failures

    // 2. Upsert ChapterProvider
    if (chapterData.providerId && chapterData.id) {
      try {
        await prisma.chapterProvider.upsert({
          where: { providerId_externalId: { providerId: chapterData.providerId, externalId: chapterData.id } },
          update: {},
          create: {
            chapterId: chapter.id,
            providerId: chapterData.providerId,
            externalId: chapterData.id
          }
        });
      } catch (e: any) {
        // Race condition: another request just upserted it.
        if (e.code !== 'P2002') {
          throw e;
        }
      }
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
