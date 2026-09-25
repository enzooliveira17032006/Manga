export interface DomainManga {
  id: string; // internal_manga_id
  title: string;
  alternativeTitles: string[];
  description: string;
  cover: string;
  authors: string[];
  artists: string[];
  status: string;
  year?: number;
  genres: string[];
  language: string[]; // ['pt-BR']
  providers: string[]; // ['mangadex', 'consumet']
}

export interface DomainChapter {
  id: string; // internal chapter representation
  mangaId: string;
  title: string;
  number: string;
  volume?: string;
  language: string;
  publishDate: Date;
  providers: string[];
  primaryProviderId: string; // the actual source of this specific returned node
  externalId: string; // external ID for the primary provider
}

export interface DomainPage {
  index: number;
  url: string; // proxied URL or direct
  provider: string;
}
