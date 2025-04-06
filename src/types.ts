export interface DictionaryEntry {
  russian: string;
  italian: string[];
}

export interface SearchResult {
  item: DictionaryEntry;
  score: number;
}

export interface SavedPair {
  id: string;
  russian: string;
  italian: string[];
  savedAt: number;
}
