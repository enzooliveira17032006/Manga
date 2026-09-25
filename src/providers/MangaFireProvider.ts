import { Chapter, Language, MangaMetadata, MangaProvider, ProviderConfig, ProviderStatus } from './types';

/**
 * MangaFire Provider
 * Status: PENDING / NOT APPROVED FOR DIRECT USE
 * Reason: MangaFire does not have an official public API. The open-source implementations
 * available on GitHub (like shafat-96/mangafire or tamnd/mangafire-cli) rely on web scraping
 * and are frequently broken by Cloudflare protection and UI changes.
 * Implementing a raw scraper here violates the strict stability rules, so it's marked as PENDING.
 */
export class MangaFireProvider implements MangaProvider {
  id = 'mangafire';
  name = 'MangaFire';
  config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    return 'OFFLINE'; // Explicitly offline due to lack of stable open-source API server
  }

  async search(query: string): Promise<MangaMetadata[]> {
    throw new Error('MangaFire endpoints are pending stable implementation.');
  }

  async getManga(id: string): Promise<MangaMetadata | null> {
    throw new Error('MangaFire endpoints are pending stable implementation.');
  }

  async getChapters(mangaId: string, languages?: Language[]): Promise<Chapter[]> {
    throw new Error('MangaFire endpoints are pending stable implementation.');
  }

  async getChapterPages(chapterId: string): Promise<string[]> {
    throw new Error('MangaFire endpoints are pending stable implementation.');
  }
}
