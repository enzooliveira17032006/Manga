import { MangaMetadata } from '../providers/types';

export class MetadataNormalizer {
  static normalizeString(str: string): string {
    return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  }

  static normalize(manga: MangaMetadata, providerId: string): any {
    return {
      internal_manga_id: '', // To be set by matching engine
      title: manga.title.trim(),
      normalizedTitle: this.normalizeString(manga.title),
      altTitles: manga.altTitles.map(t => t.trim()),
      normalizedAltTitles: manga.altTitles.map(t => this.normalizeString(t)),
      description: manga.description.trim(),
      author: manga.author.trim(),
      artist: manga.artist.trim(),
      genres: manga.genres.map(g => g.toLowerCase().trim()),
      status: manga.status,
      coverUrl: manga.coverUrl,
      type: manga.type,
      externalLinks: {
        [providerId]: manga.id
      },
      availableLanguages: manga.availableLanguages
    };
  }
}
