import { MetadataNormalizer } from '../normalizer/MetadataNormalizer';

export class MangaMatchingEngine {
  static calculateConfidence(mangaA: any, mangaB: any): number {
    let score = 0;
    let maxScore = 0;

    // Title match
    maxScore += 50;
    if (mangaA.normalizedTitle === mangaB.normalizedTitle) {
      score += 50;
    } else if (mangaA.normalizedAltTitles.includes(mangaB.normalizedTitle) || mangaB.normalizedAltTitles.includes(mangaA.normalizedTitle)) {
      score += 45;
    }

    // Author match (if available)
    if (mangaA.author && mangaB.author) {
      maxScore += 20;
      if (MetadataNormalizer.normalizeString(mangaA.author) === MetadataNormalizer.normalizeString(mangaB.author)) {
        score += 20;
      }
    }

    // Type match
    maxScore += 10;
    if (mangaA.type === mangaB.type) {
      score += 10;
    }

    if (maxScore === 0) return 0;
    return score / maxScore;
  }

  static isMatch(mangaA: any, mangaB: any): boolean {
    const confidence = this.calculateConfidence(mangaA, mangaB);
    return confidence >= 0.80; // Minimum confidence for automatic matching
  }
}
