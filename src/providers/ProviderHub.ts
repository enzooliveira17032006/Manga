import { LanguageFilter } from '../filters/LanguageFilter';
import { MangaMatchingEngine } from '../matching/MangaMatchingEngine';
import { MetadataNormalizer } from '../normalizer/MetadataNormalizer';
import { Chapter, Language, MangaMetadata, MangaProvider, ProviderStatus } from './types';
import pLimit from 'p-limit';

export class ProviderHub {
  private providers: MangaProvider[] = [];

  // Very basic in-memory cache for demonstration
  private searchCache: Map<string, any[]> = new Map();
  private healthCache: Map<string, { status: ProviderStatus, timestamp: number }> = new Map();
  private HEALTH_CACHE_TTL = 60000; // 1 minute

  registerProvider(provider: MangaProvider) {
    this.providers.push(provider);
    this.providers.sort((a, b) => b.config.priority - a.config.priority);
  }

  async getHealthStatus(provider: MangaProvider): Promise<ProviderStatus> {
    const cached = this.healthCache.get(provider.id);
    if (cached && (Date.now() - cached.timestamp < this.HEALTH_CACHE_TTL)) {
      return cached.status;
    }
    const status = await provider.getProviderStatus();
    this.healthCache.set(provider.id, { status, timestamp: Date.now() });
    return status;
  }

  async getAllHealthStatus(): Promise<Record<string, ProviderStatus>> {
    const status: Record<string, ProviderStatus> = {};
    for (const p of this.providers) {
      if (p.config.enabled) {
        status[p.name] = await this.getHealthStatus(p);
      } else {
        status[p.name] = 'OFFLINE'; // Or 'DISABLED' in new schema
      }
    }
    return status;
  }

  async getAvailableProviders(): Promise<MangaProvider[]> {
    const available: MangaProvider[] = [];
    for (const p of this.providers) {
      if (!p.config.enabled) continue;
      const status = await this.getHealthStatus(p);
      if (status === 'HEALTHY' || status === 'DEGRADED') {
        available.push(p);
      }
    }
    return available;
  }

  async search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<any[]> {
    const cacheKey = `${query}-${options?.category || 'all'}-${options?.sort || 'popular'}-${options?.limit || 30}-${options?.page || 1}-${options?.genre || 'all'}`;
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    const availableProviders = await this.getAvailableProviders();
    const limit = pLimit(2);
    const promises = availableProviders.map(p => limit(async () => {
      try {
        const results = await p.search(query, options);
        return results.map(m => ({ manga: m, providerId: p.id }));
      } catch (e) {
        return [];
      }
    }));

    const resultsArray = await Promise.all(promises);
    const allResults = resultsArray.flat();

    const ptBrResults = allResults.filter(r => LanguageFilter.isMangaAllowed(r.manga));
    const normalized = ptBrResults.map(r => MetadataNormalizer.normalize(r.manga, r.providerId));

    const deduplicated: any[] = [];
    for (const item of normalized) {
      const existingMatch = deduplicated.find(d => MangaMatchingEngine.isMatch(d, item));
      if (existingMatch) {
        existingMatch.externalLinks = { ...existingMatch.externalLinks, ...item.externalLinks };
      } else {
        item.internal_manga_id = `manga-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        deduplicated.push(item);
      }
    }

    this.searchCache.set(cacheKey, deduplicated);
    return deduplicated;
  }

  async getChapters(internalManga: any): Promise<any[]> {
    const availableProviders = await this.getAvailableProviders();
    
    // Fallback Inteligente: filter available that have this manga
    const providerIds = Object.keys(internalManga.externalLinks);
    const candidateProviders = availableProviders
      .filter(p => providerIds.includes(p.id))
      .sort((a, b) => b.config.priority - a.config.priority);

    const allChapters: any[] = [];

    for (const p of candidateProviders) {
      try {
        const externalId = internalManga.externalLinks[p.id];
        const chapters = await p.getChapters(externalId, ['pt-BR']);
        const ptBrChapters = LanguageFilter.filterChapters(chapters);

        for (const ch of ptBrChapters) {
          const exists = allChapters.find(existing => existing.chapterNumber === ch.chapterNumber);
          if (!exists) {
            allChapters.push({ ...ch, providerId: p.id });
          } else {
            // Keep track of alternative source
            if (!exists.alternativeProviders) exists.alternativeProviders = [];
            exists.alternativeProviders.push(p.id);
          }
        }
      } catch (e) {
        console.error(`Fallback: Provider ${p.name} failed to fetch chapters.`);
        // Intelligent fallback: it continues to the next available provider
      }
    }

    return allChapters.sort((a, b) => parseFloat(a.chapterNumber) - parseFloat(b.chapterNumber));
  }

  async getChapterPages(chapter: any): Promise<string[]> {
    // Try primary provider
    const primaryProv = this.providers.find(p => p.id === chapter.providerId);
    if (primaryProv && await this.getHealthStatus(primaryProv) !== 'OFFLINE') {
      try {
        const pages = await primaryProv.getChapterPages(chapter.id);
        if (pages.length > 0) return pages;
      } catch(e) {}
    }

    // Try alternatives if primary fails
    if (chapter.alternativeProviders) {
      for (const altId of chapter.alternativeProviders) {
        const altProv = this.providers.find(p => p.id === altId);
        if (altProv && await this.getHealthStatus(altProv) !== 'OFFLINE') {
           try {
             const pages = await altProv.getChapterPages(chapter.id); // Assuming ID is identical across sources or stored differently, but this is conceptual deduplication
             if (pages.length > 0) return pages;
           } catch(e) {}
        }
      }
    }
    
    return [];
  }
}
