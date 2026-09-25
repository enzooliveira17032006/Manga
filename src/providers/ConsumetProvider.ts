import axios, { AxiosInstance } from 'axios';
import { Chapter, Language, MangaMetadata, MangaProvider, ProviderConfig, ProviderStatus } from './types';

export class ConsumetProvider implements MangaProvider {
  id = 'consumet';
  name = 'Consumet';
  config: ProviderConfig;
  private api: AxiosInstance;
  private consumetProvider = 'mangadex'; // Internal consumet source

  constructor(config: ProviderConfig) {
    this.config = config;
    this.api = axios.create({
      baseURL: process.env.CONSUMET_URL || 'https://api.consumet.org/meta/anilist-manga',
      timeout: config.rateLimit.timeout,
    });
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    try {
      // Just check if the host is up
      const baseUrl = (process.env.CONSUMET_URL || 'https://api.consumet.org');
      const res = await axios.get(baseUrl, { timeout: 2000 });
      return res.status === 200 ? 'HEALTHY' : 'DEGRADED';
    } catch (e) {
      return 'OFFLINE'; // Expected if user is not running the consumet docker locally
    }
  }

  async search(query: string, options?: any): Promise<MangaMetadata[]> {
    try {
      const res = await this.api.get(`/${query}`, { params: { provider: this.consumetProvider }});
      return res.data.results.map((item: any) => ({
        id: item.id,
        title: item.title.romaji || item.title.english || 'Unknown',
        altTitles: [],
        description: item.description || '',
        author: '',
        artist: '',
        coverUrl: item.image,
        genres: item.genres || [],
        status: item.status?.toLowerCase() || 'unknown',
        type: 'manga',
        availableLanguages: ['pt-BR', 'en'] as Language[], // Consumet doesn't always expose this cleanly
      }));
    } catch (e) {
      return [];
    }
  }

  async getManga(id: string): Promise<MangaMetadata | null> {
    try {
      const res = await this.api.get(`/info/${id}`, { params: { provider: this.consumetProvider }});
      const item = res.data;
      return {
        id: item.id,
        title: item.title.romaji || item.title.english || 'Unknown',
        altTitles: [],
        description: item.description || '',
        author: '',
        artist: '',
        coverUrl: item.image,
        genres: item.genres || [],
        status: item.status?.toLowerCase() || 'unknown',
        type: 'manga',
        availableLanguages: ['pt-BR'] // Assumed for typing, should be filtered later
      };
    } catch (e) {
      return null;
    }
  }

  async getChapters(mangaId: string, languages?: Language[]): Promise<Chapter[]> {
    try {
      const res = await this.api.get(`/info/${mangaId}`, { params: { provider: this.consumetProvider }});
      if (!res.data.chapters) return [];
      
      return res.data.chapters.map((ch: any) => ({
        id: ch.id,
        mangaId: mangaId,
        chapterNumber: ch.chapterNumber?.toString() || '',
        title: ch.title || `Chapter ${ch.chapterNumber}`,
        language: 'pt-BR', // Note: Consumet AniList/MangaDex integration often returns EN. We need real checks.
        publishAt: new Date(),
      }));
    } catch (e) {
      return [];
    }
  }

  async getChapterPages(chapterId: string): Promise<string[]> {
    try {
      const res = await this.api.get(`/read`, { params: { chapterId, provider: this.consumetProvider }});
      return res.data.map((page: any) => page.img);
    } catch (e) {
      return [];
    }
  }
}
