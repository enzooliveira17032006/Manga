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
  
  // We need externalId and providerId.
  const externalId = req.query.externalId as string;
  const providerId = req.query.providerId as string;
  const altProviders = (req.query.altProviders as string)?.split(',') || [];

  if (!externalId || !providerId) {
    return res.status(400).json({ error: 'externalId and providerId query parameters are required' });
  }

  try {
    const dbChapter = await prisma.chapter.findUnique({ where: { id } });
    if (!dbChapter || dbChapter.language !== 'pt-BR') {
      return res.status(403).json({ error: 'Only PT-BR chapters are publicly available' });
    }

    const chapterPayload = {
      id: externalId,
      providerId: providerId,
      alternativeProviders: altProviders
    };
    const rawPages = await hub.getChapterPages(chapterPayload);

    if (!rawPages || rawPages.length === 0) {
      return res.status(404).json({ error: 'Pages not found or provider failed' });
    }

    const domainPages: DomainPage[] = rawPages.map((url, index) => ({
      index,
      url: `/api/proxy/image?url=${encodeURIComponent(url)}&provider=${providerId}`,
      provider: providerId
    }));

    res.json(domainPages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

export default router;
