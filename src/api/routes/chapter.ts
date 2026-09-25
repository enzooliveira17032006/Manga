import { Router, Request, Response } from 'express';
import { hub } from '../hubInstance';
import { DomainPage } from '../../domain/models';
import { prisma } from '../../repositories/prismaClient';

const router = Router();

// GET /api/chapter/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: req.params.id },
      include: { providers: true }
    });
    
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    if (chapter.language !== 'pt-BR') {
      return res.status(403).json({ error: 'Only PT-BR chapters are publicly available' });
    }

    res.json({
      id: chapter.id,
      mangaId: chapter.mangaId,
      title: chapter.title,
      number: chapter.number,
      volume: chapter.volume,
      language: chapter.language,
      publishDate: chapter.publishedAt,
      primaryProviderId: chapter.providers[0]?.providerId,
      externalId: chapter.providers[0]?.externalId,
      providers: chapter.providers.map(p => p.providerId),
      alternativeProviders: chapter.providers.map(p => p.providerId).slice(1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/chapter/:id/pages
router.get('/:id/pages', async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const dbChapter = await prisma.chapter.findUnique({
      where: { id },
      include: { providers: true }
    });

    if (!dbChapter) {
      return res.status(404).json({ error: 'Chapter not found in database' });
    }

    if (dbChapter.language !== 'pt-BR') {
      return res.status(403).json({ error: 'Only PT-BR chapters are publicly available' });
    }

    if (dbChapter.providers.length === 0) {
      return res.status(404).json({ error: 'No providers associated with this chapter' });
    }

    // Use the primary provider stored in our DB
    const primaryProvider = dbChapter.providers[0];
    const chapterPayload = {
      id: primaryProvider.externalId,
      providerId: primaryProvider.providerId,
      alternativeProviders: dbChapter.providers.slice(1).map(p => p.providerId)
    };

    const rawPages = await hub.getChapterPages(chapterPayload);

    if (!rawPages || rawPages.length === 0) {
      return res.status(404).json({ error: 'Pages not found or provider failed' });
    }

    const domainPages: DomainPage[] = rawPages.map((url, index) => ({
      index,
      url: `/api/proxy/image?url=${encodeURIComponent(url)}&provider=${primaryProvider.providerId}`,
      provider: primaryProvider.providerId
    }));

    res.json(domainPages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

export default router;
