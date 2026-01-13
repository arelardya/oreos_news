export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  likes?: number;
}
