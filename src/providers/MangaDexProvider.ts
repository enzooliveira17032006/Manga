import axios, { AxiosInstance } from 'axios';
import { Chapter, Language, MangaMetadata, MangaProvider, ProviderConfig, ProviderStatus } from './types';

export class MangaDexProvider implements MangaProvider {
  id = 'mangadex';
  name = 'MangaDex';
  config: ProviderConfig;
  private api: AxiosInstance;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.api = axios.create({
      baseURL: 'https://api.mangadex.org',
      timeout: config.rateLimit.timeout,
    });
  }

  async getProviderStatus(): Promise<ProviderStatus> {
    try {
      const res = await this.api.get('/ping');
      return res.status === 200 ? 'HEALTHY' : 'DEGRADED';
    } catch (e) {
      return 'OFFLINE';
    }
  }

  private mapLanguage(lang: string): Language {
    if (lang === 'pt-br') return 'pt-BR';
    if (lang === 'en') return 'en';
    if (lang === 'es' || lang === 'es-la') return 'es';
    if (lang === 'ja') return 'ja';
    return 'unknown';
  }

  private parseManga(item: any): MangaMetadata {
    const attrs = item.attributes;
    const title = attrs.title['en'] || attrs.title['ja-ro'] || Object.values(attrs.title)[0] || 'Unknown';
    const altTitles = attrs.altTitles.map((t: any) => Object.values(t)[0]);
    const availableLanguages = attrs.availableTranslatedLanguages ? attrs.availableTranslatedLanguages.map(this.mapLanguage) : [];
    
    // Find cover art fileName from relationships
    const coverRel = item.relationships?.find((r: any) => r.type === 'cover_art');
    const fileName = coverRel?.attributes?.fileName;
    // Proper MangaDex cover URL format
    const coverUrl = fileName ? `https://uploads.mangadex.org/covers/${item.id}/${fileName}.256.jpg` : '';

    return {
      id: item.id,
      title: title as string,
      altTitles,
      description: attrs.description['pt-br'] || attrs.description['en'] || '',
      author: '', // requires resolving relationships
      artist: '',
      coverUrl,
      genres: attrs.tags.map((t: any) => t.attributes.name.en),
      status: attrs.status,
      type: attrs.publicationDemographic || 'manga',
      availableLanguages,
      contentRating: attrs.contentRating || 'safe',
      originalLanguage: attrs.originalLanguage || 'ja'
    };
  }

  async search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<MangaMetadata[]> {
    try {
      const orderConfig: any = {};
      if (options?.sort === 'recent') {
        orderConfig.latestUploadedChapter = 'desc';
      } else {
        orderConfig.followedCount = 'desc';
      }

      
      const params: any = { 
        'availableTranslatedLanguage[]': ['pt-br'],
        'includes[]': ['cover_art'],
        hasAvailableChapters: 'true',
        order: orderConfig,
        limit: options?.limit || 30,
        offset: ((options?.page || 1) - 1) * (options?.limit || 30)
      };

      if (options?.genre) {
        // Genre to Tag mapping approximation
        const genresMap: Record<string, string> = {
          'action': '391b0423-d847-456f-aff0-8b0cfc03066b',
          'romance': '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
          'comedy': '4d32cc48-9f00-4cca-9b5a-a839f0764984',
          'fantasy': 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
          'horror': 'cdad7e68-1419-41dd-bdce-27753074a640',
          'slice of life': 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
          'succubus': '5bd0e105-4481-44ca-b6e7-7544da56b1a3', // Monster Girls / Succubus equivalent
          'isekai': 'ace04997-f6bd-436e-b261-779182147d35', // Isekai
          'harem': 'aafb99c1-7f60-43fa-bfce-801791b54c76', // Harem
          'school life': 'caaa44eb-cd40-4177-b930-79d3ef2afe87' // School Life
        };
        const tag = genresMap[options.genre.toLowerCase()];
        if (tag) {
          params['includedTags[]'] = [tag];
        }
      }
if (query) {
        params.title = query;
      }

      // Default safe unless pornhwa
      params['contentRating[]'] = ['safe', 'suggestive'];

      if (options?.category === 'manga') {
        params['originalLanguage[]'] = ['ja'];
      } else if (options?.category === 'manhwa') {
        params['originalLanguage[]'] = ['ko'];
      } else if (options?.category === 'manhua') {
        params['originalLanguage[]'] = ['zh', 'zh-hk'];
      } else if (options?.category === 'pornhwa') {
        params['originalLanguage[]'] = ['ko'];
        params['contentRating[]'] = ['erotica', 'pornographic']; // Override for adult
      }

      const res = await this.api.get(`/manga`, { params });
      return res.data.data.map((item: any) => this.parseManga(item));
    } catch (e) {
      console.error('MangaDex search error:', e);
      return [];
    }
  }

  async getManga(id: string): Promise<MangaMetadata | null> {
    try {
      const res = await this.api.get(`/manga/${id}`, {
        params: { 'includes[]': ['cover_art'] }
      });
      return this.parseManga(res.data.data);
    } catch (e) {
      return null;
    }
  }

  async getChapters(mangaId: string, languages?: Language[]): Promise<Chapter[]> {
    try {
      // By default, if we only care about pt-BR, we can filter it directly on the API.
      // But the architecture might request multiple languages.
      const langs = languages?.map(l => l === 'pt-BR' ? 'pt-br' : l) || ['pt-br'];
      const res = await this.api.get(`/manga/${mangaId}/feed`, {
        params: {
          'translatedLanguage[]': langs,
          order: { chapter: 'asc' },
          limit: 500
        }
      });
      return res.data.data.map((item: any) => ({
        id: item.id,
        mangaId: mangaId,
        chapterNumber: item.attributes.chapter || '0',
        volumeNumber: item.attributes.volume,
        title: item.attributes.title || `Chapter ${item.attributes.chapter || '0'}`,
        language: this.mapLanguage(item.attributes.translatedLanguage),
        publishAt: new Date(item.attributes.publishAt)
      }));
    } catch (e) {
      return [];
    }
  }

  async getChapterPages(chapterId: string): Promise<string[]> {
    try {
      const res = await this.api.get(`/at-home/server/${chapterId}`);
      const host = res.data.baseUrl;
      const hash = res.data.chapter.hash;
      return res.data.chapter.data.map((filename: string) => `${host}/data/${hash}/${filename}`);
    } catch (e) {
      return [];
    }
  }
}
