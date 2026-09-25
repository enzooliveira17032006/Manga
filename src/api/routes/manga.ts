import { Router, Request, Response } from 'express';
import { SyncService } from '../../services/SyncService';
import { MangaRepository } from '../../repositories/MangaRepository';

const router = Router();
const syncService = new SyncService();
const mangaRepo = new MangaRepository();

const discoverCache = new Map<string, { data: any, timestamp: number }>();
const DISCOVER_CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// GET /api/manga/discover
router.get('/discover', async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || '';
    const sort = (req.query.sort as 'popular' | 'recent') || 'popular';
    const limit = parseInt(req.query.limit as string) || 15;
    const page = parseInt(req.query.page as string) || 1;
    const genre = req.query.genre as string;

    const cacheKey = `${category}-${sort}-${limit}-${page}-${genre || 'all'}`;
    const cached = discoverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < DISCOVER_CACHE_TTL) {
      return res.json(cached.data);
    }

    // Use empty query to fetch from providers, but request more items
    // because many will be dropped if they lack PT-BR chapters.
    const poolLimit = limit * 2; 
    const results = await syncService.searchAndSync('', { category, sort, limit: poolLimit, page, genre });
    
    // We limit the results after dedup and PT-BR filters
    const finalData = results.slice(0, limit);
    discoverCache.set(cacheKey, { data: finalData, timestamp: Date.now() });

    res.json(finalData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/manga/search?q=...
router.get('/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || '';
    const category = (req.query.category as string) || '';
    console.log(`[DEBUG] /search called with q='${q}', category='${category}'`);
    
    if (!q && !category) {
      return res.status(400).json({ error: 'Query parameter "q" or "category" is required' });
    }

    // 1. Try DB first (cache)
    const dbResults = await mangaRepo.searchMangaByTitle(q, { category });
    if (dbResults.length > 0) {
      // Return DB results formatted
      return res.json(dbResults);
    }

    // 2. Fallback to ProviderHub sync
    const synced = await syncService.searchAndSync(q, { category });
    res.json(synced);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/manga/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const manga = await mangaRepo.getManga(req.params.id);
    if (!manga) {
      return res.status(404).json({ error: 'Manga not found in database' });
    }

    // STRICT RULE: If the manga has absolutely no PT-BR chapters in DB, we must reject it.
    // This handles edge cases where metadata existed but chapters were removed.
    const chapters = await syncService.syncChapters(manga.id);
    const hasPtBr = chapters.some(c => c.language === 'pt-BR');
    if (!hasPtBr) {
      return res.status(404).json({ error: 'Manga has no PT-BR content available' });
    }

    res.json(manga);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/manga/:id/chapters
router.get('/:id/chapters', async (req: Request, res: Response) => {
  try {
    const manga = await mangaRepo.getManga(req.params.id);
    if (!manga) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    // Sync chapters from provider hub to database
    const chapters = await syncService.syncChapters(manga.id);

    // Format output
    const domainChapters = chapters
      .filter(c => c.language === 'pt-BR')
      .map(c => ({
      id: c.id,
      mangaId: c.mangaId,
      title: c.title,
      number: c.number,
      volume: c.volume,
      language: c.language,
      publishDate: c.publishedAt,
      // Pass the first external link as primary, and the rest as alternatives
      primaryProviderId: c.providers[0]?.providerId,
      externalId: c.providers[0]?.externalId,
      providers: c.providers.map(p => p.providerId),
      alternativeProviders: c.providers.map(p => p.providerId).slice(1)
    }));

    res.json(domainChapters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

export default router;
