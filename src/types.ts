export interface Word {
  text: string;
  category: string;
  selected: boolean;
}

export interface Category {
  name: string;
  words: string[];
  color: string;
  solved: boolean;
  hint?: string;
}

export type GameState = {
  categories: Category[];
  words: Word[];
  selectedWords: Word[];
  attempts: number;
  maxAttempts: number;
  gameOver: boolean;
  mistakes: number;
  hintsRemaining: number;
  currentHint?: string;
  date: string;
}