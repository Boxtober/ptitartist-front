export interface Drawing {
  id: string;
  imageUrl: string;
  childName: string;
  age: number;
  date: string;
  createdAt: string; // ISO string
  rotation: number;
  description?: string | null;
  imageDescription?: string | null;
  isFavorite?: boolean;
}