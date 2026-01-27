export interface GalleryPhoto {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  uploadedBy: string;
  createdAt: string;
  likes: number;
}

export interface CrosswordGame {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridData: CrosswordCell[][];
  cluesAcross: CrosswordClue[];
  cluesDown: CrosswordClue[];
  createdAt: string;
  publishedAt?: string;
  playCount: number;
  completionCount: number;
}

export interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
}
