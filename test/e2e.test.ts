import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';
import { ProviderHub } from '../src/providers/ProviderHub';
import { MangaDexProvider } from '../src/providers/MangaDexProvider';

describe('Real Integration Test - E2E MangaDex Flow', () => {
  let hub: ProviderHub;

  beforeAll(() => {
    hub = new ProviderHub();
    hub.registerProvider(new MangaDexProvider({ id: 'mangadex', enabled: true, priority: 100, rateLimit: { requestsPerSecond: 5, timeout: 5000, maxRetries: 3 }}));
  });

  it('Fluxo Completo Real: Obra -> PT-BR -> Capítulo -> Página -> Imagem', async () => {
    // 1. Search
    const searchStart = Date.now();
    const results = await hub.search('Solo Leveling');
    const searchTime = Date.now() - searchStart;
    console.log(`Search took ${searchTime}ms`);

    expect(results.length).toBeGreaterThan(0);

    // 2. Filter PT-BR and select Manga
    const manga = results.find(m => m.title.toLowerCase().includes('solo leveling'));
    expect(manga).toBeDefined();
    expect(manga.availableLanguages).toContain('pt-BR');

    // 3. Get Chapters
    const chaptersStart = Date.now();
    const chapters = await hub.getChapters(manga);
    const chaptersTime = Date.now() - chaptersStart;
    console.log(`Chapters took ${chaptersTime}ms`);

    expect(chapters.length).toBeGreaterThan(0);
    
    // 4. Select first Chapter and verify PT-BR
    const firstChapter = chapters[0];
    expect(firstChapter.language).toBe('pt-BR');

    // 5. Get Pages
    const pagesStart = Date.now();
    const pages = await hub.getChapterPages(firstChapter);
    const pagesTime = Date.now() - pagesStart;
    console.log(`Pages took ${pagesTime}ms`);

    expect(pages.length).toBeGreaterThan(0);

    // 6. Validar a primeira imagem fazendo um HEAD request (ou GET)
    const firstImageUrl = pages[0];
    expect(firstImageUrl).toMatch(/^https?:\/\//);

    const imageStart = Date.now();
    const imgRes = await axios.get(firstImageUrl, { responseType: 'arraybuffer' });
    const imageTime = Date.now() - imageStart;
    console.log(`Image fetch took ${imageTime}ms`);

    expect(imgRes.status).toBe(200);
    // Verifica se os primeiros bytes indicam que é um arquivo de imagem (ex: JPEG/PNG)
    // O header 'content-type' deve existir.
    expect(imgRes.headers['content-type']).toMatch(/image\/(jpeg|png|webp|gif)/);
  }, 20000); // 20s timeout just in case MangaDex is slow
});
