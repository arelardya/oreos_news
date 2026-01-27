export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  status?: 'draft' | 'scheduled' | 'published';
  scheduledPublishAt?: string; // ISO date string
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  imageUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
}
