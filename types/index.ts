export interface FrontendManga {
  id: string;
  title: string;
  alternativeTitles: string[];
  description: string | null;
  cover: string | null;
  authors: string[];
  artists: string[];
  status: string;
  genres: string[];
  language: string[];
  providers: string[];
}

export interface FrontendChapter {
  id: string;
  mangaId: string;
  title: string | null;
  number: string;
  volume: string | null;
  language: string;
  publishDate: string | null;
  primaryProviderId: string;
  externalId: string;
  providers: string[];
}

export interface FrontendPage {
  index: number;
  url: string;
  provider: string;
}
