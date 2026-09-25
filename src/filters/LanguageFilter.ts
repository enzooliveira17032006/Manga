import { Chapter, Language, MangaMetadata } from '../providers/types';

export class LanguageFilter {
  static readonly REQUIRED_LANGUAGE: Language = 'pt-BR';

  /**
   * Returns true if the manga metadata indicates it has PT-BR available.
   * If availableLanguages is empty or unknown, we discard it per strict rules.
   */
  static isMangaAllowed(manga: MangaMetadata): boolean {
    if (!manga.availableLanguages || manga.availableLanguages.length === 0) {
      return false; // LANGUAGE_UNKNOWN -> Descartar
    }
    return manga.availableLanguages.includes(this.REQUIRED_LANGUAGE);
  }

  /**
   * Filters a list of mangas, returning only those that have PT-BR.
   */
  static filterMangas(mangas: MangaMetadata[]): MangaMetadata[] {
    return mangas.filter(m => this.isMangaAllowed(m));
  }

  /**
   * Filters chapters, returning only those in PT-BR.
   */
  static filterChapters(chapters: Chapter[]): Chapter[] {
    return chapters.filter(c => c.language === this.REQUIRED_LANGUAGE);
  }
}
