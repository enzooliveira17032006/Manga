import { FrontendManga, FrontendChapter, FrontendPage } from '../types';

const API_BASE = '/api';

export class ApiClient {
  static async searchManga(query: string, category?: string): Promise<FrontendManga[]> {
    const url = new URL(`${API_BASE}/manga/search`, window.location.origin);
    if (query) url.searchParams.append('q', query);
    if (category) url.searchParams.append('category', category);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to search manga');
    const data: FrontendManga[] = await res.json();
    return data.filter(m => m.language.includes('pt-BR'));
  }

  static async discover(params: { category?: string, sort?: 'popular' | 'recent', limit?: number }): Promise<FrontendManga[]> {
    const url = new URL(`${API_BASE}/manga/discover`, window.location.origin);
    if (params.category) url.searchParams.append('category', params.category);
    if (params.sort) url.searchParams.append('sort', params.sort);
    if (params.limit) url.searchParams.append('limit', params.limit.toString());

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to discover manga');
    const data: FrontendManga[] = await res.json();
    return data;
  }

  static async getManga(id: string): Promise<FrontendManga> {
    const res = await fetch(`${API_BASE}/manga/${id}`);
    if (!res.ok) throw new Error('Manga not found');
    const manga: FrontendManga = await res.json();
    if (!manga.language.includes('pt-BR')) {
      throw new Error('Content is not available in PT-BR');
    }
    return manga;
  }

  static async getChapters(mangaId: string): Promise<FrontendChapter[]> {
    const res = await fetch(`${API_BASE}/manga/${mangaId}/chapters`);
    if (!res.ok) throw new Error('Failed to fetch chapters');
    const data: FrontendChapter[] = await res.json();
    return data.filter(ch => ch.language === 'pt-BR');
  }

  static async getChapterDetails(chapterId: string): Promise<FrontendChapter> {
    const res = await fetch(`${API_BASE}/chapter/${chapterId}`);
    if (!res.ok) throw new Error('Chapter not found');
    const data: FrontendChapter = await res.json();
    if (data.language !== 'pt-BR') {
      throw new Error('Chapter is not in PT-BR');
    }
    return data;
  }

  static async getPages(chapterId: string, externalId: string, providerId: string, altProviders: string[] = []): Promise<FrontendPage[]> {
    const alts = altProviders.join(',');
    const url = `${API_BASE}/chapter/${chapterId}/pages?externalId=${externalId}&providerId=${providerId}&altProviders=${alts}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
  }
}
