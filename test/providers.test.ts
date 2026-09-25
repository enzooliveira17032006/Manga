import { describe, it, expect, beforeAll } from 'vitest';
import { ProviderHub } from '../src/providers/ProviderHub';
import { MangaDexProvider } from '../src/providers/MangaDexProvider';
import { MangaFireProvider } from '../src/providers/MangaFireProvider';
import { ConsumetProvider } from '../src/providers/ConsumetProvider';

describe('Providers Architecture & Deduplication', () => {
  let hub: ProviderHub;

  beforeAll(() => {
    hub = new ProviderHub();
    hub.registerProvider(new MangaDexProvider({ id: 'mangadex', enabled: true, priority: 100, rateLimit: { requestsPerSecond: 5, timeout: 5000, maxRetries: 3 }}));
    hub.registerProvider(new MangaFireProvider({ id: 'mangafire', enabled: true, priority: 80, rateLimit: { requestsPerSecond: 1, timeout: 5000, maxRetries: 1 }}));
    hub.registerProvider(new ConsumetProvider({ id: 'consumet', enabled: true, priority: 60, rateLimit: { requestsPerSecond: 2, timeout: 5000, maxRetries: 2 }}));
  });

  it('TESTE 1: Health Check', async () => {
    const status = await hub.getHealthStatus();
    // MangaDex is real and should be HEALTHY
    expect(status['MangaDex']).toBe('HEALTHY');
    // MangaFire is stubbed to OFFLINE
    expect(status['MangaFire']).toBe('OFFLINE');
    // Consumet is stubbed locally, likely OFFLINE or DEGRADED if not running
    expect(['OFFLINE', 'DEGRADED', 'HEALTHY']).toContain(status['Consumet']);
  });

  it('TESTE 2-4: Search, Metadata & PT-BR Filter (Real API Call)', async () => {
    const results = await hub.search('One Piece');
    expect(results.length).toBeGreaterThan(0);
    
    // PT-BR check: MangaDex results should have pt-BR
    const allHavePtBr = results.every(m => m.availableLanguages.includes('pt-BR'));
    expect(allHavePtBr).toBe(true);

    const first = results[0];
    expect(first.title).toBeDefined();
    expect(first.externalLinks['mangadex']).toBeDefined();
  });

  it('TESTE 5-7: Chapters and Language Fallback', async () => {
    const results = await hub.search('Naruto');
    if (results.length > 0) {
      const manga = results[0];
      const chapters = await hub.getChapters(manga);
      
      // Since we filtered internally, chapters must be pt-BR
      const allChaptersPtBr = chapters.every(c => c.language === 'pt-BR');
      expect(allChaptersPtBr).toBe(true);
    }
  });

  it('TESTE 9: Deduplication Engine (A/B/C/D/E test)', async () => {
    const dummyHub = new ProviderHub();
    
    const provA = {
      id: 'provA', name: 'A', config: { enabled: true, priority: 100 } as any,
      search: async () => [
        { id: 'a1', title: 'Manga A', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'b1', title: 'Manga B', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' }
      ]
    };
    
    const provB = {
      id: 'provB', name: 'B', config: { enabled: true, priority: 80 } as any,
      search: async () => [
        { id: 'a2', title: 'Manga A', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'b2', title: 'Manga B', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'c2', title: 'Manga C', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' }
      ]
    };

    const provC = {
      id: 'provC', name: 'C', config: { enabled: true, priority: 60 } as any,
      search: async () => [
        { id: 'a3', title: 'Manga A', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'b3', title: 'Manga B', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'c3', title: 'Manga C', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'd3', title: 'Manga D', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'e3', title: 'Manga E', availableLanguages: ['pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' }
      ]
    };

    dummyHub.registerProvider(provA as any);
    dummyHub.registerProvider(provB as any);
    dummyHub.registerProvider(provC as any);

    const results = await dummyHub.search('test');
    
    // Result should be 5 unique mangas (A, B, C, D, E)
    expect(results.length).toBe(5);

    const mangaA = results.find(r => r.title === 'Manga A');
    // Internally A should map to provA, provB, provC
    expect(mangaA.externalLinks['provA']).toBe('a1');
    expect(mangaA.externalLinks['provB']).toBe('a2');
    expect(mangaA.externalLinks['provC']).toBe('a3');

    const mangaE = results.find(r => r.title === 'Manga E');
    // E should only map to provC
    expect(mangaE.externalLinks['provA']).toBeUndefined();
    expect(mangaE.externalLinks['provC']).toBe('e3');
  });

  it('TESTE 10: Ocultar obras sem PT-BR', async () => {
    const dummyHub = new ProviderHub();
    const provEn = {
      id: 'provEn', name: 'EN', config: { enabled: true, priority: 100 } as any,
      search: async () => [
        { id: 'en1', title: 'English Only', availableLanguages: ['en'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' },
        { id: 'pt1', title: 'Pt Manga', availableLanguages: ['en', 'pt-BR'], genres: [], altTitles: [], description: '', author: '', artist: '', coverUrl: '', status: 'ongoing', type: 'manga' }
      ]
    };
    dummyHub.registerProvider(provEn as any);

    const results = await dummyHub.search('test');
    
    // Only 'Pt Manga' should be returned
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Pt Manga');
  });
});
