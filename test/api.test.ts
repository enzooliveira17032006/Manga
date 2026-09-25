import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/api/server';

describe('API Domain Layer E2E Integration', () => {
  let selectedMangaId = '';
  let selectedChapterInfo: any = {};
  let proxyImageUrl = '';

  it('1. GET /api/manga/search?q=Naruto', async () => {
    const res = await request(app).get('/api/manga/search?q=Naruto');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const firstManga = res.body[0];
    
    // Domain Model validations
    expect(firstManga.id).toBeDefined();
    expect(firstManga.title).toBeDefined();
    expect(Array.isArray(firstManga.language)).toBe(true);
    expect(firstManga.language).toContain('pt-BR');
    expect(firstManga.language).not.toContain('en'); // Filter should remove EN from domain language list

    selectedMangaId = firstManga.id;
  }, 10000);

  it('2. GET /api/manga/:id', async () => {
    const res = await request(app).get(`/api/manga/${selectedMangaId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(selectedMangaId);
    expect(res.body.title).toBeDefined();
    expect(res.body.providers).toBeDefined(); // Vaza o nome do provedor pro front saber que tem fonte, mas não expõe os dados brutos.
  });

  it('3. GET /api/manga/:id/chapters', async () => {
    const res = await request(app).get(`/api/manga/${selectedMangaId}/chapters`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const firstChapter = res.body[0];
    
    // Check Domain Chapter structure
    expect(firstChapter.id).toBeDefined();
    expect(firstChapter.language).toBe('pt-BR'); // OBRIGATÓRIO
    expect(firstChapter.number).toBeDefined();

    selectedChapterInfo = firstChapter;
  }, 15000);

  it('4. GET /api/chapter/:id/pages', async () => {
    const res = await request(app)
      .get(`/api/chapter/${selectedChapterInfo.id}/pages`)
      .query({
        externalId: selectedChapterInfo.externalId,
        providerId: selectedChapterInfo.primaryProviderId
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const firstPage = res.body[0];
    expect(firstPage.index).toBeDefined();
    expect(firstPage.url).toMatch(/^\/api\/proxy\/image/);

    proxyImageUrl = firstPage.url;
  }, 15000);

  it('5. GET /api/proxy/image - Security & Delivery Validation', async () => {
    // This will fetch the actual image through our local proxy routing
    const res = await request(app).get(proxyImageUrl);
    
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/image\/(jpeg|png|webp|gif)/);
    expect(res.headers['cache-control']).toBeDefined();
  }, 15000);

  it('6. GET /api/proxy/image - SSRF Protection Test', async () => {
    const maliciousUrl = 'http://localhost:3000/admin';
    const res = await request(app).get(`/api/proxy/image?url=${encodeURIComponent(maliciousUrl)}&provider=mangadex`);
    
    // Should be forbidden because localhost is not in the allowlist
    expect(res.status).toBe(403);
    expect(res.text).toContain('Forbidden');
  });
});
