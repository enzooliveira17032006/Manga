export type Language = 'pt-BR' | 'en' | 'es' | 'ja' | 'ko' | 'zh' | 'unknown';

export interface MangaMetadata {
  id: string; // provider specific ID
  title: string;
  altTitles: string[];
  description: string;
  author: string;
  artist: string;
  coverUrl: string;
  genres: string[];
  status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | 'unknown' | string;
  type: 'manga' | 'manhwa' | 'manhua' | 'webtoon' | 'comic' | 'unknown' | string;
  availableLanguages: Language[];
  contentRating?: string;
  originalLanguage?: string;
}

export interface Chapter {
  id: string; // provider specific ID
  mangaId: string;
  chapterNumber: string;
  volumeNumber?: string;
  title: string;
  language: Language;
  publishAt: Date;
  pages?: string[]; // URLs or identifiers
}

export type ProviderStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE' | 'UNKNOWN';

export interface ProviderConfig {
  id: string;
  enabled: boolean;
  priority: number;
  rateLimit: {
    requestsPerSecond: number;
    timeout: number;
    maxRetries: number;
  };
}

export interface MangaProvider {
  id: string;
  name: string;
  config: ProviderConfig;
  
  getProviderStatus(): Promise<ProviderStatus>;
  search(query: string, options?: { category?: string, sort?: 'popular' | 'recent', limit?: number, page?: number, genre?: string }): Promise<MangaMetadata[]>;
  getManga(id: string): Promise<MangaMetadata | null>;
  getChapters(mangaId: string, languages?: Language[]): Promise<Chapter[]>;
  getChapterPages(chapterId: string): Promise<string[]>;
}
