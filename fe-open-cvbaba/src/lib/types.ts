export interface Article {
  id: string;
  title: string;
  date: string;
  type: string;
  slug: string;
  status: string;
  tags: string[];
  summary: string;
  coverImage: string;
  author: string;
  wordCount: number;
  readTime: string;
  content: string | undefined;
  viewsCount: number | undefined;
}

export interface TagFrequencyMap {
  [tag: string]: number;
}
